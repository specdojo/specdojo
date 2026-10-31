---
specdojo:
  id: prj-0001:pjr-z7gx-product-commit-message-template
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-31T02:42:46Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BNMV
  depends_on:
    - PJR-TC62
---

# PJR-Z7GX プロダクトのリポジトリの commit と merge commit の書式を設定で選べるようにする

## 1. 概要

`repos[]` の `commit_subject_template` と `merge_message_template` で、プロダクトのリポジトリへ exec が積む commit の 1 行目と merge commit のメッセージを、運用に合わせて選べるようにする。

## 2. 入力

- PJR-BNMV の決定: commit の 1 行目は `repos[].commit_subject_template`（例: {type}({scope}): {title}）、merge commit は `repos[].merge_message_template`（既定は Merge branch '{branch}' into {target} に Refs を付けたもの）。本文の末尾の Refs: `<project-id>`:`<ID>` は常に付ける。設定がなければ今と同じ
- 対象はプロダクトのリポジトリだけ。SpecDojo の記録のリポジトリの記帳の commit（exec(register ...)）は変えない

## 3. 完了条件

- `specdojo.config.json` の `repos[]` に任意の `commit_subject_template` と `merge_message_template` を足し、schema と設定の読み込みの検証を更新する。
- テンプレートで使える変数は `{id}`・`{project}`・`{topic}`・`{type}`・`{scope}`・`{title}`・`{branch}`・`{target}` とする。`{type}` と `{scope}` は PJR-TC62 の関数で引く。`{scope}` が空のときに `{type}({scope}):` の括弧が残らない扱いは executor が決める。未知の変数は設定エラーにする。
- プロダクトのリポジトリへの commit の 1 行目と merge commit のメッセージにテンプレートを使う。本文の末尾の `Refs: <project-id>:<ID>` は、テンプレートにかかわらず常に付ける。1 行目の長さの上限は今の扱いを保つ。
- `commit_subject_template` を設定しないときは今と同じ `exec(register <ID>): <タイトル>` にする。`merge_message_template` を設定しないときの既定は、PJR-BNMV の決定のとおり `Merge branch '{branch}' into {target}` に `Refs:` を付けたものにするか、今の形を保つかを executor が決め、互換性への影響とあわせて理由を書く。
- SpecDojo の記録のリポジトリの記帳の commit（`exec(register ...)` の start・review・wait・merge など）は変えない。
- 単体テストを足す。対象は、テンプレートの展開、`{scope}` が空の場合、未知の変数のエラー、設定がない場合の互換、`Refs:` が常に付くこと。
- 実際のプロダクトのリポジトリ（一時ディレクトリの git）で `exec run --register` の統合を通し、commit と merge commit のメッセージがテンプレートどおりになることを確かめるテストを、統合テストとして足す。
- 設定リファレンスの `repos` のキーの表に書き、git-flow と GitHub flow の設定の例を載せる。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、変更した文書で `npm run lint:md`・`npm run lint:fm` を流して通し、親の検証も通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。
- 保護された設定（`.specdojo/`・`package.json` など）に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                                           | 担当     | 状態   | メモ                                     |
| --- | ------------------------------------------------------------------------------ | -------- | ------ | ---------------------------------------- |
| 1   | `repos[]` の schema と設定の検証にテンプレートを足す                           | executor | closed | schema・型・読み込み検証へ追加           |
| 2   | プロダクト側の commit と merge commit にテンプレートを使い、テストと文書を足す | executor | closed | 生成処理・単体／統合テスト・設定例を追加 |

## 5. 対応結果

### 5.1. 実施内容・成果物

- `repos[]` の型・設定読み込み検証・設定 schema に `commit_subject_template` と `merge_message_template` を追加しました。未知の変数、不正な波括弧、空白だけの値、NUL は設定エラーです。
- `src/shared/commit-message-template.ts` で 8 変数の検証と 1 回だけの展開、`src/exec/register-product-message.ts` で項目の type・scope の解決、1 行目の制限、末尾の `Refs:` を実装しました。
- `src/exec/run/register-worktree.ts` と `src/exec/repo-integration.ts` で、プロダクトごとの commit／merge メッセージを生成します。SpecDojo の記帳用メッセージは従来の経路を保ちます。
- `tests/src/exec/register-product-message.test.ts`、`tests/src/shared/specdojo-config-repos.test.ts`、`tests/docs/specdojo/schemas/specdojo-config-schema.test.ts` に、展開・空 scope・未知変数・未設定互換・type の優先順位・長さ制限・`Refs:` の単体テストを追加しました。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts` に、実際の一時 git リポジトリ 3 つを使う `exec run --register` の設定あり／なしと `merge`／`branch-only` の組合せを追加しました。プロダクトの commit／merge の全文、別 repo の既定書式、プロジェクトの記帳の書式、統合・撤去まで検証します。
- 設定リファレンスにキー・8 変数の説明、git-flow と GitHub flow の設定例を追加し、`CHANGELOG.md` の Unreleased に追記しました。

### 5.2. 設計判断と理由

- 空の scope は、テンプレートに書いた `({scope})` を括弧ごと除去します。Conventional Commits の `feat():` を避けつつ、ほかの文字列は勝手に書き換えないためです。
- 未設定の merge 書式は commit と同じ従来の `exec(register <ID>): <タイトル>` に保ちます。既存運用の履歴とメッセージ検査への互換性を優先し、PJR-BNMV の標準的な merge 書式は `Merge branch '{branch}' into {target}` の明示設定で選べるようにしました。未設定の利用者の書式に互換性の変更はありません。
- `{topic}` は個票ファイル名の topic 部分とし、個票パスがない場合は小文字の項目 ID にします。既存の登録項目には独立した topic フィールドがないためです。`{branch}` と `{target}` はプロダクトの実際の作業ブランチと統合先から取得し、run の上書きも反映します。
- `{type}` と `{scope}` は PJR-TC62 の `resolveItemCommitTypeAndScope` を利用し、個票・repo・project・既定対応の優先順位を共有します。
- commit は 1 行の subject として空白を正規化し、merge は本文の改行を保持します。1 行目は両方とも従来の `commitSubject` の 100 文字上限を共有し、本文は切り詰めません。テンプレート展開後の 1 行目が空の場合は停止します。
- 必須の `Refs: <project-id>:<ID>` 行は、テンプレートに同じ行があっても末尾に 1 回だけ置きます。タイトル等の値は再展開しません。
- 設定は統合時にプロジェクトリポジトリから読み、プロダクトの名前で照合します。worktree 作成・再開のデータ形式を変更せず、リポジトリごとの指定を反映するためです。

### 5.3. 検証結果と申し送り

- 単体・統合テスト、TypeScript の型・lint、Markdown・frontmatter の lint、全体 schema 検証は親 runner の検証に委ねます。executor では対象限定版も含めて重複実行しません。
- 変更した 13 ファイルを `npx prettier --write` で整形しました。`git diff --check` も成功しました。
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/specdojo-config.schema.yaml --data tmp/pjr-z7gx/config.json` は成功しました。両テンプレートと全 8 変数を含む一時 JSON を検証し、保護された実設定は変更していません。
- `node --import tsx tools/catalog-validate-if-configured.mjs` は終了コード 0 で成功しました。未作成文書への既存の参照警告があります。
- `node --import tsx src/specdojo.ts register build --project prj-0001` は成功し、個票とイベントの整合を検証して、追跡対象外の派生ビューを生成しました。
- reporter は 5.1 の変更ファイル・実施内容、5.2 の設計判断と理由、および executor evidence の検証結果を result に反映してください。result は executor から編集していません。
- 保護された設定の変更は不要です。個票・登録簿のステータスと runner の既存イベントは変更していません。
- 統合後は運用メモに従い、PJR-JSEY で runner の動作を確認してください。

## 6. 関連ドキュメント

- [[prj-0001:pjr-bnmv-product-repo-git-workflow]]
- [[specdojo:specdojo-config-reference]]
- [[specdojo:command-reference]]
- [[prj-0001:pjr-tc62-item-commit-type-scope]]
