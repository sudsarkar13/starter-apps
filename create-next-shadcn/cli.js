#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import semver from "semver";
import { fileURLToPath } from "url";
import { dirname } from "path";
import chalk from "chalk";
import pkg from "enquirer";

class CLIError extends Error {
	constructor(message, code = 1) {
		super(message);
		this.name = "CLIError";
		this.code = code;
	}
}

const { Select, Toggle } = pkg;

// Get package.json for version info
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
	fs.readFileSync(path.join(__dirname, "package.json"), "utf8")
);

// Add help text
function showHelp() {
	console.log(`
create-next-shadcn v${packageJson.version}

A CLI tool to quickly set up a Next.js project with Shadcn UI components.

Usage:
  npx create-next-shadcn [options]

Options:
  -h, --help     Show this help message
  -v, --version  Show version number
  
Commands:
  npx create-next-shadcn         Create a new Next.js project with Shadcn UI
  npx create-next-shadcn --help  Show help information

Examples:
  # Create a new project
  npx create-next-shadcn

  # Show version
  npx create-next-shadcn --version

Features:
  • Next.js setup with Shadcn UI
  • Tailwind CSS configuration
  • All Shadcn UI components
  • Monorepo support
  • Supabase integration (optional)
  • Multiple package manager support (npm, yarn)

For more information, visit: ${packageJson.homepage}
`);
	process.exit(0);
}

// Add version display
function showVersion() {
	console.log(`create-next-shadcn v${packageJson.version}`);
	process.exit(0);
}

// Parse command line arguments
function parseArgs() {
	const args = process.argv.slice(2);
	if (args.length > 0) {
		switch (args[0]) {
			case "--help":
			case "-h":
				showHelp();
				break;
			case "--version":
			case "-v":
				showVersion();
				break;
			default:
				console.error(`Unknown option: ${args[0]}`);
				console.log("Use --help to see available options");
				process.exit(1);
		}
	}
}

console.log("Setting up your Next.js project with shadcn...");

function isDirEmpty(dirname) {
	return fs.readdirSync(dirname).length === 0;
}

function createTailwindConfig() {
	const content = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
	fs.writeFileSync("tailwind.config.js", content.trim());
	console.log("Created tailwind.config.js");
}

function createProject(projectName, useSupabase, packageManager, isMonorepo) {
	const currentDir = process.cwd();
	let nextAppDir = currentDir;

	try {
		console.log(
			`\nSetting up your Next.js project with shadcn in ${projectName}...`
		);

		if (isMonorepo) {
			// Setup Turborepo structure first
			setupTurboRepo(packageManager);
			process.chdir("apps");
			nextAppDir = path.join(currentDir, "apps", "web");
		}

		// Create project directory for the app
		const appDir = isMonorepo ? "web" : ".";
		if (appDir !== ".") {
			fs.mkdirSync(appDir, { recursive: true });
			process.chdir(appDir);
		}

		// Create Next.js app
		if (useSupabase) {
			execSync(`npx create-next-app -e with-supabase .`, { stdio: "inherit" });
		} else {
			// Always use npx for create-next-app regardless of package manager
			execSync(`npx create-next-app@latest .`, { stdio: "inherit" });

			// After project creation, update package.json
			const projectPackageJson = JSON.parse(
				fs.readFileSync("package.json", "utf8")
			);
			delete projectPackageJson.packageManager;
			if (isMonorepo) {
				projectPackageJson.name = "@repo/web";
			}
			fs.writeFileSync(
				"package.json",
				JSON.stringify(projectPackageJson, null, 2)
			);

			// After project creation, update package manager if not npm
			if (packageManager === "yarn") {
				if (fs.existsSync("package-lock.json")) {
					fs.unlinkSync("package-lock.json");
				}
				if (fs.existsSync("node_modules")) {
					fs.rmSync("node_modules", { recursive: true, force: true });
				}
				execSync("yarn install", { stdio: "inherit" });
				console.log(`\nEnabling Corepack to upgrade Yarn in the project...`);
				execSync("corepack enable", { stdio: "inherit" });
				execSync("yarn set version berry", { stdio: "inherit" });
				execSync("yarn install", { stdio: "inherit" });
			}
		}

		// Initialize shadcn in the Next.js app directory
		if (!fs.existsSync("tailwind.config.js")) {
			createTailwindConfig();
		}

		if (fs.existsSync("components.json")) {
			fs.unlinkSync("components.json");
			console.log("Removed existing components.json");
		}
		console.log("Initializing shadcn...");
		execSync(`npx shadcn@latest init --yes`, { stdio: "inherit" });

		console.log("Adding all shadcn components...");
		execSync(`npm install --legacy-peer-deps @radix-ui/react-icons`, {
			stdio: "inherit",
		});
		execSync(`npx shadcn@latest add --all --yes`, { stdio: "inherit" });

		// For monorepo, create shared UI package
		if (isMonorepo) {
			process.chdir(currentDir);
			const uiDir = "packages/ui";
			fs.mkdirSync(uiDir, { recursive: true });

			const uiPackageJson = {
				name: "@repo/ui",
				version: "0.0.0",
				private: true,
				main: "./index.ts",
				types: "./index.ts",
				scripts: {
					lint: "eslint .",
					build: "tsup",
				},
			};

			fs.writeFileSync(
				path.join(uiDir, "package.json"),
				JSON.stringify(uiPackageJson, null, 2)
			);
			console.log(chalk.green("✓ Created UI package"));
		}

		// Return to project root
		process.chdir(currentDir);
	} catch (error) {
		// Handle errors and cleanup
		process.chdir(currentDir);
		throw new CLIError(`Failed to create project: ${error.message}`, 2);
	}
}

// Version check utility
function checkNodeVersion() {
	const requiredVersion = "14.0.0";
	if (semver.lt(process.version, requiredVersion)) {
		throw new Error(
			`Node.js version ${requiredVersion} or higher is required. Current version: ${process.version}`
		);
	}
}

// Progress indicator
function showSpinner(text) {
	const frames = ["-", "\\", "|", "/"];
	let i = 0;
	return setInterval(() => {
		process.stdout.write(`\r${text} ${frames[(i = ++i % frames.length)]}`);
	}, 100);
}

// Package manager selection
async function askForPackageManager() {
	const prompt = new Select({
		name: "package-manager",
		message:
			"Choose a package manager:" +
			chalk.gray("   Use ↑/↓ arrows to select, return to confirm"),
		choices: ["npm", "yarn"],
		styles: {
			primary: chalk.cyan,
			selected: chalk.green,
			pointer: () => chalk.green("❯"),
		},
	});

	const answer = await prompt.run();
	return answer;
}

// Project type selection
async function askForProjectType() {
	const prompt = new Select({
		name: "project-type",
		message:
			"Choose project type:" +
			chalk.gray("   Use ↑/↓ arrows to select, return to confirm"),
		choices: [
			{ name: "standard", message: "Next.js" },
			{ name: "monorepo", message: "Next.js (Monorepo)" },
		],
		styles: {
			primary: chalk.cyan,
			selected: chalk.green,
			pointer: () => chalk.green("❯"),
		},
	});

	const answer = await prompt.run();
	return answer === "monorepo";
}

// Supabase integration prompt
async function askUserForSupabase() {
	const prompt = new Toggle({
		name: "supabase",
		message: "Would you like to integrate Supabase?",
		enabled: "Yes",
		disabled: "No",
		styles: {
			primary: chalk.cyan,
			enabled: chalk.green,
			disabled: chalk.red,
		},
	});

	return await prompt.run();
}

function setupTurboRepo(packageManager) {
	const turboConfig = {
		$schema: "https://turborepo.org/schema.json",
		pipeline: {
			build: {
				dependsOn: ["^build"],
				outputs: [".next/**", "dist/**"],
			},
			dev: {
				cache: false,
				persistent: true,
			},
			lint: {
				outputs: [],
			},
			test: {
				dependsOn: ["build"],
				inputs: [
					"src/**/*.tsx",
					"src/**/*.ts",
					"test/**/*.ts",
					"test/**/*.tsx",
				],
			},
		},
	};

	// Create root package.json for monorepo
	const rootPackageJson = {
		name: "shadcn-turborepo",
		version: "1.0.0",
		private: true,
		workspaces: ["apps/web/*", "packages/*"],
		scripts: {
			build: "turbo run build",
			dev: "turbo run dev",
			lint: "turbo run lint",
			test: "turbo run test",
		},
	};

	// Create necessary directories
	fs.mkdirSync("apps", { recursive: true });
	fs.mkdirSync("packages", { recursive: true });

	// Write turbo.json
	fs.writeFileSync("turbo.json", JSON.stringify(turboConfig, null, 2));
	console.log(chalk.green("✓ Created turbo.json"));

	// Write root package.json
	fs.writeFileSync("package.json", JSON.stringify(rootPackageJson, null, 2));
	console.log(chalk.green("✓ Created root package.json"));

	// Install turborepo
	console.log("\nInitializing Turborepo...");
	if (packageManager === "yarn") {
		execSync("yarn add turbo -W -D", { stdio: "inherit" });
	} else {
		execSync("npm install turbo -D", { stdio: "inherit" });
	}

	console.log(chalk.green("\n✓ Turborepo initialized successfully"));
}

try {
	// Parse command line arguments first
	parseArgs();

	// Check Node.js version first
	checkNodeVersion();

	const currentDir = process.cwd();
	const projectName = path.basename(currentDir);

	console.log("\nNext.js + Shadcn UI Project Setup\n");

	// Gather all user inputs first
	const packageManager = await askForPackageManager();
	const isMonorepo = await askForProjectType();
	const useSupabase = await askUserForSupabase();

	// Show installation summary
	console.log("\nInstallation Summary:");
	console.log(chalk.cyan("-------------------"));
	console.log(`• Project Name: ${chalk.green(projectName)}`);
	console.log(`• Package Manager: ${chalk.green(packageManager)}`);
	console.log(
		`• Project Type: ${chalk.green(
			isMonorepo ? "Monorepo" : "Standard Next.js"
		)}`
	);
	console.log(
		`• Supabase Integration: ${
			useSupabase ? chalk.green("Yes") : chalk.red("No")
		}`
	);
	console.log(chalk.cyan("-------------------\n"));

	// Start installation with spinner
	const spinner = showSpinner("Creating project");

	createProject(projectName, useSupabase, packageManager, isMonorepo);
	clearInterval(spinner);
	process.stdout.write("\r\n");

	// Setup Turborepo if monorepo
	if (isMonorepo) {
		setupTurboRepo(packageManager);
	}

	console.log(chalk.green("\n✨ Setup completed successfully!"));
	if (isMonorepo) {
		console.log(chalk.green("\nMonorepo structure created:"));
		console.log(
			chalk.cyan("  apps/web          ") +
				"- Next.js application with Shadcn UI"
		);
		console.log(chalk.cyan("  packages/ui       ") + "- Shared UI components");

		console.log("\nNext steps:");
		console.log("1. Install dependencies:");
		console.log(chalk.cyan(`   ${packageManager} install`));

		console.log("\n2. Start the development server:");
		console.log(chalk.cyan(`   ${packageManager} run dev`));

		console.log("\nAvailable commands:");
		console.log(chalk.yellow("  dev   ") + "- Start the development server");
		console.log(
			chalk.yellow("  build ") + "- Build all applications and packages"
		);
		console.log(
			chalk.yellow("  lint  ") + "- Lint all applications and packages"
		);
		console.log(
			chalk.yellow("  test  ") + "- Test all applications and packages"
		);

		console.log("\nTo add more Shadcn UI components later:");
		console.log("1. Change to the web app directory:");
		console.log(chalk.cyan("   cd apps/web"));
		console.log("2. Add components using shadcn-ui:");
		console.log(chalk.cyan("   npx shadcn@latest add [component-name]"));
	} else {
		console.log(`\nYour new project is ready in '${projectName}'`);
		console.log("\nTo start developing, run:");
		console.log(chalk.cyan(`  ${packageManager} run dev`));
	}
} catch (error) {
	if (error instanceof CLIError) {
		console.error(chalk.red(`\n❌ Error ${error.code}: ${error.message}`));
		process.exit(error.code);
	}
	console.error(chalk.red("\n❌ Unexpected error:"), error);
	process.exit(1);
}
