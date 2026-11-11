---
specdojo:
  id: prj-0001:xer-t-glossary-gl-register-080-20261111t201311z-71630490
  type: exec-result
  task_id: T-GLOSSARY-gl-register-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-GLOSSARY-gl-register-080/T-GLOSSARY-gl-register-080-20261111T201311Z-71630490/plan.md
  started_at: "2026-11-11T20:13:12.615Z"
  completed_at: "2026-11-11T20:25:48.330Z"
  agent: sol-executor
  execution: agent
  approach: condense
  targets:
    - gl-register
  condense_records:
    - location: docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前47行、tm-register-todo の notes 後半
      category: repetition
      action: delete
      reason: 完了条件の反復を削除。既存の関連参照先 tm-register-done の定義に同じ条件があり、その補足が作業を適用対象としている。問い・判断との使い分けは維持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前77行、tm-register-issue の notes
      category: repetition
      action: delete
      reason: 完了条件だけを繰り返す補足を削除。既存の関連参照先 tm-register-done の定義と課題への適用記述を維持している。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前100・117行、tm-register-note と tm-register-open の notes
      category: repetition
      action: merge
      reason: 記録における起票済みの説明を tm-register-open に集約し、対応漏れを意味しないという補足も移した。相互の関連参照、記録の継続更新・審査除外・別項目起票の条件は維持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前179行、tm-register-wait の notes
      category: repetition
      action: delete
      reason: 待機理由と結論を分ける説明の反復を削除。既存の関連参照先 tm-register-block-reason の定義に同じ区別があり、CLI 引数と再開条件の本文記録は維持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前70行、tm-register-risk の notes
      category: repetition
      action: retain
      reason: 通常の終了条件と似ているが、受容の判断でも追跡を終了できるというリスク固有の条件を含むため保持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前84行、tm-register-change-request の notes
      category: repetition
      action: retain
      reason: 完了の一般定義に加えて採択した変更の反映を要求する固有の完了条件と、既存合意を変更する分類境界を含むため保持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-register.yaml tm-register-deferred と tm-register-completed-at の notes
      category: repetition
      action: retain
      reason: 延期で完了日時を新たに付与しない説明は重なるが、状態の例外と日時項目の適用範囲をそれぞれ判断するため保持した。完了日時の状態別必須条件は既存の schema 参照を維持している。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前54行、tm-register-epic の notes
      category: canonical-restatement
      action: retain
      reason: トラックとの必須の関係やエピック専用項目は用語の適用範囲の判断に必要であり、schema の条件式の再掲ではないため保持した。実行対象からの除外、人間による完了判断、schema を正本とする参照も維持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 用語集（登録簿） `gl-register.yaml` の冗長さを整理し、重複する記述の削除および統合を行いました。
- 具体的には、完了条件や記録の説明における反復を4件削除・統合し、冗長性を排除しました。
- 一方で、リスク固有の条件やエピック専用項目など、判断に必須な制約・例外については保持しています。
- 42用語の定義、識別子、別名、分類、関連参照、出典、CLI 引数などの必須情報はすべて維持されており、schema 検査および整形も完了しています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/060-glossary/gl-register.yaml`: 用語集内の冗長な記述（完了条件の反復や起票済みの説明など）を削除・統合し、内容を凝縮しました。

## 3. 申し送り

- 適用外の検証: `npx markdownlint docs/ja/product/010-business-specs/060-glossary/gl-register.yaml`（変更した成果物は YAML のみで、Markdown ファイルの変更はない。）
- 適用外の検証: `npm run validate:catalog`（成果物の変更は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下の変更はない。）
- 適用外の検証: `npm run validate:history-links`（履歴ファイル、plan、result を編集していない。）

## 4. 進め方と実践の型の適用

condense

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前47行、tm-register-todo の notes 後半` | `repetition` | `delete` | `完了条件の反復を削除。既存の関連参照先 tm-register-done の定義に同じ条件があり、その補足が作業を適用対象としている。問い・判断との使い分けは維持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前77行、tm-register-issue の notes` | `repetition` | `delete` | `完了条件だけを繰り返す補足を削除。既存の関連参照先 tm-register-done の定義と課題への適用記述を維持している。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前100・117行、tm-register-note と tm-register-open の notes` | `repetition` | `merge` | `記録における起票済みの説明を tm-register-open に集約し、対応漏れを意味しないという補足も移した。相互の関連参照、記録の継続更新・審査除外・別項目起票の条件は維持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前179行、tm-register-wait の notes` | `repetition` | `delete` | `待機理由と結論を分ける説明の反復を削除。既存の関連参照先 tm-register-block-reason の定義に同じ区別があり、CLI 引数と再開条件の本文記録は維持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前70行、tm-register-risk の notes` | `repetition` | `retain` | `通常の終了条件と似ているが、受容の判断でも追跡を終了できるというリスク固有の条件を含むため保持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前84行、tm-register-change-request の notes` | `repetition` | `retain` | `完了の一般定義に加えて採択した変更の反映を要求する固有の完了条件と、既存合意を変更する分類境界を含むため保持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-register.yaml tm-register-deferred と tm-register-completed-at の notes` | `repetition` | `retain` | `延期で完了日時を新たに付与しない説明は重なるが、状態の例外と日時項目の適用範囲をそれぞれ判断するため保持した。完了日時の状態別必須条件は既存の schema 参照を維持している。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-register.yaml 修正前54行、tm-register-epic の notes` | `canonical-restatement` | `retain` | `トラックとの必須の関係やエピック専用項目は用語の適用範囲の判断に必要であり、schema の条件式の再掲ではないため保持した。実行対象からの除外、人間による完了判断、schema を正本とする参照も維持した。` | `document` |
