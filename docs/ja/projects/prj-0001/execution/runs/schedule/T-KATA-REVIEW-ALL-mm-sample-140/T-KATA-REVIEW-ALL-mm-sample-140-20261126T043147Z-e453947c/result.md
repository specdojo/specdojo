---
specdojo:
  id: prj-0001:xer-t-kata-review-all-mm-sample-140-20261126t043147z-e453947c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-mm-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-mm-sample-140/T-KATA-REVIEW-ALL-mm-sample-140-20261126T043147Z-e453947c/plan.md
  started_at: "2026-11-26T04:31:57.607Z"
  completed_at: "2026-11-26T04:41:21.773Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:mm-sample
    - specdojo:mm-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`mm-sample` に書かれた事実を schema・mm-rulebook・pr-rulebook・`src/register/item.ts` と突き合わせた。
- 不一致は1件で、冒頭の進捗報告 ID が `prj-0001:pr-2026-04-24` となっており、pr-rulebook の ID 規則（`&lt;project-id&gt;:pr-&lt;yyyy-mm-dd&gt;-&lt;nn&gt;`）に必要な末尾2桁の連番がなかった。これを `prj-0001:pr-2026-04-24-01` に直した。
- 一致を確認したもの: `specdojo.type: project`（schema の `deliverableType` と rulebook）、`rulebook: specdojo:mm-rulebook`（rulebook の `sample` 宣言と対応）、`PJR-A3K7` と `PJR-B8M2`（`PJR_ID_ALPHABET` の文字で構成された4文字）、本文の章・表の列・期限の書式（mm-rulebook の本文要件・記述ガイド）。
- 確かめられなかったもの: アクション1にある `prj-0001:req-inventory` は、`req-` の命名を決める rulebook・標準が見つからず、正しさを確認できなかった。
- grade の F001（`vp-ba-business-value`）は kata-guide の「kata の観点の組」で kata の段のレビューから外す観点のため、R4 では扱わない。
- lint:md:changed、lint:fm:changed、lint:mermaid、lint:d2、test:docs、validate:schema などの検証は通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 正しさ | docs/ja/specdojo/samples/mm-sample.md 冒頭の段落（進捗報告の ID） | 進捗報告の ID `prj-0001:pr-2026-04-24` に、pr-rulebook の ID 規則（`&lt;project-id&gt;:pr-&lt;yyyy-mm-dd&gt;-&lt;nn&gt;`）で必要な末尾2桁の連番がなかった。 | `prj-0001:pr-2026-04-24-01` に直した。 | pr-rulebook の「ファイル命名・ID規則」。 | 修正済み |
| 2 | R4 正しさ | docs/ja/specdojo/samples/mm-sample.md アクション1の完了条件（`prj-0001:req-inventory`） | `req-` の命名を決める rulebook・標準が見つからず、この ID が正しいか確かめられない。trc の sample は `req-2026-r1` 形式で書いている。 | - | 該当する正本が見つからなかった。R5（整合）で trc の sample と表記をそろえるか、要求一覧の ID 規則の正本を決めるかの判断が要る。 | 確認不能 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/mm-sample.md`: 冒頭で参照する進捗報告の ID を、pr-rulebook の ID 規則に合わせて `prj-0001:pr-2026-04-24` から `prj-0001:pr-2026-04-24-01` に直した（1行の変更）。

## 3. 申し送り

- `prj-0001:req-inventory` の表記は R5（整合）で扱う。trc の sample は `req-2026-r1` 形式で書いているため、表記をそろえるか、要求一覧の ID 規則の正本を決めるかの判断が要る。
- [R4 不一致・修正済み] 冒頭の進捗報告の ID `prj-0001:pr-2026-04-24` は pr-rulebook の「ファイル命名・ID規則」（`&lt;project-id&gt;:pr-&lt;yyyy-mm-dd&gt;-&lt;nn&gt;`）と合わず、末尾の2桁連番が抜けていたため `prj-0001:pr-2026-04-24-01` に直した。
- [R4 確かめられない] アクション1の完了条件にある `prj-0001:req-inventory` は、`req-` の命名を決める rulebook・標準が見つからず、正しさを確かめられない。trc の sample は `req-2026-r1` 形式で書いている。R5（整合）で trc の sample と表記をそろえるか、要求一覧の ID 規則の正本を決めるか判断が要る。
- [F001 対象外] grade の指摘 F001（`vp-ba-business-value`）は kata-guide の「kata の観点の組」で kata の段のレビューから外す観点なので、R4 では扱わない。指摘が引用している文は前の段で書き換わり、決定2の理由（店番の交代で確認時刻がずれ、補充が翌日に持ち越された2回）はすでに決定事項の導入文に入っているため、解消済みと見てよい。
- [確かめの表] 一致したもの: `specdojo.type: project`（schema の `deliverableType` と rulebook）、`rulebook: specdojo:mm-rulebook`（rulebook の `sample` 宣言と互いに対応）、`PJR-A3K7`・`PJR-B8M2`（`src/register/item.ts` の `PJR_ID_ALPHABET` で使える文字の4文字）、本文の章・表の列・期限の書式（mm-rulebook の本文要件・記述ガイド）。不一致は進捗報告の ID の1件（直した）。確かめられないものは `prj-0001:req-inventory` の1件。

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、plan 展開の F001 は R4 の観点に当たらないため扱わなかった。mm-sample の事実を schema、mm-rulebook、pr-rulebook、`src/register/item.ts` と突き合わせ、誤りは進捗報告 ID の1件だけだったので最小限の差分で直した。根拠が見つからない `prj-0001:req-inventory` は推測で書き換えず、申し送りに残した。rulebook と記述が矛盾する箇所はなかった。
