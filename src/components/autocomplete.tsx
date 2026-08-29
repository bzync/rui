"use client"

import { cn } from "@/lib/cn"
import { fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
import {
  KeyboardEvent,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react"
import {
  AutocompleteOption,
  AutocompleteProps,
  AutocompletePropsMulti,
  AutocompletePropsSingle,
} from "./autocomplete/types"
import { SingleTrigger } from "./autocomplete/single-trigger"
import { MultiTrigger } from "./autocomplete/multi-trigger"
import { AutocompleteDropdown } from "./autocomplete/dropdown"
import { useMenuPosition } from "./select/utils"
import { useEventCallback } from "@/hooks/use-event-callback"

export type {
  AutocompleteOption,
  AutocompleteProps,
  AutocompletePropsSingle,
  AutocompletePropsMulti,
} from "./autocomplete/types"

function AutocompleteInner<V = string>(
  props: AutocompleteProps<V>,
  ref: React.Ref<HTMLInputElement>,
) {
  const {
    options,
    inputValue: controlledInput,
    onInputChange,
    label,
    hint,
    error,
    prefix,
    clearable = true,
    loading = false,
    emptyMessage = "No results",
    maxVisible = 8,
    className,
    wrapperClassName,
    triggerClassName,
    inputClassName,
    labelClassName,
    messageClassName,
    listClassName,
    optionClassName,
    loadingClassName,
    emptyClassName,
    placeholder,
    disabled,
    id: externalId,
    multiple,
    unstyled = false,
    ...inputProps
  } = props
  const {
    value: selectionValue,
    onSelect: selectionHandler,
    onDeselect: deselectionHandler,
    ...nativeInputProps
  } = inputProps
  void selectionValue
  void selectionHandler
  void deselectionHandler

  const uid = useId()
  const inputId = externalId ?? uid
  const listId = `${inputId}-list`
  const messageId = `${inputId}-message`

  const [localInput, setLocalInput] = useState("")
  const inputText = controlledInput !== undefined ? controlledInput : localInput
  const onInputChangeStable = useEventCallback((v: string) => onInputChange?.(v))

  const setInput = useCallback((v: string) => {
    if (controlledInput !== undefined) onInputChangeStable(v)
    else setLocalInput(v)
  }, [controlledInput, onInputChangeStable])

  const [localSelected, setLocalSelected] = useState<AutocompleteOption<V>[]>([])

  const selected: AutocompleteOption<V>[] = useMemo(() => {
    if (!multiple) return []
    const multiProps = props as AutocompletePropsMulti<V>
    if (multiProps.value !== undefined) {
      return options.filter((o) => (multiProps.value as V[]).includes(o.value))
    }
    return localSelected
  }, [multiple, options, props, localSelected])

  const selectedValues = useMemo(() => selected.map((o) => o.value), [selected])

  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const internalInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return options.filter((opt) => !opt.disabled && opt.label.toLowerCase().includes(q)).slice(0, maxVisible)
  }, [options, query, maxVisible])

  const handleSelectSingle = useCallback((opt: AutocompleteOption<V>) => {
    const singleProps = props as AutocompletePropsSingle<V>
    singleProps.onSelect?.(opt)
    setInput(opt.label)
    setOpen(false)
    setActiveIdx(-1)
  }, [props, setInput])

  const addMulti = useCallback((opt: AutocompleteOption<V>) => {
    const multiProps = props as AutocompletePropsMulti<V>
    const next = [...selected, opt]
    if (multiProps.value === undefined) setLocalSelected(next)
    multiProps.onSelect?.(opt, next)
    setInput("")
    setActiveIdx(-1)
    internalInputRef.current?.focus()
  }, [selected, props, setInput])

  const removeMulti = useCallback((opt: AutocompleteOption<V>) => {
    const multiProps = props as AutocompletePropsMulti<V>
    const next = selected.filter((o) => o.value !== opt.value)
    if (multiProps.value === undefined) setLocalSelected(next)
    multiProps.onDeselect?.(opt, next)
  }, [selected, props])

  const toggleMulti = useCallback((opt: AutocompleteOption<V>) => {
    if (selectedValues.includes(opt.value)) removeMulti(opt)
    else addMulti(opt)
  }, [selectedValues, removeMulti, addMulti])

  const handleClearSingle = useCallback(() => {
    setInput("")
    const singleProps = props as AutocompletePropsSingle<V>
    singleProps.onSelect?.({ value: "" as V, label: "" })
    setOpen(false)
  }, [props, setInput])

  const handleClearMulti = useCallback(() => {
    const multiProps = props as AutocompletePropsMulti<V>
    if (multiProps.value === undefined) setLocalSelected([])
    setInput("")
  }, [props, setInput])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (multiple && e.key === "Backspace" && inputText === "" && selected.length > 0) {
      removeMulti(selected[selected.length - 1])
      return
    }
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { setOpen(true); setQuery("") }
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const opt = filtered[activeIdx]
      if (!opt) return
      if (multiple) toggleMulti(opt)
      else handleSelectSingle(opt)
    } else if (e.key === "Escape") {
      setOpen(false)
      setActiveIdx(-1)
    }
  }, [multiple, inputText, selected, open, filtered, activeIdx, toggleMulti, handleSelectSingle, removeMulti])

  useEffect(() => {
    if (activeIdx < 0 || !listRef.current) return
    const el = listRef.current.children[activeIdx] as HTMLElement
    el?.scrollIntoView({ block: "nearest" })
  }, [activeIdx])

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      const target = e.target as Node
      if (!containerRef.current?.contains(target) && !listRef.current?.contains(target)) setOpen(false)
    }
    document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [])

  const singleValue = !multiple ? (props as AutocompletePropsSingle<V>).value : undefined
  const showSingleClear = !!(!multiple && clearable && inputText.length > 0 && !disabled)
  const showMultiClear  = !!(multiple  && clearable && (selected.length > 0 || inputText.length > 0) && !disabled)
  const menuPos = useMenuPosition(open, containerRef)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setInput(e.target.value); setQuery(e.target.value); setOpen(true); setActiveIdx(-1) }, [setInput])
  const handleFocus = useCallback(() => { setOpen(true); setQuery("") }, [])

  if (unstyled) {
    return (
      <div ref={containerRef} className={cn(className, wrapperClassName)}>
        <input ref={ref} id={inputId} value={inputText} onChange={handleInputChange} placeholder={placeholder} disabled={disabled} />
        {open && <ul ref={listRef} id={listId} className={listClassName}>{filtered.map(o => <li key={String(o.value)} onClick={() => multiple ? toggleMulti(o) : handleSelectSingle(o)}>{o.label}</li>)}</ul>}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn("relative", fieldRootStyles, wrapperClassName, className)}>
      {label && (
        <label htmlFor={inputId} className={cn(fieldLabelStyles, labelClassName)}>
          {label}
          {inputProps.required && <><span aria-hidden="true" className="ml-1 text-destructive">*</span><span className="sr-only"> (required)</span></>}
        </label>
      )}

      {!multiple && (
        <SingleTrigger
          inputRef={ref}
          inputId={inputId}
          listId={listId}
          open={open}
          activeIdx={activeIdx}
          inputText={inputText}
          prefix={prefix}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          loading={loading}
          showClear={showSingleClear}
          onInputChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onClear={handleClearSingle}
          messageId={error || hint ? messageId : undefined}
          inputProps={nativeInputProps}
          className={triggerClassName}
          inputClassName={inputClassName}
        />
      )}

      {multiple && (
        <MultiTrigger
          inputRef={(node) => {
            (internalInputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
            if (typeof ref === "function") ref(node)
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
          }}
          inputId={inputId}
          listId={listId}
          open={open}
          activeIdx={activeIdx}
          inputText={inputText}
          prefix={prefix}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          loading={loading}
          showClear={showMultiClear}
          selected={selected}
          onContainerClick={() => { if (!disabled) { internalInputRef.current?.focus(); setOpen(true); setQuery("") } }}
          onInputChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onRemove={removeMulti}
          onClearAll={handleClearMulti}
          messageId={error || hint ? messageId : undefined}
          inputProps={nativeInputProps}
          className={triggerClassName}
          inputClassName={inputClassName}
        />
      )}

      <AutocompleteDropdown
        listRef={listRef}
        listId={listId}
        open={open}
        pos={menuPos}
        multiple={multiple}
        loading={loading}
        filtered={filtered}
        emptyMessage={emptyMessage}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
        inputText={query}
        selectedValues={selectedValues}
        singleValue={singleValue}
        onSelectSingle={handleSelectSingle}
        onToggleMulti={toggleMulti}
        className={listClassName}
        optionClassName={optionClassName}
        loadingClassName={loadingClassName}
        emptyClassName={emptyClassName}
      />

      {error && <p id={messageId} aria-live="polite" className={cn(fieldErrorStyles, messageClassName)}>{error}</p>}
      {hint && !error && <p id={messageId} className={cn(fieldDescriptionStyles, messageClassName)}>{hint}</p>}
    </div>
  )
}

export const Autocomplete = forwardRef(AutocompleteInner) as <V = string>(
  props: AutocompleteProps<V> & { ref?: React.Ref<HTMLInputElement> }
) => React.ReactElement
