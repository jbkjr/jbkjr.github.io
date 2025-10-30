import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

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
        page.fileData.slug !== "index" && !page.fileData.slug?.startsWith("projects/"),
    }),
    Component.TagList(),
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
    Component.Explorer({
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
      filterFn: (node) => {
        // Default: hide tags folder
        if (node.slugSegment === "tags") return false
        // Hide individual post pages (but keep the posts folder)
        if (node.data?.slug?.startsWith("posts/") && !node.isFolder) return false
        return true
      },
      sortFn: (a, b) => {
        // Sort folders first, then files
        if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
          // For posts, sort by date (newest first)
          if (
            !a.isFolder &&
            a.data?.slug?.startsWith("posts/") &&
            b.data?.slug?.startsWith("posts/")
          ) {
            const aDate = new Date(a.data?.date ?? 0)
            const bDate = new Date(b.data?.date ?? 0)
            return bDate.getTime() - aDate.getTime() // Newest first
          }
          // For other files/folders, sort alphabetically
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        }
        return a.isFolder ? -1 : 1
      },
    }),
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
    Component.Explorer({
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
      filterFn: (node) => {
        // Default: hide tags folder
        if (node.slugSegment === "tags") return false
        // Hide individual post pages (but keep the posts folder)
        if (node.data?.slug?.startsWith("posts/") && !node.isFolder) return false
        return true
      },
      sortFn: (a, b) => {
        // Sort folders first, then files
        if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
          // For posts, sort by date (newest first)
          if (
            !a.isFolder &&
            a.data?.slug?.startsWith("posts/") &&
            b.data?.slug?.startsWith("posts/")
          ) {
            const aDate = new Date(a.data?.date ?? 0)
            const bDate = new Date(b.data?.date ?? 0)
            return bDate.getTime() - aDate.getTime() // Newest first
          }
          // For other files/folders, sort alphabetically
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        }
        return a.isFolder ? -1 : 1
      },
    }),
  ],
  right: [],
}
