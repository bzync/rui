import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/#/docs/introduction")
})

test("documentation navigation resolves every configured page", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "The complete link audit only needs one desktop project")

  const links = page.locator(".docs-sidebar a")
  const count = await links.count()
  expect(count).toBeGreaterThan(60)

  const targets = await links.evaluateAll((elements) => elements.map((element) => ({
    href: element.getAttribute("href"),
    label: element.textContent?.trim(),
  })))
  expect(new Set(targets.map(target => target.href)).size).toBe(targets.length)

  for (const target of targets) {
    expect(target.href, `${target.label} has a documentation route`).toMatch(/^#\/[a-z0-9/-]+$/)
    await page.evaluate((href) => { window.location.hash = href!.slice(1) }, target.href)
    await expect(page.locator(`.docs-sidebar a[href="${target.href}"]`)).toHaveAttribute("aria-current", "page")
    await expect(page.locator("main h1")).toBeVisible()
  }
})

test("every component page includes a live preview, copyable code, and API reference", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "The complete component audit only needs one desktop project")

  const componentTargets = await page.locator('.docs-sidebar a[href^="#/components/"]').evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("href")).filter((href): href is string => Boolean(href)),
  )
  expect(componentTargets.length).toBeGreaterThan(60)

  for (const [index, target] of componentTargets.entries()) {
    await page.evaluate((href) => { window.location.hash = href.slice(1) }, target)
    await expect(page.locator(".component-preview-canvas")).toHaveCount(1)
    await expect(page.locator(".component-preview-canvas > *").first()).toBeAttached()
    if (target.endsWith("/heatmap-chart")) {
      const cell = page.locator("[data-heatmap-cell]").first()
      await expect(cell).toBeVisible()
      const backgroundColor = await cell.evaluate((element) => getComputedStyle(element).backgroundColor)
      expect(backgroundColor).not.toBe("rgba(0, 0, 0, 0)")
      expect(backgroundColor).not.toContain("NaN")
    }
    await page.getByRole("tab", { name: "Code" }).click()
    await expect(page.locator(".component-preview-code button")).toHaveCount(1)
    if (index === 0) {
      await page.locator(".component-preview-code button").click()
      await expect(page.locator(".component-preview-code button")).toContainText("Copied")
    }
    await expect(page.locator("#api-reference .docs-props-table")).toHaveCount(1)
  }
})

test("homepage gets developers from installation to a working preview", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: "Components for operational software." })).toBeVisible()
  await expect(page.getByLabel("Example order operations dashboard built with rui")).toBeVisible()
  await expect(page.getByText("npm install @bzync/rui framer-motion", { exact: true })).toBeVisible()
  await expect(page.getByRole("button", { name: "Review orders" })).toBeVisible()
  await expect(page.getByText("Not accepting collaboration requests at this time.")).toBeVisible()
  await expect(page.getByRole("link", { name: "Support development" })).toHaveAttribute("href", "https://buymeacoffee.com/adminjw")

  await page.getByRole("button", { name: "View components" }).click()
  await expect(page).toHaveURL(/#\/components$/)
  await expect(page.getByRole("heading", { level: 1, name: "Component overview" })).toBeVisible()
})

test("demo publishes installable PWA metadata and branded icons", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "PWA assets only need one browser audit")

  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/favicon-32.png")
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest")
  await expect(page.locator('.docs-brand img[src="/rui-icon-192.png"]')).toBeVisible()
  await expect(page.locator('.docs-footer-brand img[src="/rui-icon-192.png"]')).toBeVisible()

  await page.goto("/#/components/navigation")
  await expect(page.locator('.component-preview-canvas img[src="/rui-icon-192.png"]')).toBeVisible()

  await page.goto("/#/examples/authentication")
  await expect(page.locator('.auth-brand img[src="/rui-icon-192.png"]')).toBeVisible()
  await expect(page.locator(".auth-brand")).toContainText("@bzync/rui")

  const faviconResponse = await page.request.get("/favicon-32.png")
  expect(faviconResponse.ok()).toBe(true)
  const manifestResponse = await page.request.get("/manifest.webmanifest")
  expect(manifestResponse.ok()).toBe(true)
  const manifest = await manifestResponse.json()
  expect(manifest).toMatchObject({
    name: "@bzync/rui Component Library",
    display: "standalone",
    start_url: "/#/docs/introduction",
  })
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: "/rui-icon-192.png", sizes: "192x192" }),
    expect.objectContaining({ src: "/rui-icon-512.png", sizes: "512x512" }),
  ]))

  await expect.poll(async () => (await page.request.get("/sw.js")).ok()).toBe(true)
})

test("component catalog filters by text and category", async ({ page }) => {
  await page.goto("/#/components")
  const filter = page.getByRole("textbox", { name: "Filter component catalog" })
  await filter.fill("dialog")
  await expect(page.getByRole("status")).toContainText("2 components")
  await expect(page.locator("main").getByRole("link", { name: /Modal/ })).toBeVisible()
  await page.getByRole("button", { name: "Data" }).click()
  await expect(page.getByRole("status")).toContainText("0 components")
  await page.getByRole("button", { name: "Clear filters" }).click()
  await expect(filter).toHaveValue("")
})

test("table preview supports accessible collapsible rows", async ({ page }) => {
  await page.goto("/#/components/table")
  const apiToggle = page.getByRole("button", { name: "Collapse api-gateway details" })
  await expect(apiToggle).toHaveAttribute("aria-expanded", "true")
  await expect(page.locator("#service-1-details")).toBeVisible()
  await apiToggle.click()
  await expect(page.locator("#service-1-details")).toBeHidden()
  const workerToggle = page.getByRole("button", { name: "Expand worker details" })
  await workerToggle.click()
  await expect(page.getByRole("button", { name: "Collapse worker details" })).toHaveAttribute("aria-expanded", "true")
  await expect(page.locator("#service-2-details")).toBeVisible()
})

test("command search recognizes component aliases and opens a result", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Search documentation" })).toBeVisible()
  const modifier = process.platform === "darwin" ? "Meta" : "Control"
  await page.keyboard.down(modifier)
  await page.keyboard.press("k")
  await page.keyboard.up(modifier)
  const dialog = page.getByRole("dialog", { name: "Search documentation" })
  await expect(dialog).toBeVisible()
  const input = dialog.getByRole("textbox", { name: "Search components and docs" })
  await input.fill("dialog")
  await expect(dialog.getByRole("option", { name: /Modal/ })).toBeVisible()
  await input.press("Enter")
  await expect(page).toHaveURL(/#\/components\/modal$/)
  await expect(page.getByRole("heading", { level: 1, name: "Modal" })).toBeVisible()
})

test("search supports arrow-key result selection", async ({ page }) => {
  await page.getByRole("button", { name: "Search documentation" }).click()
  const dialog = page.getByRole("dialog", { name: "Search documentation" })
  const input = dialog.getByRole("textbox", { name: "Search components and docs" })
  await input.fill("theme")
  await input.press("ArrowDown")
  await expect(dialog.getByRole("option").nth(1)).toHaveAttribute("aria-selected", "true")
})

test("copy interaction provides visible feedback", async ({ page }) => {
  const copy = page.getByRole("button", { name: "Copy command" }).first()
  await copy.click()
  await expect(page.getByRole("button", { name: "Copied command" }).first()).toContainText("Copied")
})

test("light, dark, and system preferences are selectable and persistent", async ({ page }) => {
  await page.getByRole("button", { name: /Theme:/ }).click()
  await page.getByRole("menuitem", { name: "Dark" }).click()
  await expect(page.locator("html")).toHaveClass(/dark/)
  await expect(page.getByRole("button", { name: "Theme: Dark" })).toBeVisible()

  await page.reload()
  await expect(page.locator("html")).toHaveClass(/dark/)
  await page.getByRole("button", { name: "Theme: Dark" }).click()
  await page.getByRole("menuitem", { name: "System" }).click()
  await expect(page.getByRole("button", { name: "Theme: System" })).toBeVisible()
})

test("interactive component references exercise real overlay behavior", async ({ page }) => {
  await page.goto("/#/components/modal")
  const trigger = page.getByRole("button", { name: "Create API key" })
  await trigger.focus()
  await trigger.press("Enter")
  const dialog = page.getByRole("dialog", { name: "Create API key" })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByLabel("Key name")).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("select and tabs retain keyboard interaction inside the docs", async ({ page }) => {
  await page.goto("/#/components/select")
  const select = page.getByRole("combobox", { name: "Region" })
  await select.click()
  await page.getByRole("option", { name: "EU Central — Frankfurt" }).click()
  await expect(select).toContainText("EU Central — Frankfurt")

  await page.goto("/#/components/tabs")
  const overview = page.getByRole("tab", { name: "Overview" }).last()
  await overview.focus()
  await overview.press("ArrowRight")
  await expect(page.getByRole("tab", { name: "Deployments" }).last()).toHaveAttribute("aria-selected", "true")
  await expect(page.getByText("The latest deployment completed 8 minutes ago.")).toBeVisible()
})

test("mobile navigation is a touch-usable drawer", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile drawer is only shown on mobile projects")
  await page.getByRole("button", { name: "Open documentation navigation" }).click()
  const drawer = page.getByRole("dialog", { name: "Documentation" })
  await expect(drawer).toBeVisible()
  await drawer.getByRole("link", { name: "Button", exact: true }).click()
  await expect(drawer).toBeHidden()
  await expect(page).toHaveURL(/#\/components\/button$/)
  await expect(page.getByRole("heading", { level: 1, name: "Button" })).toBeVisible()
})

test("documentation stays within the responsive viewport", async ({ page }) => {
  await page.goto("/#/examples/team-management")
  await expect(page.getByRole("heading", { level: 1, name: "Team management" })).toBeVisible()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow, "page has no horizontal canvas overflow").toBeLessThanOrEqual(1)
  await expect(page.locator("table")).toBeVisible()
})

test("route metadata follows the current documentation page", async ({ page }) => {
  await page.goto("/#/components/button")
  await expect(page).toHaveTitle("Button – @bzync/rui")
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Button documentation for @bzync\/rui/)
})
