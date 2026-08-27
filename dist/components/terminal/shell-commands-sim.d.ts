import { CmdResult, ShellState } from './types';
export declare function cmdGit(s: ShellState, args: string[]): CmdResult;
export declare function cmdApt(args: string[]): CmdResult;
export declare function cmdPing(args: string[]): CmdResult;
export declare function cmdHelp(): CmdResult;
