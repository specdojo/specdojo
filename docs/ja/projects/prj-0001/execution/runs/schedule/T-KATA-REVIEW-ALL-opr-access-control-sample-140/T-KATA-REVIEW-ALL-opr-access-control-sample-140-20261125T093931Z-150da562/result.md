---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-access-control-sample-140-20261125t093931z-150da562
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-access-control-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-access-control-sample-140/T-KATA-REVIEW-ALL-opr-access-control-sample-140-20261125T093931Z-150da562/plan.md
  started_at: "2026-11-25T09:39:41.155Z"
  completed_at: "2026-11-25T09:54:32.875Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-access-control-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）を `docs/ja/specdojo/samples/opr-sample.md` に対して実施した。sample の事実を schema・rulebook・関連 sample と突き合わせた。
- 誤りは 1 件だけだった。「アカウント付与・剥奪手順」の章で、棚卸しの合格条件の参照先を分冊としていた。正本は `opd-access-control-sample` の棚卸しの節なので、そこへ直した。
- ほかの主張は正本と一致した。`closing_date`・`ticket_id`・`run_id` だけは、この題材の正本がないため確かめられなかった。
- grade の F001 と F004 は kata のレビューの段では使わない観点なので、この段では扱わなかった。F002 は概要の未決事項の表に「監査ログ以外の証跡の保管期間」の行があり、解消済みだった。F003 は R5 の観点であり、前の段までに関連導線の表が分冊をすべて作成済として列挙していたため、解消済みだった。
- 検証では、`npx prettier --check` と runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が成功した。そのほかの検査は、変更の種類により `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-sample.md`: 「アカウント付与・剥奪手順」の棚卸しの合格条件の参照先を、分冊から `[[specdojo:opd-access-control-sample|運用方針・設計（権限・アカウント）]]` に直した（1 行の差し替え）。差異の是正の参照先（分冊）は正しいため維持した。

## 3. 申し送り

- 確かめの表（主張ごとの結果）: | No | 主張 | 正本 | 結果 | | --- | --- | --- | --- | | 1 | frontmatter の `type: operations` | `deliverable-frontmatter.schema.yaml` | 一致 | | 2 | `rulebook`・`based_on`・`supersedes` | `opr-rulebook.md`、`common-frontmatter.schema.yaml` | 一致 | | 3 | 棚卸しの合格条件の参照先 | `opd-access-control-sample.md` の棚卸しの節 | 不一致のため直した | | 4 | 申請・承認・実施・検証・記録の流れと剥奪の期限 | `opd-access-control-sample.md`、`opr-access-control-sample.md` | 一致 | | 5 | 緊急権限の承認・失効・事後確認 | `opd-access-control-sample.md`、`opr-access-control-sample.md` | 一致 | | 6 | 監査ログの保管期間 1 年と参照権限 | `opd-index-sample.md`、`opr-access-control-sample.md` | 一致 | | 7 | 関連ドキュメント導線の wikilink | `docs/ja/specdojo/samples/op[dr]-*.md` の frontmatter の id | 一致 | | 8 | `closing_date`・`ticket_id`・`run_id` | 正本なし | 確かめられない。業務データ仕様の正本が要る |
- R4 確かめ No1: 主張「frontmatter の type: operations」/ 正本 docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml / 確かめ方: deliverableType の enum を読んだ / 結果: 一致 / 根拠: enum に operations がある
- R4 確かめ No2: 主張「rulebook: specdojo:opr-rulebook、`based_on`、supersedes」/ 正本 docs/ja/specdojo/rulebooks/opr-rulebook.md（推奨 Frontmatter 項目）、common-frontmatter.schema.yaml / 確かめ方: 読み取り / 結果: 一致 / 根拠: rulebook の表に specdojo:opr-rulebook があり、common schema が `based_on` と `supersedes` を定義している
- R4 確かめ No3: 主張「棚卸しで分冊の棚卸しの合格条件を確かめる」（アカウント付与・剥奪手順の章の棚卸しの段落）/ 正本 docs/ja/specdojo/samples/opd-access-control-sample.md（棚卸し）、opr-access-control-sample.md（日次・週次・月次点検手順）/ 確かめ方: 読み取り / 結果: 不一致 / 根拠: 合格条件の 5 項目は opd-access-control-sample の棚卸しの節が定めており、分冊（opr-access-control）も「運用方針の棚卸しの 5 項目」と書いている。参照を [[specdojo:opd-access-control-sample|運用方針・設計（権限・アカウント）]] に直した。差異の是正の参照先（分冊の差異の是正）は正しいため維持した
- R4 確かめ No4: 主張「申請・承認・実施・検証・記録の流れと、剥奪の期限（店番をやめた日・保守作業が終わった日のうち）」/ 正本 opd-access-control-sample.md（付与・剥奪の契機）、opr-access-control-sample.md（付与・区分の変更・剥奪）/ 確かめ方: 読み取り / 結果: 一致 / 根拠: opd の契機の表は「やめた日のうち」「作業の終了を確かめた当日」で、意味は同じ範囲
- R4 確かめ No5: 主張「緊急権限は PO の承認後に OPS が DEV の区分を一時的に引き上げ、失効と事後確認を権限変更記録・棚卸し記録に残す」/ 正本 opd-access-control-sample.md（緊急権限）、opr-access-control-sample.md（緊急権限）/ 確かめ方: 読み取り / 結果: 一致 / 根拠: 分冊の表で失効の証跡は監査ログと権限変更記録、事後確認の証跡は棚卸し記録
- R4 確かめ No6: 主張「証跡表の監査ログは保管期間 1 年、参照権限は OPS・PO。権限変更記録と棚卸し記録はプロジェクトの課題管理に残す」/ 正本 opd-index-sample.md（権限・アカウント運用）、opr-access-control-sample.md（証跡）/ 確かめ方: 読み取り / 結果: 一致 / 根拠: opd-index に「保管期間は 1 年」とある。分冊の証跡表と保存先・参照権限が同じ
- R4 確かめ No7: 主張「関連ドキュメント導線の表の wikilink」/ 正本: `docs/ja/specdojo/samples/op[dr]-*.md` の frontmatter の id / 確かめ方: grep で id を列挙 / 結果: 一致 / 根拠: opr-index・opd-index・opd-incident-management・opr-incident・opr-monitoring・opr-backup-restore・opr-batch・opr-change・opr-access-control・opr-support の各 sample の id が存在する
- R4 確かめ No8: 主張「識別子 `closing_date`・`ticket_id`・`run_id`」/ 正本: なし（schema・src・コマンドリファレンスに、この題材の正本がない）/ 確かめ方: grep で sample を照合 / 結果: 確かめられない / 根拠: 照合できたのは opr-index-sample・opr-batch-sample の表記の一致だけ。確かめるには業務データ仕様の正本が要る
- grade の finding の扱い: F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata の段のレビューでは使わない観点のため扱わない。F002（`vp-qe-verifiability`）は、概要の未決事項の表に「監査ログ以外の証跡の保管期間」の行があり、解消済み。F003（`vp-qe-kata-conformance`）は R5 の観点で、前の段までに関連導線の表が分冊をすべて作成済として列挙しており、解消済み
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/opr-sample.md だけで、plan・result・個票の履歴ファイルを変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として実施した。sample の事実の主張を、schema・rulebook・関連する opd/opr の sample と突き合わせた。確かめの結果は不一致 1 件、確かめられない 1 件、一致 6 件だった。不一致の 1 件は正本へ向けて直し、確かめられない 1 件は表に残した。grade の finding は F001・F004 を観点が段に合わないため扱わず、F002・F003 は前の段までに解消済みであることを確認した。
