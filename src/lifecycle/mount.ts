"use client"
import { useEffect } from "react"
import { useEventCallback } from "@/hooks/use-event-callback"

export function useMountEffect(onMount: () => void | (() => void)) {
  const stable = useEventCallback(onMount)
  useEffect(() => { return stable() as unknown as void }, [stable])
}

export function useUnmountEffect(onUnmount: () => void) {
  const stable = useEventCallback(onUnmount)
  useEffect(() => { return () => stable() }, [stable])
}
