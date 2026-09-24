---
specdojo:
  id: prj-0001:pjr-td1g-grade-review-record-structure
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-24T14:01:36Z"
  due_on: "2026-11-21"
---

# PJR-TD1G grade と review の記録構造を統合するかを決める

## 1. 確認事項

観点別の判定を grade は sidecar の YAML（level / score / findings）、review は result の Markdown（result / evidence / notes）で持ち、同じ関心を別形式で記録している。findings も grade は構造化、review は自由記述で集計できない。done_criteria の判定も grade の criteria ファイルと review の観点表で二重に行う。統合すれば集計と追跡が揃うが、review result が人の読む Markdown であることの価値を失う可能性がある。語彙の統一（PJR-XXXX）とは切り離して判断する。

## 2. 背景

[[prj-0001:pjr-2zvs-grade-review-integration]] の見直しで判定語彙の重複を解消することにしたが（[[prj-0001:pjr-xtan-unify-verdict-vocabulary]]）、記録構造にも重複が残る。

| 関心                   | grade                                                                | review                                                |
| ---------------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| 観点ごとの判定         | sidecar の YAML（`viewpoints: {level, score, findings}`）            | result の Markdown（`result` / `evidence` / `notes`） |
| findings               | 構造化（`id` / `severity` / `rule` / `line` / `anchor` / `message`） | Markdown の自由記述                                   |
| `done_criteria` の判定 | `criteria/*.yaml` に `satisfied` / `unsatisfied` と理由              | `xrp` の観点表で確認                                  |

同じ関心を別形式で持つため、集計できるのは grade 側だけである。review の結果は件数も傾向も追えない。

## 3. 回答候補

| 候補 | 内容                                                                          | 利点                              | 懸念                                                                     |
| ---- | ----------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| A    | 現状維持                                                                      | 変更が無い                        | review の結果を集計・追跡できない                                        |
| B    | review result も sidecar（YAML）を併産する。Markdown は人が読む本文として残す | 集計できる。Markdown の価値も残る | 二重に書く。reporter の負担と不整合の risk                               |
| C    | review result を YAML 正本にし、表示用 Markdown を生成する                    | 一貫する。grade と同じ扱いになる  | 人が読む文書としての自由度を失う。`evidence` や `notes` の表現力が落ちる |
| D    | grade 側を Markdown へ寄せる                                                  | 人が読みやすい                    | 集計できなくなる。既存の dashboard と routine が壊れる                   |

判断の材料として、review の結果を集計したい具体的な場面があるかを確認する必要がある。現状 review は schedule のフェーズとしてのみ実行され、件数も多くない。需要が無ければ候補 A で足りる。

`done_criteria` の二重判定については、[[prj-0001:pjr-2zvs-grade-review-integration]] の決定 3.1 に照らすと、`agent` 観点に紐づく条件は grade、`human` 観点に紐づく条件は review という分担が自然である。ただし現状の grade は `evaluation` を問わず全条件を判定しており、この点も整理の対象となる。

## 4. 回答・結論

_TODO_: 回答または採択した方針を記載する。未回答の場合は `-` とする。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 回答者   | _TODO_ |
| 回答日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
