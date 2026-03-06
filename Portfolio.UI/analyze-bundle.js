#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting Bundle Analysis...\n');

// Build with stats
console.log('📦 Building application with stats...');
try {
  execSync('ng build --stats-json --configuration production', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Check if stats file exists
const statsPath = path.join(__dirname, 'dist', 'portfolio.ui', 'stats.json');
if (!fs.existsSync(statsPath)) {
  console.error('❌ Stats file not found at:', statsPath);
  process.exit(1);
}

// Analyze bundle size
console.log('\n📊 Analyzing bundle size...');
try {
  execSync(`npx webpack-bundle-analyzer ${statsPath} --mode static --report bundle-report.html --no-open`, { stdio: 'inherit' });
  console.log('✅ Bundle analysis report generated: bundle-report.html');
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
}

// Source map analysis
console.log('\n🗺️  Analyzing source maps...');
try {
  execSync('npx source-map-explorer dist/portfolio.ui/**/*.js --html source-map-report.html', { stdio: 'inherit' });
  console.log('✅ Source map analysis report generated: source-map-report.html');
} catch (error) {
  console.error('❌ Source map analysis failed:', error.message);
}

// Bundle size analysis
const distPath = path.join(__dirname, 'dist', 'portfolio.ui');
if (fs.existsSync(distPath)) {
  console.log('\n📏 Bundle Size Analysis:');
  
  const files = fs.readdirSync(distPath).filter(file => file.endsWith('.js'));
  let totalSize = 0;
  
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;
    
    let sizeColor = '\x1b[32m'; // Green
    if (stats.size > 500 * 1024) sizeColor = '\x1b[31m'; // Red
    else if (stats.size > 250 * 1024) sizeColor = '\x1b[33m'; // Yellow
    
    console.log(`  ${sizeColor}${file}: ${sizeKB} KB\x1b[0m`);
  });
  
  const totalSizeKB = (totalSize / 1024).toFixed(2);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  console.log(`\n📊 Total JavaScript Size: ${totalSizeKB} KB (${totalSizeMB} MB)`);
  
  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  
  if (totalSize > 2 * 1024 * 1024) {
    console.log('  ⚠️  Bundle size is large (>2MB). Consider:');
    console.log('     - Lazy loading routes');
    console.log('     - Tree shaking unused code');
    console.log('     - Code splitting');
  }
  
  if (files.some(file => fs.statSync(path.join(distPath, file)).size > 500 * 1024)) {
    console.log('  ⚠️  Large individual chunks detected. Consider:');
    console.log('     - Dynamic imports');
    console.log('     - Vendor chunk optimization');
  }
  
  console.log('  ✅ Use lazy loading for routes');
  console.log('  ✅ Enable gzip compression on server');
  console.log('  ✅ Implement service worker for caching');
}

console.log('\n🎉 Bundle analysis complete!');
console.log('📄 Reports generated:');
console.log('   - bundle-report.html (Webpack Bundle Analyzer)');
console.log('   - source-map-report.html (Source Map Explorer)');