---
specdojo:
  id: prj-0001:pjr-9jn6-change-scope-protected-list-overlap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-11-17T12:54:58Z"
  derived_from:
    - PJR-MJ8V
  commit_type: fix
  commit_scope: exec
---

# PJR-9JN6 完了条件の保護された設定の一覧が変更範囲と読まれ、関係のない項目が順番待ちになる

## 1. 課題内容

保護された設定を「変えない」と書いた完了条件の文から .agents などが変更範囲として推定され、触る範囲の違う項目どうしが重なると判定される

## 2. 入力

- 2026-11-17 に PJR-8NB8 と PJR-C07H を並べて流すと、C07H が「[scope] waiting: PJR-C07H — PJR-8NB8: project:.agents <> project:.agents」で 8NB8 の統合まで待った。8NB8 は JSEY の手順のコマンド化、C07H は親の検証の計測で、どちらも .agents を変える予定はない
- どちらの完了条件にも「保護された設定（lefthook.yml・.agents/・.claude/・.codex/・package.json・.specdojo/ など）は変えない」という文があり、ほかの多くの項目の完了条件にも同じ文がある。PJR-MJ8V の 2 回目で plan の共通の手順は推定から外したが、項目ごとの完了条件の中の「変えない」と書いた一覧は推定に残っている
- 止まりはしないが、この文を持つ項目は並べても順番に流れ、並べる効果がなくなる

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
