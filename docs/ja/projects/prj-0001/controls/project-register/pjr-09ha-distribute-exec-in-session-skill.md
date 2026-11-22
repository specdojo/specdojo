---
specdojo:
  id: prj-0001:pjr-09ha-distribute-exec-in-session-skill
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-22T05:44:25Z"
  derived_from:
    - PJR-XZ9B
---

# PJR-09HA skill specdojo-exec-in-session を利用者のリポジトリへ配る

## 1. 概要

オーケストレーターが会話の中で項目を実装する手順の skill を、templates と scaffold で利用者のリポジトリへ配る。正本は .agents/skills に置き、Claude Code などにはラッパーを置く

## 2. 入力

- PJR-XZ9B で skill の正本 .agents/skills/specdojo-exec-in-session/SKILL.md と Claude Code のラッパー .claude/skills/specdojo-exec-in-session/SKILL.md を足した。配布は XZ9B の範囲外とした。
- 2026-11-22、indie の判断で skill も配ることにした。
- 配る仕組みは src/shared/provider-scaffold.ts で、templates/`<provider>`/ の agents・rules と、それ以外を .specdojo/`<provider>`/ へ写す。skills を写す経路はまだない。
- Codex はリポジトリの .agents/skills を標準で読む。opencode と Copilot がどこから skill を読むかは未確認。
- .agents/skills と .claude は executor が書けない保護された設定のため、正本はこの項目では変えない。配る原本は templates/ に置く。

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
