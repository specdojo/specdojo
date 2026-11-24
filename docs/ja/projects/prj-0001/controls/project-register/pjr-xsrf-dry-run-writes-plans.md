---
specdojo:
  id: prj-0001:pjr-xsrf-dry-run-writes-plans
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T22:26:38Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: exec
---

# PJR-XSRF exec run --auto --dry-run が plan のファイルを書き出して残す

## 1. 課題内容

- 2026-11-23 の一括実行の前に `exec run --auto --dry-run` で計画を確かめたところ、`execution/runs/schedule/` の下に第 4〜6 波の 040 のタスクの `plan.md` が 32 件残った（`tmp/orchestrator/dryrun-leftovers-2026-11-23/` に退避した）。
- 残った plan は result・evidence を持たない run のディレクトリになり、実行の記録の配置の検査と次の run の準備の妨げになる。

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- 2026-11-23〜24 の kata の一括実行（第 4〜6 波）で詰まった所から起票した

## 3. 影響範囲

- dry-run が状態を変え、「読むだけの確認」として使えない。

## 4. 対応方針

- `--dry-run` では plan を書き出さず、予定（対象のタスク、plan の置き場所）を表示するだけにする。plan の中身を見たい場合の手段（`exec plan` など）を個票の対応結果に書く。
- 統合テストで、`exec run --auto --dry-run` の前後で作業ツリーが変わらないことを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

- `exec run --auto --dry-run` は plan を生成せず、対象と予定パスを表示する。plan の内容や Markdown 検査を確認するには `specdojo exec plan --project <id> --task <task-id>` を実行する。このコマンドは plan を書き出す。
- 既存 plan の有無それぞれで、実行前後の作業ツリーのファイルとディレクトリが同じであることを統合テストで確認する。
- 型検査、TypeScript lint、単体テストと統合テストは親 runner が実行する。

### 5.1. CHANGELOG に書く事項

- 不具合修正: `exec run --auto --dry-run` が plan ファイルを残さず、予定パスを表示するようにした。

## 6. 関連ドキュメント

- 関連: PJR-YQ32（準備の段の残り）。
