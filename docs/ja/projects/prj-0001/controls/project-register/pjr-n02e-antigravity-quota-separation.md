---
specdojo:
  id: prj-0001:pjr-n02e-antigravity-quota-separation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: ARC
  registered_at: "2026-10-10T21:23:46Z"
  due_on: "2026-10-31"
---

# PJR-N02E Antigravity 経由の claude と GPT が各社直の利用枠と別勘定かを実測する

## 1. 概要

agy CLI には利用枠を確認するコマンドがないため、Anthropic 直か OpenAI 直の枠を使い切った状態で agy-claude-* / agy-gpt-executor を起動し、実行できるかを確かめる。別勘定なら利用制限で exec が止まったときの退避経路にする。rate limit の文言を観測したら rate_limit_detection へ反映する。

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
