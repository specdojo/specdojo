---
specdojo:
  id: prj-0001:xer-pjr-9jn6-20261117t152210z-186f5a0d
  type: exec-result
  task_id: PJR-9JN6
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-9JN6/pjr-9jn6-20261117T152210Z-186f5a0d/plan.md
  started_at: "2026-11-17T15:22:11.522Z"
  completed_at: "2026-11-17T15:34:16.644Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- src/exec/run/change-scope.ts のディレクトリ全体の自動追加を除去。tests/src/exec/run/change-scope.test.ts に異なる kata の並行予約・先行失敗後の起動・同じファイルの統合待ち等の回帰テストを追加。exec-operation-guide.md と個票の対応結果を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+6 / -6 行
- `src/exec/run/change-scope.ts`: 変更、+2 / -2 行
- `tests/src/exec/run/change-scope.test.ts`: 変更、+90 / -11 行

## 3. 申し送り

- 型検査・lint・schema 検査・ユニット／統合テストは指定された親 runner の検証に委ねた。追加した回帰テストの実行結果は親検証で確認する。
- 統合後、運用メモに従い PJR-JSEY の実 agent 動作確認に PJR-9JN6 を含める。利用枠を消費するため executor では起動していない。個票の対応結果にも記載済み。
- CHANGELOG 文案（個票にも記載）: 不具合修正: kata を扱う exec run の変更範囲に変更許可ディレクトリ全体を自動追加せず、個別の対象ファイルで判定することで、別々の kata のタスクが互いの統合待ちや未統合エラーで止まる誤判定を修正。保護設定の変更案はない。
- 適用外の検証: `npm run validate:schema:file`（executor が変更したファイルに YAML/YML はない。）
- 人の確認が必要: `npx specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-9JN6 --executor-by claude-executor --reporter-by gemma26-reporter`（統合・ビルド後に実 agent CLI による動作確認が必要。利用枠を消費するため sandbox では起動しない。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
