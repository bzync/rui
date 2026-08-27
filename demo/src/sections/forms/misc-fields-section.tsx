import { FileUpload } from "@bzync/rui"
import { OtpInput } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function MiscFieldsSection({
  otpValue, setOtpValue,
}: {
  otpValue: string
  setOtpValue: (v: string) => void
}) {
  return (
    <>
      <Section
        id="otpinput"
        title="OtpInput"
        description="6-digit OTP/PIN field with paste support, arrow-key navigation, and masked mode."
        importPath='import { OtpInput } from "@bzync/rui"'
        meta={["paste support", "arrow navigation", "masked mode"]}
      >
        <Group label="Default (6 digits)" col>
          <OtpInput
            label="Verification code"
            value={otpValue}
            onChange={setOtpValue}
            hint="Enter the 6-digit code from your authenticator app"
          />
        </Group>
        <Group label="Variants">
          <div className="flex flex-col gap-4">
            <OtpInput label="4-digit PIN" length={4} />
            <OtpInput label="Masked" length={6} masked hint="Hidden for security" />
            <OtpInput label="With error" length={6} error="Invalid code. Please try again." />
          </div>
        </Group>
      </Section>
      <Section
        id="fileupload"
        title="FileUpload"
        description="Drag-and-drop file dropzone with file list, size validation, and multi-file support."
        importPath='import { FileUpload } from "@bzync/rui"'
        meta={["drag & drop", "size validation", "multi-file"]}
      >
        <Group label="Single file" col>
          <div className="w-full max-w-md">
            <FileUpload label="Docker config" accept=".json,.yaml,.yml" maxSizeMB={5} hint="JSON or YAML, max 5 MB" />
          </div>
        </Group>
        <Group label="Multiple files" col>
          <div className="w-full max-w-md">
            <FileUpload label="Environment files" accept=".env" multiple maxSizeMB={1} hint="Drag in your .env files" />
          </div>
        </Group>
      </Section>
    </>
  )
}
