---
specdojo:
  id: prj-0001:xer-pjr-mwwp-20260924t120121z-6de3
  type: exec-result
  task_id: PJR-MWWP
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-mwwp-20260924T120121Z-6de3-plan.md
  started_at: "2026-09-24T12:01:21.226Z"
  completed_at: "2026-09-24T12:14:28.092Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- dashboard の表セルに埋め込まれる理由（`block_reason` 等）を整形し、制御文字・パイプ・長文によって表が崩れる問題を解消するための共通処理を実装した。
- 実装に伴い、単体テストの追加および関連する個票とコマンドリファレンスの更新を行った。

## 2. 変更ファイル

- `src/dashboard.ts`: 表セル向けの共通整形処理を実装
- `tests/src/dashboard.test.ts`: 整形処理の単体テストを追加
- `docs/ja/projects/prj-0001/controls/project-register/pjr-mwwp-dashboard-cell-sanitize.md`: 対応内容を個票に記録
- `docs/ja/specdojo/references/command-reference.md`: 関連するコマンドリファレンスを更新

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

`src/dashboard.ts` に表セル用のサニタイズ処理を導入し、パイプ文字のエスケープや制御文字の除去、長文の適正な処理を行うように変更した。その後、`tests/src/dashboard.test.ts` で正常に動作することを検証し、`node --import tsx src/specdojo.ts dashboard build --project prj-0001` 等を実行して成果物の整合性を確認した。
