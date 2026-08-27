import { cn } from "@/lib/cn"
import { CSSProperties, HTMLAttributes, forwardRef } from "react"

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(({
  ratio = 16 / 9,
  className,
  style,
  ...props
}, ref) => {
  const resolvedRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 16 / 9
  const ratioStyle: CSSProperties = { aspectRatio: resolvedRatio, ...style }

  return (
    <div
      ref={ref}
      data-ratio={resolvedRatio}
      className={cn("relative w-full overflow-hidden", className)}
      style={ratioStyle}
      {...props}
    />
  )
})
AspectRatio.displayName = "AspectRatio"
