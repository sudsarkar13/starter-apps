# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.5] - 2024-09-25

### Added
- Added `next-shadcn` command to create a Next.js project with Shadcn UI components
- Implemented automatic setup of tailwind.config.js
- Added all Shadcn components by default

### Changed
- Updated `cli.js` to use the current directory as the project root

## [1.0.4] - 2024-09-18

### Changed
- Updated `cli.js` to use the current directory as the project root
- Simplified the `createProject` function to always use '.' for the current directory
- Removed unnecessary command-line arguments for project name

### Fixed
- Fixed issue with creating projects in non-empty directories

## [1.0.3] - 2024-09-18

### Added
- Initial release of create-next-shadcn
- Added functionality to create a Next.js project with Shadcn UI components
- Implemented automatic setup of tailwind.config.js
- Added all Shadcn components by default

## [1.0.2] - 2024-09-18

### Added
- Support for using '.' as the root directory
- Ability to run in non-empty directories

### Changed
- Updated CLI script to handle '.' as a valid project name
- Modified project creation logic to work with existing directories

## [1.0.1] - 2024-09-15

### Added
- Initial release of create-next-shadcn
- Basic functionality to create a Next.js project with Shadcn UI components

[1.0.2]: https://github.com/sudsarkar13/starter-apps/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/sudsarkar13/starter-apps/releases/tag/v1.0.1

## [1.0.0] - 2024-09-14

### Added
- Initial release of the CLI tool
- Create a new Next.js project with a specified name
- Automatically set up Tailwind CSS
- Initialize and add all shadcn components
- Error handling for existing directories and missing project names
