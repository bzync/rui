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
