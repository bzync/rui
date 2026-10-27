import { cn } from "@/lib/cn"
import { fieldLabelStyles } from "@/lib/component-styles"
import { LabelHTMLAttributes, forwardRef } from "react"

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  hint?: string
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label({ className, children, required, hint, ...props }, ref) {
  return (
    <label ref={ref}
      className={cn("flex items-center gap-1.5 select-none", fieldLabelStyles, className)}
      {...props}
    >
      <span>{children}</span>
      {required && <><span aria-hidden="true" className="text-destructive leading-none">*</span><span className="sr-only"> (required)</span></>}
      {hint && <span className="font-normal text-muted-foreground">({hint})</span>}
    </label>
  )
})
Label.displayName = "Label"
