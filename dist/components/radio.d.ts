import { ReactNode } from 'react';
export interface RadioGroupProps {
    name?: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    label?: string;
    hint?: string;
    error?: string;
    orientation?: "vertical" | "horizontal";
    className?: string;
    children: ReactNode;
}
export declare function RadioGroup({ name: externalName, value, onChange, disabled, label, hint, error, orientation, className, children, }: RadioGroupProps): import("react").JSX.Element;
export interface RadioProps {
    value: string;
    label?: string;
    description?: string;
    disabled?: boolean;
    className?: string;
}
export declare function Radio({ value, label, description, disabled: localDisabled, className }: RadioProps): import("react").JSX.Element;
