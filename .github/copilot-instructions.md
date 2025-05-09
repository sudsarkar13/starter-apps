# Copilot Instructions for CLI Error Management and Monorepo Structure

## General Guidelines

When contributing to this CLI tool or monorepo, follow these key principles:

1. Error Management
2. Monorepo Architecture
3. Code Organization
4. Testing Strategy

## Error Management Guidelines

### Error Handling Pattern

Always wrap error-prone operations in try-catch blocks and use proper error classes:

```javascript
class CLIError extends Error {
	constructor(message, code = 1) {
		super(message);
		this.name = "CLIError";
		this.code = code;
	}
}

// Usage example
try {
	// Operation that might fail
	await someAsyncOperation();
} catch (error) {
	if (error instanceof CLIError) {
		console.error(chalk.red(`Error ${error.code}: ${error.message}`));
		process.exit(error.code);
	}
	console.error(chalk.red("Unexpected error:", error));
	process.exit(1);
}
```

### Error Message Standards

1. Messages should be:

   - Clear and actionable
   - Include error codes
   - Provide possible solutions
   - Use color coding (red for errors, yellow for warnings)

2. Example message format:
   ```javascript
   console.error(
   	chalk.red(`[ERR-001] Failed to create project directory`) +
   		chalk.yellow(`\nPossible solutions:
       1. Check write permissions
       2. Ensure directory doesn't exist
       3. Try running with elevated privileges`)
   );
   ```

### Recovery Mechanisms

1. Implement cleanup functions:

   ```javascript
   function cleanup() {
   	if (fs.existsSync(tempDir)) {
   		fs.rmSync(tempDir, { recursive: true, force: true });
   	}
   }

   process.on("SIGINT", cleanup);
   process.on("SIGTERM", cleanup);
   ```

2. Use proper exit codes:
   - 0: Success
   - 1: General error
   - 2: Invalid arguments
   - 3: Environment error
   - 4: Permission error

## Monorepo Structure Guidelines

### Project Organization

Follow this structure for new components and features:

```
monorepo/
├── apps/
│   ├── web/                  # Next.js web application
│   │   ├── src/
│   │   └── package.json
│   └── admin/               # Admin dashboard
│       ├── src/
│       └── package.json
├── packages/
│   ├── ui/                 # Shared UI components
│   │   ├── src/
│   │   ├── components/     # Shadcn components
│   │   └── package.json
│   ├── config/            # Shared configurations
│   │   ├── eslint/
│   │   ├── typescript/
│   │   └── package.json
│   └── utils/             # Shared utilities
│       ├── src/
│       └── package.json
├── tooling/               # Build and dev tools
└── package.json          # Root workspace
```

### Package Dependencies

1. Workspace dependencies:

   ```json
   {
   	"dependencies": {
   		"@repo/ui": "workspace:*",
   		"@repo/config": "workspace:*"
   	}
   }
   ```

2. Shared dependencies should be hoisted to root

### Turborepo Configuration

Use this base turbo.json configuration:

```json
{
	"$schema": "https://turborepo.org/schema.json",
	"pipeline": {
		"build": {
			"dependsOn": ["^build"],
			"outputs": [".next/**", "dist/**"]
		},
		"dev": {
			"cache": false,
			"persistent": true
		},
		"lint": {
			"outputs": []
		},
		"test": {
			"dependsOn": ["build"],
			"inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts", "test/**/*.tsx"]
		}
	}
}
```

## Testing Strategy

1. Unit Tests:

   - Test individual components
   - Test utility functions
   - Test error handlers

2. Integration Tests:

   - Test CLI commands
   - Test project generation
   - Test dependency installation

3. E2E Tests:
   - Test full project creation
   - Test monorepo setup
   - Test build process

## Code Quality Standards

1. TypeScript:

   - Use strict mode
   - Define proper interfaces
   - Use proper type imports

2. ESLint Rules:

   - Follow Airbnb style guide
   - No console logs in production
   - Proper error handling

3. Git Commits:
   - Use conventional commits
   - Include scope for monorepo
   - Reference issues

## Development Workflow

1. Feature Development:

   ```bash
   git checkout -b feature/name
   pnpm install
   pnpm dev
   ```

2. Testing:

   ```bash
   pnpm test
   pnpm lint
   ```

3. Building:
   ```bash
   pnpm build
   ```

## Common Issues and Solutions

1. Package Resolution:

   - Clear node_modules
   - Regenerate lockfile
   - Check workspace config

2. Build Errors:

   - Check Node.js version
   - Verify dependencies
   - Clear cache

3. TypeScript Errors:
   - Update tsconfig
   - Check types
   - Rebuild project
