/**
 * Run: node tools/extract-pdf-images.mjs
 * Requires: npm install pdfjs-dist (from project root)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const pdfPath = path.join(root, 'images', 'PDA_portfolio.pdf');
const outDir = path.join(root, 'images');

async function main() {
  let pdfjsLib;
  try {
    pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  } catch {
    console.error('Install pdfjs-dist: npm install pdfjs-dist');
    process.exit(1);
  }
  if (!fs.existsSync(pdfPath)) {
    console.error('Missing', pdfPath);
    process.exit(1);
  }
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data, verbosity: 0 }).promise;
  let n = 0;
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const ops = await page.getOperatorList();
    const objs = ops.fnArray
      .map((fn, i) => (fn === pdfjsLib.OPS.paintImageXObject ? ops.argsArray[i][0] : null))
      .filter(Boolean);
    for (const name of [...new Set(objs)]) {
      try {
        const img = await page.objs.get(name);
        if (!img?.data) continue;
        n++;
        const ext = img.kind === 2 ? 'jpg' : 'png';
        const file = `portfolio-p${String(p).padStart(2, '0')}-${String(n).padStart(2, '0')}.${ext}`;
        fs.writeFileSync(path.join(outDir, file), img.data);
        console.log('wrote', file);
      } catch {
        /* skip */
      }
    }
  }
  console.log('done, images:', n);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
