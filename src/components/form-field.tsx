import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import { HTMLAttributes, ReactNode, forwardRef } from "react"

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  hint?: ReactNode
  error?: string
  required?: boolean
  htmlFor?: string
  children: ReactNode
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField({
  label,
  hint,
  error,
  required,
  htmlFor,
  className,
  children,
  ...props
}, ref) {
  return (
    <div ref={ref} className={cn(fieldRootStyles, className)} {...props}>
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
})
FormField.displayName = "FormField"
// ─── Spec-aligned aliases (§18) ───────────────────────────────────────────
// The canonical name per spec is <Field> / <FieldLabel> / <FieldDescription> / <FieldError>.
// FormField is kept as the primary export for backwards compat.

export const Field = FormField
export type FieldProps = FormFieldProps

export const FieldLabel = forwardRef<HTMLLabelElement, HTMLAttributes<HTMLLabelElement> & { required?: boolean; htmlFor?: string }>(function FieldLabel({
  className,
  children,
  required,
  htmlFor,
  ...props
}, ref) {
  return (
    <label ref={ref} htmlFor={htmlFor} className={cn("flex items-center gap-1", fieldLabelStyles, className)} {...props}>
      {children}
      {required && <><span aria-hidden="true" className="text-destructive"> *</span><span className="sr-only"> (required)</span></>}
    </label>
  )
})
FieldLabel.displayName = "FieldLabel"

export const FieldDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function FieldDescription({ className, ...props }, ref) {
  return <p ref={ref} className={cn(fieldDescriptionStyles, className)} {...props} />
})
FieldDescription.displayName = "FieldDescription"

export const FieldError = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function FieldError({ className, ...props }, ref) {
  return <p ref={ref} aria-live="polite" className={cn(fieldErrorStyles, className)} {...props} />
})
FieldError.displayName = "FieldError"

export const FieldContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function FieldContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props} />
})
FieldContent.displayName = "FieldContent"
