---
specdojo:
  id: prj-0001:pjr-r1fb-completion-record-destination
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-24T22:28:40Z"
  due_on: "2026-10-31"
---

# PJR-R1FB orchestrator が register の完了条件で executor の記録の書き先を誤る

## 1. 課題内容

orchestrator の指示文は、完了条件で「result に書く」と指示させる。一方、executor/reporter の pipeline では executor の記録は result の申し送りに届かず、条件が果たせない。書き先の指示・close の確かめ方・報告の形式・plan の雛形を直す。

- 指示文（`.claude/agents/specdojo-orchestrator.md`）の該当箇所は次の3か所である。
  - 「完了条件の書き方」の「保護された設定に触れる場合は、案を result に書き…」
  - 同じ章の「…executor に決めさせて理由を result に書かせるかを明記する」
  - 止まったときの対処の「完了条件で『案を result に書く』と指示し…」
- register の plan の雛形（`xep-register-template.md`）は、executor に「個票の作業内容・対応結果セクションを実施内容で更新する」と指示している。
- result の申し送りは reporter が executor の報告から書く。その報告（`src/exec/evidence.ts` の `final_message`・`validations`・`target_coverage`）には、申し送りの専用の欄がない。
- 利用者の project（coderdojo-lessons-specdojo の prj-0001）で起きたこと:
  - orchestrator が、完了条件に「判断できない点を result の申し送りに書く」と書いた。
  - 3件（PJR-BR5A・PJR-0BVZ・PJR-DVMM）とも、result の申し送りには書かれなかった。
  - BR5A と DVMM では、executor が個票の対応結果に書いていた。orchestrator は result だけを見て、BR5A を未達と判定した。

## 2. 影響範囲

| 観点         | 影響                                                                     |
| ------------ | ------------------------------------------------------------------------ |
| スコープ     | register の項目を pipeline で流すときの、完了条件の書き方と close の判定 |
| スケジュール | 果たせない条件のために、差し戻しや流し直しを検討する手間が生じる         |
| コスト       | 未達の判定の調査と、close の対応結果の書き直し                           |
| 品質         | 書かれている記録を見落として未達とし、close の記録が実態と食い違う       |
| 関係者       | 対話型オーケストレーターを使う利用者                                     |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | 指示文の完了条件の書き方が、executor が result を書けない pipeline の実行を想定していない。報告の形式にも申し送りの欄がない                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 対応策   | 1. 指示文の「完了条件の書き方」と止まったときの対処の3か所で、書き先を実行の仕組みに合わせる。register の項目では「個票の対応結果に書く」とし、「result に書く」は executor が result を書ける実行の形に限る。<br>2. 指示文の close の前の確かめ方に「完了条件の記録は、個票の対応結果と result の両方を見る」と加える。<br>3. executor の報告の形式に `handoff`（申し送り）の欄を加え、reporter が result の申し送りに載せる。<br>4. register の plan の雛形に「個票の完了条件が result への記載を求める場合は、個票の対応結果と報告の `handoff` に書く」と加える |
| 依存事項 | 1・2 は指示文の SSOT を直し、各 provider の版へ同期する                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 完了条件 | 1〜4 が入っている。3 で、executor の `handoff` が result の申し送りに載ることを確かめる test がある                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

### 追記（2026-10-25、利用者が承認）

- v0.4.6 の範囲とする。上の表の対応策 1〜4 を満たす。
- 対応策 1・2（オーケストレーターの本文の「完了条件の書き方」・止まったときの対処・close の前の確かめ方）は、本文の正本 `.agents/specdojo-orchestrator.agent.md` が保護された設定のため、executor は直す文の案を result と個票の対応結果に書く。反映と 10 か所の写しへの同期はオーケストレーターが行う。
- 対応策 3・4（executor の報告の形式に申し送りの欄を足し、reporter がそれを result の申し送りに載せる。register の plan の雛形の書き先の指示を合わせる）は executor が実装する。報告の形式を変えるときは、既存の executor の報告（欄がないもの）もそのまま受け付ける。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）の PJR-BR5A・PJR-0BVZ・PJR-DVMM
