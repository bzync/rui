"use client"

import { useEffect, useRef } from "react"
import { useEventCallback } from "@/hooks/use-event-callback"

const noop = () => {}

/**
 * Native form participation for the button-based Select. Hidden inputs submit
 * one `name=value` entry per selected value (like a native `<select>`), and a
 * visually hidden text input carries `required` so constraint validation blocks
 * an empty submit and anchors the browser's message under the trigger. Hidden
 * inputs are barred from validation, hence the separate control. Listens for
 * the owning form's `reset` so uncontrolled selects return to `defaultValue`.
 */
export function SelectFormFields({
  name,
  form,
  values,
  required,
  disabled,
  onReset,
}: {
  name?: string
  form?: string
  values: string[]
  required?: boolean
  disabled?: boolean
  onReset: () => void
}) {
  const anchorRef = useRef<HTMLInputElement>(null)
  const onResetStable = useEventCallback(onReset)
  const validates = Boolean(required) && !disabled

  useEffect(() => {
    const owner = anchorRef.current?.form
    if (!owner) return
    // Defer: listeners run before the browser resets its own controls.
    const handle = () => setTimeout(onResetStable)
    owner.addEventListener("reset", handle)
    return () => owner.removeEventListener("reset", handle)
  }, [form, onResetStable, name, validates])

  if (!name && !validates) return null

  return (
    <>
      {/* Never submitted (disabled); only gives the reset listener the owning form. */}
      <input ref={anchorRef} type="hidden" form={form} disabled />
      {validates && (
        <input
          aria-hidden="true"
          tabIndex={-1}
          form={form}
          required
          value={values.join(",")}
          onChange={noop}
          data-select-validator=""
          className="pointer-events-none absolute bottom-0 left-0 h-px w-full opacity-0"
        />
      )}
      {name && values.map((value) => (
        <input key={value} type="hidden" name={name} form={form} value={value} disabled={disabled} />
      ))}
    </>
  )
}
