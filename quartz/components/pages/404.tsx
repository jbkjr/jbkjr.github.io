import { i18n } from "../../i18n"
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
      <h1>404</h1>
      <p>{i18n(cfg.locale).pages.error.notFound}</p>
      <nav class="not-found-links" aria-label="Sections of this site">
        <a href={baseDir || "/"}>{i18n(cfg.locale).pages.error.home}</a>
        {destinations.map(({ path, label }) => (
          <a href={`${baseDir}/${path}`}>{label}</a>
        ))}
      </nav>
    </article>
  )
}

NotFound.css = style

export default (() => NotFound) satisfies QuartzComponentConstructor
