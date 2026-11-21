import { posix } from "node:path";
import { isRecord } from "./yaml-table-shared.js";
import {
  renderBdd,
  renderDct,
  renderDctIndex,
  renderMembers,
  renderMilestones,
  renderRoles,
  renderTimeline,
  renderViewpoints,
} from "./yaml-business-tables.js";
import { renderCommand, renderFileInterface } from "./yaml-interface-tables.js";

// type とファイル系列の両方で限定し、template・schema・grade 記録などを巻き込まない。
export function renderTypedYamlTable(path: string, parsed: unknown): string | undefined {
  if (!isRecord(parsed) || /\/(?:templates|schemas|execution|jobs|routines)\//.test(path))
    return undefined;
  const name = posix.basename(path).replace(/\.ya?ml$/, "");
  if (parsed.type === "template" || parsed.openapi || parsed.asyncapi) return undefined;
  if (/^bdd-/.test(name) && parsed.type === "data" && Array.isArray(parsed.entities))
    return renderBdd(parsed);
  if (parsed.type === "project") {
    if (/^pm-roles(?:-|$)/.test(name) && Array.isArray(parsed.roles)) return renderRoles(parsed);
    if (/^pm-members(?:-|$)/.test(name) && Array.isArray(parsed.members))
      return renderMembers(parsed);
    if (/^tml-/.test(name) && Array.isArray(parsed.tracks)) return renderTimeline(parsed);
    if (
      name === "sch-milestones" &&
      parsed.kind === "milestones" &&
      Array.isArray(parsed.milestones)
    )
      return renderMilestones(parsed);
    if (/^dct-index(?:-|$)/.test(name) && Array.isArray(parsed.groups))
      return renderDctIndex(parsed);
    if (/^dct-/.test(name) && typeof parsed.domain === "string" && Array.isArray(parsed.groups))
      return renderDct(parsed);
  }
  if (
    /^pm-review-viewpoints(?:-|$)/.test(name) &&
    ["project", "standard"].includes(String(parsed.type))
  )
    return renderViewpoints(parsed);
  if (/^ifx-cmd-/.test(name) && parsed.type === "api" && isRecord(parsed.command))
    return renderCommand(parsed);
  const meta = isRecord(parsed["x-spec-meta"]) ? parsed["x-spec-meta"] : parsed;
  if (/^ifx-file-/.test(name) && meta.type === "api" && Array.isArray(parsed.files))
    return renderFileInterface(parsed);
  return undefined;
}
