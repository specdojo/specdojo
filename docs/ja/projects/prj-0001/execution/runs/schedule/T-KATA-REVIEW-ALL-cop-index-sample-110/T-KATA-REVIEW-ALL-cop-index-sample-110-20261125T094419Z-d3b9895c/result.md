---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cop-index-sample-110-20261125t094419z-d3b9895c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cop-index-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cop-index-sample-110/T-KATA-REVIEW-ALL-cop-index-sample-110-20261125T094419Z-d3b9895c/plan.md
  started_at: "2026-11-25T09:44:29.668Z"
  completed_at: "2026-11-25T09:59:02.008Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cop-index-sample
    - specdojo:cop-index-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）を実施した。`cop-index-sample` を、`cop-index-rulebook` の必須 10 章、カタログの `cop-index` の `done_criteria`（業務停止範囲・判定ポイント・切戻し・エスカレーション・運用体制）、Sample 記述標準の禁止事項と照らした。
- 要る内容の欠けも要らない内容も見つからず、sample は変更していない。変更ファイルはない。
- | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R1 | `docs/ja/specdojo/samples/cop-index-sample.md` 全体 | 必須 10 章がすべて順に入っている。`done_criteria` の各項目も満たし、要らない内容もない | 変更なし | `cop-index-rulebook` の「本文要件」、`dct-migration-planning-template.yaml` の `cop-index` の `done_criteria`、Sample 記述標準の「禁止事項」 | なし | | 2 | R1 | 「ロールバック手順」の表の手順 4（登録簿への転記） | rulebook 6.3 は旧系での業務再開の確認で終わる手順を求める。sample では再開の確認は手順 3 で、最後の手順 4 は転記になっている。表の後の 1 文が手順 3 と 4 の両方を完了条件とし、並びは自然なので sample は直さない | sample は変えない。rulebook 6.3 を「旧系で業務を再開できたことを確かめる手順を含め、記録の転記で締めてよい」と緩める案を人が判断する（rulebook は本段では変更しない） | `cop-index-rulebook` の「ロールバック手順」の記述ガイド | 要判断 | | 3 | R1（R2 へ申し送り） | 「実施条件（事前完了条件）」の導入文 | finding F002 は観点 `vp-qe-omissions-consistency` で R2 に当たる。導入文の「前日の閉店時までに」が、GO1 の確認時期「前日の閉店後」・T-13:00 と食い違う | 導入文を「前日の最終棚卸の終了時（T-13:00）までに」にそろえる（R2 で直す） | `kata-guide` の「kata の観点の組」の R2 | なし | | 4 | R1（R4 へ申し送り） | 「切替判定ポイント（GO/NO-GO）」の GO4 の行と、タイムラインの T+7日 の行 | finding F001 は観点 `vp-qe-verifiability` で R4 に当たる。「理由の分からない差異がない」は判定者によって解釈が分かれる | 「差異が 0、または差異の原因を日次締めの差異欄に書いてある」のように、判定できる状態で書く（R4 で直す） | `kata-guide` の「kata の観点の組」の R4 | なし | | 5 | R1（R5 へ申し送り） | 「担当者、連絡系統」の「来店客の問い合わせ」の行と、「周知」の表の問い合わせ先 | 連絡先は「店頭窓口」だが備考には「臨時休業中は店の固定電話で受ける」とあり、周知の問い合わせ先は店頭窓口だけで、臨時休業中の窓口が食い違う | 周知の問い合わせ先を「店頭窓口（臨時休業中は店の固定電話）」にそろえる（R5 で直す） | `kata-guide` の「段と渡す材料」の R5 | 要判断 |

## 2. 変更ファイル

- なし

## 3. 申し送り

- R1 の範囲に当たる直しはなかったため、finding F001（R4 の観点）と F002（R2 の観点）は plan に従い、それぞれ R4・R2 の段に任せる。
- 人の判断が要る点は 2 件ある。1 件目は、rulebook 6.3 の緩和の要否（実施内容の No.2）。2 件目は、臨時休業中の問い合わせ窓口のそろえ方（No.5、R5 で扱う）。
- No: 1 / 段: R1 / 箇所: docs/ja/specdojo/samples/cop-index-sample.md 全体 / 指摘: 必須 10 章がすべて順に入っている。カタログの `done_criteria`（業務停止範囲・判定ポイント・切戻し・エスカレーション・運用体制）も満たしている。要らない内容もない / 直した案: 変更なし / 根拠: cop-index-rulebook の「本文要件」、dct-migration-planning-template.yaml の cop-index の `done_criteria`、Sample 記述標準の「禁止事項」 / 印: なし
- No: 2 / 段: R1 / 箇所: 「ロールバック手順」の表の手順 4（登録簿への転記）/ 指摘: rulebook 6.3 は「旧系で業務を再開できたことを確かめる手順で終わること」を求める。sample では、再開を確かめるのは手順 3（ノートでの試しの記録）で、最後の手順 4 は登録簿への転記になっている。表の後の 1 文が手順 3 と 4 の両方を完了条件と定めており、手順の並びとしては自然なので sample は直していない / 直した案: sample は変えない。rulebook 6.3 を「旧系で業務を再開できたことを確かめる手順を含め、記録の転記で締めてよい」と緩める案を人が判断する（rulebook は本段では変更しない）/ 根拠: cop-index-rulebook の「ロールバック手順」の記述ガイド / 印: 要判断
- No: 3 / 段: R1（R2 へ申し送り）/ 箇所: 「実施条件（事前完了条件）」の導入文 / 指摘: grade の finding F002 を R2 へ任せる。観点 vp-qe-omissions-consistency は R2 の観点。導入文の「前日の閉店時までに」が、GO1 の確認時期「前日の閉店後」・T-13:00 と食い違う / 直した案: 導入文を「前日の最終棚卸の終了時（T-13:00）までに」にそろえる（R2 で直す）/ 根拠: kata-guide の「kata の観点の組」の R2 / 印: なし
- No: 4 / 段: R1（R4 へ申し送り）/ 箇所: 「切替判定ポイント（GO/NO-GO）」の GO4 の行と、タイムラインの T+7日 の行 / 指摘: grade の finding F001 を R4 へ任せる。観点 vp-qe-verifiability は R4 の観点。「理由の分からない差異がない」は判定者によって解釈が分かれる / 直した案: 「差異が 0、または差異の原因を日次締めの差異欄に書いてある」のように、判定できる状態で書く（R4 で直す）/ 根拠: kata-guide の「kata の観点の組」の R4 / 印: なし
- No: 5 / 段: R1（R5 へ申し送り）/ 箇所: 「担当者、連絡系統」の「来店客の問い合わせ」の行と、「周知」の表の問い合わせ先 / 指摘: 連絡先は「店頭窓口」なのに、備考には「臨時休業中は店の固定電話で受ける」とあり、周知の問い合わせ先も臨時休業の時間を含めて店頭窓口だけになっている。臨時休業中の窓口が食い違う / 直した案: 周知の問い合わせ先を「店頭窓口（臨時休業中は店の固定電話）」にそろえる（R5 で直す）/ 根拠: kata-guide の「段と渡す材料」の R5 / 印: 要判断
- 適用外の検証: `npm run lint:md`（sample・rulebook とも変更がなく、親 runner の検査の対象。executor が実行する差分がない）

## 4. 進め方と実践の型の適用

根拠としたのは `cop-index-rulebook` の「本文要件」と「ロールバック手順」の記述ガイド、`dct-migration-planning-template.yaml` の `cop-index` の `done_criteria`、Sample 記述標準の「禁止事項」、`kata-guide` の「kata を agent でレビューする」。sample の構成と内容は R1 の観点で過不足がないと判断し、維持した。plan に展開された finding のうち F001 は R4、F002 は R2 の観点に当たるため、この段では扱わず、直す案を申し送った。rulebook と sample の食い違い候補（6.3）は rulebook を変更せず、人の判断に回した。
