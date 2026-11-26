---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-operations-sample-150-20261126t075731z-ddd570b0
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-operations-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-operations-sample-150/T-KATA-REVIEW-ALL-imp-operations-sample-150-20261126T075731Z-ddd570b0/plan.md
  started_at: "2026-11-26T07:57:41.173Z"
  completed_at: "2026-11-26T08:06:46.851Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-operations-sample
    - specdojo:imp-operations-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、運用の影響調査 sample を同系列の業務 sample と突き合わせた。対応方針の表の日次締めの行の「前提条件」を、業務 sample の更新期限 2026-05-27 と日付で対応付けられる書き方に直した。
- grade F001（`vp-qe-verifiability`、成功条件 2 の上限時間）は、前の段で暫定の判定基準が併記され解消済みのため、本段では扱っていない。
- grade F002（`vp-qe-kata-conformance`、「完了条件」列）は、rulebook 側の修正案を findings に記録した。rulebook は本タスクで変更していない。
- 整形（prettier）は差分なしで通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 | docs/ja/specdojo/samples/imp-operations-sample.md「対応方針」表の日次締めの行「前提条件」 | 前提条件が「確認項目が確定していること（影響調査（業務））」で、業務 sample の対応項目「日次締めの確認項目の更新」（2026-05-27 まで）と日付で突き合わせられなかった。 | 「日次締めの確認項目の更新が終わっていること（影響調査（業務）で 2026-05-27）」へ直した（差分適用済み）。 | `specdojo:imp-business-sample` の対応方針の表、および監視の行の前提条件の書き方。 | 修正済み |
| 2 | R5 | docs/ja/specdojo/rulebooks/imp-operations-rulebook.md「本文要件」必須列の表の「対応方針」行、記述ガイド「対応方針」 | grade F002（`vp-qe-kata-conformance`）。sample の対応方針の表にある「完了条件」列が運用の rulebook の必須列にない。imp-business と imp-interface の rulebook は「完了条件」を必須列とし、両 sample も同じ列を持つ。imp-data と imp-test の rulebook と sample には同じ列がない。 | sample の列は残す。運用の rulebook の必須列を「影響度、対応項目、期限、担当、前提条件、完了条件」とし、記述ガイド「対応方針」に「完了条件は達成を判定できる状態で書く」の 1 行と良い例・悪い例を足す。data と test の rulebook にも足すかは系列全体で決める。rulebook は本タスクでは変更していない。 | imp-business-rulebook と imp-interface-rulebook の本文要件。rulebook の禁止事項は異なる列名を禁じているが、追加の列は禁じていない。 | 要判断 |
| 3 | R5 | docs/ja/specdojo/samples/imp-data-sample.md の frontmatter `based_on`（`pjr-c4a1`）と本文「目的と適用範囲」（`PJR-C4A1`） | 同じ変更要求を、データ sample だけが `PJR-C4A1` と書き、運用・業務・I/F・テストの sample は `cr-2026-004` と書いており、系列で ID が食い違う。運用の rulebook「推奨 Frontmatter 項目」は `based_on` に個票 ID（`PJR-XXXX`）を書くよう求めている。 | 系列の変更要求の ID を 1 つに決めて、全 imp sample の `based_on` と本文をそろえる。rulebook に従うなら個票 ID 形式へ、多数の sample に合わせるなら `cr-2026-004` へそろえ、rulebook の記述と矛盾しないようにする。運用 sample は単独では変更しない。 | imp-operations-rulebook「推奨 Frontmatter 項目」、および各 imp sample の frontmatter。 | 要判断 |
| 4 | R5 | docs/ja/specdojo/samples/imp-operations-sample.md「対応方針」日次締めの行「完了条件」と `specdojo:imp-business-sample` の未解決事項「値引き内訳の確認項目の確定」（`PJR-B4Q3`） | 業務 sample は日次締めで確かめる値引きの集計単位（種別別・商品別）を未決とし、当面は値引き額の合計だけを確かめるとしている。一方、運用とデータの sample は「値引き理由別の合計」を前提にしている。 | `PJR-B4Q3` の確定時に、業務 sample の集計単位を影響調査（データ）の値引き理由の区分（`PJR-D4Q1`）とそろえ、運用 sample の完了条件「値引き理由別の合計が記録に残る」を確定した単位で見直す。 | imp-business-sample の未解決事項、および imp-data-sample の影響詳細一覧の売上明細の行。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-operations-sample.md`: 対応方針の表の日次締めの行の「前提条件」を、「確認項目が確定していること（影響調査（業務））」から「日次締めの確認項目の更新が終わっていること（影響調査（業務）で 2026-05-27）」へ直した。業務 sample の対応項目と期限を日付で突き合わせられる。変更は 1 行のみ。

## 3. 申し送り

- No: 1 / 段: R5 / 箇所: docs/ja/specdojo/samples/imp-operations-sample.md「対応方針」表の日次締めの行「前提条件」 / 指摘: 前提条件が「確認項目が確定していること（影響調査（業務））」で、業務 sample の対応項目「日次締めの確認項目の更新」（2026-05-27 まで）と日付で突き合わせられなかった / 直した案: 「日次締めの確認項目の更新が終わっていること（影響調査（業務）で 2026-05-27）」へ直した（差分適用済み） / 根拠: specdojo:imp-business-sample の対応方針の表、監視の行の前提条件の書き方 / 印: 修正済み
- No: 2 / 段: R5 / 箇所: docs/ja/specdojo/rulebooks/imp-operations-rulebook.md「本文要件」必須列の表の「対応方針」行、記述ガイド「対応方針」 / 指摘: grade F002（`vp-qe-kata-conformance`）。sample の対応方針の表にある「完了条件」列が運用の rulebook の必須列にない。imp-business と imp-interface の rulebook は「完了条件」を必須列とし、両 sample も同じ列を持つ。imp-data と imp-test の rulebook・sample には同じ列がない / 直した案: sample の列は残し、運用の rulebook の必須列を「影響度、対応項目、期限、担当、前提条件、完了条件」とし、記述ガイド「対応方針」に「完了条件は達成を判定できる状態で書く」の 1 行と良い例・悪い例を足す。data と test の rulebook にも足すかは系列全体で決める（rulebook は本タスクでは変更しない） / 根拠: imp-business-rulebook と imp-interface-rulebook の本文要件、rulebook の禁止事項は異なる列名を禁じているが追加の列は禁じていない / 印: 要判断
- No: 3 / 段: R5 / 箇所: docs/ja/specdojo/samples/imp-data-sample.md の frontmatter `based_on`（`pjr-c4a1`）と本文「目的と適用範囲」（`PJR-C4A1`） / 指摘: 同じ変更要求を、データ sample だけが `PJR-C4A1` と書き、運用・業務・I/F・テストの sample は `cr-2026-004` と書いており、系列で ID が食い違う。運用の rulebook「推奨 Frontmatter 項目」は `based_on` に個票 ID（`PJR-XXXX`）を書くよう求めている / 直した案: 系列の変更要求の ID を 1 つに決めて全 imp sample の `based_on` と本文をそろえる。rulebook に従うなら個票 ID 形式へ、多数の sample に合わせるなら `cr-2026-004` へそろえ、rulebook の記述と矛盾しないようにする（運用 sample は単独では変更しない） / 根拠: imp-operations-rulebook「推奨 Frontmatter 項目」、各 imp sample の frontmatter / 印: 要判断
- No: 4 / 段: R5 / 箇所: docs/ja/specdojo/samples/imp-operations-sample.md「対応方針」日次締めの行「完了条件」と specdojo:imp-business-sample の未解決事項「値引き内訳の確認項目の確定」（`PJR-B4Q3`） / 指摘: 業務 sample は日次締めで確かめる値引きの集計単位（種別別・商品別）を未決とし、当面は値引き額の合計だけを確かめるとしている。一方、運用とデータの sample は「値引き理由別の合計」を前提にしている / 直した案: `PJR-B4Q3` の確定時に、業務 sample の集計単位を影響調査（データ）の値引き理由の区分（`PJR-D4Q1`）とそろえ、運用 sample の完了条件「値引き理由別の合計が記録に残る」を確定した単位で見直す / 根拠: imp-business-sample 未解決事項、imp-data-sample 影響詳細一覧の売上明細の行 / 印: 要判断
- grade F001（`vp-qe-verifiability`、成功条件 2 の上限時間）は、前の段で成功条件の判定方法に暫定の基準（警告を表示した日の閉店までに初動の記録）が併記され、解消済みのため本段では扱っていない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/imp-operations-sample.md のみで、plan / result / 個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

参照先の業務 sample（`specdojo:imp-business-sample`）の対応方針の表と前提条件の書き方を根拠に、運用 sample 側だけを直した。運用 rulebook の必須列、データ sample の `based_on` の ID、業務 sample の集計単位は相手側の修正になる。そのため sample では変更せず、直す案を findings に記録した。F001 は前の段で解消済みのため扱っていない。F002 は rulebook を正とする照合の結果、rulebook 側の修正案とし、sample の列は残した。
