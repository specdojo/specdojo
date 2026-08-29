---
specdojo:
  id: prj-0001:pjr-akj4-qwen-json-output
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-29T13:44:26Z"
  due_on: "2026-09-30"
  register_events:
    - v: 1
      id: reg_e5a8e0d95fb24107846317ebd0d8490d
      ts: "2026-08-29T13:44:26Z"
      action: add
      actor: manual
      from_status: null
      to_status: open
      reason: item added
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: qwen が GradeSubmission JSON を出力できない問題に対処する
        - field: description
          from: ""
          to: qwen-expert-executor は grade の判定そのものは完了しながら、最終ステップの GradeSubmission JSON 出力に到達せず散文で応答を終えた。分析品質は claude に匹敵し、opr-batch-sample の rulebook 宣言と本文参照の不一致という実在の不整合を発見している。出力形式を強制できればローカルモデルでの grade 運用が可能になり、API コストなしで全 kata を評価できる。opencode agent 定義での出力形式指定、JSON スキーマによる制約、plan 側の指示強化のいずれで解決するかを検証する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: "2026-08-29"
        - field: due
          from: ""
          to: _TODO_
    - v: 1
      id: reg_e895465abb1241f486eedc12ddb996d2
      ts: "2026-08-29T13:56:32Z"
      action: update
      actor: manual
      from_status: open
      to_status: open
      reason: 担当と期限を確定
      changes:
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-09-30"
      previous_event_id: reg_e5a8e0d95fb24107846317ebd0d8490d
---

# PJR-AKJ4 qwen が GradeSubmission JSON を出力できない問題に対処する

## 1. 概要

`qwen-expert-executor` は grade の判定そのものを完了しながら、最終ステップの GradeSubmission JSON 出力に到達せず、散文の応答で終了した。判定結果が JSON として得られないため `grade apply` へ渡せず、評価が成立しない。

分析品質は claude に匹敵する。`opr-batch-sample.md` の Frontmatter が運用方針（opd）の rulebook を指す一方で本文は運用手順（opr）の rulebook を参照しているという実在の不整合を、関連する rulebook と authoring standard を読み込んだうえで発見している。

出力形式を強制できれば、ローカルモデルでの grade 運用が可能になる。kata 285 件を API コストなしで評価できるため、実現の価値は大きい。

## 2. 完了条件

- `qwen-expert-executor` が grade plan に対して GradeSubmission JSON を出力する。
- 出力した JSON が `grade apply` の検証を通過する。finding の `severity` と非空の `message` を含む。
- 同じ plan を複数回実行しても JSON 出力が安定する。
- 解決手段が opencode agent 定義、JSON スキーマによる制約、plan 側の指示強化のいずれであるかが記録されている。
- 判定内容の精度が claude と比較され、実用可否が判断されている。

## 3. 作業内容

| No  | 作業                   | 担当   | 状態 | メモ                                         |
| --- | ---------------------- | ------ | ---- | -------------------------------------------- |
| 1   | 未出力の原因の切り分け | _TODO_ | open | 応答長の上限、タスク管理、指示解釈のいずれか |
| 2   | 解決手段の検証         | _TODO_ | open | agent 定義、スキーマ制約、plan の指示強化    |
| 3   | 安定性の確認           | _TODO_ | open | 同一 plan の反復実行で出力が安定するか       |
| 4   | 精度の比較             | _TODO_ | open | claude との level 差と finding の質          |
| 5   | 採否の判断と記録       | _TODO_ | open | routine で使う agent の選定へ反映する        |

### 3.1. 観測された挙動

実行ログのタスクリストは、判定まで完了していたことを示している。

```text
[✓] 対象4文書を読み本文行番号を確定する
[✓] 関連設計書を確認しクロスドキュメント整合をチェック
[✓] 各文書×7viewpointで0-4判定とfindingを作成
[•] GradeSubmission JSONを出力し、変更ファイル/検証結果を最終応答へ残す
```

最終ステップだけが未完了で終了している。応答は散文で、判定の要点は記述されているが機械可読な形式ではない。

### 3.2. 想定される原因

- 応答長の上限に達し、JSON を出力する余地が残らなかった。判定過程の説明に応答を費やしている。
- タスクを分割して進める挙動により、最終ステップへ到達する前に応答を終えた。
- plan の指示（GradeSubmission JSON のみを出力する）が、過程の説明を抑制するほど強くない。

### 3.3. 検証の観点

原因により有効な手段が変わる。応答長が原因であれば、評価単位を1文書へ縮小する PJR-4TZ7 の変更で解消する可能性がある。指示解釈が原因であれば、agent 定義または plan 側の指示強化が要る。

いずれの場合も、解決後に判定精度を claude と比較し、実用に足るかを別途判断する。分析品質が高くても、誤認（存在しない `opq-template` への言及）が混在していたため、精度の検証は欠かせない。

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 本問題を観測した agent 比較の実測記録。
- [[prj-0001:pjr-4tz7-grade-per-document]]: 評価単位の見直し。応答長が原因の場合はこの変更で解消する可能性がある。
- [[prj-0001:pjr-49d2-quality-assessment]]: grade の設計と実装。
