# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2024-09-18

### Changed
- Improved error handling in `replaceComponentFolders` function
- Now using `fs.cpSync` instead of `execSync` with `cp` command for better cross-platform compatibility
- Added checks for the existence of example and magicui folders before attempting to copy

### Fixed
- Resolved issue where the script would fail if example or magicui folders were not present

## [1.0.1] - 2024-09-18

### Added
- Replacement of example and magicui folders in the components directory

## [1.0.0] - 2024-09-18

### Added
- Initial release of the CLI tool
- Functionality to set up a Next.js project with shadcn and magicui
- Automatic creation of tailwind.config.js if not present
- Integration of all shadcn components
- Integration of all magicui components

### Changed
- Project setup now occurs in the current directory instead of creating a new subdirectory

### Fixed
- Ensured proper error handling and logging during the setup process