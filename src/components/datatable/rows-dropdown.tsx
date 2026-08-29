export function RowsDropdown({ options, value, onChange }: { options: number[]; value: number; onChange: (n: number) => void }) {
  return (
    <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
      <span>Rows</span>
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-8 rounded-[var(--radius-md)] border border-border bg-surface px-2 text-xs text-foreground focus:border-accent-500 focus:outline-none focus:ring-[3px] focus:ring-focus-ring/25">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}
