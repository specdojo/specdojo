---
specdojo:
  id: prj-0001:xer-pjr-rdnc-20260809t113052z-efd6
  type: exec-result
  task_id: PJR-RDNC
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-rdnc-20260809T113052Z-efd6-plan.md
  started_at: "2026-08-09T11:30:52.446Z"
  completed_at: "2026-08-09T11:38:05.774Z"
  agent: codex-edit-agent
---

# Edit Result

## 1. 実施内容

- `pjr-rulebook` を、個票 Frontmatter を構造化フィールドの唯一の正本とする構成へ更新した。生成された `pjr-index.md` と派生ビューの手編集禁止を明記し、一覧と個票の同期規則および個票分離基準を削除した。
- `register-operation-guide`、CLI コマンドリファレンス、quick start、exec 運用ガイドから、一覧正本、`--ticket`、予約起票、統合ブランチ自動ルーティング、同期スクリプトを前提とする記述を削除した。
- 一覧テンプレートと全 7 種の個票テンプレートを更新し、個票テンプレートに初期の `item_status: open` と `priority: medium` を定義した。`register add` は実際の指定値でこれらを更新する。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pjr-rulebook.md`
- `docs/ja/specdojo/guides/register-operation-guide.md`
- `docs/ja/specdojo/references/command-reference.md`
- `docs/ja/specdojo/guides/quick-start-guide.md`
- `docs/ja/specdojo/guides/exec-operation-guide.md`
- `docs/ja/specdojo/templates/pjr-index-template.md`
- `docs/ja/specdojo/templates/pjr-{todo,issue,question,risk,change-request,decision,note}-template.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-rdnc-update-docs-for-ticket-ssot.md`
- `docs/ja/projects/prj-0001/execution/exec/results/pjr-rdnc-20260809T113052Z-efd6-result.md`

## 3. 申し送り

対象 Markdown の `prettier` と `markdownlint`、`register build`、`catalog validate`、`index build`、`tests/src/register-commands.test.ts`（15件）は成功した。`catalog validate` は既存の参照先未生成に関する warning のみを出力した。全体の `npm run -s lint:md` は、既存の生成ビューにある `*CAPITAL_CASE*` の MD049 違反8件で失敗した。全体の `npm test` は 934件中918件が成功し、残る worktree 系16件はこの環境で `spawnSync git EPERM` となるため失敗した。いずれも今回の変更対象外であり、対象の register コマンドテストは成功している。

## 4. 進め方と実践の型の適用

本タスクは `rulebook: none` の register 起点の文書更新であるため、個票の完了条件を基準にした。rulebook 更新には `upsert-rulebook` Skill を適用し、記述標準、PJR rulebook、個票 Frontmatter schema、`register add` / `register build` の実装を照合した。先行する [[prj-0001:pjr-37wn-remove-id-reservation-mechanisms]] が撤去済みとした予約機構と、現行実装が常に個票を作成する動作を根拠に、旧運用記述を削除した。個票テンプレートには schema 必須の初期処理状態・優先度を明示し、実行時の実値は既存の `register add` が Frontmatter へ適用する構成を維持した。
