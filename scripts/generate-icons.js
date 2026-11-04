import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');
const docsDir = path.resolve(rootDir, 'docs');

async function generate() {
  const source = path.resolve(rootDir, 'images/emblema_dourado_voz-da-fe.png');
  if (!fs.existsSync(source)) {
    console.error('Source does not exist at:', source);
    return;
  }

  // Ensure directories exist
  [publicDir, docsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const targets = [publicDir, docsDir];

  for (const dir of targets) {
    // 1. 192x192 any
    await sharp(source)
      .resize(192, 192, { fit: 'contain', background: { r: 16, g: 43, b: 40, alpha: 1 } })
      .png()
      .toFile(path.resolve(dir, 'pwa-192x192.png'));

    // 2. 512x512 any
    await sharp(source)
      .resize(512, 512, { fit: 'contain', background: { r: 16, g: 43, b: 40, alpha: 1 } })
      .png()
      .toFile(path.resolve(dir, 'pwa-512x512.png'));

    // 3. 512x512 maskable (safe-zone padding 15% on brand background)
    const innerSize = Math.round(512 * 0.75); // 384px inside 512px
    const innerBuf = await sharp(source)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 16, g: 43, b: 40, alpha: 0 } })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: { r: 16, g: 43, b: 40, alpha: 1 }
      }
    })
      .composite([{ input: innerBuf, gravity: 'center' }])
      .png()
      .toFile(path.resolve(dir, 'pwa-maskable-512x512.png'));

    // 4. apple-touch-icon.png (180x180)
    await sharp(source)
      .resize(180, 180, { fit: 'contain', background: { r: 16, g: 43, b: 40, alpha: 1 } })
      .png()
      .toFile(path.resolve(dir, 'apple-touch-icon.png'));

    // 5. favicon.ico
    await sharp(source)
      .resize(64, 64, { fit: 'contain', background: { r: 16, g: 43, b: 40, alpha: 0 } })
      .png()
      .toFile(path.resolve(dir, 'favicon.ico'));

    // 6. favicon.png
    await sharp(source)
      .resize(32, 32, { fit: 'contain', background: { r: 16, g: 43, b: 40, alpha: 0 } })
      .png()
      .toFile(path.resolve(dir, 'favicon.png'));
  }

  console.log('✓ All PWA and iOS icons successfully generated and copied to public/ and docs/');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
