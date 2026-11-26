---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-operations-sample-140-20261126t042858z-8a858de2
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-operations-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-operations-sample-140/T-KATA-REVIEW-ALL-imp-operations-sample-140-20261126T042858Z-8a858de2/plan.md
  started_at: "2026-11-26T04:29:09.849Z"
  completed_at: "2026-11-26T04:38:16.462Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-operations-sample
    - specdojo:imp-operations-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、sample の主張を schema・他 sample と突き合わせた。確かめた主張は 7 件で、一致 4、不一致で直した 1、不一致で要判断 1、確かめられない 1 だった。
- 確かめの表：(1) 登録項目 ID `PJR-O4Q1`・`PJR-O4R1`・`PJR-O4D1` は、`register-item-frontmatter.schema.yaml` の pattern `^PJR-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}$` に合わない（O は使えない）ため不一致。`PJR-P4Q1`・`PJR-P4R1`・`PJR-P4D1` に直した。(2) `question`・`risk`・`decision` は `ItemType` の列挙値と一致。(3) `DEV`・`OPS`・`BA`・`PO` は `pm-roles-sample.yaml` の `code:` と一致。(4) 前提の期限 2026-05-22 と切替日 2026-06-01 は `imp-data-sample` と一致。(5) 2026-06-01〜2026-06-28 は 28 日で 4 週間と一致。(6) 委譲先 `opd-*` の 3 つの ID は仮定の ID で正本がなく、確かめられなかった。(7) `based_on` の `cr-2026-004` は rulebook が求める `PJR-XXXX` の形と合わず、要判断とした。
- grade F001（成功条件 2 の上限時間が未決で判定できない）は、判定方法の欄に暫定基準を併記して直した。grade F002（対応方針の「完了条件」列が rulebook の必須列にない）は種別の構成への準拠の観点なので、この段では扱っていない。
- runner の検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。ほかは変更の種類により非適用だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 2. 変更要求の概要・3. 影響分析サマリ・4. 影響詳細一覧・5. 対応方針・6. 未解決事項 | 登録項目 ID `PJR-O4Q1`・`PJR-O4R1`・`PJR-O4D1` が、表示用の ID の形 `^PJR-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}$` に合わない（O は使えない）。 | 他の sample で使われていない `PJR-P4Q1`・`PJR-P4R1`・`PJR-P4D1` に置き換えた。 | `vp-arc-technical-constraints`（`docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml` の 149・450 行目） | - |
| R4-2 | R4 | 2. 変更要求の概要（成功条件 2） | 成功条件 2 は上限時間が決まらないと判定できない（grade F001）。 | 判定方法の欄に「上限が決まるまでは、警告を表示した日の閉店までに初動の記録があること」を足した。 | `vp-qe-verifiability` | - |
| R4-3 | R4 | Frontmatter・1. 目的と適用範囲 | `based_on` と本文の変更要求 `cr-2026-004` は、rulebook の「推奨 Frontmatter 項目」が求める変更要求の個票 ID（`PJR-XXXX`）と合わない。同じ系列では業務・I/F・テストの sample が `cr-2026-004`、データの sample が `pjr-c4a1`（本文は `PJR-C4A1`）と割れている。 | - | `vp-arc-technical-constraints`。この sample だけを直すと他の影響調査の sample とずれるため直していない。 | 要判断 |
| R4-4 | R4 | 4. 影響詳細一覧 | 委譲先の `opd-monitoring`・`opd-incident-management`・`opd-integrity-check` は、駄菓子屋の仮定の成果物 ID で正本がなく確かめられない。`opd-index-sample` が分冊として挙げるのは監視・障害対応・権限の 3 冊だけで、`opd-integrity-check` はない（`imp-data-sample` も同じ ID を使っている）。 | - | `vp-dev-implementation-readiness`。R5 で `opd-index-sample` の分冊、または `opr-*` との整合を判断してほしい。 | 要判断 |
| R4-5 | R4 | 5. 対応方針 | grade F002（対応方針の「完了条件」列が rulebook の必須列にない）は種別の構成への準拠の観点なので、この段では扱わない。 | - | `vp-qe-kata-conformance` は R1 と R5 の観点 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-operations-sample.md`: 表示用 ID の形に合わない `PJR-O4Q1`・`PJR-O4R1`・`PJR-O4D1` を `PJR-P4Q1`・`PJR-P4R1`・`PJR-P4D1` に置き換えた（変更要求の概要、影響分析サマリ、影響詳細一覧、対応方針、未解決事項の各表）。成功条件 2 の判定方法に、上限が決まるまでの暫定基準（警告を表示した日の閉店までに初動の記録があること）を足した。

## 3. 申し送り

- R4-3 の `based_on` の `cr-2026-004` は、この sample だけを直すと他の影響調査 sample とずれるため直していない。R5 で系列の全 sample を `PJR-C4A1` に揃える案と、rulebook 側を直す案を比べる必要がある。
- R4-4 の委譲先 `opd-monitoring`・`opd-incident-management`・`opd-integrity-check` は正本がなく確かめられなかった。R5 で `opd-index-sample` の分冊や `opr-*` との整合を判断する必要がある。
- grade F002 は `vp-qe-kata-conformance` の観点で、R1 と R5 に任せた。grade result のサイドカーは直接編集していない。
- R4-1: R4 / 2. 変更要求の概要・3. 影響分析サマリ・4. 影響詳細一覧・5. 対応方針・6. 未解決事項 / 登録項目 ID `PJR-O4Q1`・`PJR-O4R1`・`PJR-O4D1` が、表示用の ID の形 `^PJR-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}$` に合わない（O は使えない） / 各 sample で使われていない `PJR-P4Q1`・`PJR-P4R1`・`PJR-P4D1` に置き換えた / `vp-arc-technical-constraints`（`docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml` の 149・450 行目） / -
- R4-2: R4 / 2. 変更要求の概要 / 成功条件 2 は上限時間が決まらないと判定できない（grade F001） / 判定方法の欄に「上限が決まるまでは、警告を表示した日の閉店までに初動の記録があること」を足した（影響分析サマリの境界値にある下限と同じ内容） / `vp-qe-verifiability` / -
- R4-3: R4 / Frontmatter・1. 目的と適用範囲 / `based_on` と本文の変更要求 `cr-2026-004` は、rulebook の「推奨 Frontmatter 項目」が求める変更要求の個票 ID（`PJR-XXXX`）と合わない。同じ系列では業務・I/F・テストの sample が `cr-2026-004`、データの sample が `pjr-c4a1`（本文は `PJR-C4A1`）と割れている / - / `vp-arc-technical-constraints`。この sample だけを直すとほかの影響調査の sample とずれるため直していない。R5 で系列の全 sample を `PJR-C4A1` に揃える案と、rulebook 側を直す案を比べてほしい / 要判断
- R4-4: R4 / 4. 影響詳細一覧 / 委譲先の `opd-monitoring`・`opd-incident-management`・`opd-integrity-check` は、駄菓子屋の仮定の成果物 ID で正本がなく確かめられない。`opd-index-sample` が分冊として挙げるのは監視・障害対応・権限の 3 冊だけで、`opd-integrity-check` はない（`imp-data-sample` も同じ ID を使っている） / - / `vp-dev-implementation-readiness`。R5 で `opd-index-sample` の分冊、または `opr-*` との整合を判断してほしい / 要判断
- R4-5: R4 / 5. 対応方針 / grade F002（対応方針の「完了条件」列が rulebook の必須列にない）は種別の構成への準拠の観点なので、この段では扱わない / - / `vp-qe-kata-conformance` は R1 と R5 の観点 / -

## 4. 進め方と実践の型の適用

sample の事実（ID の形、列挙値、ロールコード、日付、期間）を `register-item-frontmatter.schema.yaml`、`pm-roles-sample.yaml`、`imp-data-sample` と突き合わせた。正本と食い違う ID だけを最小限に直し、正本のない仮定の値と系列全体にかかわる判断は直さず、要判断として申し送った。前の段の指摘は繰り返していない。
