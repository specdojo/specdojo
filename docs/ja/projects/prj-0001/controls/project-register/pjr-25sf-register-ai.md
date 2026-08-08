---
specdojo:
  id: prj-0001:pjr-25sf-register-ai
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-25SF register系タスクへのAIレビューフェーズ導入を検討する

## 1. 概要

catalog成果物には edit phase → review phase の2段階agent実行があるが、register(PJR)系タスク（`exec run --register`）は edit/investigate の実行区分のみで、review用のモード・planテンプレート・状態遷移が存在しない。[[prj-0001:pjr-0163-register-add-id-fetch]] の実行後、`review` 状態は「agentによる自動レビュー待ち」ではなく「人間が確認して `register close` するのを待つだけの手動チェックポイント」であることが判明した。この非対称性を踏まえ、register系タスクへの自動レビューパス導入の要否と設計を検討する。

## 2. 完了条件

- 自動レビューパスを導入すべきか、既存の人間チェックポイント運用を維持すべきかの結論が出ている。
- 導入する場合、対象範囲（全item_type共通か、`edit`区分のtodo/issue/change-requestのみか、`investigate`区分の question/risk も含めるか）が決まっている。
- 導入する場合、レビュー結果が否だったときの状態遷移（新設の差し戻し状態か、既存の `register wait` を流用するか）が決まっている。
- 導入する場合、自動レビューを必須（`exec run --register` に自動で組み込む）にするか、任意（明示オプション指定時のみ）にするかが決まっている。
- 導入する場合、レビュー用のplanテンプレートと、個票「完了条件」をcatalogの `done_criteria` 相当としてレビューagentへ渡す方法が決まっている。
- 検討結果が本個票の「対応結果」に記録され、導入しない場合はその理由も記録されている。

## 3. 作業内容

| No  | 作業                                                                    | 担当 | 状態 | メモ                                                                      |
| --- | ----------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------- |
| 1   | catalog成果物のedit/review2段階実行の仕組みを調査する                   | ARC  | open | `src/exec-run.ts`・スケジュール定義（`sch-strategy-*.yaml`の phase.mode） |
| 2   | register系タスクへ適用する場合の対象範囲・状態遷移・必須/任意を整理する | ARC  | open | -                                                                         |
| 3   | 導入可否と設計方針を決定し、個票へ記録する                              | ARC  | open | 導入する場合は別途実装todoを起票する                                      |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0163-register-add-id-fetch|register addのID採番方式見直しと統合ブランチ予約のfetch同期]]
- [[specdojo:pjr-rulebook|プロジェクト登録簿ルールブック]]
- [[specdojo:register-operation-guide|SpecDojo登録簿運用ガイド]]
