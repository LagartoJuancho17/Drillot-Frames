
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  const artworks = [
    { title: "Blue World", price: "$120", img: "assets/imgs/img1.jpg" },
    { title: "Roma Sunset", price: "$130", img: "assets/imgs/img2.jpg" },
    { title: "Ocean Layers", price: "$110", img: "assets/imgs/img3.jpg" },
    { title: "Sunset Horizon", price: "$125", img: "assets/imgs/img4.jpg" },
    { title: "Abstract Shapes", price: "$140", img: "assets/imgs/img5.png" }
  ];

  const carousel = document.querySelector(".main-carousel");
  if (!carousel) {
    console.error("El elemento con la clase 'carousel' no se encontró en el DOM.");
    return;
  }

  const btnLeft = document.querySelector(".arrow.left");
  const btnRight = document.querySelector(".arrow.right");

  let currentIndex = 0;

  artworks.forEach((art) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${art.img}" alt="${art.title}">
      <div class="card-info">
        <h3>${art.title}</h3>
        <p>Desde ${art.price}</p>
      </div>
    `;
    carousel.appendChild(card);
  });

  const totalItems = artworks.length;
  const cardWidth = 320;
  const moveAmount = cardWidth;

  function moveCarousel(direction) {
    if (direction === "right" && currentIndex < totalItems - 1) {
      currentIndex++;
    } else if (direction === "left" && currentIndex > 0) {
      currentIndex--;
    }

    const xMove = -currentIndex * moveAmount;

    gsap.to(carousel, {
      x: xMove,
      duration: 0.8,
      ease: "power3.inOut"
    });
  }

  btnRight.addEventListener("click", () => moveCarousel("right"));
  btnLeft.addEventListener("click", () => moveCarousel("left"));
});
