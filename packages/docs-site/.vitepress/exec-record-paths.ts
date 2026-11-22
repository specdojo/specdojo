// VitePress のページ走査・サイドバー・検索とリンク変換で同じ配置規則を使う。
export const EXEC_RECORD_SRC_EXCLUDE = [
  "docs/**/execution/exec/plans/**",
  "docs/**/execution/exec/results/**",
  "docs/**/execution/runs/*/*/*/plan.md",
  "docs/**/execution/runs/*/*/*/result.md",
];

function execRecordKind(link: string): "plan" | "result" | undefined {
  const clean = link
    .replace(/\\/g, "/")
    .split(/[?#]/)[0]
    .replace(/\.(?:md|html)$/, "");
  const legacy = clean.match(/(^|\/)execution\/exec\/(plans|results)\/[^/]+$/);
  if (legacy) return legacy[2] === "plans" ? "plan" : "result";
  const run = clean.match(/(^|\/)execution\/runs\/[^/]+\/[^/]+\/[^/]+\/(plan|result)$/);
  if (run) return run[2] === "plan" ? "plan" : "result";
  return undefined;
}

export const isExecPlanLink = (link: string): boolean => execRecordKind(link) === "plan";
export const isExecResultLink = (link: string): boolean => execRecordKind(link) === "result";

export const isExecRecordPath = (relativePath: string | undefined): boolean =>
  relativePath !== undefined &&
  (execRecordKind(relativePath) !== undefined ||
    /(^|\/)execution\/exec\/(events|plans|results)(\/|$)/.test(relativePath.replace(/\\/g, "/")));

// docs:dev だけで追加する除外。plan / result 以外の実行記録（run の付随ページ・legacy の events や
// trials・grade の結果・ルーチンの失敗記録）も起動時の走査から外す。docs:build の対象は変えない。
export const DEV_EXEC_RECORD_SRC_EXCLUDE = [
  "docs/**/execution/runs/**",
  "docs/**/execution/exec/**",
  "docs/**/execution/jobs/runs/**",
  "docs/**/execution/routines/failures/**",
  "docs/**/execution/grade/results/**",
];

export interface SrcExcludeOptions {
  command: string | undefined;
  includeExecRecords: boolean;
}

export const resolveExecRecordSrcExclude = ({
  command,
  includeExecRecords,
}: SrcExcludeOptions): string[] =>
  command === "dev" && !includeExecRecords
    ? [...EXEC_RECORD_SRC_EXCLUDE, ...DEV_EXEC_RECORD_SRC_EXCLUDE]
    : [...EXEC_RECORD_SRC_EXCLUDE];
