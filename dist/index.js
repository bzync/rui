import { t as e } from "./cn-DpgY2leY.js";
import { Accordion as t, Collapsible as n } from "./components/accordion.js";
import { t as r } from "./calendar-CdICOROs.js";
import { Alert as i } from "./components/alert.js";
import { AuthBackdrop as a } from "./components/auth-backdrop.js";
import { t as ee } from "./autocomplete-CfbfpcO4.js";
import { t as o } from "./use-event-callback-DGkfO_uu.js";
import { Avatar as te } from "./components/avatar.js";
import { Badge as ne, badgeVariants as re } from "./components/badge.js";
import { BillingIntervalToggle as ie } from "./components/billing-interval-toggle.js";
import { Breadcrumb as ae } from "./components/breadcrumb.js";
import { Button as oe, buttonSizes as s, buttonVariants as c } from "./components/button.js";
import { Callout as l } from "./components/callout.js";
import { Card as u, CardBody as d, CardDescription as f, CardFooter as p, CardHeader as m, CardTitle as h, cardVariants as g } from "./components/card.js";
import { a as _, c as v, i as y, l as b, n as x, o as S, r as C, s as w, t as T, u as E } from "./charts-CxEy2c3M.js";
import { Checkbox as D } from "./components/checkbox.js";
import { CodeBlock as O, CodeEditor as k, InlineCode as A } from "./components/code.js";
import { a as j, i as M, n as N, r as P, t as F } from "./focus-Dk1YWVPN.js";
import { CommandPalette as I, CommandProvider as L, useCommand as R } from "./components/command.js";
import { Modal as z, ModalBody as B, ModalDescription as V, ModalFooter as H, ModalHeader as U, ModalTitle as W } from "./components/modal.js";
import { ConfirmDialog as G } from "./components/confirm-dialog.js";
import { CopyButton as K } from "./components/copy-button.js";
import { t as q } from "./datatable-DlBhUhuO.js";
import { DatePicker as se } from "./components/datepicker.js";
import { t as ce } from "./theme-toggle-CnoiorKV.js";
import { t as le } from "./drawer-CqkVZT9Y.js";
import { DropdownMenu as ue } from "./components/dropdown-menu.js";
import { EmptyState as de } from "./components/empty-state.js";
import { ErrorState as fe } from "./components/error-state.js";
import { FileUpload as pe } from "./components/file-upload.js";
import { FormField as me } from "./components/form-field.js";
import { Input as he } from "./components/input.js";
import { InfoButton as ge } from "./components/info-button.js";
import { Kbd as _e } from "./components/kbd.js";
import { Label as ve } from "./components/label.js";
import { Link as ye } from "./components/link.js";
import { List as be, ListItem as xe } from "./components/list.js";
import { AppShell as Se, AppShellBody as Ce, AppShellHeader as we, AppShellMain as Te, Container as Ee, Footer as De, Inline as Oe, PageHeader as ke, Stack as Ae } from "./components/layout.js";
import { BottomBar as je, BrandLink as Me, IconButton as Ne, Navbar as Pe, NavigationLink as Fe, Sidebar as J, Topbar as Ie, TopbarTitle as Le } from "./components/navigation.js";
import { NumberInput as Re } from "./components/number-input.js";
import { OtpInput as ze } from "./components/otp-input.js";
import { Pagination as Be } from "./components/pagination.js";
import { Popover as Ve, PopoverContent as He } from "./components/popover.js";
import { Progressbar as Ue } from "./components/progressbar.js";
import { Radio as We, RadioGroup as Ge } from "./components/radio.js";
import { RichTextEditor as Ke } from "./components/richtext.js";
import { t as qe } from "./select-Ch5fp1GT.js";
import { Separator as Je } from "./components/separator.js";
import { Skeleton as Ye, SkeletonAvatar as Xe, SkeletonCard as Ze, SkeletonTable as Qe, SkeletonText as $e, SkeletonTopbar as et } from "./components/skeleton.js";
import { Slider as tt } from "./components/slider.js";
import { SnackbarProvider as nt, useSnackbar as rt } from "./components/snackbar.js";
import { Spinner as it } from "./components/spinner.js";
import { Stat as at } from "./components/stat.js";
import { StatusDot as ot } from "./components/status-dot.js";
import { Stepper as st } from "./components/stepper.js";
import { Switch as ct } from "./components/switch.js";
import { Table as lt, TableBody as ut, TableCell as dt, TableHead as ft, TableHeader as pt, TableRow as mt } from "./components/table.js";
import { Tabs as ht, TabsContent as gt, TabsList as _t, TabsTrigger as vt } from "./components/tabs.js";
import { Tag as yt } from "./components/tag.js";
import { n as bt, t as xt } from "./terminal-BOR2cFi1.js";
import { Textarea as St } from "./components/textarea.js";
import { Timeline as Ct } from "./components/timeline.js";
import { Tooltip as wt } from "./components/tooltip.js";
import { ThemeProvider as Tt, useTheme as Et } from "./components/theme-provider.js";
import { Tree as Dt } from "./components/tree.js";
import { ArticleJsonLd as Ot, BreadcrumbJsonLd as kt, SeoImage as At, StructuredData as jt } from "./components/seo.js";
import { Component as Mt, useCallback as Y, useEffect as X, useLayoutEffect as Nt, useRef as Z, useState as Q } from "react";
import { jsx as $, jsxs as Pt } from "react/jsx-runtime";
//#region src/hooks/use-is-mounted.ts
function Ft() {
	let e = Z(!1);
	return X(() => (e.current = !0, () => {
		e.current = !1;
	}), []), Y(() => e.current, []);
}
//#endregion
//#region src/hooks/use-isomorphic-layout-effect.ts
var It = typeof window < "u" ? Nt : X;
//#endregion
//#region src/hooks/use-previous.ts
function Lt(e) {
	let t = Z(void 0);
	return X(() => {
		t.current = e;
	}, [e]), t.current;
}
//#endregion
//#region src/hooks/use-update-effect.ts
function Rt(e, t) {
	let n = Z(!1);
	X(() => {
		if (!n.current) {
			n.current = !0;
			return;
		}
		return e();
	}, t);
}
//#endregion
//#region src/hooks/use-controllable-state.ts
function zt({ value: e, defaultValue: t, onChange: n }) {
	let [r, i] = Q(t), a = e !== void 0;
	return [a ? e : r, Y((e) => {
		a || i(e), n?.(e);
	}, [a, n])];
}
//#endregion
//#region src/hooks/use-media-query.ts
function Bt(e) {
	let [t, n] = Q(() => typeof window > "u" || window.matchMedia === void 0 ? !1 : window.matchMedia(e).matches);
	return X(() => {
		let t = window.matchMedia(e), r = () => n(t.matches);
		return t.addEventListener ? t.addEventListener("change", r) : t.addListener(r), () => {
			t.removeEventListener ? t.removeEventListener("change", r) : t.removeListener(r);
		};
	}, [e]), t;
}
//#endregion
//#region src/hooks/use-abort-signal.ts
function Vt(e = []) {
	let t = Z(null);
	return t.current === null && (t.current = new AbortController()), X(() => {
		let e = new AbortController();
		return t.current = e, () => e.abort();
	}, e), t.current.signal;
}
//#endregion
//#region src/utils/portal.ts
function Ht(e = "rui-portal") {
	if (typeof document > "u") return null;
	let t = document.getElementById(e);
	return t || (t = document.createElement("div"), t.id = e, document.body.appendChild(t)), t;
}
//#endregion
//#region src/utils/assert.ts
function Ut(e, t) {
	if (!e) throw Error(t);
}
//#endregion
//#region src/errors/error-boundary.tsx
var Wt = class extends Mt {
	state = {
		hasError: !1,
		error: null
	};
	static getDerivedStateFromError(e) {
		return {
			hasError: !0,
			error: e
		};
	}
	componentDidCatch(e, t) {
		this.props.onError?.(e, t);
	}
	reset = () => {
		this.props.onReset?.(), this.setState({
			hasError: !1,
			error: null
		});
	};
	render() {
		if (this.state.hasError) {
			let { fallback: e } = this.props;
			return typeof e == "function" ? e(this.state.error, this.reset) : e || /* @__PURE__ */ Pt("div", {
				role: "alert",
				className: "rounded-lg border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-700 dark:text-red-300",
				children: [
					/* @__PURE__ */ $("p", {
						className: "font-medium",
						children: "Something went wrong."
					}),
					/* @__PURE__ */ $("p", {
						className: "mt-1 text-xs opacity-80",
						children: this.state.error?.message
					}),
					/* @__PURE__ */ $("button", {
						type: "button",
						onClick: this.reset,
						className: "mt-3 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500",
						children: "Try again"
					})
				]
			});
		}
		return this.props.children;
	}
};
//#endregion
//#region src/lifecycle/create-safe-effect.ts
function Gt(e, t) {
	let n = Z(null);
	X(() => {
		let t = new AbortController();
		n.current = t;
		let r = !0, i = e({
			signal: t.signal,
			isMounted: () => r
		});
		return () => {
			r = !1, t.abort(), typeof i == "function" && i();
		};
	}, t);
}
//#endregion
//#region src/lifecycle/mount.ts
function Kt(e) {
	let t = o(e);
	X(() => t(), [t]);
}
function qt(e) {
	let t = o(e);
	X(() => () => t(), [t]);
}
//#endregion
export { t as Accordion, i as Alert, Se as AppShell, Ce as AppShellBody, we as AppShellHeader, Te as AppShellMain, Ot as ArticleJsonLd, a as AuthBackdrop, ee as Autocomplete, te as Avatar, ne as Badge, E as BarChart, ie as BillingIntervalToggle, je as BottomBar, Me as BrandLink, ae as Breadcrumb, kt as BreadcrumbJsonLd, oe as Button, r as Calendar, l as Callout, u as Card, d as CardBody, f as CardDescription, p as CardFooter, m as CardHeader, h as CardTitle, D as Checkbox, O as CodeBlock, k as CodeEditor, n as Collapsible, I as CommandPalette, L as CommandProvider, G as ConfirmDialog, Ee as Container, K as CopyButton, P as DURATIONS, q as DataTable, se as DatePicker, w as DonutChart, le as Drawer, ue as DropdownMenu, de as EmptyState, Wt as ErrorBoundary, fe as ErrorState, M as FOCUSABLE_SELECTOR, pe as FileUpload, De as Footer, me as FormField, x as FunnelChart, _ as GanttChart, y as HeatmapChart, Ne as IconButton, ge as InfoButton, Oe as Inline, A as InlineCode, he as Input, j as KEY, _e as Kbd, ve as Label, b as LineChart, ye as Link, be as List, xe as ListItem, z as Modal, B as ModalBody, V as ModalDescription, H as ModalFooter, U as ModalHeader, W as ModalTitle, v as MultiLineChart, Pe as Navbar, Fe as NavigationLink, Re as NumberInput, ze as OtpInput, ke as PageHeader, Be as Pagination, Ve as Popover, He as PopoverContent, Ue as Progressbar, C as RadarChart, We as Radio, Ge as RadioGroup, Ke as RichTextEditor, S as ScatterChart, qe as Select, At as SeoImage, Je as Separator, J as Sidebar, Ye as Skeleton, Xe as SkeletonAvatar, Ze as SkeletonCard, Qe as SkeletonTable, $e as SkeletonText, et as SkeletonTopbar, tt as Slider, nt as SnackbarProvider, it as Spinner, Ae as Stack, at as Stat, ot as StatusDot, st as Stepper, jt as StructuredData, ct as Switch, lt as Table, ut as TableBody, dt as TableCell, ft as TableHead, pt as TableHeader, mt as TableRow, ht as Tabs, gt as TabsContent, _t as TabsList, vt as TabsTrigger, yt as Tag, bt as TerminalBlock, xt as TerminalEmulator, St as Textarea, Tt as ThemeProvider, ce as ThemeToggle, Ct as Timeline, wt as Tooltip, Ie as Topbar, Le as TopbarTitle, Dt as Tree, T as WaterfallChart, re as badgeVariants, s as buttonSizes, c as buttonVariants, g as cardVariants, e as cn, F as getFocusable, Ut as invariant, Ht as portalTarget, N as trapFocus, Vt as useAbortSignal, R as useCommand, zt as useControllableState, o as useEventCallback, Ft as useIsMounted, It as useIsomorphicLayoutEffect, Bt as useMediaQuery, Kt as useMountEffect, Lt as usePrevious, Gt as useSafeEffect, rt as useSnackbar, Et as useTheme, qt as useUnmountEffect, Rt as useUpdateEffect };
