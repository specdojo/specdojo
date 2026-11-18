---
specdojo:
  id: prj-0001:pjr-k3z2-ccd-direction-tb
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-17T22:52:02Z"
  due_on: "2026-11-30"
---

# PJR-K3Z2 概念クラス図（ccd）の向きを上から下にそろえる

## 1. 概要

ccd の sample と ccd-project-planning が direction LR で描かれているため、継承の読み方と状態遷移図にそろえて上→下を既定にし、rulebook に向きの決まりを足す。

## 2. 入力

- 利用者の指摘（2026-11-18）: 概念クラス図は左→右ではなく、ほかの図に合わせて上から下の配置にした方がよい
- orchestrator の調べ（2026-11-18）: ccd-sample と ccd-project-planning は direction LR。stsd（sample と本番 5 件）は指定なし（上→下）。データフロー図・C4・プロジェクト定義の図は flowchart LR。ccd-mermaid-rulebook に向きの決まりはない。ccd-project-planning はクラス 11 個
- 利用者の決定（2026-11-18）: 上→下を既定とし、関連の連なりが長く横に並べた方が読みやすい場合だけ LR とし、理由を本文に書く

## 3. 完了条件

- [[specdojo:ccd-mermaid-rulebook|ccd-mermaid-rulebook]] の概念クラス図の記述ガイドに、向きの決まりを足す。既定は上→下（`direction` を書かないか `direction TB`）とし、親を上・子を下に置く。関連の連なりが長く横に並べた方が読みやすい場合だけ `direction LR` とし、その理由を本文に書く。
- `docs/ja/specdojo/samples/ccd-sample.md` と `docs/ja/product/010-business-specs/020-data-model/ccd-project-planning.md` の図を上→下にする。線の交差が増えて読みにくくなる場合は、クラスの宣言や関連の順番を並べ替えて整える。クラス・関連・多重度・役割名の中身は変えない。
- 変えた図を文書サイト（`npm run docs:build` の生成物か `npm run docs:dev`）で描き、上→下で描けていること、線の交差や重なりで読めない箇所がないことを確かめ、確かめ方と結果を個票の対応結果に書く。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run docs:build` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------- | ---- | ---- | ---- |
| 1   | rulebook に向きの決まりを足す                        | BA   | open | -    |
| 2   | ccd-sample と ccd-project-planning の図を上→下にする | BA   | open | -    |
| 3   | 文書サイトで描いて確かめ、結果を書く                 | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:ccd-mermaid-rulebook]]
- [[specdojo:ccd-sample]]
