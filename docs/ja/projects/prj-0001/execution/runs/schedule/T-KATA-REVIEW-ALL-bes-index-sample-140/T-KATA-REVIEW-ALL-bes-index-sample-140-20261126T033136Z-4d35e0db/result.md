---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bes-index-sample-140-20261126t033136z-4d35e0db
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bes-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bes-index-sample-140/T-KATA-REVIEW-ALL-bes-index-sample-140-20261126T033136Z-4d35e0db/plan.md
  started_at: "2026-11-26T03:31:47.303Z"
  completed_at: "2026-11-26T03:39:01.434Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bes-index-sample
    - specdojo:bes-index-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、bes-index-sample の事実を cdfd-overview-sample・bes-index-rulebook・bes-sample・br-sample と突き合わせた。10 領域・起点イベント文言・P-03/P-05 の差・データストア・ID 形式・列順・個別 BES からの相互参照・未作成 BES は一致した。
- 誤りは 1 件だった。br-sample へのリンクに付いた表示名（販売金額計算の業務ルール）が、実体（在庫不足判定）と食い違っていた。リンクを外し「業務ルール（BR）」に直した。
- 主張ごとの確かめ（11 件）: 1 冒頭の 10 領域・領域 ID は cdfd-overview-sample 3 章と一致。2 一覧の 8 行のイベント名と起点イベントは一致。3 P-03・P-05 の文言差は一致。4 事実データの記録名と商品台帳の補充基準は cdfd-overview-sample 4 章と一致。5 ID 形式 `bes-&lt;event&gt;` と重複 0 件は rulebook の ID 規則と一致。6 列順と frontmatter 項目は rulebook 4・5.1 章と一致。7 個別 BES からの参照は bes-sample と一致。8 詳細化表のリンク表示名は bes-sample の H1 と一致。9 `bes-credit-sale-over-limit` が未作成である点は grep で一致。10 金額計算の委譲先リンクは br-sample の H1（在庫不足判定）と不一致のため修正した。11 必須列の空欄 0 件は目視で一致。
- grade の F001 と F002 は、kata のレビューの段では使わない観点のため扱わなかった。F003 は、確認結果と未実施を区別した照合表が既にあるため解消済みと判断した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 正しさ | docs/ja/specdojo/samples/bes-index-sample.md（金額計算の委譲先リンク） | br-sample へのリンクの表示名が「販売金額計算の業務ルール」だが、リンク先の実体は在庫不足判定である。 | リンクを外し「業務ルール（BR）」の表記にした。 | br-sample の H1（在庫不足判定）と突き合わせた。 | 修正済み |
| 2 | R4 正しさ | bes-sample.md 52 行（今回の対象外） | [[specdojo:br-sample\|販売金額計算の業務ルールサンプル]] が br-sample の実体（在庫不足判定）と食い違う。 | bes-sample 側で表示名とリンク先を直す。金額計算の BR sample がなければリンクを外し「業務ルール（BR）」とする。 | br-sample の H1 と executor の handoff。 | 申し送り |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bes-index-sample.md`: br-sample への誤った表示名つきリンク（販売金額計算の業務ルール）を外し、「業務ルール（BR）」の表記に直した（1 行の差分）。

## 3. 申し送り

- bes-index-sample 側の確かめでは、事実データとデータモデルの照合は未実施のままで、「未決事項」に従い確定入力にしていない。
- bes-sample.md 52 行の [[specdojo:br-sample|販売金額計算の業務ルールサンプル]] は、br-sample の実体（駄菓子屋きぬや 在庫不足判定）と食い違う。bes-sample 側の手直しで表示名とリンク先を直す（金額計算の BR sample がなければリンクを外し「業務ルール（BR）」とする）。
- grade F001（vp-pm-plan-feasibility）と F002（vp-pm-control-reporting）は kata-guide の「kata の観点の組」で kata の段のレビューでは使わない観点のため、本段では扱わず見送った。
- grade F003（vp-qe-kata-conformance、照合結果の記録）は「照合の結果と確定入力として扱う条件」の表が確認結果と未実施を区別して記録済みのため解消済みと判断した。

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample に書かれた事実を cdfd-overview-sample・bes-index-rulebook・bes-sample・br-sample と照合した。誤りは rulebook と正本の文書を正として最小限の差分で直した。F001 と F002 は kata の観点の組に含まれないため見送り、F003 は既存の照合表で解消済みと判断した。
