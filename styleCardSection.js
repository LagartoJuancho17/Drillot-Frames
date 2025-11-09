const gsap = window.gsap;

// Datos
var cards = [
  {
    id: 1,
    title: "Tipografia",
    desc:
      "In different heights and shapes, the four versions of Floema low tables offer a variety of surfaces to satisfy different needs and uses in a contract environment, from work to moments of relaxation.",
    photo:
      "/public/estilos/img7.webp"
  },
  {
    id: 2,
    title: "Minimalista",
    desc:
      "The Circle Coffee table from Wendelbo emulates almost a visual trick. A frame where mass and gravity is suspended, and the slim and delicate structure support the marble top, like a hovering platform.",
    photo:
      "/public/estilos/img1.jpg"
  },
  {
    id: 3,
    title: "Organico",
    desc:
      "With an appearance that is at once light and elegant, the Workshop Coffee Table fits perfectly into any living room, serving as a traditional coffee table as well as side table.",
    photo:
      "/public/estilos/img3.jpg"
  },
  {
    id: 4,
    title: "Abstracto",
    desc:
      "Made from sustainably sourced solid American Oak, the Duo Table is composed of two seperate tops joined together on one side. The tops are solid and carved out to create a gentle lip. ",
    photo:
      "/public/estilos/img2.jpg"
  }
];

document.addEventListener('DOMContentLoaded', function () {
  var title = document.getElementById("estilos-card-info-title");
  var desc  = document.getElementById("estilos-card-info-desc");
  var img   = document.querySelector(".estilos-card-photo img");      // << sin #id
  var next  = document.querySelector(".estilos-card-photo > a");      // << el link "Next" dentro de la foto

  var mask1 = document.getElementById("mask-1");
  var mask2 = document.getElementById("mask-2");

  if (!title || !desc || !img || !next || !mask1 || !mask2) {
    return;
  }

  var currentNum = 0;

  function renderCard() {
    var card = cards[currentNum];
    title.textContent = card.title;         // Reemplaza {{ currentCard.title }}
    desc.textContent  = card.desc;          // Reemplaza {{ currentCard.desc }}
    img.setAttribute("src", card.photo);    // Reemplaza :src="currentCard.photo"
  }

  // Animación: oculta texto y barre máscaras (desde sus posiciones iniciales definidas en CSS)
  function playForward() {
    var tl = gsap.timeline({
      defaults: { duration: 0.7, ease: "sine.out" },
      onComplete: function () {
        currentNum = (currentNum + 1) % cards.length;
        swapAndReveal();
      }
    });

    tl.to(mask1, { yPercent: 100, scaleY: 1.4 })
      .to(mask2, { yPercent: -100, scaleY: 1.4 }, "<")
      .to(title, { clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)" }, "<0.4")
      .to(desc,  { clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)" }, "<0.3");
  }

  // Cambia el contenido y revela cuando la imagen cargó (evita parpadeos)
  function swapAndReveal() {
    function handleLoad() {
      img.removeEventListener("load", handleLoad);
      playReverse();
    }
    img.addEventListener("load", handleLoad);
    renderCard();
  }

  // Revela: máscaras vuelven a pasar y el texto se abre
  function playReverse() {
    var tl = gsap.timeline({ defaults: { duration: 0.7, ease: "sine.in" } });

    tl.to(mask1, { yPercent: -100, scaleY: 1.4 })
      .to(mask2, { yPercent: 100,  scaleY: 1.4 }, "<")
      .to(title, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }, "<0.2")
      .to(desc,  { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }, "<0.3")
      // Dejar listas para el próximo ciclo (posición neutra)
      .set([mask1, mask2], { yPercent: 0, scaleY: 1 });
  }

  // Click en "Next" (reemplaza @click.prevent="nextCard")
  next.addEventListener("click", function (e) {
    e.preventDefault();
    playForward();
  });

  // Primer render
  renderCard();
});
