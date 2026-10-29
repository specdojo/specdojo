---
specdojo:
  id: prj-0001:pjr-jrsy-context-marker
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-10-28T22:22:03Z"
  derived_from:
    - PJR-65DS
  depends_on:
    - PJR-3MY5
---

# PJR-JRSY 成果物の文脈の目印 _CONTEXT_ を設ける

## 1. 概要

_CONTEXT_ の書き方を規約に加え、draft が反映後に消して result へ写し、finalize と lint で残りを検出する

## 2. 完了条件

- 記述の規約（`.github/instructions/markdown.instructions.md` と、斜体の目印を定める standard）で、`_CONTEXT_` を目印の許可リストに加え、段落の先頭に `_CONTEXT_:` と書くこと、文書全体にかかる指示は先頭の章に書くことを定める。
- `draft` の plan 雛形に、`_CONTEXT_` の指示を本文へ反映したら目印を消し、元の指示を result に写すことを書く。`fully-guided` の plan 雛形には、`_CONTEXT_` が残っていれば反映せずに論点として result に残すことを書く。
- `finalize` / `bootstrap-finalize` の確認チェックリストに、`_CONTEXT_` が残っていないことを加える。
- 文書の lint で `_CONTEXT_` の残りを検出する。`status: ready` の文書では error、それ以外は warning とする（検出を置く場所は executor が決める）。
- 単体テストで、`_CONTEXT_` の検出（ready で error、draft で warning）と、plan 雛形・チェックリストへの反映を確かめる。
- `CHANGELOG.md` の `## [Unreleased]` 節（無ければ `## [0.5.0]` の上に作る）に追記する。`0.5.0` と公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と `handoff` に書く。

## 3. 作業内容

| No  | 作業                                                               | 担当     | 状態 | メモ |
| --- | ------------------------------------------------------------------ | -------- | ---- | ---- |
| 1   | 規約に `_CONTEXT_` を加える                                        | executor | open | -    |
| 2   | draft・fully-guided の plan と finalize のチェックリストを更新する | executor | open | -    |
| 3   | lint での検出とテストを追加する                                    | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:ryu-guide]]
