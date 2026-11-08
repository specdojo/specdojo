---
specdojo:
  id: prj-0001:pjr-7fxc-cdt-kata-reference-to-implementation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:36:19Z"
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-HMV6
  approach: rulebook-maintenance
  targets:
    - specdojo:cdt-rulebook
---

# PJR-7FXC 分類一覧（cdt）の型を、実装と同じことを書かない形に手入れする

## 1. 概要

分類一覧の型を手入れする。値の一覧は schema の enum と TypeScript の union 型を正として参照し、値ごとの業務上の意味と使い分けだけを書く

## 2. 入力

- 方針（indie が決定、2026-11-08）: 値の一覧は schema の enum と TypeScript の union 型を正として参照し、値ごとの業務上の意味と使い分けだけを書く。
- rulebook にあわせて cdt-sample も揃える。cdt-rulebook は PJR-HMV6 で作られるため、起票の時点では approach と対象を付けていない。

## 3. 完了条件

- 着手の前に、PJR-HMV6 で `specdojo:cdt-rulebook` と `cdt-sample` ができていることを確かめている。なければ作業せずに止まり、理由を書く。
- `specdojo:cdt-rulebook` に、次の規則を書いている。
  - 値の一覧は、schema の enum または TypeScript の union 型を正として参照する（参照の書き方は executor が決める）。
  - 値ごとに、業務上の意味と使い分けだけを書く。値そのものの列挙は繰り返さない。
  - 実装にない業務上の分類（人が決める区分など）は、今の形で値の一覧を書く。
- `cdt-sample` を新しい規則に合わせている。
- 型の変更に合わせて schema（`docs/specdojo/schemas/v1/`）を変える必要があれば変えている。その場合も、今の形で書かれた既存の文書が引き続き検査を通る（後方互換）。schema を変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 規則と sample の書き方で迷った点や、決めきれない点は `_UNDECIDED_` で残さず executor が決め、決めた内容と理由を個票の対応結果に書いている。型の確定（PJR-RZ9Q）で人が判断する材料にする。
- 成果物の文書（`docs/ja/product/` 配下）は作らず、ほかの種類の型も変えていない。ただし、この型を参照している別の型の記述（例: 関連する型の「〜との関係」の節）が食い違う場合は、その箇所だけを直している。
- CHANGELOG の未公開の版の節に型の変更を書き、公開済みの版の節を変えていない。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                                                   | 担当 | 状態 | メモ                                                                            |
| --- | -------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------- |
| 1   | 今の rulebook と `cdt-sample` を読み、実装・schema・リファレンスと重なる記述を洗い出す | DEV  | done | 重複する値列挙、および rulebook-authoring-standard からの逸脱（章構成等）を確認 |
| 2   | rulebook に参照の規則を書き、`cdt-sample` を揃える                                     | DEV  | done | `schema_ref`・`type_ref` 参照規約を策定し、cdt-sample を新規則に同期            |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                                             | DEV  | done | 決定事項、スキーマ変更不要の理由、後方互換性の維持を確認・記録                  |

## 5. 対応結果

### 実施内容

1. **rulebook の改訂 (`docs/ja/specdojo/rulebooks/cdt-rulebook.md`)**:
   - スキーマ（JSON/YAML Schema の enum）または実装（TypeScript の union 型等）が存在する分類について、それらを正本（SSOT）として参照（`schema_ref` または `type_ref`）し、値の一覧そのものの機械的再掲を排除する規則を策定。
   - 分類一覧には、実装から読み取れない各値の「業務上の意味と使い分け（選定基準・適用条件）」に特化して記述する規約を明記。
   - 実装にない業務上の分類（人が業務判断で区分する分類など）について、スタンドアロン形式で値・分類名・表示名・説明の一覧を記述する選定基準を明記。
   - `docs/ja/specdojo/standards/rulebook-authoring-standard.md` に準拠し、章構成を標準 8 章構成へ全面再構成。
2. **sample の改訂 (`docs/ja/specdojo/samples/cdt-sample.md`)**:
   - メタ説明的な最小記述例から、駄菓子屋販売管理システムにおける「商品区分」の実例ドキュメントへ刷新。
   - TypeScript 型定義（`src/types/product.ts#ProductType`）を参照する業務分類の定義と、各値（`snack`, `toy`, `drink`）の業務上の意味・使い分けの表を例示。
   - 実装に型を持たない人が判断する業務分類（`staple`, `seasonal`, `experimental`）のスタンドアロン定義例もあわせて提示。
3. **CHANGELOG の記録**:
   - `CHANGELOG.md` の `[Unreleased]` -> `### 変更` に、分類一覧（CDT）の型手入れ・正本参照規則の追加・選定基準の内容を記録。

### スキーマ変更の有無と理由

- **変更有無**: なし
- **理由**: 分類一覧（CDT）は Markdown ドキュメント形式（`target_format: markdown`）として管理されており、`docs/specdojo/schemas/v1/` 配下に直接 CDT の本文構造を制約する YAML スキーマは存在しない。また、既存のフロントマタースキーマ（`deliverable-frontmatter.schema.yaml` 等）で `type: data` として引き続き問題なく検証を通るため、スキーマの変更は不要であった（完全な後方互換性を維持）。

### 決定事項と判断理由（PJR-RZ9Q への申し送り）

- **参照の記述方法**:
  - 分類定義表の正本参照（SSOT）項目において、スキーマ参照は `schema_ref: <path>#<pointer>`（例: `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml#/$defs/ItemType`）、TypeScript 型参照は `type_ref: <path>#<TypeName>`（例: `src/types/product.ts#ProductType`）、実装にない分類は `なし（スタンドアロン定義）` と明記する方式を採用。
  - 判断理由: 業務データ辞書（BDD）の選定（PJR-MECY）と統一し、成果物カタログの `evidence_refs` との親和性を確保するため。
- **値表の列構成**:
  - 正本参照ありの場合: `値`、`分類名`、`業務上の意味と使い分け` の 3 列構成を基本とし、値の列挙ではなく使い分け判断に注力する形式とした。
  - スタンドアロン定義の場合: `値`、`分類名`、`表示名`、`説明・成立条件` の 4 列構成とし、実装がない場合でも業務上の識別と表示を網羅できるようにした。

### 成果物

- `docs/ja/specdojo/rulebooks/cdt-rulebook.md`
- `docs/ja/specdojo/samples/cdt-sample.md`
- `CHANGELOG.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-7fxc-cdt-kata-reference-to-implementation.md`

### 残課題

- なし（すべての完了条件を充足）。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[specdojo:cdt-rulebook|分類一覧作成ルール]]
- 後続: [[prj-0001:pjr-rz9q-business-specs-reps-kata-confirm]]
