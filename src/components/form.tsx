"use client"

import { cn } from "@/lib/cn"
import {
  type ChangeEvent,
  type FormEvent,
  type FormHTMLAttributes,
  type ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import { mergeRefs } from "@/lib/merge-refs"
import { Alert } from "./alert"

export type FormValues = Record<string, unknown>
export type FormErrors<T extends FormValues> = Partial<Record<keyof T & string, string>>

/**
 * Any schema with a Zod-style `safeParse` (Zod, or an adapter for Valibot,
 * Yup…). Only `issues[].path[0]` and `issues[].message` are read, so the
 * library takes no dependency on a schema package.
 */
export interface FormSchema<T> {
  safeParse(values: T): { success: true; data?: unknown } | { success: false; error: { issues: { path: (string | number)[]; message: string }[] } }
}

export interface UseFormOptions<T extends FormValues> {
  defaultValues: T
  /** Returns a message per invalid field (may be async). */
  validate?: (values: T) => FormErrors<T> | Promise<FormErrors<T>>
  /** Zod-compatible schema; merged with `validate`. */
  schema?: FormSchema<T>
  /** When errors first appear. After a submit attempt fields always revalidate on change. Default "onSubmit". */
  mode?: "onSubmit" | "onBlur" | "onChange"
}

export interface RegisteredField {
  name: string
  value?: string
  checked?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onBlur: () => void
  error?: string
}

export interface ControlledField<V> {
  name: string
  value: V
  onChange: (value: V) => void
  onBlur: () => void
  error?: string
}

export interface UseFormReturn<T extends FormValues> {
  values: T
  errors: FormErrors<T>
  touched: Partial<Record<keyof T & string, boolean>>
  isSubmitting: boolean
  isDirty: boolean
  isValid: boolean
  submitCount: number
  /** Props for native-event fields: Input, Textarea, Checkbox, Switch (pass `{ type: "checkbox" }`). */
  register: <K extends keyof T & string>(name: K, options?: { type?: "checkbox" }) => RegisteredField
  /** Props for value-based fields: Select, DatePicker, RadioGroup, NumberInput, Slider… */
  control: <K extends keyof T & string>(name: K) => ControlledField<T[K]>
  setValue: <K extends keyof T & string>(name: K, value: T[K]) => void
  setError: (name: keyof T & string, message: string | undefined) => void
  reset: (values?: T) => void
  /** Validates everything; resolves to the error map. */
  validateForm: () => Promise<FormErrors<T>>
  handleSubmit: (onValid: (values: T) => void | Promise<void>, onInvalid?: (errors: FormErrors<T>) => void) => (event?: FormEvent) => Promise<void>
}

const isEmpty = (errors: object) => Object.values(errors).every((message) => !message)

export function useForm<T extends FormValues>({ defaultValues, validate, schema, mode = "onSubmit" }: UseFormOptions<T>): UseFormReturn<T> {
  const [initial, setInitial] = useState(defaultValues)
  const [values, setValues] = useState(defaultValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T & string, boolean>>>({})
  const [isSubmitting, setSubmitting] = useState(false)
  const [submitCount, setSubmitCount] = useState(0)
  const valuesRef = useRef(values)
  valuesRef.current = values

  const runValidation = useCallback(async (next: T): Promise<FormErrors<T>> => {
    const result: FormErrors<T> = {}
    if (schema) {
      const parsed = schema.safeParse(next)
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = String(issue.path[0] ?? "") as keyof T & string
          if (key && !result[key]) result[key] = issue.message
        }
      }
    }
    if (validate) {
      const custom = await validate(next)
      for (const [key, message] of Object.entries(custom) as [keyof T & string, string | undefined][]) {
        if (message && !result[key]) result[key] = message
      }
    }
    return result
  }, [schema, validate])

  const revalidateField = useCallback(async (name: keyof T & string, next: T) => {
    const all = await runValidation(next)
    setErrors((current) => ({ ...current, [name]: all[name] }))
  }, [runValidation])

  const setValue = useCallback(<K extends keyof T & string>(name: K, value: T[K]) => {
    const next = { ...valuesRef.current, [name]: value }
    valuesRef.current = next
    setValues(next)
    if (mode === "onChange" || submitCount > 0) void revalidateField(name, next)
  }, [mode, submitCount, revalidateField])

  const blur = useCallback((name: keyof T & string) => {
    setTouched((current) => ({ ...current, [name]: true }))
    if (mode === "onBlur" || mode === "onChange") void revalidateField(name, valuesRef.current)
  }, [mode, revalidateField])

  const register = useCallback(<K extends keyof T & string>(name: K, options?: { type?: "checkbox" }): RegisteredField => {
    const checkbox = options?.type === "checkbox"
    return {
      name,
      ...(checkbox ? { checked: Boolean(values[name]) } : { value: String(values[name] ?? "") }),
      onChange: (event) => setValue(name, (checkbox ? (event.target as HTMLInputElement).checked : event.target.value) as T[K]),
      onBlur: () => blur(name),
      error: errors[name],
    }
  }, [values, errors, setValue, blur])

  const control = useCallback(<K extends keyof T & string>(name: K): ControlledField<T[K]> => ({
    name,
    value: values[name],
    onChange: (value: T[K]) => setValue(name, value),
    onBlur: () => blur(name),
    error: errors[name],
  }), [values, errors, setValue, blur])

  const validateForm = useCallback(async () => {
    const result = await runValidation(valuesRef.current)
    setErrors(result)
    return result
  }, [runValidation])

  const handleSubmit = useCallback((onValid: (values: T) => void | Promise<void>, onInvalid?: (errors: FormErrors<T>) => void) => async (event?: FormEvent) => {
    event?.preventDefault()
    setSubmitCount((count) => count + 1)
    const result = await validateForm()
    if (!isEmpty(result)) {
      onInvalid?.(result)
      return
    }
    setSubmitting(true)
    try {
      await onValid(valuesRef.current)
    } finally {
      setSubmitting(false)
    }
  }, [validateForm])

  const reset = useCallback((next?: T) => {
    const base = next ?? initial
    if (next) setInitial(next)
    valuesRef.current = base
    setValues(base)
    setErrors({})
    setTouched({})
    setSubmitCount(0)
  }, [initial])

  const isDirty = useMemo(() => Object.keys(values).some((key) => !Object.is(values[key], initial[key])), [values, initial])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid: isEmpty(errors),
    submitCount,
    register,
    control,
    setValue,
    setError: (name, message) => setErrors((current) => ({ ...current, [name]: message })),
    reset,
    validateForm,
    handleSubmit,
  }
}

const FormContext = createContext<UseFormReturn<FormValues> | null>(null)

/** The nearest <Form>'s state, for building custom fields. */
export function useFormContext<T extends FormValues>() {
  return useContext(FormContext) as UseFormReturn<T> | null
}

export interface FormProps<T extends FormValues> extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onInvalid"> {
  form: UseFormReturn<T>
  onSubmit: (values: T) => void | Promise<void>
  onInvalid?: (errors: FormErrors<T>) => void
  /** Lists errors in an alert after a failed submit (recommended for long forms). */
  errorSummary?: boolean | string
  children: ReactNode
}

function FormInner<T extends FormValues>({ form, onSubmit, onInvalid, errorSummary = false, className, children, ...props }: FormProps<T>, ref: React.Ref<HTMLFormElement>) {
  const formRef = useRef<HTMLFormElement>(null)
  const [summary, setSummary] = useState<string[]>([])

  const submit = form.handleSubmit(onSubmit, (errors) => {
    setSummary(Object.values(errors).filter((message): message is string => Boolean(message)))
    onInvalid?.(errors)
    // Our fields mark themselves aria-invalid once their error renders.
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
  })

  const visibleSummary = errorSummary && form.submitCount > 0 && !form.isValid ? summary.filter((message) => Object.values(form.errors).includes(message)) : []

  return (
    <FormContext.Provider value={form as unknown as UseFormReturn<FormValues>}>
      <form ref={mergeRefs(formRef, ref)} noValidate aria-busy={form.isSubmitting || undefined} className={cn("grid gap-4", className)} onSubmit={(event) => { setSummary([]); void submit(event) }} {...props}>
        {visibleSummary.length > 0 && (
          <Alert variant="danger" title={typeof errorSummary === "string" ? errorSummary : `Please fix ${visibleSummary.length} ${visibleSummary.length === 1 ? "field" : "fields"}`}>
            <ul className="list-disc pl-4">{visibleSummary.map((message) => <li key={message}>{message}</li>)}</ul>
          </Alert>
        )}
        {children}
      </form>
    </FormContext.Provider>
  )
}

export const Form = forwardRef(FormInner) as <T extends FormValues>(props: FormProps<T> & { ref?: React.Ref<HTMLFormElement> }) => React.ReactElement
;(Form as { displayName?: string }).displayName = "Form"
