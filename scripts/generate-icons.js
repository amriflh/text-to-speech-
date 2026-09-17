import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
  // 1. Standard 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/pwa-192x192.png'));

  // 2. Standard 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/pwa-512x512.png'));

  // 3. Apple Touch Icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));

  // 4. Favicon 64x64
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.resolve('public/favicon.png'));

  // 5. Maskable Icon 512x512 with 15% safe padding
  // Maskable icons on Android need safe-zone padding so corners aren't clipped
  const innerSize = Math.floor(512 * 0.76); // ~389px inner icon
  const innerBuffer = await sharp(svgBuffer).resize(innerSize, innerSize).toBuffer();
  
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 30, g: 64, b: 175, alpha: 1 }, // deep blue matching theme
    },
  })
    .composite([
      {
        input: innerBuffer,
        gravity: 'centre',
      },
    ])
    .png()
    .toFile(path.resolve('public/pwa-maskable-512x512.png'));

  console.log('All PWA and Android app icons generated successfully!');
}

generateIcons().catch((err) => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
