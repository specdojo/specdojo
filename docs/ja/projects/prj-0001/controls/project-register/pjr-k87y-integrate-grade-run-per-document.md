---
specdojo:
  id: prj-0001:pjr-k87y-integrate-grade-run-per-document
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: indie
  registered_at: "2026-10-25T14:16:35Z"
---

# PJR-K87Y gradeの単一文書評価パイプライン（run-per-document.sh相当）をspecdojoコマンド本体へ統合する

## 1. 概要

exec run のレビュー前 grade 実行（ensureReviewGrade）が外部スクリプト tools/grade/run-per-document.sh に依存しているため、specdojo grade run サブコマンドとして CLI 本体へ統合する。あわせて今回のマルチリポジトリ運用で確認された関連課題（1. ensureReviewGrade から grade plan -> agent run -> grade apply のネイティブ実行とエージェント自動選択/引き継ぎ、2. dist/grade/targets.js の project.repos マルチリポジトリ相対パス ../ 許容、3. ワークツリー分岐前の grade 結果/criteria サイドカーのチェックポイント対象化、4. exec scaffold --project 時の pm-review-viewpoints.yaml 参照先 standards/ -> defaults/ 修正および viewpoints_path 未設定時の specdojo:pm-review-viewpoints フォールバック、5. xrp-review-*-template.md の done_criteria 表で発生する markdownlint MD060 警告の解消）を解消する。

## 2. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 3. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
