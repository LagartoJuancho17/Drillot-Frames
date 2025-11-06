// No imports; rely on globals loaded via script tags
window.addEventListener('load', async () => {
  // initialize grid
  new ProductGrid()

  // load all the images
  const images = [...document.querySelectorAll('img')]
  await (window.preloadImages ? window.preloadImages(images) : Promise.resolve()).then(() => {
    document.body.classList.remove('loading')
  })
})
