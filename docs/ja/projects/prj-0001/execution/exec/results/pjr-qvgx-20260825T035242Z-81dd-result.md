---
specdojo:
  id: prj-0001:xer-pjr-qvgx-20260825t035242z-81dd
  type: exec-result
  task_id: PJR-QVGX
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-qvgx-20260825T035242Z-81dd-plan.md
  started_at: "2026-08-25T03:52:42.313Z"
  completed_at: "2026-08-25T04:01:56.286Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- sandbox 内で成立しない検証を executor から外し、親 runner が実行する構成へ移した。sandbox の設定は緩めていない。
- `parent_validations` の固定許可リストを `test-integration` のみから `validate-schema` / `test-unit` / `test-integration` の3種へ拡張し、schema の列挙値としても定義した。
- 共通規約を「親検証に設定された ID に対応するコマンドは executor が sandbox 内で実行しない」に改めた。ID とコマンドの対応（`validate-schema` は `npm run validate:schema`、`test-unit` は `npm run test:unit`、`test-integration` は `npm run test:integration`）も明示した。
- executor へ渡す prompt に、親 runner が実行する ID と対応コマンドを添えるようにした。対象限定版を含め二重実行しないことを指示する。
- 固定親検証とexecutor内での二重実行防止を実装し、9ファイルを変更した。
- 整形、Markdown lint、型検査、ESLint、exec-defaultsスキーマ検証、登録簿・catalog・索引の検証、親検証スモークテスト、diffチェックは成功した。
- 既存テストの期待値2件が旧仕様のまま残っていたため、オーケストレーターが新仕様へ更新した。詳細は申し送りに記載する。最終状態では単体1280件・統合79件・型検査・ESLint・`npm run validate:schema` がすべて成功する。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/controls/project-register/pjr-qvgx-codex-sandbox-tsx-ipc-eperm.md`: PJR-QVGX個票の作業内容・対応結果を更新。
- `docs/ja/specdojo/guides/exec-config-guide.md`: 親runnerで検証を実行する設定の案内を更新。
- `docs/ja/specdojo/templates/xep-common-conventions-template.md`: executor/reporterパイプラインの検証規約を更新。
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`: exec-defaultsの親検証設定を更新。
- `src/exec-parent-validation.ts`: 固定argvによる親検証解決を実装。
- `src/exec-run.ts`: executor promptで親検証を重複実行しないように更新。
- `tests/src/exec-agent-config.test.ts`: agent設定の期待値を更新。
- `tests/src/exec-parent-validation.test.ts`: 親検証解決のテストを追加・更新。
- `tests/src/exec-run.test.ts`: executor promptの検証指示をテスト。

## 3. 申し送り

- 親 runner の `test-integration` の失敗は、既存テストの期待値が旧仕様のまま残っていたことによる。`exec-pipeline-e2e.integration.test.ts` が plan に `npm run test:unit` が含まれることを期待していたが、新しい規約では親検証に設定されたコマンドは plan から外れる。親検証の ID と対応コマンドが prompt へ含まれることの確認へ差し替えた。
- `npm run test:unit` の失敗も同種で、`exec-plans.test.ts` が旧規約の文言「その前後に対象限定の `npm run test:unit` を追加しない」を期待していた。新規約の文言へ差し替えた。
- 仕様を変更した際に既存テストの期待値が追随していない見落としは、PJR-XGJK に続いて2回目である。以後、規約や生成物の文言を変える作業では、完了条件に「既存テストの期待値が新しい仕様と整合していることを確認する」を含める。
- 本項目で `validate-schema` と `test-unit` を親検証へ移したため、これらは executor の evidence では `not_run` となり、親 runner の結果が `source: runner` として追記される。今後 executor 側の failed を理由にしたブロックは減る見込みだが、実際の効果は次回以降の実行で確認する。
- sandbox 内で子プロセスが成立しない原因そのものは特定していない。検証を sandbox 外へ移すことで影響を回避した対処であり、sandbox 内で子プロセスを要する別の処理が現れた場合は再検討が要る。

## 4. 進め方と実践の型の適用

個票と関連する実装・設定・テスト・運用文書を更新し、sandbox内で作れないtsx IPCソケットに依存する検証を固定argvの親検証へ移す方針で対応した。

完了条件が提示した3案（sandbox 設定で許可する / 実行方式を変える / 親 runner へ移す）のうち、親 runner へ移す案を採った。完了条件は「秘匿や隔離を弱める対処を行う場合は緩和する範囲と影響を明示する」と定めていたが、本対応では sandbox の設定を一切変更していないため、緩和は生じていない。PJR-3S8Q で定めた「agent に権限を渡さない」方針とも整合する。

reporter 段階は codex-reporter が正常に完了し、親 runner の `test-integration` の失敗を根拠にブロックした。妥当な判断である。オーケストレーターが失敗箇所を特定した結果、実装ではなく既存テストの期待値の問題であった。テスト2件のみを修正し、実装には手を入れていない。
