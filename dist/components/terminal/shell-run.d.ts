import { OutLine, ShellState, Span } from './types';
export declare function run(s: ShellState, raw: string): {
    lines: OutLine[];
    next: ShellState;
    clear?: boolean;
};
export declare function tabComplete(s: ShellState, input: string): {
    value: string;
    completions: string[];
};
export declare function promptSpans(s: ShellState): Span[];
