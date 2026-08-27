"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import { KeyboardEvent, forwardRef, useEffect, useId, useRef, useState, useMemo, useCallback } from "react"
import type { SelectOption, SelectPropsSingle } from "./types"
import { colorDot, flatten, useMenuPosition, XIcon, ChevronIcon } from "./utils"
import { OptionList } from "./option-list"
import { useEventCallback } from "@/hooks/use-event-callback"

export const SelectSingle = forwardRef<HTMLButtonElement, SelectPropsSingle>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = "Select…",
      label,
      hint,
      error,
      disabled,
      required,
      clearable = false,
      className,
      wrapperClassName,
      triggerClassName,
      listClassName,
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
    const listRef = useRef<HTMLUListElement>(null)
    const onChangeStable = useEventCallback((v: string) => onChange?.(v))

    const value = controlledValue !== undefined ? controlledValue : localValue
    const flat = useMemo(() => flatten(options), [options])
    const selectedOpt = useMemo(() => flat.find((o) => o.value === value), [flat, value])

    const handleSelect = useCallback((opt: SelectOption) => {
      if (controlledValue === undefined) setLocalValue(opt.value)
      onChangeStable(opt.value)
      setOpen(false)
      setActiveIdx(-1)
    }, [controlledValue, onChangeStable])

    const handleClear = useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      if (controlledValue === undefined) setLocalValue("")
      onChangeStable("")
    }, [controlledValue, onChangeStable])

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
          <button ref={ref} id={triggerId} type="button" role="combobox" aria-expanded={open} onClick={() => setOpen(o => !o)} className={triggerClassName}>{selectedOpt?.label ?? placeholder}</button>
          {open && <ul ref={listRef} id={listId} className={listClassName}>{flat.map(o => <li key={o.value} data-idx={o.flatIdx} onClick={() => handleSelect(o)}>{o.label}</li>)}</ul>}
        </div>
      )
    }

    return (
      <div ref={containerRef} className={cn("relative", fieldRootStyles, wrapperClassName, className)}>
        {label && (
          <label htmlFor={triggerId} className={fieldLabelStyles}>
            {label}
            {required && <><span aria-hidden="true" className="ml-1 text-destructive">*</span><span className="sr-only"> (required)</span></>}
          </label>
        )}

        <button
          ref={ref}
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
            "flex h-9 w-full items-center gap-2 rounded-[var(--radius-md)] px-3 text-left outline-none",
            controlBaseStyles,
            "focus:border-accent-500 focus:ring-2 focus:ring-focus-ring/20",
            error && controlInvalidStyles,
            disabled && "opacity-50 cursor-not-allowed",
            triggerClassName,
          )}
        >
          {selectedOpt?.icon && (
            <span className="shrink-0 text-slate-500 dark:text-slate-400">{selectedOpt.icon}</span>
          )}
          {selectedOpt?.color && selectedOpt.color !== "default" && (
            <span className={cn("w-2 h-2 rounded-full shrink-0", colorDot[selectedOpt.color])} />
          )}
          <span className={cn("flex-1 min-w-0 text-sm truncate", selectedOpt ? "text-foreground" : "text-muted-foreground")}>
            {selectedOpt?.label ?? placeholder}
          </span>
          {clearable && value && !disabled && (
            <span role="button" tabIndex={-1} onClick={handleClear} className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <XIcon />
            </span>
          )}
          <ChevronIcon open={open} />
        </button>

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
        />

        {error && <p id={messageId} aria-live="polite" className={fieldErrorStyles}>{error}</p>}
        {hint && !error && <p id={messageId} className={fieldDescriptionStyles}>{hint}</p>}
      </div>
    )
  },
)

SelectSingle.displayName = "SelectSingle"
