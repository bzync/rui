export type BillingInterval = "monthly" | "quarterly" | "yearly";
export interface BillingIntervalToggleOption {
    value: BillingInterval;
    label: string;
    badge?: string;
}
export interface BillingIntervalToggleProps {
    value: BillingInterval;
    onChange: (interval: BillingInterval) => void;
    options?: BillingIntervalToggleOption[];
    disabled?: boolean;
    /** "sm" (default) matches the subtle inline pill used in onboarding/billing
     * pages; "lg" matches the bolder blue-accent pill used on the marketing
     * pricing section. */
    size?: "sm" | "lg";
    className?: string;
}
export declare function BillingIntervalToggle({ value, onChange, options, disabled, size, className, }: BillingIntervalToggleProps): import("react").JSX.Element;
