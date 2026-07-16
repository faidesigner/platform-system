window.SYSTEM_VISUALIZER_DATA = {
  updatedAt: "2026-07-14",
  repo: {
    name: "platform-system",
    summary: "Web platform design system repository",
    automation: [
      {
        label: "Token sync",
        status: "active",
        detail: "JSON token source generates CSS for platform use.",
        source: "scripts/sync-tokens.js"
      },
      {
        label: "Token watch",
        status: "active",
        detail: "Local changes can regenerate token CSS while designing.",
        source: "scripts/watch-tokens.js"
      },
      {
        label: "Figma variables",
        status: "connected",
        detail: "Importer and visualizer plugins exist for foundation variables.",
        source: "tools/figma-variable-importer"
      },
      {
        label: "Component generator",
        status: "prototype",
        detail: "Figma component specs can be translated into implementation guidance.",
        source: "tools/figma-component-generator"
      }
    ]
  },
  metrics: [
    { label: "Foundation token files", value: 10, caption: "JSON source files" },
    { label: "Foundation docs", value: 11, caption: "Markdown overviews" },
    { label: "Component specs", value: 5, caption: "Documented web specs" },
    { label: "UI components", value: 40, caption: "React TSX files" }
  ],
  foundation: [
    {
      name: "Color Global",
      path: "root/foundation/docs/color-global.md",
      overview: "Primitive palette for shared product color language.",
      tokens: [
        { name: "green.500", value: "#39db1f", type: "color" },
        { name: "blue.500", value: "#2388f6", type: "color" },
        { name: "gray.900", value: "#1f2023", type: "color" },
        { name: "sand.50", value: "#f6f6f1", type: "color" }
      ]
    },
    {
      name: "Color Semantic",
      path: "root/foundation/docs/color-semantic.md",
      overview: "Light and dark semantic aliases for background, text, icon, border, fill, and interaction states.",
      tokens: [
        { name: "light.bg.100", value: "{color.white}", type: "alias" },
        { name: "light.text.basic.primary", value: "{color.gray.900}", type: "alias" },
        { name: "light.filled.optional.brand-primary", value: "{color.green.500}", type: "alias" },
        { name: "dark.bg.100", value: "{color.gray.900}", type: "alias" }
      ]
    },
    {
      name: "Spacing",
      path: "root/foundation/docs/spacing.md",
      overview: "Size, spacing, padding, and corner radius scale used as layout primitives.",
      tokens: [
        { name: "size.8", value: "0.5rem", type: "dimension" },
        { name: "size.16", value: "1rem", type: "dimension" },
        { name: "spacing.XL", value: "{size.24}", type: "alias" },
        { name: "cornerRadius.S", value: "{size.8}", type: "alias" }
      ]
    },
    {
      name: "Motion",
      path: "root/foundation/docs/motion.md",
      overview: "Duration and easing scale for interaction feedback and interface transitions.",
      tokens: [
        { name: "duration.fast", value: "tokenized", type: "motion" },
        { name: "duration.normal", value: "tokenized", type: "motion" },
        { name: "easing.standard", value: "tokenized", type: "motion" },
        { name: "easing.emphasized", value: "tokenized", type: "motion" }
      ]
    }
  ],
  components: [
    {
      name: "Button",
      status: "Final",
      md: "root/components/web/ui/button.md",
      code: "packages/ui/components/Button.tsx",
      overview: "Primary action component with tone, size, shape, impact, loading, and icon states.",
      properties: [
        { name: "tone", type: "primary | secondary | tertiary | assistive | brandAssistive", default: "primary" },
        { name: "size", type: "xl | l | m | s", default: "m" },
        { name: "shape", type: "square | round", default: "square" },
        { name: "impact", type: "boolean", default: "false" },
        { name: "loading", type: "boolean", default: "false" },
        { name: "icon", type: "ReactNode", default: "undefined" }
      ]
    },
    {
      name: "Navigation Bar",
      status: "Documented",
      md: "root/components/web/layout/navigation-bar.md",
      code: "packages/ui/components/NavigationBar.tsx",
      overview: "Global navigation structure for product routes, language, and utility actions.",
      properties: [
        { name: "locale", type: "routing locale", default: "ko" },
        { name: "items", type: "navigation item[]", default: "site config" },
        { name: "variant", type: "desktop | tablet | mobile", default: "responsive" }
      ]
    },
    {
      name: "Header",
      status: "Documented",
      md: "root/components/web/layout/header.md",
      code: "packages/ui/components/Header.tsx",
      overview: "Page-level introduction and structural heading pattern.",
      properties: [
        { name: "title", type: "string", default: "required" },
        { name: "description", type: "string", default: "optional" },
        { name: "action", type: "ReactNode", default: "optional" }
      ]
    },
    {
      name: "Footer",
      status: "Documented",
      md: "root/components/web/layout/footer.md",
      code: "packages/ui/components/Footer.tsx",
      overview: "Brand, company links, social channels, and policy area.",
      properties: [
        { name: "brand", type: "logo config", default: "FAI" },
        { name: "links", type: "footer group[]", default: "site config" },
        { name: "social", type: "social link[]", default: "optional" }
      ]
    }
  ],
  guidelines: [
    {
      name: "UX Writing",
      status: "planned",
      signal: "No guideline source found yet",
      next: "Define tone, error messages, empty states, and action copy."
    },
    {
      name: "Accessibility",
      status: "planned",
      signal: "Component focus rules exist, full guideline pending",
      next: "Document keyboard order, contrast target, and ARIA usage."
    },
    {
      name: "Responsive Layout",
      status: "seeded",
      signal: "Grid token docs exist under root/web/docs/grid.md",
      next: "Connect layout examples to product templates."
    }
  ]
};
