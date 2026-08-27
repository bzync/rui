export interface Span { text: string; cls?: string }
export interface OutLine { spans: Span[] }

export interface FSFile { type: "file"; content: string; permissions: string; mtime: Date; executable?: boolean }
export interface FSDir  { type: "dir";  children: Map<string, FSEntry>; permissions: string; mtime: Date }
export type FSEntry = FSFile | FSDir

export interface ShellState {
  root: FSDir
  cwd: string[]
  env: Record<string, string>
  history: string[]
  user: string
  hostname: string
  startTime: Date
}

export type CmdResult = { lines: OutLine[]; patch?: Partial<ShellState>; clear?: boolean }
