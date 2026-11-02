import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const docsDir = path.resolve(rootDir, 'docs');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

try {
  if (fs.existsSync(distDir)) {
    // 1. Copy dist to docs/
    copyRecursiveSync(distDir, docsDir);
    console.log('✓ Successfully copied dist/ to docs/ for GitHub Pages /docs folder option');

    // 2. Copy dist/assets to root assets/
    const distAssetsDir = path.join(distDir, 'assets');
    const rootAssetsDir = path.join(rootDir, 'assets');
    if (fs.existsSync(distAssetsDir)) {
      copyRecursiveSync(distAssetsDir, rootAssetsDir);
      console.log('✓ Successfully copied dist/assets/ to root assets/ for GitHub Pages root option');
    }

    // 3. Copy dist/index.html to root index.html
    const distIndexHtml = path.join(distDir, 'index.html');
    const rootIndexHtml = path.join(rootDir, 'index.html');
    if (fs.existsSync(distIndexHtml)) {
      fs.copyFileSync(distIndexHtml, rootIndexHtml);
      console.log('✓ Successfully copied dist/index.html to root index.html for direct static hosting');
    }

    // 4. Copy 404.html & .nojekyll
    ['404.html', '.nojekyll', 'manifest.json'].forEach((file) => {
      const srcFile = path.join(distDir, file);
      const destFile = path.join(rootDir, file);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
      }
    });
    console.log('✓ Build sync completed successfully!');
  }
} catch (err) {
  console.error('Error copying build output:', err);
}
