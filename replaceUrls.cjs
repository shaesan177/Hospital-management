const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'src');

function traverseAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseAndReplace(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const replacement = '`${import.meta.env.VITE_API_URL || \'http://localhost:5000\'}$1`';

      content = content.replace(/`http:\/\/localhost:5000(.*?)`/g, replacement);
      content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, replacement);
      content = content.replace(/"http:\/\/localhost:5000(.*?)"/g, replacement);
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

traverseAndReplace(srcDir);
console.log('Replaced all API URLs in frontend.');
