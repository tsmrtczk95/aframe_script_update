const modelViewer = document.getElementById("mainViewer");
const overlay = document.getElementById("arOverlay");
const exitAR = document.getElementById("exitAR");

modelViewer.addEventListener("ar-status", (event) => {
  if (event.detail.status === "session-started") {
    overlay.classList.add("visible");
  }
  if (event.detail.status === "session-ended") {
    overlay.classList.remove("visible");
  }
});

exitAR.addEventListener("click", () => {
  modelViewer.exitAR();
});
