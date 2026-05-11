const https = require("https")
const fs = require("fs")
const path = require("path")

// npm deps per component (only non-trivial ones)
const DEPS = {
  accordion: ["@radix-ui/react-accordion"],
  "alert-dialog": ["@radix-ui/react-alert-dialog"],
  avatar: ["@radix-ui/react-avatar"],
  calendar: ["react-day-picker", "date-fns"],
  carousel: ["embla-carousel-react"],
  checkbox: ["@radix-ui/react-checkbox"],
  collapsible: ["@radix-ui/react-collapsible"],
  "color-picker": ["react-colorful"],
  command: ["cmdk"],
  "context-menu": ["@radix-ui/react-context-menu"],
  "date-picker": ["dayjs"],
  dialog: ["@radix-ui/react-dialog"],
  drawer: ["vaul", "@radix-ui/react-dialog"],
  "dropdown-menu": ["@radix-ui/react-dropdown-menu"],
  "hover-card": ["@radix-ui/react-hover-card"],
  "icon-button": ["class-variance-authority"],
  "infinite-slider": ["motion", "react-use-measure"],
  "input-otp": ["input-otp"],
  label: ["@radix-ui/react-label"],
  menubar: ["@radix-ui/react-menubar"],
  "navigation-menu": ["@radix-ui/react-navigation-menu"],
  "password-input": ["lucide-react"],
  popover: ["@radix-ui/react-popover"],
  progress: ["@radix-ui/react-progress"],
  "radio-group": ["@radix-ui/react-radio-group"],
  resizable: ["react-resizable-panels"],
  "scroll-area": ["@radix-ui/react-scroll-area"],
  select: ["@radix-ui/react-select"],
  separator: ["@radix-ui/react-separator"],
  sheet: ["@radix-ui/react-dialog"],
  sidebar: ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"],
  slider: ["@radix-ui/react-slider"],
  sonner: ["sonner", "next-themes"],
  switch: ["@radix-ui/react-switch"],
  tabs: ["@radix-ui/react-tabs"],
  "text-generate-effect": ["motion"],
  "container-text-flip": ["motion"],
  toast: ["@radix-ui/react-toast"],
  toggle: ["@radix-ui/react-toggle"],
  "toggle-group": ["@radix-ui/react-toggle-group"],
  tooltip: ["@radix-ui/react-tooltip"],
  "file-upload": ["lucide-react"],
}

// Components that need an extra hook file
const HOOKS = {
  "file-upload": "hooks/use-file-upload.ts",
  toast: "hooks/use-toast.ts",
}

const BASE =
  "https://raw.githubusercontent.com/betaversionio/ui/main/registry/new-york-v4"

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} fetching ${url}`))
          return
        }
        let data = ""
        res.on("data", (chunk) => (data += chunk))
        res.on("end", () => resolve(data))
      })
      .on("error", reject)
  })
}

module.exports = async function ({ inputs, cwd }) {
  const component = inputs.component
  const outputDir = inputs.outputDir || "components/ui"

  if (!component) throw new Error("inputs.component is required")

  // Fetch and write the main component file
  const compUrl = `${BASE}/ui/${component}.tsx`
  console.log(`  → fetching ${compUrl}`)
  const content = await fetchText(compUrl)

  const destPath = path.join(cwd, outputDir, `${component}.tsx`)
  fs.mkdirSync(path.dirname(destPath), { recursive: true })
  fs.writeFileSync(destPath, content, "utf8")
  console.log(`  ✔ wrote ${outputDir}/${component}.tsx`)

  // Fetch companion hook if needed
  const hookRel = HOOKS[component]
  if (hookRel) {
    const hookUrl = `${BASE}/${hookRel}`
    console.log(`  → fetching ${hookUrl}`)
    const hookContent = await fetchText(hookUrl)
    const hookDest = path.join(cwd, hookRel)
    fs.mkdirSync(path.dirname(hookDest), { recursive: true })
    fs.writeFileSync(hookDest, hookContent, "utf8")
    console.log(`  ✔ wrote ${hookRel}`)
  }

  const deps = DEPS[component] || []
  if (deps.length) {
    console.log(`\n  📦 Install deps:  ${deps.join("  ")}`)
  }

  return { path: destPath, deps }
}
