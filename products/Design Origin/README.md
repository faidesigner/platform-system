# Design Origin

Design Origin is the product surface for the AI design system workspace.

## Source Boundaries

- Runtime app source lives in `app/`.
- Shared React UI must come from `packages/ui`.
- Design tokens must come from `root/foundation` and `root/web`.
- Static HTML files from the imported prototype are kept in `reference/static-prototype/` for comparison only.

## Commands

Run commands from the monorepo root:

```bash
pnpm --filter design-origin dev
pnpm --filter design-origin typecheck
pnpm --filter design-origin build
```

## Notes

Keep product-specific aliases in `app/globals.css`, but do not duplicate primitive token values there.
