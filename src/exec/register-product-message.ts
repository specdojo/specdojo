import { basename } from "node:path";
import { resolveItemCommitTypeAndScope } from "../register/item.js";
import type { PjrItem } from "../register/register.js";
import { expandCommitMessageTemplate } from "../shared/commit-message-template.js";
import type { SpecDojoProjectConfig, SpecDojoRepoConfig } from "../shared/specdojo-config.js";
import { commitSubject } from "./run/mode-shared.js";
import { refsTrailer } from "./repo-trace.js";
import { productIntegrationTarget } from "./task-repos.js";
import type { ProductWorktree } from "./worktree.js";

/** Build only product messages; project bookkeeping keeps its existing subjects. */
export function registerProductMessage(params: {
  projectId: string;
  item: Pick<PjrItem, "id" | "title" | "type" | "commitType" | "commitScope">;
  ticketPath?: string | null;
  projectConfig?: SpecDojoProjectConfig;
  repoConfig?: SpecDojoRepoConfig;
  product: ProductWorktree;
  kind: "commit" | "merge";
}): string {
  const { item, projectId, repoConfig, product } = params;
  const template =
    params.kind === "commit"
      ? repoConfig?.commit_subject_template
      : repoConfig?.merge_message_template;
  const { type, scope } = resolveItemCommitTypeAndScope(item, {
    projectConfig: params.projectConfig,
    repoConfig,
  });
  const topic = params.ticketPath
    ? basename(params.ticketPath)
        .replace(/^pjr-[a-z0-9]{4}-/, "")
        .replace(/\.md$/, "")
    : item.id.toLowerCase();
  const expanded =
    template === undefined
      ? commitSubject(`exec(register ${item.id}): `, item.title)
      : expandCommitMessageTemplate(template, {
          id: item.id,
          project: projectId,
          topic,
          type,
          scope: scope ?? "",
          title: item.title.replace(/\s+/g, " ").trim(),
          branch: product.branch,
          target: productIntegrationTarget(product),
        });
  // Commit templates are subjects; merge templates may also provide a body.
  const [first = "", ...body] = expanded.replace(/\r\n?/g, "\n").trim().split("\n");
  const message =
    params.kind === "commit"
      ? commitSubject("", expanded)
      : [commitSubject("", first), ...body].join("\n");
  const trailer = refsTrailer(projectId, item.id);
  // Keep exactly one required trailer at the end, even if the template supplied it earlier.
  const withoutTrailer = message
    .split("\n")
    .filter((line) => line.trim() !== trailer)
    .join("\n")
    .trimEnd();
  if (!withoutTrailer.split("\n")[0]?.trim()) {
    throw new Error(
      `${product.name}: ${params.kind} message template expanded to an empty subject`,
    );
  }
  return `${withoutTrailer}\n\n${trailer}`;
}
