"use client"

import { cn } from "@/lib/cn"
import { controlBaseStyles, controlInvalidStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import { KeyboardEvent, forwardRef, useEffect, useId, useRef, useState } from "react"
import type { SelectOption, SelectPropsMulti } from "./types"
import { colorDot, flatten, useMenuPosition, XIcon, ChevronIcon } from "./utils"
import { OptionList } from "./option-list"

export const SelectMulti = forwardRef<HTMLButtonElement, SelectPropsMulti>(
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
    const [localValues, setLocalValues] = useState<string[]>(defaultValue ?? [])
    const [activeIdx, setActiveIdx] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    const values = controlledValue !== undefined ? controlledValue : localValues
    const flat = flatten(options)
    const selectedOpts = flat.filter((o) => values.includes(o.value))

    function toggle(opt: SelectOption) {
      const next = values.includes(opt.value)
        ? values.filter((v) => v !== opt.value)
        : [...values, opt.value]
      if (controlledValue === undefined) setLocalValues(next)
      onChange?.(next)
    }

    function removeAt(value: string, e: React.MouseEvent) {
      e.stopPropagation()
      const next = values.filter((v) => v !== value)
      if (controlledValue === undefined) setLocalValues(next)
      onChange?.(next)
    }

    function clearAll(e: React.MouseEvent) {
      e.stopPropagation()
      if (controlledValue === undefined) setLocalValues([])
      onChange?.([])
    }

    function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
      if (!open) {
        if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
          e.preventDefault()
          setOpen(true)
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
        if (opt) toggle(opt)
      } else if (e.key === "Escape" || e.key === "Tab") {
        setOpen(false)
        setActiveIdx(-1)
      }
    }

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
          <button ref={ref} id={triggerId} type="button" role="combobox" aria-expanded={open} aria-controls={listId} onKeyDown={handleKeyDown} onClick={() => setOpen((current) => !current)} className={triggerClassName}>{selectedOpts.length > 0 ? selectedOpts.map((option) => option.label).join(", ") : placeholder}</button>
          <OptionList listId={listId} listRef={listRef} open={open} pos={menuPos} options={options} flat={flat} activeIdx={activeIdx} setActiveIdx={setActiveIdx} isSelected={(optionValue) => values.includes(optionValue)} onSelect={toggle} multiselectable colorDot={colorDot} className={listClassName} />
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
          }}
          className={cn(
            "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-1.5 text-left outline-none",
            controlBaseStyles,
            "focus:border-accent-500 focus:ring-2 focus:ring-focus-ring/20",
            error && controlInvalidStyles,
            disabled && "opacity-50 cursor-not-allowed",
            triggerClassName,
          )}
        >
          {selectedOpts.length === 0 ? (
            <span className="flex-1 text-sm text-slate-500 truncate">{placeholder}</span>
          ) : (
            selectedOpts.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex max-w-[160px] items-center gap-1 rounded-md border border-border bg-surface-muted px-2 py-0.5 text-xs font-medium text-foreground"
              >
                {opt.color && opt.color !== "default" && (
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", colorDot[opt.color])} />
                )}
                <span className="truncate">{opt.label}</span>
                <span
                  role="button"
                  tabIndex={-1}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => removeAt(opt.value, e)}
                  className="shrink-0 text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer ml-0.5"
                  aria-label={`Remove ${opt.label}`}
                >
                  <XIcon />
                </span>
              </span>
            ))
          )}
          <span className="ml-auto flex items-center gap-1.5 shrink-0 pl-1">
            {clearable && values.length > 0 && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={clearAll}
                className="text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label="Clear all"
              >
                <XIcon />
              </span>
            )}
            {values.length > 0 && (
              <span className="text-[10px] font-medium text-slate-500 tabular-nums">{values.length}</span>
            )}
            <ChevronIcon open={open} />
          </span>
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
          isSelected={(v) => values.includes(v)}
          onSelect={toggle}
          multiselectable
          colorDot={colorDot}
          className={listClassName}
        />

        {error && <p id={messageId} aria-live="polite" className={fieldErrorStyles}>{error}</p>}
        {hint && !error && <p id={messageId} className={fieldDescriptionStyles}>{hint}</p>}
      </div>
    )
  },
)

SelectMulti.displayName = "SelectMulti"
