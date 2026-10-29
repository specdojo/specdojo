---
specdojo:
  id: prj-0001:pjr-d0gb-context-marker-info-level
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: easy
  registered_at: "2026-10-29T11:52:41Z"
  derived_from:
    - PJR-JRSY
---

# PJR-D0GB ready 以外の文書の _CONTEXT_ の検出を情報に下げ、--frail で lint:fm を落とさない

## 1. 概要

下書きに _CONTEXT_ を書くと --frail の lint:fm が warning で失敗し、draft までの間すべての exec run の親の検証が止まる。ready 以外は file.info とし、ready の error は維持する

## 2. 完了条件

- docs-lint の `_CONTEXT_` の検出（`packages/docs-lint/src/context-marker.ts`）が、`status: ready` 以外の文書では情報（`file.info`）として報告し、`--frail` 付きの `npm run lint:fm` を失敗させない。`status: ready` の文書では従来どおり error として失敗させる。
- 記述規約（document-metadata-standard の「文脈の目印」など、PJR-JRSY で検出の扱いを書いた箇所）と `packages/docs-lint/README.md` の説明を、ready 以外は情報、ready は error に改める。
- 単体テストで、ready 以外の文書の `_CONTEXT_` が warning ではなく情報として報告されること、ready の文書では error になることを確かめる。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。

## 3. 作業内容

| No  | 作業                                  | 担当     | 状態 | メモ |
| --- | ------------------------------------- | -------- | ---- | ---- |
| 1   | 検出の重さを変え、規約・README を直す | executor | open | -    |
| 2   | テストと CHANGELOG を更新する         | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-jrsy-context-marker]]
- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
