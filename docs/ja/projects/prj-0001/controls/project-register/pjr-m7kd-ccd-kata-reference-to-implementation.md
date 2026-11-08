---
specdojo:
  id: prj-0001:pjr-m7kd-ccd-kata-reference-to-implementation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:33:10Z"
  completed_at: "2026-11-08T03:52:39Z"
  conclusion: ccd-mermaid-rulebook を属性は主キーだけ・関連の意味と多重度とその業務上の根拠に絞る形に改め、ccd-sample を新しい規則の完成例にした
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-HMV6
  approach: rulebook-maintenance
  targets:
    - specdojo:ccd-mermaid-rulebook
---

# PJR-M7KD 概念クラス図（ccd）の型を、実装と同じことを書かない形に手入れする

## 1. 概要

概念クラス図の型を手入れする。属性は主キーだけにし、そのほかの属性は bdd を参照する。図と本文は関連の意味・多重度・役割名に絞る

## 2. 入力

- 方針（indie が決定、2026-11-08）: 属性は主キーだけにし、そのほかの属性は bdd を参照する。図と本文は関連の意味・多重度・役割名に絞る。
- rulebook にあわせて ccd-sample も揃える。

## 3. 完了条件

- [[specdojo:ccd-mermaid-rulebook]] に、次の規則を書いている。
  - クラスの属性は主キーだけにし、そのほかの属性は業務データ辞書（bdd）を参照する。
  - 図と本文は、関連の意味（役割名）・多重度・関係の種類に絞る。関連ごとに、業務上なぜその多重度になるかを書く。
- `ccd-sample` を新しい規則に合わせている。
- 型の変更に合わせて schema（`docs/specdojo/schemas/v1/`）を変える必要があれば変えている。その場合も、今の形で書かれた既存の文書が引き続き検査を通る（後方互換）。schema を変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 規則と sample の書き方で迷った点や、決めきれない点は `_UNDECIDED_` で残さず executor が決め、決めた内容と理由を個票の対応結果に書いている。型の確定（PJR-RZ9Q）で人が判断する材料にする。
- 成果物の文書（`docs/ja/product/` 配下）は作らず、ほかの種類の型も変えていない。ただし、この型を参照している別の型の記述（例: 関連する型の「〜との関係」の節）が食い違う場合は、その箇所だけを直している。
- CHANGELOG の未公開の版の節に型の変更を書き、公開済みの版の節を変えていない。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                                                   | 担当                | 状態 | メモ                                                 |
| --- | -------------------------------------------------------------------------------------- | ------------------- | ---- | ---------------------------------------------------- |
| 1   | 今の rulebook と `ccd-sample` を読み、実装・schema・リファレンスと重なる記述を洗い出す | flash-high-executor | done | 属性・メソッドなど実装重なりと finding 27 件を整理   |
| 2   | rulebook に参照の規則を書き、`ccd-sample` を揃える                                     | flash-high-executor | done | 主キーのみ・bdd 参照・多重度根拠の規則と完成例を記述 |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                                             | flash-high-executor | done | schema 要否・未決定解消の判断と理由を記録            |

## 5. 対応結果

### 5.1. 実施内容

1. **rulebook の手入れ（`specdojo:ccd-mermaid-rulebook`）**:
   - クラスの属性は主キー（PK）のみとし、その他の属性（名称、金額、日付等）は業務データ辞書（bdd）を参照する規則を明記した。
   - 図と本文は関連の意味（役割名）・多重度・関係の種類（継承・親子・参照）に絞り、全関係線へのラベル（役割名）と多重度の付与を必須とした。
   - 本文に「3. 関連定義と多重度の根拠」章を設け、各関連について業務上なぜその多重度になるかを記載する規則を定めた。
   - メソッドの記述、型・可視性、技術的属性の記述を例外なく禁止した。
   - `rulebook-authoring-standard` に準拠した標準章構成（全9章）に再編し、plan に展開された 27 件の finding（F001〜F027）をすべて解消した。
2. **sample の整備（`specdojo:ccd-sample`）**:
   - 新しい規則に従い、駄菓子屋の販売管理システムを題材とした完成サンプルを作成した。
   - クラスには主キーのみを配置し、親子・参照・継承の関連、多重度、役割名、多重度の業務上の根拠表、参照先 bdd 一覧を整備した。
   - 親検証（lint-fm）で sample の frontmatter に `depends_on` が定義できない schema 制約（unevaluatedProperties）が検出されたため、frontmatter から `depends_on` を除去し、bdd への参照は本文（「1. 目的と適用範囲」「4. 参照業務データ辞書」）で明記する構成とした。
3. **CHANGELOG の更新**:
   - `CHANGELOG.md` の `## [Unreleased]` 配下の `### 変更` に CCD の手入れ内容を記録した。

### 5.2. 成果物

- [[specdojo:ccd-mermaid-rulebook]]: `docs/ja/specdojo/rulebooks/ccd-mermaid-rulebook.md`
- [[specdojo:ccd-sample]]: `docs/ja/specdojo/samples/ccd-sample.md`
- `CHANGELOG.md`

### 5.3. スキーマ（schema）変更の要否と理由

- **スキーマ変更なし**: 概念クラス図（CCD）は Markdown 文書（`target_format: markdown`）形式であり、`docs/specdojo/schemas/v1/` に専用の YAML スキーマは存在しない。Frontmatter は共通の `rulebook-frontmatter.schema.yaml` および `deliverable-frontmatter.schema.yaml` で検証され、後方互換性にも影響はない。

### 5.4. 規則と sample の書き方で決めた内容と理由（PJR-RZ9Q 向けの判断材料）

1. **`recipe` と `template` の要否**:
   - 決定: Frontmatter で `recipe: not-needed`、`template: not-needed` と決定した。
   - 理由: Mermaid を用いた概念クラス図は、rulebook の本文要件・記述ガイドおよび sample（`ccd-sample.md`）によって必要な構成・記法が十分に網羅されており、独立した recipe や Markdown テンプレートを別途設けるよりも rulebook と sample の 2 点で統制する方が保守性と一貫性が高いため。
2. **継承関係（is-a）の記述方向と多重度**:
   - 決定: Mermaid 記法は `親 <|-- 子 : 役割名`（三角 `<|` が親を指す）を標準とし、多重度は UML の一般化定義に従い記述禁止とした。
   - 理由: 継承は特化・一般化関係でありインスタンス多重度の概念が存在しないため。親子関係（`*--`）と参照関係（`-->`）では多重度を必須とする。
3. **属性を持たない概念クラスの表現**:
   - 決定: 主キーを親から継承する下位概念など、個別主キーを持たない場合は属性行を書かず空（`class お菓子 {}`）とした。
   - 理由: 属性は主キーのみとする原則を徹底し、主キー以外の属性の混入を厳格に防ぐため。
4. **多重度の業務根拠の記述形式**:
   - 決定: 本文の「3. 関連定義と多重度の根拠」に表形式で全関連の業務理由を網羅する構成とした。
   - 理由: 多重度（例: 1対0..*、*対1）の理由が明文化されることで、後続の設計・テスト（境界値・整合性検証）への確実なトレーサビリティが確保できるため。

### 5.5. 残課題

- 本タスクではプロダクト成果物（`docs/ja/product/` 配下）の作成・変更は行わない制約に従い、既存 CCD の更新は実施していない。型の確定（PJR-RZ9Q）およびプロダクト側の後続タスクで、新規則に基づいた CCD 成果物の更新を反映する。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[specdojo:ccd-mermaid-rulebook]]
- 後続: [[prj-0001:pjr-rz9q-business-specs-reps-kata-confirm]]
