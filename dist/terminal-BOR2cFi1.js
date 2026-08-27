import { t as e } from "./cn-DpgY2leY.js";
import { useEffect as t, useRef as n, useState as r } from "react";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/components/terminal/terminal-block.tsx
var o = {
	command: "text-gray-900 dark:text-slate-100",
	output: "text-slate-700 dark:text-slate-300",
	error: "text-red-600 dark:text-red-400",
	success: "text-emerald-700 dark:text-emerald-400",
	info: "text-sky-600 dark:text-sky-400",
	muted: "text-slate-400 dark:text-slate-500"
};
function s({ lines: r, title: s = "Terminal", prompt: c = "$", className: l }) {
	let u = n(null);
	return t(() => {
		u.current && (u.current.scrollTop = u.current.scrollHeight);
	}, [r]), /* @__PURE__ */ a("div", {
		className: e("rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#0e1117]", l),
		children: [/* @__PURE__ */ i("div", {
			className: "flex items-center px-4 py-2.5 border-b border-black/[0.07] dark:border-white/[0.07] bg-black/3 dark:bg-white/[0.03]",
			children: /* @__PURE__ */ i("span", {
				className: "flex-1 text-center text-xs text-slate-500 font-medium",
				children: s
			})
		}), /* @__PURE__ */ i("div", {
			ref: u,
			className: "p-4 font-mono text-sm leading-6 overflow-y-auto max-h-80",
			children: r.map((e, t) => {
				let n = e.type ?? "output";
				return /* @__PURE__ */ a("div", {
					className: "whitespace-pre-wrap break-all",
					children: [n === "command" && /* @__PURE__ */ i("span", {
						className: "text-emerald-600 dark:text-emerald-500 mr-2 select-none",
						children: e.prompt ?? c
					}), /* @__PURE__ */ i("span", {
						className: o[n],
						children: e.text
					})]
				}, t);
			})
		})]
	});
}
//#endregion
//#region src/components/terminal/fs.ts
function c(e, t = !1) {
	return {
		type: "file",
		content: e,
		permissions: t ? "-rwxr-xr-x" : "-rw-r--r--",
		mtime: /* @__PURE__ */ new Date(),
		executable: t
	};
}
function l(e = {}) {
	return {
		type: "dir",
		children: new Map(Object.entries(e)),
		permissions: "drwxr-xr-x",
		mtime: /* @__PURE__ */ new Date()
	};
}
function u() {
	return l({
		home: l({ user: l({
			".bashrc": c("# ~/.bashrc\nexport PS1='\\u@\\h:\\w\\$ '\nexport PATH=\"$HOME/bin:$PATH\"\nalias ll='ls -la'\nalias la='ls -A'\n"),
			".bash_history": c("ls\npwd\ncd projects\nls -la\ncat README.md\ngit status\nnpm run dev\n"),
			".profile": c("# ~/.profile\nif [ -f \"$HOME/.bashrc\" ]; then\n  . \"$HOME/.bashrc\"\nfi\n"),
			"README.md": c("# Home Directory\n\nWelcome! Try:\n  ls -la\n  cd projects\n  cat README.md\n  help\n"),
			Desktop: l({}),
			Documents: l({
				"notes.txt": c("Meeting notes - 2026-06-05\n\n- Review infra setup\n- Deploy worker nodes\n- Update API docs\n"),
				"todo.txt": c("[ ] Fix login bug\n[x] Deploy v1.2\n[ ] Write tests\n")
			}),
			projects: l({ "my-app": l({
				"package.json": c("{\n  \"name\": \"my-app\",\n  \"version\": \"1.0.0\",\n  \"scripts\": {\n    \"dev\": \"next dev\",\n    \"build\": \"next build\"\n  },\n  \"dependencies\": {\n    \"next\": \"16.2.7\",\n    \"react\": \"^19.0.0\"\n  }\n}\n"),
				"README.md": c("# my-app\n\n## Getting Started\n\n```bash\nnpm install\nnpm run dev\n```\n"),
				src: l({
					"index.ts": c("export default function main() {\n  console.log(\"Hello, world!\")\n}\n"),
					"utils.ts": c("export function greet(name: string) {\n  return `Hello, ${name}!`\n}\n")
				})
			}) }),
			Downloads: l({})
		}) }),
		etc: l({
			hostname: c("ubuntu\n"),
			"os-release": c("NAME=\"Ubuntu\"\nVERSION=\"24.04.1 LTS (Noble Numbat)\"\nID=ubuntu\nPRETTY_NAME=\"Ubuntu 24.04.1 LTS\"\nVERSION_ID=\"24.04\"\n"),
			passwd: c("root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User,,,:/home/user:/bin/bash\n"),
			shells: c("/bin/sh\n/bin/bash\n/usr/bin/bash\n/usr/bin/zsh\n")
		}),
		tmp: l({}),
		usr: l({
			bin: l({}),
			local: l({ bin: l({}) })
		}),
		var: l({ log: l({ syslog: c("Jun  5 12:00:01 ubuntu systemd[1]: Started Daily apt upgrade.\nJun  5 12:01:00 ubuntu CRON[1234]: (root) CMD (run-parts /etc/cron.hourly)\n") }) }),
		proc: l({}),
		dev: l({})
	});
}
function d(...e) {
	let t = [];
	for (let n of e) for (let e of n.split("/")) e === ".." ? t.pop() : e && e !== "." && t.push(e);
	return "/" + t.join("/");
}
function f(e) {
	return e.split("/").filter(Boolean);
}
function p(e, t) {
	return !t || t === "~" ? `/home/${e.user}` : t.startsWith("~/") ? `/home/${e.user}/${t.slice(2)}` : t.startsWith("/") ? d(t) : d(`/${e.cwd.join("/")}`, t);
}
function m(e, t) {
	let n = e;
	for (let e of f(t)) {
		if (n.type !== "dir") return null;
		let t = n.children.get(e);
		if (!t) return null;
		n = t;
	}
	return n;
}
function h(e, t) {
	let n = f(t), r = n.pop(), i = e;
	for (let e of n) {
		if (i.type !== "dir") return null;
		let t = i.children.get(e);
		if (!t) return null;
		i = t;
	}
	return i.type === "dir" ? [i, r] : null;
}
function g(e) {
	let t = "/" + e.cwd.join("/"), n = `/home/${e.user}`;
	return t === n ? "~" : t.startsWith(n + "/") ? "~" + t.slice(n.length) : t || "/";
}
//#endregion
//#region src/components/terminal/shell-commands.ts
function _(e) {
	let t = [], n = "", r = !1, i = !1;
	for (let a of e) {
		if (a === "'" && !i) {
			r = !r;
			continue;
		}
		if (a === "\"" && !r) {
			i = !i;
			continue;
		}
		a === " " && !r && !i ? n &&= (t.push(n), "") : n += a;
	}
	return n && t.push(n), t;
}
function v(e, t) {
	return t.replace(/\$\{?([A-Z_][A-Z0-9_]*)\}?/gi, (t, n) => e.env[n] ?? "");
}
function y(e) {
	return e.type === "dir" ? "font-bold text-sky-600 dark:text-sky-400" : e.executable ? "font-bold text-emerald-600 dark:text-emerald-500" : "text-slate-700 dark:text-slate-200";
}
function b(e) {
	return e.toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit"
	}).replace(",", "") + " " + e.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: !1
	});
}
function x(e) {
	return { lines: [{ spans: [{
		text: e,
		cls: "text-red-500 dark:text-red-400"
	}] }] };
}
function S(...e) {
	return { lines: e.map((e) => ({ spans: [{ text: e }] })) };
}
function C(e, t) {
	let n = !1, r = !1, i;
	for (let e of t) e.startsWith("-") ? (e.includes("l") && (n = !0), (e.includes("a") || e.includes("A")) && (r = !0)) : i = e;
	let a = i ? p(e, i) : "/" + e.cwd.join("/"), o = m(e.root, a);
	if (!o) return x(`ls: cannot access '${i}': No such file or directory`);
	if (o.type === "file") return { lines: [{ spans: [{
		text: a.split("/").pop(),
		cls: y(o)
	}] }] };
	let s = [...o.children.entries()].sort(([e], [t]) => e.localeCompare(t));
	if (r || (s = s.filter(([e]) => !e.startsWith("."))), n) {
		let e = [], t = s.reduce((e, [, t]) => e + (t.type === "file" ? t.content.length : 4096), 0);
		if (e.push({ spans: [{
			text: `total ${Math.ceil(t / 512)}`,
			cls: "text-slate-500 dark:text-slate-500"
		}] }), r) for (let t of [".", ".."]) e.push({ spans: [{
			text: `drwxr-xr-x 2 user user   4096 ${b(/* @__PURE__ */ new Date())} `,
			cls: "text-slate-500 dark:text-slate-500"
		}, {
			text: t,
			cls: "font-bold text-sky-600 dark:text-sky-400"
		}] });
		for (let [t, n] of s) {
			let r = n.type === "file" ? n.content.length : 4096;
			e.push({ spans: [{
				text: `${n.permissions} 1 user user ${String(r).padStart(6)} ${b(n.mtime)} `,
				cls: "text-slate-500 dark:text-slate-500"
			}, {
				text: n.type === "dir" ? t + "/" : t,
				cls: y(n)
			}] });
		}
		return { lines: e };
	}
	let c = [];
	for (let e = 0; e < s.length; e += 4) {
		let t = [];
		for (let n = 0; n < 4 && e + n < s.length; n++) {
			let [r, i] = s[e + n], a = i.type === "dir" ? r + "/" : r;
			t.push({
				text: a,
				cls: y(i)
			}), n < 3 && e + n + 1 < s.length && t.push({ text: " ".repeat(Math.max(1, 20 - a.length)) });
		}
		c.push({ spans: t });
	}
	return { lines: c };
}
function w(e, t) {
	let n = p(e, t[0] ?? "~"), r = m(e.root, n);
	return r ? r.type === "dir" ? {
		lines: [],
		patch: { cwd: f(n) }
	} : x(`bash: cd: ${t[0]}: Not a directory`) : x(`bash: cd: ${t[0]}: No such file or directory`);
}
function T(e, t) {
	if (!t.length) return x("cat: missing operand");
	let n = [];
	for (let r of t) {
		let t = m(e.root, p(e, r));
		if (!t) {
			n.push({ spans: [{
				text: `cat: ${r}: No such file or directory`,
				cls: "text-red-500 dark:text-red-400"
			}] });
			continue;
		}
		if (t.type === "dir") {
			n.push({ spans: [{
				text: `cat: ${r}: Is a directory`,
				cls: "text-red-500 dark:text-red-400"
			}] });
			continue;
		}
		for (let e of t.content.split("\n")) n.push({ spans: [{ text: e }] });
	}
	return { lines: n };
}
function E(e, t) {
	let n = [];
	for (let r of t.filter((e) => !e.startsWith("-"))) {
		let t = h(e.root, p(e, r));
		if (!t) {
			n.push({ spans: [{
				text: `mkdir: cannot create directory '${r}': No such file or directory`,
				cls: "text-red-500 dark:text-red-400"
			}] });
			continue;
		}
		let [i, a] = t;
		if (i.children.has(a)) {
			n.push({ spans: [{
				text: `mkdir: cannot create directory '${r}': File exists`,
				cls: "text-red-500 dark:text-red-400"
			}] });
			continue;
		}
		i.children.set(a, l());
	}
	return { lines: n };
}
function D(e, t) {
	let n = [];
	for (let r of t.filter((e) => !e.startsWith("-"))) {
		let t = p(e, r), i = m(e.root, t);
		if (i) {
			i.mtime = /* @__PURE__ */ new Date();
			continue;
		}
		let a = h(e.root, t);
		if (!a) {
			n.push({ spans: [{
				text: `touch: cannot touch '${r}': No such file or directory`,
				cls: "text-red-500 dark:text-red-400"
			}] });
			continue;
		}
		let [o, s] = a;
		o.children.set(s, c(""));
	}
	return { lines: n };
}
function O(e, t) {
	let n = !1, r = t.filter((e) => !e.startsWith("-") || (/r/i.test(e) && (n = !0), !1)), i = [];
	for (let t of r) {
		let r = m(e.root, p(e, t));
		if (!r) {
			i.push({ spans: [{
				text: `rm: cannot remove '${t}': No such file or directory`,
				cls: "text-red-500 dark:text-red-400"
			}] });
			continue;
		}
		if (r.type === "dir" && !n) {
			i.push({ spans: [{
				text: `rm: cannot remove '${t}': Is a directory`,
				cls: "text-red-500 dark:text-red-400"
			}] });
			continue;
		}
		let a = h(e.root, p(e, t));
		a && a[0].children.delete(a[1]);
	}
	return { lines: i };
}
function k(e, t, n) {
	let r = n ? "mv" : "cp", i = t.filter((e) => !e.startsWith("-"));
	if (i.length < 2) return x(`${r}: missing destination operand`);
	let [a, o] = [p(e, i[0]), p(e, i[1])], s = m(e.root, a);
	if (!s) return x(`${r}: cannot stat '${i[0]}': No such file or directory`);
	if (s.type === "dir" && !n) return x(`cp: -r not specified; omitting directory '${i[0]}'`);
	let c = o;
	m(e.root, o)?.type === "dir" && (c = o + "/" + a.split("/").pop());
	let l = h(e.root, c);
	if (!l) return x(`${r}: cannot create '${i[1]}': No such file or directory`);
	if (l[0].children.set(l[1], {
		...s,
		mtime: /* @__PURE__ */ new Date()
	}), n) {
		let t = h(e.root, a);
		t && t[0].children.delete(t[1]);
	}
	return { lines: [] };
}
function A(e, t) {
	let n = t.filter((e) => e.startsWith("-")), r = t.filter((e) => !e.startsWith("-"));
	if (!r.length) return x("grep: missing pattern");
	let [i, ...a] = r, o = n.some((e) => e.includes("i")), s = n.some((e) => e.includes("n")), c = n.some((e) => e.includes("v")), l = [];
	for (let t of a) {
		let n = m(e.root, p(e, t));
		if (!n || n.type !== "file") {
			l.push({ spans: [{
				text: `grep: ${t}: No such file or directory`,
				cls: "text-red-500 dark:text-red-400"
			}] });
			continue;
		}
		let r = new RegExp(i, o ? "gi" : "g");
		n.content.split("\n").forEach((e, n) => {
			let i = r.test(e);
			if (c ? !i : i) {
				let r = a.length > 1 ? `${t}:` : "";
				l.push({ spans: [{ text: r + (s ? `${n + 1}:` : "") + e }] });
			}
		});
	}
	return { lines: l };
}
function j(e, t) {
	let n = t[0] && !t[0].startsWith("-") ? p(e, t[0]) : "/" + e.cwd.join("/"), r = [];
	function i(t) {
		let n = m(e.root, t);
		if (n && (r.push({ spans: [{ text: t }] }), n.type === "dir")) for (let [e] of n.children) i(t === "/" ? "/" + e : t + "/" + e);
	}
	return i(n), { lines: r };
}
function M(e, t) {
	let n = t.filter((e) => e.startsWith("-")), r = t.filter((e) => !e.startsWith("-")), i = !n.length || n.some((e) => e.includes("l")), a = !n.length || n.some((e) => e.includes("w")), o = !n.length || n.some((e) => e.includes("c")), s = [];
	for (let t of r) {
		let n = m(e.root, p(e, t));
		if (!n || n.type !== "file") {
			s.push({ spans: [{
				text: `wc: ${t}: No such file or directory`,
				cls: "text-red-500 dark:text-red-400"
			}] });
			continue;
		}
		let r = n.content.split("\n").length - 1, c = n.content.trim().split(/\s+/).filter(Boolean).length, l = n.content.length, u = [];
		i && u.push(String(r).padStart(4)), a && u.push(String(c).padStart(4)), o && u.push(String(l).padStart(4)), s.push({ spans: [{ text: u.join(" ") + " " + t }] });
	}
	return { lines: s };
}
function N(e, t, n) {
	let r = 10, i = [];
	for (let e = 0; e < t.length; e++) {
		if (t[e] === "-n" && t[e + 1]) {
			r = parseInt(t[++e]);
			continue;
		}
		if (/^-\d+$/.test(t[e])) {
			r = parseInt(t[e].slice(1));
			continue;
		}
		i.push(t[e]);
	}
	let a = [];
	for (let t of i) {
		let i = m(e.root, p(e, t));
		if (!i || i.type !== "file") {
			a.push({ spans: [{
				text: `${n ? "tail" : "head"}: cannot open '${t}': No such file or directory`,
				cls: "text-red-500 dark:text-red-400"
			}] });
			continue;
		}
		let o = i.content.split("\n");
		(n ? o.slice(-r) : o.slice(0, r)).forEach((e) => a.push({ spans: [{ text: e }] }));
	}
	return { lines: a };
}
//#endregion
//#region src/components/terminal/shell-commands-sim.ts
function P(e, t) {
	let n = t[0];
	if (!n) return S("usage: git [--version] [--help] <command> [<args>]", "", "Common commands: init clone status add commit push pull log diff branch checkout merge");
	if (n === "status") return S("On branch main", "Your branch is up to date with 'origin/main'.", "", "nothing to commit, working tree clean");
	if (n === "log") return { lines: [
		{ spans: [{
			text: "commit a3f8c1e9d2b74f6a1c8e3d5b9f2a7c4e8d1b3f5 (HEAD -> main)",
			cls: "text-amber-600 dark:text-amber-400"
		}] },
		{ spans: [{ text: "Author: User <user@example.com>" }] },
		{ spans: [{ text: "Date:   Thu Jun 5 12:00:00 2026 +0000" }] },
		{ spans: [{ text: "" }] },
		{ spans: [{ text: "    Initial commit" }] }
	] };
	if (n === "init") return S(`Initialized empty Git repository in ${g(e)}/.git/`);
	if (n === "branch") return { lines: [{ spans: [{
		text: "* main",
		cls: "text-emerald-600 dark:text-emerald-500"
	}] }] };
	if (n === "diff") return S("(no changes)");
	if (n === "add" || n === "checkout") return { lines: [] };
	if (n === "commit") {
		let e = t.indexOf("-m");
		return S(`[main a3f8c1e] ${e === -1 ? "update" : t[e + 1]}`, " 1 file changed, 1 insertion(+)");
	}
	return n === "push" || n === "pull" ? S("Already up to date.") : n === "clone" ? S(`Cloning into '${(t[1] ?? "<url>").split("/").pop()?.replace(".git", "") ?? "repo"}'...`, "remote: Counting objects: 100% (42/42), done.", "Receiving objects: 100% (42/42), 12.34 KiB | 1.23 MiB/s, done.") : n === "--version" ? S("git version 2.43.0") : x(`git: '${n}' is not a git command. See 'git --help'.`);
}
function F(e) {
	let t = e[0];
	if (t === "update") return S("Get:1 http://archive.ubuntu.com/ubuntu noble InRelease [256 kB]", "Fetched 256 kB in 1s (256 kB/s)", "Reading package lists... Done", "Building dependency tree... Done", "2 packages can be upgraded.");
	if (t === "upgrade") return S("Reading package lists... Done", "Building dependency tree... Done", "0 upgraded, 0 newly installed, 0 to remove and 2 not upgraded.");
	if (t === "install") {
		let t = e[1] ?? "";
		return t ? S("Reading package lists... Done", `The following NEW packages will be installed:\n  ${t}`, `Get:1 http://archive.ubuntu.com/ubuntu noble/universe amd64 ${t} 1.0.0-1 [128 kB]`, "Fetched 128 kB in 0s", `Setting up ${t} (1.0.0-1) ...`) : x("apt: package name required");
	}
	return t === "list" ? S("Listing... Done", "bash/noble,now 5.2.21-2ubuntu4 amd64 [installed]", "curl/noble,now 8.5.0 amd64 [installed]", "git/noble,now 1:2.43.0 amd64 [installed]", "nodejs/noble,now 18.19.0 amd64 [installed]", "python3/noble,now 3.12.3 amd64 [installed]") : S("Usage: apt [options] command", "", "Available commands:", "  update, upgrade, install, remove, list, search, show");
}
function I(e) {
	let t = e.find((e) => !e.startsWith("-")) ?? "google.com", n = e.indexOf("-c"), r = n === -1 ? 4 : Math.min(parseInt(e[n + 1] ?? "4"), 8), i = [{ spans: [{ text: `PING ${t} (142.250.185.46) 56(84) bytes of data.` }] }];
	for (let e = 0; e < r; e++) {
		let n = (12 + Math.random() * 8).toFixed(3);
		i.push({ spans: [{ text: `64 bytes from ${t} (142.250.185.46): icmp_seq=${e + 1} ttl=115 time=${n} ms` }] });
	}
	return i.push({ spans: [{ text: "" }] }), i.push({ spans: [{ text: `--- ${t} ping statistics ---` }] }), i.push({ spans: [{ text: `${r} packets transmitted, ${r} received, 0% packet loss` }] }), i.push({ spans: [{ text: "rtt min/avg/max = 12.1/15.3/20.1 ms" }] }), { lines: i };
}
function L() {
	return { lines: [
		{ spans: [{
			text: "Available commands:",
			cls: "font-bold text-slate-700 dark:text-slate-200"
		}] },
		{ spans: [{ text: "" }] },
		{ spans: [{
			text: "  File system:  ",
			cls: "text-sky-600 dark:text-sky-400"
		}, { text: "ls  cd  pwd  cat  mkdir  touch  rm  cp  mv  find" }] },
		{ spans: [{
			text: "  Text tools:   ",
			cls: "text-sky-600 dark:text-sky-400"
		}, { text: "echo  grep  wc  head  tail  sort" }] },
		{ spans: [{
			text: "  System:       ",
			cls: "text-sky-600 dark:text-sky-400"
		}, { text: "whoami  id  uname  hostname  date  uptime  df  free  ps" }] },
		{ spans: [{
			text: "  Environment:  ",
			cls: "text-sky-600 dark:text-sky-400"
		}, { text: "env  export  unset  which" }] },
		{ spans: [{
			text: "  Network:      ",
			cls: "text-sky-600 dark:text-sky-400"
		}, { text: "ping  curl  wget" }] },
		{ spans: [{
			text: "  Packages:     ",
			cls: "text-sky-600 dark:text-sky-400"
		}, { text: "apt  apt-get" }] },
		{ spans: [{
			text: "  Dev tools:    ",
			cls: "text-sky-600 dark:text-sky-400"
		}, { text: "git  node  python3  npm" }] },
		{ spans: [{
			text: "  Shell:        ",
			cls: "text-sky-600 dark:text-sky-400"
		}, { text: "history  clear  sudo  chmod  alias" }] },
		{ spans: [{ text: "" }] },
		{ spans: [{
			text: "Keyboard:  ",
			cls: "text-slate-500 dark:text-slate-500"
		}, { text: "↑↓ history   Tab complete   Ctrl+C cancel   Ctrl+L clear" }] }
	] };
}
//#endregion
//#region src/components/terminal/shell-run.ts
function R(e, t) {
	let [n, ...r] = _(v(e, t.trim()));
	if (!n) return {
		lines: [],
		next: {
			...e,
			history: [...e.history, t].slice(-500)
		}
	};
	let i;
	switch (n) {
		case "pwd":
			i = S("/" + (e.cwd.join("/") || ""));
			break;
		case "ls":
			i = C(e, r);
			break;
		case "cd":
			i = w(e, r);
			break;
		case "echo":
			i = S(r.filter((e) => e !== "-n" && e !== "-e").map((t) => v(e, t)).join(" "));
			break;
		case "cat":
			i = T(e, r);
			break;
		case "mkdir":
			i = E(e, r);
			break;
		case "touch":
			i = D(e, r);
			break;
		case "rm":
			i = O(e, r);
			break;
		case "cp":
			i = k(e, r, !1);
			break;
		case "mv":
			i = k(e, r, !0);
			break;
		case "clear":
			i = {
				lines: [],
				clear: !0
			};
			break;
		case "history":
			i = { lines: e.history.map((e, t) => ({ spans: [{
				text: `  ${String(t + 1).padStart(4)}  `,
				cls: "text-slate-500"
			}, { text: e }] })) };
			break;
		case "grep":
			i = A(e, r);
			break;
		case "find":
			i = j(e, r);
			break;
		case "wc":
			i = M(e, r);
			break;
		case "head":
			i = N(e, r, !1);
			break;
		case "tail":
			i = N(e, r, !0);
			break;
		case "sort": {
			let t = r[0];
			if (!t) {
				i = x("sort: missing operand");
				break;
			}
			let n = m(e.root, p(e, t));
			if (!n || n.type !== "file") {
				i = x(`sort: cannot read: ${t}`);
				break;
			}
			i = { lines: n.content.split("\n").sort().map((e) => ({ spans: [{ text: e }] })) };
			break;
		}
		case "whoami":
			i = S(e.user);
			break;
		case "id":
			i = S(`uid=1000(${e.user}) gid=1000(${e.user}) groups=1000(${e.user}),27(sudo),4(adm)`);
			break;
		case "uname":
			i = S(r.includes("-a") ? `Linux ${e.hostname} 6.8.0-51-generic #52-Ubuntu SMP x86_64 GNU/Linux` : "Linux");
			break;
		case "hostname":
			i = S(e.hostname);
			break;
		case "date":
			i = S((/* @__PURE__ */ new Date()).toString());
			break;
		case "uptime": {
			let t = Math.floor((Date.now() - e.startTime.getTime()) / 1e3);
			i = S(` ${(/* @__PURE__ */ new Date()).toLocaleTimeString()} up ${Math.floor(t / 3600)}:${String(Math.floor(t % 3600 / 60)).padStart(2, "0")},  1 user,  load average: 0.08, 0.12, 0.09`);
			break;
		}
		case "df":
			i = { lines: [
				{ spans: [{
					text: "Filesystem      Size  Used Avail Use% Mounted on",
					cls: "text-slate-500 dark:text-slate-500"
				}] },
				{ spans: [{ text: r.includes("-h") ? "/dev/sda1        79G   12G   63G  16% /" : "/dev/sda1     82636288 12582912 65901568  16% /" }] },
				{ spans: [{ text: r.includes("-h") ? "tmpfs           7.8G     0  7.8G   0% /dev/shm" : "tmpfs           8133480       0 8133480   0% /dev/shm" }] }
			] };
			break;
		case "free":
			i = { lines: [
				{ spans: [{
					text: "               total        used        free      shared  buff/cache   available",
					cls: "text-slate-500 dark:text-slate-500"
				}] },
				{ spans: [{ text: r.includes("-h") ? "Mem:            15Gi       3.1Gi       8.7Gi       310Mi       3.6Gi        11Gi" : "Mem:        16266960     3211264     8921088      318464     3682496    11502208" }] },
				{ spans: [{ text: r.includes("-h") ? "Swap:          975Mi          0B       975Mi" : "Swap:         999420           0      999420" }] }
			] };
			break;
		case "ps":
			i = { lines: [
				{ spans: [{
					text: "  PID TTY          TIME CMD",
					cls: "text-slate-500 dark:text-slate-500"
				}] },
				{ spans: [{ text: " 1234 pts/0    00:00:00 bash" }] },
				{ spans: [{ text: " 5678 pts/0    00:00:00 ps" }] }
			] };
			break;
		case "env":
			i = { lines: Object.entries(e.env).map(([e, t]) => ({ spans: [
				{
					text: e,
					cls: "text-sky-600 dark:text-sky-400"
				},
				{ text: "=" },
				{
					text: t,
					cls: "text-emerald-600 dark:text-emerald-500"
				}
			] })) };
			break;
		case "export": {
			let t = { ...e.env };
			for (let n of r) {
				let r = n.indexOf("=");
				r > -1 && (t[n.slice(0, r)] = v(e, n.slice(r + 1)));
			}
			i = {
				lines: [],
				patch: { env: t }
			};
			break;
		}
		case "unset": {
			let t = { ...e.env };
			for (let e of r) delete t[e];
			i = {
				lines: [],
				patch: { env: t }
			};
			break;
		}
		case "which": {
			let e = {
				bash: "/bin/bash",
				ls: "/bin/ls",
				cat: "/bin/cat",
				echo: "/bin/echo",
				rm: "/bin/rm",
				cp: "/bin/cp",
				mv: "/bin/mv",
				mkdir: "/bin/mkdir",
				touch: "/usr/bin/touch",
				pwd: "/bin/pwd",
				grep: "/bin/grep",
				find: "/usr/bin/find",
				sort: "/usr/bin/sort",
				wc: "/usr/bin/wc",
				head: "/usr/bin/head",
				tail: "/usr/bin/tail",
				date: "/bin/date",
				hostname: "/bin/hostname",
				uname: "/bin/uname",
				whoami: "/usr/bin/whoami",
				id: "/usr/bin/id",
				env: "/usr/bin/env",
				which: "/usr/bin/which",
				python3: "/usr/bin/python3",
				node: "/usr/bin/node",
				npm: "/usr/bin/npm",
				git: "/usr/bin/git",
				curl: "/usr/bin/curl",
				wget: "/usr/bin/wget",
				apt: "/usr/bin/apt",
				df: "/bin/df",
				du: "/usr/bin/du",
				free: "/usr/bin/free",
				ps: "/bin/ps",
				uptime: "/usr/bin/uptime",
				chmod: "/bin/chmod",
				chown: "/bin/chown",
				sudo: "/usr/bin/sudo",
				ping: "/bin/ping"
			};
			i = { lines: r.map((t) => ({ spans: [{
				text: e[t] ?? "",
				cls: e[t] ? void 0 : "text-red-500 dark:text-red-400"
			}, { text: e[t] ? "" : `${t} not found` }] })).filter((e) => e.spans.some((e) => e.text)) };
			break;
		}
		case "chmod":
			i = { lines: [] };
			break;
		case "chown":
			i = { lines: [] };
			break;
		case "sudo":
			i = S(`[sudo] simulated — running as root: ${r.join(" ")}`);
			break;
		case "git":
			i = P(e, r);
			break;
		case "apt":
		case "apt-get":
			i = F(r);
			break;
		case "snap":
			i = S("snap: simulated snap package manager");
			break;
		case "node":
			i = r.length ? x(`node: ${r[0]}: No such file`) : S("Welcome to Node.js v20.18.0.", "Type \".help\" for more information.", "> (REPL not supported in browser — run node <file.js>)");
			break;
		case "python3":
		case "python":
			i = r.length ? x(`python3: can't open file '${r[0]}'`) : S("Python 3.12.3 (main, Nov 6 2024) on linux", ">>> (REPL not supported in browser — run python3 <file.py>)");
			break;
		case "npm":
			i = r[0] === "install" || r[0] === "i" ? S(`added ${+!!r[1]} packages in 0.5s`) : r[0] === "run" ? S(`> ${r[1]}`, "", `Running ${r[1]}...`) : x(`npm: unknown command: ${r[0] ?? "(none)"}`);
			break;
		case "ping":
			i = I(r);
			break;
		case "curl":
			i = r[0] ? S(`{"status":"ok","message":"Simulated response from ${r.find((e) => !e.startsWith("-")) ?? ""}"}`) : x("curl: try 'curl --help'");
			break;
		case "wget":
			i = S(`--${(/* @__PURE__ */ new Date()).toISOString()}--  ${r[0] ?? ""}`, "Saving to: stdout", "100% [========================================]", "done.");
			break;
		case "man":
		case "help":
			i = L();
			break;
		case "less":
		case "more":
			i = r[0] ? T(e, r) : x(`usage: ${n} <file>`);
			break;
		case "vim":
		case "vi":
		case "nano":
		case "emacs":
			i = { lines: [{ spans: [{
				text: `${n}: terminal editor not available in browser. Use cat to view files.`,
				cls: "text-amber-600 dark:text-amber-400"
			}] }] };
			break;
		case "top":
		case "htop":
			i = { lines: [{ spans: [{
				text: "interactive monitor not supported. Try: ps aux",
				cls: "text-amber-600 dark:text-amber-400"
			}] }] };
			break;
		case "exit":
		case "logout":
			i = S("logout");
			break;
		case "alias":
			i = S("alias ll='ls -la'", "alias la='ls -A'", "alias l='ls -CF'");
			break;
		case "type":
			i = S(`${r[0] ?? ""} is a shell builtin`);
			break;
		case "true":
			i = { lines: [] };
			break;
		case "false":
			i = { lines: [] };
			break;
		case "sleep":
			i = { lines: [] };
			break;
		case "":
			i = { lines: [] };
			break;
		default: i = x(`${n}: command not found`);
	}
	let a = {
		...e,
		cwd: i.patch?.cwd ?? e.cwd,
		env: i.patch?.env ?? e.env,
		history: [...e.history, t.trim()].filter(Boolean).slice(-500)
	};
	return {
		lines: i.lines,
		next: a,
		clear: i.clear
	};
}
var z = /* @__PURE__ */ "ls.cd.pwd.cat.mkdir.touch.rm.cp.mv.find.echo.grep.wc.head.tail.sort.whoami.id.uname.hostname.date.uptime.df.free.ps.env.export.unset.which.chmod.chown.sudo.git.apt.apt-get.node.python3.npm.ping.curl.wget.man.help.less.more.vim.nano.top.exit.alias.true.false.sleep.history.clear.type.bash.sh.snap.yarn.pip.pip3.wget.source".split(".");
function B(e, t) {
	let n = _(t);
	if (n.length === 0 || n.length === 1 && !t.endsWith(" ")) {
		let e = n[0] ?? "", r = z.filter((t) => t.startsWith(e));
		return r.length === 1 ? {
			value: r[0] + " ",
			completions: []
		} : r.length > 1 ? {
			value: t,
			completions: r
		} : {
			value: t,
			completions: []
		};
	}
	let r = n[n.length - 1] ?? "", i = r.includes("/") ? r.slice(0, r.lastIndexOf("/") + 1) : "", a = r.slice(i.length), o = i ? p(e, i) : "/" + e.cwd.join("/"), s = m(e.root, o);
	if (!s || s.type !== "dir") return {
		value: t,
		completions: []
	};
	let c = [...s.children.keys()].filter((e) => e.startsWith(a));
	if (c.length === 0) return {
		value: t,
		completions: []
	};
	if (c.length === 1) {
		let e = c[0], t = s.children.get(e).type === "dir" ? "/" : " ", r = i + e + t;
		return {
			value: [...n.slice(0, -1), r].join(" "),
			completions: []
		};
	}
	return {
		value: t,
		completions: c
	};
}
function V(e) {
	return [
		{
			text: `${e.user}@${e.hostname}`,
			cls: "font-bold text-emerald-600 dark:text-emerald-500"
		},
		{
			text: ":",
			cls: "text-slate-700 dark:text-slate-200"
		},
		{
			text: g(e),
			cls: "font-bold text-sky-600 dark:text-sky-400"
		},
		{
			text: "$ ",
			cls: "text-slate-700 dark:text-slate-200"
		}
	];
}
//#endregion
//#region src/components/terminal/terminal-emulator.tsx
function H({ title: o = "Terminal", user: s = "user", hostname: c = "ubuntu", className: l }) {
	let d = () => ({
		root: u(),
		cwd: ["home", s],
		env: {
			HOME: `/home/${s}`,
			USER: s,
			SHELL: "/bin/bash",
			TERM: "xterm-256color",
			PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
			LANG: "en_US.UTF-8"
		},
		history: [],
		user: s,
		hostname: c,
		startTime: /* @__PURE__ */ new Date()
	}), [f, p] = r(!1), [m, h] = r(d), [g, _] = r([]), [v, y] = r(""), [b, x] = r(-1), [S, C] = r([]), [w, T] = r(!0), E = n(null), D = n(null), O = n(0);
	t(() => {
		p(!0);
	}, []), t(() => {
		let e = setInterval(() => T((e) => !e), 530);
		return () => clearInterval(e);
	}, []), t(() => {
		D.current && (D.current.scrollTop = D.current.scrollHeight);
	}, [g]);
	function k(e) {
		_((t) => [...t, ...e.map((e) => ({
			id: O.current++,
			spans: e
		}))]);
	}
	function A() {
		let e = v.trim();
		if (C([]), k([[...V(m), { text: e }]]), !e) {
			y("");
			return;
		}
		let { lines: t, next: n, clear: r } = R(m, e);
		if (h(n), x(-1), y(""), r) {
			_([]);
			return;
		}
		t.length && k(t.map((e) => e.spans));
	}
	function j(e) {
		if (e.key === "Enter") {
			A();
			return;
		}
		if (e.key === "c" && e.ctrlKey) {
			e.preventDefault(), k([[
				...V(m),
				{ text: v },
				{
					text: "^C",
					cls: "text-slate-500"
				}
			]]), y(""), x(-1), C([]);
			return;
		}
		if (e.key === "l" && e.ctrlKey) {
			e.preventDefault(), _([]);
			return;
		}
		if (e.key === "u" && e.ctrlKey) {
			e.preventDefault(), y("");
			return;
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			let t = Math.min(b + 1, m.history.length - 1);
			t >= 0 && (x(t), y(m.history[m.history.length - 1 - t] ?? ""));
			return;
		}
		if (e.key === "ArrowDown") {
			e.preventDefault();
			let t = b - 1;
			t < 0 ? (x(-1), y("")) : (x(t), y(m.history[m.history.length - 1 - t] ?? ""));
			return;
		}
		if (e.key === "Tab") {
			e.preventDefault();
			let { value: t, completions: n } = B(m, v);
			y(t), C(n.length > 1 ? n : []);
			return;
		}
		C([]);
	}
	let M = V(m);
	return f ? /* @__PURE__ */ a("div", {
		className: e("rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0e1117] shadow-sm dark:shadow-xl dark:shadow-black/20 cursor-text flex flex-col", l),
		onClick: () => E.current?.focus(),
		children: [
			/* @__PURE__ */ i("div", {
				className: "flex items-center px-4 py-2.5 border-b border-black/[0.07] dark:border-white/[0.07] bg-black/3 dark:bg-white/[0.03] shrink-0",
				children: /* @__PURE__ */ i("span", {
					className: "flex-1 text-center text-xs text-slate-500 font-medium",
					children: o
				})
			}),
			/* @__PURE__ */ a("div", {
				ref: D,
				className: "flex-1 overflow-y-auto p-4 font-mono text-sm leading-6 min-h-[200px] max-h-80",
				children: [
					g.length === 0 && /* @__PURE__ */ a("div", {
						className: "text-slate-400 dark:text-slate-500 mb-2 select-none",
						children: [/* @__PURE__ */ a("div", { children: [
							"Ubuntu 24.04.1 LTS — type ",
							/* @__PURE__ */ i("span", {
								className: "text-sky-600 dark:text-sky-400",
								children: "help"
							}),
							" for available commands"
						] }), /* @__PURE__ */ i("div", { className: "h-2" })]
					}),
					g.map((e) => /* @__PURE__ */ i("div", {
						className: "whitespace-pre-wrap break-all",
						children: e.spans.map((e, t) => /* @__PURE__ */ i("span", {
							className: e.cls,
							children: e.text
						}, t))
					}, e.id)),
					S.length > 0 && /* @__PURE__ */ i("div", {
						className: "flex flex-wrap gap-x-4 text-slate-500 dark:text-slate-500 mt-1",
						children: S.map((e) => /* @__PURE__ */ i("span", { children: e }, e))
					})
				]
			}),
			/* @__PURE__ */ a("div", {
				className: "px-4 py-3 border-t border-black/8 dark:border-white/6 flex items-center font-mono text-sm shrink-0",
				children: [M.map((t, n) => /* @__PURE__ */ i("span", {
					className: e("whitespace-pre", t.cls),
					children: t.text
				}, n)), /* @__PURE__ */ a("span", {
					className: "relative flex-1 flex items-center min-w-0",
					children: [
						/* @__PURE__ */ i("input", {
							ref: E,
							value: v,
							onChange: (e) => y(e.target.value),
							onKeyDown: j,
							className: "absolute inset-0 w-full bg-transparent text-transparent focus:outline-none caret-transparent",
							spellCheck: !1,
							autoCapitalize: "none",
							autoComplete: "off",
							autoCorrect: "off"
						}),
						/* @__PURE__ */ i("span", {
							className: "whitespace-pre text-slate-800 dark:text-slate-100 pointer-events-none select-none",
							children: v
						}),
						/* @__PURE__ */ i("span", {
							className: e("inline-block h-[1.1em] w-[2px] bg-slate-700 dark:bg-slate-300 shrink-0", w ? "opacity-100" : "opacity-0"),
							"aria-hidden": !0
						})
					]
				})]
			})
		]
	}) : /* @__PURE__ */ a("div", {
		className: e("rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0e1117] shadow-sm dark:shadow-xl dark:shadow-black/20 flex flex-col", l),
		children: [
			/* @__PURE__ */ i("div", {
				className: "flex items-center px-4 py-2.5 border-b border-black/[0.07] dark:border-white/[0.07] bg-black/3 dark:bg-white/[0.03] shrink-0",
				children: /* @__PURE__ */ i("span", {
					className: "flex-1 text-center text-xs text-slate-500 font-medium",
					children: o
				})
			}),
			/* @__PURE__ */ i("div", { className: "flex-1 min-h-[200px] max-h-80" }),
			/* @__PURE__ */ i("div", { className: "px-4 py-3 border-t border-black/8 dark:border-white/6 shrink-0" })
		]
	});
}
//#endregion
export { s as n, H as t };
