---
specdojo:
  id: prj-0001:xer-pjr-zpjz-20260823t014720z-9a0b
  type: exec-result
  task_id: PJR-ZPJZ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-zpjz-20260823T014720Z-9a0b-plan.md
  started_at: "2026-08-23T01:47:20.727Z"
  completed_at: "2026-08-23T02:16:59.481Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- exec-result の status に superseded を追加し、再実行により破棄された試行を表現できるようにした。
- schema（exec-result-frontmatter.schema.yaml）・型定義（exec-types.ts）・result 生成/更新ロジック（exec-results.ts, exec-run.ts）を更新し、誰がいつ superseded を設定するかのルールを実装・文書化した。
- 既存の PJR-DCTG 1回目実行の result（in_progress のまま残っていたもの）を superseded へ移行した。
- 個票（pjr-zpjz-exec-result-superseded-status.md）とライフサイクルガイド（plan-result-lifecycle-guide.md）を更新し、運用ルールを明記した。
- 対応するテスト（exec-results.test.ts）を追加し、対象範囲の unit test・typecheck・lint:ts・markdownlint・remark はすべて成功した。
- 親 runner による npm run test:integration（allowlist 実行）は成功（passed）しており、統合検証上のブロック要因はない。
- npm run test:unit の全件実行は sandbox 内で5分以上完了せず中断（exit 130、失敗出力なし）、npm run validate:schema は sandbox の tsx IPC 制限により標準コマンドが失敗したが node --import tsx による代替実行で全 validator が成功、npm run lint:fm は本タスクと無関係な既存 pjr-zwmh plan の未エスケープ箇所1件により失敗（変更対象ファイルのみでは成功）。これらはいずれも本タスクの変更に起因しない環境要因・既存問題であり、対象範囲の検証はすべて成功している。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/controls/project-register/pjr-zpjz-exec-result-superseded-status.md`: 個票の作業内容・対応結果セクションを superseded 追加の実施内容で更新した。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: superseded status の意味・設定主体・設定タイミングの運用ルールを追記した。
- `docs/specdojo/schemas/v1/exec-result-frontmatter.schema.yaml`: status の許容値に superseded を追加した。
- `src/exec-results.ts`: superseded 状態の判定・設定ロジックを実装した。
- `src/exec-run.ts`: 再実行時に前回試行の result を superseded へ遷移させる処理を追加した。
- `src/exec-types.ts`: ResultStatus 型に superseded を追加した。
- `tests/src/exec-results.test.ts`: superseded 状態の設定・判定を検証するテストケースを追加した。

## 3. 申し送り

- npm run test:unit の全件実行は本 sandbox 環境で5分以上完了せず中断（失敗出力なし、exit 130）。対象限定の unit test（exec-results, exec-run-inplace, exec-register-multiple-ids 計62件）はすべて成功しているが、CI 等リソース制約のない環境で全件再実行し完走を確認することを推奨する。
- npm run validate:schema は sandbox の tsx IPC socket 制限（EPERM）により標準コマンドが実行できなかった。node --import tsx による代替実行では全 validator が成功しているが、通常環境で npm run validate:schema 自体の成功も再確認することを推奨する。
- npm run lint:fm は本タスクの変更と無関係な既存 pjr-zwmh plan の未エスケープ `&lt;domain&gt;` 1件により失敗した。別タスクとして是正が必要。

## 4. 進め方と実践の型の適用

登録簿・個票を確認し、exec-result の status に superseded を追加する対応として schema・型定義・生成/更新ロジックを実装し、運用ルールをガイドと個票へ文書化した。既存の破棄済み result（PJR-DCTG 1回目）を superseded へ移行し、対応するテストを追加した。対象範囲の静的検査・テストはすべて成功し、親 runner の test:integration も成功している。
