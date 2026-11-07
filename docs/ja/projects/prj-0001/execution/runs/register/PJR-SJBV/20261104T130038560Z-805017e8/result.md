---
specdojo:
  id: prj-0001:xer-pjr-sjbv-20261104t123919z-1d1ef317
  type: exec-result
  task_id: PJR-SJBV
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-SJBV/20261104T130038560Z-805017e8/plan.md
  started_at: "2026-11-04T12:39:20.252Z"
  completed_at: "2026-11-04T13:18:42.106Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- grade の指摘に原因（`document` または `kata`）を持たせる実装を行いました。
- 原因を `FindingCause` 型として定義し、Kata の場合には `kind` と `location` を保持できるようにしました。
- plan 生成時に、Kata が原因である指摘を適切な Kata の手入れ工程へ振り分ける仕組みを構築しました。
- 既存のテストにおける mock 設定の不備を修正し、新しいテストデータの整合性を確保しました。

## 2. 変更ファイル

- `CHANGELOG.md`: プロジェクトの変更記録を更新しました。
- `docs/ja/specdojo/exec-templates/xep-fully-guided-template.md`: 実行テンプレートの更新を行いました。
- `docs/ja/specdojo/exec-templates/xep-recipe-maintenance-template.md`: レシピメンテナンス用のテンプレートを更新しました。
- `docs/ja/specdojo/exec-templates/xep-rulebook-maintenance-template.md`: ルールブックメンテナンス用のテンプレートを更新しました。
- `docs/ja/specdojo/exec-templates/xep-sample-maintenance-template.md`: サンプルメンテナンス用のテンプレートを更新しました。
- `docs/ja/specdojo/exec-templates/xep-template-maintenance-template.md`: テンプレートメンテナンス用のテンプレートを更新しました。
- `docs/ja/specdojo/guides/ryu-guide.md`: ガイド文書の更新を行いました。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスの更新を行いました。
- `docs/specdojo/schemas/v1/grade-result.schema.yaml`: `grade_result` のスキーマを更新しました。
- `src/exec/plans-core.ts`: 実行コアロジックの変更を行いました。
- `src/exec/plans-generation.ts`: plan 生成ロジックの変更を行いました。
- `src/exec/plans-grade-findings.ts`: grade の findings 処理に関するロジックを更新しました。
- `src/grade/apply.ts`: grade 適用ロジックの変更を行いました。
- `src/grade/core.ts`: grade コアロジックの変更を行いました。
- `src/grade/plan.ts`: grade plan 生成ロジックの変更を行いました。
- `src/shared/grade-result.ts`: `grade_result` 型定義の更新を行いました。
- `tests/src/exec/plans-grade-findings.test.ts`: `plans-grade-findings` のテストコードを更新しました。
- `docs/specdojo/schemas/v1/finding-cause.schema.yaml`: 新しい `finding-cause` スキーマを作成しました。
- `src/exec/plans-kata-findings.ts`: Kata の findings 処理に関する新しいロジックを追加しました。
- `src/shared/finding-cause.ts`: `finding-cause` の型定義を追加しました。
- `tests/src/grade/finding-cause.test.ts`: `finding-cause` に関するテストを追加しました。

## 3. 申し送り

- 原因は共通の `FindingCause` と schema に定義した任意項目 `cause`。省略時は `document` とし、Kata の場合は `kind` と `location` を持つ。項目名と追加節「成果物から届いた Kata が原因の finding」の選定理由は個票に記載済み。
- 前回の親単体テストの失敗に対し、既存テストの部分 mock が未置換の関数を保持するよう修正し、新しいテストデータの `message_ja` を指摘内容と揃えた。再実行は指定どおり親 runner に委ねる。result は編集していないため、reporter／runner が実施内容・変更ファイル・検証結果を反映する。
- 統合後は個票と運用メモに従い、PJR-JSEY の対象一覧へ追加して開き直し、実 agent による exec の動作確認を行う。実装上の未決事項はない。
- 原因は共通の `FindingCause` と schema に定義した任意項目 `cause`。省略時は document とし、Kata の場合は `kind` と `location` を持つ。項目名と追加節「成果物から届いた Kata が原因の finding」の選定理由は個票に記載済み。
- 人の確認が必要: `npx specdojo exec run --project prj-0001 --register PJR-JSEY --worktree --executor-by claude-executor`（統合後、対象一覧の更新と開き直しを経て実 agent による動作確認を行う。）

## 4. 進め方

まず、原因を記録するための `FindingCause` 型とそのスキーマを定義しました。これにより、指摘が `document` によるものか、特定の `kata` によるものかを明示的に区別できるようになりました。次に、`grade` の計画生成プロセスにおいて、この情報を参照して Kata の手入れ工程へ適切に振り分けるロジックを実装しました。最後に、既存のテストコードにおける mock 設定の不備を修正し、新しいデータ構造に対する検証を確実に行えるようにしました。
