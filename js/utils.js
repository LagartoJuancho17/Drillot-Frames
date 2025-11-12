
function preloadImages(imageElements) {
  const promises = [...imageElements].map((img) => {
    if (img.complete) return Promise.resolve() // Already cached

    return new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = resolve // Resolve even on error to avoid blocking
    })
  })

  return Promise.all(promises)
}

// Expose as globals (no bundler)
window.preloadImages = window.preloadImages || preloadImages

// Lightweight debounce utility (fallback to native import we removed)
// Usage: window.debounce(fn, wait)
window.debounce = window.debounce || function debounce(fn, wait = 100) {
  let t
  return function debounced(...args) {
    if (t) clearTimeout(t)
    t = setTimeout(() => fn.apply(this, args), wait)
  }
}
