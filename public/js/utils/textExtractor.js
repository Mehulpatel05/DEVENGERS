export async function extractTextFromFile(file) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.txt')) {
    return await file.text();
  }

  if (fileName.endsWith('.pdf')) {
    return await extractPdfText(file);
  }

  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return await extractDocxText(file);
  }

  return await file.text();
}

async function extractPdfText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rawContent = e.target.result;
        const textDecoder = new TextDecoder('utf-8');
        const text = textDecoder.decode(new Uint8Array(rawContent));
        
        const matches = text.match(/\(([^)]+)\)\s*T[jJ]/g) || text.match(/\(([^)]+)\)/g) || [];
        const extracted = matches
          .map(m => m.replace(/^\(/, '').replace(/\)\s*T[jJ]$/, '').replace(/\)$/, ''))
          .filter(s => s.trim().length > 2)
          .join(' ');

        if (extracted && extracted.length > 50) {
          resolve(cleanExtractedText(extracted));
        } else {
          const asciiOnly = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
          const words = asciiOnly.split(/\s+/).filter(w => w.length > 2);
          resolve(cleanExtractedText(words.slice(0, 500).join(' ')));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(file);
  });
}

async function extractDocxText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rawContent = e.target.result;
        const textDecoder = new TextDecoder('utf-8');
        const text = textDecoder.decode(new Uint8Array(rawContent));
        const stripped = text.replace(/<[^>]+>/g, ' ');
        const cleaned = cleanExtractedText(stripped);
        resolve(cleaned);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read DOCX file'));
    reader.readAsArrayBuffer(file);
  });
}

function cleanExtractedText(text) {
  return text
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
}
