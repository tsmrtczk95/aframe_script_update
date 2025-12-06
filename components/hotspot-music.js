let currentButton = null;
let audioPlayer = null;

window.onload = () => {
  audioPlayer = document.getElementById("hotspot-audio");
};
// Toggle play/pause
function playAudio(button) { // Get all audio elements
  const audioSrc = button.getAttribute("data-audio");
  // if same hotspot clicked again => toggle
  if (currentButton === button) {
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
    return;
  }
  // If switching to another hotspot → stop previous
  if (currentButton !== null) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
  // Load new audio
  audioPlayer.src = audioSrc;
  audioPlayer.play();
  
  currentButton = button;
}
