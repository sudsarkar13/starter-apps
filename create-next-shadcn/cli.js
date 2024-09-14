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

try {
  const projectName = process.argv[2];
  
  if (!projectName) {
    console.error('Error: Please provide a project name.');
    console.log('Usage: node cli.js <project-name>');
    process.exit(1);
  }

  const projectDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectDir)) {
    if (!isDirEmpty(projectDir)) {
      console.error(`Error: The directory '${projectName}' already exists and is not empty.`);
      console.log('Please choose a different project name or remove the existing directory.');
      process.exit(1);
    }
  } else {
    fs.mkdirSync(projectDir);
  }

  process.chdir(projectDir);

  console.log(`Creating Next.js app in '${projectName}'...`);
  execSync('npx create-next-app@latest .', { stdio: 'inherit' });

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