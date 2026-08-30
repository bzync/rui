const prettierOptions = {
  parser: "babel-ts",
  printWidth: 80,
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
} as const

let formatterPromise: Promise<{
  format: (source: string) => Promise<string>
}> | null = null

async function loadFormatter() {
  // During the build-time prerender pass (scripts/prerender.mjs) the snapshot
  // must match React's first client render, which shows the raw snippet. Skip
  // Prettier there so no formatted text is baked into index.html; it still runs
  // normally in the browser after hydration.
  if (typeof window !== "undefined" && (window as { __RUI_PRERENDER__?: boolean }).__RUI_PRERENDER__) {
    return { format: async (source: string) => source }
  }

  formatterPromise ??= Promise.all([
    import("prettier/standalone"),
    import("prettier/plugins/babel"),
    import("prettier/plugins/estree"),
  ]).then(([prettier, babel, estree]) => ({
    format: (source: string) => prettier.format(source, {
      ...prettierOptions,
      plugins: [babel.default, estree.default],
    }),
  }))

  return formatterPromise
}

export async function formatCode(source: string) {
  const formatter = await loadFormatter()
  const trimmedSource = source.trim()

  try {
    const formatted = (await formatter.format(trimmedSource)).trim()
    return trimmedSource.startsWith("<") ? formatted.replace(/^;/, "") : formatted
  } catch (initialError) {
    if (trimmedSource.startsWith("<")) {
      try {
        const wrapped = (await formatter.format(`const __ruiPreview = (<>\n${trimmedSource}\n</>)`)).trim()
        return wrapped
          .replace(/^const __ruiPreview = \(\s*<>\s*/, "")
          .replace(/\s*<\/>\s*\)$/, "")
          .trim()
      } catch {
        return trimmedSource
      }
    }

    const withSafeJsxBoundaries = trimmedSource.replace(/^<(?=[A-Za-z])/gm, ";<")
    if (withSafeJsxBoundaries === trimmedSource) {
      void initialError
      return trimmedSource
    }

    try {
      return (await formatter.format(withSafeJsxBoundaries)).trim().replace(/^;/, "")
    } catch {
      return trimmedSource
    }
  }
}
