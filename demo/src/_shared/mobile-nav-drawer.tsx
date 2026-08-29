import { Drawer } from "@bzync/rui"
import type { ReactNode } from "react"

export default function MobileNavDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  return (
    <Drawer open={open} onClose={onClose} title="Documentation" width="min(21rem, 88vw)" panelClassName="docs-mobile-drawer">
      {children}
    </Drawer>
  )
}
