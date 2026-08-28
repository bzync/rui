"use client"

import { cn } from "@/lib/cn"
import { motion } from "framer-motion"
import { transitions } from "@/lib/motion"
import {
  InputHTMLAttributes,
  forwardRef,
  useEffect,
  useId,
  useState,
} from "react"

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: string
  description?: string
  size?: "sm" | "md"
  onCheckedChange?: (checked: boolean) => void
}

const track = {
  sm: { w: 36, h: 20, thumb: 14, gap: 3 },
  md: { w: 44, h: 24, thumb: 18, gap: 3 },
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      description,
      size = "md",
      checked,
      defaultChecked,
      onChange,
      onCheckedChange,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const [isChecked, setIsChecked] = useState<boolean>(
      checked !== undefined ? checked : (defaultChecked ?? false),
    )

    useEffect(() => {
      if (checked !== undefined) setIsChecked(checked)
    }, [checked])

    const uid = useId()
    const switchId = id ?? uid
    const dims = track[size]
    const thumbX = isChecked ? dims.w - dims.thumb - dims.gap : dims.gap

    return (
      <label
        htmlFor={switchId}
        className={cn(
          "flex items-start gap-3 cursor-pointer",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <div className="relative mt-0.5 shrink-0" style={{ width: dims.w, height: dims.h }}>
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            checked={isChecked}
            disabled={disabled}
            onChange={(e) => {
              if (checked === undefined) setIsChecked(e.target.checked)
              onChange?.(e)
              onCheckedChange?.(e.target.checked)
            }}
            {...props}
          />
          <div
            className={cn(
              "rounded-full w-full h-full border transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring/35 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg",
              isChecked
                ? "bg-primary border-primary"
                : "bg-muted border-border-strong",
            )}
          />
          <motion.span
            className="absolute rounded-full bg-white shadow-md shadow-black/20"
            style={{
              width: dims.thumb,
              height: dims.thumb,
              top: dims.gap,
              boxShadow: "0 1px 4px rgba(0,0,0,0.22), 0 0 0 0.5px rgba(0,0,0,0.06)",
            }}
            animate={{ x: thumbX }}
            transition={transitions.switchThumb}
          />
        </div>
        {(label || description) && (
          <div className="min-w-0">
            {label && (
              <p className="text-sm font-medium text-foreground">{label}</p>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </label>
    )
  },
)

Switch.displayName = "Switch"
