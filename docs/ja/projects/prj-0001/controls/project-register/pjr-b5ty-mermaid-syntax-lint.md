---
specdojo:
  id: prj-0001:pjr-b5ty-mermaid-syntax-lint
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-27T14:12:56Z"
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

| No  | 作業                                         | 担当     | 状態 | メモ                                                   |
| --- | -------------------------------------------- | -------- | ---- | ------------------------------------------------------ |
| 1   | 解析の手段と置き場所を調べて決める           | executor | done | リポジトリ内 tool から docs-site の Mermaid を直接参照 |
| 2   | 検査とテストを作り、既存の図を流して直す     | executor | done | 189 図を解析。エラー・未検査ともに 0 件で図の修正なし  |
| 3   | script・hook・親の検証への組み込みの案を書く | executor | done | 下記に提案を記載。保護された設定は変更しない           |

## 4. 対応結果

### 4.1. 実装と選定理由

- `tools/lint-mermaid.mjs` を追加した。引数は Markdown のファイルパスまたは glob を複数指定でき、省略時は `docs/**/*.md` を検査する。例えば `node tools/lint-mermaid.mjs 'docs/**/*.md'`、変更した文書だけなら `node tools/lint-mermaid.mjs path/to/changed.md` を実行する。重複した対象は一度だけ検査し、未一致の glob は終了コード 1 にする。
- 解析には [Mermaid の公式の構文検査 API](https://mermaid.js.org/config/usage#syntax-validation-without-rendering) である `mermaid.parse` を採用した。`@mermaid-js/parser` 単体では従来の Jison 系の図も含めた全種類を扱えないため、docs-site が利用する `@mermaid-js/mermaid-cli` の解決位置から Mermaid 本体を直接ロードする。インストールされた同じパッケージを参照するため、別の版へずれず、実行時にも版を表示する。今回の版は 12.0.0。
- 置き場所は本リポジトリの tool とした。`@specdojo/docs-lint` の一般利用者に Mermaid 一式の依存を追加せず、既存の docs-site のインストールを使う。依存追加・lockfile の変更はない。root の Markdown 解析用依存と `packages/docs-site` の依存を導入した開発環境で使う。docs-site の依存がない場合は対象図をすべて未検査として失敗する。
- `tools/mermaid-parse-worker.mjs` と `tools/mermaid-parse-loader.mjs` は構文解析専用の Worker 内で動く。Mermaid は解析時にも DOMPurify を呼ぶため、その Worker 内で Mermaid からの DOMPurify import に限りラベル文字列をそのまま返す実装へ置き換えた。構文解析への入力は変更せず、HTML / SVG の描画・出力・サニタイズ判定は行わない。この置き換えは描画用に使えず、親プロセスや docs-site の描画には適用されない。puppeteer / chromium / DOM 実装の起動や追加は不要。
- Markdown は remark の構文木で解析し、バッククォート・tilde・長い fence・リストや引用内の Mermaid を抽出する。外側のコード例の中にある Mermaid の記載は対象にしない。診断の `file:line` は元の Markdown の開始 fence 行を示す。Mermaid のエラーメッセージ内の行は図内の解析行であり、frontmatter・directive・コメントの前処理でずれる可能性があるため、元文書のエラー行として換算しない。
- エラーごとにファイル・開始行・図の種類・解析エラーの内容を表示し、種類別の成功・構文エラー・未検査件数を集計する。未知の図、空の図、依存や Worker の障害は未検査にし、構文エラーまたは未検査が 1 件以上あれば終了コード 1 とする。
- `tests/tools/lint-mermaid.test.ts` に 8 種類それぞれの正しい図と誤った図、`block-beta`、frontmatter / directive / 日本語ラベル、元文書の行番号、未知・空の図、Mermaid がないファイル、未一致の glob、依存・Worker 障害、CLI の終了コードの単体テストを追加した。実行は親 runner の `test-unit` に委ねる。
- 再開時に親 runner の失敗ログを確認し、CRLF の抽出結果に対して LF を期待していたテストを修正した。抽出処理は入力の改行を保持するため、期待する図の内容も入力と同じ改行で組み立て、LF・CRLF の両方で開始行と内容を検査する。解析に渡す入力を変えない方針を維持した。単体テストの再実行は親 runner が担当する。
- `CHANGELOG.md` の `Unreleased` に開発用 tool として追記した。公開済みの版の節は変更していない。

### 4.2. 既存図の検査

`node tools/lint-mermaid.mjs 'docs/**/*.md'` で 3,572 文書・189 図を検査した。8 種類をすべて解析でき、構文エラー 0 件・未検査 0 件、終了コード 0。修正した既存図、未検査になった図はいずれもない。

| 図の種類            | 解析成功 | 構文エラー | 未検査 |
| ------------------- | -------- | ---------- | ------ |
| `flowchart`         | 161      | 0          | 0      |
| `graph`             | 2        | 0          | 0      |
| `stateDiagram-v2`   | 11       | 0          | 0      |
| `classDiagram`      | 8        | 0          | 0      |
| `erDiagram`         | 3        | 0          | 0      |
| `sequenceDiagram`   | 2        | 0          | 0      |
| `block`             | 1        | 0          | 0      |
| `architecture-beta` | 1        | 0          | 0      |

`lint-ts`・`lint-fm`・`lint-md`・`typecheck`・`test-unit`・`test-integration`・`validate-schema` は親 runner が実行する。executor 内では重複実行しない。

executor では変更した 6 ファイルを Prettier で整形し、`catalog validate` と `register build`、`git diff --check` を終了コード 0 で確認した。カタログ検証では、本変更と関係しない参照先文書の未作成による `based_on` の警告がある。登録簿の再生成は無視対象の派生ビューだけで、個票の状態や登録簿の正本は変更していない。また、`tmp/` の一時 Markdown に正しい図・誤った図・未知の図を混在させた CLI 検査で、成功 1 件・構文エラー 1 件・未検査 1 件、文書名・fence 行・図の種類・エラー内容、想定どおりの終了コード 1 を確認した。一時ファイルは検証後に削除した。

再開後も同じ 3,572 文書・189 図の全件検査、6 ファイルの整形、カタログ検証、登録簿の派生ビュー生成、差分の空白検査が成功した。前回失敗した単体テストは期待値を修正済みだが、修正後の合否はこの executor の終了後に親 runner が実行する検証で確認する。

### 4.3. 保護された設定の変更案（利用者承認後に反映）

以下は提案のみであり、本タスクでは保護された設定を変更していない。利用者承認のもと feature ブランチで反映する。

1. root の `package.json` に `"lint:mermaid": "node tools/lint-mermaid.mjs"` を追加し、`check` の `lint:fm` の後へ `npm run lint:mermaid` を追加する。検査環境には `PUPPETEER_SKIP_DOWNLOAD=true npm --prefix packages/docs-site ci` で docs-site の依存も導入する。ブラウザのダウンロードや起動は不要。
2. `lefthook.yml` の既存の `markdown` command で、Prettier → markdownlint の後へ `&& node tools/lint-mermaid.mjs {staged_files}` を追加する。既存の `glob: "*.md"` を使い、変更した Markdown だけを検査する。
3. exec の親検証には専用 ID `lint-mermaid` を設ける。`src/exec/parent-validation.ts` の ID と固定 registry に `npm run lint:mermaid` 相当の argv を追加し、`ParentValidationId` の型・スキーマ enum と関連テストを更新する。そのうえで `.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` の `lint-md` の後へ `lint-mermaid` を追加する。現在の許可リストにはこの ID がないため、設定だけ追加しても動かない。executor の手動検査から任意コマンドを親へ注入する方式は採らない。

構文検査 tool・テスト・既存図の走査は完了。残る設定反映は、この個票の完了条件で定められた承認後の作業である。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zmy-document-editing-toolset]]
