---
specdojo:
  id: prj-0001:pjr-6nem-d2-rendering-foundation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-10-31T14:15:05Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2ZMY
---

# PJR-6NEM D2 の図を描画・検査する基盤を用意する

## 1. 概要

PJR-2ZMY の決定（複雑な図は D2 で描く）を受け、文書のサイトのビルドで D2 のコードブロックを SVG に書き出し、Mermaid と同じく文書の検査と commit の hook で構文を検査できるようにする。Dev Container と CI に d2 の CLI を入れる

## 2. 入力

- PJR-2ZMY で、図は複雑さで使い分け、複雑な図は D2 で描くと決めた（2026-10-31、indie）
- D2 は MPL-2.0。配置のエンジンは同梱の dagre・ELK・TALA（2026-09-07 に MPL-2.0 で公開、D2 v0.9.0 に同梱）から選べる
- Mermaid は packages/docs-site/src/gen-mermaid-svg.ts で SVG にし、tools/lint-mermaid.mjs と lint:mermaid で検査している（PJR-B5TY）

## 3. 完了条件

1. 文書のサイトのビルドで、`d2` のコードブロックを SVG に書き出して表示する。Mermaid の `packages/docs-site/src/gen-mermaid-svg.ts` と同じ流れに置く。配置のエンジンの既定は ELK とする。
2. D2 の構文を検査する script（名前は executor が決め、理由を個票の対応結果に書く）を用意し、`check`・lefthook・親の検証に組み込む。PJR-B5TY の Mermaid の検査にならう。
3. Dev Container と CI に `d2` の CLI を入れる。版は固定する。`d2` が無い環境では、原因を示して失敗する。
4. 正しい D2 と誤った D2 の両方について、ビルドと検査のテストを足す。
5. 書き方の文書に、図の使い分けの基準（PJR-2ZMY の決定）を書く。
6. CHANGELOG の `[Unreleased]` の節に追記する。公開済みの節は変えない。
7. 終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通す。あわせて親の検証も通す。
8. `package.json`・`.specdojo/` 配下・agent の定義などの保護された設定を変える必要がある場合は、自分では変えず、案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもとで行う。

## 4. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                                                       |
| --- | --------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------- |
| 1   | 完了条件に沿って描画・検査・Dev Container・文書を変更する | BA   | done | 実装と検証を実施。保護された設定は 5.2. の反映案を申し送る |

## 5. 対応結果

### 5.1. 実施内容

- 完了条件は本票の 3. を基準とした。
- `packages/docs-site/src/gen-d2-svg.ts` と共通処理 `d2.mjs` を追加した。VitePress の `build` / `dev` と `specdojo-docs-site d2` から D2 v0.9.0・既定 ELK で SVG を生成する。コードと版・配置から同じハッシュを生成・参照に使い、`.vitepress/d2/` にキャッシュし、参照のなくなったハッシュ名の SVG のみ削除する。クライアントビルドで SVG を出力し、SSR では重複させず、開発サーバーも同じ URL で配信する。文書の追加・変更・削除を同期する。
- 構文検査を `tools/lint-d2.mjs` と命名した。既存の `tools/lint-mermaid.mjs` と対応を取り、npm script の候補を `lint:d2`、親検証 ID を `lint-d2` として役割を分かりやすくするためである。Markdown のパーサーで通常・長い fence・tilde・引用やリスト内の D2 を抽出し、`d2 validate -` で検査する。文書名・開始行・エラーを報告する。CLI の未導入・版違いは未検査として失敗し、描画でも成功済みキャッシュの有無にかかわらず失敗する。D2 がない文書のみなら CLI を呼び出さない。
- `src/exec/parent-validation.ts`、初期化時の script 検出、対応する 2 つの schema に `lint-d2` を追加した。実行設定への登録は 5.2. の案とした。
- `.devcontainer/install-d2.sh` と Dockerfile の導入処理を追加した。Linux amd64 / arm64 の公式アーカイブの版・SHA-256 を固定し、導入後にも版を確認する。CI は保護対象なので同じインストーラーを使う案を 5.2. に記した。版と digest の出典は [D2 v0.9.0 の公式配布一覧](https://github.com/d2lang/d2/releases/expanded_assets/v0.9.0)である。
- 生成物の `.gitignore` と `config init` が追記する既定値を更新した。
- 正しい D2 と不正な D2 の描画・検査、エラー後の修正、CLI 未導入・版違い、生成物のキャッシュ・削除、ビルド hook、SVG の build / dev 配信のテストを追加した。実 CLI の統合テストも追加し、CLI のない環境だけ skip する。模擬 CLI のテストは、実 D2 の文法の正しさを保証する検査とは区別する。
- 再開時に、親の `lint:ts` で検出された `tests/packages/docs-site/d2.test.ts` の `import()` 型注釈を、型専用の名前空間 import に置き換えた。その他の前回変更も完了条件と照合した。
- [[specdojo:docs-editing-guide|ドキュメント編集ガイド]]に PJR-2ZMY の使い分け（単純な図は Mermaid、複雑な図は D2、人が配置を決める図は draw.io）と D2 の記法・検査・出力先を追記した。`packages/docs-site/README.md`、[[specdojo:exec-config-guide|exec 設定ガイド]]、[[specdojo:command-reference|コマンドリファレンス]]と CHANGELOG の `[Unreleased]` も更新した。
- D2 はブロック内で完結するルートの図を対象とする。外部 import と layers・scenarios・steps の追加ページ出力は今回の対象外として文書に明記した。

### 5.2. 保護された設定の反映案

完了条件 8 に従い、以下は変更していない。利用者の承認のもとで runner またはオーケストレーターが反映する。保護された設定を反映するまでは、`check`・commit hook・このリポジトリの親検証・CI の自動実行には D2 が加わらない。

1. ルートの `package.json` の `scripts` に次を追加し、既存の `check` の `npm run lint:mermaid` の直後に `&& npm run lint:d2` を挿入する。依存の追加・lockfile の更新は不要。

   ```json
   "lint:d2": "node tools/lint-d2.mjs"
   ```

2. `lefthook.yml` の `pre-commit.commands.markdown.run` の末尾に `&& node tools/lint-d2.mjs {staged_files}` を追加する。整形・Markdown lint・Mermaid 検査の後、同じ変更 Markdown を検査する。

3. `.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` で `lint-mermaid` の直後に次を追加する。

   ```yaml
   - lint-d2 # npm run lint:d2
   ```

4. `.github/workflows/deploy.yml` の `build.steps` で、checkout 後・サイトのビルド前に次の導入 step を追加する。インストーラーは Dev Container と共有し、版と digest のずれを防ぐ。

   ```yaml
   - name: Install pinned D2 CLI
     run: |
       sh .devcontainer/install-d2.sh "$RUNNER_TEMP/d2-bin"
       echo "$RUNNER_TEMP/d2-bin" >> "$GITHUB_PATH"
   ```

   root と docs-site の依存を導入した後、ビルド前に次を追加する。

   ```yaml
   - name: Validate D2 diagrams
     run: node tools/lint-d2.mjs

   - name: Test real D2 rendering and validation
     run: npm run test:integration -- tests/tools/d2-cli.integration.test.ts
   ```

### 5.3. 検証と申し送り

- `npm --prefix packages/docs-site run typecheck` は成功した。
- 一時スクリプトによる模擬子プロセスの検証で、抽出元の行番号、ELK の呼び出し、SVG キャッシュと不要 SVG の削除、正常・異常な図と CLI 未導入時の検査結果を確認した。
- `node --check` による JavaScript の構文検査と、`sh -n .devcontainer/install-d2.sh` は成功した。
- 変更ファイルへの Prettier 整形、`git diff --check`、`register build` とカタログの検証は成功した。カタログの検証では、今回変更していない未作成成果物に関する警告が出た。`lint-d2` を追加した一時設定を使い、変更した 2 つの schema の `validate:schema:file` も成功した。一時ファイルは検証後に削除した。
- 再開後も docs-site の型検査、JavaScript・シェルの構文検査、カタログ検証、登録簿の派生ビュー生成、`lint-d2` を指定した一時設定の 2 つの schema 検証が成功した。
- `node tools/lint-d2.mjs` は再開後の 3,599 文書・D2 0 件で成功した。実 CLI の検査が通ったという根拠には用いない。
- `npm run typecheck`・`lint:ts`・`test:unit`・`lint:md` を含む指定された親検証は runner の担当とし、executor では重複実行しない。親の結果を result に反映する。
- sandbox に `d2` がなく、再開後のインストーラー実行も GitHub の DNS 解決に失敗した。`npm --prefix packages/docs-site run docs:build` は既存の Mermaid の子プロセス描画で停止し、Node.js の最小の子プロセス起動でも `EPERM` を確認した。実 CLI での正常・異常な図の統合テスト、フルの文書ビルド、Dev Container の再ビルドと CI 実行はホスト側で確認する。Dev Container の再ビルド後に `d2 version`、`npm run test:integration -- tests/tools/d2-cli.integration.test.ts`、`node tools/lint-d2.mjs`、`npm run docs:build` を実行し、図が表示されることを確認する。
- 5.2. の保護された設定の承認・反映と 5.3. のホスト側の検証を、reporter が result の申し送りへ転記する。個票・登録簿のステータスと result ファイルは executor では変更していない。
- 親検証の許可リストを変更したため、統合後はオーケストレーターの手順に従い PJR-JSEY を 1 回実行して runner の動作も確認する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-2zmy-document-editing-toolset]]
- [[prj-0001:pjr-b5ty-mermaid-syntax-lint]]
