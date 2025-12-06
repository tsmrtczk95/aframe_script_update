// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
  } else {
    progressBar.classList.remove('hide');
  }
};
document.querySelector('model-viewer').addEventListener('progress', onProgress);

// ADDED CODES STARTS HERE
import { loadAudioList, loadVideoList, loadArticleText, loadPDF, loadExternalURL, loadQuiz, closePanelExternal } from './components/ui.js';

// Example lists - update to match your assets
const audioList = [
  {label:'About Sago Worm', src:'./assets/audio/about_sagoworms.mp3'},
  {label:'Worm Body', src:'./assets/audio/about_body.mp3'},
  {label:'Head of Sago Worm', src:'./assets/audio/about_head.mp3'}];
const videoList = [{label:'Hunting for Sago Worm', src:'./assets/video/sago_worm_hunting.mp4'},
                   {label:'Living Sago Worm', src:'./assets/video/living_sagow.mp4'}];
/* const articleList = [
  {label:'The Sago Worm: From Pest to Prized Delicacy', src:'./assets/articles/01_sagoworm.txt'},
  {label:'Sago Worm Nutrition: A Powerhouse of Protein and Fat', src:'./assets/articles/02_nutrition.txt'},
  {label:'A Taste of the Tropics: How Sago Worms are Eaten', src:'./assets/articles/03_howsagowormeaten.txt'}]; */

document.querySelectorAll('[data-open]').forEach(btn=>{
  btn.addEventListener('click', async (ev)=>{
    const type = btn.dataset.open;
    if(type==='audio') {
      loadAudioList(audioList);
    }
    else if(type==='video') {
      loadVideoList(videoList);
      UI.openVideo('https://youtu.be/NiVm-GwH94o?si=GzHFW8nUoMVR8GvR');
    }
    else if(type==='articles') {
      // await loadArticleText(articleList);// toggle example: load text file; you can create a list UI instead
      await loadArticleText('./assets/articles/articles.txt','Sago Worms - Delicacy of Melanau People');// toggle example: load text file; you can create a list UI instead
    }
    else if(type==='quiz') {
      await loadQuiz('./assets/quiz/quiz1.json');
    }
    else if(type==='home') {
      // navigate to homepage or close panel
      // closePanelExternal();
      window.location.href = 'https://sites.google.com/poliku.edu.my/mukahxplore/3d-experiences';
    }
  });
});

// mobile drawer toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const drawer = document.getElementById('mobile-drawer');
mobileBtn.addEventListener('click', ()=> {
  const open = drawer.style.display==='flex';
  drawer.style.display = open ? 'none' : 'flex';
  drawer.setAttribute('aria-hidden', String(open));
});
/*
// hotspot example: click on hotspot open content (delegated)
document.addEventListener('click', (e)=>{
  const el = e.target.closest('.Hotspot');
  if(el){
    // customize by data-attributes on hotspot element
    const id = el.getAttribute('slot') || 'hotspot';
    // for demo, open article
    loadArticleText('./assets/articles/article1.txt', 'Hotspot: '+id);
  }
});
*/
// Accessibility: close panel with Escape
document.addEventListener('keydown',(e)=>{
  if(e.key==='Escape'){
    closePanelExternal();
  }
});
