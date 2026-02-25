#!/usr/bin/env node

/**
 * Pre-deployment checker for Netlify
 * Run this before deploying to catch common issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking deployment readiness...\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: Environment file exists
console.log('1️⃣ Checking production environment file...');
const envProdPath = path.join(__dirname, 'src/environments/environment.prod.ts');
if (fs.existsSync(envProdPath)) {
    const envContent = fs.readFileSync(envProdPath, 'utf8');
    if (envContent.includes('YOUR_BACKEND_API_URL')) {
        console.log('   ⚠️  WARNING: environment.prod.ts still contains placeholder URL');
        console.log('   → Update YOUR_BACKEND_API_URL with your actual backend URL\n');
        hasWarnings = true;
    } else {
        console.log('   ✅ Production environment configured\n');
    }
} else {
    console.log('   ❌ ERROR: environment.prod.ts not found\n');
    hasErrors = true;
}

// Check 2: netlify.toml exists
console.log('2️⃣ Checking Netlify configuration...');
const netlifyTomlPath = path.join(__dirname, 'netlify.toml');
if (fs.existsSync(netlifyTomlPath)) {
    console.log('   ✅ netlify.toml found\n');
} else {
    console.log('   ❌ ERROR: netlify.toml not found\n');
    hasErrors = true;
}

// Check 3: package.json has build script
console.log('3️⃣ Checking build configuration...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.scripts && packageJson.scripts.build) {
        console.log('   ✅ Build script configured\n');
    } else {
        console.log('   ❌ ERROR: No build script in package.json\n');
        hasErrors = true;
    }
} else {
    console.log('   ❌ ERROR: package.json not found\n');
    hasErrors = true;
}

// Check 4: node_modules exists
console.log('4️⃣ Checking dependencies...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
    console.log('   ✅ Dependencies installed\n');
} else {
    console.log('   ⚠️  WARNING: node_modules not found');
    console.log('   → Run: npm install\n');
    hasWarnings = true;
}

// Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (hasErrors) {
    console.log('❌ DEPLOYMENT NOT READY - Fix errors above');
    process.exit(1);
} else if (hasWarnings) {
    console.log('⚠️  DEPLOYMENT READY WITH WARNINGS');
    console.log('   Review warnings above before deploying');
    process.exit(0);
} else {
    console.log('✅ DEPLOYMENT READY!');
    console.log('\nNext steps:');
    console.log('1. git add .');
    console.log('2. git commit -m "Configure for Netlify"');
    console.log('3. git push origin main');
    console.log('4. Deploy on Netlify dashboard');
    process.exit(0);
}
