# create-next-shadcn

A CLI tool to quickly set up a Next.js project with Shadcn UI components.

## Features

- Creates a new Next.js project
- Sets up Tailwind CSS
- Initializes Shadcn UI
- Adds all Shadcn UI components

## Prerequisites

- Node.js (version 14 or later)
- npm (version 6 or later)

## Installation

You don't need to install this package globally. You can use it directly with npx.

## Usage

Run the following command to create a new Next.js project with Shadcn UI:

```node
npx create-next-shadcn your-project-name
```

Replace `your-project-name` with the name of your project.

## Changelog

| Date       | Version | Changes                                                                                      |
| ---------- | ------- | -------------------------------------------------------------------------------------------- |
| 2024-10-14 | 1.0.8   | - Modified `createProject` function to create the Next.js app in the current directory       |
|            |         | - Updated project setup process to handle existing `components.json` file                    |
|            |         | - Improved error handling and user feedback during the setup process                         |
|            |         | - Integrated Supabase with Next.js example                                                   |
|            |         | - Resolved issue with `shadcn` initialization failing due to existing `components.json` file |
|            |         | - Improved documentation for setup process                                                   |
| 2024-09-25 | 1.0.7   | - Added support for yarn, pnpm, and bun package managers                                     |
|            |         | - Minimum Node.js version requirement (14.0.0)                                               |
|            |         | - Simplified bin field in package.json                                                       |
|            |         | - Updated keywords to include new package manager support                                    |
| 2024-09-25 | 1.0.6   | - Added `next-shadcn` command to create a Next.js project with Shadcn UI components          |
|            |         | - Implemented automatic setup of tailwind.config.js                                          |
|            |         | - Added all Shadcn components by default                                                     |
| 2024-09-18 | 1.0.5   | - Added support for using '.' as the root directory                                          |
|            |         | - Improved error handling for non-empty directories                                          |
|            |         | - Simplified bin field in package.json                                                       |
|            |         | - Updated README with additional examples                                                    |
| 2024-03-18 | 1.0.4   | - Added alternative bin command for better compatibility                                     |
|            |         | - Updated README files with latest changes                                                   |
| 2024-03-18 | 1.0.3   | - Updated bin field in package.json for better compatibility                                 |
|            |         | - Improved error handling in cli.js                                                          |
|            |         | - Updated README with more detailed usage instructions                                       |
| 2024-03-18 | 1.0.2   | - Added changelog to README                                                                  |
|            |         | - Fixed ES module import issue in cli.js                                                     |
|            |         | - Updated package.json to include "type": "module"                                           |
| 2024-03-17 | 1.0.1   | - Initial release of create-next-app-shadcn                                                  |
|            |         | - Basic functionality to create Next.js app with shadcn/ui                                   |
