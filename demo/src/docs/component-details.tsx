"use client"

/* This module is a lazy documentation registry containing live JSX factories, not a Fast Refresh boundary. */
/* eslint-disable react-refresh/only-export-components */

import * as R from "@bzync/rui"

const { Activity, BarChart3, Box, FileText, ChevronRight, Database, Home, Rocket, Settings, Trash2, Wrench } = R.Icons
const cn = R.cn
import { Fragment, type ReactNode, useRef, useState } from "react"
import { RuiBrandMark } from "../_shared/brand"
import type { ApiProp } from "./primitives"

export interface SupplementalDetail {
  code: string
  preview: ReactNode
  props: ApiProp[]
  accessibility: string
}

type PropRow = [name: string, type: string, description: string, defaultValue?: string]

const api = (...rows: PropRow[]): ApiProp[] => rows.map(([name, type, description, defaultValue]) => ({
  name,
  type,
  description,
  ...(defaultValue ? { default: defaultValue } : {}),
}))

const detail = (code: string, preview: ReactNode, props: ApiProp[], accessibility: string): SupplementalDetail => ({
  code,
  preview,
  props,
  accessibility,
})

function BillingPreview() {
  const [value, setValue] = useState<R.BillingInterval>("yearly")
  const options: R.BillingIntervalToggleOption[] = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Annually", badge: "Save 20%" },
  ]

  return (
    <div className="flex max-w-full flex-col items-center gap-4">
      <R.BillingIntervalToggle value={value} onChange={setValue} options={options} />
      <R.BillingIntervalToggle value={value} onChange={setValue} options={options} size="lg" />
    </div>
  )
}

function ThemeSwitcherUsagePreview() {
  const [theme, setTheme] = useState<R.Theme>("system")
  return (
    <div className="flex flex-col items-center gap-4">
      <R.ThemeSwitcher value={theme} onChange={setTheme} />
      <span className="text-xs text-muted-foreground">Current selection: {theme}</span>
    </div>
  )
}

function RangeSliderUsagePreview() {
  const [range, setRange] = useState<[number, number]>([25, 75])
  return (
    <div className="w-full max-w-sm">
      <R.RangeSlider label="Price Range" min={0} max={100} step={5} value={range} onChange={setRange} showTooltip formatValue={(v) => `$${v}`} />
    </div>
  )
}

function DateTimePickerUsagePreview() {
  const [val, setVal] = useState<Date | null>(new Date())
  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <R.DateTimePicker
        label="Release Date & Time"
        hint="Schedule automated production deployment"
        value={val}
        onChange={setVal}
        showPresets
      />
      {val && (
        <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-surface-muted/50 px-3 py-2 text-xs">
          <span className="text-muted-foreground">Scheduled for</span>
          <span className="font-semibold text-foreground">{val.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
        </div>
      )}
    </div>
  )
}

function ColorPickerUsagePreview() {
  const [color, setColor] = useState("#3b82f6")
  return (
    <div className="w-full max-w-xs">
      <R.ColorPicker label="Brand Accent Color" value={color} onChange={setColor} />
    </div>
  )
}

function SignatureUsagePreview() {
  const [activeTab, setActiveTab] = useState<"pad" | "editor" | "contract">("pad")
  const [signature, setSignature] = useState<string | null>(null)
  const [activeSample, setActiveSample] = useState<"parchment" | "notebook">("parchment")
  const [previewBg, setPreviewBg] = useState<"white" | "checkers" | "dark">("white")
  const [agreed, setAgreed] = useState(false)
  const [isContractSigned, setIsContractSigned] = useState(false)
  const sigRef = useRef<R.SignatureRef>(null)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
        <div className="flex items-center rounded-lg border border-border bg-surface-muted/40 p-1 text-xs w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => setActiveTab("pad")}
            className={cn(
              "inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 font-medium transition-colors text-xs",
              activeTab === "pad"
                ? "bg-accent font-semibold text-accent-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <R.Icons.PenLine size="xs" className="shrink-0" />
            <span>Draw<span className="hidden sm:inline"> &amp; Sign Pad</span></span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("editor")}
            className={cn(
              "inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 font-medium transition-colors text-xs",
              activeTab === "editor"
                ? "bg-accent font-semibold text-accent-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <R.Icons.Sparkles size="xs" className="shrink-0" />
            <span>Remover<span className="hidden sm:inline"> Studio</span></span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contract")}
            className={cn(
              "inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 font-medium transition-colors text-xs",
              activeTab === "contract"
                ? "bg-accent font-semibold text-accent-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <R.Icons.FileCheck size="xs" className="shrink-0" />
            <span>Document<span className="hidden sm:inline"> Flow</span></span>
          </button>
        </div>

        {activeTab === "editor" && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-muted-foreground">Sample:</span>
            <R.Button
              variant={activeSample === "parchment" ? "primary" : "secondary"}
              size="sm"
              icon={<R.Icons.Scroll size="xs" className="shrink-0" />}
              onClick={() => setActiveSample("parchment")}
              className="h-7 gap-1.5 text-xs"
            >
              Parchment
            </R.Button>
            <R.Button
              variant={activeSample === "notebook" ? "primary" : "secondary"}
              size="sm"
              icon={<R.Icons.Book size="xs" className="shrink-0" />}
              onClick={() => setActiveSample("notebook")}
              className="h-7 gap-1.5 text-xs"
            >
              Notebook
            </R.Button>
          </div>
        )}
      </div>

      {/* Tab 1: Draw & Sign Pad */}
      {activeTab === "pad" && (
        <div className="space-y-3.5">
          {/* Quick-test Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-surface-muted/20 px-3 py-2 text-xs">
            <span className="text-[11px] font-medium text-muted-foreground">Try demo signature:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  sigRef.current?.fromDataURL(R.createSampleSignature("digital"))
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-muted transition-colors shadow-2xs min-h-[28px]"
              >
                <R.Icons.PenLine size="xs" className="shrink-0 text-accent-strong" />
                <span>Digital Ink</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sigRef.current?.fromDataURL(R.createSampleSignature("parchment"))
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-muted transition-colors shadow-2xs min-h-[28px]"
              >
                <R.Icons.Scroll size="xs" className="shrink-0 text-muted-foreground" />
                <span>Parchment</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sigRef.current?.fromDataURL(R.createSampleSignature("notebook"))
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-muted transition-colors shadow-2xs min-h-[28px]"
              >
                <R.Icons.Book size="xs" className="shrink-0 text-muted-foreground" />
                <span>Notebook</span>
              </button>
              {signature && (
                <button
                  type="button"
                  onClick={() => {
                    sigRef.current?.clear()
                  }}
                  className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-2 py-1 text-xs text-muted-foreground hover:text-danger transition-colors shadow-2xs min-h-[28px]"
                  title="Clear pad"
                >
                  <R.Icons.Eraser size="xs" className="shrink-0" />
                </button>
              )}
            </div>
          </div>

          <R.Signature
            signatureRef={sigRef}
            label="Authorized E-Signature"
            hint="Draw with stylus/mouse or switch to Upload mode to clean paper scans."
            value={signature}
            onChange={setSignature}
          />

          {/* Live Document & Transparency Verification Card */}
          {signature ? (
            <div className="flex flex-col gap-3 rounded-xl border border-success/30 bg-success/5 p-3.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-success/20 pb-2.5">
                <div className="flex items-center gap-1.5 font-semibold text-success-strong">
                  <R.Icons.CheckCircle2 size="xs" className="shrink-0" />
                  <span>Verified E-Signature Ready</span>
                </div>

                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-muted-foreground mr-1">Preview BG:</span>
                  {(["white", "checkers", "dark"] as const).map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setPreviewBg(bg)}
                      className={cn(
                        "inline-flex items-center justify-center rounded px-2 py-0.5 capitalize transition-colors min-h-[24px]",
                        previewBg === bg
                          ? "bg-accent font-semibold text-accent-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {bg === "checkers" ? "Transparent" : bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature Stamped Document Preview */}
              <div
                className={cn(
                  "flex h-24 w-full items-center justify-center rounded-lg border border-border/80 p-3 transition-colors",
                  previewBg === "white" && "bg-white text-slate-900 shadow-xs",
                  previewBg === "dark" && "bg-slate-950 text-white shadow-xs",
                )}
                style={
                  previewBg === "checkers"
                    ? {
                        backgroundImage:
                          "repeating-conic-gradient(rgba(128,128,128,0.12) 0% 25%, transparent 0% 50%)",
                        backgroundSize: "12px 12px",
                      }
                    : undefined
                }
              >
                <img
                  src={signature}
                  alt="Live signature preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5 text-[11px] text-muted-foreground">
                <span className="font-mono text-[10px]">SHA-256: 7f8b9…c42e • Verified Seal</span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <R.Button
                    variant="outline"
                    size="sm"
                    icon={<R.Icons.Sparkles size="xs" className="shrink-0" />}
                    onClick={() => sigRef.current?.openEditor()}
                    className="h-8 sm:h-7 gap-1.5 text-xs font-semibold text-accent-strong w-full sm:w-auto justify-center"
                  >
                    Clean &amp; Crop Studio
                  </R.Button>
                  <R.Button
                    variant="primary"
                    size="sm"
                    icon={<R.Icons.FileCheck size="xs" className="shrink-0" />}
                    onClick={() => setActiveTab("contract")}
                    className="h-8 sm:h-7 gap-1.5 text-xs font-semibold w-full sm:w-auto justify-center"
                  >
                    Use in Contract →
                  </R.Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
              <R.Icons.Sparkles size="xs" className="text-accent-strong shrink-0" />
              <span>
                Draw your signature above or click <strong>“Digital Ink”</strong> to see live document stamping and transparency verification.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Live Background Remover & Auto-Crop Studio */}
      {activeTab === "editor" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-border/70 bg-surface-muted/30 p-3 text-xs text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground mb-0.5">Background Removal &amp; Auto-Crop Studio</p>
            <p>
              Remove paper texture, shadows, and ruled lines from phone photos or paper scans. Use the 1-Click Magic Clean button, drag the split comparison slider, or tune sensitivity.
            </p>
          </div>

          <R.SignatureImageEditor
            key={activeSample}
            image={R.createSampleSignature(activeSample)}
            title="Background Removal &amp; Auto-Crop Studio"
            onSave={(cleaned) => {
              setSignature(cleaned)
              setActiveTab("contract")
            }}
          />

          {signature && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-xs">
              <div className="flex items-center gap-1.5 text-success-strong font-semibold">
                <R.Icons.CheckCircle2 size="xs" className="shrink-0" />
                <span>Extracted Signature Ready</span>
              </div>
              <R.Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab("contract")}
                className="h-8 sm:h-7 gap-1.5 text-xs font-semibold w-full sm:w-auto justify-center"
              >
                <span>Continue to NDA Contract →</span>
              </R.Button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Real Contract Signing Workflow */}
      {activeTab === "contract" && (
        <div className="space-y-4 rounded-xl border border-border bg-surface p-4 text-xs shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Mutual Non-Disclosure Agreement</h4>
              <p className="text-[11px] text-muted-foreground">Doc ID: NDA-2026-904 • Parties: Acme Corp &amp; Contractor</p>
            </div>
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold self-start sm:self-auto",
              isContractSigned
                ? "bg-success/15 text-success-strong"
                : "bg-accent/15 text-accent-strong"
            )}>
              {isContractSigned && <R.Icons.Check size="xs" className="shrink-0" />}
              <span>{isContractSigned ? "Legally Executed" : "Execution Ready"}</span>
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            By executing this electronic signature below, the parties agree to be bound by all terms, confidentiality covenants, and non-disclosure obligations of this Agreement.
          </p>

          {/* Signature Block */}
          {isContractSigned ? (
            <div className="flex flex-col gap-2 rounded-lg border border-success/30 bg-success/5 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-success-strong">
                <R.Icons.CheckCircle2 size="sm" className="shrink-0" />
                <span>Agreement Certified &amp; Executed</span>
              </div>
              <div className="mx-auto flex h-20 w-full max-w-xs items-center justify-center rounded border border-border/80 bg-surface p-2 shadow-2xs">
                {signature ? (
                  <img src={signature} alt="Adopted signature" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="font-serif italic text-muted-foreground">Signed electronically</span>
                )}
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">
                Signer: Alex Morgan (CEO) • Certificate: RUI-E-SIG-904 • Hash: 7f8b9c42e…
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg border border-border/80 bg-surface-muted/20 p-3">
                <R.Signature
                  label="Signer: Alex Morgan (CEO)"
                  value={signature}
                  onChange={setSignature}
                  height={140}
                  hint={signature ? "Signature imported. You can adjust or re-sign above." : "Draw above or import from the Draw & Sign Pad."}
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 size-3.5 rounded border-border text-accent focus:ring-accent"
                />
                <span className="leading-tight">I confirm that I am legally authorized to execute this agreement electronically.</span>
              </label>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-border/80 pt-3">
            <R.Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSignature(null)
                setAgreed(false)
                setIsContractSigned(false)
              }}
              disabled={!signature && !agreed && !isContractSigned}
              className="w-full sm:w-auto justify-center"
            >
              Reset Contract
            </R.Button>

            {!isContractSigned ? (
              <R.Button
                variant="primary"
                size="sm"
                icon={<R.Icons.CheckCircle2 size="xs" className="shrink-0" />}
                disabled={!signature || !agreed}
                onClick={() => setIsContractSigned(true)}
                className="gap-1.5 font-semibold w-full sm:w-auto justify-center"
              >
                Complete &amp; Seal Agreement
              </R.Button>
            ) : (
              <R.Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsContractSigned(false)
                  setActiveTab("pad")
                }}
                className="w-full sm:w-auto justify-center"
              >
                <span>Sign Another Document</span>
              </R.Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function InlineEditUsagePreview() {
  const [name, setName] = useState("Alpha Project")
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-xs text-muted-foreground">Click to rename:</span>
      <R.InlineEdit value={name} onSave={setName} />
    </div>
  )
}

function ResponsiveDialogUsagePreview() {
  const [open, setOpen] = useState(false)
  return (
    <R.ResponsiveDialog open={open} onOpenChange={setOpen}>
      <R.ResponsiveDialogTrigger className="inline-flex h-9 items-center justify-center rounded-[var(--radius-md)] bg-accent px-3 text-sm font-semibold text-accent-foreground shadow-xs">
        Edit Profile
      </R.ResponsiveDialogTrigger>
      <R.ResponsiveDialogContent title="Edit Profile" description="Make changes to your profile settings here.">
        <div className="space-y-3 py-2 text-sm">
          <p className="text-muted-foreground">Adapts to a centered modal on desktop and a bottom sheet on mobile.</p>
        </div>
        <R.ResponsiveDialogFooter>
          <R.ResponsiveDialogClose className="inline-flex h-8 items-center justify-center rounded-[var(--radius-md)] border border-border px-3 text-xs font-medium">
            Done
          </R.ResponsiveDialogClose>
        </R.ResponsiveDialogFooter>
      </R.ResponsiveDialogContent>
    </R.ResponsiveDialog>
  )
}

function CollapsibleUsagePreview() {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-full max-w-md rounded-[var(--radius-md)] border border-border p-3">
      <R.Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Repository Details</span>
          <R.CollapsibleTrigger className="rounded px-2 py-1 text-xs border border-border bg-surface-muted">
            {open ? "Hide" : "Show"}
          </R.CollapsibleTrigger>
        </div>
        <R.CollapsibleContent className="text-xs text-muted-foreground pt-3 space-y-1">
          <p>Commit: 32188ef</p>
          <p>Branch: components-roadmap</p>
        </R.CollapsibleContent>
      </R.Collapsible>
    </div>
  )
}

function DndUsagePreview() {
  const [itemsA, setItemsA] = useState(["Task 1", "Task 2"])
  const [itemsB, setItemsB] = useState(["Task 3"])

  const handleDragEnd = ({ activeId, targetDroppableId }: R.DragEndEvent) => {
    if (!targetDroppableId) return
    if (targetDroppableId === "col-b" && itemsA.includes(activeId)) {
      setItemsA((prev) => prev.filter((i) => i !== activeId))
      setItemsB((prev) => [...prev, activeId])
    } else if (targetDroppableId === "col-a" && itemsB.includes(activeId)) {
      setItemsB((prev) => prev.filter((i) => i !== activeId))
      setItemsA((prev) => [...prev, activeId])
    }
  }

  return (
    <R.DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <R.Droppable id="col-a" className="rounded-lg border border-border bg-surface-muted/50 p-3 min-h-[140px] flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">To Do ({itemsA.length})</span>
          {itemsA.map((t) => (
            <R.Draggable key={t} id={t} className="rounded border border-border bg-surface p-2 text-xs shadow-xs">
              {t}
            </R.Draggable>
          ))}
        </R.Droppable>
        <R.Droppable id="col-b" className="rounded-lg border border-border bg-surface-muted/50 p-3 min-h-[140px] flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Done ({itemsB.length})</span>
          {itemsB.map((t) => (
            <R.Draggable key={t} id={t} className="rounded border border-border bg-surface p-2 text-xs shadow-xs">
              {t}
            </R.Draggable>
          ))}
        </R.Droppable>
      </div>
    </R.DndContext>
  )
}

function PanoTourUsagePreview() {
  const scenes: R.PanoScene[] = [
    {
      id: "poseidon",
      name: "Poseidon’s Realm (Pool & Pavilions)",
      description: "Main resort swimming pool surrounded by Poseidon, Hestia, Nemea, and Selene pavilions with grill station.",
      image: "/img/resort/360-poseidon.jpg",
      preview: "/img/resort/360-poseidon-preview.jpg",
      yaw: 0,
      pitch: -2,
      fov: 75,
      hotspots: [
        { id: "h1", type: "scene", yaw: 32, pitch: -6, target: "hermes", label: "Hermes Villa", badge: "₱4,500", icon: "footprints", pulse: true },
        { id: "h2", type: "scene", yaw: -75, pitch: -4, target: "olympus", label: "Olympus Function Hall", icon: "door-open" },
        { id: "h3", type: "info", yaw: -18, pitch: -14, label: "Heated Main Pool & 4 Pavilions", description: "Includes 40 infinity chairs, 6 tables, grill station & poolside lounge.", badge: "Included", icon: "waves" },
        { id: "h4", type: "media", yaw: 115, pitch: 4, icon: "image", media: { kind: "image", src: "/img/resort/card-pool.jpg", caption: "Thatch pavilion & poolside lounge" } },
      ],
    },
    {
      id: "hermes",
      name: "Hermes Studio Villa",
      description: "Air-conditioned studio-type villa sleeping up to 5 guests with queen bed, pull-out double, kitchen, and smart TV with Netflix.",
      image: "/img/resort/360-villas.jpg",
      preview: "/img/resort/360-villas-preview.jpg",
      yaw: 10,
      pitch: 0,
      fov: 75,
      hotspots: [
        { id: "h5", type: "scene", yaw: -65, pitch: -5, target: "poseidon", label: "Back to Pool & Pavilions", icon: "waves" },
        { id: "h6", type: "scene", yaw: 95, pitch: -4, target: "grounds", label: "Ceremony Grounds", icon: "trees" },
        { id: "h7", type: "info", yaw: -12, pitch: -8, label: "Studio Suite (Sleeps 5)", description: "Queen bed + pull-out double & single bed, kitchen, heated bath, and smart TV.", icon: "bed" },
        { id: "h8", type: "action", yaw: 28, pitch: -14, action: "book", label: "Book Hermes Villa", badge: "₱4,500", icon: "calendar", pulse: true },
      ],
    },
    {
      id: "olympus",
      name: "Olympus Function Hall",
      description: "Air-conditioned function hall seating 60 to 70 guests comfortably, complete with lobby, cold kitchen, and wireless sound system.",
      image: "/img/resort/360-olympus.jpg",
      preview: "/img/resort/360-olympus-preview.jpg",
      yaw: 0,
      pitch: 0,
      fov: 75,
      hotspots: [
        { id: "h9", type: "scene", yaw: -55, pitch: -4, target: "grounds", label: "Step out to Grounds", icon: "trees" },
        { id: "h10", type: "scene", yaw: 75, pitch: -4, target: "poseidon", label: "Pool & Pavilions", icon: "waves" },
        { id: "h11", type: "info", yaw: 8, pitch: 4, label: "60–70 Seated Event Hall", description: "Includes 100 infinity chairs, 15–20 tables & Bluetooth sound system.", icon: "sparkles" },
      ],
    },
    {
      id: "grounds",
      name: "Resort Ceremony Grounds",
      description: "Open landscaped grounds ideal for outdoor garden weddings, receptions, and full-resort exclusive events.",
      image: "/img/resort/360-grounds.jpg",
      preview: "/img/resort/360-grounds-preview.jpg",
      yaw: 0,
      pitch: 0,
      fov: 75,
      hotspots: [
        { id: "h12", type: "scene", yaw: -45, pitch: -4, target: "hermes", label: "Hermes Villa", icon: "bed" },
        { id: "h13", type: "scene", yaw: 50, pitch: -4, target: "olympus", label: "Olympus Hall", icon: "door-open" },
      ],
    },
  ]
  const [sceneId, setSceneId] = useState<string | number>("poseidon")
  const active = scenes.find((s) => s.id === sceneId) ?? scenes[0]

  return (
    <div className="w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-xl border border-border shadow-sm">
        <R.PanoViewer
          scenes={scenes}
          sceneId={sceneId}
          onSceneChange={(s) => setSceneId(s.id)}
          autoRotate={1.8}
          showControls
          showFilmstrip
          className="h-[380px] w-full sm:h-[480px] lg:h-[540px]"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-black/65 to-transparent p-2.5 text-white sm:p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-medium text-white/75 sm:text-[11px]">Happy Homes Candelaria</p>
            <p className="truncate text-xs font-semibold sm:text-sm">{active.name}</p>
          </div>
          <div className="pointer-events-auto flex-none">
            <R.PanoTourButton
              title="Happy Homes Candelaria"
              scenes={scenes}
              startScene={active.id}
              label="360° tour"
              className="text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoButtonPreview() {
  const [open, setOpen] = useState(false)
  return <>
    <div className="info-button-demo">
      <div><strong>Monthly request limit</strong><p>Requests reset on the first day of each month.</p></div>
      <R.Tooltip content="Learn about monthly request limits">
        <R.InfoButton label="Learn about monthly request limits" onClick={() => setOpen(true)} />
      </R.Tooltip>
    </div>
    <R.Modal open={open} onClose={() => setOpen(false)} title="Monthly request limit" description="How usage is calculated" size="sm">
      <p className="text-sm leading-6 text-muted-foreground">Successful API requests count toward the workspace limit. Failed authentication attempts and health checks do not.</p>
      <div className="mt-5 flex justify-end"><R.Button size="sm" onClick={() => setOpen(false)}>Got it</R.Button></div>
    </R.Modal>
  </>
}

function DatePickerPreview() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 8, 18))
  const formattedDate = date?.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })

  return <div className="temporal-demo">
    <div className="temporal-demo-heading"><strong>Schedule release</strong><p>Choose a date within the approved deployment window.</p></div>
    <R.DatePicker
      label="Deployment date"
      value={date}
      onChange={setDate}
      minDate={new Date(2026, 8, 1)}
      maxDate={new Date(2026, 9, 31)}
      hint="September 1–October 31, 2026"
    />
    <div className="temporal-demo-footer"><span role="status">{formattedDate ? `Selected: ${formattedDate}` : "No date selected"}</span><R.Button size="sm" disabled={!date}>Continue</R.Button></div>
  </div>
}

function DateRangeUsagePreview() {
  const [range, setRange] = useState<R.DateRange>({ from: new Date(2026, 8, 1), to: new Date(2026, 8, 14) })
  return (
    <div className="grid w-full max-w-sm gap-3">
      <R.DateRangePicker label="Reporting period" value={range} onChange={setRange} />
      <span className="text-sm text-muted-foreground" role="status">{range.from && range.to ? `${Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000) + 1} days selected` : "Pick a start and end date"}</span>
    </div>
  )
}

type InviteValues = { name: string; email: string; role: string }

function FormUsagePreview() {
  const [sent, setSent] = useState<string | null>(null)
  const form = R.useForm<InviteValues>({
    defaultValues: { name: "", email: "", role: "" },
    validate: (values) => ({
      name: values.name.trim() ? undefined : "Enter a name.",
      email: /^\S+@\S+\.\S+$/.test(values.email) ? undefined : "Enter a valid email.",
      role: values.role ? undefined : "Choose a role.",
    }),
  })
  return (
    <R.Form form={form} errorSummary className="w-full max-w-sm" onSubmit={async (values) => { await new Promise((resolve) => setTimeout(resolve, 600)); setSent(values.email); form.reset() }}>
      <R.Input label="Name" {...form.register("name")} />
      <R.Input label="Email" type="email" {...form.register("email")} />
      <R.Select label="Role" options={[{ value: "admin", label: "Admin" }, { value: "member", label: "Member" }]} {...form.control("role")} />
      <R.Button type="submit" loading={form.isSubmitting}>Send invite</R.Button>
      {sent && <p className="text-sm text-muted-foreground" role="status">{`Invite sent to ${sent}`}</p>}
    </R.Form>
  )
}

function TagInputUsagePreview() {
  const [emails, setEmails] = useState(["maya@acme.dev"])
  return (
    <div className="grid w-full max-w-md gap-3">
      <R.TagInput
        label="Invite by email"
        value={emails}
        onChange={setEmails}
        transform={(tag) => tag.toLowerCase()}
        validate={(tag) => (/^\S+@\S+\.\S+$/.test(tag) ? undefined : `“${tag}” is not a valid email.`)}
        hint="Press Enter or comma, or paste a list"
      />
      <span className="text-sm text-muted-foreground" role="status">{`${emails.length} ${emails.length === 1 ? "invite" : "invites"} ready`}</span>
    </div>
  )
}

function ContextMenuUsagePreview() {
  const [last, setLast] = useState("Right-click the file (or focus it and press Shift+F10)")
  return (
    <div className="grid w-full max-w-sm gap-3">
      <R.ContextMenu
        items={[
          { label: "Open", shortcut: "↵", onClick: () => setLast("Opened report.pdf") },
          { label: "Rename", shortcut: "F2", onClick: () => setLast("Renaming report.pdf") },
          { label: "Duplicate", onClick: () => setLast("Duplicated report.pdf") },
          { group: "Danger zone", items: [{ label: "Delete", destructive: true, onClick: () => setLast("Deleted report.pdf") }] },
        ]}
      >
        <button type="button" className="flex w-full items-center gap-3 rounded-lg border border-dashed border-border-strong bg-surface p-4 text-left text-sm">
          <FileText size={18} aria-hidden="true" />
          report.pdf
        </button>
      </R.ContextMenu>
      <span className="text-sm text-muted-foreground" role="status">{last}</span>
    </div>
  )
}

function MenubarUsagePreview() {
  const [last, setLast] = useState("Use the arrow keys between menus")
  return (
    <div className="grid gap-3">
      <R.Menubar
        menus={[
          { label: "File", items: [{ label: "New file", shortcut: "⌘N", onClick: () => setLast("New file") }, { label: "Save", shortcut: "⌘S", onClick: () => setLast("Saved") }] },
          { label: "Edit", items: [{ label: "Undo", shortcut: "⌘Z", onClick: () => setLast("Undo") }, { label: "Redo", shortcut: "⇧⌘Z", onClick: () => setLast("Redo") }] },
          { label: "View", items: [{ label: "Zoom in", shortcut: "⌘+", onClick: () => setLast("Zoomed in") }, { label: "Zoom out", shortcut: "⌘-", onClick: () => setLast("Zoomed out") }] },
          { label: "Help", disabled: true, items: [] },
        ]}
      />
      <span className="text-sm text-muted-foreground" role="status">{last}</span>
    </div>
  )
}

function SheetUsagePreview() {
  const [open, setOpen] = useState(false)
  const [snap, setSnap] = useState(0)
  const labels = ["Peek", "Half", "Full"]
  return (
    <div className="grid justify-items-center gap-3">
      <R.Button onClick={() => setOpen(true)}>Show filters</R.Button>
      <span className="text-sm text-muted-foreground" role="status">{open ? `Resting at: ${labels[snap]}` : "Drag the handle, or focus it and use ↑ ↓"}</span>
      <R.Sheet open={open} onOpenChange={setOpen} snapPoints={[0.35, 0.6, 0.92]} snap={snap} onSnapChange={setSnap} title="Filters" description="128 results">
        <div className="grid gap-5 p-5">
          <div className="grid gap-3">
            <p className="text-sm font-medium">Status</p>
            <R.Checkbox label="Active" defaultChecked />
            <R.Checkbox label="Paused" />
            <R.Checkbox label="Archived" />
          </div>
          <R.Slider label="Max price" defaultValue={60} />
          <R.Button onClick={() => setOpen(false)}>Show 128 results</R.Button>
        </div>
      </R.Sheet>
    </div>
  )
}

function PasswordInputUsagePreview() {
  const [password, setPassword] = useState("")
  return (
    <div className="w-full max-w-sm">
      <R.PasswordInput
        label="Create a password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        showStrength
        requirements={[
          { label: "At least 12 characters", test: (p) => p.length >= 12 },
          { label: "Upper and lower case letters", test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
          { label: "A number or symbol", test: (p) => /[\d\W]/.test(p) },
        ]}
      />
    </div>
  )
}

function SearchInputUsagePreview() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const pages = ["Button", "Banner", "Badge", "Breadcrumb", "Calendar", "Card", "Checkbox", "Sheet", "Sidebar", "Slider"]
  return (
    <div className="grid w-full max-w-sm gap-3">
      <R.SearchInput
        aria-label="Search components"
        placeholder="Search components…"
        shortcut="f"
        value={query}
        onValueChange={(value) => { setQuery(value); setLoading(Boolean(value)) }}
        onSearch={(value) => { setResults(value ? pages.filter((page) => page.toLowerCase().includes(value.toLowerCase())) : []); setLoading(false) }}
        loading={loading}
      />
      <p className="text-sm text-muted-foreground" role="status">
        {query && !loading ? `${results.length} result${results.length === 1 ? "" : "s"}: ${results.join(", ") || "none"}` : "Press F to focus, type, then Escape to clear"}
      </p>
    </div>
  )
}

function MaskedInputUsagePreview() {
  const [amount, setAmount] = useState<number | null>(1250)
  const [phone, setPhone] = useState("")
  const [card, setCard] = useState({ raw: "", complete: false })
  return (
    <div className="grid w-full max-w-sm gap-4">
      <R.CurrencyInput label="Amount" currency="USD" value={amount} onValueChange={setAmount} max={100000} hint={amount === null ? "Enter an amount" : `Value: ${amount}`} />
      <R.PhoneInput label="Mobile number" defaultCountry="US" onValueChange={(_, e164) => setPhone(e164)} hint={phone ? `E.164: ${phone}` : "We'll text a receipt"} />
      <R.MaskedInput label="Card number" mask="9999 9999 9999 9999" onValueChange={(raw, _, complete) => setCard({ raw, complete })} error={card.raw && !card.complete ? "Enter all 16 digits" : undefined} />
    </div>
  )
}

function AreaChartUsagePreview() {
  const [stacked, setStacked] = useState(true)
  return (
    <div className="grid w-full gap-4">
      <R.ToggleGroup
        type="single"
        aria-label="Layout"
        value={stacked ? "stacked" : "overlap"}
        onValueChange={(value) => setStacked(value === "stacked")}
      >
        <R.ToggleGroupItem value="stacked">Stacked</R.ToggleGroupItem>
        <R.ToggleGroupItem value="overlap">Overlapping</R.ToggleGroupItem>
      </R.ToggleGroup>
      <R.AreaChart
        ariaLabel="Weekly visitors by channel"
        stacked={stacked}
        labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
        series={[
          { label: "Organic", data: [1200, 1350, 1280, 1510, 1620, 980, 870] },
          { label: "Paid", data: [640, 720, 810, 760, 900, 520, 460] },
          { label: "Referral", data: [210, 260, 240, 300, 280, 190, 170] },
        ]}
        formatValue={(value) => value.toLocaleString("en-US")}
      />
    </div>
  )
}

function StackedBarUsagePreview() {
  const [mode, setMode] = useState<"stacked" | "percent" | "grouped">("stacked")
  return (
    <div className="grid w-full gap-4">
      <R.ToggleGroup
        type="single"
        aria-label="Mode"
        value={mode}
        onValueChange={(value) => setMode(value as typeof mode)}
      >
        <R.ToggleGroupItem value="stacked">Stacked</R.ToggleGroupItem>
        <R.ToggleGroupItem value="percent">100%</R.ToggleGroupItem>
        <R.ToggleGroupItem value="grouped">Grouped</R.ToggleGroupItem>
      </R.ToggleGroup>
      <R.StackedBarChart
        ariaLabel="Revenue by plan per quarter"
        mode={mode}
        labels={["Q1", "Q2", "Q3", "Q4"]}
        series={[
          { label: "Starter", data: [32, 38, 41, 45] },
          { label: "Team", data: [54, 61, 70, 82] },
          { label: "Enterprise", data: [40, 48, 66, 90] },
        ]}
        formatValue={(value) => `$${value}k`}
      />
    </div>
  )
}

function LightboxUsagePreview() {
  const photos = [
    { src: "/gallery/dawn-ridge.svg", alt: "Purple ridges under a peach dawn sky", caption: "Dawn ridge · 05:42" },
    { src: "/gallery/glacier-lake.svg", alt: "Blue mountains above a glacier lake", caption: "Glacier lake" },
    { src: "/gallery/pine-valley.svg", alt: "Green valley full of pine trees", caption: "Pine valley" },
    { src: "/gallery/desert-dunes.svg", alt: "Orange dunes under a pale sun", caption: "Desert dunes" },
    { src: "/gallery/night-peaks.svg", alt: "Dark peaks under a starry sky and moon", caption: "Night peaks" },
    { src: "/gallery/coastal-cliffs.svg", alt: "Teal cliffs over a calm sea", caption: "Coastal cliffs" },
  ]
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  return (
    <>
      <ul className="grid w-full max-w-2xl grid-cols-2 gap-2 sm:grid-cols-3">
        {photos.map((photo, i) => (
          <li key={photo.src}>
            <button type="button" aria-label={`Open ${photo.alt}`} onClick={() => { setIndex(i); setOpen(true) }} className="block w-full overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
              <R.Image src={photo.src} alt="" aspectRatio={4 / 3} rounded={false} className="transition-transform duration-300 hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>
      <R.Lightbox images={photos} open={open} onOpenChange={setOpen} index={index} onIndexChange={setIndex} loop />
    </>
  )
}

function ResizableUsagePreview() {
  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border border-border bg-surface">
      <R.Resizable defaultSizes={[22, 56, 22]} minSizes={[15, 30, 15]} panelLabels={["Explorer", "Editor", "Inspector"]}>
        <R.ResizablePanel className="p-3 text-sm"><p className="mb-2 text-xs font-semibold text-muted-foreground">EXPLORER</p><p>src/</p><p className="pl-3">app.tsx</p><p className="pl-3">theme.ts</p></R.ResizablePanel>
        <R.ResizablePanel>
          <R.Resizable direction="vertical" defaultSizes={[65, 35]} minSizes={[25, 20]} panelLabels={["Code", "Terminal"]}>
            <R.ResizablePanel className="p-3 font-mono text-xs">export default function App() {"{"}…{"}"}</R.ResizablePanel>
            <R.ResizablePanel className="bg-bg p-3 font-mono text-xs text-muted-foreground">$ npm run dev</R.ResizablePanel>
          </R.Resizable>
        </R.ResizablePanel>
        <R.ResizablePanel className="p-3 text-sm"><p className="mb-2 text-xs font-semibold text-muted-foreground">INSPECTOR</p><p>Props: 4</p></R.ResizablePanel>
      </R.Resizable>
    </div>
  )
}

function SortableUsagePreview() {
  const [items, setItems] = useState([
    { id: "1", title: "Configure authentication provider", tag: "Security" },
    { id: "2", title: "Set up PostgreSQL read replica", tag: "Database" },
    { id: "3", title: "Implement rate limiting middleware", tag: "API" },
    { id: "4", title: "Audit responsive design on mobile", tag: "UI" },
  ])
  return (
    <div className="w-full max-w-md">
      <R.SortableList
        items={items}
        onReorder={(next) => setItems(next)}
        getLabel={(item) => item.title}
        renderItem={(item) => (
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">{item.title}</span>
            <span className="rounded bg-foreground/6 px-1.5 py-0.5 text-xs text-muted-foreground">{item.tag}</span>
          </div>
        )}
      />
    </div>
  )
}

function NotificationCenterUsagePreview() {
  const [items, setItems] = useState<R.NotificationItem[]>([
    { id: "1", title: "Deployment succeeded", description: "Production environment updated to release v2.4.0", timestamp: "5m ago", read: false, tone: "success" },
    { id: "2", title: "Database backup completed", description: "Automated snapshot taken for postgres-prod", timestamp: "45m ago", read: false, tone: "info" },
    { id: "3", title: "High memory usage alert", description: "Host node worker-03 exceeded 90% memory capacity", timestamp: "3h ago", read: true, tone: "warning" },
  ])
  return (
    <div className="flex items-center justify-center p-6">
      <R.NotificationCenter
        items={items}
        onItemsChange={setItems}
        onClearAll={() => setItems([])}
      />
    </div>
  )
}

function TourUsagePreview() {
  const [open, setOpen] = useState(false)
  const steps: R.TourStep[] = [
    { target: "#tour-target-search", title: "Global Search", content: "Quickly locate any file, setting, or command with keyboard shortcuts." },
    { target: "#tour-target-action", title: "Deploy Button", content: "Ship changes to staging or production with zero downtime." },
    { target: "#tour-target-avatar", title: "User Account", content: "Manage team memberships, personal access tokens, and notifications." },
  ]
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg p-4 rounded-xl border border-border bg-surface">
      <div className="flex w-full items-center justify-between gap-2">
        <div id="tour-target-search" className="rounded-lg border border-border bg-surface-muted px-3 py-1.5 text-xs text-muted-foreground">
          🔍 Search project…
        </div>
        <div className="flex items-center gap-2">
          <button id="tour-target-action" type="button" className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            Deploy
          </button>
          <div id="tour-target-avatar" className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold">
            JD
          </div>
        </div>
      </div>
      <R.Button onClick={() => setOpen(true)} variant="secondary">Start interactive tour</R.Button>
      <R.Tour steps={steps} open={open} onOpenChange={setOpen} />
    </div>
  )
}

function TimePickerPreview() {
  const [value, setValue] = useState("09:30")
  const [confirmedValue, setConfirmedValue] = useState("09:30")

  return <div className="temporal-demo">
    <div className="temporal-demo-heading"><strong>Deployment window</strong><p>Schedule the release during staffed support hours.</p></div>
    <R.TimePicker
      label="Deployment time"
      value={value}
      onValueChange={setValue}
      minuteStep={15}
      min="08:00"
      max="18:00"
      hint="Workspace timezone · 08:00–18:00"
    />
    <div className="temporal-demo-footer"><span role="status">Confirmed: {confirmedValue || "Not set"}</span><R.Button size="sm" disabled={!value} onClick={() => setConfirmedValue(value)}>Confirm time</R.Button></div>
  </div>
}

function SnackbarPreview() {
  const { show } = R.useSnackbar()
  return <div className="demo-row"><R.Button onClick={() => show({ message: "Deployment completed successfully.", variant: "success" })}>Show success</R.Button><R.Button variant="secondary" onClick={() => show({ message: "Build quota is almost full.", variant: "warning" })}>Show warning</R.Button></div>
}

function ConfirmPreview() {
  const [open, setOpen] = useState(false)
  return <><R.Button variant="danger" icon={<Trash2 size={15} />} onClick={() => setOpen(true)}>Delete environment</R.Button><R.ConfirmDialog open={open} onClose={() => setOpen(false)} onConfirm={() => setOpen(false)} title="Delete production environment?" description="This permanently removes its containers and volumes." confirmLabel="Delete environment" destructive /></>
}

function CommandTrigger() {
  const { setOpen } = R.useCommand()
  return <R.Button onClick={() => setOpen(true)}>Open command palette</R.Button>
}

function CommandPreview() {
  return <R.CommandProvider><CommandTrigger /><R.CommandPalette items={[{ id: "projects", label: "Open projects", group: "Navigation", icon: <Box size={15} />, onSelect: () => {} }, { id: "settings", label: "Open settings", group: "Navigation", icon: <Settings size={15} />, onSelect: () => {} }]} /></R.CommandProvider>
}

function TagUsagePreview() {
  const [tags, setTags] = useState(["us-east-1", "preview"])
  return <div className="demo-row"><R.Tag>Node.js 22</R.Tag>{tags.map((tag) => <R.Tag key={tag} variant={tag === "preview" ? "info" : "success"} onRemove={() => setTags(tags.filter((t) => t !== tag))}>{tag}</R.Tag>)}</div>
}

function ErrorStateUsagePreview() {
  const [retries, setRetries] = useState(0)
  return <R.ErrorState className="w-full max-w-md" title="Failed to load deployments" description={retries ? `Still unreachable after ${retries} ${retries === 1 ? "retry" : "retries"}.` : "The API could not be reached."} error="connect ECONNREFUSED" onRetry={() => setRetries(retries + 1)} />
}

function TreePreview() {
  const [selected, setSelected] = useState("button")
  return <R.Tree className="w-full max-w-xs" selected={selected} onSelect={setSelected} defaultExpanded={["src", "components"]} nodes={[{ id: "src", label: "src", children: [{ id: "components", label: "components", children: [{ id: "button", label: "button.tsx" }, { id: "modal", label: "modal.tsx" }] }, { id: "index", label: "index.ts" }] }]} />
}

function NavigationPreview() {
  const [active, setActive] = useState("overview")
  const items: R.NavigationItem[] = [{ id: "overview", label: "Overview", icon: <Home size={15} /> }, { id: "projects", label: "Projects", icon: <Box size={15} /> }, { id: "activity", label: "Activity", icon: <Activity size={15} /> }]
  return <R.Navbar className="w-full rounded-xl" items={items} activeId={active} onSelect={setActive}><R.BrandLink href="#/docs/introduction" mark={<RuiBrandMark />}>@bzync/rui</R.BrandLink></R.Navbar>
}

function DevModePreview() {
  const [enabled, setEnabled] = useState(false)
  return (
    <div className="demo-stack items-center text-center">
      <R.Button onClick={() => setEnabled(!enabled)}>{enabled ? "Hide DevMode" : "Show DevMode"}</R.Button>
      <p className="text-sm text-muted-foreground">Resize the window and watch the bottom-left corner.</p>
      <R.DevMode enabled={enabled} />
    </div>
  )
}

function CodeEditorPreview() {
  const [value, setValue] = useState("export const status = \"ready\"\n")
  return <R.CodeEditor className="w-full" language="ts" value={value} onChange={setValue} />
}

function RichTextPreview() {
  const [value, setValue] = useState("<p>Write a deployment note…</p>")
  return <R.RichTextEditor className="w-full" value={value} onChange={setValue} />
}

const tableRows = [
  { id: 1, name: "api-gateway", status: "Healthy", region: "us-east-1" },
  { id: 2, name: "worker", status: "Building", region: "eu-west-1" },
  { id: 3, name: "web", status: "Healthy", region: "ap-south-1" },
]

const tableColumns: R.ColumnDef<(typeof tableRows)[number]>[] = [
  { key: "name", header: "Service", sortable: true, searchable: true, cell: (row) => row.name },
  { key: "status", header: "Status", sortable: true, cell: (row) => <R.Badge variant={row.status === "Healthy" ? "success" : "warning"}>{row.status}</R.Badge> },
  { key: "region", header: "Region", searchable: true, cell: (row) => row.region },
]

function TablePreview() {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(() => new Set([1]))

  function toggleRow(id: number) {
    setExpandedRows((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <R.Table aria-label="Services with deployment details" className="min-w-[560px]">
      <R.TableHeader>
        <R.TableRow>
          <R.TableHead className="w-10"><span className="sr-only">Expand row</span></R.TableHead>
          <R.TableHead>Service</R.TableHead>
          <R.TableHead>Status</R.TableHead>
          <R.TableHead>Region</R.TableHead>
        </R.TableRow>
      </R.TableHeader>
      <R.TableBody>
        {tableRows.map((row) => {
          const expanded = expandedRows.has(row.id)
          const detailsId = `service-${row.id}-details`
          return (
            <Fragment key={row.id}>
              <R.TableRow aria-selected={expanded}>
                <R.TableCell className="pr-0">
                  <R.Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label={`${expanded ? "Collapse" : "Expand"} ${row.name} details`}
                    aria-expanded={expanded}
                    aria-controls={detailsId}
                    onClick={() => toggleRow(row.id)}
                  >
                    <ChevronRight size={14} className={R.cn("transition-transform", expanded && "rotate-90")} aria-hidden="true" />
                  </R.Button>
                </R.TableCell>
                <R.TableCell className="font-medium">{row.name}</R.TableCell>
                <R.TableCell><R.Badge variant={row.status === "Healthy" ? "success" : "warning"}>{row.status}</R.Badge></R.TableCell>
                <R.TableCell>{row.region}</R.TableCell>
              </R.TableRow>
              <R.TableRow id={detailsId} hidden={!expanded} className="hover:bg-transparent">
                <R.TableCell colSpan={4} className="bg-surface-muted/60 px-5 py-4 whitespace-normal">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div><span className="block text-[11px] text-muted-foreground">Last deployment</span><strong className="text-xs">8 minutes ago</strong></div>
                    <div><span className="block text-[11px] text-muted-foreground">Runtime</span><strong className="text-xs">Node.js 22</strong></div>
                    <div><span className="block text-[11px] text-muted-foreground">Version</span><strong className="text-xs">v2.4.{row.id}</strong></div>
                  </div>
                </R.TableCell>
              </R.TableRow>
            </Fragment>
          )
        })}
      </R.TableBody>
    </R.Table>
  )
}

const chartProps = api(
  ["data", "chart data", "Values rendered by the chart."],
  ["height", "number", "Chart height in pixels."],
  ["className", "string", "Composes layout styles on the chart root."],
)

export const supplementalDetails: Record<string, () => SupplementalDetail> = {
  "components/heading": () => detail(
    `<Heading as="h2" size="xl" className="max-w-2xl">Operational clarity at every scale.</Heading>`,
    <R.Heading as="h2" size="xl" className="max-w-2xl">Operational clarity at every scale.</R.Heading>,
    api(["as", '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"', "Semantic heading level.", '"h2"'], ["size", '"xs" | "sm" | "md" | "lg" | "xl" | "2xl"', "Responsive visual scale; defaults from the heading level."], ["tone", '"default" | "muted" | "accent"', "Semantic text color.", '"default"'], ["weight", '"normal" | "medium" | "semibold" | "bold"', "Font weight.", '"semibold"'], ["balance", "boolean", "Balances multi-line headings where supported.", "true"]),
    "The as prop preserves the document outline independently from visual size. Choose levels in logical order and do not select them only for appearance.",
  ),
  "components/text": () => detail(
    `<div className="grid gap-4 max-w-lg"><Text variant="lead">Monitor deployments without losing operational context.</Text><Text>Semantic styles keep interface copy readable from mobile through wide operational screens.</Text><div className="flex flex-wrap items-center justify-center gap-3"><Text variant="label">Environment</Text><Text variant="helper">Used for deployment targeting.</Text><Text variant="success">All systems operational</Text><Text variant="warning">Capacity nearing limit</Text><Text variant="danger">Deployment failed</Text><Text variant="info">Maintenance at 02:00 UTC</Text></div><div className="flex flex-wrap items-center justify-center gap-3"><Text variant="date" value="2026-08-27" /><Text variant="time" value="13:45" hour12 /><Text variant="number" value={12480} /><Text variant="percent" value={0.962} numberOptions={{ maximumFractionDigits: 1 }} /><Text variant="currency" value={12840.5} currency="USD" /></div><Text variant="overline">Live operations</Text><Text variant="caption">Updated 2 minutes ago</Text></div>`,
    <div className="grid gap-4 max-w-lg"><R.Text variant="lead">Monitor deployments without losing operational context.</R.Text><R.Text>Semantic styles keep interface copy readable from mobile through wide operational screens.</R.Text><div className="flex flex-wrap items-center justify-center gap-3"><R.Text variant="label">Environment</R.Text><R.Text variant="helper">Used for deployment targeting.</R.Text><R.Text variant="success">All systems operational</R.Text><R.Text variant="warning">Capacity nearing limit</R.Text><R.Text variant="danger">Deployment failed</R.Text><R.Text variant="info">Maintenance at 02:00 UTC</R.Text></div><div className="flex flex-wrap items-center justify-center gap-3"><R.Text variant="date" value="2026-08-27" /><R.Text variant="time" value="13:45" hour12 /><R.Text variant="number" value={12480} /><R.Text variant="percent" value={0.962} numberOptions={{ maximumFractionDigits: 1 }} /><R.Text variant="currency" value={12840.5} currency="USD" /></div><R.Text variant="overline">Live operations</R.Text><R.Text variant="caption">Updated 2 minutes ago</R.Text></div>,
    api(["as", '"p" | "span" | "div" | "time"', "Rendered element; date/time variants default to time."], ["variant", '"body" | "lead" | "label" | "helper" | "muted" | "caption" | "overline" | "success" | "warning" | "danger" | "info" | "date" | "time" | "number" | "percent" | "currency"', "Purpose-oriented or formatted-value style.", '"body"'], ["value", "Date | number | bigint | string", "Value formatted by date, time, number, percent, and currency variants."], ["locale / timeZone", "string", "Locale and IANA timezone for temporal formatting."], ["hour12", "boolean", "Forces 12- or 24-hour time output."], ["formatOptions", "Intl.DateTimeFormatOptions", "Date/time formatting options."], ["numberOptions", "Intl.NumberFormatOptions", "Number and percent formatting options."], ["currency / accounting", "string / boolean", "Currency code and negative-value notation."], ["currencyOptions", "CurrencyFormatOptions", "Intl currency formatting options."], ["size", '"xs" | "sm" | "md" | "lg"', "Optional size override."], ["weight", '"normal" | "medium" | "semibold" | "bold"', "Optional weight override."], ["align", '"left" | "center" | "right"', "Text alignment.", '"left"'], ["wrap", '"normal" | "nowrap" | "balance" | "pretty"', "Wrapping and truncation behavior."]),
    "Text keeps HTML semantics explicit through as. Date and time variants render a machine-readable time element by default; calendar-only YYYY-MM-DD values do not shift across timezones. Formatted values fall back safely instead of throwing on invalid input.",
  ),
  "components/prose": () => detail(
    `<Prose className="w-full" as="article" width="sm"><h2>Deployment policy</h2><p>Every production change requires an audit trail and a documented recovery path.</p><ul><li>Review the release diff.</li><li>Confirm health checks and rollback ownership.</li></ul><blockquote>Reliable operations favor explicit state over hidden assumptions.</blockquote></Prose>`,
    <R.Prose className="w-full" as="article" width="sm"><h2>Deployment policy</h2><p>Every production change requires an audit trail and a documented recovery path.</p><ul><li>Review the release diff.</li><li>Confirm health checks and rollback ownership.</li></ul><blockquote>Reliable operations favor explicit state over hidden assumptions.</blockquote></R.Prose>,
    api(["as", '"div" | "article" | "section"', "Document container element.", '"article"'], ["size", '"sm" | "md" | "lg"', "Long-form reading scale.", '"md"'], ["width", '"none" | "sm" | "md" | "lg"', "Maximum reading width.", '"sm"'], ["className", "string", "Composes content layout styles."]),
    "Prose styles semantic child markup without changing it. Keep heading order logical, describe images, and use table headers for tabular content.",
  ),
  "components/inline-code": () => detail(
    `<Text>Run <InlineCode>npm run release:check</InlineCode> before publishing.</Text>`,
    <R.Text>Run <R.InlineCode>npm run release:check</R.InlineCode> before publishing.</R.Text>,
    api(["children", "ReactNode", "Inline technical content."], ["className", "string", "Composes one-off text and surface styles."], ["...props", "HTMLAttributes<HTMLElement>", "Native code-element attributes."]),
    "Renders a semantic code element and allows long tokens to wrap instead of forcing viewport overflow.",
  ),
  "components/date-range-picker": () => detail(
    `function ReportingPeriod() {
  const [range, setRange] = useState<DateRange>({ from: new Date(2026, 8, 1), to: new Date(2026, 8, 14) })
  return (
    <div className="grid w-full max-w-sm gap-3">
      <DateRangePicker label="Reporting period" value={range} onChange={setRange} />
      <span className="text-sm text-muted-foreground" role="status">
        {range.from && range.to ? \`\${Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000) + 1} days selected\` : "Pick a start and end date"}
      </span>
    </div>
  )
}`,
    <DateRangeUsagePreview />,
    api(["value / defaultValue", "{ from: Date | null; to: Date | null }", "Controlled or initial range."], ["onChange", "(range) => void", "Called when a range is completed, a preset is applied or the value is cleared."], ["presets", "DateRangePreset[] | false", "Quick ranges beside the calendar; defaults to today, last 7/30 days, this and last month.", "defaultDateRangePresets"], ["numberOfMonths", "1 | 2", "Months side by side on wider screens (phones always show one).", "2"], ["minDate / maxDate", "Date", "Selectable bounds."], ["size", '"sm" | "md" | "lg"', "Trigger height, matching Input and Button.", '"md"'], ["formatRange", "(range) => string", "Custom trigger text."], ["label / hint / error / placeholder / clearable / disabled", "—", "Same field contract as DatePicker."]),
    "The trigger opens a labelled dialog; each month is a grid of day buttons announcing range start, end or in range. Arrow keys, Home/End and PageUp/PageDown move focus; Enter picks; Escape closes and returns focus to the trigger. Presets are a labelled button group. On phones the panel becomes a bottom sheet.",
  ),
  "components/tag-input": () => detail(
    `function InviteEmails() {
  const [emails, setEmails] = useState(["maya@acme.dev"])
  return (
    <div className="grid w-full max-w-md gap-3">
      <TagInput
        label="Invite by email"
        value={emails}
        onChange={setEmails}
        transform={(tag) => tag.toLowerCase()}
        validate={(tag) => (/^\\S+@\\S+\\.\\S+$/.test(tag) ? undefined : \`“\${tag}” is not a valid email.\`)}
        hint="Press Enter or comma, or paste a list"
      />
      <span className="text-sm text-muted-foreground" role="status">{\`\${emails.length} \${emails.length === 1 ? "invite" : "invites"} ready\`}</span>
    </div>
  )
}`,
    <TagInputUsagePreview />,
    api(["value / defaultValue", "string[]", "Controlled or initial tags."], ["onChange", "(tags: string[]) => void", "Called when tags are added or removed."], ["separators", "string[]", "Keys that commit a tag.", '["Enter", ","]'], ["validate", "(tag) => string | void", "Return a message to reject a tag; it is shown inline and the text is kept for fixing."], ["transform", "(tag) => string", "Normalizes each tag before adding."], ["allowDuplicates", "boolean", "Allows repeated tags (case-insensitive check otherwise).", "false"], ["maxTags", "number", "Limit; the input disables when reached."], ["name", "string", "Submits one name=value entry per tag."], ["size / label / hint / error / disabled / placeholder", "—", "Shared field contract."]),
    "The text input is labelled and connected to its hint or error. Chips are a labelled list; each has a named remove button. Backspace on an empty input removes the last tag. Pasting a comma, semicolon or newline separated list adds every valid entry and keeps rejected ones in the input.",
  ),
  "components/time-picker": () => detail(
    `const [time, setTime] = useState("09:30")

<TimePicker
  label="Deployment time"
  value={time}
  onValueChange={setTime}
  minuteStep={15}
  min="08:00"
  max="18:00"
  hint="Workspace timezone · 08:00–18:00"
/>`,
    <TimePickerPreview />,
    api(["value / defaultValue", "string", "Controlled or initial HH:mm or HH:mm:ss value."], ["onValueChange", "(value: string) => void", "Called after Apply or Clear."], ["format", '"12" | "24"', "Displayed hour format.", '"12"'], ["minuteStep", "number", "Minute selection increment from 1 through 30.", "5"], ["showSeconds", "boolean", "Adds a seconds column.", "false"], ["min / max", "string", "Inclusive selectable time boundaries."], ["side", '"top" | "bottom"', "Vertical panel placement.", '"bottom"'], ["align", '"start" | "end"', "Horizontal panel alignment for viewport-edge placement.", '"start"'], ["label / hint / error", "string", "Accessible field messaging."], ["name", "string", "Adds a hidden form submission value."]),
    "The custom trigger controls a labeled dialog. Time columns expose listbox/option semantics with arrow, Home, and End navigation; Escape dismisses and restores trigger focus.",
  ),
  "components/currency": () => detail(
    `<div className="flex flex-wrap items-center justify-center gap-3"><Currency value={12840.5} currency="USD" /><Currency value={-920} currency="EUR" locale="de-DE" accounting /><Currency value={1840000} options={{ notation: "compact", maximumFractionDigits: 1 }} tone="positive" /></div>`,
    <div className="flex flex-wrap items-center justify-center gap-3"><R.Currency value={12840.5} currency="USD" /><R.Currency value={-920} currency="EUR" locale="de-DE" accounting /><R.Currency value={1840000} options={{ notation: "compact", maximumFractionDigits: 1 }} tone="positive" /></div>,
    api(["value", "number | bigint", "Monetary value to format."], ["currency", "string", "ISO 4217 currency code.", '"USD"'], ["locale", "Intl.LocalesArgument", "Formatting locale.", '"en-US"'], ["accounting", "boolean", "Uses accounting notation for negative values.", "false"], ["options", "CurrencyFormatOptions", "Intl number-format options such as notation and fraction digits."], ["tone", '"auto" | "default" | "positive" | "negative" | "muted"', "Semantic text treatment.", '"auto"'], ["fallback", "ReactNode", "Content shown for invalid values or format options.", '"—"']),
    "Currency renders readable text and tabular numerals. Compact notation receives a full-value accessible label, while negative values use the destructive semantic token by default.",
  ),
  "components/avatar-group": () => detail(
    `<AvatarGroup aria-label="Project members"><Avatar name="Maya Chen" /><Avatar name="Jordan Kim" /><Avatar name="Sam Rivera" /><AvatarGroupOverflow count={4} /></AvatarGroup>`,
    <R.AvatarGroup aria-label="Project members"><R.Avatar name="Maya Chen" /><R.Avatar name="Jordan Kim" /><R.Avatar name="Sam Rivera" /><R.AvatarGroupOverflow count={4} /></R.AvatarGroup>,
    api(["spacing", '"tight" | "normal" | "loose"', "Amount of overlap between avatars.", '"normal"'], ["children", "ReactNode", "Avatar and AvatarGroupOverflow elements."], ["className", "string", "Composes layout styles."], ["AvatarGroupOverflow.count", "number", "Number of additional people not shown."]),
    "The root is a named group. AvatarGroupOverflow exposes a readable label such as “4 more people” instead of only its visual +4 text.",
  ),
  "components/button-group": () => detail(
    `<ButtonGroup aria-label="Document actions">
  <Button variant="secondary">Save</Button>
  <Button variant="secondary">Duplicate</Button>
  <Button variant="secondary">Archive</Button>
</ButtonGroup>`,
    <R.ButtonGroup aria-label="Document actions"><R.Button variant="secondary">Save</R.Button><R.Button variant="secondary">Duplicate</R.Button><R.Button variant="secondary">Archive</R.Button></R.ButtonGroup>,
    api(["orientation", '"horizontal" | "vertical"', "Visual grouping direction.", '"horizontal"'], ["children", "ReactNode", "Related button controls."], ["className", "string", "Composes group layout styles."], ["aria-label", "string", "Accessible name describing the related actions."]),
    "Uses role=\"group\" while preserving each child button's native keyboard and disabled behavior. Give the group a concise accessible name.",
  ),
  "components/description-list": () => detail(
    `<DescriptionList className="w-full max-w-lg" columns={2}><DescriptionItem><DescriptionTerm>Region</DescriptionTerm><DescriptionDetails>US East</DescriptionDetails></DescriptionItem><DescriptionItem><DescriptionTerm>Runtime</DescriptionTerm><DescriptionDetails>Node.js 22</DescriptionDetails></DescriptionItem><DescriptionItem><DescriptionTerm>Status</DescriptionTerm><DescriptionDetails><Badge variant="success" size="sm">Healthy</Badge></DescriptionDetails></DescriptionItem><DescriptionItem><DescriptionTerm>Version</DescriptionTerm><DescriptionDetails>v2.4.1</DescriptionDetails></DescriptionItem></DescriptionList>`,
    <R.DescriptionList className="w-full max-w-lg" columns={2}><R.DescriptionItem><R.DescriptionTerm>Region</R.DescriptionTerm><R.DescriptionDetails>US East</R.DescriptionDetails></R.DescriptionItem><R.DescriptionItem><R.DescriptionTerm>Runtime</R.DescriptionTerm><R.DescriptionDetails>Node.js 22</R.DescriptionDetails></R.DescriptionItem><R.DescriptionItem><R.DescriptionTerm>Status</R.DescriptionTerm><R.DescriptionDetails><R.Badge variant="success" size="sm">Healthy</R.Badge></R.DescriptionDetails></R.DescriptionItem><R.DescriptionItem><R.DescriptionTerm>Version</R.DescriptionTerm><R.DescriptionDetails>v2.4.1</R.DescriptionDetails></R.DescriptionItem></R.DescriptionList>,
    api(["columns", "1 | 2 | 3", "Responsive column count.", "1"], ["density", '"compact" | "default" | "relaxed"', "Space between entries.", '"default"'], ["DescriptionItem.orientation", '"stacked" | "inline"', "Term/value arrangement.", '"stacked"'], ["className", "string", "Composes list layout styles."]),
    "Renders native dl, dt, and dd elements so term/value relationships remain available to assistive technology.",
  ),
  "components/rating": () => detail(
    `<Rating label="Service rating" defaultValue={4} showValue />`,
    <R.Rating label="Service rating" defaultValue={4} showValue />,
    api(["label", "string", "Required accessible group label."], ["value / defaultValue", "number", "Controlled or initial rating."], ["onValueChange", "(value: number) => void", "Rating selection callback."], ["max", "number", "Number of rating choices.", "5"], ["readOnly", "boolean", "Prevents changes while preserving the value for reading.", "false"], ["size", '"sm" | "md" | "lg"', "Star size.", '"md"']),
    "Uses a labeled native radio group. Every choice has a textual star count, supports standard radio-keyboard behavior, and exposes read-only state.",
  ),
  "components/blockquote": () => detail(
    `<Blockquote className="w-full max-w-lg" variant="accent" source="2026 reliability report">Reliable systems make failure visible, understandable, and recoverable.</Blockquote>`,
    <R.Blockquote className="w-full max-w-lg" variant="accent" source="2026 reliability report">Reliable systems make failure visible, understandable, and recoverable.</R.Blockquote>,
    api(["variant", '"default" | "accent" | "subtle"', "Visual treatment.", '"default"'], ["size", '"sm" | "md" | "lg"', "Quote typography and spacing.", '"md"'], ["cite", "string", "Native URL identifying the quotation source."], ["source", "ReactNode", "Visible source attribution."], ["sourceHref", "string", "Optional link for the visible attribution."]),
    "Renders a semantic blockquote. The native cite attribute identifies the source in markup; source renders a visible attribution and can be linked.",
  ),
  "components/toggle": () => detail(
    `<Toggle defaultPressed>Bold</Toggle>
<Toggle variant="outline">Italic</Toggle>
<Toggle disabled>Disabled</Toggle>`,
    <div className="demo-row"><R.Toggle defaultPressed>Bold</R.Toggle><R.Toggle variant="outline">Italic</R.Toggle><R.Toggle disabled>Disabled</R.Toggle></div>,
    api(["pressed / defaultPressed", "boolean", "Controlled or initial pressed state."], ["onPressedChange", "(pressed: boolean) => void", "Called when the user changes the pressed state."], ["variant", '"default" | "outline"', "Visual treatment.", '"default"'], ["size", '"sm" | "md" | "lg" | "icon"', "Control density.", '"md"']),
    "Uses a native button with aria-pressed, visible focus treatment, and native disabled behavior.",
  ),
  "components/toggle-group": () => detail(
    `<ToggleGroup type="multiple" defaultValue={["bold"]} variant="outline" aria-label="Formatting"><ToggleGroupItem value="bold">Bold</ToggleGroupItem><ToggleGroupItem value="italic">Italic</ToggleGroupItem><ToggleGroupItem value="underline">Underline</ToggleGroupItem></ToggleGroup>`,
    <R.ToggleGroup type="multiple" defaultValue={["bold"]} variant="outline" aria-label="Formatting"><R.ToggleGroupItem value="bold">Bold</R.ToggleGroupItem><R.ToggleGroupItem value="italic">Italic</R.ToggleGroupItem><R.ToggleGroupItem value="underline">Underline</R.ToggleGroupItem></R.ToggleGroup>,
    api(["type", '"single" | "multiple"', "Selection behavior.", '"single"'], ["value / defaultValue", "string | string[]", "Controlled or initial selected values."], ["onValueChange", "(value: string | string[]) => void", "Selection callback."], ["orientation", '"horizontal" | "vertical"', "Layout and arrow-key axis.", '"horizontal"'], ["loop", "boolean", "Wraps arrow-key focus at group boundaries.", "true"]),
    "The group and native toggle buttons expose pressed states. Arrow keys move focus along the configured orientation; Home and End move to the boundaries.",
  ),
  "components/aspect-ratio": () => detail(
    `<AspectRatio ratio={16 / 9} className="w-full max-w-lg rounded-xl border border-border bg-surface-muted"><div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">16:9 application preview</div></AspectRatio>`,
    <R.AspectRatio ratio={16 / 9} className="w-full max-w-lg rounded-xl border border-border bg-surface-muted"><div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">16:9 application preview</div></R.AspectRatio>,
    api(["ratio", "number", "Width divided by height.", "16 / 9"], ["className", "string", "Composes sizing, surface, and overflow styles."], ["style", "CSSProperties", "Native inline styles merged after the computed ratio."], ["children", "ReactNode", "Media or content constrained by the ratio."]),
    "AspectRatio is a visual layout primitive. Give contained images meaningful alt text, or empty alt text when decorative.",
  ),
  "components/scroll-area": () => detail(
    `<ScrollArea className="h-52 w-full max-w-sm rounded-xl border border-border bg-surface p-2" aria-label="Recent deployments"><div className="grid gap-4">{Array.from({ length: 8 }, (_, index) => <div className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2 text-sm" key={index}><span>Deployment #{842 - index}</span><Badge variant={index < 2 ? "success" : "muted"} size="sm">{index < 2 ? "Ready" : "Archived"}</Badge></div>)}</div></ScrollArea>`,
    <R.ScrollArea className="h-52 w-full max-w-sm rounded-xl border border-border bg-surface p-2" aria-label="Recent deployments"><div className="grid gap-4">{Array.from({ length: 8 }, (_, index) => <div className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2 text-sm" key={index}><span>Deployment #{842 - index}</span><R.Badge variant={index < 2 ? "success" : "muted"} size="sm">{index < 2 ? "Ready" : "Archived"}</R.Badge></div>)}</div></R.ScrollArea>,
    api(["orientation", '"vertical" | "horizontal" | "both"', "Allowed scroll axis.", '"vertical"'], ["hideScrollbar", "boolean", "Visually hides the native scrollbar while retaining scrolling.", "false"], ["keyboardNavigable", "boolean", "Adds the region to the tab order for keyboard scrolling.", "true"], ["className", "string", "Sets the region dimensions and composes visual styles."]),
    "Keyboard navigation is enabled by default. Supply aria-label or aria-labelledby when the scroll area is a meaningful standalone region.",
  ),
  "components/divider": () => detail(
    `<div className="grid gap-4 w-full max-w-lg"><div className="rounded-xl border border-border bg-surface p-4"><p className="text-sm text-muted-foreground">Deployment pipeline</p><Divider label="Production gate" /><p className="text-sm text-muted-foreground">Release ready</p></div><div className="flex h-24 items-stretch gap-4 rounded-xl border border-border bg-surface p-4"><span className="text-sm">Build</span><Divider orientation="vertical" decorative={false} aria-label="Section divider" /><span className="text-sm">Deploy</span></div></div>`,
    <div className="grid gap-4 w-full max-w-lg"><div className="rounded-xl border border-border bg-surface p-4"><p className="text-sm text-muted-foreground">Deployment pipeline</p><R.Divider label="Production gate" /><p className="text-sm text-muted-foreground">Release ready</p></div><div className="flex h-24 items-stretch gap-4 rounded-xl border border-border bg-surface p-4"><span className="text-sm">Build</span><R.Divider orientation="vertical" decorative={false} aria-label="Section divider" /><span className="text-sm">Deploy</span></div></div>,
    api(["orientation", '"horizontal" | "vertical"', "Rule direction.", '"horizontal"'], ["variant", '"solid" | "dashed" | "dotted"', "Line style.", '"solid"'], ["spacing", '"none" | "sm" | "md" | "lg"', "Outer margin.", '"md"'], ["label", "ReactNode", "Optional centered label."], ["decorative", "boolean", "Hides the rule from assistive technology.", "true"]),
    "Divider renders presentational rules by default. Set decorative={false} and provide an accessible name when the separation conveys meaning.",
  ),
  "components/copy-button": () => detail(
    `<div className="flex flex-wrap items-center justify-center gap-3"><code>sk_live_abc123</code><CopyButton value="sk_live_abc123" label="Copy API key" /></div>`,
    <div className="flex flex-wrap items-center justify-center gap-3"><code>sk_live_abc123</code><R.CopyButton value="sk_live_abc123" label="Copy API key" /></div>,
    api(["value", "string", "Text written to the clipboard."], ["label", "string", "Visible and accessible action label."], ["timeout", "number", "Copied-state duration in milliseconds.", "2000"]),
    "Uses a native button and announces its copied state through visible button text.",
  ),
  "components/info-button": () => detail(
    `function RequestLimitHelp() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="flex items-center justify-between gap-5">
        <div>
          <strong>Monthly request limit</strong>
          <p>Requests reset on the first day of each month.</p>
        </div>
        <Tooltip content="Learn about monthly request limits">
          <InfoButton label="Learn about monthly request limits" onClick={() => setOpen(true)} />
        </Tooltip>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Monthly request limit" description="How usage is calculated" size="sm">
        <p>Successful API requests count toward the workspace limit. Failed authentication attempts and health checks do not.</p>
        <Button size="sm" onClick={() => setOpen(false)}>Got it</Button>
      </Modal>
    </>
  )
}`,
    <InfoButtonPreview />,
    api(["label", "string", "Required accessible name describing the information that opens."], ["onClick", "MouseEventHandler<HTMLButtonElement>", "Action invoked on activation."], ["className", "string", "Composes sizing and visual overrides."], ["...props", "ButtonHTMLAttributes<HTMLButtonElement>", "Native button attributes except children and aria-label."]),
    "Uses a 32px native button with a visible focus ring and required descriptive name. Pair it with nearby subject text; a Tooltip can make the action visible on hover and focus, while activation should open useful contextual content.",
  ),
  "components/billing-interval-toggle": () => detail(
    `function BillingIntervals() {
  const [value, setValue] = useState<BillingInterval>("yearly")
  const options: BillingIntervalToggleOption[] = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Annually", badge: "Save 20%" },
  ]
  return (
    <>
      <BillingIntervalToggle value={value} onChange={setValue} options={options} />
      <BillingIntervalToggle
        value={value}
        onChange={setValue}
        options={options}
        size="lg"
      />
    </>
  )
}`,
    <BillingPreview />,
    api(["value", "BillingInterval", "Controlled selected interval."], ["onChange", "(value) => void", "Selection callback."], ["options", "BillingIntervalToggleOption[]", "Intervals displayed by the segmented control."], ["size", '"sm" | "lg"', "Control density and selected-state emphasis.", '"sm"'], ["disabled", "boolean", "Disables every interval option.", "false"], ["aria-label", "string", "Accessible name for the option group.", '"Billing interval"'], ["className", "string", "Composes layout and surface overrides."]),
    "The named group contains native buttons with aria-pressed selection, focus-visible treatment, and disabled semantics.",
  ),
  "components/theme-switcher": () => detail(
    `function ThemeSwitcherDemo() {
  const [theme, setTheme] = useState<Theme>("system")
  return (
    <div className="flex flex-col items-center gap-4">
      <ThemeSwitcher value={theme} onChange={setTheme} />
      <span className="text-xs text-muted-foreground">Current selection: {theme}</span>
    </div>
  )
}`,
    <ThemeSwitcherUsagePreview />,
    api(
      ["variant", '"segmented" | "dropdown" | "switch" | "radio" | "icon-button"', "Visual layout presentation.", '"segmented"'],
      ["size", '"sm" | "md" | "lg"', "Control size standard.", '"md"'],
      ["includeSystem", "boolean", "Whether to include the system preference option.", "true"],
      ["showLabels", "boolean", "Whether to render text labels alongside icons."],
      ["value", '"light" | "dark" | "system"', "Controlled theme preference."],
      ["onChange", "(theme: Theme) => void", "Callback invoked when theme changes."],
      ["lightLabel", "string", "Custom label for light mode.", '"Light"'],
      ["darkLabel", "string", "Custom label for dark mode.", '"Dark"'],
      ["systemLabel", "string", "Custom label for system mode.", '"System"'],
      ["lightIcon / darkIcon / systemIcon", "ReactNode", "Custom icons for modes."],
      ["ariaLabel", "string", "Accessible name for the control.", '"Color theme"'],
      ["className", "string", "Composes container styles."],
    ),
    "Renders accessible radio groups or menus with keyboard navigation (Arrow keys, Space/Enter, Escape). All interactive elements provide visible focus rings, aria-checked/aria-pressed attributes, and descriptive accessible names.",
  ),
  "components/autocomplete": () => detail(
    `<Autocomplete
  label="Runtime"
  placeholder="Search runtimes…"
  hint="Type to filter options"
  options={[
    { value: "node", label: "Node.js 22" },
    { value: "go", label: "Go 1.25" },
    { value: "rust", label: "Rust" },
  ]}
/>`,
    <div className="w-full max-w-sm"><R.Autocomplete label="Runtime" placeholder="Search runtimes…" hint="Type to filter options" options={[{ value: "node", label: "Node.js 22" }, { value: "go", label: "Go 1.25" }, { value: "rust", label: "Rust" }]} /></div>,
    api(["options", "AutocompleteOption[]", "Searchable option values and labels."], ["multiple", "boolean", "Enables multi-selection.", "false"], ["creatable / onCreate / createLabel", "boolean / functions", "Offer a Create row for unmatched text and shape the new option."], ["loadOptions / debounceMs", "(query, signal) => Promise<options>", "Async search with debounce; stale requests are aborted."], ["size", '"sm" | "md" | "lg"', "Trigger height, matching Input and Button.", '"md"'], ["value / defaultValue", "V | V[]", "Controlled or initial selection; a single value shows its label in the input."], ["inputValue", "string", "Controlled query text."], ["onSelect", "(option, all?) => void", "Selection callback."], ["label / hint / error", "string", "Accessible field messaging."]),
    "Exposes combobox/listbox semantics with arrow-key navigation, Enter selection, Escape dismissal, and associated field messages.",
  ),
  "components/slider": () => detail(
    `<Slider className="w-full max-w-sm" label="Memory" min={128} max={4096} step={128} defaultValue={1024} formatValue={(value) => \`\${value} MB\`} />`,
    <R.Slider className="w-full max-w-sm" label="Memory" min={128} max={4096} step={128} defaultValue={1024} formatValue={(value) => `${value} MB`} />,
    api(["min / max / step", "number", "Native range boundaries and increment."], ["value / defaultValue", "number", "Controlled or initial value."], ["formatValue", "(value) => string", "Accessible and visible value formatter."], ["showValue", "boolean", "Shows the current output.", "true"], ["size", '"sm" | "md" | "lg"', "Track and thumb scale.", '"md"']),
    "Uses a native range input and supplies aria-valuetext from the formatted value.",
  ),
  "components/number-input": () => detail(
    `<NumberInput label="Replicas" min={1} max={10} defaultValue={3} hint="Containers running in each region" />`,
    <R.NumberInput label="Replicas" min={1} max={10} defaultValue={3} hint="Containers running in each region" />,
    api(["value / defaultValue", "number", "Controlled or initial numeric value."], ["min / max / step", "number", "Clamping boundaries and increment."], ["onChange", "(value: number) => void", "Called after a committed change."], ["size", '"sm" | "md" | "lg"', "Control density.", '"md"']),
    "The labeled native number field works with keyboard entry; increment and decrement buttons have accessible names.",
  ),
  "components/otp-input": () => detail(
    `<OtpInput label="Verification code" length={6} hint="Paste or type the six-digit code" />`,
    <R.OtpInput label="Verification code" length={6} hint="Paste or type the six-digit code" />,
    api(["length", "number", "Number of digit fields.", "6"], ["value / defaultValue", "string", "Controlled or initial code."], ["onChange / onComplete", "(value: string) => void", "Edit and completion callbacks."], ["masked", "boolean", "Masks entered digits.", "false"]),
    "Fields use numeric input modes, one-time-code autocomplete, paste support, and arrow-key navigation.",
  ),
  "components/file-upload": () => detail(
    `<FileUpload label="Configuration" accept=".json,.yaml" maxSizeMB={5} hint="JSON or YAML, up to 5 MB" />`,
    <R.FileUpload className="w-full max-w-md" label="Configuration" accept=".json,.yaml" maxSizeMB={5} hint="JSON or YAML, up to 5 MB" />,
    api(["accept", "string", "Accepted file types."], ["multiple", "boolean", "Allows multiple files."], ["maxSizeMB", "number", "Maximum size per file."], ["onFilesChange", "(files: File[]) => void", "Called when the file list changes."]),
    "Uses a labeled native file input and exposes validation through aria-invalid and associated messages.",
  ),
  "components/date-picker": () => detail(
    `const [date, setDate] = useState<Date | null>(null)

<DatePicker
  label="Deployment date"
  value={date}
  onChange={setDate}
  minDate={new Date(2026, 8, 1)}
  maxDate={new Date(2026, 9, 31)}
  hint="September 1–October 31, 2026"
/>`,
    <DatePickerPreview />,
    api(["value / defaultValue", "Date | null", "Controlled or initial selected date."], ["onChange", "(date: Date | null) => void", "Selection callback."], ["minDate / maxDate", "Date", "Selectable date boundaries."], ["clearable", "boolean", "Allows clearing the value.", "true"], ["size", '"sm" | "md" | "lg"', "Trigger height; taller on touch screens.", '"md"']),
    "The trigger exposes dialog state and associated field messages. Calendar days use roving focus with arrow, Home, End, Page Up, and Page Down navigation; Escape dismisses and restores trigger focus.",
  ),
  "components/calendar": () => detail(
    `<Calendar
  defaultValue={new Date()}
  defaultView="month"
  events={[{ id: "deploy", title: "Deploy API", date: new Date(), time: "10:00", color: "blue" }]}
/>`,
    <R.Calendar className="w-full" defaultValue={new Date()} defaultView="month" events={[{ id: "deploy", title: "Deploy API", date: new Date(), time: "10:00", color: "blue" }]} />,
    api(["value / defaultValue", "Date | null", "Controlled or initial selected date."], ["view / defaultView", '"month" | "week"', "Controlled or initial calendar view."], ["events", "CalendarEvent[]", "Events rendered on dates."], ["editable", "boolean", "Enables event creation and editing.", "false"]),
    "Date controls are native buttons with labels; disabled dates cannot be selected.",
  ),
  "components/label": () => detail(
    `<Label htmlFor="label-demo" required hint="64 characters maximum">Project name</Label>`,
    <R.Label htmlFor="label-demo" required hint="64 characters maximum">Project name</R.Label>,
    api(["htmlFor", "string", "ID of the associated form control."], ["required", "boolean", "Displays required-state text."], ["hint", "ReactNode", "Compact supplementary label content."], ["className", "string", "Composes label styles."]),
    "Renders a native label; htmlFor should match the target control ID.",
  ),
  "components/form": () => detail(
    `type InviteValues = { name: string; email: string; role: string }

function InviteForm() {
  const [sent, setSent] = useState<string | null>(null)
  const form = useForm<InviteValues>({
    defaultValues: { name: "", email: "", role: "" },
    validate: (values) => ({
      name: values.name.trim() ? undefined : "Enter a name.",
      email: /^\\S+@\\S+\\.\\S+$/.test(values.email) ? undefined : "Enter a valid email.",
      role: values.role ? undefined : "Choose a role.",
    }),
  })
  return (
    <Form form={form} errorSummary className="w-full max-w-sm" onSubmit={async (values) => { await new Promise((resolve) => setTimeout(resolve, 600)); setSent(values.email); form.reset() }}>
      <Input label="Name" {...form.register("name")} />
      <Input label="Email" type="email" {...form.register("email")} />
      <Select label="Role" options={[{ value: "admin", label: "Admin" }, { value: "member", label: "Member" }]} {...form.control("role")} />
      <Button type="submit" loading={form.isSubmitting}>Send invite</Button>
      {sent && <p className="text-sm text-muted-foreground" role="status">{\`Invite sent to \${sent}\`}</p>}
    </Form>
  )
}`,
    <FormUsagePreview />,
    api(["useForm({ defaultValues, validate?, schema?, mode? })", "UseFormReturn<T>", "Form state: values, errors, touched, isSubmitting, isDirty, isValid, submitCount."], ["validate", "(values) => errors | Promise<errors>", "Returns a message per invalid field."], ["schema", "{ safeParse(values) }", "Zod-compatible schema (Zod works as-is); merged with validate."], ["mode", '"onSubmit" | "onBlur" | "onChange"', "When errors first appear; after a failed submit fields revalidate as you type.", '"onSubmit"'], ["register(name, { type? })", "field props", "For native-event fields: Input, Textarea, Checkbox, Switch (type: \"checkbox\")."], ["control(name)", "field props", "For value-based fields: Select, DatePicker, DateRangePicker, RadioGroup, NumberInput, Autocomplete…"], ["setValue / setError / reset / validateForm / handleSubmit", "functions", "Imperative helpers."], ["<Form form onSubmit onInvalid? errorSummary?>", "component", "Native form: validates on submit, focuses the first invalid field, optional error summary alert."], ["useFormContext()", "hook", "Access the nearest form from custom fields."]),
    "Errors flow into each field's own error prop, so labels, aria-invalid and aria-describedby are wired automatically. A failed submit moves focus to the first invalid field; errorSummary adds an alert listing every problem. The form is noValidate, so the library's messages replace inconsistent browser bubbles, and aria-busy is set while submitting.",
  ),
  "components/form-field": () => detail(
    `<FormField className="w-full max-w-sm" label="Project name" htmlFor="project-demo" hint="Used in URLs and logs" required><Input id="project-demo" placeholder="api-gateway" /></FormField>`,
    <R.FormField className="w-full max-w-sm" label="Project name" htmlFor="project-demo" hint="Used in URLs and logs" required><R.Input id="project-demo" placeholder="api-gateway" /></R.FormField>,
    api(["label", "ReactNode", "Visible field label."], ["htmlFor", "string", "ID of the child control."], ["hint", "ReactNode", "Supporting field text."], ["error", "string", "Validation message."], ["required", "boolean", "Displays a required marker."]),
    "Connect htmlFor to the child control and let the child expose its own invalid and described-by attributes.",
  ),
  "components/avatar": () => detail(
    `<div className="flex flex-wrap items-center justify-center gap-3"><Avatar name="Maya Chen" size="lg" status="online" /><Avatar name="Alex Rivera" size="lg" status="away" /><Avatar name="Sam Lee" size="lg" status="busy" /></div>`,
    <div className="flex flex-wrap items-center justify-center gap-3"><R.Avatar name="Maya Chen" size="lg" status="online" /><R.Avatar name="Alex Rivera" size="lg" status="away" /><R.Avatar name="Sam Lee" size="lg" status="busy" /></div>,
    api(["name", "string", "Name used for fallback initials and accessible text."], ["src", "string", "Optional image source."], ["size", '"xs" | "sm" | "md" | "lg" | "xl"', "Avatar size.", '"md"'], ["status", "AvatarStatus", "Optional presence indicator."]),
    "Images include an accessible name; fallback initials are derived from the supplied name.",
  ),
  "components/callout": () => detail(
    `<Callout className="w-full max-w-lg" variant="warning" title="Approaching limit">You have used 92% of this month's build minutes.</Callout>`,
    <R.Callout className="w-full max-w-lg" variant="warning" title="Approaching limit">You have used 92% of this month&apos;s build minutes.</R.Callout>,
    api(["variant", '"default" | "success" | "warning" | "danger" | "info" | "muted"', "Semantic treatment. \"error\" is a deprecated alias of \"danger\".", '"info"'], ["title", "ReactNode", "Optional heading."], ["icon", "ReactNode", "Custom leading icon."], ["children", "ReactNode", "Callout message."]),
    "Keep a textual title or message so meaning is not communicated by color alone.",
  ),
  "components/tag": () => detail(
    `function RegionTags() {
  const [tags, setTags] = useState(["us-east-1", "preview"])
  return (
    <>
      <Tag>Node.js 22</Tag>
      {tags.map((tag) => (
        <Tag key={tag} variant={tag === "preview" ? "info" : "success"} onRemove={() => setTags(tags.filter((t) => t !== tag))}>
          {tag}
        </Tag>
      ))}
    </>
  )
}`,
    <TagUsagePreview />,
    api(["variant", "TagVariant", "Semantic visual style."], ["size", '"sm" | "md"', "Tag density.", '"md"'], ["icon", "ReactNode", "Leading icon."], ["onRemove", "() => void", "Adds and handles the remove button."]),
    "The optional remove action is a named native button; retain visible tag text.",
  ),
  "components/kbd": () => detail(
    `<div className="flex flex-wrap items-center justify-center gap-3"><span>Open search</span><Kbd keys={["⌘", "K"]} /><span>Dismiss</span><Kbd keys="ESC" /></div>`,
    <div className="flex flex-wrap items-center justify-center gap-3"><span>Open search</span><R.Kbd keys={["⌘", "K"]} /><span>Dismiss</span><R.Kbd keys="ESC" /></div>,
    api(["keys", "string | string[]", "One key or a chord."], ["size", '"sm" | "md"', "Keycap size.", '"sm"'], ["className", "string", "Composes keycap styles."]),
    "Kbd is presentational; describe what the shortcut does in nearby text.",
  ),
  "components/status-dot": () => detail(
    `<div className="flex flex-wrap items-center justify-center gap-3"><StatusDot status="online" label="Operational" pulse /><StatusDot status="pending" label="Deploying" pulse /><StatusDot status="error" label="Failed" /></div>`,
    <div className="flex flex-wrap items-center justify-center gap-3"><R.StatusDot status="online" label="Operational" pulse /><R.StatusDot status="pending" label="Deploying" pulse /><R.StatusDot status="error" label="Failed" /></div>,
    api(["status", "Status", "Operational state."], ["label", "string", "Visible state label."], ["pulse", "boolean", "Animates live states.", "false"], ["size", '"sm" | "md" | "lg"', "Indicator size.", '"md"']),
    "Provide a label or adjacent text so status is not conveyed by color alone.",
  ),
  "components/icon": () => detail(
    `<div className="flex flex-wrap items-center justify-center gap-4">
  <Icon name="search" />
  <Icon name="check" tone="success" />
  <Icon name="alert-triangle" tone="warning" />
  <Icon name="x" tone="danger" />
  <Icon name="loader" spin tone="accent" />
  <Icons.Copy className="cursor-pointer hover:text-accent-strong" />
  <Icons.Heart tone="danger" size="lg" />
</div>`,
    <div className="flex flex-wrap items-center justify-center gap-4">
      <R.Icon name="search" />
      <R.Icon name="check" tone="success" />
      <R.Icon name="alert-triangle" tone="warning" />
      <R.Icon name="x" tone="danger" />
      <R.Icon name="loader" spin tone="accent" />
      <R.Icons.Copy className="cursor-pointer hover:text-accent-strong" />
      <R.Icons.Heart tone="danger" size="lg" />
    </div>,
    api(
      ["name", "IconName", "Name of a built-in vector icon (kebab-case, camelCase, or PascalCase). Over 500 icons supported."],
      ["size", '"xs" | "sm" | "md" | "lg" | "xl" | number', "Pre-configured size scale or exact pixel dimension.", '"md"'],
      ["tone", '"default" | "muted" | "accent" | "success" | "warning" | "danger" | "info"', "Semantic status or brand color tone.", '"default"'],
      ["label", "string", "Accessible screen-reader label (sets role='img' and aria-label)."],
      ["title", "string", "Accessible SVG title element for browser tooltips."],
      ["spin", "boolean", "Continuously animates icon rotation (e.g. for spinners). Automatically active for 'loader'.", "false"],
      ["strokeWidth", "number | string", "SVG stroke line width in user units.", "2"],
      ["children", "ReactNode", "Custom SVG elements when augmenting or authoring bespoke glyphs."],
      ["className", "string", "Composes SVG classes merged via cn()."],
    ),
    "Icons are hidden from screen readers with aria-hidden='true' by default. If an icon conveys standalone meaning without visible accompanying text, pass a label prop to set role='img' and aria-label, or pass title to render an accessible SVG tooltip.",
  ),
  "components/stat": () => detail(
    `<div className="grid w-full max-w-lg gap-3 sm:grid-cols-2"><Stat label="Requests" value="1.2M" trend="up" trendValue="+14%" description="vs last month" /><Stat label="Latency" value="38" unit="ms" trend="down" trendValue="-4ms" /></div>`,
    <div className="grid w-full max-w-lg gap-3 sm:grid-cols-2"><R.Stat label="Requests" value="1.2M" trend="up" trendValue="+14%" description="vs last month" /><R.Stat label="Latency" value="38" unit="ms" trend="down" trendValue="-4ms" /></div>,
    api(["label", "ReactNode", "Metric label."], ["value", "ReactNode", "Primary metric value."], ["unit", "ReactNode", "Optional unit."], ["trend", '"up" | "down" | "neutral"', "Trend direction."], ["trendValue", "ReactNode", "Visible change amount."]),
    "Use descriptive labels and trend text; arrows and color should reinforce rather than replace meaning.",
  ),
  "components/link": () => detail(
    `<div className="flex flex-wrap items-center justify-center gap-3"><Link href="#components">Default link</Link><Link href="#components" variant="muted">Muted link</Link><Link href="https://example.com" external>External link</Link></div>`,
    <div className="flex flex-wrap items-center justify-center gap-3"><R.Link href="#components">Default link</R.Link><R.Link href="#components" variant="muted">Muted link</R.Link><R.Link href="https://example.com" external>External link</R.Link></div>,
    api(["href", "string", "Native link destination."], ["variant", '"default" | "muted" | "underline"', "Visual treatment.", '"default"'], ["external", "boolean", "Adds external-link behavior and icon."], ["className", "string", "Composes anchor styles."]),
    "Renders a native anchor; link text should describe its destination.",
  ),
  "components/list": () => detail(
    `<List>
  <ListItem href="#/components" icon={<Box size={15} />} trailing={<Badge size="sm">3</Badge>}>Components</ListItem>
  <ListItem href="#/foundations/colors" icon={<Settings size={15} />} description="Theme tokens and palettes">Colors</ListItem>
</List>`,
    <R.List className="w-full max-w-sm"><R.ListItem href="#/components" icon={<Box size={15} />} trailing={<R.Badge size="sm">3</R.Badge>}>Components</R.ListItem><R.ListItem href="#/foundations/colors" icon={<Settings size={15} />} description="Theme tokens and palettes">Colors</R.ListItem></R.List>,
    api(["divided", "boolean", "Shows separators between items.", "true"], ["icon", "ReactNode", "ListItem leading icon."], ["description", "ReactNode", "ListItem supporting text."], ["trailing", "ReactNode", "ListItem trailing content."], ["href", "string", "Renders the item as a link."]),
    "Uses list semantics; linked items render anchors and interactive items preserve keyboard behavior.",
  ),
  "components/timeline": () => detail(
    `<Timeline className="w-full max-w-md" events={[{ id: "1", title: "Deployed to production", description: "api-gateway v2.4.1 is live", timestamp: "2m ago", variant: "success" }, { id: "2", title: "Build completed", timestamp: "4m ago", variant: "info" }, { id: "3", title: "Deploy triggered", timestamp: "6m ago" }]} />`,
    <R.Timeline className="w-full max-w-md" events={[{ id: "1", title: "Deployed to production", description: "api-gateway v2.4.1 is live", timestamp: "2m ago", variant: "success" }, { id: "2", title: "Build completed", timestamp: "4m ago", variant: "info" }, { id: "3", title: "Deploy triggered", timestamp: "6m ago" }]} />,
    api(["events", "TimelineEvent[]", "Ordered event data."], ["title", "ReactNode", "Event heading."], ["description", "ReactNode", "Optional event details."], ["timestamp", "ReactNode", "Event time label."], ["variant", "TimelineVariant", "Semantic marker treatment."]),
    "Events remain in meaningful DOM order; include text for event state and time.",
  ),
  "components/tree": () => detail(
    `function SourceTree() {
  const [selected, setSelected] = useState("button")
  return (
    <Tree
      selected={selected}
      onSelect={setSelected}
      defaultExpanded={["src", "components"]}
      nodes={[
        { id: "src", label: "src", children: [
          { id: "components", label: "components", children: [
            { id: "button", label: "button.tsx" },
            { id: "modal", label: "modal.tsx" },
          ] },
          { id: "index", label: "index.ts" },
        ] },
      ]}
    />
  )
}`,
    <TreePreview />,
    api(["nodes", "TreeNode[]", "Hierarchical node data."], ["selected / defaultSelected", "string", "Controlled or initial selected node ID."], ["onSelect", "(id: string) => void", "Node selection callback."], ["expanded / defaultExpanded", "string[]", "Controlled or initial expanded node IDs."], ["onExpandedChange", "(ids: string[]) => void", "Called with the next expanded node IDs."], ["disabled", "boolean", "Disables every node.", "false"], ["nodeClassName", "string", "Styles each node row."]),
    "Follows the WAI-ARIA tree pattern: role=tree with treeitems that expose level, expanded and selected state. One roving tab stop; Arrow Up/Down move between visible items, Right/Left expand or collapse, Home/End jump, Enter/Space select. Disabled items are skipped.",
  ),
  "components/snackbar": () => detail(
    `<SnackbarProvider>\n  <App />\n</SnackbarProvider>\n\nconst { show } = useSnackbar()\nshow({ message: "Deployed", variant: "success" })`,
    <SnackbarPreview />,
    api(["position", "SnackbarPosition", "Viewport placement.", '"bottom-right"'], ["maxVisible", "number", "Maximum simultaneous toasts.", "5"], ["show", "(options) => string", "Displays a toast and returns its ID."], ["dismiss / dismissAll", "functions", "Removes one or all toasts."]),
    "Toasts use live-region semantics, include named dismiss controls, and can remain persistent when duration is zero.",
  ),
  "components/spinner": () => detail(
    `<div className="flex flex-wrap items-center justify-center gap-3"><Spinner size="xs" /><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" /><span>Loading deployments…</span></div>`,
    <div className="flex flex-wrap items-center justify-center gap-3"><R.Spinner size="xs" /><R.Spinner size="sm" /><R.Spinner size="md" /><R.Spinner size="lg" /><span>Loading deployments…</span></div>,
    api(["size", '"xs" | "sm" | "md" | "lg"', "Indicator size.", '"md"'], ["className", "string", "Composes color and layout styles."]),
    "Pair the decorative spinner with visible text or an accessible busy label on its containing region.",
  ),
  "components/empty-state": () => detail(
    `<EmptyState icon={<Database />} title="No databases yet" description="Create a database to store application data." action={<Button>Create database</Button>} />`,
    <R.EmptyState icon={<Database />} title="No databases yet" description="Create a database to store application data." action={<R.Button>Create database</R.Button>} />,
    api(["title", "string", "Empty-state heading."], ["description", "string", "Explanation or guidance."], ["icon", "ReactNode", "Decorative illustration."], ["action", "ReactNode", "Primary next action."], ["size", '"sm" | "md" | "lg"', "Empty-state spacing.", '"md"']),
    "Use a specific title and action label; decorative icons should not carry unique meaning.",
  ),
  "components/error-state": () => detail(
    `function DeploymentsError() {
  const [retries, setRetries] = useState(0)
  return (
    <ErrorState
      title="Failed to load deployments"
      description={retries ? \`Still unreachable after \${retries} \${retries === 1 ? "retry" : "retries"}.\` : "The API could not be reached."}
      error="connect ECONNREFUSED"
      onRetry={() => setRetries(retries + 1)}
    />
  )
}`,
    <ErrorStateUsagePreview />,
    api(["title", "string", "Error heading."], ["description", "string", "Recovery guidance."], ["error", "string | Error", "Optional diagnostic detail."], ["onRetry", "() => void", "Displays and handles a retry action."], ["action", "ReactNode", "Additional recovery action."]),
    "The root uses role=alert and retry is a named native button.",
  ),
  "components/confirm-dialog": () => detail(
    `function DeleteEnvironment() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="danger" icon={<Trash2 size={15} />} onClick={() => setOpen(true)}>Delete environment</Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Delete production environment?"
        description="This permanently removes its containers and volumes."
        confirmLabel="Delete environment"
        destructive
      />
    </>
  )
}`,
    <ConfirmPreview />,
    api(["open", "boolean", "Controls dialog presence."], ["onClose", "() => void", "Dismiss callback."], ["onConfirm", "() => void", "Confirmation callback."], ["destructive", "boolean", "Uses destructive confirmation styling."], ["loading", "boolean", "Shows pending confirmation state."]),
    "Built on the modal focus trap with dialog labeling, Escape handling, scroll lock, and focus restoration.",
  ),
  "components/popover": () => detail(
    `<Popover trigger={<Button variant="secondary">Filter options</Button>} side="bottom"><PopoverContent className="w-64"><p className="mb-3 text-sm font-semibold">Status</p><div className="grid gap-4"><Checkbox label="Healthy" defaultChecked /><Checkbox label="Building" /></div></PopoverContent></Popover>`,
    <R.Popover trigger={<R.Button variant="secondary">Filter options</R.Button>} side="bottom"><R.PopoverContent className="w-64"><p className="mb-3 text-sm font-semibold">Status</p><div className="grid gap-4"><R.Checkbox label="Healthy" defaultChecked /><R.Checkbox label="Building" /></div></R.PopoverContent></R.Popover>,
    api(["trigger", "ReactNode", "Element that toggles the panel."], ["open / defaultOpen", "boolean", "Controlled or initial open state."], ["onOpenChange", "(open: boolean) => void", "Open-state callback."], ["side", '"top" | "right" | "bottom" | "left"', "Preferred placement.", '"bottom"'], ["align", '"start" | "center" | "end"', "Cross-axis alignment.", '"center"']),
    "The trigger exposes expanded state; Escape and outside pointer interaction dismiss the panel.",
  ),
  "components/command": () => detail(
    `function CommandTrigger() {
  const { setOpen } = useCommand()
  return <Button onClick={() => setOpen(true)}>Open command palette</Button>
}

function App() {
  return (
    <CommandProvider>
      <CommandTrigger />
      <CommandPalette
        items={[
          { id: "projects", label: "Open projects", group: "Navigation", icon: <Box size={15} />, onSelect: () => {} },
          { id: "settings", label: "Open settings", group: "Navigation", icon: <Settings size={15} />, onSelect: () => {} },
        ]}
      />
    </CommandProvider>
  )
}`,
    <CommandPreview />,
    api(["items", "CommandItem[]", "Searchable commands and groups."], ["shortcut", "string", "Modifier-key shortcut.", '"k"'], ["CommandProvider open / defaultOpen", "boolean", "Controlled or initial palette state."], ["CommandProvider onOpenChange", "(open: boolean) => void", "Called when the palette requests to open or close."], ["placeholder", "string", "Search input placeholder."], ["ariaLabel", "string", "Accessible dialog name.", '"Command palette"']),
    "The palette is a labeled modal dialog with a focus trap, searchable listbox behavior, arrow navigation, Escape dismissal, and focus restoration.",
  ),
  "components/breadcrumb": () => detail(
    `<Breadcrumb
  items={[
    { label: "Docs", href: "#/docs/introduction" },
    { label: "Components", href: "#/components" },
    { label: "Breadcrumb" },
  ]}
/>`,
    <R.Breadcrumb items={[{ label: "Docs", href: "#/docs/introduction" }, { label: "Components", href: "#/components" }, { label: "Breadcrumb" }]} />,
    api(["items", "BreadcrumbItem[]", "Ordered hierarchy items."], ["separator", "ReactNode", "Custom visual separator."], ["maxItems", "number", "Collapses middle items into an accessible \u201c\u2026\u201d beyond this count."], ["itemClassName / linkClassName / currentClassName / separatorClassName", "string", "Style each part."], ["className", "string", "Composes navigation styles."]),
    "Renders a named navigation landmark; the final item exposes aria-current=page.",
  ),
  "components/stepper": () => detail(
    `<Stepper className="w-full max-w-lg" current={1} steps={[{ label: "Configure", description: "Service settings" }, { label: "Review", description: "Confirm changes" }, { label: "Deploy", description: "Release service" }]} />`,
    <R.Stepper className="w-full max-w-lg" current={1} steps={[{ label: "Configure", description: "Service settings" }, { label: "Review", description: "Confirm changes" }, { label: "Deploy", description: "Release service" }]} />,
    api(["steps", "StepperStep[]", "Ordered workflow steps; a step can be disabled."], ["current", "number", "Zero-based current step."], ["orientation", '"horizontal" | "vertical"', "Layout direction.", '"horizontal"'], ["onStepClick", "(index: number) => void", "Makes steps clickable buttons."], ["clickable", '"completed" | "all"', "Which steps are clickable.", '"completed"'], ["disabled", "boolean", "Disables every step click target.", "false"], ["stepClassName / indicatorClassName / labelClassName / connectorClassName", "string", "Style each part."]),
    "Renders an ordered list; the current step has aria-current=\"step\" and every step announces completed, current or upcoming, so state never relies on color alone. Clickable steps are native buttons.",
  ),
  "components/navigation": () => detail(
    `function AppNavbar() {
  const [active, setActive] = useState("overview")
  const items: NavigationItem[] = [
    { id: "overview", label: "Overview", icon: <Home size={15} /> },
    { id: "projects", label: "Projects", icon: <Box size={15} /> },
    { id: "activity", label: "Activity", icon: <Activity size={15} /> },
  ]
  return (
    <Navbar items={items} activeId={active} onSelect={setActive}>
      <BrandLink href="/" mark={<img src="/logo.svg" alt="" />}>@bzync/rui</BrandLink>
    </Navbar>
  )
}`,
    <NavigationPreview />,
    api(["items", "NavigationItem[]", "Links with IDs, labels, hrefs, icons, and badges."], ["activeId", "string", "Current navigation item ID."], ["onSelect", "(id: string) => void", "Selection callback."], ["header / footer", "ReactNode", "Sidebar composition slots."], ["BottomBar variant", '"bar" | "floating"', "Full-width bar or detached floating pill.", '"bar"'], ["BottomBar indicator", '"pill" | "line" | "dot" | "none"', "Active tab marker.", '"pill"'], ["BottomBar labels", '"always" | "active" | "hidden"', "Label visibility; hidden labels remain accessible names.", '"always"'], ["BottomBar centerAction / fixed", "ReactNode / boolean", "Raised middle action; pin to the viewport bottom with safe-area padding."]),
    "Navigation primitives use native landmarks and anchors, with aria-current on the active destination.",
  ),
  "components/table": () => detail(
    `const [expanded, setExpanded] = useState<number | null>(1)\n\n<Table aria-label="Services with deployment details">\n  <TableHeader>...</TableHeader>\n  <TableBody>\n    {services.map((service) => (\n      <Fragment key={service.id}>\n        <TableRow>\n          <TableCell>\n            <Button\n              variant="ghost"\n              size="icon"\n              aria-expanded={expanded === service.id}\n              aria-controls={\`service-\${service.id}-details\`}\n              onClick={() => setExpanded(expanded === service.id ? null : service.id)}\n            >\n              <ChevronRight />\n            </Button>\n          </TableCell>\n          <TableCell>{service.name}</TableCell>\n          <TableCell>{service.status}</TableCell>\n        </TableRow>\n        {expanded === service.id && (\n          <TableRow id={\`service-\${service.id}-details\`}>\n            <TableCell colSpan={3}>Deployment details</TableCell>\n          </TableRow>\n        )}\n      </Fragment>\n    ))}\n  </TableBody>\n</Table>`,
    <TablePreview />,
    api(["containerClassName", "string", "Composes styles on the bordered container."], ["scrollAreaClassName", "string", "Composes styles on the horizontal scroll area."], ["density", '"compact" | "comfortable"', "Controls cell spacing.", '"comfortable"'], ["className", "string", "Composes table styles."]),
    "Expandable rows use a native button with aria-expanded and aria-controls; the detail content is rendered as an adjacent table row.",
  ),
  "components/data-table": () => detail(
    `const services = [
  { id: 1, name: "api-gateway", status: "Healthy", region: "us-east-1" },
  { id: 2, name: "worker", status: "Building", region: "eu-west-1" },
  { id: 3, name: "web", status: "Healthy", region: "ap-south-1" },
]

const columns: ColumnDef<(typeof services)[number]>[] = [
  { key: "name", header: "Service", sortable: true, searchable: true, cell: (row) => row.name },
  { key: "status", header: "Status", sortable: true, cell: (row) => <Badge variant={row.status === "Healthy" ? "success" : "warning"}>{row.status}</Badge> },
  { key: "region", header: "Region", searchable: true, cell: (row) => row.region },
]

<DataTable ariaLabel="Services" columns={columns} data={services} searchable searchPlaceholder="Search services…" pageSizeOptions={false} />`,
    <div className="w-full"><R.DataTable ariaLabel="Services" columns={tableColumns} data={tableRows} searchable searchPlaceholder="Search services…" pageSizeOptions={false} /></div>,
    api(["columns", "ColumnDef<T>[]", "Column definitions, cells, sort, and search settings."], ["data", "T[]", "Rows with stable IDs."], ["searchable", "boolean", "Displays the search field."], ["loading", "boolean", "Displays table skeletons."], ["pageSizeOptions", "number[] | false", "Page-size selector values or disabled state."], ["selectable / selectedIds / defaultSelectedIds / onSelectionChange", 'boolean | "single" | "multiple"', "Checkbox column with select-all (across search results); controlled or uncontrolled."], ["isRowSelectable", "(row) => boolean", "Locks rows from selection."], ["bulkActions", "(rows, clear) => ReactNode", "Bar shown while rows are selected."], ["columnToggle / hiddenColumns / defaultHiddenColumns", "boolean / string[]", "Columns menu and visible-column state."], ["resizableColumns / onColumnResize", "boolean", "Drag or arrow-key column resizing."], ["ColumnDef.pinned", '"left" | "right"', "Sticky column while scrolling horizontally."], ["ColumnDef.sortValue / filterValue", "(row) => value", "Typed sorting and search text."], ["manual + rowCount", "boolean / number", "Server-side mode: the table reports sort, query, page and pageSize changes and renders data as given."], ["sort / query / page / pageSize (+ on…Change)", "controlled state", "Control any part of the table state."], ["virtualized", "{ height, rowHeight, overscan? }", "Renders only visible rows for very large data."], ["headerClassName / cellClassName", "string", "Style the header row group and every body cell."], ["rowClassName", "string | (row) => string", "Styles body rows; the function form enables conditional styling."], ["ColumnDef.className / headerClassName", "string", "Per-column cell and header styles."]),
    "Provides a named native table, labeled search control, sortable headers, and keyboard-operable pagination.",
  ),
  "components/dev-mode": () => detail(
    `function App() {
  const [enabled, setEnabled] = useState(false)
  return (
    <>
      <Button onClick={() => setEnabled(!enabled)}>{enabled ? "Hide DevMode" : "Show DevMode"}</Button>
      <DevMode enabled={enabled} />
    </>
  )
}

// In a real app, gate it to development:
<DevMode enabled={import.meta.env.DEV} />`,
    <DevModePreview />,
    api(["enabled", "boolean", "Renders nothing when false; gate it with import.meta.env.DEV or similar.", "true"], ["defaultPosition", '"top-left" | "top-right" | "bottom-left" | "bottom-right"', "Initial corner; the move button cycles corners.", '"bottom-left"'], ["breakpoints", "Record<string, number>", "Named min-width breakpoints in px.", "Tailwind sm–2xl"], ["defaultCollapsed", "boolean", "Start collapsed to the breakpoint pill.", "false"], ["hotkey", "string | false", "Ctrl/⌘ + Shift + key toggles visibility.", '"d"'], ["floating", "boolean", "Fixed to a viewport corner; false renders inline.", "true"], ["storageKey", "string | false", "localStorage key remembering position, collapsed/hidden state and active tools across reloads; false disables.", '"rui-devmode"'], ["resolveBreakpoint(width, breakpoints?)", "function", "Exported helper returning the active breakpoint name for a width."]),
    "Tools: Inspect spacing (hover any element to see its margin, border, padding and content as colour bands with exact values; Escape exits) and Outline layout boxes. A labelled region with named buttons (toggles expose aria-pressed). It does not announce size changes, to avoid live-region noise while resizing. It renders after hydration only, so server and client markup match.",
  ),
  "components/context-menu": () => detail(
    `function FileRow() {
  const [last, setLast] = useState("Right-click the file (or focus it and press Shift+F10)")
  return (
    <div className="grid w-full max-w-sm gap-3">
      <ContextMenu
        items={[
          { label: "Open", shortcut: "↵", onClick: () => setLast("Opened report.pdf") },
          { label: "Rename", shortcut: "F2", onClick: () => setLast("Renaming report.pdf") },
          { label: "Duplicate", onClick: () => setLast("Duplicated report.pdf") },
          { group: "Danger zone", items: [{ label: "Delete", destructive: true, onClick: () => setLast("Deleted report.pdf") }] },
        ]}
      >
        <button type="button" className="flex w-full items-center gap-3 rounded-lg border border-dashed border-border-strong bg-surface p-4 text-left text-sm">
          <FileText size={18} aria-hidden="true" />
          report.pdf
        </button>
      </ContextMenu>
      <span className="text-sm text-muted-foreground" role="status">{last}</span>
    </div>
  )
}`,
    <ContextMenuUsagePreview />,
    api(["items", "DropdownMenuSection[]", "Same item model as DropdownMenu: label, icon, shortcut, destructive, disabled, groups."], ["children", "ReactNode", "The region that opens the menu."], ["disabled", "boolean", "Shows the browser menu instead.", "false"], ["onOpenChange", "(open) => void", "Open-state callback."], ["ariaLabel / menuClassName", "string", "Menu name and styling."]),
    "Opens at the pointer on right-click, and from the keyboard with Shift+F10 or the ContextMenu key at the focused element. Focus moves to the first item; arrows, Home and End navigate; Escape, Tab or a selection closes it and returns focus to the right-clicked control. Scrolling or resizing closes it.",
  ),
  "components/menubar": () => detail(
    `function EditorMenus() {
  const [last, setLast] = useState("Use the arrow keys between menus")
  return (
    <div className="grid gap-3">
      <Menubar
        menus={[
          { label: "File", items: [{ label: "New file", shortcut: "⌘N", onClick: () => setLast("New file") }, { label: "Save", shortcut: "⌘S", onClick: () => setLast("Saved") }] },
          { label: "Edit", items: [{ label: "Undo", shortcut: "⌘Z", onClick: () => setLast("Undo") }, { label: "Redo", shortcut: "⇧⌘Z", onClick: () => setLast("Redo") }] },
          { label: "View", items: [{ label: "Zoom in", shortcut: "⌘+", onClick: () => setLast("Zoomed in") }, { label: "Zoom out", shortcut: "⌘-", onClick: () => setLast("Zoomed out") }] },
          { label: "Help", disabled: true, items: [] },
        ]}
      />
      <span className="text-sm text-muted-foreground" role="status">{last}</span>
    </div>
  )
}`,
    <MenubarUsagePreview />,
    api(["menus", "{ label; items; disabled? }[]", "Top-level menus with DropdownMenu-style items."], ["ariaLabel", "string", "Name of the bar.", '"Menu bar"'], ["triggerClassName / menuClassName", "string", "Style the top-level buttons and the menus."]),
    "Implements the WAI-ARIA menubar pattern: a single tab stop; Left/Right move between menus; Down, Enter or Space open one; while a menu is open Left/Right switch to the neighbouring menu and hovering another trigger switches too; Escape returns focus to the bar. Disabled menus are skipped.",
  ),
  "components/sheet": () => detail(
    `function FiltersSheet() {
  const [open, setOpen] = useState(false)
  const [snap, setSnap] = useState(0)
  const labels = ["Peek", "Half", "Full"]
  return (
    <div className="grid justify-items-center gap-3">
      <Button onClick={() => setOpen(true)}>Show filters</Button>
      <span className="text-sm text-muted-foreground" role="status">{open ? \`Resting at: \${labels[snap]}\` : "Drag the handle, or focus it and use ↑ ↓"}</span>
      <Sheet open={open} onOpenChange={setOpen} snapPoints={[0.35, 0.6, 0.92]} snap={snap} onSnapChange={setSnap} title="Filters" description="128 results">
        <div className="grid gap-5 p-5">
          <div className="grid gap-3">
            <p className="text-sm font-medium">Status</p>
            <Checkbox label="Active" defaultChecked />
            <Checkbox label="Paused" />
            <Checkbox label="Archived" />
          </div>
          <Slider label="Max price" defaultValue={60} />
          <Button onClick={() => setOpen(false)}>Show 128 results</Button>
        </div>
      </Sheet>
    </div>
  )
}`,
    <SheetUsagePreview />,
    api(["open / onOpenChange", "boolean / (open) => void", "Controlled visibility."], ["snapPoints", "number[]", "Rest heights, smallest first: ≤ 1 is a fraction of the viewport, larger is pixels.", "[0.5, 0.92]"], ["snap / defaultSnap / onSnapChange", "number", "Controlled or initial snap index.", "0"], ["title / description", "ReactNode", "Header; also names and describes the dialog."], ["modal", "boolean", "Overlay, focus trap and scroll lock. Off for a persistent sheet.", "true"], ["dismissible", "boolean", "Allow closing by dragging down, Escape, the overlay and the close button.", "true"], ["showCloseButton", "boolean", "Shows the header close button.", "true"], ["className / overlayClassName / headerClassName / contentClassName / handleClassName", "string", "Part styling."]),
    "Drag the handle or header between snap points; a quick flick moves to the next one and dragging below the lowest point dismisses. The handle is a real button: click or Enter cycles the snap points, Arrow Up/Down step through them (Down at the lowest point closes). Modal sheets trap focus and restore it on close; the content scrolls within the visible height.",
  ),
  "components/hover-card": () => detail(
    `<p className="max-w-md text-sm leading-6 text-muted-foreground">
  Reviewed by{" "}
  <HoverCard
    content={
      <div className="flex gap-3">
        <Avatar name="Ada Lovelace" size="lg" />
        <div className="grid gap-1">
          <p className="font-semibold">Ada Lovelace</p>
          <p className="text-muted-foreground">@ada · Staff engineer, Platform</p>
          <p className="text-muted-foreground">Joined March 2021 · 1.2k commits</p>
          <a href="#/components/avatar" className="font-medium text-accent-strong underline underline-offset-4">View profile</a>
        </div>
      </div>
    }
  >
    <a href="#/components/hover-card" className="font-medium text-foreground underline decoration-dotted underline-offset-4">@ada</a>
  </HoverCard>{" "}
  and merged into main two hours ago.
</p>`,
    <p className="max-w-md text-sm leading-6 text-muted-foreground">
  Reviewed by{" "}
  <R.HoverCard
    content={
      <div className="flex gap-3">
        <R.Avatar name="Ada Lovelace" size="lg" />
        <div className="grid gap-1">
          <p className="font-semibold">Ada Lovelace</p>
          <p className="text-muted-foreground">@ada · Staff engineer, Platform</p>
          <p className="text-muted-foreground">Joined March 2021 · 1.2k commits</p>
          <a href="#/components/avatar" className="font-medium text-accent-strong underline underline-offset-4">View profile</a>
        </div>
      </div>
    }
  >
    <a href="#/components/hover-card" className="font-medium text-foreground underline decoration-dotted underline-offset-4">@ada</a>
  </R.HoverCard>{" "}
  and merged into main two hours ago.
</p>,
    api(["content", "ReactNode", "The card body."], ["children", "ReactElement", "The trigger; hover and focus handlers are merged onto it."], ["side / align", "\"top\" | \"bottom\" | \"left\" | \"right\" / \"start\" | \"center\" | \"end\"", "Preferred placement; flips and clamps to the viewport.", "\"bottom\" / \"center\""], ["openDelay / closeDelay", "number", "Delays in ms.", "500 / 200"], ["open / defaultOpen / onOpenChange", "boolean", "Controlled or initial visibility."], ["width", "number | string", "Card width.", "\"18rem\""], ["className / wrapperClassName", "string", "Card and wrapper styling."]),
    "Opens after a short delay on hover or keyboard focus and closes on blur, pointer leave or Escape. Unlike Tooltip the card is interactive: moving the pointer onto it keeps it open. The trigger references the card with aria-describedby while it is open. Treat the card as a preview; anything essential should also be reachable without hovering.",
  ),
  "components/banner": () => detail(
    `<div className="w-full overflow-hidden rounded-xl border border-border bg-bg">
  <Banner variant="solid" tone="info" centered dismissible title="RUI 1.0 is here" action={<a href="#/docs/introduction">Read the announcement</a>}>
    Resizable panels, sheets and hover cards.
  </Banner>
  <Banner tone="warning" icon={<Wrench />} action={<a href="#/components/banner">Status page</a>}>
    Scheduled maintenance on Saturday from 02:00 to 03:00 UTC. Deploys are paused.
  </Banner>
  <div className="grid h-32 place-items-center text-sm text-muted-foreground">Your app</div>
</div>`,
    <div className="w-full overflow-hidden rounded-xl border border-border bg-bg">
  <R.Banner variant="solid" tone="info" centered dismissible title="RUI 1.0 is here" action={<a href="#/docs/introduction">Read the announcement</a>}>
    Resizable panels, sheets and hover cards.
  </R.Banner>
  <R.Banner tone="warning" icon={<Wrench />} action={<a href="#/components/banner">Status page</a>}>
    Scheduled maintenance on Saturday from 02:00 to 03:00 UTC. Deploys are paused.
  </R.Banner>
  <div className="grid h-32 place-items-center text-sm text-muted-foreground">Your app</div>
</div>,
    api(["tone", "\"default\" | \"info\" | \"success\" | \"warning\" | \"danger\"", "Color and live-region role (warning and danger are alerts).", "\"default\""], ["variant", "\"subtle\" | \"solid\"", "Tinted strip or filled high-priority strip.", "\"subtle\""], ["title / children", "ReactNode", "Bold lead-in and message."], ["icon / action", "ReactNode", "Leading icon and trailing call to action."], ["dismissible / onDismiss", "boolean / () => void", "Shows a dismiss button."], ["storageKey", "string", "Remembers the dismissal in localStorage."], ["sticky", "boolean", "Sticks to the top of the scroll container.", "false"], ["centered", "boolean", "Centers the content.", "false"], ["dismissAriaLabel / contentClassName", "string", "Dismiss label and inner row styling."]),
    "Warning and danger banners render with role=\"alert\"; other tones use role=\"status\" so they are announced politely. The dismiss button has an accessible label, and storageKey keeps a dismissed banner hidden on later visits (read after mount, so server rendering stays consistent).",
  ),
  "components/navigation-menu": () => detail(
    `<div className="w-full rounded-xl border border-border bg-surface px-3 py-2">
  <NavigationMenu
    items={[
      {
        label: "Products",
        links: [
          { label: "Analytics", href: "#/components/charts", description: "Dashboards and reports for every team.", icon: <BarChart3 /> },
          { label: "Database", href: "#/components/datatable", description: "Managed Postgres with branching.", icon: <Database /> },
          { label: "Automation", href: "#/components/command", description: "Workflows triggered by events.", icon: <Rocket /> },
          { label: "Security", href: "#/docs/accessibility", description: "SSO, audit logs and roles.", icon: <Settings /> },
        ],
      },
      {
        label: "Resources",
        columns: 1,
        links: [
          { label: "Documentation", href: "#/docs/introduction" },
          { label: "Examples", href: "#/examples" },
        ],
        content: <p className="m-1 mt-2 rounded-md bg-surface-muted p-3 text-sm text-muted-foreground">New: theming guide for multi-brand apps.</p>,
      },
      { label: "Pricing", href: "#/components/navigation-menu", active: true },
    ]}
  />
</div>`,
    <div className="w-full rounded-xl border border-border bg-surface px-3 py-2">
  <R.NavigationMenu
    items={[
      {
        label: "Products",
        links: [
          { label: "Analytics", href: "#/components/charts", description: "Dashboards and reports for every team.", icon: <BarChart3 /> },
          { label: "Database", href: "#/components/datatable", description: "Managed Postgres with branching.", icon: <Database /> },
          { label: "Automation", href: "#/components/command", description: "Workflows triggered by events.", icon: <Rocket /> },
          { label: "Security", href: "#/docs/accessibility", description: "SSO, audit logs and roles.", icon: <Settings /> },
        ],
      },
      {
        label: "Resources",
        columns: 1,
        links: [
          { label: "Documentation", href: "#/docs/introduction" },
          { label: "Examples", href: "#/examples" },
        ],
        content: <p className="m-1 mt-2 rounded-md bg-surface-muted p-3 text-sm text-muted-foreground">New: theming guide for multi-brand apps.</p>,
      },
      { label: "Pricing", href: "#/components/navigation-menu", active: true },
    ]}
  />
</div>,
    api(["items", "NavigationMenuItem[]", "Top-level entries: a plain href, or a panel with links and/or content."], ["items[].links", "{ label; href; description?; icon? }[]", "Panel links in a responsive grid."], ["items[].content / columns", "ReactNode / 1 | 2 | 3", "Custom panel content and grid columns.", "— / 2"], ["items[].active", "boolean", "Marks the current section (aria-current on links)."], ["openDelay / closeDelay", "number", "Hover delays in ms.", "120 / 200"], ["ariaLabel / triggerClassName / panelClassName", "string", "Landmark name and part styling.", "\"Main\""]),
    "Follows the disclosure navigation pattern: each trigger is a button with aria-expanded and aria-controls, and its panel comes next in the tab order. Click, Enter or Space toggles a panel; Arrow Down opens it and focuses the first link; Up/Down move between links; Left/Right move between top-level items (opening the neighbour if a panel is open); Escape closes and returns focus. Clicking outside or tabbing out closes it.",
  ),
  "components/password-input": () => detail(
    `function SignUpPassword() {
  const [password, setPassword] = useState("")
  return (
    <div className="w-full max-w-sm">
      <PasswordInput
        label="Create a password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        showStrength
        requirements={[
          { label: "At least 12 characters", test: (p) => p.length >= 12 },
          { label: "Upper and lower case letters", test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
          { label: "A number or symbol", test: (p) => /[\\d\\W]/.test(p) },
        ]}
      />
    </div>
  )
}`,
    <PasswordInputUsagePreview />,
    api(["showStrength", "boolean", "Four-step strength meter with a text label.", "false"], ["strength", "(password) => 0–4", "Custom scorer; the default checks length, case, digits and symbols.", "scorePassword"], ["strengthLabels", "[string × 5]", "Labels for levels 0–4.", "\"Too weak\" … \"Strong\""], ["requirements", "{ label; test }[]", "Checklist ticked as each rule passes."], ["visible / defaultVisible / onVisibleChange", "boolean", "Controlled or initial visibility.", "false"], ["showLabel / hideLabel", "string", "Toggle button labels.", "\"Show password\" / \"Hide password\""], ["…InputProps", "", "label, hint, error, size, value, onChange and every native input attribute."]),
    "The toggle is a button with aria-pressed and a label that names the action; it keeps focus in place. The meter and checklist are linked with aria-describedby, the strength label is announced politely, and each requirement reads as met or not met. autocomplete defaults to new-password when the meter or checklist is shown, otherwise current-password.",
  ),
  "components/search-input": () => detail(
    `function DocsSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const pages = ["Button", "Banner", "Badge", "Breadcrumb", "Calendar", "Card", "Checkbox", "Sheet", "Sidebar", "Slider"]
  return (
    <div className="grid w-full max-w-sm gap-3">
      <SearchInput
        aria-label="Search components"
        placeholder="Search components…"
        shortcut="f"
        value={query}
        onValueChange={(value) => { setQuery(value); setLoading(Boolean(value)) }}
        onSearch={(value) => { setResults(value ? pages.filter((page) => page.toLowerCase().includes(value.toLowerCase())) : []); setLoading(false) }}
        loading={loading}
      />
      <p className="text-sm text-muted-foreground" role="status">
        {query && !loading ? \`\${results.length} result\${results.length === 1 ? "" : "s"}: \${results.join(", ") || "none"}\` : "Press F to focus, type, then Escape to clear"}
      </p>
    </div>
  )
}`,
    <SearchInputUsagePreview />,
    api(["value / defaultValue / onValueChange", "string", "Controlled or initial text; called on every keystroke."], ["onSearch", "(value) => void", "Debounced search; fires immediately on Enter and clear."], ["debounceMs", "number", "Debounce delay.", "250"], ["shortcut", "string", "Global focus shortcut such as \"/\" or \"mod+k\"; shown as a key hint."], ["loading", "boolean", "Replaces the search icon with a spinner.", "false"], ["clearLabel", "string", "Clear button label.", "\"Clear search\""], ["…InputProps", "", "label, hint, error, size and native input attributes."]),
    "Renders a native search input with role=searchbox. The clear button has an accessible label and returns focus to the field; Escape clears when there is text. The shortcut is exposed through aria-keyshortcuts, and bare-key shortcuts like \"/\" are ignored while typing in another field.",
  ),
  "components/masked-input": () => detail(
    `function CheckoutFields() {
  const [amount, setAmount] = useState<number | null>(1250)
  const [phone, setPhone] = useState("")
  const [card, setCard] = useState({ raw: "", complete: false })
  return (
    <div className="grid w-full max-w-sm gap-4">
      <CurrencyInput label="Amount" currency="USD" value={amount} onValueChange={setAmount} max={100000} hint={amount === null ? "Enter an amount" : \`Value: \${amount}\`} />
      <PhoneInput label="Mobile number" defaultCountry="US" onValueChange={(_, e164) => setPhone(e164)} hint={phone ? \`E.164: \${phone}\` : "We'll text a receipt"} />
      <MaskedInput label="Card number" mask="9999 9999 9999 9999" onValueChange={(raw, _, complete) => setCard({ raw, complete })} error={card.raw && !card.complete ? "Enter all 16 digits" : undefined} />
    </div>
  )
}`,
    <MaskedInputUsagePreview />,
    api(["MaskedInput mask", "string", "9 = digit, a = letter, * = either; other characters are literals."], ["MaskedInput value / onValueChange", "string / (raw, formatted, complete) => void", "Raw slot characters without literals."], ["CurrencyInput value / onValueChange", "number | null", "Plain number; null when empty."], ["CurrencyInput currency / locale / decimals", "string / string / number", "Symbol, grouping and fraction digits from Intl.", "\"USD\" / runtime / currency default"], ["CurrencyInput min / max / allowNegative / hideSymbol", "number / number / boolean / boolean", "Clamped and rounded on blur."], ["PhoneInput value / onValueChange", "string / (digits, e164, complete) => void", "National digits plus the E.164 number."], ["PhoneInput country / defaultCountry / onCountryChange / countries", "string / PhoneCountry[]", "Country selector; masks per country.", "\"US\" / defaultPhoneCountries"], ["applyMask(mask, raw)", "function", "The formatter, for validation or display."]),
    "Formatting happens as you type while the caret stays where you are editing. Each field sets a suitable inputmode (numeric, decimal, tel) for mobile keyboards; PhoneInput's country selector is a labelled native select; CurrencyInput announces its currency with aria-description. Values are reported unformatted so they can be stored directly.",
  ),
  "components/area-chart": () => detail(
    `function TrafficChart() {
  const [stacked, setStacked] = useState(true)
  return (
    <div className="grid w-full gap-4">
      <ToggleGroup
        type="single"
        aria-label="Layout"
        value={stacked ? "stacked" : "overlap"}
        onValueChange={(value) => setStacked(value === "stacked")}
      >
        <ToggleGroupItem value="stacked">Stacked</ToggleGroupItem>
        <ToggleGroupItem value="overlap">Overlapping</ToggleGroupItem>
      </ToggleGroup>
      <AreaChart
        ariaLabel="Weekly visitors by channel"
        stacked={stacked}
        labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
        series={[
          { label: "Organic", data: [1200, 1350, 1280, 1510, 1620, 980, 870] },
          { label: "Paid", data: [640, 720, 810, 760, 900, 520, 460] },
          { label: "Referral", data: [210, 260, 240, 300, 280, 190, 170] },
        ]}
        formatValue={(value) => value.toLocaleString("en-US")}
      />
    </div>
  )
}`,
    <AreaChartUsagePreview />,
    api(["labels / series", "string[] / { label; data; color? }[]", "X-axis categories and named series in fixed color order."], ["stacked", "boolean", "Stack series to show the total and each share.", "false"], ["curve", "\"smooth\" | \"linear\"", "Line interpolation; smooth never overshoots the data.", "\"smooth\""], ["height / ticks / maxLabels", "number", "Plot height, y intervals and x label thinning.", "240 / 4 / 8"], ["formatValue", "(value) => string", "Axis, tooltip and table formatting."], ["ariaLabel / showLegend", "string / boolean", "Accessible summary and legend (shown for 2+ series).", "\"Area chart\" / true"]),
    "The plot is focusable: Left/Right, Home and End move a crosshair column by column and a polite live region reads every series at that point, while the tooltip shows the same values (plus the stack total). A visually hidden table carries all values, and the legend names every series so identity never depends on color alone.",
  ),
  "components/stacked-bar-chart": () => detail(
    `function RevenueMix() {
  const [mode, setMode] = useState<"stacked" | "percent" | "grouped">("stacked")
  return (
    <div className="grid w-full gap-4">
      <ToggleGroup
        type="single"
        aria-label="Mode"
        value={mode}
        onValueChange={(value) => setMode(value as typeof mode)}
      >
        <ToggleGroupItem value="stacked">Stacked</ToggleGroupItem>
        <ToggleGroupItem value="percent">100%</ToggleGroupItem>
        <ToggleGroupItem value="grouped">Grouped</ToggleGroupItem>
      </ToggleGroup>
      <StackedBarChart
        ariaLabel="Revenue by plan per quarter"
        mode={mode}
        labels={["Q1", "Q2", "Q3", "Q4"]}
        series={[
          { label: "Starter", data: [32, 38, 41, 45] },
          { label: "Team", data: [54, 61, 70, 82] },
          { label: "Enterprise", data: [40, 48, 66, 90] },
        ]}
        formatValue={(value) => \`$\${value}k\`}
      />
    </div>
  )
}`,
    <StackedBarUsagePreview />,
    api(["labels / series", "string[] / { label; data; color? }[]", "Categories and named series (values ≥ 0)."], ["mode", "\"stacked\" | \"percent\" | \"grouped\"", "Totals, shares of 100%, or side-by-side bars.", "\"stacked\""], ["height / ticks / maxLabels", "number", "Plot height, y intervals and label thinning.", "240 / 4 / 12"], ["formatValue", "(value) => string", "Axis, tooltip and table formatting."], ["ariaLabel / showLegend", "string / boolean", "Accessible summary and legend.", "\"Bar chart\" / true"]),
    "Segments are separated by a 2px gap and only the top of each stack is rounded. Hover a column or focus the chart and use the arrow keys; a live region reads every series in the column and the tooltip adds the total (and each share in 100% mode). A hidden data table lists all values.",
  ),
  "components/sparkline": () => detail(
    `<div className="w-full max-w-md divide-y divide-border rounded-xl border border-border bg-surface">
  {[
    { name: "api-gateway", latency: [120, 118, 131, 127, 140, 122, 115, 109], unit: "ms" },
    { name: "auth", latency: [42, 45, 41, 60, 58, 47, 44, 43], unit: "ms" },
    { name: "search", latency: [210, 190, 230, 205, 180, 170, 160, 150], unit: "ms" },
  ].map((service) => (
    <div key={service.name} className="flex items-center gap-4 px-4 py-3 text-sm">
      <span className="min-w-0 flex-1 truncate font-medium">{service.name}</span>
      <Sparkline data={service.latency} width={96} area showExtremes formatValue={(value) => \`\${value} \${service.unit}\`} />
      <span className="w-14 text-right tabular-nums text-muted-foreground">{service.latency.at(-1)} {service.unit}</span>
    </div>
  ))}
</div>`,
    <div className="w-full max-w-md divide-y divide-border rounded-xl border border-border bg-surface">
  {[
    { name: "api-gateway", latency: [120, 118, 131, 127, 140, 122, 115, 109], unit: "ms" },
    { name: "auth", latency: [42, 45, 41, 60, 58, 47, 44, 43], unit: "ms" },
    { name: "search", latency: [210, 190, 230, 205, 180, 170, 160, 150], unit: "ms" },
  ].map((service) => (
    <div key={service.name} className="flex items-center gap-4 px-4 py-3 text-sm">
      <span className="min-w-0 flex-1 truncate font-medium">{service.name}</span>
      <R.Sparkline data={service.latency} width={96} area showExtremes formatValue={(value) => `${value} ${service.unit}`} />
      <span className="w-14 text-right tabular-nums text-muted-foreground">{service.latency.at(-1)} {service.unit}</span>
    </div>
  ))}
</div>,
    api(["data", "number[]", "Values in order."], ["width / height", "number | string / number", "Size; the line stretches to the width.", "96 / 28"], ["type", "\"line\" | \"bar\"", "Line or bar strip.", "\"line\""], ["area / showLast / showExtremes", "boolean", "Fill, last-point dot and min/max dots.", "false / true / false"], ["reference", "number", "Dashed reference line, e.g. a target."], ["color", "string", "Stroke color.", "\"var(--chart-1)\""], ["ariaLabel / formatValue", "string / (value) => string", "Override or format the generated summary."]),
    "A sparkline has no axes, so it is an image named by a summary: first and last value, low and high (\"Trend from 120 ms to 109 ms; low 109 ms, high 140 ms.\"). Keep the exact current value as text next to it, as in the example.",
  ),
  "components/gauge": () => detail(
    `<div className="flex flex-wrap items-end justify-center gap-8">
  <Gauge label="CPU" value={38} caption="8 cores" formatValue={(value) => \`\${value}%\`} thresholds={[{ from: 0, tone: "success", label: "Healthy" }, { from: 70, tone: "warning", label: "Busy" }, { from: 90, tone: "danger", label: "Critical" }]} />
  <Gauge label="Storage" value={82} caption="410 of 500 GB" formatValue={(value) => \`\${value}%\`} thresholds={[{ from: 0, tone: "success", label: "OK" }, { from: 75, tone: "warning", label: "Filling up" }, { from: 95, tone: "danger", label: "Full" }]} />
  <Gauge label="NPS" variant="dial" value={47} min={-100} max={100} size={160} caption="Target 50" />
</div>`,
    <div className="flex flex-wrap items-end justify-center gap-8">
  <R.Gauge label="CPU" value={38} caption="8 cores" formatValue={(value) => `${value}%`} thresholds={[{ from: 0, tone: "success", label: "Healthy" }, { from: 70, tone: "warning", label: "Busy" }, { from: 90, tone: "danger", label: "Critical" }]} />
  <R.Gauge label="Storage" value={82} caption="410 of 500 GB" formatValue={(value) => `${value}%`} thresholds={[{ from: 0, tone: "success", label: "OK" }, { from: 75, tone: "warning", label: "Filling up" }, { from: 95, tone: "danger", label: "Full" }]} />
  <R.Gauge label="NPS" variant="dial" value={47} min={-100} max={100} size={160} caption="Target 50" />
</div>,
    api(["value / min / max", "number", "Value and range; values are clamped.", "— / 0 / 100"], ["label", "string", "Visible and accessible name."], ["thresholds", "{ from; tone; label? }[]", "Tone (and text) per range."], ["tone", "\"default\" | \"info\" | \"success\" | \"warning\" | \"danger\"", "Arc tone without thresholds.", "\"default\""], ["showBands", "boolean", "Faint threshold bands outside the track.", "true with thresholds"], ["variant / size", "\"half\" | \"dial\" / number", "180° or 270° sweep; width in px.", "\"half\" / 180"], ["valueLabel / formatValue / caption", "ReactNode / (value) => string / ReactNode", "Center text and supporting text."]),
    "Rendered as role=\"meter\" with aria-valuemin, aria-valuemax, aria-valuenow and aria-valuetext. When a threshold applies, its label is shown under the value and included in the value text, so the state never relies on color.",
  ),
  "components/image": () => detail(
    `<div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
  <figure className="grid gap-2">
    <Image src="/gallery/dawn-ridge.svg" alt="Purple ridges under a peach dawn sky" aspectRatio={4 / 3} />
    <figcaption className="text-xs text-muted-foreground">Loaded with a skeleton</figcaption>
  </figure>
  <figure className="grid gap-2">
    <Image src="/gallery/glacier-lake.svg" alt="Blue mountains above a glacier lake" aspectRatio={4 / 3} placeholder="blur" blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Crect width='4' height='3' fill='%237fb6dd'/%3E%3Crect y='2' width='4' height='1' fill='%234e7393'/%3E%3C/svg%3E" />
    <figcaption className="text-xs text-muted-foreground">Blur placeholder</figcaption>
  </figure>
  <figure className="grid gap-2">
    <Image src="/gallery/missing-photo.jpg" alt="Team offsite photo" aspectRatio={4 / 3} />
    <figcaption className="text-xs text-muted-foreground">Broken source → fallback</figcaption>
  </figure>
</div>`,
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
  <figure className="grid gap-2">
    <R.Image src="/gallery/dawn-ridge.svg" alt="Purple ridges under a peach dawn sky" aspectRatio={4 / 3} />
    <figcaption className="text-xs text-muted-foreground">Loaded with a skeleton</figcaption>
  </figure>
  <figure className="grid gap-2">
    <R.Image src="/gallery/glacier-lake.svg" alt="Blue mountains above a glacier lake" aspectRatio={4 / 3} placeholder="blur" blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Crect width='4' height='3' fill='%237fb6dd'/%3E%3Crect y='2' width='4' height='1' fill='%234e7393'/%3E%3C/svg%3E" />
    <figcaption className="text-xs text-muted-foreground">Blur placeholder</figcaption>
  </figure>
  <figure className="grid gap-2">
    <R.Image src="/gallery/missing-photo.jpg" alt="Team offsite photo" aspectRatio={4 / 3} />
    <figcaption className="text-xs text-muted-foreground">Broken source → fallback</figcaption>
  </figure>
</div>,
    api(["src / alt", "string", "Source and required alternative text (\"\" when decorative)."], ["aspectRatio", "number | string", "Reserves space before load so layout does not shift."], ["fit", "\"cover\" | \"contain\" | \"fill\" | \"none\" | \"scale-down\"", "object-fit.", "\"cover\""], ["placeholder / blurDataURL", "\"blur\" | \"skeleton\" | \"none\" / string", "What shows while loading.", "\"skeleton\""], ["fallbackSrc / fallback", "string / ReactNode", "Second source, then custom content when both fail."], ["loading", "\"lazy\" | \"eager\"", "Native lazy loading; use eager above the fold.", "\"lazy\""], ["rounded / wrapperClassName / className", "boolean / string", "Corner radius and part styling.", "true"]),
    "The image keeps its alt text through every state: when both sources fail, the fallback is an image role named by the same alt text and shows it visibly. Placeholders are hidden from assistive technology. Images decode asynchronously and lazy-load by default.",
  ),
  "components/lightbox": () => detail(
    `function Gallery() {
  const photos = [
    { src: "/gallery/dawn-ridge.svg", alt: "Purple ridges under a peach dawn sky", caption: "Dawn ridge · 05:42" },
    { src: "/gallery/glacier-lake.svg", alt: "Blue mountains above a glacier lake", caption: "Glacier lake" },
    { src: "/gallery/pine-valley.svg", alt: "Green valley full of pine trees", caption: "Pine valley" },
    { src: "/gallery/desert-dunes.svg", alt: "Orange dunes under a pale sun", caption: "Desert dunes" },
    { src: "/gallery/night-peaks.svg", alt: "Dark peaks under a starry sky and moon", caption: "Night peaks" },
    { src: "/gallery/coastal-cliffs.svg", alt: "Teal cliffs over a calm sea", caption: "Coastal cliffs" },
  ]
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  return (
    <>
      <ul className="grid w-full max-w-2xl grid-cols-2 gap-2 sm:grid-cols-3">
        {photos.map((photo, i) => (
          <li key={photo.src}>
            <button type="button" aria-label={\`Open \${photo.alt}\`} onClick={() => { setIndex(i); setOpen(true) }} className="block w-full overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
              <Image src={photo.src} alt="" aspectRatio={4 / 3} rounded={false} className="transition-transform duration-300 hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={photos} open={open} onOpenChange={setOpen} index={index} onIndexChange={setIndex} loop />
    </>
  )
}`,
    <LightboxUsagePreview />,
    api(["images", "{ src; alt; caption?; thumbnail? }[]", "Images in order."], ["open / onOpenChange", "boolean / (open) => void", "Controlled visibility."], ["index / defaultIndex / onIndexChange", "number", "Controlled or initial image.", "0"], ["loop", "boolean", "Wrap past the first and last image.", "false"], ["thumbnails", "boolean", "Thumbnail strip.", "true for 2+ images"], ["ariaLabel / className", "string", "Dialog name and styling.", "\"Image viewer\""]),
    "A modal dialog: focus moves inside and is trapped, the page stops scrolling, and focus returns to the opening button on close. Left/Right, Home and End navigate; Escape closes; touch users can swipe. The position and current alt text are announced (\"2 of 6: Blue mountains above a glacier lake\"), and every control has a label. Neighbouring images are preloaded.",
  ),
  "components/resizable": () => detail(
    `<div className="h-80 w-full overflow-hidden rounded-xl border border-border bg-surface">
  <Resizable defaultSizes={[22, 56, 22]} minSizes={[15, 30, 15]} panelLabels={["Explorer", "Editor", "Inspector"]}>
    <ResizablePanel className="p-3 text-sm">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">EXPLORER</p>
      <p>src/</p>
      <p className="pl-3">app.tsx</p>
      <p className="pl-3">theme.ts</p>
    </ResizablePanel>
    <ResizablePanel>
      <Resizable direction="vertical" defaultSizes={[65, 35]} minSizes={[25, 20]} panelLabels={["Code", "Terminal"]}>
        <ResizablePanel className="p-3 font-mono text-xs">export default function App() {"{"}…{"}"}</ResizablePanel>
        <ResizablePanel className="bg-bg p-3 font-mono text-xs text-muted-foreground">$ npm run dev</ResizablePanel>
      </Resizable>
    </ResizablePanel>
    <ResizablePanel className="p-3 text-sm">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">INSPECTOR</p>
      <p>Props: 4</p>
    </ResizablePanel>
  </Resizable>
</div>`,
    <ResizableUsagePreview />,
    api(["direction", '"horizontal" | "vertical"', "Split axis.", '"horizontal"'], ["defaultSizes / sizes", "number[]", "Initial or controlled sizes in percent."], ["onResize", "(sizes) => void", "Called while resizing."], ["minSizes / maxSizes", "number[]", "Per-panel limits in percent.", "10 / 90"], ["storageKey", "string", "Persists the layout in localStorage."], ["withHandle", "boolean", "Shows a grip on each handle.", "false"], ["panelLabels", "string[]", "Names used to label each handle for assistive technology."], ["ResizablePanel", "component", "A panel; scrolls its own overflow."]),
    "Each handle is a focusable separator with orientation, value and limits. Arrow keys resize by 2% (Shift: 10%), Home/End jump to the limits, and double-click restores the default layout. Name panels with panelLabels so handles read as “Resize Explorer and Editor”.",
  ),
  "components/sortable": () => detail(
    `function TaskList() {
  const [items, setItems] = useState([
    { id: "1", title: "Configure authentication provider", tag: "Security" },
    { id: "2", title: "Set up PostgreSQL read replica", tag: "Database" },
    { id: "3", title: "Implement rate limiting middleware", tag: "API" },
    { id: "4", title: "Audit responsive design on mobile", tag: "UI" },
  ])
  return (
    <div className="w-full max-w-md">
      <SortableList
        items={items}
        onReorder={(next) => setItems(next)}
        getLabel={(item) => item.title}
        renderItem={(item) => (
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">{item.title}</span>
            <span className="rounded bg-foreground/6 px-1.5 py-0.5 text-xs text-muted-foreground">{item.tag}</span>
          </div>
        )}
      />
    </div>
  )
}`,
    <SortableUsagePreview />,
    api(
      ["items", "T[]", "List of items with unique id properties."],
      ["onReorder", "(items: T[], move: { id, from, to }) => void", "Callback when items are reordered."],
      ["renderItem", "(item: T, state: { dragging: boolean }) => ReactNode", "Item renderer."],
      ["getLabel", "(item: T) => string", "Text used in handle aria-label and announcements.", "(item) => item.id"],
      ["orientation", '"vertical" | "horizontal"', "Layout direction.", '"vertical"'],
      ["dragFromItem", "boolean", "Allows initiating drag anywhere on the item.", "false"],
      ["instructions", "string", "Hidden instructions referenced by aria-describedby."],
      ["messages", "Partial<Messages>", "Custom screen reader announcement templates."],
    ),
    "Every drag handle is a keyboard-operable button with aria-label, aria-describedby pointing to hidden instructions, and aria-pressed while picked up. Focus a handle, press Space or Enter to pick up, use Arrow keys to reorder, Space/Enter to drop, and Escape to cancel. Position and actions are announced to aria-live='assertive'.",
  ),
  "components/notification-center": () => detail(
    `function NotificationInbox() {
  const [items, setItems] = useState<NotificationItem[]>([
    { id: "1", title: "Deployment succeeded", description: "Production environment updated to release v2.4.0", timestamp: "5m ago", read: false, tone: "success" },
    { id: "2", title: "Database backup completed", description: "Automated snapshot taken for postgres-prod", timestamp: "45m ago", read: false, tone: "info" },
    { id: "3", title: "High memory usage alert", description: "Host node worker-03 exceeded 90% memory capacity", timestamp: "3h ago", read: true, tone: "warning" },
  ])
  return (
    <div className="flex items-center justify-center p-6">
      <NotificationCenter
        items={items}
        onItemsChange={setItems}
        onClearAll={() => setItems([])}
      />
    </div>
  )
}`,
    <NotificationCenterUsagePreview />,
    api(
      ["items / defaultItems / onItemsChange", "NotificationItem[]", "Controlled or uncontrolled notifications list."],
      ["open / defaultOpen / onOpenChange", "boolean", "Panel open state."],
      ["title", "ReactNode", "Header title.", '"Notifications"'],
      ["unreadCount", "number", "Custom unread badge count (default: count of !item.read)."],
      ["categories", "string[]", "Filter tabs displayed under header.", '["all", "unread"]'],
      ["onItemClick", "(item: NotificationItem) => void", "Called when an item row is clicked."],
      ["onItemDismiss", "(id: string) => void", "Called when an item close button is clicked."],
      ["onMarkAllAsRead", "() => void", "Called when the mark all read button is clicked."],
      ["onClearAll", "() => void", "Called when the clear all button in the footer is clicked."],
      ["trigger", "ReactNode", "Custom trigger button (default: bell button with unread count badge)."],
      ["side / align", '"top" | "bottom" | "left" | "right" / "start" | "center" | "end"', "Popover placement.", '"bottom" / "end"'],
      ["emptyLabel", "ReactNode", "Message displayed when the notification list is empty."],
    ),
    "Trigger button exposes aria-haspopup='dialog', aria-expanded, and an accessible label including unread count. The portalled dialog traps focus, supports Escape to close, and restores focus to the trigger.",
  ),
  "components/tour": () => detail(
    `function AppOnboarding() {
  const [open, setOpen] = useState(false)
  const steps: TourStep[] = [
    { target: "#tour-target-search", title: "Global Search", content: "Quickly locate any file, setting, or command with keyboard shortcuts." },
    { target: "#tour-target-action", title: "Deploy Button", content: "Ship changes to staging or production with zero downtime." },
    { target: "#tour-target-avatar", title: "User Account", content: "Manage team memberships, personal access tokens, and notifications." },
  ]
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg p-4 rounded-xl border border-border bg-surface">
      <div className="flex w-full items-center justify-between gap-2">
        <div id="tour-target-search" className="rounded-lg border border-border bg-surface-muted px-3 py-1.5 text-xs text-muted-foreground">
          🔍 Search project…
        </div>
        <div className="flex items-center gap-2">
          <button id="tour-target-action" type="button" className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            Deploy
          </button>
          <div id="tour-target-avatar" className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold">
            JD
          </div>
        </div>
      </div>
      <Button onClick={() => setOpen(true)} variant="secondary">Start interactive tour</Button>
      <Tour steps={steps} open={open} onOpenChange={setOpen} />
    </div>
  )
}`,
    <TourUsagePreview />,
    api(
      ["steps", "TourStep[]", "Array of tour steps with target selector, title, content and placement."],
      ["open / defaultOpen / onOpenChange", "boolean", "Controlled or uncontrolled visibility."],
      ["step / defaultStep / onStepChange", "number", "Controlled or uncontrolled active step index."],
      ["onFinish / onSkip", "() => void", "Callbacks when tour completes or is cancelled/skipped."],
      ["mask", "boolean", "Display spotlight mask with cutout around target element.", "true"],
      ["keyboard", "boolean", "Enable Escape to exit and Arrow Left/Right to navigate.", "true"],
      ["nextLabel / prevLabel / finishLabel / skipLabel", "string", "Button labels.", '"Next" / "Back" / "Finish" / "Skip"'],
      ["showStepNumbers", "boolean", "Show step count in card header.", "true"],
    ),
    "Announced as an accessible modal dialog with aria-labelledby and aria-describedby. Focus is placed inside the active card, Arrow keys navigate steps, and Escape skips the tour while restoring focus to the opening element.",
  ),
  "components/code-block": () => detail(
    `<CodeBlock className="w-full" language="ts" filename="status.ts" showLineNumbers code={'export const status = "ready"\\n\\nconsole.log(status)'} />`,
    <R.CodeBlock className="w-full" language="ts" filename="status.ts" showLineNumbers code={'export const status = "ready"\n\nconsole.log(status)'} />,
    api(["code", "string", "Source text to display and copy."], ["language", "string", "Tokenizer language.", '"js"'], ["filename", "string", "Optional header filename."], ["showLineNumbers", "boolean", "Displays line numbers.", "false"]),
    "The copy action is a native button with visible state feedback; source remains selectable text.",
  ),
  "components/code-editor": () => detail(
    `function StatusEditor() {
  const [value, setValue] = useState('export const status = "ready"\\n')
  return <CodeEditor language="ts" value={value} onChange={setValue} />
}`,
    <CodeEditorPreview />,
    api(["value", "string", "Controlled source value."], ["onChange", "(value: string) => void", "Edit callback."], ["language", "string", "Language label."], ["minRows / maxRows", "number", "Editor height constraints."], ["readOnly", "boolean", "Prevents editing."]),
    "Uses a textarea with keyboard support for indentation and paired characters; readOnly preserves text navigation.",
  ),
  "components/rich-text": () => detail(
    `function NoteEditor() {
  const [value, setValue] = useState("<p>Write a deployment note…</p>")
  return <RichTextEditor value={value} onChange={setValue} />
}`,
    <RichTextPreview />,
    api(["value / defaultValue", "string", "Controlled HTML, or initial HTML applied once when uncontrolled."], ["onChange", "(html: string) => void", "Edit callback."], ["placeholder", "string", "Empty editor guidance."], ["disabled", "boolean", "Disables editing controls."], ["className", "string", "Composes editor layout styles."]),
    "Toolbar controls are named buttons and the editable surface supports keyboard text editing.",
  ),
  "components/terminal": () => detail(
    `<TerminalEmulator className="w-full" title="user@production" user="user" hostname="production" />`,
    <R.TerminalEmulator className="w-full" title="user@production" user="user" hostname="production" />,
    api(["title", "string", "Terminal window title."], ["user", "string", "Prompt user name."], ["hostname", "string", "Prompt host name."], ["initialPath", "string", "Initial working directory."], ["className", "string", "Composes terminal dimensions."]),
    "The command input has an accessible label and supports command history and standard keyboard editing.",
  ),
  "components/bar-chart": () => detail(
    `<BarChart data={[{ label: "API", value: 1200 }, { label: "Web", value: 840 }]} showValues />`,
    <R.BarChart className="w-full" height={220} showValues data={[{ label: "API", value: 1200 }, { label: "Web", value: 840 }, { label: "Worker", value: 560 }, { label: "Jobs", value: 320 }]} />,
    chartProps,
    "Provide the same values in nearby text or a table when exact chart values are essential.",
  ),
  "components/line-chart": () => detail(
    `<LineChart data={[{ label: "Mon", value: 820 }, { label: "Tue", value: 1040 }]} />`,
    <R.LineChart className="w-full" height={220} data={[{ label: "Mon", value: 820 }, { label: "Tue", value: 1040 }, { label: "Wed", value: 960 }, { label: "Thu", value: 1280 }, { label: "Fri", value: 1510 }]} />,
    chartProps,
    "Pair the visual trend with a textual summary or accessible data table.",
  ),
  "components/multi-line-chart": () => detail(
    `<MultiLineChart labels={["Mon", "Tue", "Wed"]} series={[{ label: "CPU", data: [28, 42, 38] }, { label: "Memory", data: [55, 58, 62] }]} />`,
    <R.MultiLineChart className="w-full" height={220} labels={["Mon", "Tue", "Wed", "Thu", "Fri"]} series={[{ label: "CPU", color: "var(--chart-1)", data: [28, 42, 38, 55, 48] }, { label: "Memory", color: "var(--chart-2)", data: [55, 58, 62, 65, 68] }]} />,
    api(["labels", "string[]", "Shared x-axis labels."], ["series", "LineSeries[]", "Named value series."], ["height", "number", "Chart height in pixels."], ["formatValue", "(value) => string", "Tooltip value formatter."]),
    "Give every series a name and provide exact values in text or a table when users need them.",
  ),
  "components/donut-chart": () => detail(
    `<DonutChart data={[{ label: "US East", value: 42 }, { label: "EU West", value: 28 }]} />`,
    <R.DonutChart data={[{ label: "US East", value: 42 }, { label: "EU West", value: 28 }, { label: "AP South", value: 18 }, { label: "Other", value: 12 }]} centerLabel={<div className="text-center"><strong>100%</strong><small className="block">traffic</small></div>} />,
    api(["data", "DonutDataPoint[]", "Labeled segment values."], ["size", "number", "Chart diameter."], ["thickness", "number", "Ring thickness."], ["centerLabel", "ReactNode", "Content displayed inside the ring."]),
    "Segment labels remain visible in the legend; add a table when precise comparison is required.",
  ),
  "components/scatter-chart": () => detail(
    `<ScatterChart series={[{ label: "API", data: [{ x: 12, y: 420, label: "GET /users" }] }]} />`,
    <R.ScatterChart className="w-full" height={220} xLabel="Latency (ms)" series={[{ label: "API", color: "var(--chart-1)", data: [{ x: 12, y: 420, label: "GET /users" }, { x: 28, y: 280, label: "POST /auth" }, { x: 45, y: 110, label: "POST /deploy" }] }, { label: "Worker", color: "var(--chart-2)", data: [{ x: 55, y: 140, label: "push:registry" }, { x: 90, y: 60, label: "build:docker" }] }]} />,
    api(["series", "ScatterSeries[]", "Named point series."], ["xLabel", "string", "Horizontal axis label."], ["formatX / formatY", "(value) => string", "Axis and tooltip formatters."], ["height", "number", "Chart height."]),
    "Label both axes and expose exact point values in an alternate textual form when essential.",
  ),
  "components/gantt-chart": () => detail(
    `<GanttChart xLabels={["Mon", "Tue", "Wed"]} tasks={[{ id: "api", label: "API design", start: 0, end: 2 }]} />`,
    <R.GanttChart className="w-full" xLabels={["Mon", "Tue", "Wed", "Thu", "Fri"]} tasks={[{ id: "api", label: "API design", start: 0, end: 2 }, { id: "db", label: "DB schema", start: 1, end: 3 }, { id: "deploy", label: "Deploy", start: 3, end: 5 }]} />,
    api(["tasks", "GanttTask[]", "Labeled task ranges."], ["xLabels", "string[]", "Timeline column labels."], ["className", "string", "Composes chart dimensions."]),
    "Task names and timeline labels should remain available as text; supplement complex schedules with a table.",
  ),
  "components/heatmap-chart": () => detail(
    `<HeatmapChart rowLabels={["Mon", "Tue"]} colLabels={["0h", "6h", "12h"]} data={[[2, 8, 18], [3, 10, 22]]} />`,
    <R.HeatmapChart rowLabels={["Mon", "Tue", "Wed", "Thu"]} colLabels={["0h", "6h", "12h", "18h"]} data={[[2, 8, 18, 12], [3, 10, 22, 14], [1, 9, 20, 16], [4, 12, 24, 18]]} />,
    api(["data", "number[][]", "Matrix of cell values."], ["rowLabels", "string[]", "Labels for matrix rows."], ["colLabels", "string[]", "Labels for matrix columns."], ["color", "string", "Base intensity color."], ["formatValue", "(value) => string", "Tooltip formatter."]),
    "Keep row and column labels descriptive and provide an accessible table for exact matrix values.",
  ),
  "components/radar-chart": () => detail(
    `<RadarChart axes={["Uptime", "Latency", "Errors"]} series={[{ label: "API", data: [92, 85, 95] }]} />`,
    <R.RadarChart axes={["Uptime", "Throughput", "Latency", "Errors", "Saturation"]} series={[{ label: "API", color: "var(--chart-1)", data: [92, 78, 85, 95, 70] }, { label: "Worker", color: "var(--chart-2)", data: [88, 65, 72, 90, 60] }]} />,
    api(["axes", "string[]", "Dimension labels."], ["series", "RadarSeries[]", "Named values across every axis."], ["max", "number", "Maximum axis value."], ["size", "number", "Chart diameter."]),
    "Name every axis and series; provide an alternate comparison table for precise interpretation.",
  ),
  "components/funnel-chart": () => detail(
    `<FunnelChart data={[{ label: "Triggered", value: 1200 }, { label: "Healthy", value: 960 }]} />`,
    <R.FunnelChart className="w-full" height={220} data={[{ label: "Triggered", value: 1200 }, { label: "Built", value: 1140 }, { label: "Pushed", value: 1080 }, { label: "Deployed", value: 1020 }, { label: "Healthy", value: 960 }]} />,
    chartProps,
    "Stage names and values should also be available as text when conversion details drive decisions.",
  ),
  "components/waterfall-chart": () => detail(
    `<WaterfallChart data={[{ label: "Base", value: 200 }, { label: "Compute", value: 120 }, { label: "Total", value: 0, total: true }]} />`,
    <R.WaterfallChart className="w-full" height={220} data={[{ label: "Base", value: 200 }, { label: "Compute", value: 120 }, { label: "Storage", value: 45 }, { label: "Discount", value: -60 }, { label: "Total", value: 0, total: true }]} formatValue={(value) => `$${Math.abs(value)}`} />,
    chartProps,
    "Positive, negative, and total values need textual labels; add a table for accounting-critical figures.",
  ),
  "components/range-slider": () => detail(
    `function PriceRangeFilter() {
  const [range, setRange] = useState<[number, number]>([25, 75])
  return (
    <div className="w-full max-w-sm">
      <RangeSlider
        label="Price Range"
        min={0}
        max={100}
        step={5}
        value={range}
        onChange={setRange}
        showTooltip
        formatValue={(v) => \`\$\${v}\`}
      />
    </div>
  )
}`,
    <RangeSliderUsagePreview />,
    api(
      ["min / max / step", "number", "Range boundaries and increment.", "0 / 100 / 1"],
      ["value / defaultValue", "[number, number]", "Controlled or initial dual-thumb range values."],
      ["onChange", "(value: [number, number]) => void", "Change callback."],
      ["onChangeEnd", "(value: [number, number]) => void", "Fires when user commits drag."],
      ["label", "ReactNode", "Accessible field label."],
      ["formatValue", "(value: number) => string", "Value tooltip and aria text formatter."],
      ["showTooltip", "boolean", "Displays floating tooltip over thumbs on hover/drag.", "false"],
      ["marks", "RangeSliderMark[]", "Custom tick marks rendered along track."],
      ["disabled", "boolean", "Disables range interaction.", "false"],
      ["size", '"sm" | "md" | "lg"', "Track and thumb size.", '"md"'],
    ),
    "Renders two native-accessible slider thumbs with role='slider', aria-valuemin, aria-valuemax, aria-valuenow, and aria-valuetext. Fully keyboard navigable with Arrow keys, PageUp, PageDown, Home, and End.",
  ),
  "components/date-time-picker": () => detail(
    `function ScheduleDeployment() {
  const [val, setVal] = useState<Date | null>(new Date())
  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <DateTimePicker
        label="Release Date & Time"
        hint="Schedule automated production deployment"
        value={val}
        onChange={setVal}
        showPresets
      />
      {val && (
        <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-surface-muted/50 px-3 py-2 text-xs">
          <span className="text-muted-foreground">Scheduled for</span>
          <span className="font-semibold text-foreground">{val.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
        </div>
      )}
    </div>
  )
}`,
    <DateTimePickerUsagePreview />,
    api(
      ["value / defaultValue", "Date | null", "Controlled or initial date-time value."],
      ["onChange", "(date: Date | null) => void", "Callback when date or time changes."],
      ["label / hint / error", "ReactNode", "Accessible field messaging."],
      ["is24Hour", "boolean", "24-hour time format toggle.", "false"],
      ["showPresets", "boolean", "Show quick preset buttons (Now, Tomorrow, etc.).", "true"],
      ["minDate / maxDate", "Date", "Selectable date limits."],
      ["size", '"sm" | "md" | "lg"', "Field trigger size.", '"md"'],
      ["clearable", "boolean", "Allows clearing the selected value.", "true"],
    ),
    "Trigger button communicates popup state via aria-haspopup='dialog' and aria-expanded. Calendar grid supports standard arrow key navigation, and time controls provide accessible spinbutton or select semantics.",
  ),
  "components/color-picker": () => detail(
    `function BrandColorSelector() {
  const [color, setColor] = useState("#3b82f6")
  return (
    <div className="w-full max-w-xs">
      <ColorPicker
        label="Brand Accent Color"
        value={color}
        onChange={setColor}
      />
    </div>
  )
}`,
    <ColorPickerUsagePreview />,
    api(
      ["value / defaultValue", "string", "Controlled or initial hex/rgb color string."],
      ["onChange", "(color: string) => void", "Color change callback."],
      ["label / hint / error", "ReactNode", "Accessible field messaging."],
      ["swatches", "string[]", "Array of preset color swatches."],
      ["showEyeDropper", "boolean", "Enables native browser EyeDropper API button if supported.", "true"],
      ["format", '"hex" | "rgb"', "Color text representation.", '"hex"'],
      ["disabled", "boolean", "Disables color interaction.", "false"],
    ),
    "Color swatch buttons have accessible labels indicating their color name or hex value. Hue slider and canvas support keyboard adjustments, and text inputs allow direct hex entry.",
  ),
  "components/signature": () => detail(
    `function SignatureShowcase() {
  const [activeTab, setActiveTab] = useState<"pad" | "editor" | "contract">("pad")
  const [signature, setSignature] = useState<string | null>(null)
  const [activeSample, setActiveSample] = useState<"parchment" | "notebook">("parchment")
  const [previewBg, setPreviewBg] = useState<"white" | "checkers" | "dark">("white")
  const [agreed, setAgreed] = useState(false)
  const [isContractSigned, setIsContractSigned] = useState(false)
  const sigRef = useRef<SignatureRef>(null)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
        <div className="flex items-center rounded-lg border border-border bg-surface-muted/40 p-1 text-xs w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => setActiveTab("pad")}
            className={cn(
              "inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 font-medium transition-colors text-xs",
              activeTab === "pad"
                ? "bg-accent font-semibold text-accent-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icons.PenLine size="xs" className="shrink-0" />
            <span>Draw<span className="hidden sm:inline"> &amp; Sign Pad</span></span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("editor")}
            className={cn(
              "inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 font-medium transition-colors text-xs",
              activeTab === "editor"
                ? "bg-accent font-semibold text-accent-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icons.Sparkles size="xs" className="shrink-0" />
            <span>Remover<span className="hidden sm:inline"> Studio</span></span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contract")}
            className={cn(
              "inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 font-medium transition-colors text-xs",
              activeTab === "contract"
                ? "bg-accent font-semibold text-accent-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icons.FileCheck size="xs" className="shrink-0" />
            <span>Document<span className="hidden sm:inline"> Flow</span></span>
          </button>
        </div>

        {activeTab === "editor" && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-muted-foreground">Sample:</span>
            <Button
              variant={activeSample === "parchment" ? "primary" : "secondary"}
              size="sm"
              icon={<Icons.Scroll size="xs" className="shrink-0" />}
              onClick={() => setActiveSample("parchment")}
              className="h-7 gap-1.5 text-xs"
            >
              Parchment
            </Button>
            <Button
              variant={activeSample === "notebook" ? "primary" : "secondary"}
              size="sm"
              icon={<Icons.Book size="xs" className="shrink-0" />}
              onClick={() => setActiveSample("notebook")}
              className="h-7 gap-1.5 text-xs"
            >
              Notebook
            </Button>
          </div>
        )}
      </div>

      {/* Tab 1: Draw & Sign Pad */}
      {activeTab === "pad" && (
        <div className="space-y-3.5">
          {/* Quick-test Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-surface-muted/20 px-3 py-2 text-xs">
            <span className="text-[11px] font-medium text-muted-foreground">Try demo signature:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  sigRef.current?.fromDataURL(createSampleSignature("digital"))
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-muted transition-colors shadow-2xs min-h-[28px]"
              >
                <Icons.PenLine size="xs" className="shrink-0 text-accent-strong" />
                <span>Digital Ink</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sigRef.current?.fromDataURL(createSampleSignature("parchment"))
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-muted transition-colors shadow-2xs min-h-[28px]"
              >
                <Icons.Scroll size="xs" className="shrink-0 text-muted-foreground" />
                <span>Parchment</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sigRef.current?.fromDataURL(createSampleSignature("notebook"))
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-muted transition-colors shadow-2xs min-h-[28px]"
              >
                <Icons.Book size="xs" className="shrink-0 text-muted-foreground" />
                <span>Notebook</span>
              </button>
              {signature && (
                <button
                  type="button"
                  onClick={() => {
                    sigRef.current?.clear()
                  }}
                  className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-2 py-1 text-xs text-muted-foreground hover:text-danger transition-colors shadow-2xs min-h-[28px]"
                  title="Clear pad"
                >
                  <Icons.Eraser size="xs" className="shrink-0" />
                </button>
              )}
            </div>
          </div>

          <Signature
            signatureRef={sigRef}
            label="Authorized E-Signature"
            hint="Draw with stylus/mouse or switch to Upload mode to clean paper scans."
            value={signature}
            onChange={setSignature}
          />

          {/* Live Document & Transparency Verification Card */}
          {signature ? (
            <div className="flex flex-col gap-3 rounded-xl border border-success/30 bg-success/5 p-3.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-success/20 pb-2.5">
                <div className="flex items-center gap-1.5 font-semibold text-success-strong">
                  <Icons.CheckCircle2 size="xs" className="shrink-0" />
                  <span>Verified E-Signature Ready</span>
                </div>

                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-muted-foreground mr-1">Preview BG:</span>
                  {(["white", "checkers", "dark"] as const).map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setPreviewBg(bg)}
                      className={cn(
                        "inline-flex items-center justify-center rounded px-2 py-0.5 capitalize transition-colors min-h-[24px]",
                        previewBg === bg
                          ? "bg-accent font-semibold text-accent-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {bg === "checkers" ? "Transparent" : bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature Stamped Document Preview */}
              <div
                className={cn(
                  "flex h-24 w-full items-center justify-center rounded-lg border border-border/80 p-3 transition-colors",
                  previewBg === "white" && "bg-white text-slate-900 shadow-xs",
                  previewBg === "dark" && "bg-slate-950 text-white shadow-xs",
                )}
                style={
                  previewBg === "checkers"
                    ? {
                        backgroundImage:
                          "repeating-conic-gradient(rgba(128,128,128,0.12) 0% 25%, transparent 0% 50%)",
                        backgroundSize: "12px 12px",
                      }
                    : undefined
                }
              >
                <img
                  src={signature}
                  alt="Live signature preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5 text-[11px] text-muted-foreground">
                <span className="font-mono text-[10px]">SHA-256: 7f8b9…c42e • Verified Seal</span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Icons.Sparkles size="xs" className="shrink-0" />}
                    onClick={() => sigRef.current?.openEditor()}
                    className="h-8 sm:h-7 gap-1.5 text-xs font-semibold text-accent-strong w-full sm:w-auto justify-center"
                  >
                    Clean &amp; Crop Studio
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Icons.FileCheck size="xs" className="shrink-0" />}
                    onClick={() => setActiveTab("contract")}
                    className="h-8 sm:h-7 gap-1.5 text-xs font-semibold w-full sm:w-auto justify-center"
                  >
                    Use in Contract →
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
              <Icons.Sparkles size="xs" className="text-accent-strong shrink-0" />
              <span>
                Draw your signature above or click <strong>“Digital Ink”</strong> to see live document stamping and transparency verification.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Live Background Remover & Auto-Crop Studio */}
      {activeTab === "editor" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-border/70 bg-surface-muted/30 p-3 text-xs text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground mb-0.5">Background Removal &amp; Auto-Crop Studio</p>
            <p>
              Remove paper texture, shadows, and ruled lines from phone photos or paper scans. Use the 1-Click Magic Clean button, drag the split comparison slider, or tune sensitivity.
            </p>
          </div>

          <SignatureImageEditor
            key={activeSample}
            image={createSampleSignature(activeSample)}
            title="Background Removal &amp; Auto-Crop Studio"
            onSave={(cleaned) => {
              setSignature(cleaned)
              setActiveTab("contract")
            }}
          />

          {signature && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-xs">
              <div className="flex items-center gap-1.5 text-success-strong font-semibold">
                <Icons.CheckCircle2 size="xs" className="shrink-0" />
                <span>Extracted Signature Ready</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab("contract")}
                className="h-8 sm:h-7 gap-1.5 text-xs font-semibold w-full sm:w-auto justify-center"
              >
                <span>Continue to NDA Contract →</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Real Contract Signing Workflow */}
      {activeTab === "contract" && (
        <div className="space-y-4 rounded-xl border border-border bg-surface p-4 text-xs shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Mutual Non-Disclosure Agreement</h4>
              <p className="text-[11px] text-muted-foreground">Doc ID: NDA-2026-904 • Parties: Acme Corp &amp; Contractor</p>
            </div>
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold self-start sm:self-auto",
              isContractSigned
                ? "bg-success/15 text-success-strong"
                : "bg-accent/15 text-accent-strong"
            )}>
              {isContractSigned && <Icons.Check size="xs" className="shrink-0" />}
              <span>{isContractSigned ? "Legally Executed" : "Execution Ready"}</span>
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            By executing this electronic signature below, the parties agree to be bound by all terms, confidentiality covenants, and non-disclosure obligations of this Agreement.
          </p>

          {/* Signature Block */}
          {isContractSigned ? (
            <div className="flex flex-col gap-2 rounded-lg border border-success/30 bg-success/5 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-success-strong">
                <Icons.CheckCircle2 size="sm" className="shrink-0" />
                <span>Agreement Certified &amp; Executed</span>
              </div>
              <div className="mx-auto flex h-20 w-full max-w-xs items-center justify-center rounded border border-border/80 bg-surface p-2 shadow-2xs">
                {signature ? (
                  <img src={signature} alt="Adopted signature" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="font-serif italic text-muted-foreground">Signed electronically</span>
                )}
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">
                Signer: Alex Morgan (CEO) • Certificate: RUI-E-SIG-904 • Hash: 7f8b9c42e…
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg border border-border/80 bg-surface-muted/20 p-3">
                <Signature
                  label="Signer: Alex Morgan (CEO)"
                  value={signature}
                  onChange={setSignature}
                  height={140}
                  hint={signature ? "Signature imported. You can adjust or re-sign above." : "Draw above or import from the Draw & Sign Pad."}
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 size-3.5 rounded border-border text-accent focus:ring-accent"
                />
                <span className="leading-tight">I confirm that I am legally authorized to execute this agreement electronically.</span>
              </label>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-border/80 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSignature(null)
                setAgreed(false)
                setIsContractSigned(false)
              }}
              disabled={!signature && !agreed && !isContractSigned}
              className="w-full sm:w-auto justify-center"
            >
              Reset Contract
            </Button>

            {!isContractSigned ? (
              <Button
                variant="primary"
                size="sm"
                icon={<Icons.CheckCircle2 size="xs" className="shrink-0" />}
                disabled={!signature || !agreed}
                onClick={() => setIsContractSigned(true)}
                className="gap-1.5 font-semibold w-full sm:w-auto justify-center"
              >
                Complete &amp; Seal Agreement
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsContractSigned(false)
                  setActiveTab("pad")
                }}
                className="w-full sm:w-auto justify-center"
              >
                <span>Sign Another Document</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}`,
    <SignatureUsagePreview />,
    api(
      ["value / defaultValue", "string | null", "Controlled or uncontrolled signature image Data URL."],
      ["onChange / onValueChange", "(dataUrl: string | null) => void", "Triggered when signature is drawn, uploaded, edited, or cleared."],
      ["modes", '("draw" | "upload")[]', "Enabled signing methods (freehand draw and file upload).", '["draw", "upload"]'],
      ["defaultMode", '"draw" | "upload"', "Initial active signing mode.", '"draw"'],
      ["enableEditor", "boolean", "Enables the built-in background removal, crop, and zoom editor.", "true"],
      ["autoEditOnUpload", "boolean", "Automatically opens editor modal when an image is uploaded or dropped.", "true"],
      ["strokeColor", "string", "Default pen stroke color in draw mode.", '"#0f172a"'],
      ["strokeWidth", '"fine" | "regular" | "bold" | number', "Stroke line width preset or pixel value.", '"regular"'],
      ["colors", "string[]", "Array of selectable ink color swatches in draw toolbar."],
      ["guideLine", "boolean", "Displays baseline signing guide with '✕' marker.", "true"],
      ["guideText", "string", "Text displayed next to the baseline marker.", '"Sign above this line"'],
      ["showToolbar", "boolean", "Displays top toolbar with mode tabs, colors, enhance, undo, and clear.", "true"],
      ["signatureRef", "Ref<SignatureRef>", "Imperative ref exposing clear(), undo(), isEmpty(), toDataURL(), toSVG(), fromDataURL(), openEditor()."],
      ["label / hint / error", "string", "Accessible field label and validation messages."],
      ["disabled / readOnly", "boolean", "Disables editing or locks signature into display-only mode.", "false"],
    ),
    "Canvas element has role='img' with accessible aria-label, aria-invalid, and aria-describedby associations for hint and error messaging. Toolbar actions, mode tabs, and the crop/background removal editor provide clear button semantics, keyboard focus traps, and accessible contrast.",
  ),
  "components/inline-edit": () => detail(
    `function RenameProject() {
  const [name, setName] = useState("Alpha Project")
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-xs text-muted-foreground">Click to rename:</span>
      <InlineEdit value={name} onSave={setName} />
    </div>
  )
}`,
    <InlineEditUsagePreview />,
    api(
      ["value / defaultValue", "string", "Controlled or initial display value."],
      ["onSave", "(value: string) => void | Promise<void>", "Save callback on commit or Enter."],
      ["onCancel", "() => void", "Callback when editing is cancelled."],
      ["validate", "(value: string) => string | boolean | undefined", "Validation rule returning an error message."],
      ["multiline", "boolean", "Renders a textarea instead of an input.", "false"],
      ["showButtons", "boolean", "Renders explicit save and cancel check/cross buttons.", "true"],
      ["saveOnBlur", "boolean", "Automatically commits changes on blur.", "true"],
      ["placeholder", "string", "Placeholder text when value is empty.", '"Click to edit…"'],
      ["disabled", "boolean", "Disables editing.", "false"],
    ),
    "Display mode renders a button with accessible label and aria-description. In edit mode, auto-focuses the input, commits with Enter, and cancels with Escape. Save/cancel buttons have accessible tooltips and labels.",
  ),
  "components/responsive-dialog": () => detail(
    `function EditProfileDialog() {
  const [open, setOpen] = useState(false)
  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger className="inline-flex h-9 items-center justify-center rounded-[var(--radius-md)] bg-accent px-3 text-sm font-semibold text-accent-foreground shadow-xs">
        Edit Profile
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent title="Edit Profile" description="Make changes to your profile settings here.">
        <div className="space-y-3 py-2 text-sm">
          <p className="text-muted-foreground">Adapts to a centered modal on desktop and a bottom sheet on mobile.</p>
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose className="inline-flex h-8 items-center justify-center rounded-[var(--radius-md)] border border-border px-3 text-xs font-medium">
            Done
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}`,
    <ResponsiveDialogUsagePreview />,
    api(
      ["open / defaultOpen / onOpenChange", "boolean / (open: boolean) => void", "Controlled or initial open state."],
      ["breakpoint", "string", "Breakpoint for desktop vs mobile rendering.", '"sm" (640px)'],
      ["ResponsiveDialogTrigger", "component", "Trigger element opening the dialog."],
      ["ResponsiveDialogContent", "component", "Dialog body with title, description, and close button."],
      ["ResponsiveDialogHeader / Footer", "components", "Header and footer containers for actions."],
      ["ResponsiveDialogClose", "component", "Dismiss button."],
    ),
    "Renders with role='dialog' or role='alertdialog', aria-modal='true', and links title/description via aria-labelledby and aria-describedby. Traps focus on open, closes with Escape, and restores focus to the trigger on dismiss.",
  ),
  "components/collapsible": () => detail(
    `function RepoDetailsDisclosure() {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-full max-w-md rounded-[var(--radius-md)] border border-border p-3">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Repository Details</span>
          <CollapsibleTrigger className="rounded px-2 py-1 text-xs border border-border bg-surface-muted">
            {open ? "Hide" : "Show"}
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="text-xs text-muted-foreground pt-3 space-y-1">
          <p>Commit: 32188ef</p>
          <p>Branch: components-roadmap</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}`,
    <CollapsibleUsagePreview />,
    api(
      ["open / defaultOpen / onOpenChange", "boolean / (open: boolean) => void", "Controlled or initial expansion state."],
      ["disabled", "boolean", "Disables triggering expansion.", "false"],
      ["CollapsibleTrigger", "component", "Interactive toggle button with aria-expanded."],
      ["CollapsibleContent", "component", "Animated expandable disclosure region with aria-hidden."],
    ),
    "Follows the WAI-ARIA disclosure pattern: CollapsibleTrigger renders a native button with aria-expanded and aria-controls linking directly to CollapsibleContent's unique id.",
  ),
  "components/drag-and-drop": () => detail(
    `function KanbanBoard() {
  const [itemsA, setItemsA] = useState(["Task 1", "Task 2"])
  const [itemsB, setItemsB] = useState(["Task 3"])

  const handleDragEnd = ({ activeId, targetDroppableId }: DragEndEvent) => {
    if (!targetDroppableId) return
    if (targetDroppableId === "col-b" && itemsA.includes(activeId)) {
      setItemsA((prev) => prev.filter((i) => i !== activeId))
      setItemsB((prev) => [...prev, activeId])
    } else if (targetDroppableId === "col-a" && itemsB.includes(activeId)) {
      setItemsB((prev) => prev.filter((i) => i !== activeId))
      setItemsA((prev) => [...prev, activeId])
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <Droppable id="col-a" className="rounded-lg border border-border bg-surface-muted/50 p-3 min-h-[140px] flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">To Do ({itemsA.length})</span>
          {itemsA.map((t) => (
            <Draggable key={t} id={t} className="rounded border border-border bg-surface p-2 text-xs shadow-xs">
              {t}
            </Draggable>
          ))}
        </Droppable>
        <Droppable id="col-b" className="rounded-lg border border-border bg-surface-muted/50 p-3 min-h-[140px] flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">In Progress ({itemsB.length})</span>
          {itemsB.map((t) => (
            <Draggable key={t} id={t} className="rounded border border-border bg-surface p-2 text-xs shadow-xs">
              {t}
            </Draggable>
          ))}
        </Droppable>
      </div>
    </DndContext>
  )
}`,
    <DndUsagePreview />,
    api(
      ["<DndContext onDragStart onDragMove onDragEnd />", "component", "Wraps drag-and-drop hierarchy and manages drag state."],
      ["<Droppable id disabled />", "component", "Defines drop target region, exposes isOver state via render prop or context."],
      ["<Draggable id droppableId disabled />", "component", "Interactive draggable element with keyboard and pointer grab."],
      ["<DragHandle />", "component", "Optional dedicated grab handle button for draggables."],
      ["useDndContext()", "hook", "Provides activeId, activeDroppableId, overDroppableId, and isDragging state."],
      ["useDroppable({ id }) / useDraggable({ id })", "hooks", "Primitive hooks for custom draggable/droppable elements."],
    ),
    "Full keyboard accessible drag-and-drop: Draggables and DragHandles are keyboard focusable buttons with aria-grabbed / aria-roledescription='draggable'. Press Space or Enter to pick up, Arrow keys to navigate between droppable targets, Space or Enter to drop, and Escape to cancel. Position updates are announced politely via aria-live.",
  ),
  "components/pano-tour": () => detail(
    `function PanoTourUsagePreview() {
  const scenes: PanoScene[] = [
    {
      id: "poseidon",
      name: "Poseidon’s Realm (Pool & Pavilions)",
      description: "Main resort swimming pool surrounded by Poseidon, Hestia, Nemea, and Selene pavilions with grill station.",
      image: "/img/resort/360-poseidon.jpg",
      preview: "/img/resort/360-poseidon-preview.jpg",
      yaw: 0,
      pitch: -2,
      fov: 75,
      hotspots: [
        { id: "h1", type: "scene", yaw: 32, pitch: -6, target: "hermes", label: "Hermes Villa", badge: "₱4,500", icon: "footprints", pulse: true },
        { id: "h2", type: "scene", yaw: -75, pitch: -4, target: "olympus", label: "Olympus Function Hall", icon: "door-open" },
        { id: "h3", type: "info", yaw: -18, pitch: -14, label: "Heated Main Pool & 4 Pavilions", description: "Includes 40 infinity chairs, 6 tables, grill station & poolside lounge.", badge: "Included", icon: "waves" },
        { id: "h4", type: "media", yaw: 115, pitch: 4, icon: "image", media: { kind: "image", src: "/img/resort/card-pool.jpg", caption: "Thatch pavilion & poolside lounge" } },
      ],
    },
    {
      id: "hermes",
      name: "Hermes Studio Villa",
      description: "Air-conditioned studio-type villa sleeping up to 5 guests with queen bed, pull-out double, kitchen, and smart TV with Netflix.",
      image: "/img/resort/360-villas.jpg",
      preview: "/img/resort/360-villas-preview.jpg",
      yaw: 10,
      pitch: 0,
      fov: 75,
      hotspots: [
        { id: "h5", type: "scene", yaw: -65, pitch: -5, target: "poseidon", label: "Back to Pool & Pavilions", icon: "waves" },
        { id: "h6", type: "scene", yaw: 95, pitch: -4, target: "grounds", label: "Ceremony Grounds", icon: "trees" },
        { id: "h7", type: "info", yaw: -12, pitch: -8, label: "Studio Suite (Sleeps 5)", description: "Queen bed + pull-out double & single bed, kitchen, heated bath, and smart TV.", icon: "bed" },
        { id: "h8", type: "action", yaw: 28, pitch: -14, action: "book", label: "Book Hermes Villa", badge: "₱4,500", icon: "calendar", pulse: true },
      ],
    },
    {
      id: "olympus",
      name: "Olympus Function Hall",
      description: "Air-conditioned function hall seating 60 to 70 guests comfortably, complete with lobby, cold kitchen, and wireless sound system.",
      image: "/img/resort/360-olympus.jpg",
      preview: "/img/resort/360-olympus-preview.jpg",
      yaw: 0,
      pitch: 0,
      fov: 75,
      hotspots: [
        { id: "h9", type: "scene", yaw: -55, pitch: -4, target: "grounds", label: "Step out to Grounds", icon: "trees" },
        { id: "h10", type: "scene", yaw: 75, pitch: -4, target: "poseidon", label: "Pool & Pavilions", icon: "waves" },
        { id: "h11", type: "info", yaw: 8, pitch: 4, label: "60–70 Seated Event Hall", description: "Includes 100 infinity chairs, 15–20 tables & Bluetooth sound system.", icon: "sparkles" },
      ],
    },
    {
      id: "grounds",
      name: "Resort Ceremony Grounds",
      description: "Open landscaped grounds ideal for outdoor garden weddings, receptions, and full-resort exclusive events.",
      image: "/img/resort/360-grounds.jpg",
      preview: "/img/resort/360-grounds-preview.jpg",
      yaw: 0,
      pitch: 0,
      fov: 75,
      hotspots: [
        { id: "h12", type: "scene", yaw: -45, pitch: -4, target: "hermes", label: "Hermes Villa", icon: "bed" },
        { id: "h13", type: "scene", yaw: 50, pitch: -4, target: "olympus", label: "Olympus Hall", icon: "door-open" },
      ],
    },
  ]
  const [sceneId, setSceneId] = useState<string | number>("poseidon")
  const active = scenes.find((s) => s.id === sceneId) ?? scenes[0]

  return (
    <div className="w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-xl border border-border shadow-sm">
        <PanoViewer
          scenes={scenes}
          sceneId={sceneId}
          onSceneChange={(s) => setSceneId(s.id)}
          autoRotate={1.8}
          showControls
          showFilmstrip
          className="h-[380px] w-full sm:h-[480px] lg:h-[540px]"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-black/65 to-transparent p-2.5 text-white sm:p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-medium text-white/75 sm:text-[11px]">Happy Homes Candelaria</p>
            <p className="truncate text-xs font-semibold sm:text-sm">{active.name}</p>
          </div>
          <div className="pointer-events-auto flex-none">
            <PanoTourButton
              title="Happy Homes Candelaria"
              scenes={scenes}
              startScene={active.id}
              label="360° tour"
              className="text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  )
}`,
    <PanoTourUsagePreview />,
    api(
      ["<PanoViewer scenes sceneId showControls showFilmstrip />", "component", "WebGL2/WebGL1 360° equirectangular panorama viewport with single- or multi-scene navigation, 360° compass radar, hotspot stepper, zoom/spin/fullscreen controls, and custom renderHotspot/renderOverlay slots."],
      ["<PanoTourDialog open onOpenChange title scenes loadScenes />", "component", "Full-screen modal 360° tour player with Walk transitions, filmstrip, gyroscope, fullscreen, and TTS narration captions."],
      ["<PanoTourButton title scenes variant label />", "component", "Chip, link, or solid trigger button that opens PanoTourDialog."],
      ["<PanoTourEditor scenes onScenesChange places allowJsonExport />", "component", "Complete 360° tour management studio with collapsible places catalog, one-click center placement, arrival view picker, drag-reorder scene strip, rich hotspot styler, and JSON export/import."],
      ["<PanoBackdrop scene fallbackPhoto spinSpeed interactive />", "component", "Interactive 360° hero background that respects reduced-motion and pauses when scrolled out of view."],
      ["preparePanorama(file) / PanoEngine", "utilities", "Client-side 2:1 equirectangular validator/resizer and standalone WebGL renderer."],
    ),
    "The 360° viewport exposes role='application' with aria-roledescription='360 degree panorama' and supports full keyboard navigation (Arrow keys to pan/tilt, + and - to zoom). Hotspots are native buttons with aria-expanded for inline notes; PanoTourDialog traps focus, supports Escape dismissal, and provides synchronized spoken descriptions and live captions.",
  ),
}
