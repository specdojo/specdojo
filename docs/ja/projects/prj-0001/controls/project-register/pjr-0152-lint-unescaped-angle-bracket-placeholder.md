---
specdojo:
  id: prj-0001:pjr-0152-lint-unescaped-angle-bracket-placeholder
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0152 未エスケープの山括弧プレースホルダ（`<lang>`等）を検知するlintルールの追加

## 1. 概要

`markdown.instructions.md` は山括弧付きプレースホルダ（例: `<project-id>`）をインラインコードで囲むことを必須としているが、機械的な検知手段がない。実際にPJR-0145/0146で未エスケープの `<lang>`/`<topic>` が混入し、VitePressのVueテンプレートコンパイラが未クローズのHTMLタグと解釈して `docs:build` が失敗した（`fix: PJR-0145/0146の未エスケープ山括弧プレースホルダを修正しdocs:build失敗を解消`で対応済み）。`MD033`（インラインHTML禁止）は `<br>` や `<details>` 等の正規HTML利用（`docs/` 全体で150件以上）と衝突するため単純に有効化できない。実在HTMLタグ名の許可リストを用いたカスタムルールを追加し、同種の不具合を未然に防ぐ。

## 2. 完了条件

- 実在HTMLタグ名の許可リスト（`br`/`details`/`summary`等）を用いて、許可リスト外の `<word>` パターンのうちインラインコード（バッククォート）で囲まれていないものを検知するルールが実装されている。
- 実装場所（`tools/docs/src` 配下のremark-lintプラグイン + `.remarkrc.yaml`、または markdownlintの `customRules`）が決定され、`npm run lint:fm` または `npm run lint:md` に組み込まれている。
- 既存の `docs/` 配下で誤検知（`<br>`等の正規HTML利用）が発生しないことを確認している。
- PJR-0145/0146で発生した実際の違反パターン（`<lang>`、`<topic>`）を検知できることをテストで確認している。
- ルール追加により `npm run check`（またはCI相当）が既存docsに対してエラーなく通過することを確認している。

## 3. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 実装場所（remark-lintプラグイン or markdownlint customRules）の選定 | ARC  | open | -    |
| 2   | 実在HTMLタグ名の許可リスト設計                                      | ARC  | open | -    |
| 3   | 検知ルールの実装                                                    | ARC  | open | -    |
| 4   | `lint:fm`/`lint:md` への組み込み                                    | ARC  | open | -    |
| 5   | 既存 `docs/` 配下での誤検知有無の確認（正規HTML利用との切り分け）   | ARC  | open | -    |
| 6   | 単体テスト追加（違反検知・正規HTML非検知の両方）                    | ARC  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- tools/docs/src/remark-md-content.cjs
- .remarkrc.yaml
- .markdownlint.yaml
