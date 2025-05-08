# create-next-shadcn

A CLI tool to quickly set up a Next.js project with Shadcn UI components. This tool streamlines the process of creating a new Next.js project with all the necessary configurations for Shadcn UI.

## Features

- 🚀 Creates a new Next.js project
- 🎨 Sets up Tailwind CSS configuration
- 🛠 Initializes Shadcn UI with proper configuration
- 📦 Adds all Shadcn UI components automatically
- 🏗 Supports monorepo structure
- 🔌 Optional Supabase integration
- 📊 Multiple package manager support (npm, yarn, pnpm)
- ⚡ Zero configuration required
- 🎯 Interactive CLI experience
- 🔄 Version management with tags (latest, beta, canary)

## Prerequisites

- Node.js (version 14.0.0 or later)
- One of the following package managers:
  - npm (v6 or later)
  - yarn (v1.22 or later)
  - pnpm (v6 or later)

## Quick Start

```bash
# Create a new project
mkdir my-project
cd my-project
npx create-next-shadcn@latest
```

## Installation Options

You can use different versions based on your needs:

```bash
# Latest stable version
npx create-next-shadcn@latest

# Beta version
npx create-next-shadcn@beta

# Canary version (bleeding edge)
npx create-next-shadcn@canary
```

## Command Line Options

```bash
npx create-next-shadcn [options]

Options:
  -h, --help     Show help information
  -v, --version  Show CLI version
```

## Interactive Setup

The CLI will guide you through the following options:

1. **Package Manager Selection**

   - `npm` (default)
   - `yarn`
   - `pnpm`

2. **Project Structure**

   - Standard Next.js project
   - Monorepo structure with `apps` directory

3. **Supabase Integration**
   - Optional authentication setup
   - Database configuration
   - Environment variables setup

### Project Structure

#### Standard Structure

```
my-project/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/          # Shadcn UI components
├── lib/
│   └── utils.ts
├── styles/
│   └── globals.css
├── public/
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
├── package.json
└── components.json
```

#### Monorepo Structure

```
my-project/
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       │   └── ui/
│       ├── lib/
│       ├── styles/
│       ├── public/
│       ├── tailwind.config.js
│       └── package.json
├── packages/        # Shared packages (optional)
└── package.json
```

## Configuration

### Tailwind CSS

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
 ],
 theme: {
  extend: {},
 },
 plugins: [],
};
```

### Available Shadcn Components

All components are automatically installed in `components/ui/`:

- Accordion
- Alert Dialog
- Button
- Calendar
- Card
- Dropdown Menu
- Form
- Input
- Modal
- and more...

## Development Workflow

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev

# For monorepo projects
cd apps/web
npm run dev
```

## Troubleshooting

### Common Issues

1. **Node Version Error**

   ```bash
   Error: Node.js version 14.0.0 or higher is required
   Solution: nvm install 14 && nvm use 14
   ```

2. **Directory Not Empty**

   ```bash
   Error: Directory not empty
   Solution: mkdir new-project && cd new-project
   ```

3. **Package Manager Conflicts**

   ```bash
   Error: Mixing package managers
   Solution: Use the same package manager consistently
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See [LICENSE](LICENSE) for details.

## Author

Sudeepta Sarkar ([@sudsarkar13](https://github.com/sudsarkar13))

## Support

- 📚 [Documentation](https://github.com/sudsarkar13/starter-apps/tree/main/create-next-shadcn#readme)
- 🐛 [Issue Tracker](https://github.com/sudsarkar13/starter-apps/issues)
- 💬 [Discussions](https://github.com/sudsarkar13/starter-apps/discussions)
