---
specdojo:
  id: prj-0001:pjr-jfrx-bds-progress-report-rework-wave-2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: UX
  registered_at: "2026-11-15T12:22:06Z"
  commit_type: docs
  commit_scope: bds
  approach: fully-guided
  targets:
    - bds-progress-report
---

# PJR-JFRX bds-progress-report を grade の指摘で手直しする（kata-wave-2 の 2 回目）

## 1. 概要

bds-progress-report を最新の grade の指摘で直す

## 2. 入力

- T-KATA-WAVE-2-bds-progress-report-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）
- 最新の grade の未充足の完了条件と major の指摘を取り込み、本文の未決の目印を片付ける（決められないものは留保として追跡先をつなぐ）

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 報告の期間の終わりの境界（いつまでの記録を含めるか）を定め、PO が範囲を承認できる。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ                                                 |
| --- | ----------------------------------- | ---- | ---- | ---------------------------------------------------- |
| 1   | 最新の grade の指摘を取り込んで直す | UX   | done | executor が実施（対応結果を参照）                    |
| 2   | grade し直して結果を書く            | UX   | done | 2026-11-16 orchestrator が grade（needs-work 85 点） |

## 5. 対応結果

- 実施内容: grade の指摘 F001〜F016 を取り込み、`bds-progress-report` の未決の目印（`_ASSUMPTION_` 2 件・`_UNDECIDED_` 2 件）を本文の決定または「メモ / 将来課題」の留保へ置き換えた。`status` は `draft` のまま据え置いた。
- 決めたこと（executor の判断）:
  - 期間の終わりの境界: 期間は前週金曜 17 時から当週金曜 17 時（`Asia/Tokyo`）とし、始点を含み終点を含まない。名前は起動予定時刻が属する ISO 週とする。理由は、作成時点で期間内の記録が揃い、金曜夜と土日の記録は翌週の報告へ入るため、各記録が 1 件の報告にだけ入り作成後の補いが要らないからである。報告期間の確かめ方・期間への割り当て・終点前の手動作成の例外を合わせて直した。
  - ファイル名と期間: 日付に期間の終点の日付（当週金曜）を使い、再出力は連番を増やさず同じファイルを更新する案とした。正本は進捗報告の rulebook のため、採否は PM の判断として留保した。
  - 統合前の確認: 報告は AI Agent の判断を含むため、Job の `task.review` で統合前 review を宣言する案とした（`sysd-job-execution` の「起動と実行フロー」の方針による）。要否は PM の判断として留保した。
  - 「欠けるときの扱い」の停止は本書の要求として確定し、Job が失敗として記録するかの確認を留保へ移した。
  - 「登録簿の状態変化」の章の配置は進捗報告の rulebook の責務として留保へ移した。
  - Role code は初出で役割名を併記した。
- 留保（判断点は T-KATA-WAVE-2-bds-progress-report-140）: 「定期起動の有効化」「ファイル名と期間」「統合前の確認」「記録欠落時の停止」「登録簿の状態変化の配置」は PM が判断点までに登録簿へ起票して追跡する（未起票）。
- 再 grade: executor の段では `grade run --target deliverable` を実行していない（agent の起動を伴うため人が実行する）。結果は再 grade 後に追記する。

再 grade の結果（2026-11-16、orchestrator が `grade run --target deliverable` で実行）:

- 判定は needs-work、85 点（前回は 85 点・指摘 16 件）。指摘は 14 件（major 3・minor 11）。
- 完了条件の判定は 3 件中 3 件を満たす（すべて満たす）。
- major の指摘:
  - F005（vp-arc-cross-document-consistency）: Reconcile the promised post-cutoff update with src/job/job.ts:503 and src/exec/run/job.ts:896, which skip an already succeeded Run with the same period-based identity; document the required implementation change or a supported update mechanism.
  - F006（vp-dev-implementation-readiness）: 1期間につき1つのレポートを維持しつつ、カットオフ後に成功した早期のJob Runを意図的に再実行する方法を指定する。現在のランナーは完了したRunをスキップするため、示された更新ワークフローはこの指示だけでは実装できない。
  - F014（vp-ops-operability）: Provide a supported operator procedure for replacing a successfully generated early report after the cutoff; repeating exec run with the same period currently returns “Job Run already complete” without updating the report.
- 結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/bds-progress-report.yaml`。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
