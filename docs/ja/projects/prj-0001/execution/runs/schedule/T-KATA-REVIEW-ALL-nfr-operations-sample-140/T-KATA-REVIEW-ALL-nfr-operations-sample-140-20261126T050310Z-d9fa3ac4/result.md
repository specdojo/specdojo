---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-operations-sample-140-20261126t050310z-d9fa3ac4
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-operations-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-operations-sample-140/T-KATA-REVIEW-ALL-nfr-operations-sample-140-20261126T050310Z-d9fa3ac4/plan.md
  started_at: "2026-11-26T05:03:20.158Z"
  completed_at: "2026-11-26T05:10:00.198Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-operations-sample
    - specdojo:nfr-operations-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、sample の主張 14 件を schema と関連 sample（opd・opr・nfr-availability・prj-overview など）に突き合わせた。13 件は一致し、`opr-backup-restore-sample` の確認時刻だけが一部不一致だった。
- F002 を直した。`nfr-ops-003` の基準が `_UNDECIDED_` のままで pass / fail を判定できなかったため、暫定の基準 `_ASSUMPTION_`（月次で 95% 以上）を足した。表の前の 1 文と未達のときの扱いも、これに合わせてそろえた。
- F001・F004 は kata の段のレビューで使わない観点なので、この段では扱わなかった。F003 は rulebook 側の指摘なので、この段では直していない。
- 実行した検査は、prettier、markdownlint-cli2、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` で、すべて成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 3. 運用要件一覧・4. 測定・検証方法（`nfr-ops-003`） | 基準が `_UNDECIDED_`: ○○% のままで pass / fail を判定できない（F002） | 基準の欄に「暫定は `_ASSUMPTION_`: 月次で 95% 以上」を足した。表の前の 1 文を「値が決まるまで暫定の基準で判定する」にそろえた。未達のときの扱いは「失敗した日の原因を障害記録で確かめ、同じ原因が続けば `DEV` が直す」に変えた。 | `vp-qe-verifiability` | 要判断（95% は正本のない業務上の仮定） |
| R4-2 | R4 | 3. 運用要件一覧（F001・F004） | 未決事項の決定者と時期、ready 化の条件がないという指摘 | - | kata-guide の「kata の観点の組」では `vp-po-decision-readiness`・`vp-ops-release-readiness` を kata の段のレビューで使わないため、この段では直していない。 | - |
| R4-3 | R4 | rulebook 1. 全体方針（F003） | 「sample は本文要件の 5 章に揃っていない」という rulebook の記述が、5 章に揃った現在の sample と食い違う | `nfr-operations-rulebook.md` の `_UNDECIDED_` の行を「sample は本文要件の 5 章に揃った。同じ構成を NFR 分冊で共通の template にできるかの判断を ready の前提条件とする」に直す案。 | kata の相互整合は R5 の `vp-qe-kata-conformance` で扱う。 | - |
| R4-4 | R4 | 3. 運用要件一覧（`nfr-ops-004` の備考） | バックアップを確かめる時刻が、`opd-monitoring-sample` の 9:30 と `opr-backup-restore-sample` の開店前点検（9:45 から）で食い違う。sample 本文は 9:30 で `opd-monitoring-sample` と一致している。 | R5 で `opr-backup-restore-sample` 側を 9:30 に合わせるか判断する。 | `opd-monitoring-sample` の 46 行目は 9:30、`opr-backup-restore-sample` の 36 行目は 9:45 から | 要判断（どちらが正かは opd-index の定期運用で決まり、この段では確定できなかった） |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-operations-sample.md`: `nfr-ops-003` の基準に暫定の基準（`_ASSUMPTION_`: 月次で 95% 以上）を足した。表の前の 1 文を「値が決まるまで暫定の基準で判定する」にそろえた。未達のときの扱いは「失敗した日の原因を障害記録で確かめ、同じ原因が続けば `DEV` が直す」に変えた。3 行追加・3 行削除。

## 3. 申し送り

- R4-4 の `opd-monitoring-sample` と `opr-backup-restore-sample` の確認時刻の食い違いは、この段では確定できなかった。R5 で `opr-backup-restore-sample` 側を 9:30 に合わせるか判断する必要がある。
- 95% は正本のない業務上の仮定である。F002 で置いた暫定値で、暦月に失敗 1 日までを許す値として選んだ。決定期限だけを書く案は、決まるまで判定できないため採らなかった。
- F003 の rulebook 側の記述の更新案は、`nfr-operations-rulebook.md` の `_UNDECIDED_` の行を「sample は本文要件の 5 章に揃った。同じ構成を NFR 分冊で共通の template にできるかの判断を ready の前提条件とする」に直すものである。kata の相互整合は R5 の `vp-qe-kata-conformance` で扱う。
- R4-1: R4 / 3. 運用要件一覧・4. 測定・検証方法（`nfr-ops-003`）/ 基準が `_UNDECIDED_`: ○○% のままで pass / fail を判定できない（F002）/ 基準の欄に「暫定は `_ASSUMPTION_`: 月次で 95% 以上」を足し、表の前の 1 文を「値が決まるまで暫定の基準で判定する」にそろえ、未達のときの扱いを「失敗した日の原因を障害記録で確かめ、同じ原因が続けば `DEV` が直す」に変えた / `vp-qe-verifiability` / 要判断（95% は正本のない業務上の仮定で、暦月に失敗 1 日までを許す値として置いた。選ばなかった案は、暫定値を置かずに決定期限だけを書く案。期限だけでは決まるまで判定できないので採らなかった）
- R4-2: R4 / 3. 運用要件一覧（F001・F004）/ 未決事項の決定者と時期、ready 化の条件がないという指摘 / - / kata-guide の「kata の観点の組」で `vp-po-decision-readiness`・`vp-ops-release-readiness` は kata の段のレビューで使わない（kata の承認と ready 化は登録簿で追う）ため、この段では直していない / -
- R4-3: R4 / rulebook 1. 全体方針（F003）/ 「sample は本文要件の 5 章に揃っていない」が、5 章に揃った現在の sample と食い違う / - / 相手側 `docs/ja/specdojo/rulebooks/nfr-operations-rulebook.md` の `_UNDECIDED_` の行を「sample は本文要件の 5 章に揃った。同じ構成を NFR 分冊で共通の template にできるかの判断を ready の前提条件とする」に直す案。kata の相互整合は R5 の `vp-qe-kata-conformance` で扱う / -
- R4-4: R4 / 3. 運用要件一覧（`nfr-ops-004` の備考）/ バックアップを確かめる時刻が、opd-monitoring-sample の 9:30 と opr-backup-restore-sample の開店前点検（9:45 から）で食い違う。sample 本文は 9:30 で opd-monitoring と一致している / - / opd と opr の食い違いなので、R5 で opr-backup-restore-sample 側を 9:30 に合わせるか判断する案 / 要判断（どちらが正かは opd-index の定期運用で決まる。この段では確定できなかった）
- 確かめ-1: 主張: frontmatter の type `requirement`・`part_of`・`based_on` / 正本: docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml と rulebook の推奨 Frontmatter 項目 / 確かめ方: grep / 結果: 一致 / 根拠: schema の 8 行目に requirement がある
- 確かめ-2: 主張: 営業日の 90% 以上の記録の目標 / 正本: prj-overview-sample.md / 確かめ方: grep 90% / 結果: 一致 / 根拠: 78 行目「営業日の90%以上」
- 確かめ-3: 主張: ACD-A02（通信断の頻度が未確認）・ACD-D01（タブレット 1 台）/ 正本: prj-assumptions-constraints-dependencies-sample.md / 確かめ方: grep / 結果: 一致 / 根拠: 26 行目と 43 行目
- 確かめ-4: 主張: 監視の時間帯 10:00〜18:00、死活を 1 分ごとに確かめる（`_ASSUMPTION_`）、死活の通知はメール / 正本: opd-monitoring-sample.md / 確かめ方: 表の読み取り / 結果: 一致 / 根拠: 45 行目
- 確かめ-5: 主張: バックアップを開店 30 分前の 9:30 に確かめる / 正本: opd-monitoring-sample.md と opr-backup-restore-sample.md / 確かめ方: grep / 結果: 一部不一致 / 根拠: opd-monitoring の 46 行目は 9:30、opr-backup-restore の 36 行目は 9:45 から（R4-4）
- 確かめ-6: 主張: 段階 1 は 5 分続く無応答、15 分応答がなければ次の段へ上げる / 正本: opd-index-sample.md / 確かめ方: grep / 結果: 一致 / 根拠: 77・81・89 行目
- 確かめ-7: 主張: 優先度の判定は 5 種類（P1・P2）、監視対象は 3 件 / 正本: opd-incident-management-sample.md の 2.1 と opd-monitoring-sample.md の 2.1 / 確かめ方: 表の行を数えた / 結果: 一致 / 根拠: P1 が 3 行・P2 が 2 行・P3 が 1 行。監視対象は死活・バックアップ・日次締めの 3 行
- 確かめ-8: 主張: 誤検知が月 3 件以上なら閾値を見直す / 正本: opd-monitoring-sample.md / 確かめ方: grep / 結果: 一致 / 根拠: 71 行目
- 確かめ-9: 主張: P1 の一次連絡は 15 分以内（`nfr-ops-008`）/ 正本: opd-index-sample.md / 確かめ方: grep / 結果: 一致 / 根拠: 52 行目「P1 は 15 分以内」
- 確かめ-10: 主張: 夜間バックアップを前提とし、前日分を検証用の環境へ戻して販売件数を比べる / 正本: nfr-availability-sample.md / 確かめ方: grep / 結果: 一致 / 根拠: 53 行目と 64 行目
- 確かめ-11: 主張: 再取得と復元演習は opr-backup-restore で行い、演習は月次 / 正本: opr-backup-restore-sample.md / 確かめ方: grep / 結果: 一致 / 根拠: 17 行目と 48 行目
- 確かめ-12: 主張: 関連ドキュメント導線の wikilink の参照先（nfr-index・prj-overview・前提・制約・依存・nfr-availability・opd-index・opd-monitoring・opd-incident-management・opr-monitoring・opr-backup-restore・opr-incident）/ 正本: docs/ja/specdojo/samples/ / 確かめ方: ls / 結果: 一致 / 根拠: すべての `*-sample.md` がある
- 確かめ-13: 主張: Role code の `OPS`・`PO`・`DEV` / 正本: sample-authoring-standard.md と opr-backup-restore-sample.md / 確かめ方: grep / 結果: 一致 / 根拠: opr-backup-restore の 17 行目で OPS・DEV・PO の役割を定義している
- 確かめ-14: 主張: 要件 ID が `nfr-ops-&lt;連番&gt;` で欠番がない / 正本: nfr-operations-rulebook.md のファイル命名・ID規則 / 確かめ方: 読み取り / 結果: 一致 / 根拠: 001〜009 が連番
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変えていない）

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」の R4 に従い、sample の事実の主張を schema と関連 sample に突き合わせた。frontmatter の type・`part_of`・`based_on`、数値（90%、通知の 15 分、段階の 5 分）、優先度・監視対象の件数、wikilink の参照先、Role code、要件 ID の連番を確かめ、13 件は一致した。バックアップを確かめる時刻だけは `opr-backup-restore-sample` 側（9:45）と食い違った。sample 本文は `opd-monitoring-sample` と同じ 9:30 で正しいため、sample は直していない。判定根拠が `vp-qe-verifiability` の F002 は、暫定の基準を足して解消した。`vp-po-decision-readiness` と `vp-ops-release-readiness` の F001・F004 は kata の段のレビューで使わない観点として見送り、F003 は rulebook 側の問題として handoff に案を残した。`status` は `draft` のまま据え置いた。
