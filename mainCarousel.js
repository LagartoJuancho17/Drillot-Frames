// mainCarousel.js
import gsap from "gsap";
import Draggable from "gsap/Draggable";

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(Draggable);

  var artworks = [
    { title: "Blue World", price: "$120", img: "assets/imgs/img1.jpg" },
    { title: "Roma Sunset", price: "$130", img: "assets/imgs/img2.jpg" },
    { title: "Ocean Layers", price: "$110", img: "assets/imgs/img3.jpg" },
    { title: "Sunset Horizon", price: "$125", img: "assets/imgs/img4.jpg" },
    { title: "Abstract Shapes", price: "$140", img: "assets/imgs/img5.png" },
    { title: "Blue World", price: "$120", img: "assets/imgs/img1.jpg" },
    { title: "Roma Sunset", price: "$130", img: "assets/imgs/img2.jpg" },
    { title: "Ocean Layers", price: "$110", img: "assets/imgs/img3.jpg" },
    { title: "Sunset Horizon", price: "$125", img: "assets/imgs/img4.jpg" },
    { title: "Abstract Shapes", price: "$140", img: "assets/imgs/img5.png" }
  ];

  var carousel = document.querySelector(".main-carousel");

  // Render de tarjetas .card
  var i, art, card;
  for (i = 0; i < artworks.length; i++) {
    art = artworks[i];
    card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      '<img src="' + art.img + '" alt="' + art.title + '">' +
      '<div class="card-info">' +
      "  <h3>" + art.title + "</h3>" +
      "  <p>Desde " + art.price + "</p>" +
      "</div>";
    carousel.appendChild(card);
  }


  // Seleccionar las cards ya creadas
  var boxes = gsap.utils.toArray(".card");
  var activeElement = null;
  var previousElement = null;
  var nextElement = null;


  // Inicial: estilos base para imágenes (por si entran ya animadas)
 for (i = 0; i < boxes.length; i++) {
  var img = boxes[i].querySelector("img");
  if (i !== 0) { // Exclude the second element
    gsap.set(img, { opacity: 0.7, scale: 0.8, filter: "grayscale(1)", transformOrigin: "50% 50%" });
  }
}

  // Horizontal loop con onChange para clases/animaciones
  var loop = horizontalLoop(boxes, {
    paused: true,
    speed: 0.5,
    draggable: true,
    center: true,
    onChange: function (element, index) {
      // limpiar clases previas
      if (activeElement) activeElement.classList.remove("active");
      if (previousElement && previousElement.querySelector("img")) previousElement.querySelector("img").classList.remove("previous-element");
      if (nextElement && nextElement.querySelector("img")) nextElement.querySelector("img").classList.remove("next-element");
      if (activeElement && activeElement.querySelector("img")) activeElement.querySelector("img").classList.remove("active-element");

      element.classList.add("active");
      activeElement = element;

      // calcular anterior/siguiente con wrap
      if (index === 0) {
        previousElement = boxes[boxes.length - 1];
        nextElement = boxes[1];
      } else if (index === boxes.length - 1) {
        previousElement = boxes[index - 1];
        nextElement = boxes[0];
      } else {
        previousElement = boxes[index - 1];
        nextElement = boxes[index + 1];
      }

      // agregar clases de estado
      if (previousElement && previousElement.querySelector("img")) previousElement.querySelector("img").classList.add("previous-element");
      if (nextElement && nextElement.querySelector("img")) nextElement.querySelector("img").classList.add("next-element");
      if (element && element.querySelector("img")) element.querySelector("img").classList.add("active-element");

      // animaciones (activo / vecino izq / vecino der)
      if (activeElement && activeElement.querySelector("img")) {
        gsap.to(activeElement.querySelector("img"), {
          opacity: 1,
          scale: 1,
          filter: "grayscale(0)",
          transformOrigin: "50% 50%",
          x: 0,
          duration: 0.4,
          ease: "power1.out"
        });
      }
      if (previousElement && previousElement.querySelector("img")) {
        gsap.to(previousElement.querySelector("img"), {
          opacity: 0.7,
          scale: 0.8,
          filter: "grayscale(1)",
          transformOrigin: "50% 50%",
          duration: 0.4,
          ease: "power1.out",
        });
      }
      if (nextElement && nextElement.querySelector("img")) {
        gsap.to(nextElement.querySelector("img"), {
          opacity: 0.7,
          scale: 0.8,
          filter: "grayscale(1)",
          transformOrigin: "50% 50%",
          duration: 0.4,
          ease: "power1.out"
        });
      }
    }
  });

  // Click en cada card para centrarla
  for (i = 0; i < boxes.length; i++) {
    (function (el, idx) {
      el.addEventListener("click", function () {
        loop.toIndex(idx, { duration: 0.8, ease: "power1.inOut" });
      });
    })(boxes[i], i);
  }

  // Botones
  var btnRight = document.querySelector(".go-right");
  var btnLeft = document.querySelector(".go-left");

  if (btnRight) {
    btnRight.addEventListener("click", function () {
      loop.next({ duration: 0.4, ease: "power1.inOut" });
    });
  }
  if (btnLeft) {
    btnLeft.addEventListener("click", function () {
      loop.previous({ duration: 0.4, ease: "power1.inOut" });
    });
  }

  // Iniciar centrando el primer elemento
  loop.toIndex(0, { duration: 0 });
});

function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};

  var onChange = config.onChange;
  var lastIndex = 0;

  var tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: "none" },
    onUpdate: onChange && function () {
      var i = tl.closestIndex();
      if (lastIndex !== i) {
        lastIndex = i;
        onChange(items[i], i);
      }
    },
    onReverseComplete: function () {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    }
  });

  var length = items.length;
  var startX = items[0].offsetLeft;
  var times = [];
  var widths = [];
  var spaceBefore = [];
  var xPercents = [];
  var curIndex = 0;
  var center = config.center;
  var pixelsPerSecond = (config.speed || 1) * 100;
  var snap = config.snap === false ? function (v) { return v; } : gsap.utils.snap(config.snap || 1); // función de ajusteo para el snap de posición
  var timeOffset = 0;
  var container = center === true ? items[0].parentNode : (gsap.utils.toArray(center)[0] || items[0].parentNode); // Permitir un contenedor personalizado para el centradoZ
  var totalWidth;
  var timeWrap;
  var proxy;
  var proxyEl;

  function getTotalWidth() {
    return items[length - 1].offsetLeft +
      xPercents[length - 1] / 100 * widths[length - 1] -
      startX + spaceBefore[0] +
      items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") +
      (parseFloat(config.paddingRight) || 0);
  }

  function populateWidths() {
    var b1 = container.getBoundingClientRect();
    var b2;
    var i;

    for (i = 0; i < items.length; i++) {
      var el = items[i];
      widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
      xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
      b2 = el.getBoundingClientRect();
      spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
      b1 = b2;
    }

    gsap.set(items, {
      xPercent: function (i2) { return xPercents[i2]; }
    });

    totalWidth = getTotalWidth();
  }

  function populateOffsets() {
    timeOffset = center ? tl.duration() * (container.offsetWidth / 2) / totalWidth : 0;
    if (center) {
      for (var i = 0; i < times.length; i++) {
        times[i] = timeWrap(tl.labels["label" + i] + tl.duration() * widths[i] / 2 / totalWidth - timeOffset);
      }
    }
  }

  function populateTimeline() {
    var i, item, curX, distanceToStart, distanceToLoop;

    tl.clear();

    for (i = 0; i < length; i++) {
      item = items[i];
      curX = xPercents[i] / 100 * widths[i];
      distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
      distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");

      tl.to(item, {
        xPercent: snap((curX - distanceToLoop) / widths[i] * 100),
        duration: distanceToLoop / pixelsPerSecond
      }, 0)
        .fromTo(item, {
          xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)
        }, {
          xPercent: xPercents[i],
          duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false
        }, distanceToLoop / pixelsPerSecond)
        .add("label" + i, distanceToStart / pixelsPerSecond);

      times[i] = distanceToStart / pixelsPerSecond;
    }

    timeWrap = gsap.utils.wrap(0, tl.duration());
  }

  function refresh(deep) {
    var progress = tl.progress();
    tl.progress(0, true);
    populateWidths();
    if (deep) populateTimeline();
    populateOffsets();
    if (deep && tl.draggable) {
      tl.time(times[curIndex], true);
    } else {
      tl.progress(progress, true);
    }
  }

  function getClosest(values, value, wrap) {
    var i = values.length;
    var closest = 1e10;
    var index = 0;
    var d;
    while (i--) {
      d = Math.abs(values[i] - value);
      if (wrap && d > wrap / 2) d = wrap - d;
      if (d < closest) {
        closest = d;
        index = i;
      }
    }
    return index;
  }

  gsap.set(items, { x: 0 });
  populateWidths();
  populateTimeline();
  populateOffsets();

  // Exponer closestIndex() en el timeline
  tl.closestIndex = function () {
    if (!times.length) return 0;
    return getClosest(times, timeWrap(tl.time()), tl.duration());
  };

  window.addEventListener("resize", function () { refresh(true); });

  function toIndex(index, vars) {
    vars = vars || {};
    if (Math.abs(index - curIndex) > length / 2) {
      if (index > curIndex) {
        index = index - length;
      } else {
        index = index + length;
      }
    }

    var newIndex = gsap.utils.wrap(0, length, index);
    var time = times[newIndex];

    if ((time > tl.time()) !== (index > curIndex) && index !== curIndex) {
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    if (time < 0 || time > tl.duration()) {
      vars.modifiers = { time: timeWrap };
    }

    curIndex = newIndex;
    vars.overwrite = true;

    if (proxy) {
      gsap.killTweensOf(proxy);
    }

    if (vars.duration === 0) {
      tl.time(timeWrap(time));
      return tl;
    } else {
      return tl.tweenTo(time, vars);
    }
  }

  tl.toIndex = toIndex;
  tl.next = function (vars) { return toIndex(curIndex + 1, vars || {}); };
  tl.previous = function (vars) { return toIndex(curIndex - 1, vars || {}); };
  tl.current = function () { return curIndex; };
  tl.times = times;

  if (config.draggable) {
    var startDragX = 0;
    proxyEl = document.createElement("div");
    proxyEl.style.position = "absolute";
    proxyEl.style.width = "1px";
    proxyEl.style.height = "1px";
    proxyEl.style.top = "0";
    proxyEl.style.left = "0";
    document.body.appendChild(proxyEl);
    proxy = gsap.quickSetter(proxyEl, "x", "px");

    Draggable.create(proxyEl, {
      type: "x",
      trigger: items[0].parentNode,
      onPress: function () {
        startDragX = this.x;
      },
      onDrag: function () {
        var delta = this.x - startDragX;
        var t = tl.time() - delta / pixelsPerSecond;
        tl.time(timeWrap(t));
      },
      onRelease: function () {
        tl.tweenTo(times[tl.closestIndex()], { duration: 0.4, ease: "power1.out" });
      }
    });

    tl.draggable = true;
  }

  return tl;
}
