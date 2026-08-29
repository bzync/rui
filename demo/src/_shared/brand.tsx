export interface RuiBrandMarkProps {
  className?: string
  size?: number
}

export function RuiBrandMark({ className, size = 28 }: RuiBrandMarkProps) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}favicon-32.png`}
      alt=""
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      // Explicit box so Tailwind Preflight's `img { height: auto }` can't drop the
      // reserved height before the bitmap loads (a CLS "unsized image" culprit).
      style={{ width: size, height: size }}
    />
  )
}
