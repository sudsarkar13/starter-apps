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

## Testing Locally

1. In your CLI project directory, run:

   ```node
   npm link
   ```

2. Now you can test your CLI by running:

   ```node
   my-nextjs-cli project-name
   ```

## Publishing to npm

1. Create an account on [npmjs.com](https://www.npmjs.com/) if you haven't already.

2. Log in to your npm account in the terminal:

   ```node
   npm login
   ```

3. Choose a unique name for your package and update it in `package.json`:

   ```json
   "name": "my-unique-nextjs-cli"
   ```

4. Set the initial version (e.g., "1.0.0") in `package.json`.

5. Publish your package:

   ```node
   npm publish
   ```

## Using Your Published CLI

Once published, users can run your CLI using npx:

```node
npx my-unique-nextjs-cli project-name
```

## Updating Your CLI

1. Make changes to your code.
2. Update the version in `package.json`.
3. Run `npm publish` again.

## Best Practices

1. Include clear error messages and user instructions.
2. Handle edge cases (e.g., existing directories, missing dependencies).
3. Provide a detailed README.md file.
4. Consider adding comman
