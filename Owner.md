# Owner's Guide for create-next-shadcn

This guide provides instructions for setting up, developing, and publishing the create-next-shadcn CLI tool.

## Setup for Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/create-next-shadcn.git
   cd create-next-shadcn
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Make the CLI executable:
   ```
   chmod +x cli.js
   ```

4. Link the package locally for testing:
   ```
   npm link
   ```

## Development Workflow

1. Make changes to `cli.js` as needed.

2. Test your changes locally:
   ```
   node cli.js test-project
   ```

3. If everything works as expected, update the version in `package.json`.

## Publishing to npm

1. Create an account on [npmjs.com](https://www.npmjs.com/) if you haven't already.

2. Log in to your npm account in the terminal:
   ```
   npm login
   ```

3. Update the `package.json` file:
   - Ensure the `name` field is set to "create-next-shadcn"
   - Update the `version` field
   - Check that the `description`, `main`, and `keywords` fields are correctly set

4. Publish the package:
   ```
   npm publish
   ```

## Updating the Published Package

1. Make your changes to the codebase.
2. Update the `version` in `package.json` (follow semantic versioning).
3. Run `npm publish` again.

## Maintenance

- Regularly check for updates to dependencies, especially Next.js and Shadcn UI.
- Test the CLI with the latest versions of Node.js and npm.
- Monitor issues and pull requests on the GitHub repository.

## Support

- Respond to issues on GitHub in a timely manner.
- Update the README.md file as needed to reflect any changes in usage or features.

Remember to keep the CLI simple, focused, and well-documented. Happy developing!