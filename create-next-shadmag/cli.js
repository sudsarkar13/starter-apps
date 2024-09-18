#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Setting up your Next.js project with shadcn and magicui...');

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
  fs.writeFileSync('tailwind.config.js', content.trim());
  console.log('Created tailwind.config.js');
}

function createProject(projectName) {
  const currentDir = process.cwd();
  const projectPath = currentDir;
  
  console.log(`Setting up your Next.js project with shadcn and magicui in ${projectPath}...`);

  // Create Next.js app in the current directory, explicitly using '.'
  execSync(`npx create-next-app@latest .`, { stdio: 'inherit' });

  // No need to change directory as we're already in the project directory
}

function replaceComponentFolders() {
  const componentsDir = path.join(process.cwd(), 'components');
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);

  // Ensure the components directory exists
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  // Replace example folder
  const exampleDir = path.join(scriptDir, 'example');
  if (fs.existsSync(exampleDir)) {
    fs.rmSync(path.join(componentsDir, 'example'), { recursive: true, force: true });
    fs.mkdirSync(path.join(componentsDir, 'example'), { recursive: true });
    fs.cpSync(exampleDir, path.join(componentsDir, 'example'), { recursive: true });
    console.log('Replaced example folder in components directory');
  } else {
    console.log('Example folder not found in the script directory. Skipping...');
  }

  // Replace magicui folder
  const magicuiDir = path.join(scriptDir, 'magicui');
  if (fs.existsSync(magicuiDir)) {
    fs.rmSync(path.join(componentsDir, 'magicui'), { recursive: true, force: true });
    fs.mkdirSync(path.join(componentsDir, 'magicui'), { recursive: true });
    fs.cpSync(magicuiDir, path.join(componentsDir, 'magicui'), { recursive: true });
    console.log('Replaced magicui folder in components directory');
  } else {
    console.log('Magicui folder not found in the script directory. Skipping...');
  }
}

try {
  const currentDir = process.cwd();
  const projectName = path.basename(currentDir);
  
  console.log(`Using current directory: ${currentDir}`);
  console.log(`Project name: ${projectName}`);

  createProject(projectName);

  // Check if tailwind.config.js exists, create it if not
  if (!fs.existsSync('tailwind.config.js')) {
    createTailwindConfig();
  }

  console.log('Initializing shadcn...');
  execSync('npx shadcn@latest init', { stdio: 'inherit' });

  console.log('Adding all shadcn components...');
  execSync('npx shadcn@latest add --all', { stdio: 'inherit' });

  console.log('Initializing magicui...');
  execSync('npx magicui-cli@latest init', { stdio: 'inherit' });

  console.log('Adding all magicui components...');
  execSync('npx magicui-cli@latest add --all', { stdio: 'inherit' });

  console.log('Replacing example and magicui folders...');
  replaceComponentFolders();

  console.log('Setup completed successfully!');
} catch (error) {
  console.error('An error occurred during setup:', error.message);
  process.exit(1);
}