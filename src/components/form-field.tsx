import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import { HTMLAttributes, ReactNode } from "react"

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  hint?: ReactNode
  error?: string
  required?: boolean
  htmlFor?: string
  children: ReactNode
}

export function FormField({
  label,
  hint,
  error,
  required,
  htmlFor,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn(fieldRootStyles, className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn("flex items-center gap-1", fieldLabelStyles)}
        >
          {label}
          {required && <><span aria-hidden="true" className="text-destructive">*</span><span className="sr-only"> (required)</span></>}
        </label>
      )}
      {children}
      {error && <p aria-live="polite" className={fieldErrorStyles}>{error}</p>}
      {hint && !error && <p className={fieldDescriptionStyles}>{hint}</p>}
    </div>
  )
}
// ─── Spec-aligned aliases (§18) ───────────────────────────────────────────
// The canonical name per spec is <Field> / <FieldLabel> / <FieldDescription> / <FieldError>.
// FormField is kept as the primary export for backwards compat.

export const Field = FormField
export type FieldProps = FormFieldProps

export function FieldLabel({
  className,
  children,
  required,
  htmlFor,
  ...props
}: HTMLAttributes<HTMLLabelElement> & { required?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("flex items-center gap-1", fieldLabelStyles, className)} {...props}>
      {children}
      {required && <><span aria-hidden="true" className="text-destructive"> *</span><span className="sr-only"> (required)</span></>}
    </label>
  )
}

export function FieldDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(fieldDescriptionStyles, className)} {...props} />
}

export function FieldError({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p aria-live="polite" className={cn(fieldErrorStyles, className)} {...props} />
}

export function FieldContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />
}
