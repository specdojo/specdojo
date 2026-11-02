---
specdojo:
  id: prj-0001:pjr-ewhq-orch-argon
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-02T23:07:23Z"
  due_on: "2026-11-30"
---

# PJR-EWHQ Antigravity の orchestrator に Gemini 4 Argon の起動スクリプトを足す

## 1. 概要

specdojo init と config scaffold が Antigravity 用に配る起動スクリプトに orch:argon と orch:argon:work（gemini-4-argon-medium、worktree argon-work）を足し、このリポジトリの package.json にも同じスクリプトを足す。orch:flash は残す

## 2. 入力

- agy に Gemini 4 Argon が追加され、agy models で gemini-4-argon-high・gemini-4-argon-medium・gemini-4-argon-low を確かめた（agy 1.4.12、2026-11-03）
- 利用者は、orchestrator を性能の良い argon で npm run orch:argon と npm run orch:argon:work から立ち上げたい。配る雛形にも反映する案 B を選んだ（2026-11-03）
- 強さは medium とする。orch:sol は -m gpt-6.1-sol で、.codex/config.toml の `model_reasoning_effort` = medium が効いており、argon も medium にそろえる。性能が足りなければ high に変える（2026-11-03 の対話で合意）
- worktree は argon-work とする。orch:flash:work は agy-work を使っており、同じ名前だと同時に立ち上げたときに worktree を取り合う
- 雛形では orch:argon を足し、orch:flash は残す（既存の利用者の手順を壊さないため。orchestrator の推奨）

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
