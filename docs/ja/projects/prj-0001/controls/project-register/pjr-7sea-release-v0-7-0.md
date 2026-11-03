---
specdojo:
  id: prj-0001:pjr-7sea-release-v0-7-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: PO
  registered_at: "2026-11-03T05:35:47Z"
  due_on: "2026-11-03"
  depends_on:
    - PJR-561Q
    - PJR-FVRZ
    - PJR-W7YX
  commit_type: chore
  commit_scope: release
---

# PJR-7SEA 0.7.0 でリリースする

## 1. 概要

specdojo 0.7.0 と @specdojo/docs-site 0.4.0 を公開する。@specdojo/docs-lint は変更がないため 0.4.0 のままとする

## 2. 入力

- 0.6.0 からの変更: CHANGELOG の Unreleased に 8 件（orch:argon、schedule の --resume-from executor、docs-site の D2、devcontainer host-script など）。概念データフロー図の Kata の見直し（全体概要とユースケース別、D2 記法ルール）。docs-site の D2 の SVG 生成とサイドメニューへの Kata の掲載。docs-lint と vscode-specdojo は変更なし。破壊的変更はない（2026-11-03）
- 利用者の判断: 本体 0.7.0、docs-site 0.4.0。不具合 3 件（PJR-561Q・PJR-FVRZ・PJR-W7YX）の修正を待って含める。docs-site に Git 管理された一時ファイル `packages/docs-site/.vitepress/config.mts.timestamp-*.mjs` を消して .gitignore に足し、CHANGELOG に Kata の見直しと docs-site のサイドメニューを追記する作業をこの todo で行う。リリースは 2026-11-03 中に行う（2026-11-03）
- 手順は pm-orchestrator-playbook の「リリースの手順」に従う。push・PR の merge・タグ・npm の公開の承認は利用者が行う（2026-11-03）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
