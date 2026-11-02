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
    // 1. Copy dist/ to docs/ for GitHub Pages /docs folder option
    copyRecursiveSync(distDir, docsDir);
    console.log('✓ Successfully copied dist/ to docs/ for GitHub Pages /docs folder deployment');

    // 2. Copy 404.html, .nojekyll, manifest.json to root if missing (without touching root index.html)
    ['404.html', '.nojekyll'].forEach((file) => {
      const srcFile = path.join(distDir, file);
      const destFile = path.join(rootDir, file);
      if (fs.existsSync(srcFile) && !fs.existsSync(destFile)) {
        fs.copyFileSync(srcFile, destFile);
      }
    });

    console.log('✓ Build sync completed successfully!');
  }
} catch (err) {
  console.error('Error copying build output:', err);
}
