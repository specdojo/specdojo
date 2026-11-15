---
specdojo:
  id: prj-0001:pjr-w63q-bac-task-completion-design-reference
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-15T12:21:57Z"
  commit_type: docs
  commit_scope: bac
  approach: fully-guided
  targets:
    - bac-task-completion
---

# PJR-W63Q bac-task-completion に、受入の条件を満たす設計の参照を足す

## 1. 概要

evidence_refs の実装と設計の文書を参照に足し、未決の目印を片付ける

## 2. 入力

- T-KATA-WAVE-2-bac-task-completion-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 95 点で完了条件 3/4、型は pass
- 主な指摘: 受入の条件を実装で満たせることを確かめる設計の参照がない（DC-003、ARC）。本文に未決の目印が 2 か所ある

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 受入の条件ごとに、それを満たす実装と設計の文書（evidence_refs の実装、cdsd・stsd など）への参照があり、ARC が満たせることを確かめられる。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ |
| --- | ----------------------------------- | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込んで直す | BA   | open | -    |
| 2   | grade し直して結果を書く            | BA   | open | -    |

## 5. 対応結果

- 実施内容: [[bac-task-completion]] の「受入条件」の共通前提の後に、シナリオ ID ごとの実装（`evidence_refs` の `src/grade/grade.ts`・`src/exec/run/run.ts`）と設計の文書（`stsd-task-execution`・`stsd-register-entry`・`stsd-deliverable`・`cdsd-execution`）、ARC の確認状況の対応表を足した（F002・DC-003）。「メモ / 将来課題」の `_TODO_` 2 件を期限付きの留保に改め、追跡先の列を足し、設計の確認待ちの条件を留保として追加した（F001・F003・F004）。`status` は `draft` のまま。
- 決めたこと: 対応表はシナリオごとの節に分散させず、共通前提の後に 1 つの表で置いた（同じ参照の繰り返しを避けるため）。実装の参照は `evidence_refs` の範囲に限り、範囲外の実装（PJR-M18B の対応）は確認済みと扱わず「確認待ち」とした。評価結果を扱う cdsd・stsd がないため、BAC-01〜04・08 は「評価結果の設計の文書なし」と明記した。代表試行と費用の上限は本書で決められないため、140 の確定時に PO が留保の可否を判断する前提で PJR-TN43 の kata-wave-2 の行を追跡先にした。
- 残課題: 「確認待ち」の条件は ARC が業務受入の試行の前に照合し、不足は BA が PM へ登録候補として渡す。`grade run --target deliverable` による再評価は executor の範囲外のため runner・orchestrator が行い、結果をここに追記する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
