---
specdojo:
  id: prj-0001:pjr-cbv6-grade-yaml-support
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T12:42:25Z"
  derived_from:
    - PJR-JQSB
    - PJR-V05D
---

# PJR-CBV6 grade で YAML の成果物を評価できるようにする

## 1. 概要

PJR-JQSB の決定どおり、grade が YAML の成果物のメタ情報を validate:schema と同じ読み方（最上位か x-spec-meta）で読み、YAML の本文を評価し、結果をサイドカーに残せるようにする

## 2. 入力

- PJR-JQSB（indie が決定、2026-11-10）: 案 A。ハッシュは YAML のファイルの内容から取り、指摘の行番号は元の YAML の行を指す。Markdown の扱いは変えない。
- 対象の例: docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml（最上位の id など）、docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml、YAML の kata の sample（bdd-sample.yaml・ifx-cmd-sample.yaml）。

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
