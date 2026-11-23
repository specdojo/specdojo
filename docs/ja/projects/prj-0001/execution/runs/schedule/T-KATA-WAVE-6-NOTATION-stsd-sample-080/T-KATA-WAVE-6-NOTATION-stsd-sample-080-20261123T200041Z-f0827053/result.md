---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-notation-stsd-sample-080-20261123t200041z-f0827053
  type: exec-result
  task_id: T-KATA-WAVE-6-NOTATION-stsd-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-NOTATION-stsd-sample-080/T-KATA-WAVE-6-NOTATION-stsd-sample-080-20261123T200041Z-f0827053/plan.md
  started_at: "2026-11-23T20:00:42.854Z"
  completed_at: "2026-11-23T20:09:37.488Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:stsd-sample
  condense_records:
    - location: 3. 状態の判定 一意判定
      category: repetition
      action: delete
      reason: 「後続遷移が成立した時点で遷移元の状態は終了する」は、直前の「最後に成立した遷移の遷移先を現在状態とする」と同じ内容のため削除した。複数状態へ分類しない規則は残した。
      cause:
        type: document
    - location: 5. 状態遷移 T-06 補足
      category: repetition
      action: merge
      reason: 納品不足分を対象外とする理由は 2. 適用範囲に既にあるため、「対象外のため」に短縮した。不足数量の記録と店主代表への連絡は残した。
      cause:
        type: document
    - location: 5. 状態遷移 通常系の mermaid 辺ラベルと遷移表の条件
      category: figure-prose
      action: retain
      reason: stsd-mermaid-rulebook の記法が辺ラベルにイベントと条件を求めており、遷移表の条件列は必須の表のため、どちらも削れない。
      cause:
        type: document
    - location: 5. 状態遷移 例外系の mermaid 辺ラベルと遷移表の条件
      category: figure-prose
      action: retain
      reason: 通常系と同じ理由で、辺ラベルと条件列はどちらも記法・必須の表として必要なため残した。
      cause:
        type: document
    - location: 4. 状態一覧 成立条件列
      category: table-prose
      action: retain
      reason: 状態ごとの成立条件であり、遷移条件とは見る単位が違う。rulebook の必須列でもあるため残した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- stsd-sample の冗長な記述を 2 箇所削減し、その他 3 件の候補については理由を付記して保持しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stsd-sample.md`: 「3. 状態の判定 一意判定」における重複した説明を削除し、「5. 状態遷移 T-06 補足」における説明を簡略化しました。また、図のラベルや表の条件列、および状態の成立条件列については、記法や必須の表という観点から保持しています。

## 3. 申し送り

- 適用外の検証: `npm run lint:md`（親 runner が実行する許可済みの検査のため、executor では実行しない。）

## 4. 進め方と実践の型の適用

既存の 1 文書の中の冗長さを削る・まとめる・参照に置き換える作業を行いました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `3. 状態の判定 一意判定` | `repetition` | `delete` | `「後続遷移が成立した時点で遷移元の状態は終了する」は、直前の「最後に成立した遷移の遷移先を現在状態とする」と同じ内容のため削除した。複数状態へ分類しない規則は残した。` | `document` |
| `5. 状態遷移 T-06 補足` | `repetition` | `merge` | `納品不足分を対象外とする理由は 2. 適用範囲に既にあるため、「対象外のため」に短縮した。不足数量の記録と店主代表への連絡は残した。` | `document` |
| `5. 状態遷移 通常系の mermaid 辺ラベルと遷移表の条件` | `figure-prose` | `retain` | `stsd-mermaid-rulebook の記法が辺ラベルにイベントと条件を求めており、遷移表の条件列は必須の表のため、どちらも削れない。` | `document` |
| `5. 状態遷移 例外系の mermaid 辺ラベルと遷移表の条件` | `figure-prose` | `retain` | `通常系と同じ理由で、辺ラベルと条件列はどちらも記法・必須の表として必要なため残した。` | `document` |
| `4. 状態一覧 成立条件列` | `table-prose` | `retain` | `状態ごとの成立条件であり、遷移条件とは見る単位が違う。rulebook の必須列でもあるため残した。` | `document` |
