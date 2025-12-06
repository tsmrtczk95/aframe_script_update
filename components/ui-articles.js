window.UI.openArticle = async function (source) {
  UI._openPanel();

  const container = document.getElementById("contentContainer");
  container.innerHTML = "<p>Loading article...</p>";

  // ---- 1. PDF files ----
  if (source.endsWith(".pdf")) {
    container.innerHTML = `
      <iframe class="pdf-frame"
        src="${UI._pdfViewerURL(source)}"
        frameborder="0">
      </iframe>
    `;
    return;
  }

  // ---- 2. TXT files (local text document) ----
  if (source.endsWith(".txt")) {
    try {
      const text = await fetch(source).then(r => r.text());
      container.innerHTML = `
        <div class="article-text">
          <pre>${UI._escapeHTML(text)}</pre>
        </div>
      `;
    } catch (err) {
      container.innerHTML = "<p>Failed to load text article.</p>";
    }
    return;
  }

  // ---- 3. External article URLs ----
  if (source.startsWith("http")) {
    container.innerHTML = `
      <iframe class="external-article-frame"
        src="${source}">
      </iframe>
    `;
    return;
  }

  container.innerHTML = "<p>Unsupported article format.</p>";
};

// Convert PDF to an embedded viewer-friendly URL
window.UI._pdfViewerURL = function (pdfPath) {
  // Using Google Docs Viewer for universal visibility
  return `https://docs.google.com/gview?embedded=1&url=${location.origin}/${pdfPath}`;
};

// Escape raw text so it doesn't break HTML
window.UI._escapeHTML = function (text) {
  return text.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
};
