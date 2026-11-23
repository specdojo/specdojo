---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-prj-scope-sample-040-20261123t201257z-9960fa01
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-prj-scope-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-prj-scope-sample-040/T-KATA-WAVE-6-PROJECT-prj-scope-sample-040-20261123T201257Z-9960fa01/plan.md
  started_at: "2026-11-23T20:13:04.654Z"
  completed_at: "2026-11-23T20:19:17.032Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:prj-scope-sample
    - specdojo:prj-scope-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook を grade の指摘 (F001〜F007) に基づいて簡潔に整理しました。
- 禁止事項に「個人名・連絡先などの個人情報や非公開情報の記載」を追加しました (F001)。
- `based_on` と `depends_on` の関係を整理し、後続成果物への参照については `based_on` に含めない扱いを明記しました (F002)。
- 設計詳細（UI, API, DB 等）の委譲に関する重複した記述を削除しました (F003)。
- 「どの対象業務も支えない対象システムの行」に対する判定条件を、具体的な基準として記述しました (F004)。
- スコープ変更方針の推奨表において、影響を受ける成果物の扱いを「影響評価」の行に統合しました (F005)。
- rulebook において、H1 直下の導入文は任意とすることを定め、`template` との整合性をとりました (F006)。
- 用語の混在を解消するため、「スコープ外」という名称に統一しました (F007)。
- 各章の記述ガイドに、判断基準となる良い例・悪い例を追加しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/prj-scope-rulebook.md`: grade の指摘 (F001〜F007) に沿って、rulebook の章構成、必須項目、禁止事項、および記述ガイドを簡潔に整えました。具体的には、禁止事項への個人情報の追加、`based_on` に関する定義の明確化、設計詳細の委譲記述の整理、粒度判定基準の策定、スコープ変更方針における影響成果物の統合、導入文の任意規定、および「スコープ外」への用語統一を行いました。

## 3. 申し送り

- F006: `template` の章 5（境界の判断基準）および章 6（スコープ変更方針）が任意であることは、`template` 側でも示す必要があります。
- F006: `rulebook` では導入文を任意としましたが、`template` は依然として導入文を `_TODO_` で求めているため、`template` の段でこの任意性を反映させるか判断してください。
- F005: 影響成果物を「影響評価」行に統合したため、`sample` の影響評価の記載に合わせる必要があるか、`sample` の段で判断してください。
- F006: template の章 5（境界の判断基準）・章 6（スコープ変更方針）が任意だと template に示されていない。template 側で任意性を示す改訂が必要。
- F006: rulebook では H1 直下の導入文を任意と定めた。template は導入文を `_TODO_` で求めているため、任意であることを示すかどうかを template の段で判断する（sample は導入文なしのままで rulebook と整合）。
- F005: 影響を受ける成果物は推奨表の「影響評価」行に統合した。sample の影響評価の行に影響成果物の記載を足すかは sample の段で判断する。
- PJR-76N9: スコープ変更方針の「承認者」は文書の承認役割ではなくスコープ変更の手続きの中身として残した。
- 適用外の検証: `npm run validate:history-links`（変更は rulebook のみで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

rulebook を、指定された findings に基づいて簡潔にメンテナンスしました。既存の `sample`、`recipe`、`template` の実態に合わせて、`rulebook` 内の規定（特に導入文の扱い、項目の構成、禁止事項の具体例）を修正し、記述の重複や曖昧さを排除しました。
