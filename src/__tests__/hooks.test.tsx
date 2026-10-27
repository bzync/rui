import { act, fireEvent, render, renderHook, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useBreakpoint, useClipboard, useDebounce, useDebouncedCallback, useHotkeys, useLocalStorage, parseHotkey } from "@/index"

describe("useDebounce / useDebouncedCallback", () => {
  it("settles after the delay and supports cancel and flush", () => {
    vi.useFakeTimers()
    try {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), { initialProps: { value: "a" } })
      rerender({ value: "ab" })
      expect(result.current).toBe("a")
      act(() => { vi.advanceTimersByTime(100) })
      expect(result.current).toBe("ab")

      const spy = vi.fn()
      const { result: cb } = renderHook(() => useDebouncedCallback(spy, 100))
      cb.current("x"); cb.current("y")
      expect(cb.current.pending()).toBe(true)
      cb.current.flush()
      expect(spy).toHaveBeenCalledExactlyOnceWith("y")
      cb.current("z"); cb.current.cancel()
      act(() => { vi.advanceTimersByTime(200) })
      expect(spy).toHaveBeenCalledTimes(1)
    } finally {
      vi.useRealTimers()
    }
  })
})

describe("useClipboard", () => {
  it("copies and resets the copied flag", async () => {
    vi.useFakeTimers()
    try {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
      const { result } = renderHook(() => useClipboard({ timeout: 500 }))
      await act(async () => { expect(await result.current.copy("hello")).toBe(true) })
      expect(writeText).toHaveBeenCalledWith("hello")
      expect(result.current.copied).toBe(true)
      act(() => { vi.advanceTimersByTime(500) })
      expect(result.current.copied).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })
})

describe("useBreakpoint", () => {
  it("resolves the largest matching breakpoint and follows resizes", () => {
    window.innerWidth = 800
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current.breakpoint).toBe("md")
    expect(result.current.up("md")).toBe(true)
    expect(result.current.down("lg")).toBe(true)
    act(() => { window.innerWidth = 1300; window.dispatchEvent(new Event("resize")) })
    expect(result.current.breakpoint).toBe("xl")
    act(() => { window.innerWidth = 320; window.dispatchEvent(new Event("resize")) })
    expect(result.current.breakpoint).toBe("base")
  })
})

describe("useLocalStorage", () => {
  it("persists, syncs between hooks with the same key, and removes", () => {
    window.localStorage.removeItem("test-ls")
    const a = renderHook(() => useLocalStorage("test-ls", { count: 0 }))
    const b = renderHook(() => useLocalStorage("test-ls", { count: 0 }))
    expect(a.result.current[0]).toEqual({ count: 0 })
    act(() => a.result.current[1]((previous) => ({ count: previous.count + 1 })))
    expect(window.localStorage.getItem("test-ls")).toBe('{"count":1}')
    expect(b.result.current[0]).toEqual({ count: 1 })
    act(() => b.result.current[2]())
    expect(a.result.current[0]).toEqual({ count: 0 })
  })
})

describe("useHotkeys", () => {
  function Harness({ onFire }: { onFire: () => void }) {
    useHotkeys(["ctrl+k", "shift+?"], onFire)
    return <input aria-label="Field" />
  }

  it("matches combos, ignores form fields and parses aliases", () => {
    const onFire = vi.fn()
    render(<Harness onFire={onFire} />)
    fireEvent.keyDown(document, { key: "k", ctrlKey: true })
    fireEvent.keyDown(document, { key: "?", shiftKey: true })
    fireEvent.keyDown(document, { key: "k" })
    expect(onFire).toHaveBeenCalledTimes(2)
    fireEvent.keyDown(screen.getByLabelText("Field"), { key: "k", ctrlKey: true })
    expect(onFire).toHaveBeenCalledTimes(2)
    expect(parseHotkey("mod+esc")).toMatchObject({ mod: true, key: "escape" })
  })
})
