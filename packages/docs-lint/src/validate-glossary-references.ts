#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { load } from "js-yaml";
import fg from "fast-glob";

type Term = {
  id?: string;
  category?: string;
  relatedTerms?: string[];
};

type Glossary = {
  terms?: Term[];
};

export function validateGlossaryReferences(files: string[]): string[] {
  const errors: string[] = [];

  for (const file of files) {
    let content: string;
    try {
      content = readFileSync(file, "utf8");
    } catch (e) {
      errors.push(`[Error] Failed to read ${file}: ${e}`);
      continue;
    }

    let data: Glossary;
    try {
      data = load(content) as Glossary;
    } catch (e) {
      errors.push(`[Error] Failed to parse YAML in ${file}: ${e}`);
      continue;
    }

    if (!data || typeof data !== "object" || !Array.isArray(data.terms)) {
      continue;
    }

    const termIds = new Set<string>();
    const duplicates = new Set<string>();

    for (const term of data.terms) {
      if (!term.id) continue;
      if (termIds.has(term.id)) {
        duplicates.add(term.id);
      } else {
        termIds.add(term.id);
      }
    }

    if (duplicates.size > 0) {
      for (const id of duplicates) {
        errors.push(`[Error] Duplicate term ID in ${file}: ${id}`);
      }
    }

    for (const term of data.terms) {
      if (!term.id) continue;

      if (term.category && !termIds.has(term.category)) {
        errors.push(
          `[Error] Invalid category reference in ${file} (term: ${term.id}): ${term.category}`,
        );
      }

      if (Array.isArray(term.relatedTerms)) {
        for (const related of term.relatedTerms) {
          if (!termIds.has(related)) {
            errors.push(
              `[Error] Invalid relatedTerms reference in ${file} (term: ${term.id}): ${related}`,
            );
          }
        }
      }
    }
  }

  return errors;
}

function main() {
  const args = process.argv.slice(2);
  const patterns = args.length > 0 ? args : ["docs/**/gl-*.yaml"];

  const files = fg.sync(patterns, { dot: false });

  if (files.length === 0) {
    console.log("No glossary files found.");
    process.exit(0);
  }

  const errors = validateGlossaryReferences(files);

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
