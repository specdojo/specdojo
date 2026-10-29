const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const { globSync } = require("tinyglobby");
const { load, YAML11_SCHEMA, DEFAULT_SCHEMA } = require("js-yaml");

function readMetadata(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;
  try {
    return load(match[1], { schema: YAML11_SCHEMA ?? DEFAULT_SCHEMA })?.specdojo;
  } catch {
    // The rulebook's own frontmatter validation reports malformed YAML.
    return null;
  }
}

function rulebooksIn(root, pattern) {
  return globSync(pattern, {
    cwd: root,
    absolute: true,
    onlyFiles: true,
    expandDirectories: false,
    ignore: ["**/generated/**"],
  });
}

function buildRulebookIndex(workspaceRoot) {
  const index = new Map();
  function add(files, fallback) {
    for (const filePath of files) {
      const metadata = readMetadata(filePath);
      if (metadata?.type !== "rulebook" || typeof metadata.id !== "string") continue;
      if (fallback && index.has(metadata.id)) continue;
      const entries = index.get(metadata.id) ?? [];
      entries.push({ metadata, filePath });
      index.set(metadata.id, entries);
    }
  }

  // Ejected/local rulebooks override the installed Kata by exact ID.
  add(rulebooksIn(workspaceRoot, "docs/**/rulebooks/**/*.md"), false);
  let packageRoot;
  try {
    const workspaceRequire = createRequire(path.join(path.resolve(workspaceRoot), "package.json"));
    packageRoot = path.dirname(workspaceRequire.resolve("specdojo/package.json"));
  } catch {
    // A source checkout or a workspace with no installed SpecDojo uses local rulebooks only.
  }
  if (packageRoot && packageRoot !== path.resolve(workspaceRoot)) {
    add(rulebooksIn(packageRoot, "docs/ja/specdojo/rulebooks/**/*.md"), true);
  }
  return index;
}

module.exports = function createDeliverableTypeChecker(workspaceRoot) {
  let index;
  return function check(metadata, relativePath, source, hasArtifactSchema, format = "markdown") {
    const isYaml = format === "yaml";
    const isRecord = (value) =>
      value !== null && typeof value === "object" && !Array.isArray(value);
    const isExternal = isYaml && isRecord(metadata?.["x-spec-meta"]);
    if (isExternal) metadata = metadata["x-spec-meta"];
    // These documents may link to an artifact's rulebook, but have their own schemas/types.
    if (
      !isYaml &&
      !hasArtifactSchema &&
      [
        "rulebook",
        "recipe",
        "guide",
        "reference",
        "standard",
        "philosophy",
        "exec-plan",
        "exec-result",
      ].includes(metadata?.type)
    )
      return [];
    const isTemplate = metadata?.type === "template";
    const target = isTemplate
      ? isYaml
        ? metadata.metadata_template
        : metadata.frontmatter_template?.specdojo
      : metadata;
    const field = isYaml
      ? isTemplate
        ? "metadata_template.type"
        : isExternal
          ? "x-spec-meta.type"
          : "type"
      : isTemplate
        ? "specdojo.frontmatter_template.specdojo.type"
        : "specdojo.type";
    const replacements = { domain: "data", command: "api", message: "api" };
    const replacement =
      typeof target?.type === "string" && Object.hasOwn(replacements, target.type)
        ? replacements[target.type]
        : undefined;
    const legacyErrors = replacement
      ? [
          `${field}: ${JSON.stringify(target.type)} is no longer supported. Set type to ${JSON.stringify(replacement)}.`,
        ]
      : [];
    const ref = target?.rulebook;
    if (typeof ref !== "string" || ref === "none") return legacyErrors;

    index ??= buildRulebookIndex(workspaceRoot);
    const candidates = ref.includes(":")
      ? (index.get(ref) ?? [])
      : [...index.entries()]
          .filter(([id]) => id === ref || id.endsWith(`:${ref}`))
          .flatMap(([, entries]) => entries);
    if (candidates.length !== 1) {
      return [
        ...legacyErrors,
        `${field}: rulebook ${ref} ${candidates.length ? "is ambiguous" : "was not found"}; cannot check deliverable_type.`,
      ];
    }
    const [{ metadata: rulebook, filePath }] = candidates;
    if (typeof rulebook.deliverable_type !== "string" || !rulebook.deliverable_type) {
      return [
        ...legacyErrors,
        `Rulebook ${ref} (${filePath}) must declare deliverable_type before ${field} can be checked.`,
      ];
    }
    if (target.type === rulebook.deliverable_type) return legacyErrors;
    return [
      ...legacyErrors,
      `${field}: ${JSON.stringify(target.type) ?? "missing"} does not match rulebook ${ref}; declared deliverable_type is ${JSON.stringify(rulebook.deliverable_type)}. Set type to ${JSON.stringify(rulebook.deliverable_type)}.`,
    ];
  };
};
