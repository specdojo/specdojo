#!/usr/bin/env node
import { execFile } from "node:child_process";
import { lstat, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// No dependencies or built dist: this hook also runs in linked worktrees without node_modules.
// Keep the rule order, regex sources/flags and replacements equal to src/shared/text.ts.
export const SENSITIVE_TEXT_RULES = [
  {
    kind: "private-key",
    pattern: /-----BEGIN ((?:[A-Z0-9]+ )*PRIVATE KEY)-----[\s\S]*?-----END \1-----/gu,
    replacement: "[REDACTED]",
  },
  {
    kind: "url-credentials",
    pattern: /(\b[a-z][a-z0-9+.-]*:\/\/)[^\s/@<>"'`?#]+@/giu,
    replacement: "$1[REDACTED]@",
  },
  {
    kind: "bearer-token",
    pattern: /\bBearer\s+[A-Za-z0-9._~+/=-]+/giu,
    replacement: "Bearer [REDACTED]",
  },
  {
    kind: "aws-access-key",
    pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/gu,
    replacement: "[REDACTED]",
  },
  {
    kind: "google-api-key",
    pattern: /\bAIza[A-Za-z0-9_-]{35}(?![A-Za-z0-9_-])/gu,
    replacement: "[REDACTED]",
  },
  {
    kind: "slack-token",
    pattern: /\bxox[a-z]-[A-Za-z0-9-]{8,}(?![A-Za-z0-9-])/gu,
    replacement: "[REDACTED]",
  },
  {
    kind: "github-fine-grained-token",
    pattern: /\bgithub_pat_[A-Za-z0-9_]{8,}\b/gu,
    replacement: "[REDACTED]",
  },
  {
    kind: "anthropic-api-key",
    pattern: /\bsk-ant-[A-Za-z0-9_-]{8,}(?![A-Za-z0-9_-])/gu,
    replacement: "[REDACTED]",
  },
  {
    kind: "api-token",
    pattern: /\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{8,}|gh[oprsu]_[A-Za-z0-9_]{8,})(?![A-Za-z0-9_-])/gu,
    replacement: "[REDACTED]",
  },
  {
    kind: "jwt",
    pattern: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+(?![A-Za-z0-9_-])/gu,
    replacement: "[REDACTED]",
  },
  {
    kind: "quoted-credential",
    pattern:
      /(\b(?:api[_-]?key|access[_-]?token|auth(?:orization)?|password|passwd|secret)\b["']?\s*[:=]\s*)(["'])(?:\\[\s\S]|(?!\2)[^\\\r\n])+\2/giu,
    replacement: "$1$2[REDACTED]$2",
  },
  {
    kind: "credential-assignment",
    pattern:
      /(\b(?:api[_-]?key|access[_-]?token|auth(?:orization)?|password|passwd|secret)\b["']?\s*[:=]\s*)(?:Bearer\s+)?[^\s,;}"'`\\]+/giu,
    replacement: "$1[REDACTED]",
  },
];

/** Returns metadata only; neither matched text nor source lines leave this function. */
export function findSensitiveText(text) {
  const findings = [];
  for (const { kind, pattern, replacement } of SENSITIVE_TEXT_RULES) {
    for (const match of text.matchAll(pattern)) {
      // Already redacted credentials are safe, including JSON-quoted values and URL userinfo.
      if (match[0].replace(new RegExp(pattern.source, pattern.flags), replacement) === match[0]) {
        continue;
      }
      const line = text.slice(0, match.index).split("\n").length;
      findings.push({ line, kind });
    }
  }
  return findings.sort((a, b) => a.line - b.line || a.kind.localeCompare(b.kind));
}

async function git(args, cwd) {
  try {
    const { stdout } = await execFileAsync("git", args, {
      cwd,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    return stdout;
  } catch {
    // Git stderr may contain source data. Never echo it or an exception's message.
    throw new Error("git-read-failed");
  }
}

function isExecutionRecord(file) {
  return /^docs\/ja\/projects\/[^/]+\/execution\//u.test(file);
}

function isForbiddenFile(file) {
  return file.split(/[\\/]/u).some((part) => part === "secrets" || /^\.env(?:\.|$)/u.test(part));
}

/** Explicit files read the working tree; --staged reads index blobs, --tracked lists tracked records. */
export async function runCheckEvidenceSecrets(
  args,
  { cwd = process.cwd(), report = (message) => process.stderr.write(message) } = {},
) {
  const mode = args[0];
  const gitMode = mode === "--staged" || mode === "--tracked";
  if (
    (!gitMode && args.length === 0) ||
    (gitMode && args.length !== 1) ||
    (!gitMode && args.some((arg) => arg.startsWith("-")))
  ) {
    report("Usage: node tools/check-evidence-secrets.mjs <file...> | --staged | --tracked\n");
    return 1;
  }

  let root = cwd;
  let files = args;
  try {
    if (gitMode) {
      root = (await git(["rev-parse", "--show-toplevel"], cwd)).trimEnd();
      const listArgs =
        mode === "--staged"
          ? ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z", "--"]
          : ["ls-files", "-z", "--"];
      files = (await git(listArgs, root))
        .split("\0")
        .filter((file) => file && isExecutionRecord(file));
    }
  } catch {
    report("secret-scan: git-read-failed\n");
    return 1;
  }

  let count = 0;
  let failed = false;
  for (const file of [...new Set(files)].sort()) {
    // Quoting paths keeps newlines/control characters from forging diagnostic lines.
    const label = JSON.stringify(file);
    if (isForbiddenFile(file)) {
      report(`${label}: forbidden-path\n`);
      failed = true;
      continue;
    }
    try {
      let content;
      if (mode === "--staged") {
        content = await git(["show", `:${file}`], root);
      } else {
        const target = path.resolve(root, file);
        if (!(await lstat(target)).isFile()) throw new Error("not-regular-file");
        content = await readFile(target, "utf8");
      }
      for (const { line, kind } of findSensitiveText(content)) {
        report(`${label}:${line}: ${kind}\n`);
        count++;
      }
    } catch {
      report(`${label}: read-failed\n`);
      failed = true;
    }
  }
  report(`secret-scan: ${files.length} files, ${count} findings${failed ? ", read errors" : ""}\n`);
  return failed || count > 0 ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = await runCheckEvidenceSecrets(process.argv.slice(2));
}
