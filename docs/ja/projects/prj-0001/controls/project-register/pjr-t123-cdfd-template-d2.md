---
specdojo:
  id: prj-0001:pjr-t123-cdfd-template-d2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-15T14:35:45Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-PMK6
  commit_type: docs
  commit_scope: kata
  approach: template-maintenance
  targets:
    - specdojo:cdfd-template
---

# PJR-T123 cdfd-template の図の枠を D2 にする

## 1. 概要

Mermaid のまま残る図の枠を、overview・uc の template と同じ D2 にそろえる

## 2. 入力

- cdfd-overview-template・cdfd-uc-template は D2 の図の枠を持つが、cdfd-template は Mermaid の枠のまま残っている（2026-11-15）
- 図の枠を [[specdojo:cdfd-d2-rulebook]] と overview・uc の template にならって D2 にする。全体概要が Mermaid を宣言した場合の扱いは cdfd-rulebook の記法の選択の規定に合わせて書く
- 0.8.0（PJR-PMK6）で型を極力最新にする方針に含める（2026-11-15、利用者が承認）
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdfd-template.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）。配る型のため、同じ日に orchestrator が 0.8.0 の前へ前倒しした（利用者が 0.8.0 に足す todo の選定と実行を依頼）

## 3. 完了条件

- `cdfd-template` の図の枠が D2 で、`cdfd-overview-template`・`cdfd-uc-template` と同じ形にそろっている。
- 全体概要が Mermaid を宣言した場合の扱いが、cdfd-rulebook の記法の選択の規定と合っている。
- `npm run lint:md`・`npm run lint:d2` と親の検証が通り、型の grade で確かめる。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の前に流す）: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdfd-template.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target kata`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                      |
| --- | ------------------------------------------------------ | ---- | ---- | --------------------------------------------------------- |
| 1   | cdfd-template の図の枠を D2 にする                     | BA   | done | executor が実施（対応結果を参照）                         |
| 2   | 2026-11-16 の再 grade の指摘を取り込んで直す（次の回） | BA   | done | executor が実施（対応結果を参照）                         |
| 3   | 直した後に grade し直して結果を書く（次の回）          | BA   | open | 再 grade は orchestrator が流すため executor は実施しない |

## 5. 対応結果

- [[specdojo:cdfd-template]] の「概念データフロー」の図の枠を、overview・uc の template と同じ classes 構成の D2 にした。全体概要の凡例が Mermaid を宣言した場合、記法を宣言しない場合、凡例がない場合は [[specdojo:cdfd-mermaid-rulebook]] に従う Mermaid へ置き換えるとコメントに書いた。
- 図の直後の注記の _TODO_ を、共通凡例がある場合はその参照、ない場合は `specdojo:cdfd-mermaid-rulebook` の既定凡例に従うと分けて書けるようにした（grade の F001・F002）。
- 残課題: [[specdojo:cdfd-rulebook]] の「プロセス領域」は各節を表だけにすると定めているが、template の各節には主要入力・主要出力・データストアの箇条書きが残っている。本タスクの範囲外のため、別の項目で直すかどうかを判断する。

再 grade の結果（2026-11-16、orchestrator が実行）: cdfd-template は needs-work 94 点。結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/` の `specdojo.cdfd-template.yaml`。

次の回（2026-11-16 の再 grade の指摘の取り込み）:

- F002（major）: 「プロセス領域」の各節から領域の要約の _TODO_ と主要入力・主要出力・データストアの箇条書きを削り、表だけにした。章の冒頭は受け渡しの正本を概念データフローとする書き方にし、単一領域グループで 3.1 に全領域を書くという指示を、各領域を一つの節とする規定に合わせて節の削除だけにした。前の回の残課題もこれで解消した。
- F002（major）・F001（minor）: 導入部は全体概要のどのグループを詳細化するかの一文だけにし、利用者と用途は「目的」の 1〜2 文に一本化した。「適用範囲」は対象と対象外の 1 行ずつにし、状態遷移の STSD と責任分担の全体概要参照は対象外の行へまとめた。
- 再 grade（`grade run --target kata`）は orchestrator が流すため、作業内容の 3 行目は open のまま残した。

## 6. 関連ドキュメント

- [[specdojo:cdfd-d2-rulebook]]
- [[prj-0001:pjr-pmk6-release-v0-8-0]]
