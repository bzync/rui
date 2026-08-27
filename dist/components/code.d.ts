export interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
    className?: string;
}
export declare function CodeBlock({ code, language, filename, showLineNumbers, className }: CodeBlockProps): import("react").JSX.Element;
export declare function InlineCode({ children, className }: {
    children: string;
    className?: string;
}): import("react").JSX.Element;
export interface CodeEditorProps {
    value: string;
    onChange?: (value: string) => void;
    language?: string;
    placeholder?: string;
    minRows?: number;
    maxRows?: number;
    readOnly?: boolean;
    className?: string;
}
export declare function CodeEditor({ value, onChange, language, placeholder, minRows, maxRows, readOnly, className, }: CodeEditorProps): import("react").JSX.Element;
