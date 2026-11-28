---
specdojo:
  id: prj-0001:xer-t-kata-review-all-mm-sample-150-20261126t081033z-907903ec
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-mm-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-mm-sample-150/T-KATA-REVIEW-ALL-mm-sample-150-20261126T081033Z-907903ec/plan.md
  started_at: "2026-11-26T08:10:44.759Z"
  completed_at: "2026-11-26T08:17:48.320Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:mm-sample
    - specdojo:mm-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`mm-sample` を同じ接頭辞以外の関連 sample と rulebook に照らして確認した。食い違いのうち確証のあった進捗報告の参照 ID だけを直し、判断が分かれる点は変更せず要判断として findings に残した。
- grade の指摘 F001（決定2の判断理由）は、前の段で理由の文が足されて解消済みと確認した。R5 の観点ではないため、この段では繰り返していない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 冒頭の段落 / 参照している進捗報告 ID `prj-0001:pr-2026-04-24-01` | 進捗報告 ID の日付が、pr-rulebook の命名（報告期間の終了日）と pr-sample の週次の区切り（04-13〜04-19、次の期間は 04-20〜04-26）に合わない。04-24 は週の区切りではない。 | `prj-0001:pr-2026-04-26-01` に直した。アクションの期限 04-21〜04-24 を含む週の報告である。 | `vp-qe-kata-conformance`、pr-rulebook のファイル命名・ID規則、pr-sample の報告期間と次期予定。 | - |
| R5-2 | R5 | 3. 決定事項 / 決定1「全商品・全店番で在庫3以下に統一」 | br-sample（商品ごとの発注点を下回るかで判定）と pr-sample（人気商品 20 品目ごとに補充点を定めた、T-11）に食い違う。用語も「しきい値」「発注点」「補充点」に分かれている。 | 案A: mm-sample の決定1を「対象 20 品目の補充点を一律に在庫3とする」に直し、用語を補充点にそろえる。案B: br-sample と pr-sample を一律の値に合わせる。mm-rulebook の良い例も「在庫3以下に統一」のため、どちらを正とするか決められなかった。変更していない。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`。共通サンプル文脈は、値を変える場合に関連する sample を同時に整合させるとしている。 | 要判断 |
| R5-3 | R5 | 4. アクションアイテム / 完了条件の `prj-0001:req-inventory` | `req` という接頭辞の型（rulebook）がなく、参照先の種別が決まらない。 | 中身（補充判定条件）は業務ルールに当たるため、br-rulebook の `&lt;project-id&gt;:br-&lt;subject&gt;` 形式に置き換える案がある。br の具体的な ID の決まりがなく推測になるため直していない。 | `vp-qe-kata-conformance`。 | 要判断 |
| R5-4 | R5 | （相手側）mm-rulebook の記述ガイド | 担当者の例「店主、業務担当、開発担当」と良い例の「業務担当」が、共通登場人物の役割名（店主代表、店舗運営アドバイザーなど）とずれている。 | 相手側の mm-rulebook の記述ガイドで、例を「店主代表、店舗運営アドバイザー、開発担当」に、良い例の「業務担当」を「店舗運営アドバイザー」に直す案。この段では変更していない。 | `vp-qe-kata-conformance`。 | - |
| R5-5 | R5 | 3. 決定事項 / grade の指摘 F001（決定2の判断理由） | 決定2の判断理由がないという指摘は、前の段で「残る2回」の文が足されて解消している。R5 の観点ではないため繰り返さない。 | - | plan の grade の指摘 F001、kata-guide の段と渡す材料（前の段の指摘を繰り返さない）。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/mm-sample.md`: 冒頭の段落で参照している進捗報告 ID を `prj-0001:pr-2026-04-24-01` から `prj-0001:pr-2026-04-26-01` に修正した。報告期間の終了日で命名する pr-rulebook の規則と、pr-sample の週次の区切りに合わせている。差分は 1 行である。

## 3. 申し送り

- `npx prettier --check`、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は成功した。`validate:history-links` と `validate:schema:file` は、履歴ファイルも YAML も変更していないため非適用である。
- R5-2 と R5-3 は、どちらを正とするか決められなかったため、sample を変更していない。人の判断を待つ。
- R5-4 は相手側の mm-rulebook を直す案であり、この段では mm-rulebook を変更していない。
- R5-1: R5 / 冒頭の段落 / 参照している進捗報告 ID `prj-0001:pr-2026-04-24-01` の日付が、pr-rulebook の命名（報告期間の終了日）と pr-sample の週次の区切り（04-13〜04-19、次の期間は 04-20〜04-26）に合わない。04-24 は週の区切りではない / `prj-0001:pr-2026-04-26-01` に直した（アクションの期限 04-21〜04-24 を含む週の報告） / `vp-qe-kata-conformance`、pr-rulebook のファイル命名・ID規則、pr-sample の報告期間と次期予定 / -
- R5-2: R5 / 3. 決定事項 / 決定1「全商品・全店番で在庫3以下に統一」が、br-sample（商品ごとの発注点を下回るかで判定）と pr-sample（人気商品 20 品目ごとに補充点を定めた、T-11）に食い違う。用語も「しきい値」「発注点」「補充点」に分かれている / - / `vp-qe-kata-conformance`、`vp-dev-change-impact`。共通サンプル文脈は、値を変える場合に関連する sample を同時に整合させるとしている。案A: mm-sample の決定1を「対象 20 品目の補充点を一律に在庫3とする」に直し、用語を補充点にそろえる。案B: br-sample と pr-sample を一律の値に合わせる。mm-rulebook の良い例も「在庫3以下に統一」のため、どちらを正とするか決められなかった / 要判断
- R5-3: R5 / 4. アクションアイテム / 完了条件の `prj-0001:req-inventory` は、`req` という接頭辞の型（rulebook）がなく、参照先の種別が決まらない / - / `vp-qe-kata-conformance`。中身（補充判定条件）は業務ルールに当たるため、br-rulebook の `&lt;project-id&gt;:br-&lt;subject&gt;` 形式に置き換える案。br の具体的な ID の決まりがなく推測になるため直さなかった / 要判断
- R5-4: R5 / （相手側）mm-rulebook の記述ガイド / 担当者の例「店主、業務担当、開発担当」と良い例の「業務担当」が、共通登場人物の役割名（店主代表、店舗運営アドバイザーなど）とずれている / - / `vp-qe-kata-conformance`。相手側の mm-rulebook の記述ガイドで、例を「店主代表、店舗運営アドバイザー、開発担当」に、良い例の「業務担当」を「店舗運営アドバイザー」に直す案 / -
- R5-5: R5 / 3. 決定事項 / grade の指摘 F001（決定2の判断理由がない）は、前の段で「残る2回」の文が足されて解消している。R5 の観点ではないため繰り返さない / - / plan の grade の指摘 F001、kata-guide の段と渡す材料（前の段の指摘を繰り返さない） / -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/mm-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

sample-maintenance の R5（整合）として、mm-sample を pr-rulebook、pr-sample、br-sample、mm-rulebook、共通サンプル文脈と照合した。sample 側で確証のある食い違いだけを直した。値の定義や ID 体系のように相手側にも変更が及ぶ点は推測で直さず、案を付けて要判断とした。相手側を直すべき点は変更せず、直す案を findings に書いた。
