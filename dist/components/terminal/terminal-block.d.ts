export type TerminalLineType = "command" | "output" | "error" | "success" | "info" | "muted";
export interface TerminalLine {
    type?: TerminalLineType;
    text: string;
    prompt?: string;
}
export interface TerminalBlockProps {
    lines: TerminalLine[];
    title?: string;
    prompt?: string;
    className?: string;
}
export declare function TerminalBlock({ lines, title, prompt, className }: TerminalBlockProps): import("react").JSX.Element;
