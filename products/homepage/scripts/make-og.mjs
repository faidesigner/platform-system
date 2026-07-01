// 일회성 OG 이미지 생성기: bakery 원본을 1200×630 center-cover 크롭 → JPEG.
// 재실행 가능(idempotent). 원본/출력 경로가 바뀌면 아래 상수만 수정.
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, "../public/images/customers/01-bakery-mannamil.jpg");
const OUT = resolve(__dirname, "../public/images/og/og-default.jpg");
const WIDTH = 1200;
const HEIGHT = 630;

await sharp(SRC)
  .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`OG generated: ${OUT} (${meta.width}x${meta.height})`);
