// Build verification script
// This script checks if the production build is using the correct environment

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking build configuration...\n');

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist', 'portfolio.ui', 'browser');
if (!fs.existsSync(distPath)) {
    console.error('❌ Build folder not found at:', distPath);
    console.log('   Run: npm run build:prod');
    process.exit(1);
}

console.log('✅ Build folder exists:', distPath);

// Find main JavaScript files
const files = fs.readdirSync(distPath);
const mainFiles = files.filter(f => f.startsWith('main') && f.endsWith('.js'));

if (mainFiles.length === 0) {
    console.error('❌ No main.*.js files found in build');
    process.exit(1);
}

console.log('✅ Found main files:', mainFiles.join(', '));

// Check each main file for the API URL
let foundLocalhost = false;
let foundProduction = false;

mainFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('localhost:5283')) {
        foundLocalhost = true;
        console.log(`\n⚠️  WARNING: Found localhost:5283 in ${file}`);
    }
    
    if (content.includes('m-protfolio.runasp.net')) {
        foundProduction = true;
        console.log(`\n✅ Found production URL in ${file}`);
    }
});

console.log('\n📊 Results:');
console.log('   Production URL (m-protfolio.runasp.net):', foundProduction ? '✅ Found' : '❌ Not found');
console.log('   Development URL (localhost:5283):', foundLocalhost ? '⚠️  Found (BAD)' : '✅ Not found (GOOD)');

if (foundProduction && !foundLocalhost) {
    console.log('\n✅ Build is correctly configured for production!');
    process.exit(0);
} else if (foundLocalhost) {
    console.log('\n❌ Build is using development environment!');
    console.log('   This means the production configuration is not being applied.');
    console.log('\n   Possible fixes:');
    console.log('   1. Run: npm run build:prod');
    console.log('   2. Check angular.json fileReplacements configuration');
    console.log('   3. Verify environment.prod.ts exists and has correct URL');
    process.exit(1);
} else {
    console.log('\n⚠️  Could not verify API URL in build files');
    console.log('   The files might be minified or the URL might be constructed dynamically');
    process.exit(0);
}
