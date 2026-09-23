---
specdojo:
  id: prj-0001:pjr-t84c-protected-config-runtime-artifacts
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-23T03:10:28Z"
  due_on: "2026-09-26"
  completed_at: "2026-09-23T03:43:14Z"
  conclusion: agent の実行時生成物を、既知の生成物かつ ignore 済みという二条件で保護検知から除外した。指示ファイルの保護は維持し、PJR-03M3 の再開で reporter の完走を確認した。
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
| 1   | 保護パスの指定をディレクトリ単位から指示ファイル単位へ見直す       | DEV  | done | 除外ではなく対象の絞り込みを優先する |
| 2   | 他 provider の実行時生成物を点検し、必要な除外を加える             | DEV  | done | `.claude` の worktree などに注意     |
| 3   | 検知される／されないを分けた単体テストを追加する                   | DEV  | done | 既存の snapshot テストへ追加する     |
| 4   | PJR-03M3 を `--resume` で再開し、reporter が完走することを確認する | DEV  | done | worktree は保持済み                  |

## 4. 対応結果

- `src/exec-agent-protected-config.ts` の `GENERATED_PATHS` へ `.opencode/.gitignore`、`.opencode/package.json`、`.opencode/package-lock.json`、`.opencode/bun.lock`、`.claude/settings.local.json` を追加し、ディレクトリ用に `GENERATED_DIRECTORY_PREFIXES`（`.opencode/node_modules/`、`.claude/worktrees/`）を新設した。既存設計どおり「既知の生成物であること」と「git が ignore していること」の二条件でのみ除外する。
- `.opencode/AGENTS.md` と `.opencode/agents/**` は保護対象のまま残した。ディレクトリごと除外する方法は採っていない。agent が `.opencode/.gitignore` に指示ファイルを書き足しても、生成物の列挙に該当しないため保護は外れない。
- snapshot の走査で実行時生成ディレクトリを辿らないようにした。`.opencode/node_modules` は数百ファイルあり、全件の fingerprint を取っても結果は除外されるため無駄である。
- 単体テストを 3 件追加した。実行時生成物が検知されないこと、同時に変更された指示ファイルだけが検知されること、ignore 規則がない環境では生成物候補も保護対象に残ることを確認する。
- `npm run typecheck`、`npm run lint:ts`、`npm run check`（118 files / 1632 tests）が通過した。
- 検証: PJR-03M3 を `--resume` で再開し、gemma-reporter が block されずに `reporter-attempt-1` で完走、merge commit `dcdba1e2` として develop へ統合されたことを確認した。
- 本修正はローカル feature ブランチ `feature/prj-0001/protected-config-runtime-artifacts` で実装し、`--no-ff` merge（`84aed59f`）で develop へ統合した。[[prj-0001:pjr-ewwx-feature-branch-policy]] で決めた層2の経路を、単独運用の条件（Pull Request を使わない）で適用した最初の例である。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2t2s-antigravity-provider]]
- [[prj-0001:pjr-03m3-branch-standard-three-layers]]
- `src/exec-agent-protected-config.ts`
