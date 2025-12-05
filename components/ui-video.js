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
