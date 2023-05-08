const fs = require('fs').promises;
const path = require('path');

const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const COMPONENTS_DIR = path.join(__dirname, 'components');
const STYLES_DIR = path.join(__dirname, 'styles');
const ASSETS_DIR = path.join(__dirname, 'assets');
const DIST_DIR = path.join(__dirname, 'project-dist');
const DIST_INDEX_PATH = path.join(DIST_DIR, 'index.html');
const DIST_STYLES_PATH = path.join(DIST_DIR, 'style.css');
const DIST_ASSETS_DIR = path.join(DIST_DIR, 'assets');

async function buildPage() {
  const template = await fs.readFile(TEMPLATE_PATH, 'utf-8');

  const components = await readComponents();
  const result = Object.keys(components).reduce((acc, key) => {
    return acc.replace(`{{${key}}}`, components[key]);
  }, template);

  const stylesFiles = await fs.readdir(STYLES_DIR);
  const cssFiles = stylesFiles.filter(file => file.endsWith('.css'));
  const styles = await Promise.all(
    cssFiles.map(file => fs.readFile(path.join(STYLES_DIR, file), 'utf-8'))
  );
  
  await fs.mkdir(DIST_DIR, { recursive: true });
  
  await fs.writeFile(DIST_STYLES_PATH, styles.join('\n'));

  await fs.mkdir(DIST_ASSETS_DIR, { recursive: true });
  const assets = await fs.readdir(ASSETS_DIR);
  for (const asset of assets) {
    const assetPath = path.join(ASSETS_DIR, asset);
    const targetPath = path.join(DIST_ASSETS_DIR, asset);
    const assetStats = await fs.lstat(assetPath);
    if (assetStats.isFile()) {
      await fs.copyFile(assetPath, targetPath);
    } else if (assetStats.isDirectory()) {
      await copyDirectory(assetPath, targetPath);
    }
  }
  await fs.writeFile(DIST_INDEX_PATH, result);
}

async function readComponents() {
  const components = {};
  const componentFiles = await fs.readdir(COMPONENTS_DIR);
  const componentPromises = componentFiles.map(async (file) => {
    const componentName = file.split('.')[0];
    const componentPath = path.join(COMPONENTS_DIR, file);
    const componentContent = await fs.readFile(componentPath, 'utf-8');
    components[componentName] = componentContent;
  });
  await Promise.all(componentPromises);
  return components;
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    } else if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    }
  }
}

buildPage()
  .then(() => console.log('Page built successfully.'))
  .catch(err => console.error('Error building page:', err));
