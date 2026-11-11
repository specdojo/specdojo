// YAML artifacts keep metadata at the root; external formats use x-spec-meta.
// Shared by grade and validate:schema (also shipped with the SpecDojo assets).
module.exports = function yamlMetadata(value) {
  const isRecord = (item) => item !== null && typeof item === "object" && !Array.isArray(item);
  if (!isRecord(value)) return undefined;
  return isRecord(value["x-spec-meta"]) ? value["x-spec-meta"] : value;
};
