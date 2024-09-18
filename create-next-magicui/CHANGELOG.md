# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-09-18

### Changed
- Updated `cli.js` to use the current directory as the project root
- Simplified the `createProject` function to always use '.' for the current directory
- Removed unnecessary command-line arguments for project name

### Fixed
- Fixed issue with creating projects in non-empty directories

## [1.0.0] - 2024-09-15

### Added
- Initial release of create-next-magicui
- CLI tool to quickly set up a Next.js project with Magic UI components
- Support for running via `npx create-next-magicui` or `npx next-magicui`
- Basic project structure and configuration

[1.0.1]: https://github.com/sudsarkar13/starter-apps/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/sudsarkar13/starter-apps/releases/tag/v1.0.0