---
specdojo:
  id: prj-0001:xer-pjr-jxv7-20260810t070334z-aebb
  type: exec-result
  task_id: PJR-JXV7
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-jxv7-20260810T070334Z-aebb-plan.md
  started_at: "2026-08-10T07:03:34.717Z"
  completed_at: "2026-08-10T07:21:42.868Z"
  agent: codex-expert-edit-agent
---

# Edit Result

## 1. 実施内容

- [[prj-0001:pjr-jxv7-executor-evidence-collection|PJR-JXV7 executorステージとevidence収集を実装する]] の完了条件を基準に、strategy から Ready task まで `agent_pipeline` を伝播する型・解決処理を追加した。
- pipeline 対象では worktree / in-place の両経路で executor stage の要件と `stage_role: executor` に一致する agent だけを選択し、result を編集しない executor 専用 prompt と構造化検証報告契約で起動するよう runner を拡張した。
- runner が executor の標準出力・標準エラーと Git 差分情報から run ID 単位の `evidence.json` とログ抜粋を生成する処理、および `exec-evidence.schema.yaml` を追加した。evidence は終了状態、変更ファイル、差分統計、検証、最終メッセージ、ログ参照を保持する。
- 認証情報の定型的な値を保存前に秘匿化し、変更ファイル1,000件、検証50件、最終メッセージ4,000文字、ログ抜粋64 KiB などの上限を設けた。生 diff は保存しない。
- executor の失敗、rate limit、後続 reporter 待ちでは worktree を保持し、block event に `pipeline_stage=executor` と `evidence_ref` を記録する。reporter と result の決定的生成は [[prj-0001:pjr-rg7c-reporter-result-generation|PJR-RG7C reporterステージとresult生成を実装する]] の範囲として分離した。
- 検証結果:
  - `npm run typecheck`: 成功。
  - `npm run lint:ts`: 成功。
  - `npx vitest run tests/src/exec-evidence.test.ts tests/src/exec-strategy.test.ts tests/src/exec-run.test.ts tests/src/exec-run-resolve-command.test.ts`: 48件成功。
  - `npm test`: 1,010件成功、16件は sandbox がテスト内の `spawnSync git` を `EPERM` で拒否したため実行環境要因で失敗。失敗は既存の worktree / register-worktree 系4ファイルに限定され、変更関連テストのアサーション失敗はない。
  - `npx prettier --write <変更したTS・YAML・Markdown>`、対象 Markdown の `npx markdownlint`: 成功。
  - `node --import tsx tools/docs/src/validate-yaml-schema.ts --schema docs/specdojo/schemas/v1/sch-strategy.schema.yaml --data 'docs/ja/**/sch-strategy-*.yaml' --allow-empty`: 既存 strategy 2件が有効。
  - `exec-evidence.schema.yaml`: `tests/src/exec-evidence.test.ts` で生成 evidence の schema 適合を確認。
  - `node --import tsx src/specdojo.ts register build --project prj-0001`: 成功。
  - `node --import tsx src/specdojo.ts catalog validate --project prj-0001`: 8 catalog が成功。既存成果物ファイル未作成に関する warning 16件のみ。
  - `node --import tsx src/specdojo.ts index build`: 成功（1,072件）。sandbox で `npx tsx` の IPC socket 作成が `EPERM` になったため、同じ tsx loader を IPC 不使用の `node --import tsx` で起動した。

## 2. 変更ファイル

- `src/exec-types.ts`
- `src/exec-strategy.ts`
- `src/exec-schedule.ts`
- `src/exec-task-view.ts`
- `src/exec-run.ts`
- `src/exec-evidence.ts`
- `src/exec-worktree-ops.ts`
- `docs/specdojo/schemas/v1/exec-evidence.schema.yaml`
- `tests/src/exec-strategy.test.ts`
- `tests/src/exec-run.test.ts`
- `tests/src/exec-run-resolve-command.test.ts`
- `tests/src/exec-evidence.test.ts`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-jxv7-executor-evidence-collection.md`
- `docs/ja/projects/prj-0001/execution/exec/results/pjr-jxv7-20260810T070334Z-aebb-result.md`

## 3. 申し送り

- 本タスクでは executor 完了後に evidence を保存する地点までを実装した。reporter 起動、構造化出力検証、runner による result 描画が未実装の間は、executor 成功後も task を complete・統合せず、evidence と worktree を保持して block にする。PJR-RG7C ではこの分岐から reporter を起動し、同じ evidence を入力にして後続処理を継続する。
- stage 単位の再開と executor 再実行抑止、stage 別 CLI override は [[prj-0001:pjr-7mxj-pipeline-resume-recovery|PJR-7MXJ パイプラインの再実行と復旧制御を実装する]] の範囲である。現時点の `exec resume` は executor を再実行して新しい run ID の evidence を追加する。
- 全体テストの Git worktree 系16件は sandbox の子プロセス制約で実行できなかった。Git 子プロセスを許可する環境で `npm test` を再実行すると、worktree 統合を含む回帰確認を補完できる。

## 4. 進め方と実践の型の適用

plan に approach と rulebook の指定がない register 起点の実装タスクだったため、特定の rulebook / recipe / sample / template は適用しなかった。個票の完了条件、先行する [[prj-0001:pjr-jfwq-executor-reporter-pipeline-schema|PJR-JFWQ executor / reporterパイプラインのスキーマを設計する]]、[[prj-0001:pjr-nsxt-executor-reporter-agent-definitions|PJR-NSXT executor / reporter用エージェントを追加する]]、[[specdojo:schedule-design-guide|Schedule設計ガイド]]、[[specdojo:plan-result-lifecycle-guide|Plan / Result ライフサイクルガイド]] を設計根拠にした。既存の `src/exec-run.ts`、`src/exec-strategy.ts`、`src/exec-schedule.ts`、`src/exec-worktree-ops.ts` を調査し、単一 agent の候補選択・worktree・result 完了ガードを維持したまま pipeline executor の分岐を追加した。
