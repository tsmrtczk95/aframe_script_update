const panel = document.getElementById("contentPanel");
const panelTitle = document.getElementById("panelTitle");
const panelBody = document.getElementById("contentBody");
const closePanel = document.getElementById("closePanel");

function openPanel(title, contentHTML) {
  panelTitle.textContent = title;
  panelBody.innerHTML = contentHTML;
  panel.classList.add("open");
  panel.setAttribute("aria-hidden","false");
}

function closePanelFn() {
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden","true");
}

closePanel.addEventListener("click", closePanelFn);

/* Content functions exported for import in script.js */
export async function loadAudioList(list) {
  // list: array of {label,src}
  const html = [];
  html.push('<h3>Audio</h3>');
  if(!list || list.length===0){
    html.push('<p>No audio files found. Place files in /assets/audio and pass a list.</p>');
  } else {
    list.forEach(a => {
      html.push(`<div class="audio-item" style="margin-bottom:12px;">
        <div style="font-weight:600;">${a.label}</div>
        <audio controls style="width:100%;"><source src="${a.src}"></audio>
      </div>`);
    });
  }
  openPanel('Audio', html.join(''));
}
/* *OLD VIDEO SCRIPT - REPLACED BY UI-VIDEO.JS
export function loadVideoList(list) {
  const html = [];
  html.push('<h3>Video</h3>');
  if(!list || list.length===0){
    html.push('<p>No videos found. Place files in /assets/video and pass a list.</p>');
  } else {
    list.forEach(v=>{
      html.push(`<div class="video-item" style="margin-bottom:12px;">
        <div style="font-weight:600;">${v.label}</div>
        <video controls style="width:100%;max-height:55vh;"><source src="${v.src}"></video>
      </div>`);
    });
  }
  openPanel('Video', html.join(''));
}
*/
window.UI = {
// ---- MAIN VIDEO LOADER ----
  openVideo(source) {
    UI._openPanel();
    const container = document.getElementById("contentContainer");

// Clear previous content
    container.innerHTML = "";

// Detect YouTube
    if (source.includes("youtube.com") || source.includes("youtu.be")) {
      container.innerHTML = `
        <div class="video-wrapper">
          <iframe class="yt-frame"
            src="${UI._convertYouTubeURL(source)}"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            allowfullscreen>
          </iframe>
        </div>`;
      return;
    }
// Detect TikTok
    if (source.includes("tiktok.com")) {
      container.innerHTML = `
        <div class="video-wrapper">
          <blockquote class="tiktok-embed" cite="${source}">
            <section>Loading TikTok…</section>
          </blockquote>
          <script async src="https://www.tiktok.com/embed.js"></script>
        </div>`;
      return;
    }
// Local video file stored in repository
    if (source.endsWith(".mp4") || source.endsWith(".webm")) {
      container.innerHTML = `
        <video controls class="local-video">
          <source src="${source}" type="video/mp4">
        </video>`;
      return;
    }
// Unknown source
    container.innerHTML = `<p>Unsupported video format.</p>`;
  },
// Convert YouTube links -> embed format
  _convertYouTubeURL(url) {
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    return url;
  },
// Opens the content drawer
  _openPanel() {
    document.getElementById("contentPanel").classList.add("visible");
  },
// PANEL CLOSER
  closePanel() {
    document.getElementById("contentPanel").classList.remove("visible");
  }
};
/* *OLD ARTICLE SCRIPT - REPLACED BY UI-ARTICLE.JS
export async function loadArticleText(path, title='Article') {
  try {
    const res = await fetch(path);
    if(!res.ok) throw new Error('Not found');
    const text = await res.text();
    openPanel(title, `<article style="white-space:pre-wrap;line-height:1.45;">${escapeHtml(text)}</article>`);
  } catch(e){
    openPanel(title, `<p>Unable to load article: ${e.message}</p>`);
  }
}
*/
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

/* ===== THIS SPACE
======== IS PURPOSELY
======== LEFT EMPTY */

export function loadPDF(path, title='Document (PDF)'){
  openPanel(title, `<iframe src="${path}" style="width:100%;height:70vh;border:0;"></iframe>`);
}

export function loadExternalURL(url, title='External'){
  // note: some sites block embedding; use caution
  openPanel(title, `<iframe src="${url}" style="width:100%;height:70vh;border:0;"></iframe>`);
}

export async function loadQuiz(jsonPath){
  try {
    const res = await fetch(jsonPath);
    if(!res.ok) throw new Error('Quiz not found');
    const quiz = await res.json();
    openPanel(quiz.title || 'Quiz', buildQuizHTML(quiz));
  } catch(e){
    openPanel('Quiz', `<p>Unable to load quiz: ${e.message}</p>`);
  }
}

function buildQuizHTML(q){
  return `
    <div class="quiz-root">
      <h3>${q.title || ''}</h3>
      ${q.questions.map((qs, i)=>`
        <div class="question" style="margin-bottom:14px;">
          <div style="font-weight:600">${i+1}. ${qs.q}</div>
          <div>${qs.options.map((opt,j)=>`
            <label style="display:block;margin-top:6px;"><input type="radio" name="q${i}" data-correct="${qs.answer===j}"> ${opt}</label>
          `).join('')}</div>
        </div>
      `).join('')}
      <button id="submitQuiz">Submit</button>
      <div id="quizResult" style="margin-top:12px;"></div>
    </div>
  `;
}

// small helper to escape text
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Handle quiz submit delegation
document.addEventListener('click', (e)=>{
  if(e.target && e.target.id==='submitQuiz'){
    const root = e.target.closest('.quiz-root');
    const inputs = root.querySelectorAll('input[type="radio"]');
    const questions = new Set(Array.from(inputs).map(i=>i.name));
    let score=0, total=questions.size;
    questions.forEach(q=>{
      const checked = root.querySelector('input[name="'+q+'"]:checked');
      if(checked && checked.dataset.correct === 'true') score++;
    });
    const resultDiv = root.querySelector('#quizResult');
    resultDiv.innerHTML = `<div><strong>Score: ${score} / ${total}</strong></div>`;
  }
});

// export close for external use
export function closePanelExternal(){ closePanelFn(); }
