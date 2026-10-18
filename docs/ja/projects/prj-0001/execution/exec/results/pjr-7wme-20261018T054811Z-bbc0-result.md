---
specdojo:
  id: prj-0001:xer-pjr-7wme-20261018t054811z-bbc0
  type: exec-result
  task_id: PJR-7WME
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-7wme-20261018T054811Z-bbc0-plan.md
  started_at: "2026-10-18T05:48:11.514Z"
  completed_at: "2026-10-18T06:38:45.392Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- 個票 frontmatter に `derived_from`(起票元項目 ID の一覧。project をまたぐ場合は `prj-0001:PJR-XXXX` 形式)を記録できるようにした。
- `register add --from` で `derived_from` を指定できるようにした。
- 元の項目から派生先の一覧を辿れる派生ビュー(`derivation.ts` と `pjr-derived-items-template.md`)を追加した。decision の追跡先も同じ関係で表せるようにした。
- executor は `register build`、`catalog validate`、`git diff --check` を実行し、いずれも成功した。runner の検証(`lint:ts`、`lint:fm`、`lint:md`、`typecheck`、`validate:schema`、`test:unit`、`test:integration`)もすべて passed。
- `lint:ts` の warning は 29 件で、error は 0 件。`catalog validate` の警告は既存の未作成参照文書に関するものだった。
- evidence には、個票 `pjr-7wme-register-derived-from.md` が `target_coverage` で changed と記録されている。ただし `changes` には含まれていないため、changed_files には記載しない。

## 2. 変更ファイル

- `CHANGELOG.md`: `derived_from` の追加と `register add --from` に関する変更履歴を追記した。
- `docs/ja/specdojo/references/command-reference.md`: `register add --from` オプションと `derived_from` の説明をコマンドリファレンスに追記した。
- `docs/ja/specdojo/rulebooks/pjr-rulebook.md`: 個票 frontmatter の `derived_from` 項目と、派生関係および decision の追跡先の扱いを rulebook に反映した。
- `docs/ja/specdojo/templates/pjr-index-template.md`: 登録簿テンプレートを `derived_from` と派生ビューに合わせて更新した。
- `docs/specdojo/schemas/v1/register-events.schema.yaml`: register イベントのスキーマに `derived_from` を扱うための定義を追加した。
- `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`: 個票 frontmatter のスキーマに `derived_from` を追加した。
- `src/register/command-types.ts`: `register add` のコマンド型に `--from` に対応する `derived_from` を追加した。
- `src/register/core.ts`: register の中核処理に `derived_from` の取り扱いを追加した。
- `src/register/create-commands.ts`: `register add --from` オプションを追加し、指定値を起票処理へ渡すようにした。
- `src/register/event-merge.ts`: イベントのマージ処理で `derived_from` を扱えるようにした。
- `src/register/events.ts`: イベントに `derived_from` を記録・読み取りできるようにした。
- `src/register/history.ts`: 履歴処理で `derived_from` を扱えるようにした。
- `src/register/item.ts`: 個票の frontmatter で `derived_from` を解析・検証・出力するようにした。
- `src/register/maintenance-commands.ts`: 保守系コマンドで `derived_from` を扱えるようにした。
- `src/register/register.ts`: 登録簿の生成処理で `derived_from` を扱い、派生関係を反映するようにした。
- `src/register/renumber.ts`: ID の振り直し時に `derived_from` の参照も追従させるようにした。
- `src/register/views.ts`: 派生ビューを生成する処理を追加し、元の項目から派生先を辿れるようにした。
- `tests/src/register/commands.test.ts`: `register add --from` と `derived_from` に関するコマンドのテストを追加・更新した。
- `tests/src/register/event-merge.test.ts`: イベントのマージで `derived_from` を扱うテストを追加・更新した。
- `tests/src/register/item.test.ts`: 個票の `derived_from` の解析と検証のテストを追加・更新した。
- `tests/src/register/register.test.ts`: 登録簿の生成と派生ビューのテストを追加・更新した。unit/integration の失敗原因の修正も含む。
- `docs/ja/specdojo/templates/pjr-derived-items-template.md`: 元の項目から派生先の一覧を表示する派生ビュー用テンプレートを新規追加した。
- `src/register/derivation.ts`: `derived_from` の派生関係を解決・集計するモジュールを新規追加した。

## 3. 申し送り

- 登録簿(`pjr-index.md`)の行と個票のステータスは、plan の指示どおり変更していない。状態遷移は runner と人間が行う。
- `src/register/derivation.ts` と `pjr-derived-items-template.md` は新規ファイルなので、レビューで構成を確認すること。
- `catalog validate` は既存の未作成参照文書に関する警告を出している。今回の変更に起因するものではない。

## 4. 進め方と実践の型の適用

個票スキーマ、イベントスキーマ、型、パーサ、CLI オプション、派生ビュー、docs、テストを一貫して変更し、`derived_from` を起票から追跡まで扱えるようにした。executor は整形、`register build`、`catalog validate` を実行した。型検査、lint、スキーマ検証、単体テスト、統合テストは runner が実行し、すべて passed だった。
