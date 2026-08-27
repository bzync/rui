export interface RichTextEditorProps {
    value?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: number;
    /** Sanitize HTML before rendering to prevent XSS when value comes from untrusted sources. Pass a custom function to override. */
    sanitize?: boolean | ((html: string) => string);
}
export declare function RichTextEditor({ value, onChange, placeholder, className, minHeight, sanitize, }: RichTextEditorProps): import("react").JSX.Element;
