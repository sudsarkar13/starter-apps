#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import semver from "semver";
import { fileURLToPath } from "url";
import { dirname } from "path";
import chalk from "chalk";
import pkg from "enquirer";
import os from "os";

const { Select, Toggle } = pkg;

// Custom error class for CLI operations
class CLIError extends Error {
	constructor(message, code = 1) {
		super(message);
		this.name = "CLIError";
		this.code = code;
	}
}

// Cleanup function for handling interruptions and errors
function cleanup(tempDir) {
	if (fs.existsSync(tempDir)) {
		try {
			fs.rmSync(tempDir, { recursive: true, force: true });
			console.log(chalk.yellow("\nCleaned up temporary files"));
		} catch (err) {
			console.error(chalk.red("\nFailed to clean up:", err.message));
		}
	}
}

// Handle process termination
function setupCleanupHandlers(tempDir) {
	process.on("SIGINT", () => {
		console.log(chalk.yellow("\nReceived SIGINT - Cleaning up..."));
		cleanup(tempDir);
		process.exit(0);
	});
	process.on("SIGTERM", () => {
		console.log(chalk.yellow("\nReceived SIGTERM - Cleaning up..."));
		cleanup(tempDir);
		process.exit(0);
	});
	process.on("uncaughtException", (err) => {
		console.error(chalk.red("\nUncaught Exception:"), err);
		cleanup(tempDir);
		process.exit(1);
	});
}

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

// Monorepo setup with Turborepo
async function setupMonorepo(projectPath, packageManager) {
	console.log(chalk.cyan("\nInitializing Turborepo..."));

	// Create monorepo with proper package manager
	execSync(`npx create-turbo@latest . --use-${packageManager} --skip-install`, {
		stdio: "inherit",
	});

	// Update root package.json
	const rootPackageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
	rootPackageJson.packageManager = `${packageManager}@latest`;
	fs.writeFileSync("package.json", JSON.stringify(rootPackageJson, null, 2));

	// Create necessary directories
	["apps", "packages"].forEach((dir) => {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
	});

	// Move to apps directory
	process.chdir("apps");
}

// Setup Next.js application
async function setupNextApp(useSupabase, packageManager, projectName = "web") {
	// Force the use of selected package manager by setting env variables
	const env = {
		...process.env,
		FORCE_COLOR: "1",
		npm_config_user_agent: packageManager, // Override user agent
		NEXT_IGNORE_YARN_WORKSPACE: "1", // Ignore yarn workspace settings
		YARN_IGNORE_PATH: "1", // Ignore yarn path
		YARN_IGNORE_COREPACK: "1", // Ignore corepack
	};

	const execOptions = {
		stdio: "inherit",
		env: env,
		shell: true,
	};

	if (useSupabase) {
		execSync(
			`npx create-next-app@latest ${projectName} -e with-supabase --use-${packageManager} --no-workspace`,
			execOptions
		);
	} else {
		execSync(
			`npx create-next-app@latest ${projectName} --use-${packageManager} --no-workspace`,
			execOptions
		);
	}

	// Update app package.json
	process.chdir(projectName);
	const appPackageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
	delete appPackageJson.packageManager; // Remove to use workspace setting
	fs.writeFileSync("package.json", JSON.stringify(appPackageJson, null, 2));
}

// Main project creation function
async function createProject(
	projectName,
	useSupabase,
	packageManager,
	isMonorepo
) {
	const currentDir = process.cwd();
	const projectPath = currentDir;
	const tempDir = path.join(projectPath, ".temp-setup");
	const parentPackageJsonPath = path.join(__dirname, "package.json");
	let originalPackageManager = null;

	try {
		console.log(
			chalk.cyan(
				`Setting up your ${
					isMonorepo ? "monorepo" : "Next.js"
				} project with shadcn in ${projectPath}...`
			)
		);

		// Set up cleanup handlers
		setupCleanupHandlers(tempDir);

		// Temporarily remove packageManager from parent package.json
		if (fs.existsSync(parentPackageJsonPath)) {
			const parentPackageJson = JSON.parse(
				fs.readFileSync(parentPackageJsonPath, "utf8")
			);
			if (parentPackageJson.packageManager) {
				originalPackageManager = parentPackageJson.packageManager;
				delete parentPackageJson.packageManager;
				fs.writeFileSync(
					parentPackageJsonPath,
					JSON.stringify(parentPackageJson, null, 2)
				);
			}
		}

		if (isMonorepo) {
			await setupMonorepo(projectPath, packageManager);
			await setupNextApp(useSupabase, packageManager);
		} else {
			await setupNextApp(useSupabase, packageManager, ".");
		}

		// Clean up lock files based on package manager
		const lockFiles = {
			npm: ["yarn.lock", "pnpm-lock.yaml"],
			yarn: ["package-lock.json", "pnpm-lock.yaml"],
			pnpm: ["package-lock.json", "yarn.lock"],
		};

		lockFiles[packageManager]?.forEach((file) => {
			if (fs.existsSync(file)) {
				fs.unlinkSync(file);
			}
		});

		// Install dependencies with selected package manager
		console.log(
			chalk.cyan(`\nInstalling dependencies with ${packageManager}...`)
		);
		const installCommands = {
			npm: "npm install",
			yarn: "yarn install",
			pnpm: "pnpm install --prefer-offline --strict-peer-dependencies",
		};

		// Add environment variables to force package manager
		const env = {
			...process.env,
			npm_config_user_agent: packageManager,
			YARN_IGNORE_PATH: "1",
			YARN_IGNORE_COREPACK: "1",
			PNPM_HOME:
				process.env.PNPM_HOME || path.join(os.homedir(), ".local/share/pnpm"),
		};

		execSync(installCommands[packageManager], {
			stdio: "inherit",
			env: env,
		});

		if (packageManager === "yarn") {
			console.log(chalk.cyan("\nUpgrading Yarn..."));
			execSync("corepack enable", { stdio: "inherit" });
			execSync("yarn set version berry", { stdio: "inherit" });
			execSync("yarn install", { stdio: "inherit" });
			console.log(
				chalk.cyan(
					"\nRebuilding dependencies because it never has been before or the last one failed with Yarn..."
				)
			);
			execSync("yarn", { stdio: "inherit" });
		}

		// Return to project root
		process.chdir(projectPath);
	} catch (error) {
		throw new CLIError(`Failed to create project: ${error.message}`, 2);
	} finally {
		// Restore original packageManager in parent package.json
		if (originalPackageManager && fs.existsSync(parentPackageJsonPath)) {
			const parentPackageJson = JSON.parse(
				fs.readFileSync(parentPackageJsonPath, "utf8")
			);
			parentPackageJson.packageManager = originalPackageManager;
			fs.writeFileSync(
				parentPackageJsonPath,
				JSON.stringify(parentPackageJson, null, 2)
			);
		}
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
	const instructionsText = "   Use ↑/↓ arrows to select, return to confirm";
	const prompt = new Select({
		name: "package-manager",
		message: "Choose a package manager:" + chalk.gray(instructionsText),
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
	const instructionsText = "   Use ↑/↓ arrows to select, return to confirm";
	const prompt = new Select({
		name: "project-type",
		message: "Choose project type:" + chalk.gray(instructionsText),
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

	// Validate project directory
	if (!isDirEmpty(currentDir)) {
		throw new CLIError(
			chalk.red("[ERR-002] Directory is not empty") +
				chalk.yellow(`\nPossible solutions:
    1. Choose an empty directory
    2. Delete existing files
    3. Create a new directory`),
			2
		);
	}

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

	// Create project with proper error handling
	await createProject(projectName, useSupabase, packageManager, isMonorepo);
	clearInterval(spinner);
	process.stdout.write("\r\n");

	// Set up Tailwind if needed
	if (!fs.existsSync("tailwind.config.js")) {
		createTailwindConfig();
	}

	// Clean up any existing shadcn config
	if (fs.existsSync("components.json")) {
		fs.unlinkSync("components.json");
		console.log(chalk.yellow("Removed existing components.json"));
	}

	try {
		console.log(chalk.cyan("Initializing shadcn..."));

		// Set up base environment variables for shadcn
		const shadcnEnv = {
			...process.env,
			npm_config_user_agent: packageManager,
			NODE_ENV: "development",
			npm_config_registry: "https://registry.npmjs.org/",
		};

		// Special handling for Yarn
		if (packageManager === "yarn") {
			console.log(chalk.cyan("Configuring Yarn for shadcn compatibility..."));
			try {
				// Enable corepack for proper Yarn version management
				execSync("corepack enable", {
					stdio: "inherit",
					env: shadcnEnv,
				});

				// Prepare and switch to classic version
				execSync("corepack prepare yarn@1.22.19 --activate", {
					stdio: "inherit",
					env: shadcnEnv,
				});

				// Clean Yarn cache to prevent version conflicts
				execSync("yarn cache clean", {
					stdio: "inherit",
					env: shadcnEnv,
				});
			} catch (err) {
				console.warn(
					chalk.yellow(
						"Warning: Failed to configure Yarn version. Proceeding with default version."
					)
				);
			}
		}

		// Execute shadcn init with proper flags
		execSync(
			`npx shadcn@latest init ${
				packageManager === "pnpm"
					? "--force-install --package-manager pnpm"
					: ""
			}`,
			{
				stdio: "inherit",
				env: shadcnEnv,
				cwd: process.cwd(),
			}
		);

		// Install shadcn dependencies with the correct package manager
		const shadcnDeps = [
			"class-variance-authority",
			"lucide-react",
			"clsx",
			"tailwind-merge",
		];

		console.log(chalk.cyan("Adding shadcn dependencies..."));

		const installCmd =
			packageManager === "pnpm"
				? `pnpm add ${shadcnDeps.join(
						" "
				  )} --prefer-offline --strict-peer-dependencies`
				: packageManager === "yarn"
				? `yarn add ${shadcnDeps.join(" ")}`
				: `npm install ${shadcnDeps.join(" ")}`;

		execSync(installCmd, {
			stdio: "inherit",
			env: shadcnEnv,
			cwd: process.cwd(),
		});

		// Add all shadcn components
		console.log(chalk.cyan("Adding shadcn components..."));
		execSync(
			`npx shadcn@latest add --all ${
				packageManager === "pnpm"
					? "--force-install --package-manager pnpm"
					: "--yes"
			}`,
			{
				stdio: "inherit",
				env: shadcnEnv,
				cwd: process.cwd(),
			}
		);

		if (packageManager === "yarn") {
			console.log(chalk.cyan("Restoring Yarn Berry..."));
			try {
				// Switch back to Berry
				execSync("corepack prepare yarn@stable --activate", {
					stdio: "inherit",
					env: {
						...shadcnEnv,
						YARN_ENABLE_IMMUTABLE_INSTALLS: "false",
					},
				});

				// Final install to ensure everything is properly linked
				execSync("yarn install", {
					stdio: "inherit",
					env: {
						...shadcnEnv,
						YARN_ENABLE_IMMUTABLE_INSTALLS: "false",
					},
				});
			} catch (err) {
				console.warn(
					chalk.yellow(
						"Warning: Failed to restore Yarn Berry. You may need to run 'yarn set version berry' manually."
					)
				);
			}
		}
	} catch (err) {
		throw new CLIError(`Failed to setup shadcn: ${err.message}`, 3);
	}

	// Successful completion message
	console.log(chalk.green("\n✨ Setup completed successfully!"));

	const projectDir = isMonorepo ? `apps/web` : ".";
	console.log(chalk.cyan("\nYour project is ready!"));
	console.log("\nTo start developing, run these commands:");
	console.log(chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

	if (isMonorepo) {
		console.log(chalk.yellow("First, install dependencies:"));
		console.log(`  ${packageManager} install`);
	}

	console.log(chalk.yellow("\nThen, start the development server:"));
	console.log(`  cd ${projectName}`);
	console.log(`  ${packageManager} run dev`);

	console.log(chalk.gray("\nHappy coding! 🚀"));
} catch (error) {
	if (error instanceof CLIError) {
		console.error(chalk.red(`\n${error.message}`));
		process.exit(error.code);
	}
	console.error(chalk.red("\nUnexpected error:"), error.message);
	process.exit(1);
} finally {
	// Clean up temporary files
	const tempDir = path.join(process.cwd(), ".temp-setup");
	cleanup(tempDir);
}
