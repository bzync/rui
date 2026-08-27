export function portalTarget(id = "rui-portal"): HTMLElement {
  if (typeof document === "undefined") return null as unknown as HTMLElement
  let el = document.getElementById(id)
  if (!el) { el = document.createElement("div"); el.id = id; document.body.appendChild(el) }
  return el
}
