import { BadgeSection, AvatarSection } from "./display/badge-avatar-section"
import { CardSection } from "./display/card-section"
import { TooltipSection, LinkSection } from "./display/tooltip-link-section"
import { CalloutSection, StatSection } from "./display/callout-stat-section"
import { StatusDotSection } from "./display/statusdot-section"
import { KbdSection, TagSection } from "./display/kbd-tag-section"

export function DisplaySection() {
  return (
    <>
      <BadgeSection />
      <AvatarSection />
      <CardSection />
      <TooltipSection />
      <LinkSection />
      <CalloutSection />
      <StatSection />
      <StatusDotSection />
      <KbdSection />
      <TagSection />
    </>
  )
}
