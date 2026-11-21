---
specdojo:
  id: prj-0001:xer-pjr-sw7t-20261120t153242z-902db829
  type: exec-result
  task_id: PJR-SW7T
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-SW7T/pjr-sw7t-20261120T153242Z-902db829/plan.md
  started_at: "2026-11-20T15:32:42.746Z"
  completed_at: "2026-11-20T15:52:12.605Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- PJR-SW7T 型の一覧をまとめて grade する指定 (--kata) の実装、テスト、ドキュメント改訂を完了しました。

## 2. 変更ファイル

- `docs/ja/specdojo/references/command-reference.md`: 変更、+4 / -0 行
- `src/grade/command-run.ts`: 変更、+1 / -0 行
- `src/grade/command-shared.ts`: 変更、+16 / -0 行
- `src/grade/run.ts`: 変更、+57 / -14 行
- `src/grade/targets.ts`: 変更、+122 / -0 行
- `tests/src/grade/run.test.ts`: 変更、+197 / -1 行

## 3. 申し送り

- オプション名は完了条件の例示に従い --kata &lt;name&gt;（repeatable / カンマ区切り対応）を採用しました。
- 型名の解決は docs/ja/specdojo/rulebooks/${name}-rulebook.md および `docs/ja/specdojo/samples/${name}-sample.*`（または rulebook frontmatter で指定された sample）を対象とし、pjr のように sample が元々ない型は rulebook のみ、両方ある型は両方を対象としました。いずれも存在しない場合は実行前にまとめてエラーとしました。
- 型ごとの結果集計は全文書完了を「完了 (complete)」、1つでも失敗があれば「失敗 (failed)」、未完了があれば「未実行 (pending)」として終了時に一覧表示しました。
- 終了コードは rate limit が発生した場合は 75 を優先し、rate limit がなく完了と失敗が混在した場合は 2、すべて失敗の場合は 1 としました。
- CHANGELOG に書く事項: 区分「追加」、文案「`specdojo grade run --target kata` に、型名の一覧を指定して rulebook と sample の組を順に評価できる `--kata &lt;name&gt;` オプションを追加」。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
