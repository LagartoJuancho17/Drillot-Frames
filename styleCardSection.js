
// Requiere GSAP cargado en el HTML antes de este archivo.
import gsap from "gsap";
document.addEventListener("DOMContentLoaded", () => {
  // Datos (igual que antes)
  const cards = [
    {
      id: 1,
      title: "Cincinnati",
      desc:
        "In different heights and shapes, the four versions of Floema low tables offer a variety of surfaces to satisfy different needs and uses in a contract environment, from work to moments of relaxation.",
      photo:
        "https://images.unsplash.com/photo-1649011327045-624a1bd2c3e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=853&q=80"
    },
    {
      id: 2,
      title: "Daytona",
      desc:
        "The Circle Coffee table from Wendelbo emulates almost a visual trick. A frame where mass and gravity is suspended, and the slim and delicate structure support the marble top, like a hovering platform.",
      photo:
        "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
    },
    {
      id: 3,
      title: "Indiana",
      desc:
        "With an appearance that is at once light and elegant, the Workshop Coffee Table fits perfectly into any living room, serving as a traditional coffee table as well as side table.",
      photo:
        "https://images.unsplash.com/flagged/photo-1588262516915-e342186ecdf6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
    },
    {
      id: 4,
      title: "Amarillo",
      desc:
        "Made from sustainably sourced solid American Oak, the Duo Table is composed of two seperate tops joined together on one side. The tops are solid and carved out to create a gentle lip. ",
      photo:
        "https://images.unsplash.com/photo-1622372738946-62e02505feb3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=832&q=80"
    }
  ];

  let currentIdx = 0;

  // Tomamos referencias del DOM usando los ids/clases que YA tenés en tu HTML
  const titleEl = document.getElementById("style-card-info-title");
  const descEl  = document.getElementById("style-card-info-desc");
  const imgEl   = document.querySelector(".style-card-photo img");
  const nextBtn = document.getElementById("next-card-btn");
  const mask1   = document.getElementById("mask-1");
  const mask2   = document.getElementById("mask-2");

  if (!titleEl || !descEl || !imgEl || !nextBtn || !mask1 || !mask2) {
    console.error("Faltan elementos en el DOM. Verifica los IDs y estructura HTML.");
    return;
  }

  // Estado inicial visual (clip-path abierto)
  titleEl.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
  descEl.style.clipPath  = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";

  function renderCard(idx) {
    const c = cards[idx];
    titleEl.textContent = c.title;
    descEl.textContent  = c.desc;
    imgEl.src           = c.photo;
    imgEl.alt           = c.title;
  }

  function playForward() {
    const tl = gsap.timeline({
      defaults: { duration: 0.7, ease: "sine.out" },
      onComplete: () => {
        playReverse();
        currentIdx = (currentIdx + 1) % cards.length;
      }
    });

    tl.to(mask1, { yPercent: 100, scaleY: 1.4 })
      .to(mask2, { yPercent: -100, scaleY: 1.4 }, "<")
      .to(titleEl, { clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)" }, "<0.4")
      .to(descEl,  { clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)" }, "<0.3");
  }

  function playReverse() {
    const tl = gsap.timeline({
      defaults: { duration: 0.7, ease: "sine.in" },
      onComplete: () => {
        // Después de cerrar, cambiamos el contenido y volvemos a abrir
        renderCard(currentIdx);
        gsap.to(titleEl, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 0.5, ease: "sine.out", delay: 0.1 });
        gsap.to(descEl,  { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 0.5, ease: "sine.out", delay: 0.2 });
        gsap.to(mask1,   { yPercent: -100, scaleY: 1.0, duration: 0.5, ease: "sine.out" });
        gsap.to(mask2,   { yPercent: 100,  scaleY: 1.0, duration: 0.5, ease: "sine.out" });
      }
    });

    tl.to(mask1, { yPercent: -100, scaleY: 1.4 })
      .to(mask2, { yPercent: 100,  scaleY: 1.4 }, "<");
  }

  function nextCard(e) {
    // Si todavía tenés <a>, prevenimos que recargue
    if (e) e.preventDefault();
    playForward();
  }

  nextBtn.addEventListener("click", nextCard);

  renderCard(currentIdx);
});
