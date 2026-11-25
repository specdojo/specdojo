---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cop-sample-110-20261125t094858z-0a83b84b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cop-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cop-sample-110/T-KATA-REVIEW-ALL-cop-sample-110-20261125T094858Z-0a83b84b/plan.md
  started_at: "2026-11-25T09:49:08.615Z"
  completed_at: "2026-11-25T10:04:15.471Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cop-sample
    - specdojo:cop-sample
---

# Edit Result

## 1. 実施内容

- cop-sample の R1（目的の過不足）を確かめ、「ロールバック手順」の発動条件に抜けていた事象を補った。
- ほかの必須 10 章は rulebook の本文要件を満たしており、要らない内容も見当たらなかったため維持した。
- F001（`vp-ux-language-consistency`）は R3 の観点のため、この段では直していない。
- executor の `npx prettier --check` と、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` は passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cop-sample.md`: 「ロールバック手順」冒頭の発動条件を修正した。「GO3 で NO-GO」と「販売の記録が 10 分以上できない」だけだった条件を、GO3 で NO-GO となった場合と、開店後に「障害時判断・エスカレーション」の重大度「高」の事象（販売の記録が 10 分以上できない、つけ残高が取り込み後に変わった）が起きた場合へ書き換えた。変更は 1 行の差し替えで、重大度「高」の事象とロールバックの発動条件をそろえた。

## 3. 申し送り

- R1 の指摘の一覧（実施内容の表にまとめる分）。No 1 は「ロールバック手順」冒頭の段落で、重大度「高」の「つけ残高が取り込み後に変わった」がロールバックの発動条件に抜けていたため、発動条件をそろえて直した。No 2 は sample 全体で、必須章と禁止事項に問題がなく要らない内容もないため、変更せず維持した。No 3 は「担当者/連絡系統」の表の下の判定結果の記録先の行で、grade F001 の「店主代表」と Role code `PO` の対応が本文に書かれていない点にあたる。R3 の観点のため直さず、R3 で「店主代表（`PO`）」のように対応を一度書く案とした。印はいずれもなしで、「要判断」の指摘はない。
- grade F001 は未解消のまま R3 へ引き継ぐ。理由は、`vp-ux-language-consistency` が R3 の観点で、R1 では扱わないため。次のアクションは、R3 で役割名と Role code の対応を一度明記すること。
- No: 1 / 段: R1 / 箇所: `docs/ja/specdojo/samples/cop-sample.md`「ロールバック手順」の冒頭の段落 / 指摘: 発動条件が「GO3 で NO-GO」と「開店後に販売の記録が 10 分以上できない」だけで、「障害時判断・エスカレーション」の重大度「高」が求める「つけ残高が取り込み後に変わった」の場合のロールバックが抜けていた。rulebook が求めるロールバック発動条件（判定点と事象）がそろっていない。 / 直した案: 発動条件を「GO3 で NO-GO となった場合と、開店後に「障害時判断・エスカレーション」の重大度「高」の事象（販売の記録が 10 分以上できない、つけ残高が取り込み後に変わった）が起きた場合」に書き換え、sample に反映した。 / 根拠: `specdojo:cop-rulebook` の「本文要件」のロールバック手順の行（発動条件（判定点と事象））。`vp-qe-kata-conformance`（種別の責務） / 印: なし
- No: 2 / 段: R1 / 箇所: sample 全体 / 指摘: ほかの必須 10 章は rulebook の「本文要件」の順序・列・受入条件を満たし、Sample 記述標準の禁止事項（人物名、文書の役割の割り当てや承認の進み具合、実装詳細）にも当たる記述はない。要らない内容も見当たらない。参照した成果物カタログ（`dct-migration-planning-template.yaml`）には `cop-index` の `done_criteria` だけがあり、対象別の `cop-&lt;term&gt;` の項目はなかったため、rulebook と記述標準を正として確かめた。 / 直した案: 変更なし（維持） / 根拠: `specdojo:cop-rulebook` の「本文要件」・「禁止事項」、`specdojo:sample-authoring-standard` の「記述ガイド」・「禁止事項」 / 印: なし
- No: 3 / 段: R1 / 箇所: 「担当者/連絡系統」の表の下の箇条書き（判定結果の記録先の行） / 指摘: grade F001（`vp-ux-language-consistency`）。表では「店主代表」と書き、本文では Role code `PO` とだけ書いており、対応が分からない。R3（読みやすさ）が扱う観点のため、この段では直さない。 / 直した案: R3 で「判断者の店主代表（`PO`）として decision 個票に」のように、役割名と Role code の対応を一度書く。 / 根拠: `specdojo:kata-guide` の「kata の観点の組」（`vp-ux-language-consistency` は R3） / 印: なし
- 適用外の検証: `npm run validate:history-links`（executor は履歴の積み上がるファイル（plan / result / 個票）を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown だけで、`*.yaml` / `*.yml` は変更していない）

## 4. 進め方と実践の型の適用

根拠は `specdojo:cop-rulebook` の「本文要件」・「禁止事項」と、`specdojo:sample-authoring-standard` の「記述ガイド」・「禁止事項」、`specdojo:kata-guide` の「kata の観点の組」で、`vp-qe-kata-conformance`（種別の責務）に照らして判断した。成果物カタログ（`dct-migration-planning-template.yaml`）には `cop-index` の `done_criteria` しかなく、対象別の `cop-&lt;term&gt;` の項目はなかった。このため rulebook と記述標準を正とした。改訂したのは、ロールバックの発動条件を「障害時判断・エスカレーション」の重大度「高」とそろえた 1 箇所だけである。そのほかの必須章は rulebook の順序・列・受入条件を満たし、禁止事項（人物名、文書の役割の割り当てや承認の進み具合、実装詳細）にも当たらないため維持した。rulebook など sample 以外は変更していない。F001 は R3 の観点なので、この段では直さず、R3 に引き継ぐ。
