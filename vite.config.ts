import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const componentEntries = Object.fromEntries(
    readdirSync(resolve(import.meta.dirname, "src/components"), {
        withFileTypes: true,
    })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
        .map((entry) => {
            const name = entry.name.slice(0, -4);
            return [
                `components/${name}`,
                resolve(import.meta.dirname, "src/components", entry.name),
            ];
        }),
);

const entries = {
    index: resolve(import.meta.dirname, "src/index.ts"),
    ...componentEntries,
    "components/charts": resolve(
        import.meta.dirname,
        "src/components/charts/index.ts",
    ),
};

/**
 * Emits dist/theme.css: the library's `@theme` tokens re-declared as
 * `@theme reference` for a consumer's own Tailwind v4 build. dist/styles.css is
 * compiled CSS, so its tokens reach the consumer only as plain custom
 * properties; Tailwind in the consuming app never learns the names and cannot
 * generate utilities such as `bg-danger` or `border-info` for app code.
 * Importing theme.css registers the names without emitting any CSS (the values
 * still come from styles.css and ThemeProvider at runtime). Generated from
 * globals.css so the two can never drift.
 */
function tailwindThemeExport(): Plugin {
    return {
        name: "rui-tailwind-theme-export",
        generateBundle(options) {
            if (options.format !== "es") return;
            const css = readFileSync(
                resolve(import.meta.dirname, "src/styles/globals.css"),
                "utf8",
            );
            const open = css.indexOf("@theme static {");
            if (open === -1) {
                this.error("globals.css has no `@theme static {` block");
            }
            let depth = 0;
            let close = -1;
            for (let i = css.indexOf("{", open); i < css.length; i++) {
                if (css[i] === "{") depth++;
                else if (css[i] === "}" && --depth === 0) {
                    close = i;
                    break;
                }
            }
            if (close === -1) this.error("unterminated @theme block");
            const body = css.slice(css.indexOf("{", open) + 1, close);
            this.emitFile({
                type: "asset",
                fileName: "theme.css",
                source: [
                    "/* @bzync/rui design tokens for Tailwind CSS v4.",
                    " *",
                    " * Import after tailwindcss in your app's CSS entry to get utilities",
                    " * for every library token (bg-success, text-danger-strong,",
                    " * border-info/25, bg-accent-500, shadow-floating, ...):",
                    " *",
                    ' *   @import "tailwindcss";',
                    ' *   @import "@bzync/rui/theme.css";',
                    " *",
                    " * `reference` registers the names only; it emits no CSS. Load",
                    " * @bzync/rui/styles.css as usual for the runtime values. */",
                    "@theme reference {" + body + "}",
                    "",
                ].join("\n"),
            });
        },
    };
}

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        tailwindThemeExport(),
        dts({
            insertTypesEntry: true,
            include: [
                "src/index.ts",
                "src/vite-end.d.ts",
                "src/components",
                "src/lib",
            ],
            exclude: ["src/**/__tests__/**", "src/**/*.test.*"],
        }),
    ],

    resolve: {
        alias: {
            "@": resolve(import.meta.dirname, "src"),
        },
    },

    build: {
        assetsInlineLimit: 0,
        lib: {
            entry: entries,
            formats: ["es", "cjs"],
            fileName: (format, entryName) =>
                `${entryName}.${format === "cjs" ? "cjs" : "js"}`,
            cssFileName: "styles",
        },

        rolldownOptions: {
            // Declaration generation is intentionally the dominant plugin hook
            // for this library. Keep type errors enabled, but suppress Rolldown's
            // ratio-based timing warning for this known build step.
            checks: {
                pluginTimings: false,
            },
            external: [
                "react",
                "react-dom",
                "react/jsx-runtime",
                "framer-motion",
            ],
        },
    },
});
