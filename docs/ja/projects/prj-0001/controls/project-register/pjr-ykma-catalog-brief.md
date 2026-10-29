---
specdojo:
  id: prj-0001:pjr-ykma-catalog-brief
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-10-28T22:22:41Z"
  derived_from:
    - PJR-65DS
  depends_on:
    - PJR-3MY5
---

# PJR-YKMA カタログの成果物に brief を設ける

## 1. 概要

成果物の外から継続して渡す前提を dct の brief に書けるようにし、schedule と register の両経路の plan に入れる

## 2. 完了条件

- `dct.schema.yaml` の成果物に `brief` を追加し、`catalog validate` が受け付ける。複数の成果物で共有する場合は YAML のアンカーを使えることを示す。
- schedule の task の plan と、register 経由で成果物を対象にする plan の両方に、`brief` を「前提」として載せる。3MY5 で設けた差し込み口を使う。`brief` が無い場合は載せない。
- dct の rulebook（カタログの記述規則）と関連ガイドに、`brief`・`overview`・`done_criteria` の使い分けを書く。
- 単体テストで、schema の検証と、両経路の plan への反映を確かめる。
- `CHANGELOG.md` の `## [Unreleased]` 節（無ければ `## [0.5.0]` の上に作る）に追記する。`0.5.0` と公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と `handoff` に書く。

## 3. 作業内容

| No  | 作業                                        | 担当     | 状態 | メモ |
| --- | ------------------------------------------- | -------- | ---- | ---- |
| 1   | schema と catalog の検証に `brief` を加える | executor | open | -    |
| 2   | 両経路の plan に反映する                    | executor | open | -    |
| 3   | rulebook・ガイド・テストを更新する          | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:ryu-guide]]
