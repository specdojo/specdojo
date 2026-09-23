---
specdojo:
  id: prj-0001:pjr-kefk-orchestrator-feature-branch-rule
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-23T02:37:13Z"
  due_on: "2026-09-30"
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

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-ewwx-feature-branch-policy]]
- [[specdojo:git-branching-standard]]
- `.agents/specdojo-orchestrator.agent.md`
- `tools/validate-orchestrator-sync.mjs`
