---
specdojo:
  id: prj-0001:pjr-t30j-shared-scope-and-multi-feature-cycles
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-10-18T15:47:38Z"
  derived_from:
    - PJR-WSET
---

# PJR-T30J shared の機能固有のモジュールを戻し、3 機能以上をまたぐ循環をほどく

## 1. 概要

WSET の見直しで、src/shared/ に 1 機能からしか使われない 6 モジュール（catalog-paths・template-resolution・schedule-paths・random・yaml-schema-modeline・specdojo-gitignore）と機能固有の 2 モジュール（catalog-render・schedule-index）が残ることが分かった。あわせて schedule → dashboard → exec → schedule のような 3 機能以上をまたぐ循環が残っている。どこまで戻すか・ほどくかは完了条件を決めてから行う

## 2. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 3. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
