---
specdojo:
  id: prj-0001:pjr-pejq-cdsd-execution-rework-deferred-stores
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T12:21:53Z"
  commit_type: docs
  commit_scope: cdsd
  approach: fully-guided
  targets:
    - cdsd-execution
---

# PJR-PEJQ cdsd-execution を grade の指摘で手直しする（後回しの 4 つのデータストア）

## 1. 概要

最新の grade の指摘を取り込み、4 つのデータストアと検証の基準を書く

## 2. 入力

- T-BUSINESS-SPECS-KATA-2-cdsd-execution-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 65 点で完了条件 0/3
- 主な指摘: 実行状態・plan と result・evidence・worktree の 4 つのデータストアが `_TODO_` のまま。技術的な制約と正本・派生の区別、検証の合否の基準がない
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/cdsd-execution.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 実行状態・plan と result・evidence・worktree の 4 つのデータストアについて、役割・内容・正本と派生の区別・技術的な制約・検証の合否の基準を書いている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の後）: `docs/ja/projects/prj-0001/execution/grade/results/cdsd-execution.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target deliverable`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                 |
| --- | ------------------------------------------------------ | ---- | ---- | ---------------------------------------------------- |
| 1   | 最新の grade の指摘を取り込んで直す                    | ARC  | done | executor が実施（対応結果を参照）                    |
| 2   | grade し直して結果を書く                               | ARC  | done | 2026-11-16 orchestrator が grade（needs-work 90 点） |
| 3   | 2026-11-16 の再 grade の指摘を取り込んで直す（次の回） | ARC  | open | 0.8.0 の後に流す                                     |
| 4   | 直した後に grade し直して結果を書く（次の回）          | ARC  | open | orchestrator が流す                                  |

## 5. 対応結果

- 実施内容: [[prj-0001:cdsd-execution]] に実行状態・実行 plan・実行 result・実行 evidence・task worktree を加え、10 単位の役割・内容・粒度、正本と派生の区別、技術的な制約、訂正・不整合時の扱い、検証の合否の基準を書いた。rulebook の必須章「関連仕様と検証」と条件付き章「確認事項と変更影響」を補い、`_TODO_` を解消した。`status` は `draft` のまま。
- 決めた点 1: plan と result は作成者と書き換えの制約が違うため、別のデータストアに分けた。
- 決めた点 2: 着手・完了の判定に使う実行状態は本書、生成済みの state・Ready の一式は [[prj-0001:cdsd-sharing]] の計画派生情報として分担し、重複させなかった。実装が判定時に実行 event から状態を作り直す動作に合わせた。
- 決めた点 3: 「運用担当」「実行担当」は OPS、「task owner」は Schedule・登録簿で割り当てた owner Role、「Job owner」は Job Definition に書いた owner とし、書かれていなければ PM が受ける。
- 決めた点 4: routine 実行状態の物理名は日本語の業務名へ置き換え、`physicalName` 列は足さなかった。
- 残課題: 業務データ辞書 7 件（`bdd-exec-event` ほか）が未作成で、項目の業務的な意味はまだ確定していない。辞書ができたら BA・ARC が本書と照合する（本書の「確認事項と変更影響」で追跡）。`grade run --target deliverable` による grade のやり直しは agent CLI を起動するため、人が行い、結果をここへ書き足す。

再 grade の結果（2026-11-16、orchestrator が `grade run --target deliverable` で実行）:

- 判定は needs-work、90 点（前回は 65 点・指摘 24 件）。指摘は 6 件（major 2・minor 4）。
- 完了条件の判定は 3 件中 3 件を満たす（すべて満たす）。
- major の指摘:
  - F005（vp-qe-omissions-consistency）: この追加専用のリカバリ指示を、すべての不正なイベントを拒否している49行目と照合してください。修正的なトランジションを追加しても不正なファイルは残ったままなので、検証と再構築は依然として失敗します。正しいが不適切なイベントと不正なファイルを区別し、承認されたリカバリの参照先、または明示的な未解決のリカバリゲートを定義してください。
  - F006（vp-ops-operability）: Replace the malformed-event recovery route with an approved procedure or explicit escalation-and-hold condition: src/exec/core.ts loadValidatedExecState rejects validation failures before state-changing commands can proceed, and src/exec/events.ts readAllEventFiles continues rejecting the original malformed file even after another event is appended.
- 結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/cdsd-execution.yaml`。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
