---
specdojo:
  id: prj-0001:pjr-evae-tsd-sample-maintenance
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
  registered_at: "2026-10-27T12:39:06Z"
  approach: sample-maintenance
  targets:
    - specdojo:tsd-sample
---

# PJR-EVAE tsd-sample を新しい tsd-rulebook に合わせて見直す

## 1. 概要

tsd-sample は技術の一覧を並べる初期の作りのままで、見直した tsd-rulebook の技術領域ごとの詳細定義（構成、採用設定、導入、動作確認、継続利用）と合っていない。rulebook に沿った完成例に作り直す。

## 2. 完了条件

1. `docs/ja/specdojo/samples/tsd-sample.md` を、[[specdojo:tsd-rulebook]] の必須の本文要件（概要・位置づけ、対象環境・前提条件、採用技術・設定、動作確認、制約・トラブルシュート）を満たす完成例に作り直す。条件付きの本文要件は、題材に必要なものだけを含める。
2. 題材は、PJR-9SXH で `specdojo:tsd-index-sample` が `tsd-sample` の題材に決めた技術領域とする。
3. frontmatter の `type` を、[[prj-0001:pjr-xsm8-sample-maintenance-target-kind]] の原則に従い rulebook の推奨値 `architecture` に直す。`part_of` に `specdojo:tsd-index-sample` を入れる。`id` は変えない。
4. rulebook の記述ガイドに沿い、採用値・推奨値・未決事項を区別する。採用設定の表に反映・確認方法を含め、動作確認の表（確認対象・実行場所・期待結果・失敗時の確認先）を設ける。秘密値は記載せず、プレースホルダーで示す。
5. [[specdojo:sample-authoring-standard]] に従う。`tsd-index-sample.md` は変更しない。食い違いを見つけた場合は、本個票の対応結果と pipeline の報告の `handoff` に書く。
6. `npm run lint:md`・`npm run lint:fm` と、親の検証が通る。
7. `CHANGELOG.md` の未公開の版の節に変更を書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ |
| --- | --------------------------------------------------------- | ---- | ---- | ---- |
| 1   | tsd-index-sample で決めた題材と rulebook の要件を確かめる | ARC  | open | -    |
| 2   | tsd-sample を完成例として書き直す                         | ARC  | open | -    |
| 3   | 検査を流し、対応結果を記録する                            | ARC  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:tsd-rulebook]]
- [[specdojo:sample-authoring-standard]]
- [[prj-0001:pjr-9sxh-tsd-index-sample-maintenance]]
- [[prj-0001:pjr-xsm8-sample-maintenance-target-kind]]
