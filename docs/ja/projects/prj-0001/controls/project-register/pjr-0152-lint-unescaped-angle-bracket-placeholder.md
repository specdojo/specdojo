---
specdojo:
  id: prj-0001:pjr-0152-lint-unescaped-angle-bracket-placeholder
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-08-31"
  completed_at: "2026-08-05T12:00:00Z"
  conclusion: 未エスケープ山括弧プレースホルダ検知のremarkプラグイン(remark-no-unescaped-angle-placeholder)を実装しroot .remarkrc.yamlへ配線。HTMLタグ許可リストで正規HTML(br/details等)を非検知、`<lang>`/`<topic>`等を検知。unit test10件・全docs誤検知ゼロ・npm run check通過を確認
---

# PJR-0152 未エスケープの山括弧プレースホルダ（`<lang>`等）を検知するlintルールの追加

## 1. 概要

markdown.instructions.mdは山括弧付きプレースホルダをインラインコードで囲むことを必須としているが、機械的な検知手段がない。MD033(インラインHTML禁止)は`<br>`や`<details>`等の正規HTML利用と衝突するため有効化できない。実在HTMLタグ名の許可リストを用いたカスタムルールを、既存のremarkプラグイン基盤(tools/docs/src配下、.remarkrc.yaml、lint:fm)またはmarkdownlintのcustomRulesに追加し、docs:build失敗(Vueコンパイラのタグ未クローズエラー)を未然に防ぐ

`markdown.instructions.md` は山括弧付きプレースホルダ（例: `<project-id>`）をインラインコードで囲むことを必須としているが、機械的な検知手段がない。実際にPJR-0145/0146で未エスケープの `<lang>`/`<topic>` が混入し、VitePressのVueテンプレートコンパイラが未クローズのHTMLタグと解釈して `docs:build` が失敗した（`fix: PJR-0145/0146の未エスケープ山括弧プレースホルダを修正しdocs:build失敗を解消`で対応済み）。`MD033`（インラインHTML禁止）は `<br>` や `<details>` 等の正規HTML利用（`docs/` 全体で150件以上）と衝突するため単純に有効化できない。実在HTMLタグ名の許可リストを用いたカスタムルールを追加し、同種の不具合を未然に防ぐ。

## 2. 完了条件

- 実在HTMLタグ名の許可リスト（`br`/`details`/`summary`等）を用いて、許可リスト外の `<word>` パターンのうちインラインコード（バッククォート）で囲まれていないものを検知するルールが実装されている。
- 実装場所（`tools/docs/src` 配下のremark-lintプラグイン + `.remarkrc.yaml`、または markdownlintの `customRules`）が決定され、`npm run lint:fm` または `npm run lint:md` に組み込まれている。
- 既存の `docs/` 配下で誤検知（`<br>`等の正規HTML利用）が発生しないことを確認している。
- PJR-0145/0146で発生した実際の違反パターン（`<lang>`、`<topic>`）を検知できることをテストで確認している。
- ルール追加により `npm run check`（またはCI相当）が既存docsに対してエラーなく通過することを確認している。

## 3. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ                                                           |
| --- | ------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------- |
| 1   | 実装場所（remark-lintプラグイン or markdownlint customRules）の選定 | ARC  | done | remark プラグイン方式（AST の `html` ノードを検査）を採用      |
| 2   | 実在HTMLタグ名の許可リスト設計                                      | ARC  | done | HTML Living Standard の要素一覧＋廃止要素/SVG/MathML を許可    |
| 3   | 検知ルールの実装                                                    | ARC  | done | `remark-no-unescaped-angle-placeholder.ts` を実装              |
| 4   | `lint:fm`/`lint:md` への組み込み                                    | ARC  | done | 統合時に root `.remarkrc.yaml` の plugins へ配線（human 適用） |
| 5   | 既存 `docs/` 配下での誤検知有無の確認（正規HTML利用との切り分け）   | ARC  | done | 全 `docs/**/*.md` 走査テストで誤検知ゼロを確認                 |
| 6   | 単体テスト追加（違反検知・正規HTML非検知の両方）                    | ARC  | done | vitest 10 ケース（実 docs 走査含む）を追加・全 pass            |

## 4. 対応結果

- 検知ロジックは remark プラグイン `tools/docs/src/remark-no-unescaped-angle-placeholder.ts`（＋`.cjs` ラッパー）として実装した。remark は本文中の `<xxx>` を tag 名が HTML 文法に合致すると `html` ノードとして解釈するため、`html` ノードを走査し、実在 HTML 要素の許可リストに無い tag 名を「未エスケープの山括弧プレースホルダ」として警告する。インラインコード（バッククォート）内は `inlineCode` ノードとなり `html` ノードにならないため検知対象外となる。
- 単体テスト `tests/tools/docs/src/remark-no-unescaped-angle-placeholder.test.ts` を追加（vitest 10 ケース、全 pass）。PJR-0145/0146 で実際に発生した `<lang>` / `<topic>`、および `<project-id>` / `Array<string>` / `prefix-<term>-suffix` を検知し、`` `<lang>` `` のようなインラインコード・`<br>` / `<details>` / `<summary>` 等の正規 HTML・コードフェンス内・HTML コメント・autolink を検知しないことを確認した。
- 誤検知確認: テスト内で全 `docs/**/*.md` をプラグインで走査し、警告ゼロ（誤検知なし）を確認した。
- `lint:fm` への組み込み: 統合時に human（orchestrator）が root `.remarkrc.yaml` の `plugins` へ `./tools/docs/src/remark-no-unescaped-angle-placeholder.cjs` を追加。`npm run lint:fm` / `npm run check` が既存 docs に対しエラーなく通過することを確認済み（誤検知ゼロ）。agent 実行時にサンドボックスで残置したプローブファイル（`docs/.remarkrc.yaml`・`docs/ja/__cascade_probe__/`・`tools/docs/src/_probe.mjs`）も統合時に削除済み。

## 5. 関連ドキュメント

- tools/docs/src/remark-no-unescaped-angle-placeholder.ts
- tools/docs/src/remark-no-unescaped-angle-placeholder.cjs
- tests/tools/docs/src/remark-no-unescaped-angle-placeholder.test.ts
- tools/docs/src/remark-md-content.cjs
- .remarkrc.yaml
- .markdownlint.yaml
