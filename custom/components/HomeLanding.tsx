import { QuartzPluginData } from "../../quartz/plugins/vfile"
import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../quartz/components/types"
import { Date, getDate } from "../../quartz/components/Date"
import { FullSlug, resolveRelative } from "../../quartz/util/path"
import { classNames } from "../../quartz/util/lang"

interface Destination {
  /** Slug of the page this card opens. */
  slug: FullSlug
  title: string
  blurb: string
  /** Prefix of the slugs counted for this card's badge, if it has one. */
  countPrefix?: string
  countNoun?: string
}

interface Options {
  destinations: Destination[]
  /** How many of the most recent posts to list. */
  recentLimit: number
}

const defaultOptions: Options = {
  destinations: [],
  recentLimit: 4,
}

// The glossary publishes its headword index onto its own file data; reading it
// here keeps the "N terms" badge honest without a second source of truth.
function glossaryTermCount(allFiles: QuartzPluginData[]): number | undefined {
  const glossary = allFiles.find((file) => file.slug === "dhamma/glossary")
  const headwords = glossary?.glossaryHeadwords
  return headwords
    ? new Set(headwords.map((entry) => entry.headword.normalize("NFC"))).size
    : undefined
}

function isPost(file: QuartzPluginData): boolean {
  return Boolean(file.slug?.startsWith("posts/")) && file.slug !== "posts/index"
}

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const HomeLanding: QuartzComponent = ({
    allFiles,
    cfg,
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    const here = fileData.slug!

    const recent = allFiles
      .filter(isPost)
      .sort((a, b) => (getDate(cfg, b)?.getTime() ?? 0) - (getDate(cfg, a)?.getTime() ?? 0))
      .slice(0, opts.recentLimit)

    const countFor = (destination: Destination): string | undefined => {
      if (destination.slug === "dhamma/glossary") {
        const terms = glossaryTermCount(allFiles)
        return terms ? `${terms} terms` : undefined
      }
      if (!destination.countPrefix) return undefined
      const total = allFiles.filter(
        (file) =>
          file.slug?.startsWith(`${destination.countPrefix}/`) &&
          file.slug !== `${destination.countPrefix}/index`,
      ).length
      return total ? `${total} ${destination.countNoun ?? "pages"}` : undefined
    }

    return (
      <div class={classNames(displayClass, "home-landing")}>
        <nav class="home-destinations" aria-label="Sections of this site">
          {opts.destinations.map((destination) => {
            const count = countFor(destination)
            return (
              <a class="home-destination" href={resolveRelative(here, destination.slug)}>
                <span class="home-destination-title">
                  {destination.title}
                  {count && <span class="home-destination-count">{count}</span>}
                </span>
                <span class="home-destination-blurb">{destination.blurb}</span>
              </a>
            )
          })}
        </nav>

        {recent.length > 0 && (
          <section class="home-recent">
            <h2 class="home-recent-heading">
              Recent writing
              <a class="home-recent-all" href={resolveRelative(here, "posts" as FullSlug)}>
                All posts →
              </a>
            </h2>
            <ul class="home-recent-list">
              {recent.map((page) => {
                const date = getDate(cfg, page)
                return (
                  <li>
                    <a class="home-recent-title" href={resolveRelative(here, page.slug!)}>
                      {page.frontmatter?.title}
                    </a>
                    <span class="home-recent-meta">
                      {date && <Date date={date} locale={cfg.locale} />}
                      {(page.frontmatter?.tags ?? []).slice(0, 3).map((tag) => (
                        <span class="home-recent-tag">{tag}</span>
                      ))}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>
    )
  }

  return HomeLanding
}) satisfies QuartzComponentConstructor<Partial<Options>>
