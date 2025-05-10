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
	try {
		const currentDir = process.cwd();
		let nextAppDir = currentDir;
		let projectRoot = currentDir;

		if (isMonorepo) {
			// Create Turborepo structure using create-turbo
			projectRoot = setupTurboRepo(projectName, packageManager);
			nextAppDir = path.join(projectRoot, "apps/web");

			// Clean up default web app to prepare for our Next.js + shadcn setup
			if (fs.existsSync(nextAppDir)) {
				fs.rmSync(nextAppDir, { recursive: true, force: true });
			}

			// Ensure apps directory exists
			fs.mkdirSync(path.join(projectRoot, "apps"), { recursive: true });
			fs.mkdirSync(nextAppDir, { recursive: true });
			process.chdir(nextAppDir);
		}

		// Create Next.js app
		console.log("\nCreating Next.js application...");
		const createNextCommand = useSupabase
			? "npx create-next-app@latest . -e with-supabase --use-" + packageManager
			: "npx create-next-app@latest . --use-" + packageManager;

		execSync(createNextCommand, { stdio: "inherit" });

		// Update package.json for the Next.js app
		const appPackageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
		if (isMonorepo) {
			appPackageJson.name = "@" + projectName + "/web";
		}
		delete appPackageJson.packageManager;
		fs.writeFileSync("package.json", JSON.stringify(appPackageJson, null, 2));

		// Initialize shadcn
		console.log("\nInitializing shadcn...");
		if (!fs.existsSync("tailwind.config.js")) {
			createTailwindConfig();
		}

		if (fs.existsSync("components.json")) {
			fs.unlinkSync("components.json");
		}

		// Initialize shadcn
		execSync("npx shadcn@latest init --yes", { stdio: "inherit" });

		// Install dependencies with legacy peer deps for React 19
		const installCommand =
			packageManager === "yarn"
				? "yarn add --legacy-peer-deps class-variance-authority lucide-react clsx tailwind-merge @radix-ui/react-icons"
				: "npm install --legacy-peer-deps class-variance-authority lucide-react clsx tailwind-merge @radix-ui/react-icons";

		execSync(installCommand, { stdio: "inherit" });
		execSync("npx shadcn@latest add --all --yes", { stdio: "inherit" });

		if (isMonorepo) {
			// Set up shared UI package
			console.log("\nSetting up shared UI package...");
			const uiDir = path.join(projectRoot, "packages/ui");
			fs.mkdirSync(uiDir, { recursive: true });

			const uiPackageJson = {
				name: "@" + projectName + "/ui",
				version: "0.0.0",
				private: true,
				main: "./index.ts",
				types: "./index.ts",
				scripts: {
					lint: "eslint .",
					build: "tsup",
				},
				peerDependencies: {
					react: "^18.0.0",
					"react-dom": "^18.0.0",
				},
			};

			fs.writeFileSync(
				path.join(uiDir, "package.json"),
				JSON.stringify(uiPackageJson, null, 2)
			);

			// Create base UI package files
			fs.writeFileSync(
				path.join(uiDir, "index.ts"),
				"export * from './components';\n"
			);

			// Create components directory
			fs.mkdirSync(path.join(uiDir, "components"), { recursive: true });
			console.log(chalk.green("✓ UI package initialized"));

			// Return to project root
			process.chdir(projectRoot);

			// Install root dependencies
			console.log("\nInstalling project dependencies...");
			const rootInstallCmd =
				packageManager === "yarn" ? "yarn install" : "npm install";
			execSync(rootInstallCmd, { stdio: "inherit" });
		}

		console.log(chalk.green("\n✓ Project setup completed successfully"));
	} catch (error) {
		throw new CLIError(`Project creation failed: ${error.message}`, 2);
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

function setupTurboRepo(projectName, packageManager) {
	console.log("\nInitializing Turborepo...");

	try {
		// Create empty yarn.lock first if using yarn
		if (packageManager === "yarn") {
			fs.writeFileSync("yarn.lock", "");
		}

		const createTurboCommand =
			packageManager === "yarn"
				? "npx create-turbo@latest"
				: "npx create-turbo@latest";

		// Create new turborepo using official create-turbo with --no-install flag
		execSync(`${createTurboCommand} . --no-install`, {
			stdio: "inherit",
		});

		// Update package.json to use workspace syntax
		const rootPackageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
		rootPackageJson.name = projectName;
		rootPackageJson.private = true;

		// Ensure workspaces are configured correctly
		rootPackageJson.workspaces = ["apps/*", "packages/*"];

		// For yarn, add additional workspace config
		if (packageManager === "yarn") {
			rootPackageJson.packageManager = "yarn@1.22.19"; // Specify yarn version
			rootPackageJson.installConfig = {
				hoistingLimits: "workspaces",
			};
		}

		fs.writeFileSync("package.json", JSON.stringify(rootPackageJson, null, 2));
		console.log(chalk.green("✓ Root package.json updated"));

		// Initialize yarn/npm in the root directory
		const initCommand = packageManager === "yarn" ? "yarn" : "npm install";
		execSync(initCommand, { stdio: "inherit" });

		return process.cwd();
	} catch (error) {
		// Add cleanup on error
		if (fs.existsSync("node_modules")) {
			fs.rmSync("node_modules", { recursive: true, force: true });
		}
		if (fs.existsSync("yarn.lock")) {
			fs.unlinkSync("yarn.lock");
		}
		throw new CLIError(
			`Failed to initialize Turborepo: ${error.message}\nPossible solutions:\n1. Ensure you have write permissions\n2. Try clearing yarn/npm cache\n3. Check your internet connection\n4. Try removing any existing yarn.lock or package-lock.json`,
			2
		);
	}
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

	console.log(chalk.green("\n✨ Setup completed successfully!"));

	if (isMonorepo) {
		console.log(chalk.green("\nMonorepo structure created:"));
		console.log(
			chalk.cyan("  apps/web          ") +
				"- Next.js application with Shadcn UI"
		);
		console.log(chalk.cyan("  packages/ui       ") + "- Shared UI components");

		console.log(chalk.cyan("\nAvailable commands:"));
		console.log("┌─────────────────────────────────────────────┐");
		console.log(
			"│ Dev server:    " + chalk.yellow(`${packageManager} run dev     	`) + "	│"
		);
		console.log(
			"│ Build:         " + chalk.yellow(`${packageManager} run build   	`) + "	│"
		);
		console.log(
			"│ Lint:          " + chalk.yellow(`${packageManager} run lint    	`) + "	│"
		);
		console.log(
			"│ Test:          " + chalk.yellow(`${packageManager} run test    	`) + "	│"
		);
		console.log("└─────────────────────────────────────────────┘");

		console.log(chalk.cyan("\nTo add more Shadcn UI components:"));
		console.log("1. Change to the web app directory:");
		console.log(chalk.yellow("   cd apps/web"));
		console.log("2. Add components using shadcn:");
		console.log(chalk.yellow("   npx shadcn@latest add [component-name]"));

		console.log(chalk.cyan("\nTo start developing:"));
		console.log(chalk.yellow(`   ${packageManager} run dev`));
		console.log("This will start all applications in development mode");
	} else {
		console.log(chalk.cyan("\nTo start developing:"));
		console.log(chalk.yellow(`   ${packageManager} run dev`));

		console.log(chalk.cyan("\nTo add more Shadcn UI components:"));
		console.log(chalk.yellow("   npx shadcn@latest add [component-name]"));
	}
} catch (error) {
	if (error instanceof CLIError) {
		console.error(chalk.red(`\n❌ Error ${error.code}: ${error.message}`));
		process.exit(error.code);
	}
	console.error(chalk.red("\n❌ Unexpected error:"), error);
	process.exit(1);
}
