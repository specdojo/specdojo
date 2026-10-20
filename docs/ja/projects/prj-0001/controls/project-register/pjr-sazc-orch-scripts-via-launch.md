---
specdojo:
  id: prj-0001:pjr-sazc-orch-scripts-via-launch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T09:10:37Z"
  due_on: "2026-10-31"
---

# PJR-SAZC 本リポジトリの orch:* の script を orchestrator launch 経由にする

## 1. 概要

本リポジトリの package.json の orch:opus などは provider の CLI を直接起動し、specdojo orchestrator launch を経由しないため、repos で宣言したプロダクトリポジトリが --add-dir などで許可されない。config scaffold が利用者に作る script と同じく launch 経由にし、:work の付く script の扱いも決める

## 2. 完了条件

- 本リポジトリの `package.json` の `orch:*`（claude・codex・copilot・antigravity・opencode）が、`specdojo orchestrator launch --provider <name> -- <provider の引数>` を経由して provider の CLI を起動する。本リポジトリでは CLI 自身を開発しているため、手元のソース（`tsx src/specdojo.ts` など）で launch を起動する。
- `SPECDOJO_PROJECT=prj-0002` のシェルで `npm run orch:opus` を起動すると、`specdojo-lp` が許可される（claude では `--add-dir` と `Edit` の許可が付く）。`repos` を持たない project（prj-0001）では、追加の引数が付かない。
- `:work` の付く script（`tools/worktree/open-agent-worktree.sh` でエージェント用の worktree を開いてから起動するもの）で、worktree の中から `repos[].path`（`../specdojo-lp`）を解いたときに設定の読み込みが失敗しないかを確かめ、扱いを決めている。
- _UNDECIDED_: `:work` の付く script の扱い（launch 経由にして path の解き方を直す、launch 経由にしない、など）は、確かめた結果で決める。
- `package.json` は保護された設定のため、変更は利用者の承認を得てから行う。
- executor は `package.json` を変更しない（runner が保護された設定への書き込みを止める）。書き換える `orch:*` と `orch:*:work` の script の案を、そのまま貼れる JSON の形で result に書き、反映はオーケストレーターが利用者の承認を得て feature ブランチで行う（2026-10-21、利用者の承認）。
- 起動の確かめ方: executor は agent を起動できないため、`orchestrator launch` が組み立てる引数を、単体テストまたは launch の実装を読んで確かめ、prj-0001 と prj-0002 で付く引数を result に書く。実際の起動の確認は、反映の後にオーケストレーターが行う。
- `:work` の扱いは、`tools/worktree/open-agent-worktree.sh` と設定の読み込みを読み、worktree の中から `repos[].path` を解いたときの結果を確かめて決め、決めた内容と理由を result と個票の対応結果に書く。直すために `src/` や `tools/` の変更が要る場合は、この項目で直し、単体テストを足す。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す（`src/` や `tools/` を変えた場合）。
- [[specdojo:orchestrator-operation-guide]] など、本リポジトリの起動方法を説明する箇所が実際の script と一致している。

## 3. 作業内容

| No  | 作業                                                        | 担当 | 状態 | メモ                                      |
| --- | ----------------------------------------------------------- | ---- | ---- | ----------------------------------------- |
| 1   | `:work` の付く script で `repos` の path が解けるか確かめる | DEV  | open | -                                         |
| 2   | `orch:*` を launch 経由に書き換え、起動を確かめる           | DEV  | open | `package.json` の変更は利用者の承認を得る |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:specdojo-config-reference]]: `repos` と、オーケストレーターの起動時の許可。
- [[specdojo:orchestrator-operation-guide]]: オーケストレーターの起動方法。
- 前例: `src/exec-provider-scaffold.ts` の `ORCHESTRATOR_NPM_SCRIPTS`（利用者向けの script は launch 経由）。
- 回避策（2026-10-12）: `npx tsx src/specdojo.ts orchestrator launch --provider claude -- --agent specdojo-orchestrator --model opus`。
