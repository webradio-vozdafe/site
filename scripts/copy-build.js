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

    // 2. Ensure PWA files exist in dist and docs
    const pwaFiles = [
      '404.html',
      '.nojekyll',
      'manifest.json',
      'pwa-192x192.png',
      'pwa-512x512.png',
      'pwa-maskable-512x512.png',
      'apple-touch-icon.png',
      'favicon.ico',
      'favicon.png'
    ];

    pwaFiles.forEach((file) => {
      const publicFile = path.join(rootDir, 'public', file);
      const distFile = path.join(distDir, file);
      const docsFile = path.join(docsDir, file);
      const rootTarget = path.join(rootDir, file);

      if (fs.existsSync(publicFile)) {
        if (!fs.existsSync(distFile)) fs.copyFileSync(publicFile, distFile);
        if (!fs.existsSync(docsFile)) fs.copyFileSync(publicFile, docsFile);
        if (!fs.existsSync(rootTarget)) fs.copyFileSync(publicFile, rootTarget);
      }
    });

    console.log('✓ Build sync completed successfully with PWA assets!');
  }
} catch (err) {
  console.error('Error copying build output:', err);
}
