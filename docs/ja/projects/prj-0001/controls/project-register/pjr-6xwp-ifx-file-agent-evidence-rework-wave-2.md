---
specdojo:
  id: prj-0001:pjr-6xwp-ifx-file-agent-evidence-rework-wave-2
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
  registered_at: "2026-11-15T12:22:25Z"
  commit_type: docs
  commit_scope: ifx-file
  approach: fully-guided
  targets:
    - ifx-file-agent-evidence
---

# PJR-6XWP ifx-file-agent-evidence を grade の指摘で手直しする（kata-wave-2 の 2 回目）

## 1. 概要

ifx-file-agent-evidence を最新の grade の指摘で直す

## 2. 入力

- T-KATA-WAVE-2-ifx-file-agent-evidence-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）
- 最新の grade の未充足の完了条件と major の指摘を取り込み、本文の未決の目印を片付ける（決められないものは留保として追跡先をつなぐ）
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.ifx-file-agent-evidence.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 欠けた・壊れた evidence・pipeline-state を扱うテストの設計（観点と期待結果）を書いている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の後）: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.ifx-file-agent-evidence.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target deliverable`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                 |
| --- | ------------------------------------------------------ | ---- | ---- | ---------------------------------------------------- |
| 1   | 最新の grade の指摘を取り込んで直す                    | ARC  | done | executor が実施（対応結果を参照）                    |
| 2   | grade し直して結果を書く                               | ARC  | done | 2026-11-16 orchestrator が grade（needs-work 89 点） |
| 3   | 2026-11-16 の再 grade の指摘を取り込んで直す（次の回） | ARC  | open | 0.8.0 の後に流す                                     |
| 4   | 直した後に grade し直して結果を書く（次の回）          | ARC  | open | orchestrator が流す                                  |

## 5. 対応結果

- 実施内容: [[prj-0001:ifx-file-agent-evidence]] を grade の指摘（F001〜F015）で手直しした。先頭の前提コメントは成果物カタログの `overview` と一致するため確定させ、`_ASSUMPTION_` を外した。報告タグ欠落時のフォールバックは、実装（`src/exec/evidence.ts`）に合わせて「`completion_status` を記録しない」へ直し、正規の complete 報告との区別と成功扱いの条件を加えた。`schema.change_impact`、テスト設計（`verification`、TC-01〜TC-12）、未決事項（`open_decisions`、OD-01・OD-02）を追加した。`status` は `draft` のまま変えていない。
- executor が決めたこと:
  - 通知の文言・出力先（OD-01）: `evidence.ts`・`pipeline-state.ts` の読込処理は通知を出さず、「checkpoint なし」を返すだけである。通知は宣言された実装の範囲外の呼び出し側 CLI が持つため、断定せずに留保とした。追跡先は PJR-TN43、期限は T-KATA-WAVE-2-ifx-file-agent-evidence-140 の判断時とした。
  - `pipeline-state.json` 破損時の停止（OD-02）: 再開用読込は破損時も「checkpoint なし」として返すため、仕様の「直ちに停止」と食い違う可能性がある。承認根拠がないため意図された仕様を残し、照合を留保とした。
- 再 grade: executor の段では実行していない。`grade run --target deliverable` の実行と結果の記入は、この後の段に申し送る。
- 残課題: OD-01・OD-02（PJR-TN43 で追跡する）。

再 grade の結果（2026-11-16、orchestrator が実行）: needs-work 89 点。結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/` の `prj-0001.ifx-file-agent-evidence.yaml`。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
