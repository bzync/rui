/**
 * Motion tokens — single source for framer-motion transitions.
 * Maps CSS variables to JS durations/easings so code and stylesheet agree.
 */

export const motionTokens = {
  duration: {
    instant: 0,
    fast: 0.12,
    normal: 0.2,
    slow: 0.32,
  },
  ease: {
    standard: [0.2, 0, 0, 1] as const,
    enter: [0.16, 1, 0.3, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
  },
  spring: {
    snappy: { type: "spring" as const, stiffness: 450, damping: 32 },
    gentle: { type: "spring" as const, stiffness: 600, damping: 35 },
  },
} as const

/** Common transitions */
export const transitions = {
  overlay: { duration: motionTokens.duration.normal, ease: motionTokens.ease.standard },
  panelEnter: { duration: 0.22, ease: motionTokens.ease.enter },
  panelExit: { duration: 0.2, ease: motionTokens.ease.exit },
  fade: { duration: motionTokens.duration.fast, ease: motionTokens.ease.standard },
  tabIndicator: motionTokens.spring.snappy,
  switchThumb: motionTokens.spring.gentle,
} as const
