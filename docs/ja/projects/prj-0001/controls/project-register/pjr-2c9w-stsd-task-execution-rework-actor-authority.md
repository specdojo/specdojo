---
specdojo:
  id: prj-0001:pjr-2c9w-stsd-task-execution-rework-actor-authority
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T12:22:46Z"
  completed_at: "2026-11-16T14:54:09Z"
  conclusion: stsd-task-execution を grade の指摘で直し、再 grade で pass（96 点、完了条件 5/5）になった。成果物の確定は人の 140 で行う
  depends_on:
    - PJR-M495
    - PJR-T4G3
  commit_type: docs
  commit_scope: stsd
  approach: fully-guided
  targets:
    - prj-0001:stsd-task-execution
---

# PJR-2C9W stsd-task-execution を grade の指摘で手直しする（担当者の権限と引き継ぎ、記録の再生の順序）

## 1. 概要

最新の grade の指摘と M495・T4G3 の結果を取り込み、権限と引き継ぎ、再生の順序の規則を定める

## 2. 入力

- T-BUSINESS-SPECS-KATA-2-stsd-task-execution-140 と T-STSD-PILOT-stsd-task-execution-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 79 点で完了条件 0/5
- 主な指摘: 補足の記録や再開で actor が替わるときの権限、claim の持ち主と最新の記録者のどちらに権限があるか、同じ時刻の記録の再生の順序が定まっていない。PJR-M495・T4G3 の結果を取り込む
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.stsd-task-execution.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 担当者の権限と引き継ぎ（補足の記録や再開で actor が替わるとき）、claim の持ち主と最新の記録者のどちらに権限があるか、同じ時刻の記録の再生の順序を、PJR-M495・T4G3 の実装の結果に合わせて定めている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の後）: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.stsd-task-execution.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target deliverable`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                 |
| --- | ------------------------------------------------------ | ---- | ---- | ---------------------------------------------------- |
| 1   | 最新の grade の指摘を取り込んで直す                    | ARC  | done | executor が実施（対応結果を参照）                    |
| 2   | grade し直して結果を書く                               | ARC  | done | 2026-11-16 orchestrator が grade（needs-work 92 点） |
| 3   | 2026-11-16 の再 grade の指摘を取り込んで直す（次の回） | ARC  | done | executor が実施（対応結果を参照）                    |
| 4   | 直した後に grade し直して結果を書く（次の回）          | ARC  | done | 2026-11-16 の 2 回目の再 grade で pass               |

## 5. 対応結果

### 5.1. 実施内容

- [[prj-0001:stsd-task-execution]] の「状態の判定」に、担当アクター（claim の持ち主）を最新イベントの記録者と分けて定義した。`claim` で決まり、`note`・`link`・`estimate`・`block`・引き取りを指定しない `unblock` では変わらず、人間が引き取りを指定した `unblock` だけで移り、`todo`・`done`・`cancelled` でなくなる（PJR-M495 の `claimed_by`）。
- 同じ時刻の記録の再生の順序を、種類の既定順、記録ファイルのパス順、状態から成立する記録の順の選択として定めた（実装の `readAllEventFiles`・`orderSameTimestampEventsByState`）。
- 「状態遷移」の共通条件で、`T-06`・`T-07`（`T-09`〜`T-12` も同じ）の操作権限を担当アクターとの照合に定め、runner が段のアクターに依らず担当アクターとして完了・中断を記録し、中断に両方のアクターを残すことを書いた（PJR-T4G3）。`T-05`・`T-08` の補足を合わせた。
- 互換の扱いに、過去のイベントにも同じ規則を当てること、担当アクターを持たない旧形式の集約状態は最新の記録者で読むことを足した。
- 「今後の検討メモ」を復元し、上流辞書との照合（BA、辞書の作成時）と、権限の規則の業務承認（PO、140）を留保として残した。

### 5.2. 決めたこと

- 権限は最新の記録者ではなく claim の持ち主にあるとした。PJR-M495・T4G3 で統合済みの実装の現在動作であり、補足の記録や人の再開で権限が移る不具合を直した結果のため。
- 同時刻の並びの選択の補助は直前の記録者のままとした。PJR-M495 が既存の順序づけへの影響を避けて変えなかったため。
- grade の指摘のうち、検証手順の参照（F011）と実装関数への案内（F008・F015 の一部）は本文へ足さなかった。rulebook は STSD に検証手順の章を求めず、関数を業務の記述として載せることを禁じるため。並びの規則は業務の言葉で本文に書いた。
- 成果物の `status` は `draft` のまま据え置いた。

### 5.3. 残課題

- 直した後の `grade run --target deliverable` は executor の sandbox では実行していない。runner または orchestrator が grade し直し、結果をここに追記する。
- 上流 `bdd-exec-state`・`bdd-exec-event` との照合（BA）と、権限の規則の承認（PO、140）は本文の留保のとおり。

再 grade の結果（2026-11-16、orchestrator が `grade run --target deliverable` で実行）:

- 判定は needs-work、92 点（前回は 79 点・指摘 16 件）。指摘は 7 件（major 1・minor 6）。
- 完了条件の判定は 5 件中 5 件を満たす（すべて満たす）。
- major の指摘:
  - F007（vp-qe-config-validity）: 未解決の _TODO_ / _ASSUMPTION_ が残っています。
- 結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.stsd-task-execution.yaml`。

### 5.4. 次の回の実施内容（2026-11-16 の再 grade の指摘）

- F007（major）: 上流辞書の照合の `_TODO_` を、食い違うときにどちらを正とするかの決定（BA が照合、PO が決定、期限は辞書の作成時または本書の確定（140））として `_UNDECIDED_` に改め、追跡を [[prj-0001:pjr-tn43-user-decisions-pending]] につないだ。統合済みの実装（PJR-M495・T4G3）に合わせた名称を現在の根拠とし、調べて埋められる不足は残っていないと判断したため。本文の `_TODO_`・`_ASSUMPTION_` はなくなった。
- F002・F003・F005: 同時刻の再生順序を「状態の判定」の独立した項目に移し、状態ごとに成立するイベント、競合する着手（同じ秒に解放・中断したアクターの着手を先に、自動の実行の再開に伴う着手を後に採る）、実行中からの記録（直前の記録者の記録を先に、`block`・`unblock` の後に `complete`）と、期待する順序の例 2 件を書いた。並べ方の正本は `src/exec/events.ts` のイベント記録の読み込みとし、関数名は載せなかった（rulebook が関数実行を業務の記述として載せることを禁じるため）。
- F001・F006: 権限の規則の承認に、PO が 140 で決めることに加え、BA・QE・DEV の事前の確認を書いた。`ready` への昇格は 2 件の留保の決定と 140 の人間の承認の後とし、本タスクの完了が確定を意味しないことを書いた。
- F004: 検証手順（テストのファイル・検査）の参照は足さなかった。rulebook は STSD に検証の章を求めず、テストのファイルは本タスクで参照を宣言された資料にないため。
- 成果物の `status` は `draft` のまま据え置いた。再 grade は作業内容の 4 の行のとおり orchestrator が流す。

2 回目の再 grade の結果（2026-11-16、orchestrator が `grade run --target deliverable --by sol-review-executor` で実行）: pass、96 点。指摘は 4 件（すべて minor）。完了条件は 5 件中 5 件を満たす。結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.stsd-task-execution.yaml`。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
