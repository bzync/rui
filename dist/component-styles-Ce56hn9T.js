//#region src/lib/component-styles.ts
var e = "flex w-full flex-col gap-1.5", t = "text-sm font-medium leading-5 text-foreground", n = "text-xs leading-5 text-muted-foreground", r = "text-xs leading-5 text-destructive", i = [
	"border border-border bg-surface text-foreground shadow-xs",
	"transition-[border-color,box-shadow,background-color] duration-150",
	"hover:border-border-strong",
	"focus-within:border-accent-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-focus-ring/20",
	"has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-surface-muted has-[:disabled]:opacity-60",
	"has-[:read-only]:bg-surface-muted"
].join(" "), a = "border-destructive/60 hover:border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/20", o = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg", s = [
	"inline-flex size-8 shrink-0 items-center justify-center rounded-md",
	"text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
	"disabled:pointer-events-none disabled:opacity-40",
	o
].join(" ");
//#endregion
export { t as a, s as c, r as i, a as n, e as o, n as r, o as s, i as t };
