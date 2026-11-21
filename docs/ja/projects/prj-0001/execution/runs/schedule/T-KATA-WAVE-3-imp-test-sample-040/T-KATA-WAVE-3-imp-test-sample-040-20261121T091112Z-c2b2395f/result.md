---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-imp-test-sample-040-20261121t091112z-c2b2395f
  type: exec-result
  task_id: T-KATA-WAVE-3-imp-test-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-imp-test-sample-040/T-KATA-WAVE-3-imp-test-sample-040-20261121T091112Z-c2b2395f/plan.md
  started_at: "2026-11-21T09:11:19.338Z"
  completed_at: "2026-11-21T09:18:36.991Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:imp-test-sample
    - specdojo:imp-test-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook である `docs/ja/specdojo/rulebooks/imp-test-rulebook.md` を、grade の指摘に基づいて簡潔に整えました。
- 役割の指定に `Role code` を使用することを明記し、入力となる変更要求の所在や、判断結果を反映する後続成果物（テスト計画・テスト仕様など）の位置づけを追加しました。
- 表（テーブル）の構成において、必須の列名と用語を統一し、行の単位（テストレベル・観点・条件・ケース・判定基準）を明確に定義しました。
- 「対象期間」の定義、PJR への転記基準、および担当表記における個人名の使用禁止事項を記述ガイドに追加しました。
- 記述ガイドとして、各章ごとの判断基準と、良い例・悪い例を盛り込みました。
- 章構成を `rulebook-authoring-standard` に合わせ、既存の「本文構成（標準テンプレ）」から「本文要件」へと名称を変更しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/imp-test-rulebook.md`: grade の指摘に基づき、役割の記述方法、関連文書の位置づけ、表の構成要素（列名・行の単位）、対象期間の定義、PJR への転記基準、および担当表記の禁止事項を整備しました。また、執筆ガイドとして章ごとの判断基準と具体例を追加し、章名を `rulebook-authoring-standard` に準拠した「本文要件」に変更しました。

## 3. 申し送り

- sample 側の指摘（F012〜F016、F018、F019）は未解消。後続の sample-maintenance で、`docs/ja/specdojo/samples/imp-test-sample.md` を新しい本文要件に合わせて直す必要がある。直す点: 対象外のテスト範囲・対象期間・成功条件を足す。影響度の尺度と集約規則を定義する。影響詳細一覧の行をテストレベル×テスト観点にする。判断根拠に評価観点ごとの事実と集約結果を書く。対応方針の列を「影響度・対応項目・期限・担当・前提条件」に揃え、担当を Role code にする。未解決事項に「判断・対応への影響」「当面の扱い」「転記先の登録項目」を足す。
- F009・F020（`target_format: markdown` の宣言と、`recipe`・`template` の要否の確定）は、frontmatter を変えない計画のため見送った. template は PJR-WYTX で扱い、recipe の要否は人が判断する。
- rulebook の章名を「本文構成（標準テンプレ）」から「本文要件」に変えた（`rulebook-authoring-standard` に合わせた）. Sample 記述標準は対応 rulebook の「本文構成（標準テンプレ）」を参照しているため、sample-maintenance では「本文要件」を正として読む。
- F009・F020（`target_format: markdown` の宣言と、`recipe`・`template` の要否の確定）は、frontmatter を変えない計画のため見送った。template は PJR-WYTX で扱い、recipe の要否は人が判断する。
- rulebook の章名を「本文構成（標準テンプレ）」から「本文要件」に変えた（`rulebook-authoring-standard` に合わせた）。Sample 記述標準は対応 rulebook の「本文構成（標準テンプレ）」を参照しているため、sample-maintenance では「本文要件」を正として読む。
- 適用外の検証: `npm run validate:history-links`（変えたのは docs/ja/specdojo/rulebooks/imp-test-rulebook.md だけで、plan・result・pjr 個票はどれも変えていない）
- 適用外の検証: `npm run validate:schema:file`（変えたのは Markdown の rulebook だけで、`*.yaml` / `*.yml` は変えていない）

## 4. 進め方と実践の型の適用

対象の rulebook を、grade の指摘（finding）および `done_criteria` に基づいて簡潔に整える作業を行いました。具体的には、役割の定義、関連文書（変更要求の所在と後続成果物）の位置づけ、表の構成（列名・行の単位）、対象期間の定義、PJR への転記基準、および担当の表記規則を明文化しました。また、執筆者が判断に迷わないよう、記述ガイドとして章ごとの基準と事例を付加しました。
