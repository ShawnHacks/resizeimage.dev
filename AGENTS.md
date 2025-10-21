# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `app/[locale]/`, with page-level layouts per language and shared CSS in `app/globals.css`. Shared React components sit under `components/`; keep UI primitives inside `components/ui` and feature-specific blocks in folders such as `components/resize` or `components/blog`. Cross-cutting utilities and hooks belong in `lib/` (for example `lib/image-resize-utils.ts`). Long-form content starts in `content/blog/` (MDX) and is transformed into JSON caches in `generated/` by the build script. Localized strings sit in `messages/*.json`, coordinated by helpers in `i18n/`.

## Build, Test, and Development Commands
Install dependencies with `pnpm install`. Use `pnpm dev` to launch the local server (Turbopack, hot reload). Run `pnpm lint` before committing to catch accessibility and Intl issues. `pnpm build` compiles the production bundle. For the Pages deployment flow, run `pnpm pages:build` then `pnpm preview` to smoke-test the generated `.vercel/output`. Deploy to Cloudflare Pages with `pnpm deploy`. If you edit blog content, execute `pnpm prebuild` or `node scripts/generate-blog-data.mjs` to refresh the `generated/` cache.

## Coding Style & Naming Conventions
Stick to TypeScript with 2-space indentation and JSX trailing commas as in existing files. Components and hooks use PascalCase (`ResizeControls`) and camelCase (`useImageQueue`). Utility modules should default-export pure functions and avoid implicit `any`. Tailwind classes should follow the `cn()` helper to merge variants, and new locale keys must match the nesting already used in `messages/en.json`.

## Testing Guidelines
There is no automated suite yet; when adding one, prefer Playwright (already in `devDependencies`) and place specs under `tests/e2e/`. Until then, validate critical flows manually in both desktop and mobile breakpoints and confirm TURNSTILE widgets in staging. Any new image processing logic should include unit-style assertions inside `lib/__tests__` once the harness is established.

## Commit & Pull Request Guidelines
Commits follow a Conventional Commit style (`feat:`, `fix:`, `chore:`). Keep messages imperative and scoped to one concern. Pull requests should include: a concise summary, testing notes (`pnpm lint`, `pnpm build`), screenshots or GIFs for UI changes, and linked issues or Linear tickets. Mention required translations in the PR description so reviewers can coordinate string updates.

## Localization & Configuration
Create `.env.local` from `env.example` and run `pnpm dlx @t3-oss/env-nextjs` if the schema changes. Whenever adding copy, update `messages/en.json` first, then mirror keys across other locale files; flag missing translations with `TODO:` comments for translators.
