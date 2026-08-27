export interface OtpInputProps {
    length?: number;
    value?: string;
    onChange?: (value: string) => void;
    onComplete?: (value: string) => void;
    label?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
    masked?: boolean;
}
export declare function OtpInput({ length, value: controlledValue, onChange, onComplete, label, hint, error, disabled, className, masked, }: OtpInputProps): import("react").JSX.Element;
