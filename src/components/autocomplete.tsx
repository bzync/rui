"use client"

import { cn } from "@/lib/cn"
import { controlSizeStyles, fieldDescriptionStyles, fieldErrorStyles, fieldLabelStyles, fieldRootStyles } from "@/lib/component-styles"
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
import { SelectFormFields } from "./select/form-fields"

export type {
  AutocompleteOption,
  AutocompleteProps,
  AutocompletePropsSingle,
  AutocompletePropsMulti,
  AutocompleteSingleProps,
  AutocompleteMultiProps,
} from "./autocomplete/types"

const NO_OPTIONS: AutocompleteOption<unknown>[] = []

function AutocompleteInner<V = string>(
  props: AutocompleteProps<V>,
  ref: React.Ref<HTMLInputElement>,
) {
  const {
    options = NO_OPTIONS as AutocompleteOption<V>[],
    inputValue: controlledInput,
    onInputChange,
    label,
    hint,
    error,
    prefix,
    clearable = true,
    size = "md",
    loading: loadingProp = false,
    creatable = false,
    onCreate,
    createLabel = (text: string) => `Create “${text}”`,
    loadOptions,
    debounceMs = 250,
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
    defaultValue: defaultSelection,
    onSelect: selectionHandler,
    onDeselect: deselectionHandler,
    onValueChange: valueChangeHandler,
    // Form participation belongs to the selection, not the typed text.
    name,
    form,
    required,
    ...textInputProps
  } = inputProps
  void selectionValue
  void defaultSelection
  void selectionHandler
  void deselectionHandler
  void valueChangeHandler
  const nativeInputProps = { ...textInputProps, "aria-required": required || undefined }

  const uid = useId()
  const inputId = externalId ?? uid
  const listId = `${inputId}-list`
  const messageId = `${inputId}-message`

  // Uncontrolled initial selection, resolved to options once on mount.
  const [initialSingle] = useState<AutocompleteOption<V> | null>(() =>
    !multiple && defaultSelection != null ? options.find((o) => o.value === defaultSelection) ?? null : null)
  const [localInput, setLocalInput] = useState(initialSingle?.label ?? "")
  const inputText = controlledInput !== undefined ? controlledInput : localInput
  const onInputChangeStable = useEventCallback((v: string) => onInputChange?.(v))

  const setInput = useCallback((v: string) => {
    if (controlledInput !== undefined) onInputChangeStable(v)
    else setLocalInput(v)
  }, [controlledInput, onInputChangeStable])

  const [localSelected, setLocalSelected] = useState<AutocompleteOption<V>[]>(() =>
    multiple && Array.isArray(defaultSelection) ? options.filter((o) => (defaultSelection as V[]).includes(o.value)) : [])
  // Uncontrolled single selection, so a form can submit the chosen value.
  const [localSingle, setLocalSingle] = useState<AutocompleteOption<V> | null>(initialSingle)

  // A controlled single value shows its option label in the input (unless the
  // text itself is controlled). Previously the input stayed empty.
  const controlledSingle = !multiple ? (props as AutocompletePropsSingle<V>).value : undefined
  useEffect(() => {
    if (multiple || controlledSingle === undefined || controlledInput !== undefined) return
    setLocalInput(options.find((o) => o.value === controlledSingle)?.label ?? "")
    // Only when the selected value changes; `options` identity churns every render.
  }, [controlledSingle, multiple, controlledInput])

  // Every option seen so far (static, fetched or created), so selected chips
  // keep their labels after async results change.
  const [remoteOptions, setRemoteOptions] = useState<AutocompleteOption<V>[] | null>(null)
  const [remoteLoading, setRemoteLoading] = useState(false)
  const [createdOptions, setCreatedOptions] = useState<AutocompleteOption<V>[]>([])
  const knownRef = useRef(new Map<V, AutocompleteOption<V>>())
  for (const option of [...options, ...(remoteOptions ?? []), ...createdOptions]) knownRef.current.set(option.value, option)
  const loading = loadingProp || remoteLoading

  const selected: AutocompleteOption<V>[] = useMemo(() => {
    if (!multiple) return []
    const multiProps = props as AutocompletePropsMulti<V>
    if (multiProps.value !== undefined) {
      return (multiProps.value as V[]).map((value) => knownRef.current.get(value)).filter((o): o is AutocompleteOption<V> => Boolean(o))
    }
    return localSelected
  }, [multiple, props, localSelected, options, remoteOptions, createdOptions])

  const selectedValues = useMemo(() => selected.map((o) => o.value), [selected])

  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const internalInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (!loadOptions || !open) return
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setRemoteLoading(true)
      loadOptions(query.trim(), controller.signal)
        .then((result) => { if (!controller.signal.aborted) setRemoteOptions(result) })
        .catch(() => { if (!controller.signal.aborted) setRemoteOptions([]) })
        .finally(() => { if (!controller.signal.aborted) setRemoteLoading(false) })
    }, debounceMs)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [loadOptions, query, open, debounceMs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    // Async results are already filtered by the server.
    if (loadOptions) return (remoteOptions ?? []).filter((opt) => !opt.disabled).slice(0, maxVisible)
    return [...options, ...createdOptions].filter((opt) => !opt.disabled && opt.label.toLowerCase().includes(q)).slice(0, maxVisible)
  }, [options, createdOptions, remoteOptions, loadOptions, query, maxVisible])

  const createText = query.trim()
  const showCreate = creatable && createText.length > 0 && !loading
    && ![...knownRef.current.values()].some((opt) => opt.label.toLowerCase() === createText.toLowerCase())
  // The create row sits after the options and is keyboard-reachable like one.
  const optionCount = filtered.length + (showCreate ? 1 : 0)

  const handleSelectSingle = useCallback((opt: AutocompleteOption<V>) => {
    const singleProps = props as AutocompletePropsSingle<V>
    singleProps.onSelect?.(opt)
    singleProps.onValueChange?.(opt.value)
    setLocalSingle(opt)
    setInput(opt.label)
    setOpen(false)
    setActiveIdx(-1)
  }, [props, setInput])

  const addMulti = useCallback((opt: AutocompleteOption<V>) => {
    const multiProps = props as AutocompletePropsMulti<V>
    const next = [...selected, opt]
    if (multiProps.value === undefined) setLocalSelected(next)
    multiProps.onSelect?.(opt, next)
    multiProps.onValueChange?.(next.map((o) => o.value))
    setInput("")
    setActiveIdx(-1)
    internalInputRef.current?.focus()
  }, [selected, props, setInput])

  const removeMulti = useCallback((opt: AutocompleteOption<V>) => {
    const multiProps = props as AutocompletePropsMulti<V>
    const next = selected.filter((o) => o.value !== opt.value)
    if (multiProps.value === undefined) setLocalSelected(next)
    multiProps.onDeselect?.(opt, next)
    multiProps.onValueChange?.(next.map((o) => o.value))
  }, [selected, props])

  const toggleMulti = useCallback((opt: AutocompleteOption<V>) => {
    if (selectedValues.includes(opt.value)) removeMulti(opt)
    else addMulti(opt)
  }, [selectedValues, removeMulti, addMulti])

  const handleClearSingle = useCallback(() => {
    setInput("")
    const singleProps = props as AutocompletePropsSingle<V>
    singleProps.onSelect?.({ value: "" as V, label: "" })
    singleProps.onValueChange?.("" as V)
    setLocalSingle(null)
    setOpen(false)
  }, [props, setInput])

  const handleClearMulti = useCallback(() => {
    const multiProps = props as AutocompletePropsMulti<V>
    if (multiProps.value === undefined) setLocalSelected([])
    multiProps.onValueChange?.([])
    setInput("")
  }, [props, setInput])

  function createOption() {
    const option = onCreate?.(createText) ?? ({ value: createText as unknown as V, label: createText })
    setCreatedOptions((current) => [...current, option])
    knownRef.current.set(option.value, option)
    if (multiple) addMulti(option)
    else handleSelectSingle(option)
    setQuery("")
  }

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
      setActiveIdx((i) => Math.min(i + 1, optionCount - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (showCreate && activeIdx === filtered.length) { createOption(); return }
      const opt = filtered[activeIdx]
      if (!opt) return
      if (multiple) toggleMulti(opt)
      else handleSelectSingle(opt)
    } else if (e.key === "Escape") {
      setOpen(false)
      setActiveIdx(-1)
    }
  }, [multiple, inputText, selected, open, filtered, activeIdx, toggleMulti, handleSelectSingle, removeMulti, showCreate, optionCount])

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
  const submitted = multiple
    ? selectedValues.map(String)
    : (() => {
        const chosen = singleValue !== undefined ? singleValue : localSingle?.value
        return chosen === undefined || chosen === null || chosen === "" ? [] : [String(chosen)]
      })()
  const formFields = (
    <SelectFormFields
      name={name}
      form={form}
      values={submitted}
      required={required}
      disabled={disabled}
      onReset={() => {
        if (controlledInput === undefined) setLocalInput("")
        setLocalSingle(null)
        setLocalSelected([])
      }}
    />
  )
  const showSingleClear = !!(!multiple && clearable && inputText.length > 0 && !disabled)
  const showMultiClear  = !!(multiple  && clearable && (selected.length > 0 || inputText.length > 0) && !disabled)
  const menuPos = useMenuPosition(open, containerRef)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setInput(text); setQuery(text); setOpen(true); setActiveIdx(-1)
    // Editing away from the chosen label drops the uncontrolled selection, so a stale value is never submitted.
    setLocalSingle((current) => (current && current.label === text ? current : null))
  }, [setInput])
  const handleFocus = useCallback(() => { setOpen(true); setQuery("") }, [])

  if (unstyled) {
    return (
      <div ref={containerRef} className={cn(className, wrapperClassName)}>
        {formFields}
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
          {required && <><span aria-hidden="true" className="ml-1 text-destructive">*</span><span className="sr-only"> (required)</span></>}
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
          className={cn(controlSizeStyles[size].height, controlSizeStyles[size].padding, triggerClassName)}
          inputClassName={cn(controlSizeStyles[size].text, inputClassName)}
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
          className={cn(controlSizeStyles[size].minHeight, "py-1", triggerClassName)}
          inputClassName={cn(controlSizeStyles[size].text, inputClassName)}
        />
      )}

      {formFields}

      <AutocompleteDropdown
        listRef={listRef}
        listId={listId}
        open={open}
        pos={menuPos}
        multiple={multiple}
        loading={loading}
        filtered={filtered}
        emptyMessage={emptyMessage}
        createRow={showCreate ? createLabel(createText) : null}
        onCreate={createOption}
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

;(Autocomplete as { displayName?: string }).displayName = "Autocomplete"
