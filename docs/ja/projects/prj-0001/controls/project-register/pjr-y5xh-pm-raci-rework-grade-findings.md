---
specdojo:
  id: prj-0001:pjr-y5xh-pm-raci-rework-grade-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: PM
  registered_at: "2026-11-15T12:32:27Z"
  commit_type: docs
  commit_scope: pm
  approach: fully-guided
  targets:
    - prj-0001:pm-raci
---

# PJR-Y5XH pm-raci を grade の指摘で手直しする（project-kata の 140 の差し戻し）

## 1. 概要

pm-raci を最新の grade の指摘で直す

## 2. 入力

- T-PROJECT-KATA-pm-raci-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43 の 1.4 の D）。2026-11-15 の grade で完了条件を満たしていない
- 最新の grade の未充足の完了条件と major の指摘を取り込む。本文は status: ready のまま差し戻したため、直す間の status の扱いも決める

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く。
- 本文はすでに `status: ready` のため、直す間に `draft` へ戻すか、`ready` のまま直すかを決め、理由を対応結果に書く（確定は人が 140 で行う）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ |
| --- | ----------------------------------- | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込んで直す | PM   | open | -    |
| 2   | grade し直して結果を書く            | PM   | open | -    |

## 5. 対応結果

- 実施内容: [[prj-0001:pm-raci|RACI]] を 2026-11-15 の grade の指摘 F001〜F020 で直した。
  - Launch Track Strategy を独立行「Launch スケジュール戦略定義（`sch-strategy-launch`）」に分け、`ARC=R`・`PM=A` とした。grade の指摘にある Schedule の `owner=ARC` を正とし、`PM` は進捗管理の観点で承認する（F006・F010・F014・F018）。
  - 「成果物作成」を「成果物作成フローの運営（着手順、割り当て、滞留）」に限定して `PM=A/R` とし、内容承認と作成の主担当は成果物別 RACI の各行に残すと注記した（F001・F008・F011・F012・F016）。
  - 成果物カタログの複数 `R` に作業別の主担当（選定・`overview`・`done_criteria` は `BA`、`depends_on`・rulebook・配置は `ARC`）を注記した（F002・F013・F015）。
  - 対象外の範囲（CLI・schema・生成・検証の実装、公開準備）と扱う行を適用方針に書いた（F005）。
  - 進捗・課題・リスク・変更要求・決定の記録先、品質ゲートの `A` の範囲と `PO` の受入・公開判断の区別を注記した（F004・F019）。
  - Schedule の `owner` を標準の「Schedule への担当展開」の優先順に合わせ、照合先の正本、不一致時の調査担当と修正先、未決時の登録を書いた（F007・F017・F020）。
  - 見直し時に影響する行・未完了タスク・依存・承認ゲート、追従する正本と担当、未決時の登録を手順にした（F003・F009）。
- `status` の扱い: `ready` のまま直した。修正は指摘箇所に閉じた加筆・行の分割であり、`ready` への昇格は人だけが行うため、`draft` へ戻すと 140 で再昇格の手間が増える。確定は人が 140 で行う。
- 迷った点: 成果物カタログの作業別の主担当と、Launch スケジュール戦略定義の `A` を `PM` とした点は、組織定義の責任領域（計画・調整は `PM`、文書体系は `ARC`）から executor が決めた。DEV・UX は旧「成果物作成」行でのみ `R` だったため、実装・体験の成果物を計画した時点で行を足す。
- 残課題: `grade run --target deliverable` での再 grade は agent CLI を使うため executor の sandbox では実行していない。人またはオーケストレーターが再 grade し、結果をここに追記する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
