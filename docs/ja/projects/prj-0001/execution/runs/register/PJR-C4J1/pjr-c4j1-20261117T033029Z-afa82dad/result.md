---
specdojo:
  id: prj-0001:xer-pjr-c4j1-20261117t033029z-afa82dad
  type: exec-result
  task_id: PJR-C4J1
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-C4J1/pjr-c4j1-20261117T033029Z-afa82dad/plan.md
  started_at: "2026-11-17T03:30:30.360Z"
  completed_at: "2026-11-17T03:45:47.478Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- build --only で 6 区分と exec を選べるようにし、個別の build を内部互換用の非表示入口として残した。文書と個票を更新し、残る executor 用の検査を実行した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/quick-start-guide.md`: 変更、+3 / -3 行
- `docs/ja/specdojo/guides/waza-guide.md`: 変更、+10 / -8 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+65 / -43 行
- `src/catalog/catalog.ts`: 変更、+3 / -1 行
- `src/commands/build.ts`: 変更、+88 / -11 行
- `src/dashboard/dashboard.ts`: 変更、+5 / -5 行
- `src/docs/index-command.ts`: 変更、+2 / -2 行
- `src/docs/yaml-pages-command.ts`: 変更、+5 / -3 行
- `src/register/maintenance-commands.ts`: 変更、+2 / -2 行
- `src/schedule/schedule.ts`: 変更、+2 / -2 行
- `tests/src/cli-verb-taxonomy.test.ts`: 変更、+33 / -0 行
- `tests/src/schedule/command.test.ts`: 変更、+9 / -5 行
- `tests/src/commands/build-command.test.ts`: 追加、+180 / -0 行

## 3. 申し送り

- 個別の 6 つの build と旧 `build --scope` は削除せず、内部互換用として非表示にした。hook・watch・runner・routine の呼び出し元は変えていない。保護された設定の変更案はない。
- schedule は track YAML を上書きし得るため一括 `build` には含めず、`build --only schedule --track &lt;track&gt;` で明示したときだけ実行する（上書きには `--force` が必要）。
- CHANGELOG の文案は個票の対応結果の「CHANGELOG に書く事項」に記載した。
- 完了条件の `npm run check` は親 runner の検証（lint・typecheck・test・schema）と、executor の `check:src-imports`・`validate:catalog`・`validate:history-links` を合わせて判定する。
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-17T03:38:46.471Z に再開

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
