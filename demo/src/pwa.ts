export function registerPwa() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
      console.error("Unable to register the @bzync/rui service worker.", error)
    })
  })
}
