#!/usr/bin/env node

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouseAudit() {
  console.log('🚀 Starting Lighthouse Performance Audit...\n');

  // URLs to audit
  const urls = [
    'http://localhost:4200',
    'http://localhost:4200/projects',
    'http://localhost:4200/blog',
    'http://localhost:4200/contact'
  ];

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const results = [];

  for (const url of urls) {
    console.log(`🔍 Auditing: ${url}`);
    
    try {
      const runnerResult = await lighthouse(url, options);
      
      // Extract key metrics
      const { lhr } = runnerResult;
      const metrics = {
        url,
        performance: lhr.categories.performance.score * 100,
        accessibility: lhr.categories.accessibility.score * 100,
        bestPractices: lhr.categories['best-practices'].score * 100,
        seo: lhr.categories.seo.score * 100,
        fcp: lhr.audits['first-contentful-paint'].numericValue,
        lcp: lhr.audits['largest-contentful-paint'].numericValue,
        cls: lhr.audits['cumulative-layout-shift'].numericValue,
        fid: lhr.audits['max-potential-fid'] ? lhr.audits['max-potential-fid'].numericValue : null,
        speedIndex: lhr.audits['speed-index'].numericValue,
        tti: lhr.audits['interactive'].numericValue
      };

      results.push(metrics);

      // Save individual report
      const reportPath = `lighthouse-${url.split('/').pop() || 'home'}.html`;
      fs.writeFileSync(reportPath, runnerResult.report);
      console.log(`✅ Report saved: ${reportPath}`);

    } catch (error) {
      console.error(`❌ Error auditing ${url}:`, error.message);
    }
  }

  await chrome.kill();

  // Generate summary report
  generateSummaryReport(results);
  
  console.log('\n🎉 Lighthouse audit complete!');
}

function generateSummaryReport(results) {
  console.log('\n📊 Performance Summary:');
  console.log('=' .repeat(80));
  
  results.forEach(result => {
    const urlName = result.url.split('/').pop() || 'Home';
    console.log(`\n🔗 ${urlName.toUpperCase()}`);
    console.log(`   Performance: ${getScoreColor(result.performance)}${result.performance.toFixed(0)}/100\x1b[0m`);
    console.log(`   Accessibility: ${getScoreColor(result.accessibility)}${result.accessibility.toFixed(0)}/100\x1b[0m`);
    console.log(`   Best Practices: ${getScoreColor(result.bestPractices)}${result.bestPractices.toFixed(0)}/100\x1b[0m`);
    console.log(`   SEO: ${getScoreColor(result.seo)}${result.seo.toFixed(0)}/100\x1b[0m`);
    
    console.log(`   Core Web Vitals:`);
    console.log(`     FCP: ${getMetricColor('fcp', result.fcp)}${(result.fcp / 1000).toFixed(2)}s\x1b[0m`);
    console.log(`     LCP: ${getMetricColor('lcp', result.lcp)}${(result.lcp / 1000).toFixed(2)}s\x1b[0m`);
    console.log(`     CLS: ${getMetricColor('cls', result.cls)}${result.cls.toFixed(3)}\x1b[0m`);
    if (result.fid) {
      console.log(`     FID: ${getMetricColor('fid', result.fid)}${result.fid.toFixed(0)}ms\x1b[0m`);
    }
  });

  // Generate recommendations
  console.log('\n💡 Performance Recommendations:');
  console.log('=' .repeat(80));
  
  const avgPerformance = results.reduce((sum, r) => sum + r.performance, 0) / results.length;
  const avgFCP = results.reduce((sum, r) => sum + r.fcp, 0) / results.length;
  const avgLCP = results.reduce((sum, r) => sum + r.lcp, 0) / results.length;
  
  if (avgPerformance < 90) {
    console.log('⚠️  Overall performance needs improvement:');
    console.log('   - Optimize images (WebP format, lazy loading)');
    console.log('   - Minimize JavaScript bundles');
    console.log('   - Enable compression (gzip/brotli)');
    console.log('   - Use CDN for static assets');
  }
  
  if (avgFCP > 2500) {
    console.log('⚠️  First Contentful Paint is slow:');
    console.log('   - Inline critical CSS');
    console.log('   - Preload key resources');
    console.log('   - Optimize server response time');
  }
  
  if (avgLCP > 4000) {
    console.log('⚠️  Largest Contentful Paint needs optimization:');
    console.log('   - Optimize largest image/element');
    console.log('   - Use responsive images');
    console.log('   - Preload LCP resource');
  }

  // Save JSON summary
  const summaryPath = 'lighthouse-summary.json';
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Summary saved: ${summaryPath}`);
}

function getScoreColor(score) {
  if (score >= 90) return '\x1b[32m'; // Green
  if (score >= 50) return '\x1b[33m'; // Yellow
  return '\x1b[31m'; // Red
}

function getMetricColor(metric, value) {
  switch (metric) {
    case 'fcp':
      return value > 2500 ? '\x1b[31m' : value > 1800 ? '\x1b[33m' : '\x1b[32m';
    case 'lcp':
      return value > 4000 ? '\x1b[31m' : value > 2500 ? '\x1b[33m' : '\x1b[32m';
    case 'cls':
      return value > 0.25 ? '\x1b[31m' : value > 0.1 ? '\x1b[33m' : '\x1b[32m';
    case 'fid':
      return value > 300 ? '\x1b[31m' : value > 100 ? '\x1b[33m' : '\x1b[32m';
    default:
      return '\x1b[0m';
  }
}

// Run the audit
runLighthouseAudit().catch(console.error);