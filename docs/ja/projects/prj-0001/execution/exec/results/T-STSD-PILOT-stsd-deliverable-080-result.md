---
specdojo:
  id: prj-0001:xer-t-stsd-pilot-stsd-deliverable-080
  type: exec-result
  task_id: T-STSD-PILOT-stsd-deliverable-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-STSD-PILOT-stsd-deliverable-080-plan.md
  started_at: "2026-11-05T13:47:25.659Z"
  completed_at: "2026-11-05T14:06:35.358Z"
  agent: sol-executor
  execution: agent
  approach: condense
  targets:
    - prj-0001:stsd-deliverable
  condense_records:
    - location: 第2章・変更前25行「以下の値と意味はカタログと業務規約に基づく」
      category: repetition
      action: delete
      reason: 概要の業務規約への参照と第5章のカタログ根拠に関する記述を維持し、具体的な値・意味は状態表に残した。
      cause:
        type: document
    - location: 第2章・変更前25行「実装で未確認の事項は『今後の検討メモ』に示す」
      category: repetition
      action: delete
      reason: 第1章に実装確認の境界、第5章に具体的な未確認事項と対応があり、案内文の削除で判断情報は失われない。
      cause:
        type: document
    - location: 第3章・変更前35行「対象遷移は `T-01`〜`T-04`」
      category: figure-prose
      action: delete
      reason: 分割していない図の全4遷移は第4章の4行と対応しており、対象範囲の再説明は不要。図は3状態・4遷移、最大接続数3で分割閾値以下のため維持した。
      cause:
        type: document
    - location: 第4章・変更前55行 `T-04` の補足
      category: repetition
      action: reference
      reason: 置換手順と旧状態別の適用可否が実装未確認であることを、同じ内容を持つ `T-03` への参照にまとめた。遷移元・先・イベント・条件は維持した。
      cause:
        type: document
    - location: 第5章・変更前64行「照合するまで、機械的な保証として利用しない」
      category: repetition
      action: merge
      reason: 機械的な強制を保証しない制約は第1章へ集約。第5章には実装確認が未了であること、追加する根拠、照合の作業、担当と時期を残した。
      cause:
        type: document
    - location: 第2章・変更前25行「成立条件は記録値の判定であり…証明ではない」
      category: table-prose
      action: retain
      reason: 記録値による状態判定と承認実施の証明の違いは、状態表だけでは伝わらない判断上の制約である。
      cause:
        type: document
    - location: 第1章・変更前21行および第5章・変更前66行の降格・復帰に関する記述
      category: repetition
      action: retain
      reason: 概要は未記載の経路を禁止と誤認しないための制約、第5章は合意対象・決定者・時期を示すため、双方を維持した。
      cause:
        type: document
    - location: 第4章・変更前57行の廃棄処理の説明
      category: unneeded-background
      action: retain
      reason: 廃棄が状態遷移ではない根拠と、廃棄先への移動を廃止の成立条件にできない例外を示すため、実装上の確認内容を維持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象となるステータス定義文書（`stsd-deliverable.md`）の冗長性を整理しました。
- 重複していた業務規約への参照や、実装確認の境界に関する案内文を削除し、情報を集約しました。
- 図の内容に関する冗長な説明（`figure-prose`）を削除し、状態遷移の定義と図が直接対応するように整理しました。
- 遷移に関する補足説明を、既存の遷移への参照に置き換えることで簡略化しました。
- 判断に要する重要な制約（記録値による判定と承認の区別など）や、未決事項に関する背景情報は、意味を維持するために保持しています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-deliverable.md`: 冗長な説明（業務規約への参照、実装確認の案内、図の説明、遷移の補足）を削除・集約し、状態定義、遷移条件、判断上の制約、および未決事項の重要情報を維持した状態で、文書の簡潔化を行いました。

## 3. 申し送り

- result ファイルは編集されていません。
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下への変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存の exec plan・result を変更していない。）

## 4. 進め方と実践の型の適用

condense

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `第2章・変更前25行「以下の値と意味はカタログと業務規約に基づく」` | `repetition` | `delete` | `概要の業務規約への参照と第5章のカタログ根拠に関する記述を維持し、具体的な値・意味は状態表に残した。` | `document` |
| `第2章・変更前25行「実装で未確認の事項は『今後の検討メモ』に示す」` | `repetition` | `delete` | `第1章に実装確認の境界、第5章に具体的な未確認事項と対応があり、案内文の削除で判断情報は失われない。` | `document` |
| ``第3章・変更前35行「対象遷移は `T-01`〜`T-04`」`` | `figure-prose` | `delete` | `分割していない図の全4遷移は第4章の4行と対応しており、対象範囲の再説明は不要。図は3状態・4遷移、最大接続数3で分割閾値以下のため維持した。` | `document` |
| ``第4章・変更前55行 `T-04` の補足`` | `repetition` | `reference` | ``置換手順と旧状態別の適用可否が実装未確認であることを、同じ内容を持つ `T-03` への参照にまとめた。遷移元・先・イベント・条件は維持した。`` | `document` |
| `第5章・変更前64行「照合するまで、機械的な保証として利用しない」` | `repetition` | `merge` | `機械的な強制を保証しない制約は第1章へ集約。第5章には実装確認が未了であること、追加する根拠、照合の作業、担当と時期を残した。` | `document` |
| `第2章・変更前25行「成立条件は記録値の判定であり…証明ではない」` | `table-prose` | `retain` | `記録値による状態判定と承認実施の証明の違いは、状態表だけでは伝わらない判断上の制約である。` | `document` |
| `第1章・変更前21行および第5章・変更前66行の降格・復帰に関する記述` | `repetition` | `retain` | `概要は未記載の経路を禁止と誤認しないための制約、第5章は合意対象・決定者・時期を示すため、双方を維持した。` | `document` |
| `第4章・変更前57行の廃棄処理の説明` | `unneeded-background` | `retain` | `廃棄が状態遷移ではない根拠と、廃棄先への移動を廃止の成立条件にできない例外を示すため、実装上の確認内容を維持した。` | `document` |
