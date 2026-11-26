---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifd-sample-150-20261126t151312z-401c2845
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifd-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifd-sample-150/T-KATA-REVIEW-ALL-ifd-sample-150-20261126T151312Z-401c2845/plan.md
  started_at: "2026-11-26T15:13:22.632Z"
  completed_at: "2026-11-26T15:18:39.345Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:ifd-sample
    - specdojo:ifd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として `ifd-sample` を、同じ接頭辞の sample・参照先・共通サンプル文脈と突き合わせて見直した。
- sample 側では 2 点を直した。frontmatter から登録簿の項目用の欄 `owner` を外し、「図に描かない要素」に店舗プリンタへのレシート印刷を明記した。
- 相手側の文書は変更していない。`etc-index-sample` などの食い違いは、相手側を直す案として handoff と findings に残した。
- executor の検査では prettier と markdownlint が通った。runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | frontmatter | frontmatter に `owner: ARC` がある。schema では `owner` は登録項目の担当ロール用の欄と説明されている。rulebook の推奨 Frontmatter 項目にもなく、同じ architecture の `cnd-sample`・`clis-sample` も持たない。 | `owner: ARC` を削除した。`cpd-sample.md`・`sysd-critical-flows-sample.md` にも同じ欄があり、相手側から削除する案（未変更）。 | vp-qe-kata-conformance（kata 相互） | - |
| R5-2 | R5 | 3. 配置と境界の定義 | `etc-index-sample.md` の 30 行目は、ifd の経路に店舗プリンタを動かす `receipt-print` コマンドが含まれると書く。しかし ifd にはプリンタの要素も経路もない。ifd の概要は、`cnd-sample`・`clis-sample` の印字経路を設計根拠にしないと明記している。`receipt-print` は `ifx-cmd-sample`（`based_on`: `clis-sample`）の連携先である。 | ifd 側は、図に描かない要素に「店舗プリンタへのレシート印刷」を追記した。相手側は、`etc-index-sample.md` の 30 行目を「ifd の経路のうち復元用保管サービス（`PATH-05`・`PATH-06`）と、ifd の経路外で `ifx-cmd-sample` が定める `receipt-print` コマンド」と書き分ける案（未変更）。`tsp-index-sample`・`itc-index-sample`・`itc-sample` の `receipt-print` の扱いも同じ観点で確かめる。 | vp-qe-kata-conformance（適用先）、vp-dev-change-impact。迷った理由: ifd に印刷の経路（例 `PATH-08`）を足してテスト系 sample の前提に合わせる案もある。ifd が店頭の記録と保全に絞る範囲と、`cnd-sample`・`clis-sample` を根拠にしない方針を崩すため、選ばなかった。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifd-sample.md`: frontmatter から `owner: ARC` を削除した。schema では登録項目の担当ロール用の欄で、rulebook の推奨項目にもなく、同じ architecture の `cnd-sample`・`clis-sample` も持たないため。あわせて、図に描かない要素に「店舗プリンタへのレシート印刷」を追記し、ifd の経路外であることを明示した。

## 3. 申し送り

- `cpd-sample.md` と `sysd-critical-flows-sample.md` にも `owner` 欄が残っている。相手側から削除する案で、この task では変更していない。
- `etc-index-sample.md` の `receipt-print` の書き方は、相手側を直す案として findings に記録した。`tsp-index-sample`・`itc-index-sample`・`itc-sample` の扱いも同じ観点で確認が必要。
- R5-1: R5 / frontmatter / frontmatter に `owner: ARC` がある。schema（`deliverable-frontmatter.schema.yaml`）では `owner` は登録項目の担当ロール用の欄と説明され、rulebook の推奨 Frontmatter 項目にもなく、同じ architecture の `cnd-sample`・`clis-sample` も持たない / `owner: ARC` を削除した。`cpd-sample.md`・`sysd-critical-flows-sample.md` にも同じ欄があり、相手側から削除する案（未変更） / vp-qe-kata-conformance（kata 相互） / -
- R5-2: R5 / 3. 配置と境界の定義 / `etc-index-sample.md` の 30 行目は ifd の経路に店舗プリンタを動かす `receipt-print` コマンドが含まれると書くが、ifd にはプリンタの要素も経路もなく、概要で `cnd-sample`・`clis-sample` の印字経路を設計根拠にしないと明記している。`receipt-print` は `ifx-cmd-sample`（`based_on`: `clis-sample`）の連携先である / ifd 側は、図に描かない要素に「店舗プリンタへのレシート印刷」を追記した。相手側は、`etc-index-sample.md` の 30 行目を「ifd の経路のうち復元用保管サービス（`PATH-05`・`PATH-06`）と、ifd の経路外で `ifx-cmd-sample` が定める `receipt-print` コマンド」と書き分ける案（未変更）。`tsp-index-sample`・`itc-index-sample`・`itc-sample` の `receipt-print` の扱いも同じ観点で確かめる / vp-qe-kata-conformance（適用先）、vp-dev-change-impact。迷った理由: ifd に印刷の経路（例 `PATH-08`）を足してテスト系 sample の前提に合わせる案もある。ifd が店頭の記録と保全に絞る範囲と、`cnd-sample`・`clis-sample` を根拠にしない方針を崩すため、選ばなかった / 要判断
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ifd-sample.md のみで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

参照の向きを「成果物 → sample」に切り替え、`ifd-sample` を、同じ接頭辞の sample、`deliverable-frontmatter.schema.yaml`、rulebook の推奨 Frontmatter 項目、同種 sample と照合した。sample 側で直せる食い違いだけを差分にした。相手側を直すべき点は変更せず、案を残した。plan に展開された grade finding と condense finding はなかった。frontmatter の `status` は変更していない。
