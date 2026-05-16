# 業務データ辞書 (BDD) 作成の指示テンプレート

以下のルールに従って、**YAML形式の業務データ辞書（BDD）を作成**してください。

## **1. ファイル形式**

- 出力は **YAML形式** とし、余計な文章は書かず、YAML のみを出力してください。

## **2. メタデータ**

次のメタデータを必ず定義してください。

```yaml
id: bdd-XXXX # 任意の一意ID（bdd-から始める）
type: data
title: 業務データ辞書(XXXX)
status: draft
supersedes: []
```

## **3. 記載ルール（遵守）**

- **論理名（logical_name）は日本語単数形**で記載すること。
- **物理名（physical_name）は lower_snake_case** で記載すること。
- TypeScript等のアプリケーションで利用する場合は、`physical_name` を lowerCamelCase に変換して扱うこと。
- **実装都合の属性（created_at など）は含めない**こと。
- 用語集と連動する場合は **glossary_term_id を対応IDで記載**すること。
- **キー項目は key_fields に、physical_name の配列**で記載すること。
- フィールドの型は以下から選択：
  `integer / string / boolean / date / datetime / enum / money`
- enum を使う場合、以下のどちらかの方式で許容値を記述する：
  - `allowed_values: [A, B, C]`
  - `allowed_values_detailed:` 形式で `value` / `label` を列挙

## **4. エンティティの記述形式（必ずこの構造）**

```yaml
entities:
  - logical_name: 〇〇
    physical_name: 〇〇
    description: 〇〇（業務的な説明）
    glossary_term_id: tm-xxxx # 任意
    related_terms: [tm-xxxx] # 任意
    key_fields: [primary_key_field] # 必須。複合キーも可
    fields:
      - logical_name: 〇〇
        physical_name: 〇〇
        type: string
        glossary_term_id: tm-xxx # 任意
        description: 〇〇 # 任意
        unit: 円 # 任意
        constraints:
          required: true
          unique: true
        example: サンプル値
```

### **5. 出力要件**

- エンティティ間で名前の衝突や ID の不整合がないよう生成してください。
- 物理名・論理名・説明は、業務シナリオに整合する自然な内容にしてください。

## **6. 参考**

- 必要に応じて用語集（glossary）を参照し、glossary_term_id を補完してください。
- BDD 作成ルールはこのファイル **bdd-rulebook.md** を参照してください。

## **7. 最終出力**

- 出力は YAML コードブロックのみで、前後や途中に文章を入れないこと。

**以上のルールに従って、業務データ辞書を生成してください。**
