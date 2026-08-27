/** Shared polymorphic & lifecycle types */

import type { ComponentType, ReactNode } from "react"

export type Size = "sm" | "md" | "lg"
export type Variant = "primary" | "secondary" | "ghost" | "outline" | "destructive"

export interface LifecycleProps {
  /** Called after mount */
  onMount?: () => void
  /** Called before unmount (cleanup) */
  onUnmount?: () => void
}

export type WithClassName<T = object> = T & { className?: string; children?: ReactNode }

export type PolymorphicProps<E extends React.ElementType, P = object> = P &
  Omit<React.ComponentPropsWithoutRef<E>, keyof P> & { as?: E }

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}
