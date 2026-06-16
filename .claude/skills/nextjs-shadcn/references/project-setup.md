# Project Setup

## Create New Project

### Minimal Setup

Use the CLI to scaffold a Next.js project directly:

```bash
bunx --bun shadcn@latest init -t next
```

### With Preset Code

```bash
bunx --bun shadcn@latest init --preset <CODE> --template next
```

Preset codes are short opaque strings from [ui.shadcn.com/create](https://ui.shadcn.com/create). Pass them directly — don't decode them. Prefer this when you want a specific visual system without hardcoding individual style, font, or icon choices into the skill:

```bash
bunx --bun shadcn@latest init --preset b4h07r5A1 --template next
```

### Monorepo

```bash
bunx --bun shadcn@latest init \
  --template next \
  --monorepo
```

### Existing Project

If the Next.js app already exists, run the initializer from the project root:

```bash
bunx --bun shadcn@latest init
```

### Inspect Before Changing

Use the CLI to inspect project state or preview registry changes before writing files:

```bash
bunx --bun shadcn@latest info
bunx --bun shadcn@latest add button --dry-run
bunx --bun shadcn@latest docs button
```

## Add Components

```bash
# Single component
bunx --bun shadcn@latest add button

# Multiple components
bunx --bun shadcn@latest add button card input

# All components
bunx --bun shadcn@latest add --all
```

## Common Dependencies

```bash
# Forms
bun add react-hook-form @hookform/resolvers zod

# AI
bun add ai @ai-sdk/anthropic

# Animation
bun add motion              # For Motion
bun add gsap @gsap/react    # For GSAP

# Icons (pick one)
bun add lucide-react        # Default
```

## Project Structure After Setup

```
project/
├── app/
│   ├── globals.css         # Theme tokens
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   └── ui/                 # shadcn components
├── lib/
│   └── utils.ts            # cn() helper
├── public/
├── components.json         # shadcn config
├── tsconfig.json
└── package.json
```

## Bun Commands Reference

| Task                 | Command                                  |
| -------------------- | ---------------------------------------- |
| Install deps         | `bun install`                            |
| Add package          | `bun add package`                        |
| Dev server           | `bun --bun next dev`                     |
| Build                | `bun --bun next build`                   |
| Start prod           | `bun --bun next start`                   |
| Add shadcn component | `bunx --bun shadcn@latest add component` |
| Create project       | `bunx --bun shadcn@latest init -t next`  |
