---
specdojo:
  id: prj-0001:pjr-9sxh-tsd-index-sample-maintenance
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
  registered_at: "2026-10-27T12:39:20Z"
  approach: sample-maintenance
  targets:
    - specdojo:tsd-index-sample
---

# PJR-9SXH tsd-index-sample を新しい tsd-index-rulebook に合わせて見直す

## 1. 概要

tsd-index-sample を、見直した tsd-index-rulebook の技術スタック一覧の列（区分、採用技術、担当責務、版・正本、適用範囲）と参照の要件に合わせて見直す。

## 2. 完了条件

1. `docs/ja/specdojo/samples/tsd-index-sample.md` が [[specdojo:tsd-index-rulebook]] の本文要件（冒頭の概要、技術スタック一覧、補足・詳細への導線）と、技術スタック一覧の列の要件（区分・採用技術・担当責務は必須、版・正本と適用範囲は条件付き）を満たす。
2. 実行基盤だけでなく、開発・検証・文書化・運用の技術を対象範囲に応じて含め、採用済みの必須構成と任意利用の構成を区別する。依存パッケージを網羅的に列挙しない。
3. 版の粒度を揃え、正確な版を管理する正本（lockfile など）を示す。
4. 技術構成が [[specdojo:sample-authoring-standard]] の `共通サンプル文脈`（駄菓子屋きぬやの販売管理）の規模に合うかを見直す。構成を変えた場合は、理由を本個票の対応結果に書く。
5. 補足から参照する詳細 TSD のうち 1 つを、`specdojo:tsd-sample`（PJR-EVAE）の題材として決める。題材とした詳細 TSD の名前と選んだ理由を本個票の対応結果に書く。
6. H1 を rulebook の名称に合わせ、「技術スタック一覧（TSD Index）サンプル」とする。
7. [[specdojo:sample-authoring-standard]] に従う。`tsd-sample.md` は変更しない。
8. `npm run lint:md`・`npm run lint:fm` と、親の検証が通る。
9. `CHANGELOG.md` の未公開の版の節に変更を書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | rulebook の要件と現行 sample の差分を洗い出す   | ARC  | open | -    |
| 2   | 一覧と補足を書き直し、tsd-sample の題材を決める | ARC  | open | -    |
| 3   | 検査を流し、対応結果を記録する                  | ARC  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:tsd-index-rulebook]]
- [[specdojo:sample-authoring-standard]]
- [[prj-0001:pjr-evae-tsd-sample-maintenance]]
- [[prj-0001:pjr-xsm8-sample-maintenance-target-kind]]
