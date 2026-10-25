"use client"

import { LazyMotion, domAnimation, domMax, m } from "framer-motion"
import { type ElementType, forwardRef } from "react"

type Features = typeof domAnimation | typeof domMax

/**
 * `m` elements carry no animation code of their own; the nearest LazyMotion
 * supplies it. Wrapping each element here keeps every component self-contained
 * (no app-level provider needed) while consumers only bundle the feature set
 * the library uses, instead of the full `motion` component with drag, layout
 * and pan. AnimatePresence still sees exits, which travel through context.
 */
function withFeatures<C extends ElementType>(Component: C, features: Features, name: string): C {
  const Animated = forwardRef<unknown, Record<string, unknown>>((props, ref) => {
    const Inner = Component as ElementType
    return <LazyMotion features={features}><Inner ref={ref} {...props} /></LazyMotion>
  })
  Animated.displayName = name
  return Animated as unknown as C
}

/** Drop-in for framer-motion's `motion.*` with the `domAnimation` feature set (animate, exit, variants, hover/tap/focus/in-view gestures). */
export const motion = {
  div: withFeatures(m.div, domAnimation, "motion.div"),
  span: withFeatures(m.span, domAnimation, "motion.span"),
  ul: withFeatures(m.ul, domAnimation, "motion.ul"),
  svg: withFeatures(m.svg, domAnimation, "motion.svg"),
  path: withFeatures(m.path, domAnimation, "motion.path"),
  circle: withFeatures(m.circle, domAnimation, "motion.circle"),
}

/** `motion.*` with `domMax` for the few elements that use `layout` animations. */
export const layoutMotion = {
  div: withFeatures(m.div, domMax, "motion.div"),
}
