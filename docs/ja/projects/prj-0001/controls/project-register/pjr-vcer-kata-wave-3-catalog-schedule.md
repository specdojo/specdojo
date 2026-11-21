---
specdojo:
  id: prj-0001:pjr-vcer-kata-wave-3-catalog-schedule
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-21T06:08:04Z"
  derived_from:
    - PJR-ABY4
---

# PJR-VCER 第 3 波の kata ドメインと strategy・schedule を用意する（試験の型 13 種類）

## 1. 概要

dct-kata.yaml を作って試験の型 13 種類の sample を成果物として載せ、kata-wave-3 の strategy と schedule を作る

## 2. 入力

- PJR-6998 の決定（2026-11-21、indie）: kata ドメイン（dct-kata.yaml、`base_path` /docs/ja/specdojo、グループ samples）に sample を kind: work の成果物として載せ、`local_id` は `<name>-sample`、rulebook は対応の型。代表は sample そのもの（駄菓子屋の共通の文脈）
- 2026-11-21 の試し（trial/prj-0001/kata-sample-catalog、commit せず捨てた）: dct-kata.yaml に tsp-index-sample と utc-sample を載せ、dct-index.yaml に domain kata を足すと、catalog validate・catalog build・index build・exec plan --deliverable utc-sample が通った。plan の targets は sample の frontmatter の ID（specdojo:utc-sample）になった
- PJR-ABY4 の範囲: 段は rulebook を簡潔に → sample を厚く → 簡潔さの確認（condense） → review → 人の確定。template は PJR-WYTX で扱う
- 2026-11-21 から opus で型の grade をし直している（run id regrade-kata-2026-11-21）。結果は docs/ja/projects/prj-0001/execution/grade/results/`specdojo.<name>-rulebook.yaml` と `specdojo.<name>-sample.yaml`
- agy（Antigravity）は使わない（PJR-5V0T）

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
