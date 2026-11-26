---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-data-sample-150-20261126t075345z-db111cb6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-data-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-data-sample-150/T-KATA-REVIEW-ALL-imp-data-sample-150-20261126T075345Z-db111cb6/plan.md
  started_at: "2026-11-26T07:53:55.693Z"
  completed_at: "2026-11-26T08:02:10.698Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-data-sample
    - specdojo:imp-data-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `imp-data-sample` を兄弟 sample と照合し、成功条件の表現とデータ量の扱いの 2 件の食い違いを sample 側で直した。
- 変更要求 ID の系列内の食い違い（`PJR-C4A1` と `cr-2026-004`）は相手側の修正が要るため、sample は変更せず直す案を申し送った。
- F001・F002（`based_on` の `cr-2026-004`）は evidence 上、R1 で解消済みとされており、この段では再修正していない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 2. 変更要求の概要（狙い） | 影響調査（業務）の成功条件を「混雑時の 1 会計あたり平均 90 秒以内」と書いており、imp-business-sample の成功条件「平日 16:00-18:00 の 1 会計あたり平均処理時間が 90 秒以内」と表現が食い違う。 | 「平日 16:00-18:00 の 1 会計あたり平均処理時間 90 秒以内」に直した。 | `vp-qe-kata-conformance`（kata 相互）、imp-business-sample の「変更要求の概要」の成功条件の表 | - |
| R5-2 | R5 | 1. 目的と適用範囲（対象外のデータ領域） | imp-test-sample は性能テストを対象外とし、データ量への影響は `imp-data` で確認するとしている。しかし imp-data-sample にはデータ量の判断がない。 | 対象外にデータ量を足した。理由は、1 日の会計件数が変わらず、増えるのは値引き 1 件ごとのキャンペーン適用履歴の追記だけであることとした。 | `vp-dev-change-impact`、`vp-qe-kata-conformance`、imp-test-sample の「目的と適用範囲」の対象外のテスト範囲 | - |
| R5-3 | R5 | frontmatter の `based_on` と 1. 目的と適用範囲（変更要求 ID） | 同じ変更要求を、imp-data-sample は `PJR-C4A1`（`based_on` は `pjr-c4a1`）と書く。imp-business・imp-interface・imp-operations・imp-test の各 sample は本文と `based_on` で `cr-2026-004` と書いており、系列内で ID が食い違う。 | -（sample 側の変更はなし。相手側の `based_on` と本文の変更要求 ID を、R4-1 で決まった形にそろえる案） | `vp-qe-kata-conformance`（kata 相互）。F001・F002 は R1 で解消済み、rulebook と schema のずれは R4 で指摘済みのため繰り返さない。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-data-sample.md`: 「変更要求の概要」の成功条件を「平日 16:00-18:00 の 1 会計あたり平均処理時間 90 秒以内」に直し、imp-business-sample と表現をそろえた。目的と適用範囲の対象外にデータ量を追加した。理由は、1 日の会計件数が変わらず、増えるのは値引き 1 件ごとのキャンペーン適用履歴の追記だけであることとした。imp-test-sample が性能テストの対象外として委ねたデータ量の判断を受ける形である。

## 3. 申し送り

- R5-3 の相手側の修正は、imp-business-sample・imp-interface-sample・imp-operations-sample・imp-test-sample の `based_on` と本文の変更要求 ID を、R4-1 で決まった形にそろえる。これらは本タスクでは変更していない。
- executor が実行した `npx prettier --check` は成功した。runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も成功した。
- R5-1: 段 R5 / 箇所: 2. 変更要求の概要（狙い） / 指摘: 影響調査（業務）の成功条件を「混雑時の 1 会計あたり平均 90 秒以内」と書いており、imp-business-sample の成功条件「平日 16:00-18:00 の 1 会計あたり平均処理時間が 90 秒以内」と表現が食い違う / 直した案: 「平日 16:00-18:00 の 1 会計あたり平均処理時間 90 秒以内」に直した / 根拠: `vp-qe-kata-conformance`（kata 相互）、imp-business-sample の「変更要求の概要」の成功条件の表 / 印: -
- R5-2: 段 R5 / 箇所: 1. 目的と適用範囲（対象外のデータ領域） / 指摘: imp-test-sample は性能テストを対象外とし「データ量への影響は `imp-data` で確認する」と委ねているが、imp-data-sample にはデータ量の判断がない / 直した案: 対象外にデータ量を足し、1 日の会計件数が変わらず、増えるのは値引き 1 件ごとのキャンペーン適用履歴の追記だけであることを理由に書いた / 根拠: `vp-dev-change-impact`、`vp-qe-kata-conformance`、imp-test-sample の「目的と適用範囲」の対象外のテスト範囲 / 印: -
- R5-3: 段 R5 / 箇所: frontmatter の `based_on` と 1. 目的と適用範囲（変更要求 ID） / 指摘: 同じ変更要求を、imp-data-sample は `PJR-C4A1`（`based_on` は `pjr-c4a1`）、imp-business・imp-interface・imp-operations・imp-test の各 sample は本文と `based_on` で `cr-2026-004` と書き、系列内で ID が食い違う / 直した案: - / 根拠: `vp-qe-kata-conformance`（kata 相互）。相手側の imp-business-sample・imp-interface-sample・imp-operations-sample・imp-test-sample の `based_on` と本文の変更要求 ID を、R4-1（rulebook の `PJR-XXXX` と schema の `idRef` の食い違い）で決まった形にそろえる案。F001・F002 は R1 で解消済み、rulebook と schema のずれは R4 で指摘済みのため繰り返さない / 印: -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/imp-data-sample.md だけで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がないため）

## 4. 進め方と実践の型の適用

根拠にした資料は、同じ接頭辞の兄弟 sample（imp-business-sample、imp-test-sample など）、rulebook、Sample 記述標準の共通サンプル文脈である。食い違いのうち sample 側で直せるもの（成功条件の表現、データ量の判断の欠落）は直した。相手側を直すべき変更要求 ID の食い違いは変更せず、直す案を申し送った。rulebook と schema のずれは R4 で指摘済みのため繰り返していない。F001・F002 は R1 で解消済みとされ、本段では対象外とした。
