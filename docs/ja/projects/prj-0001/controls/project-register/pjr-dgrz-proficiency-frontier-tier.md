---
specdojo:
  id: prj-0001:pjr-dgrz-proficiency-frontier-tier
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
  registered_at: "2026-11-16T13:05:31Z"
  commit_type: feat
  commit_scope: exec
---

# PJR-DGRZ proficiency に expert の上の段 frontier を足し、名前指定のときだけ使えるようにする

## 1. 概要

Astra・Fable のように通常は使わない最上位の agent を、自動の選択では選ばず、名前指定や明示の要求のときだけ使えるようにする

## 2. 入力

- 2026-11-16、利用者が codex の gpt-6-astra と Claude Code の fable（最新の model の別名）を、通常は使わず名前指定のときだけ使う member として足すことを依頼した
- disabled: true は --executor-by でも止まり、priority: 9 は作業中の agent を後ろに回す並べ方のため自動の選択から確実には外れない（src/exec/run/shared.ts の selectCandidates）。利用者が expert の上の proficiency を用意する案を選んだ（2026-11-16）
- proficiency の一覧は型・設定・strategy・job の検査・スキーマに重複して固定されている。codex の effort は exec-defaults.yaml の `by_proficiency` から決まる
- Astra と Fable の member は、この項目が統合されてから proficiency: frontier で名簿に足す

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
