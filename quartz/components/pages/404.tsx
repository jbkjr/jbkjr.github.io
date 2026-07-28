import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/notFound.scss"

// The site moved from Jekyll, so a stale inbound link is the likeliest way to
// land here — offer the sections by name rather than only a link home.
const destinations = [
  { path: "posts", label: "Writing" },
  { path: "dhamma/glossary", label: "A Dhamma Glossary" },
  { path: "projects", label: "Research" },
]

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  // If baseUrl contains a pathname after the domain, use this as the home link
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname.replace(/\/$/, "")

  return (
    <article class="popover-hint not-found">
      <p class="not-found-code">404</p>
      <h1>Page not found</h1>
      <p class="not-found-quip">
        Impermanent, like all conditioned things — this page may have moved, or never arisen at all.
      </p>
      <nav class="not-found-links" aria-label="Sections of this site">
        <a href={baseDir || "/"}>Home</a>
        {destinations.map(({ path, label }) => (
          <a href={`${baseDir}/${path}`}>{label}</a>
        ))}
      </nav>
    </article>
  )
}

NotFound.css = style

export default (() => NotFound) satisfies QuartzComponentConstructor
