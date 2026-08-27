// Barrel re-export — kept so existing `from "@/components/ui/terminal"`
// imports don't need to change. Implementation lives in ./terminal/.
export { TerminalBlock, type TerminalLine, type TerminalLineType, type TerminalBlockProps } from "./terminal/terminal-block"
export { TerminalEmulator, type TerminalEmulatorProps } from "./terminal/terminal-emulator"
