import { NumberInput } from "@bzync/rui"
import { Radio, RadioGroup } from "@bzync/rui"
import { Slider } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"

export function ChoiceFieldsSection({
  radioValue, setRadioValue, radioSize, setRadioSize, sliderValue, setSliderValue, numberValue, setNumberValue,
}: {
  radioValue: string
  setRadioValue: (v: string) => void
  radioSize: string
  setRadioSize: (v: string) => void
  sliderValue: number
  setSliderValue: (v: number) => void
  numberValue: number
  setNumberValue: (v: number) => void
}) {
  return (
    <>
      <Section
        id="radio"
        title="Radio"
        description="Radio group with animated selection dot, label, description, and horizontal/vertical orientation."
        importPath='import { RadioGroup, Radio } from "@bzync/rui"'
        meta={["animated", "horizontal & vertical", "descriptions"]}
      >
        <Group label="Vertical (default)" col>
          <RadioGroup label="Region" value={radioValue} onChange={setRadioValue}>
            <Radio value="us-east-1" label="US East (N. Virginia)" description="us-east-1 · lowest latency" />
            <Radio value="eu-west-1" label="EU West (Ireland)" description="eu-west-1" />
            <Radio value="ap-south-1" label="Asia Pacific (Mumbai)" description="ap-south-1" />
            <Radio value="disabled" label="Unavailable region" disabled />
          </RadioGroup>
        </Group>
        <Group label="Horizontal">
          <RadioGroup label="Instance size" value={radioSize} onChange={setRadioSize} orientation="horizontal">
            <Radio value="xs" label="XS" />
            <Radio value="sm" label="SM" />
            <Radio value="md" label="MD" />
            <Radio value="lg" label="LG" />
          </RadioGroup>
        </Group>
      </Section>
      <Section
        id="slider"
        title="Slider"
        description="Range input with custom styled track and thumb, label, and value display."
        importPath='import { Slider } from "@bzync/rui"'
        meta={["custom thumb", "value display", "format"]}
      >
        <Group label="RAM allocation" col>
          <div className="w-full max-w-sm space-y-5">
            <Slider label="Memory" min={128} max={4096} step={128} value={sliderValue} onChange={(e) => setSliderValue(Number(e.target.value))} formatValue={(v) => `${v} MB`} />
            <Slider label="CPU cores" min={0.5} max={8} step={0.5} defaultValue={1} formatValue={(v) => `${v} vCPU`} />
            <Slider label="Replicas" min={1} max={10} defaultValue={2} />
            <Slider label="Disabled" min={0} max={100} defaultValue={60} disabled />
          </div>
        </Group>
      </Section>
      <Section
        id="numberinput"
        title="NumberInput"
        description="Numeric stepper with +/− buttons, min/max clamping, and three sizes."
        importPath='import { NumberInput } from "@bzync/rui"'
        meta={["sm · md · lg", "min/max clamp"]}
      >
        <Group label="Sizes">
          <NumberInput size="sm" defaultValue={1} />
          <NumberInput size="md" defaultValue={2} />
          <NumberInput size="lg" defaultValue={3} />
        </Group>
        <Group label="With constraints" col>
          <div className="w-full max-w-xs space-y-4">
            <NumberInput label="Replicas" min={1} max={10} value={numberValue} onChange={setNumberValue} hint={`${numberValue} container${numberValue !== 1 ? "s" : ""} will run`} />
            <NumberInput label="Port" min={1} max={65535} step={1} defaultValue={8080} />
            <NumberInput label="Disabled" defaultValue={3} disabled />
          </div>
        </Group>
      </Section>
    </>
  )
}
