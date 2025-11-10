import { gsap } from 'gsap';
const arrowScroll = gsap.timeline({ repeat:-1 });

arrowScroll
  .fromTo('.arrow--down', { yPercent: 0 }, { yPercent: 100, ease: 'power1.inOut', duration: 1}, 0)
  .fromTo('.arrow--down-2', { yPercent: -100 }, { yPercent: 0, ease: 'power1.inOut', duration: 1 }, 0)