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
  return (await formatter.format(source)).trim()
}
