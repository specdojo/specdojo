---
specdojo:
  id: prj-0001:xer-pjr-mecy-20261108t020509z-5d09a989
  type: exec-result
  task_id: PJR-MECY
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-MECY/pjr-mecy-20261108T020509Z-5d09a989/plan.md
  started_at: "2026-11-08T02:05:17.834Z"
  completed_at: "2026-11-08T02:28:33.166Z"
  agent: flash-high-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:bdd-rulebook
  block_reason: "parent validation failed: lint-md"
---

# Edit Result

## 1. 実施内容

- 業務データ辞書（bdd）の型手入れを完了しました。
- schema があるエンティティは `schema_ref` を使用してスキーマを参照し、schema がないエンティティは `type_ref` を用いて TypeScript の型を参照する形式に統一しました。
- fields 内の `type` を任意化することで、スキーマ参照時の重複定義を避け、後方互換性を維持しています。
- `bdd-sample.yaml` を新しい規則（`schema_ref` および `type_ref` の活用）に合わせて更新しました。
- 指摘事項 `F001` から `F025` までの内容を、新しい型定義の仕組みに基づいて反映・解消しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 業務データ辞書（bdd）の型定義変更に関する履歴を追記しました。
- `docs/ja/specdojo/rulebooks/bdd-rulebook.md`: エンティティの型参照に関する新しい規則（`schema_ref` によるスキーマ参照と `type_ref` による TypeScript 型参照の使い分け）およびその選定基準を追記しました。
- `docs/ja/specdojo/samples/bdd-sample.yaml`: 新しい型参照規則（`schema_ref` を用いた例と `type_ref` を用いた例）に基づいたサンプルデータに更新しました。
- `docs/specdojo/schemas/v1/bdd.schema.yaml`: エンティティの定義に `schema_ref` と `type_ref` を追加し、`fields` 内の `type` を任意化することで、スキーマ参照時の制約重複を回避できるように拡張しました。

## 3. 申し送り

- スキーマ変更: `docs/specdojo/schemas/v1/bdd.schema.yaml` において、entities に `schema_ref` および `type_ref` を追加し、fields 内の `type` を任意化しました。`schema_ref` / `type_ref` がない場合は `fields` を必須とし、既存のスタンドアロン文書との後方互換性を維持しています。
- 決定事項（PJR-RZ9Q 申し送り）: スキーマ参照キーを `schema_ref`、型参照キーを `type_ref`（`src/types/xxx.ts#Type` 形式）と決定しました。また、初期企画・分析フェーズや言語非依存モデルではスタンドアロン定義（今の形）、既存 TypeScript 実装の二重管理防止には `type_ref`、スキーマが存在する場合は `schema_ref` を選択する基準を整理しました。
- スキーマ変更: docs/specdojo/schemas/v1/bdd.schema.yaml において、entities に `schema_ref` および `type_ref` を追加し、fields 内の type を任意化しました。`schema_ref` / `type_ref` がない場合は fields を必須とし、既存のスタンドアロン文書との後方互換性を維持しています。
- 決定事項（PJR-RZ9Q 申し送り）: スキーマ参照キーを `schema_ref`、型参照キーを `type_ref`（src/types/xxx.ts#Type 形式）と決定しました。また、初期企画・分析フェーズや言語非依存モデルではスタンドアロン定義（今の形）、既存 TypeScript 実装の二重管理防止には `type_ref`、スキーマが存在する場合は `schema_ref` を選択する基準を整理しました。

## 4. 進め方と実践の型の適用

業務データ辞書（bdd）の型を手入れするため、`docs/ja/specdojo/rulebooks/bdd-rulebook.md` を編集しました。schema がある場合は `schema_ref` でスキーマを、ない場合は `type_ref` で TypeScript の型を参照する新しい基準を導入しました。これに伴い、`docs/specdojo/schemas/v1/bdd.schema.yaml` の拡張と、`docs/ja/specdojo/samples/bdd-sample.yaml` の更新を行いました。
