import { expect, test, type Locator } from "@playwright/test"

async function expectCopyControlInline(button: Locator) {
  const layout = await button.evaluate((element) => {
    const icon = element.querySelector("svg")?.getBoundingClientRect()
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    let textNode: Node | null = null
    while (walker.nextNode()) {
      if (walker.currentNode.textContent?.trim()) {
        textNode = walker.currentNode
        break
      }
    }
    if (!icon || !textNode) return null
    const textRange = document.createRange()
    textRange.selectNodeContents(textNode)
    const label = textRange.getBoundingClientRect()
    return {
      iconRight: icon.right,
      iconCenterY: icon.top + icon.height / 2,
      labelLeft: label.left,
      labelCenterY: label.top + label.height / 2,
    }
  })

  expect(layout).not.toBeNull()
  expect(layout!.labelLeft).toBeGreaterThanOrEqual(layout!.iconRight)
  expect(Math.abs(layout!.labelCenterY - layout!.iconCenterY)).toBeLessThan(3)
}

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
    await expect(page.getByText("This example could not be formatted.")).toHaveCount(0)
    await expect(page.locator(".component-preview-code")).not.toContainText("__ruiPreview")
    await expect(page.locator(".component-preview-code button")).toHaveCount(1)
    if (index === 0) {
      await page.locator(".component-preview-code button").click()
      await expect(page.locator(".component-preview-code button")).toContainText("Copied")
    }
    await expect(page.locator("#api-reference .docs-props-table")).toHaveCount(1)
  }
})

test("demo formats displayed and copied component code", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "Code formatting only needs one desktop project")

  await page.goto("/#/components/billing-interval-toggle")
  await page.getByRole("tab", { name: "Code" }).click()

  const code = page.locator(".component-preview-code table")
  await expect(code).toContainText("<BillingIntervalToggle")
  const displayedCode = await code.innerText()
  expect(displayedCode).toContain("\n  value={interval}\n")
  expect(displayedCode).toContain("\n  size=\"lg\"\n/>")

  await page.context().grantPermissions(["clipboard-read", "clipboard-write"])
  await page.getByRole("button", { name: "Copy code" }).click()
  const copiedCode = await page.evaluate(() => navigator.clipboard.readText())
  expect(copiedCode).toContain("\n  value={interval}\n")
  expect(copiedCode).toContain("\n  size=\"lg\"\n/>")
})

test("billing interval toggles stay inside the preview at every viewport", async ({ page }) => {
  await page.goto("/#/components/billing-interval-toggle")

  const canvasBox = await page.locator(".component-preview-canvas").boundingBox()
  const toggleBoxes = await page.getByRole("group", { name: "Billing interval" }).evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect()
      return { left: box.left, right: box.right }
    }),
  )

  expect(canvasBox).not.toBeNull()
  expect(toggleBoxes).toHaveLength(2)
  for (const box of toggleBoxes) {
    expect(box.left).toBeGreaterThanOrEqual(canvasBox!.x)
    expect(box.right).toBeLessThanOrEqual(canvasBox!.x + canvasBox!.width)
  }

  for (const selected of await page.getByRole("button", { name: /Annually/ }).all()) {
    await expect(selected).toHaveAttribute("aria-pressed", "true")
  }
})

test("homepage gets developers from installation to a working preview", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: "@bzync/rui" })).toBeVisible()
  await expect(page.getByText("Production-ready React components built with Tailwind CSS.", { exact: false })).toBeVisible()
  await expect(page.getByRole("link", { name: "Open @bzync/rui repository" })).toHaveAttribute("href", "https://github.com/bzync/rui")
  await expect(page.getByLabel("Interactive project settings example built with rui")).toBeVisible()
  await expect(page.getByText("npm install @bzync/rui framer-motion", { exact: true })).toBeVisible()
  await expect(page.getByRole("button", { name: "Review orders" })).toBeVisible()
  await expect(page.getByText("React 18.2–19 · TypeScript · ESM + CJS")).toBeVisible()
  await expect(page.locator(".docs-version")).toHaveText(/^v\d+\.\d+\.\d+$/)
  await expect(page.getByRole("link", { name: /Support If @bzync\/rui is useful to you/ })).toHaveAttribute("href", "https://buymeacoffee.com/adminjw")
  await expect(page.getByRole("link", { name: "Support development" })).toHaveAttribute("href", "https://buymeacoffee.com/adminjw")

  await page.getByRole("button", { name: "Save changes" }).click()
  await expect(page.getByRole("status")).toHaveText("Changes saved.")

  await page.getByRole("link", { name: "Browse components" }).click()
  await expect(page).toHaveURL(/#\/components$/)
  await expect(page.getByRole("heading", { level: 1, name: "Component overview" })).toBeVisible()
})

test("radius foundation renders every published token", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "The token audit only needs one desktop project")

  await page.goto("/#/foundations/radius")
  const swatches = page.locator(".radius-swatch")
  await expect(swatches).toHaveCount(5)
  const radii = await swatches.evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).borderRadius),
  )

  expect(radii).toEqual(["4px", "6px", "8px", "10px", "12px"])
})

test("demo publishes installable PWA metadata and branded icons", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "PWA assets only need one browser audit")

  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/favicon-32.png")
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest")
  await expect(page.locator('.docs-brand img[src="/favicon-32.png"]')).toBeVisible()
  await expect(page.locator('.docs-footer-brand img[src="/favicon-32.png"]')).toBeVisible()

  await page.goto("/#/components/navigation")
  await expect(page.locator('.component-preview-canvas img[src="/favicon-32.png"]')).toBeVisible()

  await page.goto("/#/examples/authentication")
  await expect(page.locator('.auth-brand img[src="/favicon-32.png"]')).toBeVisible()
  await expect(page.locator(".auth-brand")).toContainText("@bzync/rui")

  const faviconResponse = await page.request.get("/favicon-32.png")
  expect(faviconResponse.ok()).toBe(true)
  const manifestResponse = await page.request.get("/manifest.webmanifest")
  expect(manifestResponse.ok()).toBe(true)
  const manifest = await manifestResponse.json()
  expect(manifest).toMatchObject({
    name: "@bzync/rui Component Library",
    display: "standalone",
    start_url: "./#/docs/introduction",
  })
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: "rui-icon-192.png", sizes: "192x192" }),
    expect.objectContaining({ src: "rui-icon-512.png", sizes: "512x512" }),
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
  const input = dialog.getByRole("combobox", { name: "Search components and docs" })
  await input.fill("dialog")
  await expect(dialog.getByRole("option", { name: /Modal/ })).toBeVisible()
  await input.press("Enter")
  await expect(page).toHaveURL(/#\/components\/modal$/)
  await expect(page.getByRole("heading", { level: 1, name: "Modal" })).toBeVisible()
})

test("search supports arrow-key result selection", async ({ page }) => {
  await page.getByRole("button", { name: "Search documentation" }).click()
  const dialog = page.getByRole("dialog", { name: "Search documentation" })
  const input = dialog.getByRole("combobox", { name: "Search components and docs" })
  await input.fill("theme")
  await input.press("ArrowDown")
  await expect(dialog.getByRole("option").nth(1)).toHaveAttribute("aria-selected", "true")
})

test("copy interaction provides visible feedback", async ({ page }) => {
  const copy = page.getByRole("button", { name: "Copy command" }).first()
  await expectCopyControlInline(copy)
  await copy.click()
  const copied = page.getByRole("button", { name: "Copied command" }).first()
  await expect(copied).toContainText("Copied")
  await expectCopyControlInline(copied)

  await page.goto("/#/components/code-block")
  await expectCopyControlInline(page.getByRole("button", { name: "Copy code" }).first())

  await page.goto("/#/components/copy-button")
  await expectCopyControlInline(page.getByRole("button", { name: "Copy API key" }))
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

test("custom time picker and formatted text remain usable at every viewport", async ({ page }) => {
  await page.goto("/#/components/time-picker")
  const trigger = page.getByRole("button", { name: "Deployment time" })
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: "Choose deployment time" })
  await expect(dialog).toBeVisible()

  const bounds = await dialog.boundingBox()
  const viewport = page.viewportSize()
  expect(bounds).not.toBeNull()
  expect(viewport).not.toBeNull()
  expect(bounds!.x).toBeGreaterThanOrEqual(0)
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport!.width + 1)
  expect(bounds!.y).toBeGreaterThanOrEqual(0)
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport!.height + 1)

  if (viewport!.width < 640) {
    expect(Math.abs(viewport!.height - (bounds!.y + bounds!.height) - 8)).toBeLessThanOrEqual(2)
    await expect(page.locator(".fixed.inset-0.bg-overlay")).toBeVisible()
    for (const control of [dialog.getByRole("button", { name: "Now" }), dialog.getByRole("button", { name: "Cancel" }), dialog.getByRole("button", { name: "Apply" })]) {
      expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(40)
    }
    expect((await dialog.getByRole("listbox", { name: "Hour" }).getByRole("option", { name: "09" }).boundingBox())!.height).toBeGreaterThanOrEqual(44)
  }

  await dialog.getByRole("listbox", { name: "Hour" }).getByRole("option", { name: "11" }).click()
  await dialog.getByRole("listbox", { name: "Minute" }).getByRole("option", { name: "45" }).click()
  await dialog.getByRole("button", { name: "Apply" }).click()
  await expect(trigger).toContainText("11:45 AM")
  await expect(trigger).toBeFocused()

  await page.goto("/#/components/text")
  await expect(page.locator(".component-preview-canvas time")).toHaveCount(2)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow, "formatted text does not cause horizontal viewport overflow").toBeLessThanOrEqual(1)
})

test("date picker stays within the viewport and supports calendar keyboard navigation", async ({ page }) => {
  await page.goto("/#/components/date-picker")
  const trigger = page.getByRole("button", { name: "Deployment date", exact: true })
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: "Choose deployment date" })
  await expect(dialog).toBeVisible()

  const bounds = await dialog.boundingBox()
  const viewport = page.viewportSize()
  expect(bounds).not.toBeNull()
  expect(viewport).not.toBeNull()
  expect(bounds!.x).toBeGreaterThanOrEqual(0)
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport!.width + 1)
  expect(bounds!.y).toBeGreaterThanOrEqual(0)
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport!.height + 1)

  const selected = dialog.locator('[data-date="2026-09-18"]')
  await expect(selected).toBeFocused()
  if (viewport!.width < 640) {
    await expect.poll(async () => {
      const settledBounds = await dialog.boundingBox()
      return Math.abs(viewport!.height - (settledBounds!.y + settledBounds!.height) - 8)
    }).toBeLessThanOrEqual(2)
    expect((await selected.boundingBox())!.height).toBeGreaterThanOrEqual(40)
  }
  await selected.press("ArrowRight")
  const nextDay = dialog.locator('[data-date="2026-09-19"]')
  await expect(nextDay).toBeFocused()
  await nextDay.press("Enter")
  await expect(trigger).toContainText("Sep 19, 2026")
  await expect(trigger).toBeFocused()
})

test("info button provides contextual help without an ambiguous target", async ({ page }) => {
  await page.goto("/#/components/info-button")
  const trigger = page.getByRole("button", { name: "Learn about monthly request limits" })
  await expect(trigger).toBeVisible()
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: "Monthly request limit" })
  await expect(dialog).toContainText("Successful API requests count")
  await dialog.getByRole("button", { name: "Got it" }).click()
  await expect(dialog).toBeHidden()
})

test("mobile navigation is a touch-usable drawer", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile drawer is only shown on mobile projects")
  await page.getByRole("button", { name: "Open documentation navigation" }).click()
  const drawer = page.getByRole("dialog", { name: "Documentation" })
  await expect(drawer).toBeVisible()
  const search = drawer.getByRole("button", { name: "Search documentation" })
  const searchIcon = search.locator("svg")
  const searchLabel = search.locator(":scope > span").last()
  const [iconBox, labelBox] = await Promise.all([searchIcon.boundingBox(), searchLabel.boundingBox()])
  expect(iconBox).not.toBeNull()
  expect(labelBox).not.toBeNull()
  expect(Math.abs((iconBox!.y + iconBox!.height / 2) - (labelBox!.y + labelBox!.height / 2))).toBeLessThanOrEqual(1)
  await drawer.getByRole("link", { name: "Button", exact: true }).click()
  await expect(drawer).toBeHidden()
  await expect(page).toHaveURL(/#\/components\/button$/)
  await expect(page.getByRole("heading", { level: 1, name: "Button" })).toBeVisible()
})

test("mobile documentation pages remain vertically scrollable", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Vertical touch scrolling is only checked on mobile projects")
  await expect(page.getByRole("heading", { level: 1, name: "@bzync/rui" })).toBeVisible()
  await page.mouse.wheel(0, 500)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
})

test("wide component previews remain horizontally scrollable on mobile", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Wide preview overflow is only relevant on mobile projects")

  for (const route of ["calendar", "tabs", "navigation", "table", "gantt-chart", "code-block"]) {
    await page.goto(`/#/components/${route}`)

    const canvas = page.locator(".component-preview-canvas")
    const rootBounds = await canvas.evaluate((element) => {
      const canvasRect = element.getBoundingClientRect()
      const rootRect = element.firstElementChild?.getBoundingClientRect()
      return {
        canvasLeft: canvasRect.left,
        canvasRight: canvasRect.right,
        rootLeft: rootRect?.left ?? 0,
        rootRight: rootRect?.right ?? 0,
      }
    })
    expect(rootBounds.rootLeft, `${route} preview starts inside its canvas`).toBeGreaterThanOrEqual(rootBounds.canvasLeft - 1)
    expect(rootBounds.rootRight, `${route} preview ends inside its canvas`).toBeLessThanOrEqual(rootBounds.canvasRight + 1)

    const scroller = canvas.locator(".overflow-x-auto").first()
    await expect(scroller).toBeVisible()
    const scrollState = await scroller.evaluate((element) => {
      element.scrollLeft = 40
      return {
        available: element.scrollWidth - element.clientWidth,
        position: element.scrollLeft,
      }
    })
    expect(scrollState.available, `${route} does not report negative overflow`).toBeGreaterThanOrEqual(0)
    expect(scrollState.position, `${route} fits or its horizontal overflow can scroll`).toBe(Math.min(40, scrollState.available))
  }
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
