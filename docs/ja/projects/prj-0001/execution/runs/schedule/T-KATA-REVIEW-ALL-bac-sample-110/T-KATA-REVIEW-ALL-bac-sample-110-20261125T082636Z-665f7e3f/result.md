---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bac-sample-110-20261125t082636z-665f7e3f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bac-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bac-sample-110/T-KATA-REVIEW-ALL-bac-sample-110-20261125T082636Z-665f7e3f/plan.md
  started_at: "2026-11-25T08:26:46.106Z"
  completed_at: "2026-11-25T08:41:22.288Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bac-sample
    - specdojo:bac-sample
---

# Edit Result

## 1. 実施内容

- R1(目的の過不足)として `docs/ja/specdojo/samples/bac-sample.md` を修正した。grade の finding F001(上流への追跡性が欠けている点)に対応し、frontmatter の `based_on` に既存 sample 2 件を接続した。概要の根拠と BAC-01〜03 の根拠も、上流の AC-01・SC-06・発生条件に対応づけた。
- 仮定は、上流が決めていない在庫の反映と停止条件だけに絞った。実在しない参照名 `kinuya-bps-cash-sale` は、系列の仮置き ID `bps-sales-order-flow` に揃えた。
- 変更は sample 1 ファイルだけで、rulebook など sample 以外は変更していない。executor の `prettier` と `markdownlint` は成功した。runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も成功した。ほかの runner 検査は変更種別により `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bac-sample.md`: frontmatter の `based_on` に `specdojo:prj-success-criteria-and-acceptance-criteria-sample` と `specdojo:bes-sample` を追加した。概要の根拠を AC-01・SC-06・現金会計の確定の発生条件への参照に置き換え、`_ASSUMPTION_` を在庫の反映と停止条件だけに絞った。BAC-01〜03 の「根拠:」は上流の AC-01・SC-06・発生条件に対応づけた。メモ/将来課題の `_TODO_` の参照名は `bps-sales-order-flow` に揃え、BAC-01 の在庫差分と BAC-02・03 が仮定に頼っていることを明記した。prettier による表の列幅調整も含む。

## 3. 申し送り

- R1 の指摘は次の表のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R1 | frontmatter `based_on` | `based_on: []` のままで、実在しない参照名 `kinuya-bps-cash-sale` に頼っていた。rulebook の「確認完了の条件」を満たしていない | `based_on` に `specdojo:prj-success-criteria-and-acceptance-criteria-sample` と `specdojo:bes-sample` をつないだ | `bac-rulebook` の「位置づけ」「推奨 Frontmatter 項目」「確認完了の条件」 | F001 に対応 | | 2 | R1 | 概要の「根拠」と最初の `_ASSUMPTION_` | 根拠の説明が上流とつながっていなかった | 根拠を AC-01・SC-06・現金会計の確定の「発生条件」への wikilink に置き換えた。仮定は在庫の反映と停止条件だけに絞った | `bac-rulebook` の「記述ガイド」の概要 | F001 に対応 | | 3 | R1 | BAC-01〜03 の「根拠:」 | 3 つとも概要の仮定だけを根拠にしていた | BAC-01 は AC-01・発生条件・事実データ、BAC-02 は在庫不足時の仮定・SC-06・発生条件、BAC-03 は発生条件 2 を満たさない場面・SC-06 を挙げた | `bac-rulebook` の「本文要件」 | F001 に対応 | | 4 | R1 | メモ / 将来課題の `_TODO_` の行 | 実在しない参照名のまま残っていた | 系列の他の sample と同じ仮置き ID `bps-sales-order-flow` に揃え、BAC-01 の在庫差分と BAC-02・03 が仮定に頼っていると書いた | `bes-sample` の「発生条件」が在庫の反映を `bps-sales-order-flow` へ委ねている | 要判断 | No.4 は要判断。R1 の範囲は対象 sample だけのため、販売プロセスの sample `bps-sales-order-flow` は作っていない。作るなら別タスクで登録簿に起票する。できたら `based_on` に足し、BAC-01〜03 の根拠を仮定から置き換える。
- No: 1 / 段: R1 / 箇所: frontmatter `based_on` / 指摘: `based_on: []` のままで、実在しない参照名 `kinuya-bps-cash-sale` に頼っていた。rulebook の「確認完了の条件」（根拠と `based_on` が有効な先行成果物へ解決できること）を満たしていない / 直した案: `based_on` に `specdojo:prj-success-criteria-and-acceptance-criteria-sample` と `specdojo:bes-sample` をつないだ / 根拠: `bac-rulebook` の「位置づけ」（BAC は BES やプロジェクトの受入条件を根拠にする）、「推奨 Frontmatter 項目」、「確認完了の条件」 / 印: F001 に対応
- No: 2 / 段: R1 / 箇所: 概要の「根拠」と最初の `_ASSUMPTION_` / 指摘: 根拠の説明が上流とつながっていなかった / 直した案: 根拠を AC-01・SC-06 と、現金会計の確定の「発生条件」への wikilink に置き換えた。仮定は、上流がまだ決めていない在庫の反映と停止条件だけに絞った / 根拠: `bac-rulebook` の「記述ガイド」の概要（上位の Why は要約と参照で引き継ぐ） / 印: F001 に対応
- No: 3 / 段: R1 / 箇所: BAC-01〜03 の「根拠:」 / 指摘: 3 つとも概要の仮定だけを根拠にしていた / 直した案: BAC-01 は AC-01 と発生条件・事実データ、BAC-02 は在庫不足時の仮定・SC-06・発生条件、BAC-03 は発生条件 2 を満たさない場面・SC-06 を挙げた / 根拠: `bac-rulebook` の「本文要件」（シナリオごとに根拠を対応させる） / 印: F001 に対応
- No: 4 / 段: R1 / 箇所: メモ / 将来課題の `_TODO_` の行 / 指摘: 実在しない参照名のまま残っていた / 直した案: 系列の他の sample（`bes-sample`・`sf-sample`・`sf-index-sample`）と同じ仮置き ID `bps-sales-order-flow` に揃え、BAC-01 の在庫差分と BAC-02・03 が仮定に頼っていると書いた / 根拠: `bes-sample` の「発生条件」が在庫の反映を `bps-sales-order-flow` へ委ねている / 印: 要判断（R1 の範囲は対象 sample だけのため、販売プロセスの sample `bps-sales-order-flow` は作っていない。作るなら別タスクで登録簿に起票し、できたら `based_on` に足して BAC-01〜03 の根拠を仮定から置き換える）
- 適用外の検証: `npm run validate:history-links`（変更した中に履歴ファイル（plan / result / pjr 個票）がない）

## 4. 進め方と実践の型の適用

根拠にした規範は、`bac-rulebook`(位置づけ・推奨 Frontmatter 項目・本文要件・記述ガイド・確認完了の条件)と、系列の既存 sample(`prj-success-criteria-and-acceptance-criteria-sample`・`bes-sample`)である。F001 は、最小の上流 sample を `based_on` に接続し、各シナリオの根拠を上流の判断に対応づけて解消した。rulebook と矛盾はなく、rulebook を正とする判断が必要な箇所もなかった。実在しない販売プロセス sample は推測で作らず、仮置き ID と仮定で明示し、実案件への適用は別タスクとして残した。F001 が求める「実案件への適用は別の保留タスクとする」点は、No.4 の申し送りで扱っている。F001 の解消は executor の修正内容に基づく。grade の再評価はこの result の範囲外なので、再評価でも確認が必要である。
