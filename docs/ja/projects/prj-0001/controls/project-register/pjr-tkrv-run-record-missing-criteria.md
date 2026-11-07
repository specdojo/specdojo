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

# PJR-TKRV 実行記録の欠落の基準を記録の世代に合わせて見直す

## 1. 概要

exec validate の欠落の検査が、evidence より前の run や移行で plan と result を集めた前の試行も欠落と判定するため、記録の世代ごとに求める記録を決め、--records-only と CI を過去の記録で通るようにする

## 2. 入力

- 由来: PJR-JT5J の統合後、develop の exec validate で missing が 644 件出た。内訳は plan 141 件、result 138 件、evidence 365 件（2026-11-07）
- evidence がない run 365 件のうち、pipeline-state.json を持つのは 4 件。ほかは evidence の仕組みより前の run で、ディレクトリ名に日時がないか、7 月から 10 月の run（2026-11-07）
- plan と result の欠落は、PJR-9BY9 の移行で plan と result を最新の試行のディレクトリに集めたため、その前の試行のディレクトリに残っていない（2026-11-07）
- 欠落は schedule の T-LAUNCH（155 件）と T-DATA-FLOW（68 件）に多い（2026-11-07）
- JT5J の個票の対応結果に CI の workflow の案（.github/workflows/check-run-record-layout.yml、--records-only を流す）がある。欠落の扱いが決まるまで反映しない（2026-11-07）
- 決定: PJR-KC0T で普通の exec validate の欠落を警告にした後に、この項目で基準を見直す（2026-11-07 indie が決定）

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
