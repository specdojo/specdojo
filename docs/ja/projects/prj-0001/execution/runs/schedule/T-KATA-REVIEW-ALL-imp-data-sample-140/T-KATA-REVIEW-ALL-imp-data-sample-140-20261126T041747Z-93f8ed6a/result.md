---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-data-sample-140-20261126t041747z-93f8ed6a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-data-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-data-sample-140/T-KATA-REVIEW-ALL-imp-data-sample-140-20261126T041747Z-93f8ed6a/plan.md
  started_at: "2026-11-26T04:17:56.843Z"
  completed_at: "2026-11-26T04:25:24.121Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-data-sample
    - specdojo:imp-data-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）の段として、imp-data-sample の主張 15 件を schema・rulebook・ほかの sample と突き合わせた。14 件は一致し、1 件（`based_on` の `pjr-c4a1`）は確かめられなかった。
- 一致を確認した主張は次のとおり。frontmatter の type・rulebook、`based_on` と本文 wikilink の `specdojo:imp-business-sample`、6 章の見出しと順序、4 表の列名、サマリ件数（高2・中1・低1）、対応方針の値（実施・代替・見送り）、Role code（DEV・BA・PO）、`item_type`（question・risk・decision）、表示 ID（PJR-C4A1・D4Q1・D4R2・D4Q3・D4D1）、波及先 ID 4 件、4 業務、90 秒の成功条件、切替日 2026-06-01、受入確認日 2026-05-28。
- `based_on` の `pjr-c4a1` は、rulebook が求める `PJR-XXXX` と、schema の `idRef`（英小文字のみ）が食い違う。sample 側では解決できないため、確かめられない主張として findings に残した。
- 誤りは見つからなかったため、sample は変更していない。F001・F002 は前の段（R1）で直し済みで、R4 の観点にも当たらないため扱っていない。
- 業務の値は正本のない仮定のため、確かめの対象にしなかった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 | docs/ja/specdojo/samples/imp-data-sample.md の frontmatter `based_on`（`pjr-c4a1`） | rulebook の推奨 Frontmatter 項目は `based_on` に個票 ID（`PJR-XXXX`）を求める。一方、`common-frontmatter.schema.yaml` の `idRef`（pattern `^[a-z0-9][a-z0-9-:]*$`）は大文字を通さない。個票の doc id は `&lt;project-id&gt;:pjr-xxxx-&lt;topic&gt;` の形で、`pjr-c4a1` は表示 ID でも doc id でもないため、参照として解決しない。 | sample は変えない。rulebook の記述を、英小文字の表示 ID（`pjr-xxxx`）を許すか、個票の doc id を書くかに直すことを、rulebook の持ち主が決める。決まった形に兄弟の imp 系 sample もそろえる。 | docs/ja/specdojo/rulebooks/imp-data-rulebook.md の推奨 Frontmatter 項目、`common-frontmatter.schema.yaml` の `idRef`、`register-item-frontmatter.schema.yaml` の id pattern（146 行目） | 要判断 |

## 2. 変更ファイル

- なし

## 3. 申し送り

- `based_on` の形式は rulebook と schema の間で決める必要がある。決まったら、兄弟の imp 系 sample（imp-business・imp-interface・imp-operations・imp-test。いずれもまだ `cr-2026-004`）も同じ形にそろえる。
- No: 1 / 段: R4 / 箇所: docs/ja/specdojo/samples/imp-data-sample.md の frontmatter `based_on`（`pjr-c4a1`） / 指摘: rulebook の推奨 Frontmatter 項目は `based_on` に個票 ID（`PJR-XXXX`）を書くよう求めるが、`docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` の `idRef`（pattern `^[a-z0-9][a-z0-9-:]*$`）は大文字を通さない。個票の doc id は `&lt;project-id&gt;:pjr-xxxx-&lt;topic&gt;` の形（`register-item-frontmatter.schema.yaml`）で、`pjr-c4a1` は表示 ID でも doc id でもないため参照として解決しない。 / 直した案: sample は変えない。rulebook の記述を、英小文字の表示 ID（`pjr-xxxx`）を許すか、個票の doc id を書くかに直すことを、rulebook の持ち主が決める。決まった形に、兄弟の imp 系 sample（imp-business・imp-interface・imp-operations・imp-test はまだ `cr-2026-004`）もそろえる。 / 根拠: docs/ja/specdojo/rulebooks/imp-data-rulebook.md の推奨 Frontmatter 項目、common-frontmatter.schema.yaml の `idRef`、register-item-frontmatter.schema.yaml の id pattern（146 行目） / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票などの履歴ファイルを変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の事実主張を rulebook、`common-frontmatter.schema.yaml`、`register-item-frontmatter.schema.yaml`、ほかの sample と突き合わせた。一致した主張は維持し、根拠が食い違う 1 件は推測で sample を直さず、要判断として申し送った。
