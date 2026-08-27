export function registerPwa() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error: unknown) => {
      console.error("Unable to register the @bzync/rui service worker.", error)
    })
  })
}
