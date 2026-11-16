---
specdojo:
  id: prj-0001:xer-pjr-5znk-20261107t232557z-16e10478
  type: exec-result
  task_id: PJR-5ZNK
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-5ZNK/pjr-5znk-20261107T232557Z-16e10478/plan.md
  started_at: "2026-11-07T23:25:57.976Z"
  completed_at: "2026-11-07T23:45:59.159Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- ガイドおよびコマンドリファレンスにおいて、旧来の実行記録の置き場所（`exec/plans/`・`exec/results/`・`exec/evidence/`）に関する記述を、現行の `execution/runs/&lt;origin&gt;/&lt;item&gt;/&lt;run&gt;/` および `plan_ref`・`--plan` 形式へ更新しました。
- 移行に伴う新旧の制約や、履歴蓄積の仕様、および検査免除規則に関する特定の記述（計 7 箇所）については、意図的に旧配置の記述を残しています。
- `validate:history-links` などの各種検査および、run 記録に関するユニットテストをすべて通過しています。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: `validate:history-links` の適用対象判定に関する、旧配置のディレクトリに関する説明を更新（一部、免除規則に関する記述を保持）しました。
- `docs/ja/specdojo/guides/exec-operation-guide.md`: `--resume` 時の checkpoint 配置に関する説明、および `validate:history-links` の適用条件に関する説明を更新（一部、既存の `exec/plans/` 等を参照する条件説明を保持）しました。
- `docs/ja/specdojo/guides/exec-worktree-guide.md`: 実行記録の置き場所に関する記述を、新しいディレクトリ構造に合わせて更新しました。
- `docs/ja/specdojo/guides/quick-start-guide.md`: 実行記録の置き場所に関する記述を、新しいディレクトリ構造に合わせて更新しました。
- `docs/ja/specdojo/guides/review-guide.md`: 実行記録の置き場所に関する記述を、新しいディレクトリ構造に合わせて更新しました。
- `docs/ja/specdojo/guides/schedule-operation-guide.md`: 実行記録の置き場所に関する記述を、新しいディレクトリ構造に合わせて更新しました。
- `docs/ja/specdojo/references/command-reference.md`: `exec validate` における旧配置の記録に対する免除規則の記述を更新しました。

## 3. 申し送り

- 旧来の置き場所を残した箇所とその理由:
- `docs/ja/specdojo/guides/exec-operation-guide.md`（403 行目）: 旧配置 `&lt;execution_path&gt;/exec/evidence/&lt;task-id&gt;/&lt;run-id&gt;/` に checkpoint がある場合の `--resume` の復帰動作を説明しているため保持。
- `docs/ja/specdojo/guides/exec-operation-guide.md`（413 行目）: `validate:history-links` の適用判定における履歴蓄積ファイル（既存の `exec/plans/**/*.md`・`exec/results/**/*.md`）の条件説明であるため保持。
- `docs/ja/specdojo/guides/exec-config-guide.md`（564 行目）: `validate:history-links` の適用対象判定に関する上記と同様の説明であるため保持。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`（72 行目）: `exec validate` における旧配置（`execution/exec/plans/`・`results/`・`evidence/`）の検査対象外免除規則を説明しているため保持。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`（106 行目）: 旧 `exec/evidence/` 配下の run が自動再開の探索対象にならない移行制約を説明しているため保持。
- `docs/ja/specdojo/guides/release-v0-3-0-migration-guide.md`（50 行目）: v0.3.0 リリース時の移行対象として旧 `execution/exec/plans/` を挙げている歴史的文書であるため保持。
- `docs/ja/specdojo/references/command-reference.md`（646 行目）: `exec validate` が旧 `exec/plans/`・`results/`・`evidence/` の記録をエラー・警告としない免除規則を説明しているため保持。

## 4. 進め方

まず、指示に従いガイドおよびコマンドリファレンス内の旧来のパス（`exec/plans/` など）を検索しました。それらを、現在の推奨されるパス構造（`execution/runs/&lt;origin&gt;/&lt;item&gt;/&lt;run&gt;/`）および指定された形式（`plan_ref` や `--plan`）に基づく記述に置き換えました。作業の過程で、特定のコンテキスト（復帰動作、履歴蓄積の条件、検査の免除規則、歴史的経緯）においては、旧来のパスに関する記述を残しておく必要があると判断したため、それらの箇所を特定して保持しました。最後に、各種静的解析ツールによる検査を実行し、整合性を確認しました。
