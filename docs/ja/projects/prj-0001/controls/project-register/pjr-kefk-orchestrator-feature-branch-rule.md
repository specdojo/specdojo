---
specdojo:
  id: prj-0001:pjr-kefk-orchestrator-feature-branch-rule
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-23T02:37:13Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-23T02:48:26Z"
  conclusion: "オーケストレーター規範へ commit 先ブランチの選び方を追記し、SSOT と 5 環境のラッパーを同期した。feature ブランチ経由の PR #6 で統合した。"
---

# PJR-KEFK オーケストレーター規範に feature ブランチ経由の commit 方針を反映する

## 1. 概要

[[prj-0001:pjr-ewwx-feature-branch-policy]] で、develop へ入る経路を exec ブランチ / feature ブランチ / 記帳の直接 commit の 3 層に分けることを決めた。オーケストレーター規範の現行記述は commit の承認方針しか定めておらず、どのブランチで commit するかを指示していない。このままではオーケストレーターは develop へ commit し続ける。

規範の正本は `.agents/specdojo-orchestrator.agent.md` で、Claude / Codex / Copilot / opencode の 4 環境に薄いラッパーがある。本文はバイト一致で保守し、`tools/validate-orchestrator-sync.mjs` が検証する。

## 2. 完了条件

- `.agents/specdojo-orchestrator.agent.md` に、自分が内容を書いた変更は `feature/<project-id>/<topic>` を切って commit し、`git push` と PR 作成は利用者へ引き渡すことが書かれている。
- register の記帳（起票・状態遷移・生成物の再構築）は対象 project の `develop` へ直接 commit してよいことが、例外として明記されている。
- exec に流す予定の `todo` は実行前に `develop` へ入っている必要があることが書かれている。
- 4 環境のラッパーが本文とバイト一致し、`npm run validate:orchestrator-sync` が通過する。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ                           |
| --- | ------------------------------------------------------------------- | ---- | ---- | ------------------------------ |
| 1   | SSOT 本文の `基本方針` へ、ブランチの選び方と記帳の例外を追記する   | DEV  | open | オーケストレーターが直接対応   |
| 2   | 4 環境のラッパーへ本文を同期し、`validate:orchestrator-sync` を通す | DEV  | open | 同上                           |
| 3   | feature ブランチを切って commit し、push と PR を利用者へ引き渡す   | DEV  | open | 決定した経路をそのまま適用する |

## 4. 対応結果

- `.agents/specdojo-orchestrator.agent.md` の `基本方針` へ、commit 先ブランチの選び方を 1 項目（子 4 行）追加した。記帳は対象 project の `develop` へ直接 commit してよいこと、自分が内容を書いた変更は `feature/<project-id>/<topic>` を切って commit し push と PR は利用者へ引き渡すこと、`exec run` は `develop` 上で実行すること、exec に流す `todo` は実行前に `develop` へ入れておくことを明記した。
- 同期対象のラッパーは 4 ではなく 5 だった（`.claude/agents`、`.github/agents`、`.opencode/agents` の gemma と qwen、`.codex/agents` の TOML）。全 5 件へ本文を反映し、`npm run lint:orchestrator-sync` が `OK (5 wrappers)` を返すことを確認した。
- `npm run check` が通過した（118 files / 1629 tests）。
- 統合経路の検証: `feature/prj-0001/orchestrator-feature-branch-rule` から PR #6 を作成し、merge commit `428de095` として develop へ統合した。develop へ入ったのは `6e785879` の 1 commit だけで、first-parent には merge commit 1 件だけが現れた。今回は feature を切る前に develop を push 済みにしたため、PJR-EWWX で観測した差分の混入は発生しなかった。
- リポジトリ設定で squash merge と rebase merge が無効化されており、PR 画面に `Merge pull request` しか表示されないことを確認した。標準が求める merge commit 方式が設定で強制されている。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ewwx-feature-branch-policy]]
- [[specdojo:git-branching-standard]]
- `.agents/specdojo-orchestrator.agent.md`
- `tools/validate-orchestrator-sync.mjs`
