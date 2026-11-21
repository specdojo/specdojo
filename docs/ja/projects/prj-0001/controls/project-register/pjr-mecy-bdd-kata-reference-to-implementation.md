---
specdojo:
  id: prj-0001:pjr-mecy-bdd-kata-reference-to-implementation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:32:15Z"
  completed_at: "2026-11-08T03:52:20Z"
  conclusion: bdd-rulebook に schema_ref・type_ref による参照の規則と選び方の基準を書き、bdd.schema.yaml を後方互換のまま緩め、bdd-sample に 3 つの形の例を載せた
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-HMV6
  approach: rulebook-maintenance
  targets:
    - specdojo:bdd-rulebook
---

# PJR-MECY 業務データ辞書（bdd）の型を、実装と同じことを書かない形に手入れする

## 1. 概要

業務データ辞書の型を手入れする。schema があるエンティティは schema を正として参照し、fields には schema から読めない業務上の意味だけを書く。schema のないエンティティは今の形か TypeScript の型の参照にする

## 2. 入力

- 方針（indie が決定、2026-11-08）: schema があるエンティティは schema を正として参照し、fields には schema から読めない業務上の意味だけを書く。schema のないエンティティは今の形か TypeScript の型の参照にする。
- rulebook にあわせて bdd-sample も揃える。

## 3. 完了条件

- [[specdojo:bdd-rulebook]] に、次の規則を書いている。
  - schema があるエンティティは、schema を正として参照する（参照の書き方とキー名は executor が決める）。
  - fields には、schema から読めない業務上の意味（項目の業務的な定義、enum の値が表す業務上の状態など）だけを書く。型・必須・パターンなど schema にある制約は繰り返さない。
  - schema のないエンティティは、今の形で fields を書くか、TypeScript の型を参照する。どちらを選ぶかの基準を書く。
- `bdd-sample` を新しい規則に合わせ、schema を参照するエンティティと、schema のないエンティティの両方の例を載せている。
- 型の変更に合わせて schema（`docs/specdojo/schemas/v1/`）を変える必要があれば変えている。その場合も、今の形で書かれた既存の文書が引き続き検査を通る（後方互換）。schema を変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 規則と sample の書き方で迷った点や、決めきれない点は `_UNDECIDED_` で残さず executor が決め、決めた内容と理由を個票の対応結果に書いている。型の確定（PJR-RZ9Q）で人が判断する材料にする。
- 成果物の文書（`docs/ja/product/` 配下）は作らず、ほかの種類の型も変えていない。ただし、この型を参照している別の型の記述（例: 関連する型の「〜との関係」の節）が食い違う場合は、その箇所だけを直している。
- CHANGELOG の未公開の版の節に型の変更を書き、公開済みの版の節を変えていない。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                                                   | 担当 | 状態 | メモ                                                                                              |
| --- | -------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------- |
| 1   | 今の rulebook と `bdd-sample` を読み、実装・schema・リファレンスと重なる記述を洗い出す | DEV  | done | スキーマ・実装型と重複する型・制約定義、および指摘 F001 - F025 を確認                             |
| 2   | rulebook に参照の規則を書き、`bdd-sample` を揃える                                     | DEV  | done | `schema_ref`・`type_ref` の参照規則と選定基準を策定し、`bdd.schema.yaml` と sample を新規則に同期 |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                                             | DEV  | done | スキーマ検証・静的検証を実施し、決定事項と後方互換性の理由を記録                                  |

## 5. 対応結果

### 実施内容

1. **rulebook の改訂 (`docs/ja/specdojo/rulebooks/bdd-rulebook.md`)**:
   - schema があるエンティティは正本スキーマを参照（`schema_ref`）し、`fields` にはスキーマから読めない業務上の意味のみを記載し、データ型（`type`）や制約（`constraints`）の重複記述を排除する規則を策定。
   - schema のないエンティティについて、スタンドアロン定義（今の形）と TypeScript 型参照（`type_ref`）の選定基準と記述規則を明確化。
   - `docs/ja/specdojo/standards/rulebook-authoring-standard.md` に準拠し、章立てを整理（本文要件の表の空行分断解消、enum フィールドの `allowed_values` / `allowed_values_detailed` 追加等、全 25 件の指摘 F001 - F025 を解消）。
   - 検証手順節のコードブロック前後に空行を追加し、markdownlint MD031 エラーを解消。
2. **schema の改訂 (`docs/specdojo/schemas/v1/bdd.schema.yaml`)**:
   - `entities` に `schema_ref`（正本スキーマ参照）および `type_ref`（TypeScript 型参照）を任意プロパティとして追加（両者の同時指定は禁止）。
   - `fields` の各項目で `type` を任意化（`schema_ref` または `type_ref` 指定時は省略可能）。
   - スタンドアロン定義（`schema_ref` / `type_ref` いずれも未指定）の場合は `fields` を必須とし、既存のスタンドアロン記述との完全な後方互換性を維持。
3. **sample の改訂 (`docs/ja/specdojo/samples/bdd-sample.yaml`)**:
   - `商品`（スタンドアロン定義）、`取引`（TypeScript 型参照: `type_ref`）、`支払い`（スキーマ参照: `schema_ref`）の 3 形態の例を提示し、新しい規則に適合。
4. **CHANGELOG の記録**:
   - `CHANGELOG.md` の `[Unreleased]` -> `### 変更` に、業務データ辞書の型手入れ・参照規則の追加・後方互換維持の内容を記録。

### スキーマ変更の有無と理由

- **変更有無**: あり
- **変更内容と理由**: `docs/specdojo/schemas/v1/bdd.schema.yaml` において、エンティティ定義に `schema_ref`（スキーマ参照パス）および `type_ref`（TypeScript 型参照パス）を追加し、`fields` 内の `type` を必須から任意に変更した。また、`schema_ref` / `type_ref` が指定されないスタンドアロン定義では `fields` を必須とし、既存文書との後方互換性を保証している。

### 決定事項と判断理由（PJR-RZ9Q への申し送り）

- **参照キー名の選定**:
  - スキーマ参照キー: `schema_ref`（JSON Schema / YAML Schema / OpenAPI 仕様のファイルパスまたは JSON ポインターを指定）。
  - 型定義参照キー: `type_ref`（TypeScript 等の実装型定義のファイルパスおよび型名、例: `src/types/xxx.ts#Type` を指定）。
  - 判断理由: 成果物カタログの `evidence_refs` や rulebook の `based_on` などの慣行と親和性が高く、スキーマと実装コードの参照対象が一目で区別できるため。
- **選定基準の具体化**:
  - スタンドアロン定義（今の形）: 実装未着手の初期企画・分析フェーズ、または実装言語に依存しない純粋な業務ドメイン概念を独立管理する場合に選択。
  - TypeScript 型参照（`type_ref`）: 既に TypeScript コードで型定義が存在し、JSON Schema がない内部モデルや設定・ペイロード等の仕様を管理する場合に選択（二重管理を防止）。
  - スキーマ参照（`schema_ref`）: 正本スキーマが存在し、物理仕様が機械検証可能な場合に選択（データ辞書には業務意味のみを集中記述）。

### 成果物

- `docs/ja/specdojo/rulebooks/bdd-rulebook.md`
- `docs/specdojo/schemas/v1/bdd.schema.yaml`
- `docs/ja/specdojo/samples/bdd-sample.yaml`
- `CHANGELOG.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-mecy-bdd-kata-reference-to-implementation.md`

### 残課題

- なし（すべての完了条件を充足）。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[specdojo:bdd-rulebook]]
- 後続: [[prj-0001:pjr-rz9q-business-specs-reps-kata-confirm]]
