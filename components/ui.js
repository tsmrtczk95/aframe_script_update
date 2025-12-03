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
