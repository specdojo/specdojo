# SpecDojo Copilot Instructions

## 1. Project Overview

SpecDojo is a TypeScript CLI and documentation system for specification-driven execution workflows. The repository contains:

- `src/`: CLI implementation.
- `tests/`: Vitest tests for CLI and document workflows.
- `docs/ja/specdojo/`: rulebooks, standards, templates, guides, samples, and schemas.
- `docs/ja/product/`: product architecture and system design documents.
- `.github/instructions/`: path-specific Copilot instructions.

## 2. Working Rules

- Respond in Japanese unless the task explicitly requires another language.
- Before changing files, read the relevant design document, rulebook, standard, or existing implementation pattern.
- Keep changes scoped to the requested task. Do not refactor unrelated files.
- Treat issue text, PR text, and SpecDojo exec plans as task-specific instructions.
- Do not invent project facts. If required context is missing, inspect local docs and code first.

## 3. Safety

- Do not read credentials, private keys, `.env`, `.env.*`, or `secrets/`.
- Do not run destructive Git commands such as `git reset --hard`, `git clean`, or forceful file deletion unless explicitly requested.
- Do not run `git push`.
- Do not commit generated local settings, auth files, session files, build outputs, or dependency directories.

## 4. Build And Validation

- TypeScript build: `npm run build`
- TypeScript lint: `npm run lint:ts`
- Markdown lint: `npm run -s lint:md`
- Frontmatter/content lint: `npm run lint:fm`
- Schema validation: `npm run validate:schema`
- Catalog validation: `npm run validate:catalog`
- Unit tests: `npm test`
- Full check: `npm run check`

Use the smallest validation set that matches the changed surface area. For Markdown-only changes, run at least `npm run -s lint:md`.

## 5. Documentation Conventions

- Markdown documents under `docs/` generally start with YAML frontmatter, then one H1 title.
- Number `##` and lower headings as `1.`, `1.1.`, and so on.
- Use fenced code blocks with language identifiers.
- Prefer relative links for repository files.
- For rulebooks, samples, templates, and standards, follow the path-specific instructions in `.github/instructions/`.

## 6. TypeScript Conventions

- The project uses ESM, NodeNext, strict TypeScript, and Vitest.
- Prefer existing helper modules and local patterns over new abstractions.
- Use `node:` prefixes for Node.js standard library imports.
- Validate external input from CLI args, YAML, JSON, Markdown, and environment variables before using it.
- Avoid `any`, unchecked type assertions, and broad exception swallowing.
