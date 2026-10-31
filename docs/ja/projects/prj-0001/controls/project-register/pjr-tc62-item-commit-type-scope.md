---
specdojo:
  id: prj-0001:pjr-tc62-item-commit-type-scope
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-31T02:42:32Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BNMV
---

# PJR-TC62 個票に commit の type と scope を持たせる

## 1. 概要

プロダクトのリポジトリの commit の type と scope を項目ごとに選べるよう、個票に `commit_type` と `commit_scope` を持たせ、`register add` と `update` で指定できるようにする。

## 2. 入力

- PJR-BNMV の決定: type は個票の `commit_type`、任意の scope は `commit_scope` に持ち、register add / update の --commit-type / --commit-scope で指定する。指定がなければ項目の type から決め（issue は fix、todo・change-request は feat）、この対応も設定で変えられるようにする

## 3. 完了条件

- 個票の frontmatter に任意の `commit_type` と `commit_scope` を足し、`register-item-frontmatter.schema.yaml` に定義する。`commit_type` の値は Conventional Commits の type（`feat`・`fix`・`docs`・`refactor`・`test`・`chore`・`perf`・`build`・`ci`・`style`・`revert`）とする。値の一覧を固定するか、形式だけを検査するかは executor が決める。
- `register add` と `register update` に `--commit-type` と `--commit-scope` を足す。`update` では `-` で消せるようにする。
- 指定がない項目の type は、項目の type から決める。既定の対応は `issue` が `fix`、`todo`・`change-request` が `feat` とし、その他の項目の type の扱いは executor が決める。対応は設定で変えられるようにし、置き場所（`specdojo.config.json` の project か `repos[]`）は executor が決める。
- 項目の commit の type と scope を、後続の項目（PJR-Z7GX・PJR-M1DH）から 1 つの関数で引けるようにする。この段階では、exec の commit メッセージやブランチ名はまだ変えない。
- 単体テストを足す。対象は、add と update での指定と消去、不正な値のエラー、指定がないときの既定の対応、設定による対応の上書き。
- command-reference の `register add` / `update` と、設定を足した場合は設定リファレンスに書く。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、変更した文書で `npm run lint:md`・`npm run lint:fm` を流して通し、親の検証も通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。
- 保護された設定（`.specdojo/`・`package.json` など）に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                                                            | 担当     | 状態   | メモ                                                                                                                                                                |
| --- | ----------------------------------------------------------------------------------------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 個票の frontmatter・schema と `register add` / `update` に `commit_type`・`commit_scope` を足す | executor | closed | `register-item-frontmatter.schema.yaml` / `register-events.schema.yaml` および `register add` / `update` に `--commit-type` / `--commit-scope` を追加               |
| 2   | 既定の対応と設定、引くための関数、テスト、文書を足す                                            | executor | closed | `resolveItemCommitTypeAndScope` の実装、`specdojo-config` スキーマ拡張、単体テスト、`command-reference`・`specdojo-config-reference`・`CHANGELOG.md` への反映を完了 |

## 5. 対応結果

### 5.1. 実施内容

- 個票 Frontmatter スキーマ（`register-item-frontmatter.schema.yaml`）およびイベントログスキーマ（`register-events.schema.yaml`）に `commit_type` と `commit_scope` を追加しました。
- 設定スキーマ（`specdojo-config.schema.yaml`）および型定義（`specdojo-config.ts`）に `commit_types` を追加し、プロジェクト単位（`projects.<project-id>.commit_types`）およびプロダクトリポジトリ単位（`repos[].commit_types`）の双方で定義可能にしました。
- `register add` と `register update` に `--commit-type` と `--commit-scope` を追加し、バリデーションおよび `update` での `-` による消去に対応しました。
- `src/register/item.ts` に `resolveItemCommitTypeAndScope` を実装し、後続の項目（PJR-Z7GX・PJR-M1DH）から 1 つの関数で引けるようにしました。
- 単体テスト（`tests/src/register/commit-type-scope.test.ts`）を追加し、add / update での指定・保持・置換・消去、不正値エラー、既定対応の導出、設定読み込みと上書き、イベントからの復元を対象にしました。実行は親 runner の `test-unit` 検証に委ねます。
- 再開時の確認で、`repos[].commit_types` が設定読み込み時に未知のキーとして拒否される不足を修正しました。project と repo の両方で対応表の形と値を検証し、schema の許容値も個票と同じ一覧に揃えました。
- 親 runner の単体テストで失敗した、個票解析関数へ絶対パスを渡すテスト側の誤りを修正しました。同じテスト内の復元・保持・置換・消去の検証もファイル名を渡す形へ統一し、消去時は解析成功・frontmatter キーの削除・既定値への復帰まで確認するよう補強しました。
- `command-reference.md`、`specdojo-config-reference.md`、`CHANGELOG.md` を更新しました。

### 5.2. 設計判断と理由

- `commit_type` の値検証: 本機能で対応する 11 種類（`feat`・`fix`・`docs`・`refactor`・`test`・`chore`・`perf`・`build`・`ci`・`style`・`revert`）を固定一覧として検証する設計を採用しました。タイポによる意図しないコミットタイプの混入を防ぐとともに、CLI で利用可能な選択肢を案内できるようにするためです。CLI と設定読み込みの定数は `src/shared/commit-types.ts` で共有し、設定からの導出でも同じ一覧を適用します。
- `commit_scope` の形式: `^[a-z0-9][a-z0-9-]*$` としました。後続の commit メッセージやブランチ名で利用しやすい文字に限定し、改行や区切り文字の混入を防ぐためです。scope は任意で、個票に指定した値だけを返します。
- 未指定時の項目の type 既定対応: `issue` は `fix`、`todo`・`change-request` は `feat`、`decision`・`note`・`question`・`risk` は `docs`、`epic` は `feat` とし、その他の未知の type は安全のため `chore` にフォールバックするよう定義しました。
- 設定の置き場所: プロジェクト設定（`projects.<project-id>.commit_types`）とプロダクトリポジトリ設定（`repos[].commit_types`）の両方に配置しました。個票はプロジェクトに属し複数リポジトリを跨ぐタスクもあり得るため、プロジェクト単位の一貫したマッピングを基本としつつ、リポジトリごとの個別事情（ドキュメント専用リポジトリ等）にも対応できるようにリポジトリ単位の上書きを許可する階層構造（優先順位: 個票明示指定 > `repoConfig.commit_types` > `projectConfig.commit_types` > 既定マッピング）としました。
- 既定値は個票に保存せず `resolveItemCommitTypeAndScope` で利用時に解決します。これにより設定変更や `update --commit-type -` の後も現行の対応を使えます。対応表の参照は自身のキーだけを対象にし、未知の type がオブジェクトの継承プロパティと一致しても `chore` へ解決します。

### 5.3. 成果物・変更ファイル

- `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`
- `docs/specdojo/schemas/v1/register-events.schema.yaml`
- `docs/specdojo/schemas/v1/specdojo-config.schema.yaml`
- `src/shared/specdojo-config.ts`
- `src/shared/commit-types.ts`
- `src/register/item.ts`
- `src/register/events.ts`
- `src/register/event-merge.ts`
- `src/register/command-types.ts`
- `src/register/create-commands.ts`
- `src/register/core.ts`
- `src/register/register.ts`
- `tests/src/register/commit-type-scope.test.ts`
- `docs/ja/specdojo/references/command-reference.md`
- `docs/ja/specdojo/references/specdojo-config-reference.md`
- `CHANGELOG.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-tc62-item-commit-type-scope.md`
- `docs/ja/projects/prj-0001/controls/project-register/events/pjr-tc62.yaml`: 再開時点で親 runner が記録した start イベントを維持。イベント内容や状態遷移は executor から追加・変更していません。

### 5.4. 残課題

- なし（保護された設定ファイルの変更も不要です）。後続の項目（PJR-Z7GX・PJR-M1DH）で本関数の解決結果を利用して exec の commit メッセージやブランチ名の動的生成を行います。

### 5.5. 検証結果と申し送り

- Prettier で変更対象の Markdown・TypeScript・YAML を整形しました。
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/register-events.schema.yaml --data docs/ja/projects/prj-0001/controls/project-register/events/pjr-tc62.yaml` は成功しました。
- `register-item-frontmatter.schema.yaml` と `specdojo-config.schema.yaml` についても `validate:schema:file` で成功しました。前者は本個票の frontmatter に `commit_type: refactor` と `commit_scope: cli-parser` を加えた一時 JSON、後者は現行設定に project と repo の対応表を加えた一時 JSON を対象としました。保護された設定は変更していません。
- `node --import tsx tools/catalog-validate-if-configured.mjs` は成功しました。未作成文書に関する既存の参照警告はありますが、エラーはありません。
- `node --import tsx src/specdojo.ts register build --project prj-0001` は成功しました。個票とイベントの整合を検査し、追跡対象外の派生ビューを再生成しました。
- `lint-ts`・`lint-fm`・`lint-md`・`test-integration`・`validate-schema`・`typecheck`・`test-unit` は親 runner が実行します。executor 内での重複実行はしていません。
- 前回の `test-unit` は 2860 件中 1 件が失敗しました。原因は `readRegisterItemContent` の第 2 引数がファイル名であるのに、追加テストが絶対パスを渡していたことです。該当箇所と同じ誤りのある後続の検証を修正済みで、修正後の単体テスト実行は親 runner に委ねます。
- 設計判断（5.2）と検証結果を reporter の result へ反映してください。統合後は運用メモに従って PJR-JSEY で register の動作を確認してください。

## 6. 関連ドキュメント

- [[prj-0001:pjr-bnmv-product-repo-git-workflow]]
- [[specdojo:specdojo-config-reference]]
- [[specdojo:command-reference]]
