#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import semver from "semver";
import { fileURLToPath } from "url";
import { dirname } from "path";
import chalk from "chalk";
import pkg from "enquirer";

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
  • Multiple package manager support (npm, yarn, pnpm)

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
	const projectPath = currentDir;

	console.log(
		`Setting up your Next.js project with shadcn in ${projectPath}...`
	);

	if (isMonorepo) {
		fs.mkdirSync("apps", { recursive: true });
		process.chdir("apps");
	}

	// Create Next.js app
	if (useSupabase) {
		execSync(`npx create-next-app -e with-supabase .`, { stdio: "inherit" });
	} else {
		// Always use npx for create-next-app regardless of package manager
		execSync(`npx create-next-app@latest .`, { stdio: "inherit" });

		// After project creation, update package manager if not npm
		if (packageManager !== "npm") {
			console.log(`\nUpdating package manager to ${packageManager}...`);
			if (packageManager === "pnpm") {
				// Remove package-lock.json and node_modules
				if (fs.existsSync("package-lock.json")) {
					fs.unlinkSync("package-lock.json");
				}
				if (fs.existsSync("node_modules")) {
					fs.rmSync("node_modules", { recursive: true, force: true });
				}
				// Install with pnpm
				execSync("pnpm install", { stdio: "inherit" });
			} else if (packageManager === "yarn") {
				// Remove package-lock.json and node_modules
				if (fs.existsSync("package-lock.json")) {
					fs.unlinkSync("package-lock.json");
				}
				if (fs.existsSync("node_modules")) {
					fs.rmSync("node_modules", { recursive: true, force: true });
				}
				// Install with yarn
				execSync("yarn install", { stdio: "inherit" });
				execSync("corepack enable", { stdio: "inherit" });
				execSync("yarn set version berry", { stdio: "inherit" });
				execSync("yarn install", { stdio: "inherit" });
			}
		}
	}

	process.chdir(projectPath);
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
		choices: ["npm", "yarn", "pnpm"],
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

	// Start installation with progress indicator
	const spinner = showSpinner("Creating project");

	createProject(projectName, useSupabase, packageManager, isMonorepo);
	clearInterval(spinner);
	process.stdout.write("\r\n");

	if (!fs.existsSync("tailwind.config.js")) {
		createTailwindConfig();
	}

	if (fs.existsSync("components.json")) {
		fs.unlinkSync("components.json");
		console.log("Removed existing components.json");
	}

	console.log("Initializing shadcn...");
	execSync(
		// Use npx for all package managers when running shadcn
		`npx shadcn@latest init`,
		{ stdio: "inherit" }
	);

	console.log("Adding all shadcn components...");
	execSync(
		// Use npx for all package managers when running shadcn
		`npx shadcn@latest add --all`,
		{ stdio: "inherit" }
	);

	console.log("\n✨ Setup completed successfully!");
	console.log(
		`\nYour new project is ready in the '${projectName}${
			isMonorepo ? "/apps" : ""
		}' directory.`
	);
	console.log("To start developing, run:");
	console.log(`  cd ${isMonorepo ? "apps/" : ""}${projectName}`);
	console.log(`  ${packageManager} run dev`);
} catch (error) {
	console.error("\n❌ Error:", error.message);
	process.exit(1);
}
