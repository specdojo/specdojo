---
specdojo:
  id: prj-0001:pjr-tkrv-run-record-missing-criteria
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-11-07T06:34:19Z"
  derived_from:
    - PJR-JT5J
  depends_on:
    - PJR-KC0T
---

# PJR-TKRV 一部だけ残った実行記録を片付け、記録の置き場所の検査を CI に入れる

## 1. 概要

PJR-KC0T の後に残る、記録の一部だけがある run のディレクトリ（14 件ほど）を片付け、--records-only を流す CI の workflow を反映する

## 2. 入力

- 由来: PJR-JT5J の統合後の exec validate の欠落のうち、過去の世代の記録でないものが 14 件ほど残る。例: result だけ（PJR-2219）、plan だけ（PJR-TNDH）、integrate.log だけ（PJR-283N）、pipeline-state.json だけ（PJR-PZBP）、evidence.json がない（PJR-23DT）（2026-11-07）
- JT5J の個票の対応結果に CI の workflow の案（.github/workflows/check-run-record-layout.yml、--records-only を流す）がある。保護された設定のため、反映は利用者の承認のもとで行う（2026-11-07）
- 決定: 過去の世代の記録を正常として扱う基準は PJR-KC0T で決める。この項目は残った記録の片付けと CI の反映だけを扱う（2026-11-07 indie が決定）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
