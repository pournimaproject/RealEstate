const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build the client
console.log('Building client...');
execSync('vite build', { stdio: 'inherit' });

// Create the dist/server directory
const serverDistDir = path.join(__dirname, 'dist', 'server');
if (!fs.existsSync(serverDistDir)) {
  fs.mkdirSync(serverDistDir, { recursive: true });
}

// Compile the server TypeScript files
console.log('Compiling server TypeScript...');
execSync('tsc --project tsconfig.server.json', { stdio: 'inherit' });

console.log('Build completed successfully!');