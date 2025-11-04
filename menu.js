import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase, SplitText);
  CustomEase.create("hop", ".87,0,.13,1");

  const lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const textContainers = document.querySelectorAll(".menu-col");
  let splitTextByContainer = [];

  textContainers.forEach((container) => {
    const textElements = container.querySelectorAll("a, p");
    let containerSplits = [];

    textElements.forEach((element) => {
      const split = SplitText.create(element, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
      });
      containerSplits.push(split);

      gsap.set(split.lines, { y: "-110%" });
    });

    splitTextByContainer.push(containerSplits);
  });

  const container = document.querySelector(".container");
  const menuToggleBtn = document.querySelector(".menu-toggle-btn");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuOverlayContainer = document.querySelector(".menu-overlay-content");
  const menuMediaWrapper = document.querySelector(".menu-media-wrapper");
  const copyContainers = document.querySelectorAll(".menu-col");
  const menuToggleLabel = document.querySelector(".menu-toggle-label p");
  const hamburgerIcon = document.querySelector(".menu-hamburger-icon");

  let isMenuOpen = false;
  let isAnimating = false;

  menuToggleBtn.addEventListener("click", () => {
    if (isAnimating) return;

    if (!isMenuOpen) {
      isAnimating = true;

      lenis.stop();

      const tl = gsap.timeline();

      tl.to(
        menuToggleLabel,
        {
          y: "-110%",
          duration: 1,
          ease: "hop",
        },
        "<"
      )
        .to(
          container,
          {
            y: "100svh",
            duration: 1,
            ease: "hop",
          },
          "<"
        )
        .to(
          menuOverlay,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
            ease: "hop",
          },
          "<"
        )
        .to(
          menuOverlayContainer,
          {
            yPercent: 0,
            duration: 1,
            ease: "hop",
          },
          "<"
        )
        .to(
          menuMediaWrapper,
          {
            opacity: 1,
            duration: 0.75,
            ease: "power2.out",
            delay: 0.5,
          },
          "<"
        );

      splitTextByContainer.forEach((containerSplits) => {
        const copyLines = containerSplits.flatMap((split) => split.lines);
        tl.to(
          copyLines,
          {
            y: "0%",
            duration: 2,
            ease: "hop",
            stagger: -0.075,
          },
          -0.15
        );
      });

      hamburgerIcon.classList.add("active");

      tl.call(() => {
        isAnimating = false;
      });

      isMenuOpen = true;
    } else {
      isAnimating = true;

      hamburgerIcon.classList.remove("active");
      const tl = gsap.timeline();

      tl.to(container, {
        y: "0svh",
        duration: 1,
        ease: "hop",
      })
        .to(
          menuOverlay,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1,
            ease: "hop",
          },
          "<"
        )
        .to(
          menuOverlayContainer,
          {
            yPercent: -50,
            duration: 1,
            ease: "hop",
          },
          "<"
        )
        .to(
          menuToggleLabel,
          {
            y: "0%",
            duration: 1,
            ease: "hop",
          },
          "<"
        )
        .to(
          copyContainers,
          {
            opacity: 0.25,
            duration: 1,
            ease: "hop",
          },
          "<"
        );

      tl.call(() => {
        splitTextByContainer.forEach((containerSplits) => {
          const copyLines = containerSplits.flatMap((split) => split.lines);
          gsap.set(copyLines, { y: "-110%" });
        });

        gsap.set(copyContainers, { opacity: 1 });
        gsap.set(menuMediaWrapper, { opacity: 0 });

        isAnimating = false;
        lenis.start();
      });

      isMenuOpen = false;
    }
  });

  const menuLinks = document.querySelectorAll(".menu-col a");

  let dynamicImage = document.createElement("img");
  dynamicImage.style.width = "100%";
  dynamicImage.style.height = "100%";
  dynamicImage.style.objectFit = "cover";
  dynamicImage.style.transition = "opacity 0.3s ease-in-out";
  dynamicImage.style.opacity = 0;
  dynamicImage.src = "/public/img3.jpg";
  dynamicImage.style.opacity = 1;
  menuMediaWrapper.appendChild(dynamicImage);

  menuLinks.forEach((link, index) => {
    link.addEventListener("mouseenter", () => {
      dynamicImage.src = `/public/img${index + 1}.jpg`;
      dynamicImage.style.opacity = 1;
    });
  });

  const comprarLink = document.querySelector(".menu-tag a[href='#']");
  const menuCol = comprarLink.closest(".menu-col");

  // Crear el submenu dinámicamente
  const submenu = document.createElement("div");
  submenu.classList.add("submenu");
  submenu.innerHTML = `
    <ul>
      <li class="sub-menu-li" ><a href="#">Organico</a></li>
      <li class="sub-menu-li" ><a href="#">Minimalista</a></li>
      <li class="sub-menu-li" ><a href="#">Queso</a></li>
      <li class="sub-menu-li" ><a href="#">Marcos</a></li>
      <li class="sub-menu-li" ><a href="#">Juan</a></li>
    </ul>
  `;
  menuCol.appendChild(submenu);

  // Estilo inicial del submenu
  gsap.set(submenu, { height: 0, opacity: 0, overflow: "hidden" });

  let isSubmenuOpen = false;

  // Ocultar los botones "Inspirate", "Reviews" y "Acerca De" con `content-visibility: hidden` cuando se despliega el submenu
  const otherButtons = document.querySelectorAll(".nav-buttons");


  comprarLink.addEventListener("click", (event) => {
    event.preventDefault();

    if (!isSubmenuOpen) {
      // Mostrar el submenu y ocultar otros botones
      gsap.to(submenu, {
        height: "auto",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
      otherButtons.forEach((button) => {
        if (!button.contains(submenu)) {
          button.style.contentVisibility = "hidden";
        }
      });
      isSubmenuOpen = true;
    } else {
      // Ocultar el submenu y mostrar otros botones
      gsap.to(submenu, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
      otherButtons.forEach((button) => {
        button.style.contentVisibility = "visible";
      });
      isSubmenuOpen = false;
    }

    const anyVisible = Array.from(otherButtons).some((button) => button.getComputedStyle().contentVisibility === "visible");

    submenu.style.contentVisibility = anyVisible ? "hidden" : "visible";

  });
});