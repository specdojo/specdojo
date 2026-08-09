---
specdojo:
  id: prj-0001:pjr-rf3b-register-item-frontmatter-schema
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-RF3B 登録項目の個票 frontmatter スキーマを定義する

## 1. 概要

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割1。移行の起点となる作業として、登録項目の構造化フィールドを個票 frontmatter へ定義し、共通の frontmatter スキーマで検証できるようにする。以降の CLI 変更・一覧生成・既存項目移行はすべてこのスキーマに依存する。

## 2. 完了条件

- 登録項目の構造化フィールド（処理状態・優先度・担当・登録日・期限・完了日・結論・分類）が個票 frontmatter の項目として定義されている。
- 値の enum（type / status / priority）が既存の定義と一致し、表記ゆれが生じない。
- 共通 frontmatter スキーマから検証でき、必須項目の欠落と不正値がエラーになる。
- 既存の個票 frontmatter 項目（`id` / `type` / `status` / `rulebook` / `part_of` / `item_type`）との関係が整理され、文書成熟度の `status` と登録項目の処理状態が区別されている。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                                                                      |
| --- | --------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------- |
| 1   | 現行の一覧列と個票 frontmatter の項目対応を洗い出す | ARC  | done | 一覧の標準列と `pjr-index-content.schema.yaml` の列規則を入力にした       |
| 2   | 個票 frontmatter のスキーマを定義する               | ARC  | done | `register-item-frontmatter.schema.yaml` を追加。処理状態は `item_status`  |
| 3   | 既存 enum の再利用と検証経路を確認する              | ARC  | done | 表専用スキーマの enum を `$defs` へ移送し、成果物スキーマからも参照させた |
| 4   | サンプル個票で検証が機能することを確認する          | ARC  | done | 正常系2件・不正値6件を ajv strict で確認（結果は対応結果を参照）          |

## 4. 対応結果

- 登録項目の構造化フィールドを個票 frontmatter へ定義するスキーマ `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml` を追加した。一覧の標準列との対応は次のとおりで、値の未定は「プレースホルダ文字列」ではなく「キーの省略」で表す。

| 一覧の列   | frontmatter 項目 | 必須                   | 未定時の表現 |
| ---------- | ---------------- | ---------------------- | ------------ |
| ID         | `id` から導出    | ○（`id`）              | -            |
| ステータス | `item_status`    | ○                      | -            |
| タイトル   | H1 から導出      | -                      | -            |
| 説明       | 本文から導出     | -                      | -            |
| 分類       | `item_type`      | ○                      | -            |
| 優先度     | `priority`       | ○                      | -            |
| 担当       | `owner`          | 任意                   | キーを省略   |
| 登録日     | `registered_on`  | ○                      | -            |
| 期限       | `due_on`         | 任意                   | キーを省略   |
| 完了日     | `completed_on`   | 条件（終端状態で必須） | キーを省略   |
| 結論       | `conclusion`     | 任意                   | キーを省略   |
| 個票       | ファイル自身     | -                      | -            |

- 表示 ID・タイトル・説明は frontmatter に重複定義せず、`id` の `pjr-XXXX` 部分・H1・本文から導出する方針とした。個票が唯一の正本になるため、同じ値を2か所に持たない。
- 文書成熟度の `status`（`draft` / `ready` / `deprecated`）と登録項目の処理状態を区別するため、処理状態は `item_status` とし、既存の `item_type` と命名を揃えた。両者の役割の違いはスキーマの `description` に明記した。
- enum は `pjr-index-content.schema.yaml` の列規則を移送元とし、`item_type`（7値）・`item_status`（8値）・`priority`（3値）を `$defs` に定義した。値は表専用スキーマと一致させ、表記ゆれを作らない。
- 終端状態のうち `done` / `decided` / `rejected` は `completed_on` を必須にする条件分岐を入れた。`deferred` は `register defer` が完了日を記録しないため対象外とした。
- 日付は `format: date` の文字列とし、YAML では引用符付きで書く必要がある（引用符なしは timestamp 値として読み込まれ文字列にならない）ことをスキーマに明記した。
- 既存の個票 frontmatter 項目との関係を整理し、`item_type` の定義を新スキーマの `$defs` へ一元化したうえで、成果物 frontmatter スキーマ（`deliverable-frontmatter.schema.yaml`）からそれを参照させた。あわせて登録項目の各フィールドを任意項目として許可し、`unevaluatedProperties: false` に阻まれずに CLI 側の書き込み（[[prj-0001:pjr-tt4j-register-cli-write-to-tickets]]）と段階的な移行（[[prj-0001:pjr-9p5q-migrate-existing-register-items]]）を進められるようにした。
- 新スキーマは `.remarkrc.yaml` の `schemaRules` へまだ登録していない。既存個票は登録項目のフィールドを持たないため、先に登録すると必須項目の欠落で全件が検証エラーになる。適用の切り替えは既存項目の移行（[[prj-0001:pjr-9p5q-migrate-existing-register-items]]）と検証経路の更新（[[prj-0001:pjr-vc94-update-validation-and-tests]]）で同時に行う。
- サンプル個票の frontmatter を ajv（2020-12 / strict）で検証し、正常系2件が valid、不正値6件（必須欠落、enum 違反、終端状態の完了日欠落、プレースホルダ日付と未知キー、引用符なし日付、ID 書式違反）がいずれも意図したエラーで invalid になることを確認した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-9y7g-register-item-file-as-ssot]]: 移行の根拠となる決定
- [[specdojo:pjr-rulebook]]: 現行の項目定義と enum の正本
