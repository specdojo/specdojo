---
specdojo:
  id: prj-0001:pjr-6xnj-grade-graded-by
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-30T01:11:23Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-30T02:55:39Z"
  conclusion: grade apply --by `<nickname>` を追加し、指定値を pm-members.yaml と照合してから specdojo.grade.graded_by へ記録するようにした。agent が GradeSubmission で自己申告した値は保存に使わず、新規 plan から自己申告欄を削除した。既存の GradeSubmission にある graded_by は引き続き解析でき、保存済み grade の schema も変更していない。
---

# PJR-6XNJ grade の graded_by を CLI 側で確定させる

## 1. 概要

GradeSubmission の `graded_by` は agent が自己申告するため、値が安定しない。同一 agent の連続実行でも異なる値が記録される。

どの agent がどう判定したかを追跡できないため、agent 別の傾向分析と再現性の検証が成立しない。plan で値を指定するか、`grade apply` の実行時に CLI が確定させる方式へ変更する。

## 2. 完了条件

- 同一 agent で繰り返し評価しても `graded_by` が同じ値になる。
- 値が `pm-members.yaml` の nickname など、agent を一意に識別できる語彙に基づいている。
- agent の自己申告が誤っていても、記録される値が正しい。
- 既存の grade 記録との互換性が保たれている。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                     | 担当 | 状態 | メモ                                      |
| --- | ------------------------ | ---- | ---- | ----------------------------------------- |
| 1   | 確定方法の決定           | ARC  | done | `grade apply --by` で CLI が確定する      |
| 2   | 識別子の語彙の決定       | ARC  | done | `pm-members.yaml` の nickname を使う      |
| 3   | 実装                     | ARC  | done | 自己申告値を無視して CLI 指定値を記録する |
| 4   | 既存記録との互換性の確認 | ARC  | done | 既存 snapshot と旧 Submission を受理する  |

### 3.1. 観測された値

6 つの agent で同一の plan を実行した際の実測値である。

| agent                    | 記録された `graded_by`                                        |
| ------------------------ | ------------------------------------------------------------- |
| `codex-expert-executor`  | `/root`                                                       |
| `codex-executor`         | `/root`                                                       |
| `qwen-expert-executor`   | `executor-agent` および `specdojo-grade/qwen-expert-executor` |
| `claude-expert-executor` | `claude`                                                      |
| `claude-executor`        | `claude-sonnet-4-5`                                           |
| `gemma-expert-executor`  | モデル名                                                      |

codex は実行環境のパスを返しており、agent を識別できない。qwen は同一 agent の2回の実行で異なる値を返した。claude は expert と normal で語彙が揃っていない。

### 3.2. 影響

- agent 別の傾向を集計できない。どの agent が甘くどの agent が厳格かを、記録された grade から追跡できない。
- 再現性を検証できない。同一文書を複数回評価したときのレベル差を測る際、実行主体を特定できない。
- 評価の妥当性を後から検討できない。品質の低い判定が見つかっても、どの agent によるものか判別できない。

### 3.3. 検討する方式

| 方式                        | 利点                         | 欠点                                      |
| --------------------------- | ---------------------------- | ----------------------------------------- |
| plan へ値を埋め込む         | agent は指示に従うだけでよい | agent が書き換える余地が残る              |
| `apply` の引数で受け取る    | 呼び出し側が確実に制御できる | 実行経路ごとに指定が必要                  |
| 実行時の agent 情報から導出 | 自動で正しい値になる         | grade が agent 起動の文脈を知る必要がある |

agent の自己申告を信用しない方式が望ましい。判定内容は agent に委ねるが、実行主体の記録は事実として CLI が持つべきである。

### 3.4. 決定事項

- 判定主体にはモデル名ではなく、実行ログでも使う安定識別子である `pm-members.yaml` の nickname を記録する。モデルの追跡は provider ごとに取得方法が異なるため、この項目へ混在させない。
- `grade apply` に `--by <nickname>` を必須とし、名簿にない値を拒否する。GradeSubmission に従来の `graded_by` が含まれていても入力互換性のため受理するが、保存値には使わない。
- 既存の grade snapshot は移行せず維持する。再評価した文書だけ、通常の snapshot 更新として CLI が確定した nickname へ置き換える。

## 4. 対応結果

`grade apply --by <nickname>` を追加し、指定値をプロジェクトの `pm-members.yaml` と照合してから `specdojo.grade.graded_by` に記録するよう変更した。agent が GradeSubmission で自己申告した値は保存に使わず、新規 plan から自己申告欄を削除した。

既存の GradeSubmission にある `graded_by` は引き続き解析でき、既に文書へ保存された grade snapshot の schema も変更していない。コマンドリファレンス、文書メタデータ標準、Kata grade Job Definition を新しい `--by` 契約に合わせて更新した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 値の不安定さを観測した実測記録。
- [[prj-0001:pjr-49d2-quality-assessment]]: grade の設計と Frontmatter への記録形式。
