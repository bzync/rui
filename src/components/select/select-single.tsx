"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles, controlSizeStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import { KeyboardEvent, forwardRef, useEffect, useId, useRef, useState, useMemo, useCallback } from "react"
import type { SelectOption, SelectPropsSingle } from "./types"
import { colorDot, flatten, useMenuPosition, XIcon, ChevronIcon } from "./utils"
import { OptionList } from "./option-list"
import { SelectFormFields } from "./form-fields"
import { useEventCallback } from "@/hooks/use-event-callback"

export const SelectSingle = forwardRef<HTMLButtonElement, SelectPropsSingle>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      onValueChange,
      placeholder = "Select…",
      label,
      hint,
      error,
      disabled,
      required,
      name,
      form,
      clearable = false,
      size = "md",
      className,
      wrapperClassName,
      triggerClassName,
      listClassName,
      labelClassName,
      messageClassName,
      optionClassName,
      groupLabelClassName,
      id: externalId,
      unstyled = false,
    },
    ref,
  ) => {
    const uid = useId()
    const triggerId = externalId ?? uid
    const listId = `${triggerId}-list`
    const messageId = `${triggerId}-message`

    const [open, setOpen] = useState(false)
    const [localValue, setLocalValue] = useState(defaultValue ?? "")
    const [activeIdx, setActiveIdx] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const commit = useEventCallback((v: string) => {
      onChange?.(v)
      onValueChange?.(v)
    })

    const value = controlledValue !== undefined ? controlledValue : localValue
    const flat = useMemo(() => flatten(options), [options])
    const selectedOpt = useMemo(() => flat.find((o) => o.value === value), [flat, value])

    const handleSelect = useCallback((opt: SelectOption) => {
      if (controlledValue === undefined) setLocalValue(opt.value)
      commit(opt.value)
      setOpen(false)
      setActiveIdx(-1)
    }, [controlledValue, commit])

    const handleClear = useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      if (controlledValue === undefined) setLocalValue("")
      commit("")
      triggerRef.current?.focus()
    }, [controlledValue, commit])

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
      if (!open) {
        if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
          e.preventDefault()
          setOpen(true)
          const selectedIndex = flat.find((o) => o.value === value && o.flatIdx >= 0)?.flatIdx ?? -1
          const enabled = flat.filter((o) => o.flatIdx >= 0)
          setActiveIdx(selectedIndex >= 0 ? selectedIndex : e.key === "ArrowUp" ? (enabled[enabled.length - 1]?.flatIdx ?? -1) : (enabled[0]?.flatIdx ?? -1))
        }
        return
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIdx((i) => {
          const enabled = flat.filter((o) => o.flatIdx >= 0)
          const cur = enabled.findIndex((o) => o.flatIdx === i)
          return enabled[Math.min(cur + 1, enabled.length - 1)]?.flatIdx ?? i
        })
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIdx((i) => {
          const enabled = flat.filter((o) => o.flatIdx >= 0)
          const cur = enabled.findIndex((o) => o.flatIdx === i)
          return enabled[Math.max(cur - 1, 0)]?.flatIdx ?? i
        })
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        const opt = flat.find((o) => o.flatIdx === activeIdx)
        if (opt) handleSelect(opt)
      } else if (e.key === "Escape" || e.key === "Tab") {
        setOpen(false)
        setActiveIdx(-1)
      }
    }, [open, flat, value, activeIdx, handleSelect])

    useEffect(() => {
      if (activeIdx < 0 || !listRef.current) return
      const el = listRef.current.querySelector(`[data-idx="${activeIdx}"]`) as HTMLElement
      el?.scrollIntoView({ block: "nearest" })
    }, [activeIdx])

    useEffect(() => {
      function onOutside(e: MouseEvent) {
        const t = e.target as Node
        if (containerRef.current?.contains(t) || listRef.current?.contains(t)) return
        setOpen(false)
      }
      document.addEventListener("mousedown", onOutside)
      return () => document.removeEventListener("mousedown", onOutside)
    }, [])

    const menuPos = useMenuPosition(open, containerRef)

    if (unstyled) {
      return (
        <div ref={containerRef} className={cn(className, wrapperClassName)}>
          <SelectFormFields name={name} form={form} values={value ? [value] : []} required={required} disabled={disabled} onReset={() => setLocalValue(defaultValue ?? "")} />
          <button ref={ref} id={triggerId} type="button" role="combobox" aria-expanded={open} onClick={() => setOpen(o => !o)} className={triggerClassName}>{selectedOpt?.label ?? placeholder}</button>
          {open && <ul ref={listRef} id={listId} className={listClassName}>{flat.map(o => <li key={o.value} data-idx={o.flatIdx} onClick={() => handleSelect(o)}>{o.label}</li>)}</ul>}
        </div>
      )
    }

    return (
      <div ref={containerRef} className={cn("relative", fieldRootStyles, wrapperClassName, className)}>
        {label && (
          <label htmlFor={triggerId} className={cn(fieldLabelStyles, labelClassName)}>
            {label}
            {required && <><span aria-hidden="true" className="ml-1 text-destructive">*</span><span className="sr-only"> (required)</span></>}
          </label>
        )}

        <button
          ref={(node) => {
            triggerRef.current = node
            if (typeof ref === "function") ref(node)
            else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
          }}
          id={triggerId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && activeIdx >= 0 ? `${listId}-opt-${activeIdx}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={error || hint ? messageId : undefined}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onClick={() => {
            if (disabled) return
            setOpen((o) => !o)
            if (!open) setActiveIdx(flat.find((o) => o.value === value && o.flatIdx >= 0)?.flatIdx ?? -1)
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-[var(--radius-md)] text-left outline-none",
            controlSizeStyles[size].height,
            controlSizeStyles[size].padding,
            controlBaseStyles,
            error && controlInvalidStyles,
            disabled && "opacity-50 cursor-not-allowed",
            triggerClassName,
          )}
        >
          {selectedOpt?.icon && (
            <span className="shrink-0 text-muted-foreground">{selectedOpt.icon}</span>
          )}
          {selectedOpt?.color && selectedOpt.color !== "default" && (
            <span className={cn("w-2 h-2 rounded-full shrink-0", colorDot[selectedOpt.color])} />
          )}
          <span className={cn("flex-1 min-w-0 truncate", controlSizeStyles[size].text, selectedOpt ? "text-foreground" : "text-muted-foreground")}>
            {selectedOpt?.label ?? placeholder}
          </span>
          {clearable && value && !disabled && (
            <span aria-hidden="true" className="w-4 shrink-0" />
          )}
          <ChevronIcon open={open} />
        </button>

        {clearable && value && !disabled && (
          <button
            type="button"
            aria-label="Clear selection"
            onClick={handleClear}
            className={cn(
              "absolute right-7 flex items-center justify-center shrink-0 text-muted-foreground hover:text-foreground transition-colors",
              controlSizeStyles[size].height,
              label ? "top-[1.625rem]" : "top-0",
            )}
          >
            <XIcon />
          </button>
        )}

        <SelectFormFields name={name} form={form} values={value ? [value] : []} required={required} disabled={disabled} onReset={() => setLocalValue(defaultValue ?? "")} />

        <OptionList
          listId={listId}
          listRef={listRef}
          open={open}
          pos={menuPos}
          options={options}
          flat={flat}
          activeIdx={activeIdx}
          setActiveIdx={setActiveIdx}
          isSelected={(v) => v === value}
          onSelect={handleSelect}
          colorDot={colorDot}
          className={listClassName}
          optionClassName={optionClassName}
          groupLabelClassName={groupLabelClassName}
        />

        {error && <p id={messageId} aria-live="polite" className={cn(fieldErrorStyles, messageClassName)}>{error}</p>}
        {hint && !error && <p id={messageId} className={cn(fieldDescriptionStyles, messageClassName)}>{hint}</p>}
      </div>
    )
  },
)

SelectSingle.displayName = "SelectSingle"
