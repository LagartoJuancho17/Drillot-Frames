import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    duration: 1.2, // Ajusta la duración del desplazamiento suave
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Efecto de easing
    smooth: true, // Activa el desplazamiento suave
  });

  const progressBar = document.createElement("div");
  progressBar.style.position = "fixed";
  progressBar.style.top = 0;
  progressBar.style.left = 0;
  progressBar.style.height = "4px";
  progressBar.style.backgroundColor = "#3498db";
  progressBar.style.zIndex = 9999;
  progressBar.style.width = "0%";
  document.body.appendChild(progressBar);

  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  }

  window.addEventListener("scroll", updateProgressBar);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});


