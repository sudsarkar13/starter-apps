# CLI Documentation: Creating Your Own Next.js with Shadcn UI Setup Tool

This guide will help you create your own CLI tool similar to `create-next-shadcn`, which sets up a Next.js project with Shadcn UI components. You'll learn how to create, test, and publish your CLI tool.

## Setting Up Your CLI Project

1. Create a new directory for your CLI project:

   ```sh
   mkdir my-nextjs-cli
   cd my-nextjs-cli
   ```

2. Initialize a new npm package:

   ```node
   npm init -y
   ```

3. Create a `cli.js` file in the root directory:

   ```sh
   touch cli.js
   ```

4. Open `cli.js` and add the following shebang at the top:

   ```javascript
   #!/usr/bin/env node
   ```

5. Implement your CLI logic in `cli.js`. You can use the `create-next-shadcn` code as a reference.

6. Update `package.json`:

   - Add the `bin` field:

     ```json
     "bin": {
       "my-nextjs-cli": "./cli.js"
     }
     ```

   - Set `"type": "module"` if you're using ES modules

7. Make your CLI executable:

   ```sh
   chmod +x cli.js
   ```

## Testing Your CLI

### Local Testing

1. Link your package locally:

   ```sh
   npm link
   ```

2. Create a test directory:

   ```sh
   mkdir test-cli
   cd test-cli
   ```

3. Run your CLI:

   ```sh
   npx my-nextjs-cli
   ```

### Automated Testing

1. Add testing dependencies:

   ```sh
   npm install --save-dev jest @testing-library/node
   ```

2. Create a test file `cli.test.js`:

   ```javascript
   // filepath: cli.test.js
   describe("CLI Tests", () => {
    test("should create project successfully", () => {
     // Add your test cases
    });
   });
   ```

3. Add test script to package.json:

   ```json
   {
    "scripts": {
     "test": "jest"
    }
   }
   ```

4. Run tests:

   ```sh
   npm test
   ```

## Publishing to npm

### Standard Publishing

1. Login to npm:

   ```sh
   npm login
   ```

2. Update version in package.json:

   ```json
   {
    "version": "1.0.0"
   }
   ```

3. Publish package:

   ```sh
   npm publish
   ```

### Publishing with Tags

1. Publishing a beta version:

   ```sh
   npm version 1.0.0-beta.0
   npm publish --tag beta
   ```

2. Publishing a canary version:

   ```sh
   npm version 1.0.0-canary.0
   npm publish --tag canary
   ```

3. Publishing stable version:

   ```sh
   npm version 1.0.0
   npm publish --tag latest
   ```

### Installing Tagged Versions

Users can install specific versions:

```sh
npx my-nextjs-cli@latest
npx my-nextjs-cli@beta
npx my-nextjs-cli@canary
```

## Best Practices

1. Include clear error messages and user instructions.
2. Handle edge cases (e.g., existing directories, missing dependencies).
3. Provide a detailed README.md file.
4. Consider adding common options like `--help` and `--version`.
