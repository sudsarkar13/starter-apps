#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Setting up your Next.js project with shadcn...');

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
  
  console.log(`Setting up your Next.js project with shadcn in ${projectPath}...`);

  // Create Next.js app in the current directory, explicitly using '.'
  execSync(`npx create-next-app@latest .`, { stdio: 'inherit' });

  // No need to change directory as we're already in the project directory
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

  console.log('Setup completed successfully!');
} catch (error) {
  console.error('An error occurred during setup:', error.message);
  process.exit(1);
}