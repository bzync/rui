"use client"

import { useState } from "react"
import { InputTextareaSection } from "./forms/input-textarea-section"
import { SelectSection } from "./forms/select-section"
import { AutocompleteSection } from "./forms/autocomplete-section"
import { ToggleSection } from "./forms/toggle-section"
import { LabelFieldsSection } from "./forms/label-fields-section"
import { ChoiceFieldsSection } from "./forms/choice-fields-section"
import { MiscFieldsSection } from "./forms/misc-fields-section"
import { DateFieldsSection } from "./forms/date-fields-section"

export function FormsSection() {
  const [sw1, setSw1] = useState(false)
  const [sw2, setSw2] = useState(true)
  const [sw3, setSw3] = useState(false)
  const [sw4, setSw4] = useState(true)
  const [acValue, setAcValue] = useState<string | null>(null)
  const [acInput, setAcInput] = useState("")
  const [selectMulti, setSelectMulti] = useState<string[]>(["eu-west-1"])
  const [selectMultiStatus, setSelectMultiStatus] = useState<string[]>([])
  const [acMultiCount, setAcMultiCount] = useState(0)
  const [acTagsCount, setAcTagsCount] = useState(2)
  const [radioValue, setRadioValue] = useState("eu-west-1")
  const [radioSize, setRadioSize] = useState("sm")
  const [sliderValue, setSliderValue] = useState(512)
  const [numberValue, setNumberValue] = useState(2)
  const [otpValue, setOtpValue] = useState("")
  const [dateValue, setDateValue] = useState<Date | null>(null)
  const [calendarDate, setCalendarDate] = useState<Date | null>(null)

  return (
    <>
      <InputTextareaSection />
      <SelectSection
        selectMulti={selectMulti}
        setSelectMulti={setSelectMulti}
        selectMultiStatus={selectMultiStatus}
        setSelectMultiStatus={setSelectMultiStatus}
      />
      <AutocompleteSection
        acValue={acValue}
        acInput={acInput}
        setAcInput={setAcInput}
        onAcSelect={(opt) => { setAcValue(opt.value); setAcInput(opt.label) }}
        acMultiCount={acMultiCount}
        setAcMultiCount={setAcMultiCount}
        acTagsCount={acTagsCount}
        setAcTagsCount={setAcTagsCount}
      />
      <ToggleSection sw1={sw1} setSw1={setSw1} sw2={sw2} setSw2={setSw2} sw3={sw3} setSw3={setSw3} sw4={sw4} setSw4={setSw4} />
      <LabelFieldsSection />
      <ChoiceFieldsSection
        radioValue={radioValue}
        setRadioValue={setRadioValue}
        radioSize={radioSize}
        setRadioSize={setRadioSize}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        numberValue={numberValue}
        setNumberValue={setNumberValue}
      />
      <MiscFieldsSection otpValue={otpValue} setOtpValue={setOtpValue} />
      <DateFieldsSection
        dateValue={dateValue}
        setDateValue={setDateValue}
        calendarDate={calendarDate}
        setCalendarDate={setCalendarDate}
      />
    </>
  )
}
