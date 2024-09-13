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

| Date       | Version | Changes                                                    |
|------------|---------|-----------------------------------------------------------|
| 2024-03-18 | 1.0.3   | - Updated bin field in package.json for better compatibility |
|            |         | - Improved error handling in cli.js                        |
|            |         | - Updated README with more detailed usage instructions     |
| 2024-03-18 | 1.0.2   | - Added changelog to README                                |
|            |         | - Fixed ES module import issue in cli.js                   |
|            |         | - Updated package.json to include "type": "module"         |
| 2024-03-17 | 1.0.1   | - Initial release of create-next-app-shadcn                |
|            |         | - Basic functionality to create Next.js app with shadcn/ui |
