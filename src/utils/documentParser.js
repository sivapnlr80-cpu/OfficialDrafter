import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker locally using Vite's asset loader.
// This resolves same-origin worker restrictions and works offline without third-party CDN dependencies.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extracts raw text from a PDF file.
 * @param {File} file 
 * @returns {Promise<{text: string, pages: number, type: string, name: string}>}
 */
export const parsePDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // Join items with spaces, preserving layout as much as possible
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return {
      text: fullText.trim(),
      pages: pdf.numPages,
      type: 'pdf',
      name: file.name
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Ensure it is a valid document.');
  }
};

/**
 * Extracts raw text from a DOCX file.
 * @param {File} file 
 * @returns {Promise<{text: string, pages: number, type: string, name: string}>}
 */
export const parseDOCX = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return {
      text: result.value.trim(),
      pages: 1, // Mammoth does not provide page count
      type: 'docx',
      name: file.name
    };
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse Word document. Ensure it is a valid DOCX file.');
  }
};

/**
 * Universal document parser wrapper.
 * @param {File} file 
 * @returns {Promise<{text: string, pages: number, type: string, name: string}>}
 */
export const parseDocument = async (file) => {
  if (file.name.endsWith('.pdf')) {
    return await parsePDF(file);
  } else if (file.name.endsWith('.docx')) {
    return await parseDOCX(file);
  } else {
    throw new Error('Unsupported file format. Please upload .pdf or .docx files.');
  }
};
