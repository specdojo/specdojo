---
specdojo:
  id: prj-0001:xer-pjr-mecy-20261108t020509z-5d09a989
  type: exec-result
  task_id: PJR-MECY
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-MECY/pjr-mecy-20261108T020509Z-5d09a989/plan.md
  started_at: "2026-11-08T02:05:17.834Z"
  completed_at: "2026-11-08T02:41:30.677Z"
  agent: flash-high-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:bdd-rulebook
---

# Edit Result

## 1. 実施内容

- 業務データ辞書（bdd）の型定義に関する rulebook を更新し、スキーマ参照の仕組みと基準を整備しました。
- スキーマが存在する場合の `schema_ref` と、TypeScript の型を参照する場合の `type_ref` を導入し、これらに基づく記述ルールを定義しました。
- `bdd-sample` を新しい規則に合わせて更新し、スキーマ参照パターンと型参照パターンの両方を提供しました。
- スキーマ定義を更新し、型定義の柔軟性を高めつつ後方互換性を維持しました。
- 親検証による `lint-md` の指摘（MD031: コードブロック前後の空行不足）を修正しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 業務データ辞書（bdd）の型定義およびスキーマ変更に関する記述の追加。
- `docs/ja/specdojo/rulebooks/bdd-rulebook.md`: スキーマを正とするエンティティの参照方法（`schema_ref`）および TypeScript の型を参照するエンティティの参照方法（`type_ref`）に関する記述を追加。また、`lint-md` の指摘に基づき、検証手順におけるコードブロック前後の空行を補正。
- `docs/ja/specdojo/samples/bdd-sample.yaml`: 新規則に従い、スキーマを参照する例と TypeScript の型を参照する例を含むサンプルデータへ更新。
- `docs/specdojo/schemas/v1/bdd.schema.yaml`: エンティティの定義に `schema_ref` および `type_ref` を追加。また、`fields` 内の `type` を任意とし、既存のスタンドアロン定義との後方互換性を確保。

## 3. 申し送り

- 親検証 `lint-md`（MD031）対応: `docs/ja/specdojo/rulebooks/bdd-rulebook.md` の検証手順節において、番号付きリスト内のコードブロック前後に空行を追加して MD031 (`blanks-around-fences`) 違反を解消し、`npm run lint:md` が正常通過することを確認しました。
- スキーマ変更: `docs/specdojo/schemas/v1/bdd.schema.yaml` において、`entities` に `schema_ref` および `type_ref` を追加し、`fields` 内の `type` を任意化しました。`schema_ref` / `type_ref` がない場合は `fields` を必須とし、既存のスタンドアロン文書との後方互換性を維持しています。
- 決定事項（PJR-RZ9Q 申し送り）: スキーマ参照キーを `schema_ref`、型参照キーを `type_ref`（`src/types/xxx.ts#Type` 形式）と決定しました。また、初期企画・分析フェーズや言語非依存モデルではスタンドアロン定義（今の形）、既存 TypeScript 実装の二重管理防止には `type_ref`、スキーマが存在する場合は `schema_ref` を選択する基準を整理しました。
- 親検証 lint-md（MD031）対応: docs/ja/specdojo/rulebooks/bdd-rulebook.md の検証手順節において、番号付きリスト内のコードブロック前後に空行を追加して MD031（blanks-around-fences）違反を解消し、npm run lint:md が正常通過することを確認しました。
- スキーマ変更: docs/specdojo/schemas/v1/bdd.schema.yaml において、entities に `schema_ref` および `type_ref` を追加し、fields 内の type を任意化しました。`schema_ref` / `type_ref` がない場合は fields を必須とし、既存のスタンドアロン文書との後方互換性を維持しています。
- 決定事項（PJR-RZ9Q 申し送り）: スキーマ参照キーを `schema_ref`、型参照キーを `type_ref`（src/types/xxx.ts#Type 形式）と決定しました。また、初期企画・分析フェーズや言語非依存モデルではスタンドアロン定義（今の形）、既存 TypeScript 実装の二重管理防止には `type_ref`、スキーマが存在する場合は `schema_ref` を選択する基準を整理しました。

## 4. 進め方と実践の型の適用

業務データ辞書（bdd）の型を、実装と重複しない形で定義するための rulebook を更新しました。スキーマが存在する場合は `schema_ref` を用い、存在しない場合は `type_ref` を用いて TypeScript の型を参照する基準を確立しました。これに伴い、スキーマの定義およびサンプルデータの更新も行いました。
