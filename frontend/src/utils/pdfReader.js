// src/utils/pdfReader.js

let pdfJsInitialized = false;

const initializePdfJs = () => {
  return new Promise((resolve, reject) => {
    // If PDF.js already loaded
    if (pdfJsInitialized && window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }

    // If PDF.js already available globally
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      pdfJsInitialized = true;
      resolve(window.pdfjsLib);
      return;
    }

    // Otherwise, load script
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;

    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        pdfJsInitialized = true;
        resolve(window.pdfjsLib);
      } else {
        reject(new Error("PDF.js failed to load"));
      }
    };

    script.onerror = () => reject(new Error("Failed to load PDF.js"));
    document.head.appendChild(script);
  });
};

// ⚡ MAIN FUNCTION TO EXTRACT TEXT FROM PDF
export const extractTextFromPDF = async (file) => {
  try {
    const pdfjsLib = await initializePdfJs();
    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
      cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
      cMapPacked: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map(item => item.str || "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (pageText.length > 0) fullText += pageText + "\n\n";
    }

    const finalText = fullText.trim();

    console.log(finalText);

    if (finalText.length === 0) {
      throw new Error("No text found (PDF might be image-based).");
    }

    return finalText;
  } catch (err) {
    throw new Error("PDF extraction failed: " + err.message);
  }
};
