import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import GlossaryMeta from "./custom/components/GlossaryMeta"
import GlossaryTOC from "./custom/components/GlossaryTOC"

const sidebarExplorerOptions: Parameters<typeof Component.Explorer>[0] = {
  folderClickBehavior: "link",
  folderDefaultState: "collapsed",
  filterFn: (node) => {
    if (node.slugSegment === "tags") return false
    if (node.data?.slug?.startsWith("posts/") && !node.isFolder) return false
    return true
  },
  mapFn: (node) => {
    if (node.data?.slug === "dhamma/glossary") {
      node.displayName = "glossary"
    }
  },
  sortFn: (a, b) => {
    if (a.isFolder && b.isFolder) {
      const preferredFolderOrder: Record<string, number> = {
        posts: 0,
        projects: 1,
        dhamma: 2,
      }
      const aRank = preferredFolderOrder[a.slugSegment] ?? 100
      const bRank = preferredFolderOrder[b.slugSegment] ?? 100
      if (aRank !== bRank) return aRank - bRank
    }

    if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
      if (!a.isFolder && a.data?.slug?.startsWith("posts/") && b.data?.slug?.startsWith("posts/")) {
        const aDate = new Date(a.data?.date ?? 0)
        const bDate = new Date(b.data?.date ?? 0)
        return bDate.getTime() - aDate.getTime()
      }
      return a.displayName.localeCompare(b.displayName, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }
    return a.isFolder ? -1 : 1
  },
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      LessWrong: "https://www.lesswrong.com/users/jbkjr",
      GitHub: "https://github.com/jbkjr",
      LinkedIn: "https://linkedin.com/in/jbkjr",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) =>
        page.fileData.slug !== "index" &&
        !page.fileData.slug?.startsWith("projects/") &&
        page.fileData.slug !== "dhamma" &&
        page.fileData.slug !== "dhamma/glossary",
    }),
    Component.ConditionalRender({
      component: GlossaryMeta(),
      condition: (page) => page.fileData.slug === "dhamma/glossary",
    }),
    Component.TagList(),
    Component.ConditionalRender({
      component: GlossaryTOC(),
      condition: (page) => page.fileData.slug === "dhamma/glossary",
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(sidebarExplorerOptions),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(sidebarExplorerOptions),
  ],
  right: [],
}
