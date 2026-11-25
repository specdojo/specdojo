---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-incident-sample-150-20261125t025953z-e4b808e5
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-incident-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-incident-sample-150/T-KATA-REVIEW-ALL-opr-incident-sample-150-20261125T025953Z-e4b808e5/plan.md
  started_at: "2026-11-25T03:00:03.641Z"
  completed_at: "2026-11-25T03:13:43.754Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-incident-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`opr-incident-sample.md` を兄弟の分冊や `opr-sample` と食い違わないよう 3 点直した。1 つ目は差分元を `opr-sample`（`opr-index`）にそろえたこと、2 つ目は緊急権限の参照先を手順の分冊 `opr-access-control-sample` に改めたこと、3 つ目はロールバックを戻す条件を差分元の記述にそろえたことである。
- `opr-sample.md` は直す点がなく変更していない。
- 指摘 F001・F004（`vp-po-decision-readiness`・`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点とされているため、R5 では扱っていない。F002（`vp-qe-verifiability`）は R4 の観点で R5 の範囲外であり、概要の未決事項の表に証跡の保管期間の行がすでにあると executor が確認している。F003 は別 kata（`opr-index-sample`）側の修正案を handoff に残した。
- executor は `npx prettier --write` と `npx markdownlint` を対象ファイルに実行し、どちらも passed だった。runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-incident-sample.md`: 概要の第 1 文、関連導線の差分元の行、frontmatter の `based_on` を `opr-sample`（`opr-index`）にそろえ、`based_on` に `specdojo:opr-sample` を足した。必要権限とアカウント付与・剥奪手順の緊急権限の参照先を `opr-access-control-sample` の手順に改め、関連導線にその行を足した。停止・切替とロールバックの判断の表では、ロールバックの「元に戻す条件」を、戻した後に適用時と同じ確認を終えたこととして差分元の記述にそろえた。

## 3. 申し送り

- R5 の指摘 No: 4 は要判断で、別 kata（F003 に当たる）なので変更していない。`opr-index-sample.md` の関連導線は、「分冊は障害対応だけ」という説明が実態と合わない。分冊 sample は 7 つあり、`opr-sample` の関連導線がそれらを挙げている。直す案は 2 つある。1 つ目は、表の前の文を「本書から切り出した分冊の対応を示す」に改め、monitoring・backup-restore・batch・change・access-control・support の行を足すこと。2 つ目は、分冊の一覧を `opr-sample` に任せる 1 文にすることである。
- No: 5 は `opr-batch-sample.md` の `based_on` の食い違いで、変更していない。修飾されていない `opd-index` を書いているので、`specdojo:opd-index-sample` と `specdojo:opr-sample` の 2 行に直す案である。
- No: 6 は要判断で、変更していない。`opr-monitoring-sample.md` と `opr-access-control-sample.md` は、本文で `opr-sample` を差分元としているのに、`based_on` に `specdojo:opr-sample` がない。両方に足す案である。
- No: 1 / 段: R5 / 箇所: opr-incident-sample.md 概要の第 1 文、関連ドキュメント導線の差分元の行、frontmatter の `based_on` / 指摘: 差分元を opr-index-sample としており、ほかの分冊の多く（support・change・backup-restore・monitoring・access-control）が [[specdojo:opr-sample|運用手順]]（`opr-index`）を差分元とし、opr-sample も分冊が自分の証跡・優先度・承認の規約を参照すると書くのと食い違う / 直した案: 概要を「[[specdojo:opr-sample|運用手順]]（`opr-index`）の障害対応手順を具体化する分冊であり、証跡・優先度・承認の規約は `opr-index` に従う」とし、導線の差分元の行を opr-sample に替え、`based_on` に specdojo:opr-sample を足した（差分を入れた） / 根拠: opr-sample.md の概要（分冊 `opr-&lt;term&gt;` は本書の規約を参照する）、opr-support-sample.md・opr-change-sample.md の概要と `based_on` / 印: なし
- No: 2 / 段: R5 / 箇所: opr-incident-sample.md の手順適用範囲・前提の「必要権限」、アカウント付与・剥奪手順 / 指摘: 手順の分冊なのに、記録の訂正の緊急権限を方針の `opd-access-control` に従うとしていた。opr-sample は緊急権限を手順の分冊 opr-access-control-sample の手順に従うとしており、opr-access-control-sample も緊急権限の手順を持つ / 直した案: 2 か所を [[specdojo:opr-access-control-sample|運用手順（権限・アカウント）]] の緊急権限の手順に従う、と改め、関連導線に opr-access-control-sample の行を足した（差分を入れた）。方針の opd-access-control-sample の行は残した / 根拠: opr-sample.md のアカウント付与・剥奪手順の最終段落、opr-access-control-sample.md の概要 / 印: なし
- No: 3 / 段: R5 / 箇所: opr-incident-sample.md の停止・切替とロールバックの判断の表、ロールバックの行の「元に戻す条件」 / 指摘: 「`opr-index` の運用変更作業のロールバックの完了条件」は、差分元（opr-sample）の運用変更作業の表にない言い方だった（表にあるのはロールバック条件と、戻した後に適用時と同じ確認を行う記述） / 直した案: 「`opr-index` の運用変更作業のとおり、戻した後に適用時と同じ確認を終えた」に改めた（差分を入れた） / 根拠: opr-sample.md の運用変更作業の表の後の段落 / 印: なし
- No: 4 / 段: R5 / 箇所: opr-index-sample.md の関連ドキュメント導線（`opd-index` 参照）の表の前の文と表 / 指摘: 「分冊は障害対応だけとし、ほかの作業領域は本書で完結する」と書いているが、分冊の sample は 7 つあり、opr-sample の関連導線はそれらをすべて挙げている（F003 に当たる） / 直した案（ほかの kata のため変えていない）: 表の前の文を「本書から切り出した分冊の対応を示す」に改め、opr-sample の関連導線と同じ分冊の行（monitoring・backup-restore・batch・change・access-control・support）を足す。または、分冊の一覧を opr-sample に任せる 1 文にする / 根拠: opr-sample.md の関連ドキュメント導線、opr-rulebook の frontmatter の sample 宣言 / 印: 要判断
- No: 5 / 段: R5 / 箇所: opr-batch-sample.md の frontmatter の `based_on` / 指摘: 修飾されていない `opd-index` を書いており、ほかの分冊の specdojo:opd-index-sample・specdojo:opr-sample と食い違う。本文の関連導線は [[specdojo:opr-sample|運用手順]] を参照している / 直した案（ほかの kata のため変えていない）: `based_on` を specdojo:opd-index-sample と specdojo:opr-sample の 2 行にする / 根拠: opr-support-sample.md・opr-change-sample.md の `based_on` / 印: なし
- No: 6 / 段: R5 / 箇所: opr-monitoring-sample.md と opr-access-control-sample.md の frontmatter の `based_on` / 指摘: 本文では [[specdojo:opr-sample|運用手順]]（`opr-index`）を差分元としているのに、`based_on` に specdojo:opr-sample がない / 直した案（ほかの kata のため変えていない）: 両方の `based_on` に specdojo:opr-sample を足す / 根拠: 両 sample の概要の第 1 文、opr-support-sample.md の `based_on` / 印: 要判断
- No: 7 / 段: R5 / 箇所: plan の grade finding F001・F004（`vp-po-decision-readiness`・`vp-ops-release-readiness`）、F002（`vp-qe-verifiability`） / 指摘: F001・F004 は kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点とされている（kata の承認と ready 化は登録簿で追うため）。F002 は R4 の観点で R5 の範囲外。opr-incident-sample は概要の未決事項の表に証跡の保管期間の行をすでに持っている / 直した案: R5 では扱わず、変えていない。F002 で直すことが残るなら R4 の段で扱う / 根拠: docs/ja/specdojo/guides/kata-guide.md の「kata の観点の組」 / 印: なし
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/opr-incident-sample.md だけで、plan・result・個票を変えていないため）

## 4. 進め方と実践の型の適用

根拠にしたのは次の資料である。kata-guide の「kata を agent でレビューする」と「kata の観点の組」、`opr-sample.md` の概要・関連導線・アカウント付与・剥奪手順・運用変更作業、`opr-support-sample.md` と `opr-change-sample.md` の概要と `based_on`、`opr-access-control-sample.md` の概要である。これらと照合して、差分元・緊急権限の参照先・ロールバック条件の食い違いを `opr-incident-sample.md` 側で直した。これは差分を入れた R5 の整合の修正である。F001・F004 は kata の段のレビューに使わない観点、F002 は R4 の観点であり、R5 の範囲外として見送った。F003 は相手側の sample を直す案として handoff に残した。grade result サイドカーは再評価時に更新されるため編集していない。frontmatter の `status` は `draft` のままである。
