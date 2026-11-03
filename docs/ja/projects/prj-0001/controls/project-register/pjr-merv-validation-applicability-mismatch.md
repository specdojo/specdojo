---
specdojo:
  id: prj-0001:pjr-merv-validation-applicability-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-03T12:53:22Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GQN3
  commit_type: fix
  commit_scope: exec
---

# PJR-MERV 検査の対象外の判断が runner と executor で食い違う

## 1. 課題内容

runner は自分が書く plan・result を変更ファイルに含めて履歴のリンクやカタログの検査を求め、executor は自分が変えたファイルだけを見て対象外とするため、作業が済んでも blocked になる

## 2. 入力

- 2026-11-03 の data-flow-uc-rewrite の実行で、executor が plan の求める検査を対象外として流さず、runner が「executor validation failed or not run」で止める事象が 4 回起きた（routine の opus と schedule の opus が validate:history-links、schedule の flash-high が validate:catalog。いずれもプロダクトの文書だけを変えたタスク）
- src/exec/reporter.ts の isValidNotApplicableValidation は、対象外の理由があっても、変更ファイル（runner が書く exec の plan・result を含む）から検査が対象になると判定すると block する。executor は自分が変えたプロダクトの文書だけを見て対象外と判断している（2026-11-03）
- 直し方の案: runner が書いたファイルによって対象になる検査は runner が流す、または plan に runner が書くファイルも検査の対象に入ることを明記する。どちらにするかは選択肢と理由を記録して決める（2026-11-03）

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
