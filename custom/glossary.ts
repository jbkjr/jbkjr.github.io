import { Root } from "mdast"

import { QuartzTransformerPlugin } from "../quartz/plugins/types"
import { applyGlossaryTransforms } from "./glossary-transforms"

export const DhammaGlossary: QuartzTransformerPlugin = () => ({
  name: "DhammaGlossary",
  markdownPlugins() {
    return [
      () => {
        return (tree: Root, file) => {
          applyGlossaryTransforms(
            tree,
            {
              slug: (file.data.slug as string | undefined) ?? "",
              emitPandocAnchors: false,
            },
            file,
          )
        }
      },
    ]
  },
})
