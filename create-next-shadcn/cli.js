#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import semver from "semver";

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
		const pmCommand =
			packageManager === "yarn"
				? "yarn create"
				: packageManager === "pnpm"
				? "pnpm create"
				: "npx create-next-app@latest";
		execSync(`${pmCommand} .`, { stdio: "inherit" });
	}

	process.chdir(projectPath);
}

function askUserForSupabase() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question("Do you want to integrate Supabase? (y/n): ", (answer) => {
			rl.close();
			resolve(answer.toLowerCase() === "y");
		});
	});
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
function askForPackageManager() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question("Choose package manager (npm/yarn/pnpm): ", (answer) => {
			rl.close();
			const pm = answer.toLowerCase();
			return resolve(pm === "yarn" ? "yarn" : pm === "pnpm" ? "pnpm" : "npm");
		});
	});
}

// Project type selection
function askForProjectType() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(
			"Choose project type:\n1. Next.js\n2. Next.js (Monorepo)\nEnter (1/2): ",
			(answer) => {
				rl.close();
				resolve(answer === "2");
			}
		);
	});
}

try {
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
	console.log("-------------------");
	console.log(`• Project Name: ${projectName}`);
	console.log(`• Package Manager: ${packageManager}`);
	console.log(
		`• Project Type: ${isMonorepo ? "Monorepo" : "Standard Next.js"}`
	);
	console.log(`• Supabase Integration: ${useSupabase ? "Yes" : "No"}`);
	console.log("-------------------\n");

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
		`${packageManager === "npm" ? "npx" : packageManager} shadcn@latest init`,
		{ stdio: "inherit" }
	);

	console.log("Adding all shadcn components...");
	execSync(
		`${
			packageManager === "npm" ? "npx" : packageManager
		} shadcn@latest add --all`,
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
