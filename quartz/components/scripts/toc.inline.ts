let rafScheduled = false
let trackedHeaders: HTMLElement[] = []

function updateInView() {
  rafScheduled = false
  const windowHeight = window.innerHeight
  for (const header of trackedHeaders) {
    const inView = header.getBoundingClientRect().top < windowHeight
    document
      .querySelectorAll(`a[data-for="${header.id}"]`)
      .forEach((link) => link.classList.toggle("in-view", inView))
  }
}

function scheduleUpdate() {
  if (rafScheduled) return
  rafScheduled = true
  requestAnimationFrame(updateInView)
}

function toggleToc(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as HTMLElement | undefined
  if (!content) return
  content.classList.toggle("collapsed")
}

function setupToc() {
  for (const toc of document.getElementsByClassName("toc")) {
    const button = toc.querySelector(".toc-header")
    const content = toc.querySelector(".toc-content")
    if (!button || !content) return
    button.addEventListener("click", toggleToc)
    window.addCleanup(() => button.removeEventListener("click", toggleToc))
  }
}

document.addEventListener("nav", () => {
  setupToc()

  // update toc entry highlighting on scroll/resize, recomputed deterministically
  // from heading positions (replaces an IntersectionObserver that missed events
  // during fast scrolls and hash-jumps, especially in Safari)
  trackedHeaders = Array.from(
    document.querySelectorAll<HTMLElement>("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"),
  )
  updateInView()
  window.addEventListener("scroll", scheduleUpdate, { passive: true })
  window.addEventListener("resize", scheduleUpdate, { passive: true })
  window.addCleanup(() => {
    window.removeEventListener("scroll", scheduleUpdate)
    window.removeEventListener("resize", scheduleUpdate)
  })
})
