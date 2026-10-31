---
specdojo:
  id: prj-0001:pjr-b5ty-mermaid-syntax-lint
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: low
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-27T14:12:56Z"
  block_reason: "parent validation failed: test-unit"
  derived_from:
    - PJR-EVAE
---

# PJR-B5TY Mermaid の図の構文を lint で検査する

## 1. 概要

markdownlint と remark は Mermaid の中身を検査せず、図の構文エラーは docs:build か docs:dev で図を描くまで分からない。sandbox の executor も気づけない。変更した Markdown の Mermaid を構文解析する検査を lint の段に加える。

## 2. 完了条件

- Markdown の中の Mermaid のコードブロックを構文解析し、構文エラーをファイル名・行・図の種類・エラーの内容つきで報告し、1 件でもあれば終了コード 1 で終える検査を作る。
- ブラウザ（puppeteer・chromium）を使わずに動くこと。sandbox の executor と、chromium の壊れた Dev Container でも流せるようにするためである。解析の手段（mermaid 12 の `mermaid.parse` を Node で使う、`@mermaid-js/parser` を使う、など）は executor が調べて決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。
- 本リポジトリの `docs/` で使っている図の種類（`flowchart`・`graph`・`stateDiagram-v2`・`classDiagram`・`erDiagram`・`sequenceDiagram`・`block`・`architecture-beta`）をすべて解析できること。解析できない種類があれば、通ったことにせず「未検査」として種類と件数を出す。
- 解析は docs-site と同じ mermaid の版の文法に従う。版がずれたときに気づける形（同じ package を使う、版を照らすなど）は executor が決める。
- 検査の置き場所は、利用者のリポジトリでも使えるよう `@specdojo/docs-lint` の新しいコマンド（例: `specdojo-docs-lint mermaid <glob>`）とするか、本リポジトリの tool とするかを executor が決める。docs-lint に入れる場合は、依存の大きさ（mermaid の導入の重さ）も対応結果に書く。
- 単体テストを足す。対象は、図の種類ごとの正しい図と誤った図、行番号の報告、未検査の扱い、Mermaid のブロックがないファイル。
- 本リポジトリの `docs/` の既存の図をすべて流し、構文エラーがあれば直す。直した図と、未検査になった図を本個票の対応結果に書く。
- npm の script（例: `lint:mermaid`）、`npm run check`、lefthook の pre-commit（変更した Markdown だけ）、exec の親の検証への組み込みは、保護された設定（`package.json`・`lefthook.yml`・`.specdojo/exec-defaults.yaml`）の変更になる。変更せずに案を本個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもと feature ブランチで行う。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。docs-lint に入れる場合は、docs-lint の変更として書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、変更した文書で `npm run lint:md`・`npm run lint:fm` を流して通し、親の検証も通る。

## 3. 作業内容

| No  | 作業                                         | 担当     | 状態 | メモ |
| --- | -------------------------------------------- | -------- | ---- | ---- |
| 1   | 解析の手段と置き場所を調べて決める           | executor | open | -    |
| 2   | 検査とテストを作り、既存の図を流して直す     | executor | open | -    |
| 3   | script・hook・親の検証への組み込みの案を書く | executor | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zmy-document-editing-toolset]]
