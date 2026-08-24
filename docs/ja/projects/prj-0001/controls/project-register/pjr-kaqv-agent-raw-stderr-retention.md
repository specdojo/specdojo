---
specdojo:
  id: prj-0001:pjr-kaqv-agent-raw-stderr-retention
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-24T10:17:53Z"
  due_on: "2026-08-31"
---

# PJR-KAQV agent失敗時の生のstderrを保全する

## 1. 概要

PJR-E6HG の調査では、失敗した実行の stderr ログに原因を示すメッセージが残っておらず、stdout の切り詰められた要約行だけが手がかりだった。そのため原因を推測に頼らざるを得ず、初回の結論が誤りとなった。agent が非ゼロ終了した場合に生の stdout と stderr を evidence の一部として保全し、失敗理由の要約とは別に参照できるようにする。認証情報などの秘密が混入しうる点を踏まえ、保全先と取り扱いもあわせて定める。

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
