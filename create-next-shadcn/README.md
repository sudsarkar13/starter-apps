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

## Prerequisites

- Node.js (version 14.0.0 or later)
- One of the following package managers:
  - npm (v6 or later)
  - yarn (v1.22 or later)
  - pnpm (v6 or later)

## Installation

You don't need to install this package globally. You can use it directly with npx:

```bash
npx create-next-shadcn@canary
```

## Usage

### Basic Usage

1. Create a new directory for your project:

   ```bash
   mkdir my-project
   cd my-project
   ```

2. Run the CLI:

   ```bash
   npx create-next-shadcn@canary
   ```

### Interactive Setup

The CLI will guide you through the following options:

1. **Package Manager Selection**

   - Choose between npm, yarn, or pnpm
   - Default: npm

2. **Project Structure**

   - Standard Next.js project
   - Monorepo structure (creates an `apps` directory)

3. **Supabase Integration**
   - Option to include Supabase setup
   - Adds authentication and database configurations

### Project Structure

#### Standard Structure

```directory
my-project/
├── app/
├── components/
│   └── ui/
├── styles/
├── public/
├── tailwind.config.js
├── package.json
└── components.json
```

#### Monorepo Structure

```directory
my-project/
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       │   └── ui/
│       ├── styles/
│       ├── public/
│       ├── tailwind.config.js
│       └── package.json
└── package.json
```

## Configuration

### Tailwind CSS

The tool automatically configures Tailwind CSS with the following setup:

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

### Shadcn UI Components

All Shadcn UI components are automatically installed and configured. You can find them in the `components/ui` directory.

## Development

After installation, you can start the development server:

```bash
# For standard projects
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

   - Error: "Node.js version 14.0.0 or higher is required"
   - Solution: Update Node.js to a newer version

2. **Directory Not Empty**

   - Error: "Directory not empty"
   - Solution: Use a new directory or remove existing files

3. **Package Manager Conflicts**
   - Solution: Use the same package manager throughout the project

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See [LICENSE](LICENSE) for details.

## Author

Sudeepta Sarkar ([@sudsarkar13](https://github.com/sudsarkar13))

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/sudsarkar13/starter-apps/issues) page.
