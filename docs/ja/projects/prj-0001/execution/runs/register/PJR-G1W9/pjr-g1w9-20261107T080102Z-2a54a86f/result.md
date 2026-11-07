---
specdojo:
  id: prj-0001:xer-pjr-g1w9-20261107t080102z-2a54a86f
  type: exec-result
  task_id: PJR-G1W9
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-G1W9/pjr-g1w9-20261107T080102Z-2a54a86f/plan.md
  started_at: "2026-11-07T08:01:02.577Z"
  completed_at: "2026-11-07T08:15:10.495Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 規約参照形式を、Markdown リンクから「共通規約 sha256:」と版の値およびルート相対パスのインラインコード形式へ変更しました。
- `validate:history-links` の対象に、新しい配置（`execution/runs/**/plan.md` および `result.md`）を追加しました。
- 変更に伴い、`CHANGELOG.md`、ガイド、およびテストコードを更新しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 規約参照形式の変更に関する記録を追加しました。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: 規約参照の新しい記法に関するガイドの内容を更新しました。
- `packages/docs-lint/src/history-links.ts`: 履歴リンクの形式に関するロジックを更新しました。
- `packages/docs-lint/src/validate-history-links.ts`: 新しい配置（`execution/runs/**/`）を検査対象に含めるよう修正しました。
- `src/shared/plan-conventions.ts`: 規約の版を判定・参照するためのロジックを更新しました。
- `tests/packages/docs-lint/history-links.test.ts`: 履歴リンクの検証に関するテストを追加・更新しました。
- `tests/src/exec/migrate-records.test.ts`: 記録移動に伴う規約参照の変更に関するテストを更新しました。
- `tests/src/exec/pipeline-e2e.integration.test.ts`: パイプラインの E2E テストを更新しました。
- `tests/src/exec/plan-conventions.test.ts`: 規約の参照形式に関するユニットテストを更新しました。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: 登録パイプラインの E2E テストを更新しました。
- `tests/src/exec/run/inplace.test.ts`: インプレース実行に関するテストを更新しました。

## 3. 申し送り

- 保護設定の変更案を個票の対応結果に記録した。.github/instructions/markdown.instructions.md の対象一覧に `docs/ja/projects/**/execution/runs/**/plan.md` と `docs/ja/projects/**/execution/runs/**/result.md` を追加し、規約参照の新形式と旧形式の末尾リンクだけの互換例外を明記する。利用者承認後にオーケストレーターが反映する。
- 統合後、PJR-JSEY の対象に PJR-G1W9 を追加し、実 agent で新規 plan の参照形式、prompt の復元、start から review までの通過と event の実体名を確認する。
- 適用外の検証: `npm run validate:schema:file`（executor 自身が変更した YAML ファイルはない。）
- 人の確認が必要: `npx specdojo exec run --project prj-0001 --register PJR-JSEY --executor-by claude-executor`（統合後の実 agent 確認。利用枠を消費するため sandbox では実行せず、対象追加・再開手続きを含めオーケストレーターへ申し送る。）

## 4. 進め方

まず、規約の参照方法を Markdown リンクによる相対パス形式から、`sha256` とルート相対パスを組み合わせたインラインコード形式に変更するよう `src/shared/plan-conventions.ts` を修正しました。次に、`validate:history-links` が新しい配置（`execution/runs/` 下のファイル）を適切に検査できるように `packages/docs-lint/src/validate-history-links.ts` を更新しました。最後に、変更内容が正しく動作することを確認するため、関連する各種テストコードおよびドキュメント、`CHANGELOG.md` を更新しました。
