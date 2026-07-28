// Thin progress bar pinned to the top of the viewport, tracking how far the
// reader has moved through the page. Driven by scroll position rather than the
// article's own bounds so it agrees with the scrollbar the reader can see.
function setupReadingProgress() {
  const bar = document.querySelector<HTMLElement>(".reading-progress-fill")
  const track = bar?.parentElement
  if (!bar || !track) return

  // Cached so the scroll handler only has to read scrollTop; the expensive
  // height reads happen on resize and on load instead.
  let scrollable = 0

  const measure = () => {
    const doc = document.documentElement
    scrollable = doc.scrollHeight - doc.clientHeight
  }

  const update = () => {
    // Pages that don't scroll get a full bar rather than a stuck empty one.
    const progress =
      scrollable > 0 ? Math.min(1, Math.max(0, document.documentElement.scrollTop / scrollable)) : 1
    bar.style.transform = `scaleX(${progress})`
    track.setAttribute("aria-valuenow", String(Math.round(progress * 100)))
  }

  const remeasure = () => {
    measure()
    update()
  }

  measure()
  update()
  window.addEventListener("scroll", update, { passive: true })
  window.addEventListener("resize", remeasure, { passive: true })

  // Posts embed images, so the page keeps growing after first paint — without
  // this the cached height (and so the bar) would stay wrong until a resize.
  const observer = new ResizeObserver(remeasure)
  observer.observe(document.body)

  window.addCleanup(() => {
    window.removeEventListener("scroll", update)
    window.removeEventListener("resize", remeasure)
    observer.disconnect()
  })
}

document.addEventListener("nav", () => {
  setupReadingProgress()
})
