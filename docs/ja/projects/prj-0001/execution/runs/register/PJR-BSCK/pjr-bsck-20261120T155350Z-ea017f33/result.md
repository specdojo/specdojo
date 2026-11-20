---
specdojo:
  id: prj-0001:xer-pjr-bsck-20261120t155350z-ea017f33
  type: exec-result
  task_id: PJR-BSCK
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BSCK/pjr-bsck-20261120T155350Z-ea017f33/plan.md
  started_at: "2026-11-20T15:53:51.473Z"
  completed_at: "2026-11-20T16:11:29.676Z"
  agent: flash-high-executor
  block_reason: "parent validation failed: lint-md, test-integration"
---

# Edit Result

## 1. 実施内容

- 使われていない・移行用・非推奨の 9 コマンドについて、`help` および実行時の非推奨警告（および代わりの操作の案内）を追加しました。
- コマンドリファレンス `docs/ja/specdojo/references/command-reference.md` および各ガイドに、非推奨であることと、次期マイナー版（`0.10.0`）での削除予定を追記しました。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: 計画と結果のライフサイクルに関するガイドを更新しました。
- `docs/ja/specdojo/guides/register-operation-guide.md`: プロジェクト登録簿の操作に関するガイドを更新しました。
- `docs/ja/specdojo/guides/timeline-design-guide.md`: タイムライン設計に関するガイドを更新しました。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスに、非推奨コマンドとその削除予定に関する情報を追記しました。
- `src/dashboard/timeline.ts`: タイムライン表示に関するロジックを更新しました。
- `src/exec/commands.ts`: コマンド実行時の制御ロジックを更新しました。
- `src/exec/migrate-records.ts`: レコード移行コマンドに関する変更を適用しました。
- `src/grade/command-inspect.ts`: コマンド検査に関するロジックを更新しました。
- `src/register/maintenance-commands.ts`: 登録簿のメンテナンスコマンドに関する変更を適用しました。
- `src/shared/specdojo-config.ts`: 設定共有ロジックを更新しました。
- `src/shared/where-alias.ts`: `where` エイリアスに関する定義を更新しました。

## 3. 申し送り

- 作業No.3「次の版で消す」は、利用者の移行期間を考慮して次期マイナー版（`0.10.0`）で実施するため、本タスク（`PJR-BSCK`）では非推奨警告と代わりの操作の案内に留め、未着手（`open`）として残しています。`0.10.0` リリース準備時にコマンドの削除を行ってください。
- CHANGELOG に書く事項: [変更] 使われていない・移行用・非推奨の 9 コマンド（`timeline where`/`build`、`exec note`/`link`/`estimate`、`exec migrate-records`、`grade migrate`、`register migrate`、`config migrate-members`）を非推奨にし、`help` と実行時に代わりの操作と削除予定版（`0.10.0`）の警告を出すように変更
- 作業No.3「次の版で消す」は、利用者の移行期間を考慮して次期マイナー版（0.10.0）で実施するため、本タスク（PJR-BSCK）では非推奨警告と代わりの操作の案内に留め、未着手（open）として残しています。0.10.0 リリース準備時にコマンドの削除を行ってください。
- CHANGELOG に書く事項: [変更] 使われていない・移行用・非推奨の 9 コマンド（timeline where/build、exec note/link/estimate、exec migrate-records、grade migrate、register migrate、config migrate-members）を非推奨にし、help と実行時に代わりの操作と削除予定版（0.10.0）の警告を出すように変更

## 4. 進め方

対象となる 9 つのコマンドに対し、`help` メッセージおよび実行時の標準エラー出力へ非推奨の警告と、代わりの推奨操作、および次期マイナー版（`0.10.0`）での削除予定が含まれるよう、ソースコードおよびドキュメントの更新を行いました。
