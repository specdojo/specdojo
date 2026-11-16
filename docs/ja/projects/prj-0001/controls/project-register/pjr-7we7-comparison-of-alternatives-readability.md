---
specdojo:
  id: prj-0001:pjr-7we7-comparison-of-alternatives-readability
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-16T22:27:26Z"
  derived_from:
    - PJR-CPZH
  commit_type: docs
  commit_scope: pm
  approach: fully-guided
  targets:
    - prj-0001:prj-comparison-of-alternatives
---

# PJR-7WE7 prj-comparison-of-alternatives を読みやすい構成に見直す

## 1. 概要

結論を先に置き、判定の区分と根拠の表を絞って、3 回の手直しで膨らんだ代替案比較を読みやすくする

## 2. 入力

- 利用者が 2026-11-17 に、CPZH の対象の代替案比較は grade の結果以前に内容が分かりにくいと指摘した。grade の指摘への手直しとは目的が違うため、CPZH を close して別の todo で見直すことを選んだ（案 A）
- 3 回の手直しで本文は 27KB から 75KB に増えた。sample は 20KB である。grade の指摘に応えて表の列や規則を足し、削らなかったためである
- orchestrator が示した改善案 7 点（結論の要約を冒頭に置く、判定の区分を 4 つに絞る、集約の規則を短くする、根拠の表を sample と同じ案ごとの形にする、採らない案のセルは判定しない、記録の担当の重複を除く、rulebook が許せば尺度を有利・中間・不利にする）を利用者が了承した
- 各決定の結論（D-01〜D-03 の採否）は変えない

## 3. 完了条件

- [[prj-0001:prj-comparison-of-alternatives|代替案比較]] の先頭（「比較目的と前提条件」の前）に、D-01〜D-03 ごとに採るもの・併用または試行するもの・採らないものをまとめた結論の要約の表がある。
- 判定の区分は [[specdojo:prj-comparison-of-alternatives-rulebook|rulebook]] の例示（採択・一部採択・比較試行・保留・非採択）の範囲で 5 つ以内に絞り、意味を凡例として 1 か所に書いている。
- 「判定の根拠と集約規則」は 5 項目以内の短い箇条にしている。D-01 の重みは使わず、総合評価を決める軸（効果・追跡性・AI 適合）を明記する。
- 比較結果の根拠の表は sample と同じく案ごとに 1 行とし、判定の理由と再評価の条件をそれぞれ 2 文以内で書いている。High・Middle・Low ごとに列を分けない。
- 担当と記録先の記載は、同じ内容を複数の章に書いていない（rulebook の「同じ採否理由や見直し条件を複数箇所へ転載しない」）。
- 各決定の結論（D-01〜D-03 の各案の採否）を変えていない。
- 本文は 30KB 以下である（`wc -c` で確かめ、値を対応結果に書く）。
- 次の点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
  - 採らない案のセルの扱い（rulebook の「同一レイヤー内では全候補に同じ軸」との整合）
  - 尺度の表記（High・Middle・Low を残すか、有利・中間・不利にするか）
  - 直す間の `status` の扱い（確定は人が 140 で行う）
- 再 grade（`grade run --target deliverable`）は orchestrator が流すため、executor は作業内容のその行を open のまま残す。再 grade ではカタログの完了条件 4 件を満たすことを確かめる。完了条件の外の観点の指摘は対応結果に記録するだけでよく、それに合わせて本文を足さない。
- `CHANGELOG.md` は変えない。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ |
| --- | ------------------------------------------ | ---- | ---- | ---- |
| 1   | 結論の要約・凡例・集約規則を書き直す       | 未定 | open | -    |
| 2   | 根拠の表を案ごとの形にし、重複の記載を除く | 未定 | open | -    |
| 3   | 大きさと結論の不変を確かめ、対応結果に書く | 未定 | open | -    |
| 4   | 再 grade して結果を書く（orchestrator）    | 未定 | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-cpzh-prj-comparison-of-alternatives-rework-grade-findings]]
- [[prj-0001:pjr-0t83-grade-rework-bloats-documents]]
