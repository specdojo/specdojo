---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-comparison-of-alternatives-sample-140-20261126t060937z-aba432ac
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-comparison-of-alternatives-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-comparison-of-alternatives-sample-140/T-KATA-REVIEW-ALL-prj-comparison-of-alternatives-sample-140-20261126T060937Z-aba432ac/plan.md
  started_at: "2026-11-26T06:09:47.659Z"
  completed_at: "2026-11-26T06:18:30.692Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-comparison-of-alternatives-sample
    - specdojo:prj-comparison-of-alternatives-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、sample の事実の主張 12 件を、前後の sample・rulebook・defaults・外部ヘルプと突き合わせた。不一致 3 件を直し、残りは整合していた。CLI・schema・`src/` に関わる主張は sample になかった。
- 直した 3 件は次のとおり。P-03 の要約を正本の表現に合わせた。受入と運用開始後2週間の条件の参照を、正本にある ID で書く形にした。Google スプレッドシートの引用先に、書き出しの根拠になる資料を加えた。
- 検査は、executor の `prettier` と `markdownlint-cli2`、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。ほかの runner 検査は変更種別により非適用だった。
- 確かめの表（12 行）は executor の最終応答にあり、evidence には含まれない。このため、ここには転記できていない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 正しさ | docs/ja/specdojo/samples/prj-comparison-of-alternatives-sample.md の P-03 の要約 | P-03 の要約「在庫過不足」が、正本（prj-issues-and-approach-sample の P-03「在庫の減りに気づくのが遅れる」）と合わない。 | 「在庫低下の把握遅れ」に直した。 | prj-issues-and-approach-sample の P-03 | 直した |
| 2 | R4 正しさ | 同 sample の「成功基準と受入条件」の参照と、見直し契機の表 | 「初期受入と2週間の試用継続条件」は、正本にない条件名だった。 | 初期受入（SC-01・SC-07・SC-09、AC-01〜AC-05）と運用開始後2週間の条件（SC-02・SC-03・SC-08）を ID で書く形に直した。見直し契機の表も同様に直した。 | 成功基準と受入条件の正本の ID | 直した |
| 3 | R4 正しさ | 同 sample の Google スプレッドシートの引用先 | 引用先 answer/6000292 は編集だけを扱い、書き出しの根拠にならない。 | ダウンロードを扱う answer/49114 を加え、確認日を 2026-11-26 にした。 | Google の公式ヘルプ | 直した |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-comparison-of-alternatives-sample.md`: P-03 の要約を「在庫過不足」から正本どおりの「在庫低下の把握遅れ」に直した。正本にない条件名だった「初期受入と2週間の試用継続条件」を、初期受入（SC-01・SC-07・SC-09、AC-01〜AC-05）と運用開始後2週間の条件（SC-02・SC-03・SC-08）の ID 参照に置き換え、見直し契機の表の同じ表現も直した。Google スプレッドシートの引用先に、ダウンロードを扱う answer/49114 を加え、確認日を 2026-11-26 にした。

## 3. 申し送り

- 確かめの表（12 行）は executor の最終応答にあり、evidence には含まれない。表の内容は確認できていないため、必要なら executor の最終応答から result の実施内容へ移す。
- P-03 の要約「在庫過不足」は、正本（prj-issues-and-approach-sample の P-03「在庫の減りに気づくのが遅れる」）と合わない。「在庫低下の把握遅れ」に直した。
- 「成功基準と受入条件 の初期受入と2週間の試用継続条件」は、正本にない条件名だった。初期受入（SC-01・SC-07・SC-09、AC-01〜AC-05）と運用開始後2週間の条件（SC-02・SC-03・SC-08）を ID で書く形に直した。見直し契機の表の同じ表現も直した。
- Google スプレッドシートの引用先 answer/6000292 は編集だけを扱い、書き出しの根拠にならない。ダウンロードを扱う answer/49114 を加え、確認日を 2026-11-26 にした。
- 確かめの表（12 行）は executor の最終応答にある。reporter は result の実施内容へ移す。

## 4. 進め方と実践の型の適用

根拠にしたのは、sample 本文、frontmatter の `based_on` にある prj-scope-sample・prj-issues-and-approach-sample・prj-assumptions-constraints-dependencies-sample、rulebook、defaults、外部ヘルプである。executor はこれらと照合し、正本と食い違う記述だけを直した。整合していた記述は維持した。駄菓子屋の業務の値のように正本のない仮定は、共通サンプル文脈と食い違わないため、確かめの対象にしていない。rulebook と矛盾する箇所はなかった。grade と condense の finding は plan に展開されておらず、未解消の finding もない。
