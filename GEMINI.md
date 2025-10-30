# Project Overview

This is a Next.js web application for resizing images. It allows users to resize single or multiple images using various methods: by percentage, to a specific file size, by dimensions, by width, by height, or by the longest side. The application is built with Next.js, TypeScript, and Tailwind CSS, and it uses `next-intl` for internationalization. It is deployed on Cloudflare Pages.

# Building and Running

To build and run the project, use the following commands:

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev

# Build the project for production
pnpm build

# Start the production server
pnpm start
```

# Development Conventions

*   **Package Manager**: The project uses `pnpm` for package management.
*   **Linting**: The project uses ESLint for code linting. Run `pnpm lint` to check for linting errors.
*   **Styling**: The project uses Tailwind CSS for styling.
*   **Internationalization**: The project uses `next-intl` for internationalization. Translation files are located in the `messages` directory.
*   **Deployment**: The project is deployed on Cloudflare Pages. The `pnpm deploy` script builds the project and deploys it to Cloudflare Pages.
