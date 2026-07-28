// Threshold below which the aids stay hidden: the page must scroll at least
// this many viewport-heights before a progress bar / back-to-top is useful.
// A full extra viewport keeps them off the homepage on typical laptop sizes,
// where a bar on a barely-scrolling page would just be decoration.
const MIN_SCROLLABLE_VIEWPORTS = 1

function setupScrollAids() {
  const container = document.querySelector<HTMLElement>(".scroll-aids")
  if (!container) return
  const track = container.querySelector<HTMLElement>(".reading-progress")
  const bar = container.querySelector<HTMLElement>(".reading-progress-bar")
  const button = container.querySelector<HTMLButtonElement>(".back-to-top")
  if (!track || !bar || !button) return

  // Cached so the scroll handler only reads scrollY — synchronously, NOT via
  // rAF (which never fires in hidden tabs). The expensive height reads happen
  // on load, resize, and content growth instead.
  let scrollable = 0

  const measure = () => {
    scrollable = document.documentElement.scrollHeight - window.innerHeight
    const active = scrollable > window.innerHeight * MIN_SCROLLABLE_VIEWPORTS
    container.classList.toggle("scroll-aids-active", active)
  }

  const update = () => {
    if (scrollable <= 0) return
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollable))
    bar.style.transform = `scaleX(${progress})`
    track.setAttribute("aria-valuenow", String(Math.round(progress * 100)))
    button.classList.toggle("visible", window.scrollY > window.innerHeight)
  }

  const remeasure = () => {
    measure()
    update()
  }

  const onButtonClick = () => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth"
    window.scrollTo({ top: 0, behavior })
  }

  window.addEventListener("scroll", update, { passive: true })
  window.addEventListener("resize", remeasure, { passive: true })
  button.addEventListener("click", onButtonClick)

  // Posts embed images, so the page keeps growing after first paint — without
  // this the cached height (and the short-page check) would stay wrong until
  // a resize.
  const observer = new ResizeObserver(remeasure)
  observer.observe(document.body)

  window.addCleanup(() => {
    window.removeEventListener("scroll", update)
    window.removeEventListener("resize", remeasure)
    button.removeEventListener("click", onButtonClick)
    observer.disconnect()
  })

  remeasure()
}

document.addEventListener("nav", () => {
  setupScrollAids()
})
