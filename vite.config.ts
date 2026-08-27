import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { readdirSync } from "node:fs";
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

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
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
