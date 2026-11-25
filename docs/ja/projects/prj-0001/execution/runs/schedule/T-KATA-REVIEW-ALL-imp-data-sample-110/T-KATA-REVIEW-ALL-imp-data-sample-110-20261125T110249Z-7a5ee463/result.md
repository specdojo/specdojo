---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-data-sample-110-20261125t110249z-7a5ee463
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-data-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-data-sample-110/T-KATA-REVIEW-ALL-imp-data-sample-110-20261125T110249Z-7a5ee463/plan.md
  started_at: "2026-11-25T11:02:59.109Z"
  completed_at: "2026-11-25T13:01:35.379Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-data-sample
    - specdojo:imp-data-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）の段として、`imp-data-sample` の frontmatter `based_on` を `cr-2026-004` から `pjr-c4a1` に直しました。本文の目的と適用範囲にある変更要求の表記も `PJR-C4A1` に揃えました。これで F001・F002 は解消しました。
- rulebook は `PJR-XXXX` 形式を求めますが、スキーマ `common-frontmatter.schema.yaml` の `idRef` は pattern `^[a-z0-9][a-z0-9-:]*$` で大文字を受け付けません。そのため frontmatter では英小文字の `pjr-c4a1` にしました。rulebook とスキーマのずれは、未変更のまま要判断として申し送ります。
- 親 runner の検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed でした。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R1 | `docs/ja/specdojo/samples/imp-data-sample.md` の frontmatter `based_on` | 入力の変更要求が `cr-2026-004` のままで、rulebook が求める個票 ID になっていない（F001・F002）。 | `based_on` を `pjr-c4a1` にし、本文の目的と適用範囲の変更要求の表記を `PJR-C4A1` に揃えた。 | [[specdojo:imp-data-rulebook]] の Frontmatter 規約と、`common-frontmatter.schema.yaml` の `idRef`（pattern `^[a-z0-9][a-z0-9-:]*$`）。大文字の `PJR-C4A1` は `lint-fm-changed` で失敗した。 | 要判断 |
| 2 | R1 | [[specdojo:imp-data-rulebook]] の Frontmatter 規約 | rulebook は `based_on` に `PJR-XXXX` 形式を求めるが、スキーマの `idRef` は大文字を受け付けない。sample は両方を同時には満たせない。 | rulebook は未変更。「`based_on` には英小文字にした個票 ID（例: `pjr-xxxx`）を記載し、本文では `PJR-XXXX` と表記する」と直す案がある。スキーマ側で大文字を認める案もある。 | `common-frontmatter.schema.yaml` の `idRef`。 | 要判断 |
| 3 | R1 | 兄弟の sample（`imp-business-sample`・`imp-interface-sample`・`imp-operations-sample`・`imp-test-sample`）の `based_on` | 4 件とも `cr-2026-004` のままで、同じ変更要求の ID がこの sample とだけ違う。 | 各 sample のレビューの段で `pjr-c4a1`（本文は `PJR-C4A1`）に揃える。この段では対象外のため未変更。 | 各 sample の frontmatter と [[specdojo:imp-data-rulebook]]。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-data-sample.md`: frontmatter の `based_on` を `cr-2026-004` から `pjr-c4a1` に変更しました。本文の目的と適用範囲にある変更要求の表記も `PJR-C4A1` に揃えました。差分は 2 行です。

## 3. 申し送り

- rulebook の Frontmatter 規約とスキーマ `idRef` のずれ（findings の No 2）は、rulebook・スキーマとも未変更です。直す方針を人が判断してください。
- 兄弟の sample 4 件（`imp-business-sample`・`imp-interface-sample`・`imp-operations-sample`・`imp-test-sample`）の `based_on` は `cr-2026-004` のままです。各 sample のレビューの段で揃えてください。
- No: 1 / 段: R1 / 箇所: docs/ja/specdojo/samples/imp-data-sample.md の frontmatter `based_on` / 指摘: 入力の変更要求が `cr-2026-004` のままで、rulebook が求める個票 ID になっていない（F001・F002）。 / 直した案: `based_on` を `pjr-c4a1` にし、本文の目的と適用範囲の変更要求の表記を `PJR-C4A1` に揃えた。 / 根拠: [[specdojo:imp-data-rulebook]] の Frontmatter 規約にある「`based_on` には入力の変更要求の個票 ID（`PJR-XXXX`）を記載する」と、`docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` の `idRef` の pattern `^[a-z0-9][a-z0-9-:]*$`。大文字の `PJR-C4A1` は frontmatter 検査（`lint-fm-changed`）で失敗した。 / 印: 要判断
- No: 2 / 段: R1 / 箇所: [[specdojo:imp-data-rulebook]] の Frontmatter 規約 / 指摘: rulebook は `based_on` に `PJR-XXXX` 形式を求めるが、スキーマの `idRef` は大文字を受け付けないため、sample は両方を同時には満たせない。 / 直した案（rulebook は未変更）: 「`based_on` には入力の変更要求の個票 ID を英小文字にした形（例: `pjr-xxxx`）で記載し、本文では `PJR-XXXX` と表記する」と直す。スキーマ側で大文字を認める案もある。 / 根拠: `common-frontmatter.schema.yaml` の `idRef`。 / 印: 要判断
- No: 3 / 段: R1 / 箇所: 兄弟の sample（`imp-business-sample`・`imp-interface-sample`・`imp-operations-sample`・`imp-test-sample`）の `based_on` / 指摘: 4 件ともまだ `cr-2026-004` のままで、同じ変更要求の ID がこの sample とだけ違う。 / 直した案: 各 sample のレビューの段で `pjr-c4a1`（本文は `PJR-C4A1`）に揃える。この段では対象外のため未変更。 / 根拠: 各 sample の frontmatter と [[specdojo:imp-data-rulebook]]。 / 印: 要判断

## 4. 進め方と実践の型の適用

根拠にした規範は、[[specdojo:imp-data-rulebook]] の Frontmatter 規約（`based_on` に入力の変更要求の個票 ID を記載する）と、`docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` の `idRef` です。F001・F002 は、`cr-2026-004` が個票 ID でないという指摘でした。そこで `based_on` を個票 ID に置き換えました。大文字の `PJR-C4A1` は frontmatter 検査で失敗したため、frontmatter は英小文字の `pjr-c4a1` にし、本文は `PJR-C4A1` のままにしました。それ以外の記述は根拠と整合しているため維持しました。rulebook と schema が食い違う箇所は、rulebook を直さず要判断として残しました。
