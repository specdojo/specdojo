---
specdojo:
  id: prj-0001:pjr-756e-cdfd-d2-layout-samples
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-28T14:00:03Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-PYS2
    - PJR-DM1N
---

# PJR-756E CDFD の D2 の記法と 3 つの sample を、囲み・担当のレーン・時系列で描き直す

## 1. 概要

PJR-DM1N の決定に沿って cdfd-d2-rulebook に図の種類ごとの描き方を足し、cdfd-overview-sample・cdfd-sample・cdfd-uc-sample の図を描き直す

## 2. 入力

- PJR-DM1N で、全体概要は業務のまとまりの囲み、プロセスグループ別は担当ごとのレーンと受け渡しの番号、ユースケース別は `sequence_diagram` で描くと決めた（indie、2026-11-28）
- まず型の sample から直す。製品の CDFD は sample の形が決まってから PJR-T1D1 でそろえる（indie、2026-11-28）
- 担当 BA・期限 2026-12-31 は indie の指示（2026-11-28）

## 3. 完了条件

- PJR-DM1N の決定に沿って、`cdfd-d2-rulebook` に図の種類ごとの描き方を足す。
  - 全体概要: 業務のまとまりごとにコンテナで代表ノードを囲む。全体概要でグループを囲むことの禁止は、まとまりの囲みに限って外す（グループ自体をコンテナで表すことは引き続き禁じる）。
  - プロセスグループ別: 担当（人・システム・外部主体）ごとに一番外のコンテナでレーンを作り、プロセスを担当のレーンに置く。受け渡しのラベルの先頭に手順の番号（「1.」「2.」）を付ける。
  - ユースケース別: D2 の `shape: sequence_diagram` で、参加する単位を縦の線に、受け渡しを上から順の矢印で描く。開始と終了の出来事の表し方を決めて書く。
  - 決まりに合わせ、レーンの順・番号の付け方・凡例の書き方と、禁止事項の表を直す。
- 主の CDFD の rulebook（`cdfd-overview-rulebook`・`cdfd-rulebook`・`cdfd-uc-rulebook`）で、図の描き方に触れる記述があれば、`cdfd-d2-rulebook` と食い違わないように直す。
- 3 つの sample（`cdfd-overview-sample`・`cdfd-sample`・`cdfd-uc-sample`）の D2 の図を、上の描き方で描き直す。業務の中身（駄菓子屋の文脈、プロセス・イベント・データストア・受け渡しの ID と表）は変えず、図だけを直す。表と図の対応は保つ。
- `npm run lint:d2` と `npm run -s lint:md` を通し、親の検証を通す。
- 文書サイトで 3 つの図を見て、indie が読みやすさを確かめてから close する。直す点が出たら、この todo の完了条件に回目として足す。
- `cdfd-mermaid-rulebook` と製品の CDFD は変えない（製品は PJR-T1D1 でそろえる）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                                | 担当  | 状態 | メモ |
| --- | ------------------------------------------------------------------- | ----- | ---- | ---- |
| 1   | `cdfd-d2-rulebook` に図の種類ごとの描き方を足し、禁止事項の表を直す | BA    | open | -    |
| 2   | 主の CDFD の rulebook 3 つで、図の描き方の記述の食い違いを直す      | BA    | open | -    |
| 3   | 3 つの sample の D2 の図を描き直す（業務の中身・ID・表は変えない）  | BA    | open | -    |
| 4   | `lint:d2`・`lint:md` と親の検証を通す                               | BA    | open | -    |
| 5   | 文書サイトで 3 つの図を indie が確かめる                            | indie | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-dm1n-cdfd-diagram-layout|PJR-DM1N]] CDFD の図の描き方の決定（根拠）
- [[prj-0001:pjr-pys2-kata-wave-6-notation|PJR-PYS2]] 親の項目
- [[prj-0001:pjr-t1d1-cdfd-concise-documents|PJR-T1D1]] 製品の CDFD をそろえる後続
- [[specdojo:cdfd-d2-rulebook]]
- [[specdojo:cdfd-overview-sample]]
- [[specdojo:cdfd-sample]]
- [[specdojo:cdfd-uc-sample]]
