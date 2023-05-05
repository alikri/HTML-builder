
const fs = require('fs/promises');
const path = require('path');

const srcDir = path.join(__dirname, 'styles');
const destFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundleCSS() {
  try {
    const files = await fs.readdir(srcDir);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    let cssContent = '';

    for (const file of cssFiles) {
      const filePath = path.join(srcDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      cssContent += fileContent;
    }

    await fs.writeFile(destFile, cssContent);
    console.log('CSS bundle created successfully!');
  } catch (err) {
    console.error('Error bundling CSS:', err);
  }
}

bundleCSS();
