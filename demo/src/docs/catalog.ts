export type DocsPageKind = "doc" | "foundation" | "component" | "pattern" | "example" | "resource"

export interface DocsPage {
  slug: string
  title: string
  description: string
  kind: DocsPageKind
  group: string
  aliases?: string[]
  importName?: string
}

export interface DocsGroup {
  label: string
  pages: DocsPage[]
}

const component = (
  title: string,
  description: string,
  group: string,
  aliases: string[] = [],
  importName = title.replace(/\s+/g, ""),
): DocsPage => ({
  slug: `components/${title.toLowerCase().replace(/\s+/g, "-")}`,
  title,
  description,
  kind: "component",
  group,
  aliases,
  importName,
})

const gettingStarted: DocsPage[] = [
  { slug: "docs/introduction", title: "Introduction", description: "What @bzync/rui provides and how the package is structured.", kind: "doc", group: "Getting Started", aliases: ["home", "overview"] },
  { slug: "docs/installation", title: "Installation", description: "Install the package, peer dependencies, and stylesheet.", kind: "doc", group: "Getting Started", aliases: ["install", "setup", "npm"] },
  { slug: "docs/quick-start", title: "Quick Start", description: "Render your first component with the theme provider.", kind: "doc", group: "Getting Started", aliases: ["usage", "first component"] },
  { slug: "docs/configuration", title: "Configuration", description: "Configure themes, fonts, package imports, and app-level behavior.", kind: "doc", group: "Getting Started", aliases: ["config", "provider"] },
]

const foundations: DocsPage[] = [
  { slug: "foundations/colors", title: "Colors", description: "Semantic colors, accent scales, and light/dark surfaces.", kind: "foundation", group: "Foundations", aliases: ["tokens", "palette", "theme"] },
  { slug: "foundations/typography", title: "Typography", description: "Interface, display, and monospace font conventions.", kind: "foundation", group: "Foundations", aliases: ["fonts", "geist"] },
  { slug: "foundations/spacing", title: "Spacing", description: "The compact spacing rhythm used by controls and layouts.", kind: "foundation", group: "Foundations" },
  { slug: "foundations/radius", title: "Radius & shadows", description: "Shape and elevation tokens for layered interfaces.", kind: "foundation", group: "Foundations", aliases: ["rounded", "elevation"] },
  { slug: "foundations/accessibility", title: "Accessibility", description: "Keyboard, focus, semantics, motion, and testing guidance.", kind: "foundation", group: "Foundations", aliases: ["a11y", "aria", "keyboard"] },
]

const actions = [
  component("Button", "Triggers an action or submits a form.", "Actions", ["cta"]),
  component("Button Group", "Groups related actions into a single visual control.", "Actions", ["actions"], "ButtonGroup"),
  component("Toggle", "Switches an action between pressed and unpressed states.", "Actions", ["button toggle"]),
  component("Copy Button", "Copies a provided value with visible feedback.", "Actions", ["clipboard"], "CopyButton"),
  component("Info Button", "An accessible icon-only information action.", "Actions", ["icon button"], "InfoButton"),
  component("Billing Interval Toggle", "Switches between monthly and annual billing intervals.", "Actions", [], "BillingIntervalToggle"),
]

const forms = [
  component("Input", "Collects a single line of text with label, hint, and error states.", "Forms", ["text field"]),
  component("Textarea", "Collects multi-line text with consistent field messaging.", "Forms"),
  component("Select", "Selects one or multiple values from a keyboard-accessible listbox.", "Forms", ["dropdown", "listbox"]),
  component("Autocomplete", "Filters suggestions while the user types.", "Forms", ["combobox", "typeahead"]),
  component("Checkbox", "Selects an independent boolean option.", "Forms", ["check"]),
  component("Switch", "Toggles a setting with immediate effect.", "Forms", ["toggle"]),
  component("Radio Group", "Selects exactly one option from a related set.", "Forms", ["radio"], "RadioGroup"),
  component("Slider", "Selects a numeric value from a range.", "Forms", ["range"]),
  component("Number Input", "Edits numeric values with increment and decrement controls.", "Forms", [], "NumberInput"),
  component("OTP Input", "Collects fixed-length one-time passcodes.", "Forms", ["code", "verification"], "OtpInput"),
  component("File Upload", "Selects one or more local files.", "Forms", ["dropzone"], "FileUpload"),
  component("Date Picker", "Selects a date through an input and calendar.", "Forms", ["date"], "DatePicker"),
  component("Time Picker", "Selects a time with native keyboard and mobile controls.", "Forms", ["time"], "TimePicker"),
  component("Calendar", "Displays selectable month and week calendar views.", "Forms"),
  component("Label", "Provides an accessible label for a form control.", "Forms"),
  component("Form Field", "Composes labels, descriptions, errors, and controls.", "Forms", [], "FormField"),
  component("Toggle Group", "Selects one or multiple options in a compact button group.", "Forms", ["segmented control"], "ToggleGroup"),
  component("Rating", "Collects a rating with accessible radio controls.", "Forms", ["stars", "review"]),
]

const display = [
  component("Aspect Ratio", "Constrains media and previews to a consistent proportion.", "Display", ["responsive media"], "AspectRatio"),
  component("Badge", "Displays compact status or category metadata.", "Display", ["pill"]),
  component("Avatar", "Represents a person with an image or initials fallback.", "Display"),
  component("Avatar Group", "Displays a compact collection of people and overflow count.", "Display", ["people stack"], "AvatarGroup"),
  component("Blockquote", "Presents a quotation with optional source attribution.", "Display", ["quote"]),
  component("Card", "Groups related content and actions.", "Display", ["panel"]),
  component("Callout", "Highlights a note, warning, or important instruction.", "Display", ["note"]),
  component("Currency", "Formats monetary values by currency and locale.", "Display", ["money", "amount", "price"]),
  component("Description List", "Displays structured term and value metadata.", "Display", ["details", "metadata"], "DescriptionList"),
  component("Divider", "Separates content with responsive horizontal or vertical rules.", "Display", ["separator", "rule"]),
  component("Tag", "Displays removable or static taxonomy values.", "Display", ["chip"]),
  component("Kbd", "Displays keyboard shortcuts and key sequences.", "Display", ["keyboard"]),
  component("Status Dot", "Communicates presence or operational status.", "Display", [], "StatusDot"),
  component("Stat", "Displays a labeled value and optional trend.", "Display", ["metric"]),
  component("Link", "Provides styled inline navigation.", "Display", ["anchor"]),
  component("List", "Renders structured lists with consistent density.", "Display"),
  component("Timeline", "Displays chronological events.", "Display", ["activity"]),
  component("Tree", "Displays expandable hierarchical data.", "Display", ["filesystem"]),
  component("Scroll Area", "Provides a bounded, keyboard-scrollable content region.", "Display", ["overflow"], "ScrollArea"),
]

const feedback = [
  component("Alert", "Communicates persistent status and feedback.", "Feedback", ["banner", "notification"]),
  component("Snackbar", "Shows transient application feedback.", "Feedback", ["toast", "notification"]),
  component("Spinner", "Indicates indeterminate progress.", "Feedback", ["loading"]),
  component("Skeleton", "Reserves layout while content loads.", "Feedback", ["loading"]),
  component("Progressbar", "Shows determinate progress toward completion.", "Feedback", ["progress"]),
  component("Empty State", "Explains an empty view and offers a next action.", "Feedback", [], "EmptyState"),
  component("Error State", "Explains a failed view and recovery action.", "Feedback", [], "ErrorState"),
]

const overlays = [
  component("Modal", "Presents a focused task in an accessible modal dialog.", "Overlays", ["dialog"]),
  component("Confirm Dialog", "Confirms a consequential action.", "Overlays", ["confirmation"], "ConfirmDialog"),
  component("Drawer", "Presents contextual content from a viewport edge.", "Overlays", ["sheet"]),
  component("Popover", "Displays contextual interactive content near a trigger.", "Overlays"),
  component("Dropdown Menu", "Presents a keyboard-navigable menu of actions.", "Overlays", ["dropdown", "menu"], "DropdownMenu"),
  component("Tooltip", "Provides concise supplementary text on hover or focus.", "Overlays"),
  component("Command", "Searches and runs commands from a command palette.", "Overlays", ["cmdk", "command palette"]),
]

const navigation = [
  component("Breadcrumb", "Shows location within a hierarchy.", "Navigation", ["breadcrumbs"]),
  component("Tabs", "Switches between related panels without leaving the page.", "Navigation"),
  component("Accordion", "Expands and collapses sections of content.", "Navigation", ["disclosure"]),
  component("Pagination", "Moves through paged data.", "Navigation", ["pages"]),
  component("Stepper", "Shows progress through a sequence.", "Navigation", ["steps"]),
  component("Navigation", "Provides navbar, sidebar, topbar, and bottom bar primitives.", "Navigation", ["navbar", "sidebar", "bottom bar"]),
]

const data = [
  component("Table", "Provides responsive semantic table primitives.", "Data"),
  component("Data Table", "Adds sorting, search, loading, and pagination to tabular data.", "Data", ["grid"], "DataTable"),
  component("Bar Chart", "Compares categorical values with bars.", "Data visualization", [], "BarChart"),
  component("Line Chart", "Shows change across an ordered series.", "Data visualization", [], "LineChart"),
  component("Multi Line Chart", "Compares multiple ordered series.", "Data visualization", [], "MultiLineChart"),
  component("Donut Chart", "Shows proportional parts of a whole.", "Data visualization", [], "DonutChart"),
  component("Scatter Chart", "Shows relationships between two numeric variables.", "Data visualization", [], "ScatterChart"),
  component("Gantt Chart", "Displays tasks across time.", "Data visualization", [], "GanttChart"),
  component("Heatmap Chart", "Displays magnitude across a matrix.", "Data visualization", [], "HeatmapChart"),
  component("Radar Chart", "Compares multivariate profiles.", "Data visualization", [], "RadarChart"),
  component("Funnel Chart", "Shows values across sequential stages.", "Data visualization", [], "FunnelChart"),
  component("Waterfall Chart", "Explains cumulative positive and negative changes.", "Data visualization", [], "WaterfallChart"),
]

const editors = [
  component("Code Block", "Displays highlighted, copyable source code.", "Editors", ["syntax"], "CodeBlock"),
  component("Code Editor", "Provides a lightweight editable code surface.", "Editors", [], "CodeEditor"),
  component("Rich Text", "Displays and edits formatted rich text.", "Editors", ["wysiwyg"], "RichTextEditor"),
  component("Terminal", "Displays terminal output and an interactive shell emulator.", "Editors", ["console"], "TerminalEmulator"),
]

const typography = [
  component("Heading", "Renders semantic, responsively scaled headings.", "Typography", ["title"]),
  component("Text", "Renders interface copy plus localized date and time text.", "Typography", ["paragraph", "copy", "date", "time"]),
  component("Prose", "Styles responsive long-form document content.", "Typography", ["article", "content"]),
  component("Inline Code", "Displays inline code and technical tokens.", "Typography", ["code"], "InlineCode"),
]

export const componentGroups: DocsGroup[] = [
  { label: "Actions", pages: actions },
  { label: "Forms", pages: forms },
  { label: "Display", pages: display },
  { label: "Feedback", pages: feedback },
  { label: "Overlays", pages: overlays },
  { label: "Navigation", pages: navigation },
  { label: "Data", pages: data },
  { label: "Typography", pages: typography },
  { label: "Editors", pages: editors },
]

const patterns: DocsPage[] = [
  { slug: "patterns/forms", title: "Forms", description: "Compose labeled, validated settings forms.", kind: "pattern", group: "Patterns", aliases: ["validation"] },
  { slug: "patterns/data-display", title: "Data display", description: "Present, search, and act on operational data.", kind: "pattern", group: "Patterns", aliases: ["table"] },
  { slug: "patterns/feedback", title: "Feedback", description: "Choose persistent, transient, and blocking feedback.", kind: "pattern", group: "Patterns", aliases: ["alerts", "toast"] },
  { slug: "patterns/empty-states", title: "Empty states", description: "Explain absent data and provide a useful next step.", kind: "pattern", group: "Patterns" },
]

const examples: DocsPage[] = [
  { slug: "examples/settings", title: "Settings", description: "A realistic notification and account settings screen.", kind: "example", group: "Examples" },
  { slug: "examples/authentication", title: "Authentication", description: "A compact, accessible sign-in form.", kind: "example", group: "Examples", aliases: ["login", "sign in"] },
  { slug: "examples/team-management", title: "Team management", description: "A searchable team member table with actions.", kind: "example", group: "Examples", aliases: ["users", "members"] },
]

const resources: DocsPage[] = [
  { slug: "resources/component-api", title: "Component API", description: "Browse the complete public component inventory.", kind: "resource", group: "Resources", aliases: ["props", "reference"] },
  { slug: "resources/accessibility", title: "Accessibility guide", description: "Implementation and verification guidance for accessible interfaces.", kind: "resource", group: "Resources", aliases: ["a11y"] },
  { slug: "resources/contributing", title: "Contributing", description: "Repository conventions and verification commands.", kind: "resource", group: "Resources" },
]

export const docsGroups: DocsGroup[] = [
  { label: "Getting Started", pages: gettingStarted },
  { label: "Foundations", pages: foundations },
  { label: "Components", pages: [{ slug: "components", title: "Overview", description: "Browse every public component by category.", kind: "doc", group: "Components", aliases: ["all components"] }] },
  ...componentGroups,
  { label: "Patterns", pages: patterns },
  { label: "Examples", pages: examples },
  { label: "Resources", pages: resources },
]

export const allPages = docsGroups.flatMap((group) => group.pages)
export const orderedPages = [
  ...gettingStarted,
  ...foundations,
  ...componentGroups.flatMap((group) => group.pages),
  ...patterns,
  ...examples,
  ...resources,
]

export function getPage(slug: string) {
  return allPages.find((page) => page.slug === slug) ?? gettingStarted[0]
}

export function hrefFor(slug: string) {
  return `#/${slug}`
}

export function readHash() {
  const slug = window.location.hash.replace(/^#\/?/, "")
  return allPages.some((page) => page.slug === slug) ? slug : "docs/introduction"
}
