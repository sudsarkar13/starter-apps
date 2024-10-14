#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

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

function createProject(projectName, useSupabase) {
  const currentDir = process.cwd();
  const projectPath = currentDir;
  
  console.log(`Setting up your Next.js project with shadcn in ${projectPath}...`);

  // Create Next.js app in a new directory
  if (useSupabase) {
    execSync(`npx create-next-app -e with-supabase .`, { stdio: 'inherit' });
  } else {
    execSync(`npx create-next-app@latest .`, { stdio: 'inherit' });
  }

  // Change directory to the newly created project
  process.chdir(projectPath);
}

function askUserForSupabase() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Do you want to integrate Supabase? (y/n): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

try {
  const currentDir = process.cwd();
  const projectName = path.basename(currentDir);
  
  console.log(`Using current directory: ${currentDir}`);
  console.log(`Project name: ${projectName}`);

  // Ask user if they want to integrate Supabase
  const useSupabase = await askUserForSupabase();

  createProject(projectName, useSupabase);

  // Check if tailwind.config.js exists, create it if not
  if (!fs.existsSync('tailwind.config.js')) {
    createTailwindConfig();
  }

  // Remove existing components.json if it exists
  if (fs.existsSync('components.json')) {
    fs.unlinkSync('components.json');
    console.log('Removed existing components.json');
  }

  console.log('Initializing shadcn...');
  execSync('npx shadcn@latest init', { stdio: 'inherit' });

  console.log('Adding all shadcn components...');
  execSync('npx shadcn@latest add --all', { stdio: 'inherit' });

  console.log('Setup completed successfully!');
  console.log(`Your new project is ready in the '${projectName}' directory.`);
  console.log('To start developing, run the following commands:');
  console.log(`  cd ${projectName}`);
  console.log('  npm run dev');
} catch (error) {
  console.error('An error occurred during setup:', error.message);
  process.exit(1);
}
