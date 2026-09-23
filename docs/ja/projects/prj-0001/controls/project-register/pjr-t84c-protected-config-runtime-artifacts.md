---
specdojo:
  id: prj-0001:pjr-t84c-protected-config-runtime-artifacts
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-23T03:10:28Z"
  due_on: "2026-09-26"
---

# PJR-T84C 保護対象のうち agent 実行時に生成されるディレクトリを除外する

## 1. 概要

[[prj-0001:pjr-2t2s-antigravity-provider]] の作業 9 で、agent が自分の指示を書き換えられないよう `.agents/rules`、`.agents/skills`、`.claude`、`.codex`、`.opencode`、`.github/agents`、`AGENTS.md`、`CLAUDE.md`、`GEMINI.md` を保護対象へ加えた。ディレクトリ単位で指定したため、agent が実行時に生成するファイルまで検知対象になっている。

PJR-03M3 の実行（codex-expert-executor / gemma-reporter / worktree）が、次の誤検知で `waiting` になった。

```text
agent-config-write: protected configuration changes detected
paths=.opencode/.gitignore, .opencode/node_modules/.bin/..., （node_modules 配下が数百件）
```

opencode は起動時に `.opencode/node_modules/` へプラグインを install し、`.opencode/.gitignore` を作る。これらは指示ファイルではなく実行時生成物であり、保護の目的（agent が自分の指示を書き換えない）とは無関係である。現状では gemma-reporter と qwen 系を使う実行がすべて block される。

## 2. 完了条件

- `.opencode/` の保護が指示ファイル（`.opencode/AGENTS.md`、`.opencode/agents/**`）に限定され、`.opencode/node_modules/**` と `.opencode/.gitignore` が検知対象から外れている。
- 他 provider のディレクトリ（`.claude`、`.codex`、`.agents`、`.github/agents`）にも実行時生成物がないか点検し、あれば同様に除外されている。
- 指示ファイルの変更と新規追加は引き続き検知されることを確認する単体テストがある。実行時生成物が検知されないことを確認するテストもある。
- PJR-03M3 を `--resume` で再開でき、gemma-reporter が block されずに完走する。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                               | 担当 | 状態 | メモ                                 |
| --- | ------------------------------------------------------------------ | ---- | ---- | ------------------------------------ |
| 1   | 保護パスの指定をディレクトリ単位から指示ファイル単位へ見直す       | DEV  | open | 除外ではなく対象の絞り込みを優先する |
| 2   | 他 provider の実行時生成物を点検し、必要な除外を加える             | DEV  | open | `.claude` の worktree などに注意     |
| 3   | 検知される／されないを分けた単体テストを追加する                   | DEV  | open | 既存の snapshot テストへ追加する     |
| 4   | PJR-03M3 を `--resume` で再開し、reporter が完走することを確認する | DEV  | open | worktree は保持済み                  |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-2t2s-antigravity-provider]]
- [[prj-0001:pjr-03m3-branch-standard-three-layers]]
- `src/exec-agent-protected-config.ts`
