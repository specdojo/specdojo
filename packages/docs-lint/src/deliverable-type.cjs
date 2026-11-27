const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const { load, YAML11_SCHEMA, DEFAULT_SCHEMA } = require("js-yaml");
// Resolve the shared asset from the source checkout or the installed SpecDojo package.
const yamlMetadataPath = path.resolve(__dirname, "../../../docs/specdojo/lib/yaml-metadata.cjs");
function loadYamlMetadataReader() {
  if (fs.existsSync(yamlMetadataPath)) return require(yamlMetadataPath);
  try {
    return require("specdojo/docs/specdojo/lib/yaml-metadata.cjs");
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") throw error;
    // Preserve standalone docs-lint and compatibility with older SpecDojo releases.
    return (value) => {
      const isRecord = (item) => item !== null && typeof item === "object" && !Array.isArray(item);
      if (!isRecord(value)) return undefined;
      return isRecord(value["x-spec-meta"]) ? value["x-spec-meta"] : value;
    };
  }
}
const yamlMetadata = loadYamlMetadataReader();

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

// Lists rulebook files as sorted absolute `/`-separated paths. node:fs globSync skips dot entries
// unless the pattern names them and `**` does not descend into symbolic links to directories;
// symbolic links to files are kept.
function rulebooksIn(root, pattern) {
  const files = fs
    .globSync(pattern, { cwd: root, withFileTypes: true, exclude: ["**/generated/**"] })
    .map((entry) => path.resolve(entry.parentPath, entry.name))
    .filter((filePath) => fs.statSync(filePath, { throwIfNoEntry: false })?.isFile() === true)
    .map((filePath) => filePath.replaceAll("\\", "/"));
  return [...new Set(files)].sort((left, right) => left.localeCompare(right));
}

function readLocales(workspaceRoot) {
  const configPath = path.join(workspaceRoot, ".specdojo/index-config.yaml");
  if (!fs.existsSync(configPath)) return [];
  try {
    const config = load(fs.readFileSync(configPath, "utf8"));
    return Array.isArray(config?.locales)
      ? config.locales.filter((locale) => typeof locale === "string" && locale.length > 0)
      : [];
  } catch {
    // Match the document index's behavior for an unreadable or invalid config.
    return [];
  }
}

function localeOf(filePath, root, locales) {
  const [directory, locale] = path.relative(root, filePath).replaceAll("\\", "/").split("/");
  return directory === "docs" && locales.includes(locale) ? locale : null;
}

function buildRulebookIndex(workspaceRoot, locales = readLocales(workspaceRoot)) {
  const index = new Map();
  function add(files, root, fallback) {
    for (const filePath of files) {
      const metadata = readMetadata(filePath);
      if (metadata?.type !== "rulebook" || typeof metadata.id !== "string") continue;
      if (fallback && index.has(metadata.id)) continue;
      const entries = index.get(metadata.id) ?? [];
      entries.push({ metadata, filePath, locale: localeOf(filePath, root, locales) });
      index.set(metadata.id, entries);
    }
  }

  // Ejected/local rulebooks override the installed Kata by exact ID.
  add(rulebooksIn(workspaceRoot, "docs/**/rulebooks/**/*.md"), workspaceRoot, false);
  let packageRoot;
  try {
    const workspaceRequire = createRequire(path.join(path.resolve(workspaceRoot), "package.json"));
    packageRoot = path.dirname(workspaceRequire.resolve("specdojo/package.json"));
  } catch {
    // A source checkout or a workspace with no installed SpecDojo uses local rulebooks only.
  }
  if (packageRoot && packageRoot !== path.resolve(workspaceRoot)) {
    add(rulebooksIn(packageRoot, "docs/ja/specdojo/rulebooks/**/*.md"), packageRoot, true);
  }
  return index;
}

const workspaceIndexCache = new Map();

function getRulebookIndex(workspaceRoot) {
  const resolvedRoot = path.resolve(workspaceRoot || process.cwd());
  let index = workspaceIndexCache.get(resolvedRoot);
  if (!index) {
    const locales = readLocales(resolvedRoot);
    index = {
      entries: (createDeliverableTypeChecker.buildRulebookIndex ?? buildRulebookIndex)(
        resolvedRoot,
        locales,
      ),
      locales,
    };
    workspaceIndexCache.set(resolvedRoot, index);
  }
  return index;
}

function clearCache(workspaceRoot) {
  if (workspaceRoot) {
    workspaceIndexCache.delete(path.resolve(workspaceRoot));
  } else {
    workspaceIndexCache.clear();
  }
}

function createDeliverableTypeChecker(workspaceRoot) {
  const resolvedRoot = path.resolve(workspaceRoot || process.cwd());
  return function check(metadata, relativePath, source, hasArtifactSchema, format = "markdown") {
    const isYaml = format === "yaml";
    const isRecord = (value) =>
      value !== null && typeof value === "object" && !Array.isArray(value);
    const isExternal = isYaml && isRecord(metadata?.["x-spec-meta"]);
    if (isYaml) metadata = yamlMetadata(metadata);
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

    const { entries: index, locales } = getRulebookIndex(resolvedRoot);
    const matches = ref.includes(":")
      ? index.has(ref)
        ? [[ref, index.get(ref)]]
        : []
      : [...index.entries()].filter(([id]) => id === ref || id.endsWith(`:${ref}`));
    let candidates = matches.flatMap(([, entries]) => entries);
    // Select a language variant only after resolving the logical ID uniquely. Neutral/localized
    // collisions and duplicate files in the selected locale must still be reported as ambiguous.
    if (matches.length === 1 && candidates.every((entry) => entry.locale !== null)) {
      const sourceLocale = localeOf(
        path.resolve(resolvedRoot, relativePath),
        resolvedRoot,
        locales,
      );
      const preferred = [sourceLocale, ...locales].find(
        (locale) => locale !== null && candidates.some((entry) => entry.locale === locale),
      );
      candidates = candidates.filter((entry) => entry.locale === preferred);
    }
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
}

createDeliverableTypeChecker.clearCache = clearCache;
createDeliverableTypeChecker.buildRulebookIndex = buildRulebookIndex;

module.exports = createDeliverableTypeChecker;
