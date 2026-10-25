---
specdojo:
  id: prj-0001:pjr-k87y-integrate-grade-run-per-document
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: indie
  registered_at: "2026-10-25T14:16:35Z"
---

# PJR-K87Y gradeの単一文書評価パイプライン（run-per-document.sh相当）をspecdojoコマンド本体へ統合する

## 1. 概要

exec run のレビュー前 grade 実行（ensureReviewGrade）が外部スクリプト tools/grade/run-per-document.sh に依存しているため、specdojo grade run サブコマンドとして CLI 本体へ統合する。あわせて今回のマルチリポジトリ運用で確認された関連課題（1. ensureReviewGrade から grade plan -> agent run -> grade apply のネイティブ実行とエージェント自動選択/引き継ぎ、2. dist/grade/targets.js の project.repos マルチリポジトリ相対パス ../ 許容、3. ワークツリー分岐前の grade 結果/criteria サイドカーのチェックポイント対象化、4. exec scaffold --project 時の pm-review-viewpoints.yaml 参照先 standards/ -> defaults/ 修正および viewpoints_path 未設定時の specdojo:pm-review-viewpoints フォールバック、5. xrp-review-*-template.md の done_criteria 表で発生する markdownlint MD060 警告の解消）を解消する。

## 2. 完了条件

- npm package から `npx specdojo grade run` を使え、少なくとも `target`（kata / deliverable）、kata の `kind`、対象文書の `path`、`run-id`、`dry-run`、1 段構成と中断後の再開を扱える。`grade list`・`grade plan`・agent 実行・`grade apply` の連携で評価結果のサイドカーを生成し、同じ run の完了済み段を再適用しない。agent の選択は名簿に従い、実際の actor を記録する。
- `ensureReviewGrade` が本体リポジトリ専用の `tools/grade/run-per-document.sh` の存在を前提にせず、CLI 本体の grade 実行経路を使う。評価が最新の場合は既存結果を使い、失敗時は対象文書・理由を結果へ残す。
- 宣言済み `project.repos` の対象について、grade の対象パスが project の基準ディレクトリから `../` を含む場合も正しく解決する。宣言外のリポジトリや対象外のパスを許さないことをテストで確かめる。
- exec の worktree を作る前に、grade 結果と criteria サイドカーの必要な変更を checkpoint に含める。worktree から grade を参照・更新しても既存結果を失わないことを検証する。
- `exec scaffold --project` は project の `viewpoints_path` に観点の差分雛形を生成し、未設定時は `specdojo:pm-review-viewpoints` を参照する。存在しない `standards/` のパスを生成しない。
- `xrp-review-*-template.md` の `done_criteria` の表を Markdown lint の MD060 に適合させる。変更したテンプレートから生成した文書でも lint が通る。
- `grade` と `exec` の関連テスト、`npm run typecheck`、`npm run lint:ts`、`npm run lint:md`、親の検証を通す。空のリポジトリに `npm pack` の tarball を導入して `grade run` が利用できることを確かめる。runner の変更は統合後に実際の `exec run --register` でも確認する。
- CHANGELOG は `Unreleased` に記載し、公開済みの版を変えない。保護設定の変更が必要なら個票の対応結果と報告の `handoff` に案を残し、反映の承認を待つ。実施内容・検証結果・残課題は個票の対応結果に記録する。

## 3. 作業内容

| No  | 作業                                                       | 担当  | 状態 | メモ |
| --- | ---------------------------------------------------------- | ----- | ---- | ---- |
| 1   | grade の単一文書パイプラインを CLI に統合する              | indie | open | -    |
| 2   | review 前 grade と複数リポジトリのパス解決を対応する       | indie | open | -    |
| 3   | サイドカーの checkpoint と観点 scaffold を修正する         | indie | open | -    |
| 4   | review template の MD060、配布版と runner の動作を確かめる | indie | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:command-reference]]
- [[specdojo:exec-operation-guide]]
