# Owner's Guide for create-next-shadcn

This guide provides instructions for setting up, developing, and publishing the create-next-shadcn CLI tool.

## Setup for Development

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/create-next-shadcn.git
   cd create-next-shadcn
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Make the CLI executable:

   ```sh
   chmod +x cli.js
   ```

4. Link the package locally for testing:

   ```node
   npm link
   ```

## Development Workflow

1. Make changes to `cli.js` as needed.

2. Test your changes locally:

   ```node
   node cli.js test-project
   ```

3. If everything works as expected, update the version in `package.json`.

## Testing Process

### Development Testing

1. Local environment setup:

   ```sh
   npm link
   ```

2. Create test directory:

   ```sh
   mkdir test-project
   cd test-project
   ```

3. Run development version:

   ```sh
   create-next-shadcn
   ```

### Continuous Integration Testing

1. Setup GitHub Actions workflow:

   ```yaml
   // filepath: .github/workflows/test.yml
   name: Test CLI
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
         - run: npm ci
         - run: npm test
   ```

2. Add test scripts:

   ```json
   {
    "scripts": {
     "test": "jest",
     "test:watch": "jest --watch"
    }
   }
   ```

## Publishing to npm

1. Create an account on [npmjs.com](https://www.npmjs.com/) if you haven't already.

2. Log in to your npm account in the terminal:

   ```node
   npm login
   ```

3. Update the `package.json` file:

   - Ensure the `name` field is set to "create-next-shadcn"
   - Update the `version` field
   - Check that the `description`, `main`, and `keywords` fields are correctly set

4. Publish the package:

   ```node
   npm publish
   ```

## Publishing Process

### Version Management

1. Update version using npm:

   ```sh
   npm version [patch|minor|major]
   ```

2. Version naming convention:
   - Patch: 1.0.1 (bug fixes)
   - Minor: 1.1.0 (new features)
   - Major: 2.0.0 (breaking changes)

### Publishing with Tags

1. Beta releases:

   ```sh
   # Update version
   npm version 1.0.0-beta.0

   # Publish beta
   npm publish --tag beta

   # Promote to stable when ready
   npm dist-tag add create-next-shadcn@1.0.0-beta.0 latest
   ```

2. Canary releases:

   ```sh
   # Update version
   npm version 1.0.0-canary.0

   # Publish canary
   npm publish --tag canary
   ```

3. Stable releases:

   ```sh
   # Update version
   npm version 1.0.0

   # Publish stable
   npm publish --tag latest
   ```

### Managing Tags

1. List all tags:

   ```sh
   npm dist-tag ls create-next-shadcn
   ```

2. Add a new tag:

   ```sh
   npm dist-tag add create-next-shadcn@1.0.0 latest
   ```

3. Remove a tag:

   ```sh
   npm dist-tag rm create-next-shadcn beta
   ```

### Release Checklist

1. Run tests:

   ```sh
   npm test
   ```

2. Update documentation
3. Update changelog
4. Update version
5. Create git tag:

   ```sh
   git tag v1.0.0
   git push --tags
   ```

6. Publish to npm
7. Verify installation:

   ```sh
   npx create-next-shadcn@latest
   ```

## Maintenance

- Regularly check for updates to dependencies, especially Next.js and Shadcn UI.
- Test the CLI with the latest versions of Node.js and npm.
- Monitor issues and pull requests on the GitHub repository.

## Support

- Respond to issues on GitHub in a timely manner.
- Update the README.md file as needed to reflect any changes in usage or features.

Remember to keep the CLI simple, focused, and well-documented. Happy developing!
