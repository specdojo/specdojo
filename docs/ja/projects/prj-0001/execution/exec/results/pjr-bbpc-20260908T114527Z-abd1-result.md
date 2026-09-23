---
specdojo:
  id: prj-0001:xer-pjr-bbpc-20260908t114527z-abd1
  type: exec-result
  task_id: PJR-BBPC
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-bbpc-20260908T114527Z-abd1-plan.md
  started_at: "2026-09-08T11:45:27.274Z"
  completed_at: "2026-09-08T11:59:46.717Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- 3段評価の既定リファレンスが対象種別に追従しない問題に対処するため、`tools/grade/run-per-document.sh` を修正し、指定された種別に基づいた既定リファレンスの選択、明示指定の優先、異種別拒否、および欠落時のフォールバック処理を実装した。
- あわせて、関連するCommandリファレンスおよび個票を更新し、回帰テスト `tests/tools/grade-per-document.test.ts` を実装・更新して動作を検証した。
- 静的検査（prettier, markdownlint）、型検査、カタログ検証、および統合テスト（test-integration）および単体テスト（test-unit）をすべて通過した。

## 2. 変更ファイル

- `tools/grade/run-per-document.sh`: 種別に追従する既定リファレンスの選択ロジックおよびエラーハンドリングを実装。
- `tests/tools/grade-per-document.test.ts`: 既定リファレンスの種別追従、明示指定の優先、異種別拒否などの検証ケースを追加し、回帰テストを整備。
- `docs/ja/projects/prj-0001/controls/project-register/pjr-bbpc-stage1-reference-kind-default.md`: 個票の作業内容および対応結果を更新。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスの記述を修正。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

まず `tools/grade/run-per-document.sh` において、`--kind` 引数に基づいた既定リファレンスの動的な切り替えを実装した。次に、意図しない種別のリファレンスが利用されないよう拒否ロジックを追加し、テストコードでこれらの境界条件と正常系を網羅的に検証した。最後に、ドキュメントの整合性を整え、プロジェクト規定の静的検査およびテストサイクルを通じて品質を担保した。
