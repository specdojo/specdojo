---
specdojo:
  id: prj-0001:xer-pjr-fs9a-20261106t121558z-4bab967f
  type: exec-result
  task_id: PJR-FS9A
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-FS9A/20261106T121558135Z-a63fc89c/plan.md
  started_at: "2026-11-06T12:16:17.692Z"
  completed_at: "2026-11-06T12:26:59.254Z"
  agent: sol-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-rulebook
---

# Edit Result

## 1. 実施内容

- stsd-rulebook において、遷移 ID の採番規則を改訂しました。
- 遷移 ID は、文書が `status: draft` の間は、図と表の順に `T-01` から欠番なく振り直してよいこと、および振り直した場合は旧 ID と新 ID の対応を作業記録へ残すことを明記しました。
- また、文書が `status: ready` になった後は、既存の ID を振り直さず、削除した ID を欠番として再利用しないという不変の規則を定めました。
- これにより、レビュー指摘と遷移 ID の不一致を防ぐための整合性を確保しています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/stsd-rulebook.md`: 遷移 ID の採番規則（`status: draft` 時の振り直しと、`status: ready` 時の不変・欠番再利用禁止のルール）を追記・更新しました。

## 3. 申し送り

- stsd-recipe の「全体の作成手順」に、更新時は常に既存 ID を保持する記述があります。確定前の振り直しと対応記録の規則に合わせる後続対応が必要です。対象外のため変更せず、個票の対応結果にも記録しました。
- stsd-template は「状態の判定」章がなく、図表が別章で、図の遷移ラベルにも ID がありません。現行 rulebook を正として整合させる後続対応が必要です。対象外のため変更せず、個票の対応結果にも記録しました。
- reporter 記録用の判断根拠: rulebook-authoring-standard、stsd-recipe・sample・template、stsd-mermaid-rulebook、共通レビュー観点を照合しました。F001 は利用者の決定に従い、確定前の対応記録と確定後の ID 保持で参照の取り違えを防ぐ規則へ改訂しました。完成判定・禁止事項には無条件の ID 不変を要求する記述がなく、変更不要です。F002 の管理場所・業務範囲は現行の本文要件表と記述ガイドで既に定義されており、維持しました。
- reporter 記録用の維持根拠: T-STSD-PILOT-stsd-job-run-080、stsd-register-entry-080、stsd-routine-run-080 の各 result と対応する成果物を確認しました。condense の retain 記録が指す図表対応と共有状態は、俯瞰・詳細の照合と図間の接続判断に必要です。`vp-arc-conciseness` に照らして規定を維持しました。ほかの Kata と docs/ja/product/ 配下は変更していません。
- 適用外の検証: `npm run validate:schema:file`（executor が変更したファイルは Markdown のみで、YAML・YML の変更がないため。）

## 4. 進め方と実践の型の適用

`stsd-rulebook` を読み込み、遷移 ID のライフサイクル（`draft` 時の変更可能性と `ready` 時の不変性）に関する規定を追加しました。F001 の指摘に基づき、採番の不変性と欠番・再利用ルールを明記することで、レビュー指摘の参照キーとしての信頼性を高めています。
