---
specdojo:
  id: prj-0001:pjr-e45k-schedule-context-draft-profile
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  registered_at: "2026-10-28T22:23:00Z"
  block_reason: "parent validation failed: typecheck"
  derived_from:
    - PJR-65DS
  depends_on:
    - PJR-3MY5
    - PJR-JRSY
---

# PJR-E45K 雛形・文脈・draft・磨き込みを並べる schedule の profile を追加する

## 1. 概要

雛形と人による文脈の記入、draft、refine、review、finalize の順で段を並べる strategy profile を追加する

## 2. 完了条件

- strategy の profile に、雛形の作成と人による文脈の記入（human）、`draft`（agent）、refine（`fully-guided`、agent）、review、finalize（human）の順で段を並べる profile を追加する。profile の名前と、雛形の作成を独立した段にするか文脈の記入と同じ人の段にするかは executor が決める。
- `strategy-planning` と strategy の生成で、新しい profile を選べる。
- guided-pass の草案の段（「草案作成（実践の型に沿う）」）の approach を `fully-guided` から `draft` に替える。PJR-3MY5 で fully-guided が磨き込み専用になり、未作成の成果物を書かなくなったため（利用者の判断、案 A）。文脈が無い場合の `draft` が、型に沿って雛形から下書きすることを plan で確かめ、型がそろった成果物を schedule で新規に作れることを単体テストで確かめる。CHANGELOG の `## [Unreleased]` の `変更` に、profile の挙動が変わることを書く。
- 人の段は、既存の human タスクと同じく claim / complete で状態を記録し、plan に `deliverable scaffold` の実行と `_CONTEXT_` の書き方を示す。
- schedule の設計ガイド（strategy の profile を説明しているもの）に新しい profile と使いどころを書く。
- 単体テストで、新しい profile から生成される段・approach・依存の順序を確かめる。
- `CHANGELOG.md` の `## [Unreleased]` 節（無ければ `## [0.5.0]` の上に作る）に追記する。`0.5.0` と公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と `handoff` に書く。

## 3. 作業内容

| No  | 作業                              | 担当     | 状態 | メモ |
| --- | --------------------------------- | -------- | ---- | ---- |
| 1   | 新しい profile を追加する         | executor | open | -    |
| 2   | strategy の生成と選択に対応させる | executor | open | -    |
| 3   | ガイドとテストを更新する          | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:ryu-guide]]
