export interface RuiBrandMarkProps {
  className?: string
  size?: number
}

export function RuiBrandMark({ className, size = 28 }: RuiBrandMarkProps) {
  return (
    <img
      src="/rui-icon-192.png"
      alt=""
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
    />
  )
}
