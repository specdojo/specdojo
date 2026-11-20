---
specdojo:
  id: prj-0001:xer-pjr-dgrz-20261116t130817z-0296502f
  type: exec-result
  task_id: PJR-DGRZ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-DGRZ/pjr-dgrz-20261116T130817Z-0296502f/plan.md
  started_at: "2026-11-16T13:08:18.529Z"
  completed_at: "2026-11-16T13:42:48.902Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- frontier を expert の上位段として追加し、名前指定または明示要求時だけ選択可能にした。provider の対応設定がない場合の起動前エラー、雛形、関連設計・ガイド、回帰テスト、個票の対応結果を更新した。result は編集していない。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-codex-agent-settings.md`: 変更、+1 / -1 行
- `docs/ja/product/040-system-design/sysd-cross-cutting-policy.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/guides/exec-config-guide.md`: 変更、+10 / -4 行
- `docs/ja/specdojo/guides/schedule-design-guide.md`: 変更、+8 / -8 行
- `docs/ja/specdojo/standards/job-definition-standard.md`: 変更、+1 / -0 行
- `docs/specdojo/schemas/v1/exec-common.schema.yaml`: 変更、+2 / -1 行
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`: 変更、+9 / -2 行
- `docs/specdojo/schemas/v1/job.schema.yaml`: 変更、+1 / -1 行
- `docs/specdojo/schemas/v1/sch-strategy.schema.yaml`: 変更、+2 / -2 行
- `src/commands/init.ts`: 変更、+4 / -2 行
- `src/exec/agent-config.ts`: 変更、+11 / -0 行
- `src/exec/run/shared.ts`: 変更、+3 / -0 行
- `src/exec/strategy.ts`: 変更、+1 / -4 行
- `src/job/definition.ts`: 変更、+8 / -6 行
- `src/shared/agent-types.ts`: 変更、+8 / -1 行
- `src/shared/specdojo-config.ts`: 変更、+2 / -2 行
- `templates/init-exec-defaults.yaml`: 変更、+11 / -0 行
- `tests/docs/specdojo/schemas/job-schema.test.ts`: 変更、+12 / -0 行
- `tests/docs/specdojo/schemas/sch-strategy-schema.test.ts`: 変更、+13 / -0 行
- `tests/src/commands/init.test.ts`: 変更、+3 / -0 行
- `tests/docs/specdojo/schemas/exec-defaults-schema.test.ts`: 追加、+33 / -0 行
- `tests/src/exec/frontier.test.ts`: 追加、+356 / -0 行

## 3. 申し送り

- 保護設定の変更案: 統合後、利用者の承認を得て feature ブランチで `.specdojo/exec-defaults.yaml` の `providers.codex.command_params.by_proficiency` に `frontier: { effort: xhigh }` を追加する。Fable の追加前には `providers.claude.command_params.by_proficiency` に `frontier: {}` も追加する。Astra・Fable の名簿追加は別作業。
- 判断: 追加変数が不要な provider は `frontier: {}` で対応を明示する。mode ごとの役割や member の model を維持するため。member の command 上書きにも設定不足の検査を適用する。現行の config init は exec-defaults を生成しないため、生成入口である `specdojo init --exec` の雛形を更新した。
- CHANGELOG 文案（追加）: agent の習熟度に最上位の `frontier` を追加。名前指定または `proficiency: frontier` の明示要求時だけ使用でき、明示要求のない自動選択や rate limit の代替候補には含まれません。起動には provider の `by_proficiency.frontier` 設定が必要です。
- 統合後、運用メモに従って PJR-JSEY による実 CLI の動作確認を行う。型・lint・unit / integration・全体 schema 検証は親 runner に委ねた。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
