// @ts-check
import { defineConfig } from 'astro/config'
import { readdir, rename } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

async function normalizeHtmlOutput(directory) {
    const entries = await readdir(directory, { withFileTypes: true })

    await Promise.all(entries.map(async (entry) => {
        const path = `${directory}/${entry.name}`

        if (entry.isDirectory()) {
            await normalizeHtmlOutput(path)
        } else if (entry.name.endsWith('.html.html')) {
            await rename(path, path.slice(0, -5))
        }
    }))
}

const legacyHtmlRoutes = {
    name: 'legacy-html-routes',
    hooks: {
        'astro:build:done': async ({ dir }) => {
            await normalizeHtmlOutput(fileURLToPath(dir))
        },
    },
}

// https://astro.build/config
export default defineConfig({
    site: 'https://densorugby-sudo.github.io',
    base: '/densorugby.github.io',
    build: {
        format: 'file',
    },
    integrations: [legacyHtmlRoutes],
})
