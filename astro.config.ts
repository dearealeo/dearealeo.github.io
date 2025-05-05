import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRenderWhitespace,
} from "@shikijs/transformers";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkCollapse from "remark-collapse";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    mdx({
      remarkRehype: { footnoteLabel: "Footnotes" },
      gfm: false,
      optimize: true,
    }),
    markdoc(),
    partytown(),
  ],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
    ],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "github-light", dark: "github-dark" },
      // defaultColor: false,
      transformers: [
        transformerNotationHighlight({ matchAlgorithm: "v3" }),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
        transformerNotationWordHighlight({ matchAlgorithm: "v3" }),
        transformerNotationFocus({ matchAlgorithm: "v3" }),
        transformerNotationErrorLevel({ matchAlgorithm: "v3" }),
        transformerMetaHighlight(),
        transformerRenderWhitespace(),
      ],
      wrap: true,
    },
    gfm: true,
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
      esbuildOptions: {
        target: "es2020",
        supported: {
          "top-level-await": true,
        },
        legalComments: "none",
        minify: true,
        treeShaking: true,
      },
    },
  },
  image: {
    // Used for all Markdown images; not configurable per-image
    // Used for all `<Image />` and `<Picture />` components unless overridden with a prop
    experimentalLayout: "constrained",
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  experimental: {
    responsiveImages: true,
    clientPrerender: true,
    contentIntellisense: true,
    headingIdCompat: true,
    preserveScriptOrder: true,
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: "Inter Variable",
        cssVariable: "--font-sans",
        display: "auto",
        subsets: ["latin-ext", "greek-ext"],
      },
      {
        provider: fontProviders.fontsource(),
        name: "Noto Sans SC Variable",
        cssVariable: "--font-sans-sc",
        display: "auto",
        subsets: ["chinese-simplified"],
      },
      {
        provider: fontProviders.fontsource(),
        name: "Maple Mono",
        cssVariable: "--font-mono",
        display: "auto",
        weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        styles: ["normal"],
        subsets: ["latin"],
      },
    ],
  }, // Added missing comma here
});
