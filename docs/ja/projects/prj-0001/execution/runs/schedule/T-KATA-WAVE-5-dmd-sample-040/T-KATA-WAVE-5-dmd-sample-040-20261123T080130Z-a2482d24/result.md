---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-dmd-sample-040-20261123t080130z-a2482d24
  type: exec-result
  task_id: T-KATA-WAVE-5-dmd-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-dmd-sample-040/T-KATA-WAVE-5-dmd-sample-040-20261123T080130Z-a2482d24/plan.md
  started_at: "2026-11-23T08:01:39.592Z"
  completed_at: "2026-11-23T08:27:36.666Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:dmd-sample
    - specdojo:dmd-rulebook
---

# Edit Result

## 1. 実施内容

- dmd-rulebook を grade の指摘（F001〜F008, F011, F012）および冗長な記述の解消に基づいて修正しました。
- F009（H1 規則）および F010（概要の要件）については、sample 側の不備として rulebook の規則は維持しています。
- F001/F004 に基づき、ε（許容差）の合意に関する記録先や、照合手順の定めの所在を規定しました。
- F005 に基づき、本文要件の表から 「（必須）」という冗長な表記を削除しました。
- F012 に基づき、用語の揺らぎ（「見積り」から「見積」）を修正しました。
- F002 に基づき、実データの記載禁止に関する事項を禁止事項に追記しました。
- prettier および markdownlint-cli2 による検証を行い、問題がないことを確認しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/dmd-rulebook.md`: grade の指摘に基づき、本文要件の表の簡略化、実データ記載の禁止事項の追記、許容差 ε に関する規定の追加、および用語の統一を行いました。

## 3. 申し送り

- F009: rulebook の H1 規則（`# データ移行設計: &lt;対象名&gt;`）は維持した。sample `docs/ja/specdojo/samples/dmd-sample.md` の H1「データ移行設計 サンプル」を規則に合わせる必要がある（sample の段）。
- F010: sample の概要に移行方式・移行期間・上位の成功条件を足す必要がある（sample の段）。
- F005: 本文要件の見出し10を「関連ドキュメント（必須）」から「関連ドキュメント」に改めたので, sample の見出しも追従させる必要がある。
- F001/F004: PJR-76N9 に従い, 確認者・承認者の Role code は本文要件に加えなかった。代わりに, εの合意の記録先（`mip-index` の成功条件や決定記録）を書くこと, 照合結果を確かめる手順は `mtp-&lt;term&gt;` で定めることを規定した。
- F012: 見出しが「性能/所要時間見積」で固定されているため, 本文の「見積り」を「見積」に揃えた（sample への影響はない）。
- sample は受注データ（orders）を題材にしている。sample の段で, 共通サンプル文脈（駄菓子屋）に揃っているかを確かめる必要がある。
- F005: 本文要件の見出し10を「関連ドキュメント（必須）」から「関連ドキュメント」に改めたので、sample の見出しも追従させる必要がある。
- F001/F004: PJR-76N9 に従い、確認者・承認者の Role code は本文要件に加えなかった。代わりに、εの合意の記録先（`mip-index` の成功条件や決定記録）を書くこと、照合結果を確かめる手順は `mtp-&lt;term&gt;` で定めることを規定した。
- F012: 見出しが「性能/所要時間見積」で固定されているため、本文の「見積り」を「見積」に揃えた（sample への影響はない）。
- sample は受注データ（orders）を題材にしている。sample の段で、共通サンプル文脈（駄菓子屋）に揃っているかを確かめる必要がある。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/rulebooks/dmd-rulebook.md のみで、plan/result/個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown ファイルのみで、`*.yaml` / `*.yml` を変更していない）

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と成果物の `done_criteria` に沿って簡潔に整えました。rulebook に完成例の章を置かず、記述ガイドとして章ごとの判断基準や禁止事項を整理しました。また、既存の記述において冗長な箇所（本文要件の「(必須)」など）を解消し、情報の正確性と整合性を高めています。
