"use client"

import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  useMemo,
} from "react"

export interface FormFieldContextValue {
  id: string
  errorId?: string
  hintId?: string
  describedBy?: string
  hasError: boolean
  error?: string
  required?: boolean
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(null)

export function useFormField(): FormFieldContextValue | null {
  return useContext(FormFieldContext)
}

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
  const generatedId = useId()
  const fieldId = htmlFor ?? generatedId
  const errorId = error ? `${fieldId}-error` : undefined
  const hintId = hint && !error ? `${fieldId}-hint` : undefined
  const describedBy = errorId ?? hintId

  const contextValue = useMemo<FormFieldContextValue>(
    () => ({
      id: fieldId,
      errorId,
      hintId,
      describedBy,
      hasError: Boolean(error),
      error,
      required,
    }),
    [fieldId, errorId, hintId, describedBy, error, required],
  )

  let renderedChildren = children
  if (isValidElement(children) && typeof children.type !== "symbol" && children.type !== "div") {
    const childElement = children as ReactElement<Record<string, unknown>>
    const childProps = childElement.props ?? {}
    const mergedDescribedBy = [childProps["aria-describedby"] as string | undefined, describedBy]
      .filter(Boolean)
      .join(" ") || undefined
    renderedChildren = cloneElement(childElement, {
      id: childProps.id ?? fieldId,
      "aria-invalid": childProps["aria-invalid"] ?? (error ? true : undefined),
      "aria-describedby": mergedDescribedBy,
      required: childProps.required ?? required,
    })
  }

  return (
    <FormFieldContext.Provider value={contextValue}>
      <div ref={ref} className={cn(fieldRootStyles, className)} {...props}>
        {label && (
          <label
            htmlFor={fieldId}
            className={cn("flex items-center gap-1", fieldLabelStyles)}
          >
            {label}
            {required && <><span aria-hidden="true" className="text-destructive">*</span><span className="sr-only"> (required)</span></>}
          </label>
        )}
        {renderedChildren}
        {error && <p id={errorId} aria-live="polite" className={fieldErrorStyles}>{error}</p>}
        {hint && !error && <p id={hintId} className={fieldDescriptionStyles}>{hint}</p>}
      </div>
    </FormFieldContext.Provider>
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
