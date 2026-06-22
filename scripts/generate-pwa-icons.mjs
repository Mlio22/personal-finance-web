import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#121212"/>
  <circle cx="256" cy="256" r="168" fill="#4ade80"/>
  <text
    x="256"
    y="300"
    text-anchor="middle"
    font-family="system-ui, sans-serif"
    font-size="200"
    font-weight="700"
    fill="#121212"
  >M</text>
</svg>
`;

const publicDir = path.join(process.cwd(), "public");
const iconsDir = path.join(publicDir, "icons");

await mkdir(iconsDir, { recursive: true });

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  const outputPath = name.startsWith("icon-")
    ? path.join(iconsDir, name)
    : path.join(publicDir, name);

  await sharp(Buffer.from(ICON_SVG)).resize(size, size).png().toFile(outputPath);
}

await sharp(Buffer.from(ICON_SVG))
  .resize(32, 32)
  .png()
  .toFile(path.join(publicDir, "favicon.png"));

console.log("PWA icons generated.");
