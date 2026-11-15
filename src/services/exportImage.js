import html2canvas from 'html2canvas';

function buildExportFilename(roadmap, ext) {
  const sanitizedTitle = (roadmap?.title || 'Roadmap')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 40);
  return `Jalur_${sanitizedTitle}_A3.${ext}`;
}

/**
 * Shared internal canvas builder for A3 Landscape (2200x1556+ dynamic) Ultra-HD printable export
 */
async function renderRoadmapCanvas(containerElement, scale = 3.5, backgroundColor = '#071B14') {
  if (!containerElement) {
    throw new Error('Elemen kanvas ekspor tidak ditemukan.');
  }

  await document.fonts?.ready;

  const requestedScale = Math.max(2.5, Number(scale) || 3.5);
  const targetWidth = 2200;
  const targetHeight = Math.max(1556, Math.ceil(containerElement.scrollHeight || 1556));

  const runWithScale = (captureScale) =>
    html2canvas(containerElement, {
      scale: captureScale,
      useCORS: true,
      allowTaint: true,
      backgroundColor,
      logging: false,
      width: targetWidth,
      height: targetHeight,
      windowWidth: targetWidth,
      windowHeight: targetHeight,
      onclone: async (clonedDoc) => {
        const normalizeStyle = clonedDoc.createElement('style');
        normalizeStyle.textContent = `
          img {
            display: inline !important;
            vertical-align: baseline !important;
          }
          *, .font-display {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
            letter-spacing: 0px !important;
            word-spacing: normal !important;
            font-kerning: normal !important;
            transition: none !important;
            animation: none !important;
          }
        `;
        clonedDoc.head.appendChild(normalizeStyle);

        const clonedCanvas = clonedDoc.querySelector('[data-export-canvas="true"]');
        if (clonedCanvas) {
          Array.from(clonedDoc.body.children).forEach((el) => {
            if (el.tagName !== 'STYLE') {
              el.remove();
            }
          });
          clonedDoc.body.appendChild(clonedCanvas);

          const rootCss = `margin: 0; padding: 0; width: ${targetWidth}px; min-height: ${targetHeight}px; overflow: visible; background: ${backgroundColor};`;
          clonedDoc.documentElement.style.cssText = rootCss;
          clonedDoc.body.style.cssText = rootCss;

          clonedCanvas.style.transform = 'none';
          clonedCanvas.style.width = `${targetWidth}px`;
          clonedCanvas.style.minHeight = '1556px';
          clonedCanvas.style.height = 'auto';
          clonedCanvas.style.margin = '0';
          clonedCanvas.style.position = 'relative';

          const clonedView = clonedDoc.defaultView || window;
          await new Promise((resolve) =>
            clonedView.requestAnimationFrame(() => clonedView.requestAnimationFrame(resolve))
          );

          const settledHeight = Math.max(targetHeight, Math.ceil(clonedCanvas.scrollHeight || targetHeight));
          clonedCanvas.style.height = `${settledHeight}px`;
        }
      }
    });

  try {
    return await runWithScale(requestedScale);
  } catch (err) {
    if (requestedScale > 2.5) {
      return await runWithScale(2.5);
    }
    throw err;
  }
}

/**
 * Generates and downloads an Ultra-HD A3 printable PNG image of the roadmap
 */
export async function downloadRoadmapImage(roadmap, containerElement, scale = 3.5, backgroundColor = '#071B14') {
  const canvas = await renderRoadmapCanvas(containerElement, scale, backgroundColor);
  const filename = buildExportFilename(roadmap, 'png');

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();

  return filename;
}

/**
 * Generates and downloads a print-ready A3 Landscape PDF containing the Ultra-HD rendered roadmap
 */
export async function downloadRoadmapPDF(roadmap, containerElement, scale = 3.5, backgroundColor = '#071B14') {
  const canvas = await renderRoadmapCanvas(containerElement, scale, backgroundColor);

  const pdfCanvas = document.createElement('canvas');
  pdfCanvas.width = canvas.width;
  pdfCanvas.height = canvas.height;
  const pdfCtx = pdfCanvas.getContext('2d');
  pdfCtx.fillStyle = backgroundColor;
  pdfCtx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
  pdfCtx.drawImage(canvas, 0, 0);

  const jpegDataUrl = pdfCanvas.toDataURL('image/jpeg', 0.98);
  const base64Data = jpegDataUrl.split(',')[1] || '';
  const binaryStr = atob(base64Data);
  const imgBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    imgBytes[i] = binaryStr.charCodeAt(i);
  }

  // Standard ISO A3 Landscape width = 420mm = 1190.55pt; height scales proportionally
  const pagePtW = 1190.55;
  const pagePtH = Number((1190.55 * (pdfCanvas.height / pdfCanvas.width)).toFixed(2));
  const contentStr = `q\n${pagePtW} 0 0 ${pagePtH} 0 0 cm\n/Im0 Do\nQ\n`;

  const encoder = new TextEncoder();
  const chunks = [];
  let byteOffset = 0;
  const pushBytes = (bytes) => {
    chunks.push(bytes);
    byteOffset += bytes.length;
  };
  const pushText = (str) => pushBytes(encoder.encode(str));

  // PDF Header + binary marker
  pushBytes(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  const objOffsets = [0];
  const recordObj = (fn) => {
    objOffsets.push(byteOffset);
    fn();
  };

  recordObj(() => pushText('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'));
  recordObj(() => pushText('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n'));
  recordObj(() =>
    pushText(
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pagePtW} ${pagePtH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`
    )
  );
  recordObj(() => {
    pushText(
      `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${pdfCanvas.width} /Height ${pdfCanvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`
    );
    pushBytes(imgBytes);
    pushText('\nendstream\nendobj\n');
  });
  recordObj(() => {
    const contentBytes = encoder.encode(contentStr);
    pushText(`5 0 obj\n<< /Length ${contentBytes.length} >>\nstream\n`);
    pushBytes(contentBytes);
    pushText('endstream\nendobj\n');
  });

  const xrefOffset = byteOffset;
  let xref = `xref\n0 ${objOffsets.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objOffsets.length; i++) {
    xref += `${String(objOffsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pushText(xref);
  pushText(`trailer\n<< /Size ${objOffsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  const blob = new Blob(chunks, { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const filename = buildExportFilename(roadmap, 'pdf');

  const link = document.createElement('a');
  link.download = filename;
  link.href = blobUrl;
  link.click();

  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  return filename;
}

/**
 * Renders A3 printable roadmap poster and copies PNG directly to clipboard
 */
export async function copyRoadmapImageToClipboard(containerElement, backgroundColor = '#071B14') {
  if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
    throw new Error('Browser Anda belum mendukung penyalinan gambar langsung ke clipboard.');
  }

  const canvas = await renderRoadmapCanvas(containerElement, 2.5, backgroundColor);
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Gagal mengonversi kanvas ke blob PNG.'));
    }, 'image/png');
  });

  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  return true;
}

/**
 * Format markdown for export
 */
export function formatRoadmapAsMarkdown(roadmap) {
  let md = `# ${roadmap.title || 'Roadmap'}\n\n`;
  if (roadmap.summary) {
    md += `> ${roadmap.summary}\n\n`;
  }
  md += `**Tujuan:** ${roadmap.goal || '-'}\n`;
  md += `**Garis Finish:** ${roadmap.finishLine || '-'}\n`;
  md += `**Terakhir Diperbarui:** ${new Date(roadmap.updatedAt || Date.now()).toLocaleDateString('id-ID')}\n\n`;
  md += `---\n\n`;

  (roadmap.steps || []).forEach((step, idx) => {
    md += `## Langkah ${idx + 1}: ${step.title} (${step.duration || '-'})\n`;
    if (step.description) {
      md += `${step.description}\n\n`;
    }
    (step.tasks || []).forEach(task => {
      md += `- [${task.completed ? 'x' : ' '}] ${task.text}\n`;
    });
    md += `\n`;
  });

  md += `---\n*Dibuat menggunakan Jalur*`;
  return md;
}
