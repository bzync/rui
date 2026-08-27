import { TerminalLine } from './terminal-block';
export interface TerminalEmulatorProps {
    title?: string;
    user?: string;
    hostname?: string;
    className?: string;
    /** @deprecated use built-in shell — pass initialLines for welcome text */
    initialLines?: TerminalLine[];
}
export declare function TerminalEmulator({ title, user, hostname, className }: TerminalEmulatorProps): import("react").JSX.Element;
