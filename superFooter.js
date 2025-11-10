import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  (function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  })(performance.now());

  const imageURLs = [
    "/public/footer/footer1.png",
    "/public/footer/footer2.png",
    "/public/footer/footer3.png",
    "/public/footer/footer4.png",
    "/public/footer/footer5.png",
    "/public/footer/footer6.png",
    "/public/footer/footer7.png",
    "/public/footer/footer8.png",
  ];

  function preloadImages(urls) {
    return Promise.all(
      urls.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () =>
              resolve({ src, ok: true, w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => resolve({ src, ok: false });
            img.src = src;
          })
      )
    );
  }

  function populateObjects(container, images, opts = {}) {
    const {
      width = 200,
      height = 300,
      borderRadius = 12,
      bgSize = "cover",
    } = opts;

    container.innerHTML = "";

    images.forEach((url) => {
      const el = document.createElement("div");
      el.className = "object";
      el.style.width = width + "px";
      el.style.height = height + "px";
      el.style.backgroundImage = `url("${url}")`;
      el.style.backgroundSize = bgSize;
      el.style.backgroundPosition = "center";
      el.style.backgroundRepeat = "no-repeat";
      el.style.borderRadius = borderRadius + "px";
      el.setAttribute("role", "img");
      container.appendChild(el);
    });
  }

  // ---------- Config de física
  const config = {
    gravity: { x: 0, y: 1 },
    restitution: 0.5,
    friction: 0.15,
    frictionAir: 0.02,
    density: 0.002,
    wallThickness: 200,
    mouseStiffness: 0.6,
  };

  // ---------- Estado global Matter + control de loop
  let engine = null;
  let runner = null;
  let mouseConstraint = null;
  let bodies = [];
  let topWall = null;

  let hasInited = false;
  let rafId = null;
  let updatePositionsRef = null;

  let containerRect = null;
  let resizeObs = null;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const startRAF = (fn) => {
    if (!rafId) rafId = requestAnimationFrame(fn);
  };
  const stopRAF = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  function initPhysics(container) {
    engine = Matter.Engine.create();

    // Gravedad correcta:
    engine.world.gravity.x = config.gravity.x;
    engine.world.gravity.y = config.gravity.y;

    // Tuning
    engine.constraintIterations = 10;
    engine.positionIterations = 20;
    engine.velocityIterations = 16;
    engine.timing.timeScale = 1;

    containerRect = container.getBoundingClientRect();
    const T = config.wallThickness;

    // Paredes (suelo + laterales)
    const floor = Matter.Bodies.rectangle(
      containerRect.width / 2,
      containerRect.height + T / 2,
      containerRect.width + T * 2,
      T,
      { isStatic: true }
    );
    const wallL = Matter.Bodies.rectangle(
      -T / 2,
      containerRect.height / 2,
      T,
      containerRect.height + T * 2,
      { isStatic: true }
    );
    const wallR = Matter.Bodies.rectangle(
      containerRect.width + T / 2,
      containerRect.height / 2,
      T,
      containerRect.height + T * 2,
      { isStatic: true }
    );
    Matter.World.add(engine.world, [floor, wallL, wallR]);

    // Cuerpos por cada .object
    bodies = [];
    const objects = container.querySelectorAll(".object");
    objects.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const w = r.width;
      const h = r.height;

      const startX = Math.random() * (containerRect.width - w) + w / 2;
      const startY = -500 - i * 200;
      const startAngle = (Math.random() - 0.5) * Math.PI;

      const body = Matter.Bodies.rectangle(startX, startY, w, h, {
        restitution: config.restitution,
        friction: config.friction,
        frictionAir: config.frictionAir,
        density: config.density,
      });

      Matter.Body.setAngle(body, startAngle);
      bodies.push({ body, element: el, width: w, height: h });
      Matter.World.add(engine.world, body);
    });

    // Techo con delay (para que puedan entrar las piezas)
    setTimeout(() => {
      topWall = Matter.Bodies.rectangle(
        containerRect.width / 2,
        -T / 2,
        containerRect.width + T * 2,
        T,
        { isStatic: true }
      );
      Matter.World.add(engine.world, topWall);
    }, 3000);

    // Mouse / drag
    const mouse = Matter.Mouse.create(container);
    if (mouse?.element && mouse?.mousewheel) {
      mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
      mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    }
    mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: config.mouseStiffness, render: { visible: false } },
    });
    if (mouseConstraint?.mouse?.element) {
      mouseConstraint.mouse.element.oncontextmenu = () => false;
    }

    let dragging = null;
    let originalInertia = null;

    Matter.Events.on(mouseConstraint, "startdrag", (evt) => {
      dragging = evt.body;
      if (dragging) {
        originalInertia = dragging.inertia;
        Matter.Body.setInertia(dragging, Infinity);
        Matter.Body.setVelocity(dragging, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(dragging, 0);
      }
    });

    Matter.Events.on(mouseConstraint, "enddrag", () => {
      if (dragging) {
        Matter.Body.setInertia(dragging, originalInertia || 1);
        dragging = null;
        originalInertia = null;
      }
    });

    Matter.Events.on(engine, "beforeUpdate", () => {
      if (!dragging) return;
      const item = bodies.find((b) => b.body === dragging);
      if (!item) return;

      const minX = item.width / 2;
      const maxX = containerRect.width - item.width / 2;
      const minY = item.height / 2;
      const maxY = containerRect.height - item.height / 2;

      Matter.Body.setPosition(dragging, {
        x: clamp(dragging.position.x, minX, maxX),
        y: clamp(dragging.position.y, minY, maxY),
      });

      Matter.Body.setVelocity(dragging, {
        x: clamp(dragging.velocity.x, -20, 20),
        y: clamp(dragging.velocity.y, -20, 20),
      });
    });

    // Soltar si el mouse sale
    container.addEventListener("mouseleave", () => {
      if (!mouseConstraint) return;
      mouseConstraint.constraint.bodyB = null;
      mouseConstraint.constraint.pointB = null;
    });
    document.addEventListener("mouseup", () => {
      if (!mouseConstraint) return;
      mouseConstraint.constraint.bodyB = null;
      mouseConstraint.constraint.pointB = null;
    });

    Matter.World.add(engine.world, mouseConstraint);

    // Runner
    runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Loop visual
    function updatePositions() {
      bodies.forEach(({ body, element, width, height }) => {
        const x = clamp(body.position.x - width / 2, 0, containerRect.width - width);
        const y = clamp(body.position.y - height / 2, -height * 3, containerRect.height - height);
        element.style.left = x + "px";
        element.style.top = y + "px";
        element.style.transform = `rotate(${body.angle}rad)`;
      });
      rafId = requestAnimationFrame(updatePositions);
    }
    updatePositionsRef = updatePositions;
    startRAF(updatePositions);

    // Observa resize para clamps correctos (no recrea el mundo)
    if (!resizeObs) {
      resizeObs = new ResizeObserver(() => {
        containerRect = container.getBoundingClientRect();
      });
      resizeObs.observe(container);
    }
  }

  // ---------- Activación por ScrollTrigger
  const footer = document.querySelector("footer.footer");
  if (!footer) return;

  const container = footer.querySelector(".object-container");
  if (!container) return;

  ScrollTrigger.create({
    trigger: footer,
    start: "top 90%",
    end: "bottom top",
    onEnter: async () => {
      if (!hasInited) {
        // 1) Precarga imágenes
        await preloadImages(imageURLs);
        // 2) Crea los .object
        populateObjects(container, imageURLs, {
          width: 200,   // ajustá tamaño a gusto
          height: 300,
          borderRadius: 14,
          bgSize: "cover", // o "cover"
        });
        // 3) Inicializa Matter
        initPhysics(container);
        hasInited = true;
      } else if (runner && engine) {
        Matter.Runner.run(runner, engine);
        if (updatePositionsRef) startRAF(updatePositionsRef);
      }
    },
    onEnterBack: () => {
      if (runner && engine) {
        Matter.Runner.run(runner, engine);
        if (updatePositionsRef) startRAF(updatePositionsRef);
      }
    },
    onLeave: () => {
      if (runner) Matter.Runner.stop(runner);
      stopRAF();
    },
    onLeaveBack: () => {
      if (runner) Matter.Runner.stop(runner);
      stopRAF();
    },
  });

  // Si querés reajustar Lenis al refrescar ScrollTrigger:
  ScrollTrigger.addEventListener("refresh", () => {
    // lenis.resize(); // opcional
  });
  ScrollTrigger.refresh();
});
