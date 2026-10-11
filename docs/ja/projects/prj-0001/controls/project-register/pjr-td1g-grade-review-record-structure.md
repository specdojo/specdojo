---
specdojo:
  id: prj-0001:pjr-td1g-grade-review-record-structure
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: decided
  priority: medium
  owner: ARC
  registered_at: "2026-09-24T14:01:36Z"
  due_on: "2026-11-21"
  completed_at: "2026-09-26T11:05:49Z"
  conclusion: 統合しない。grade は成果物の品質、review はタスクの完了可否という別の対象を判定し、review は観点ごとの記録を持たなくなるため、記録構造を揃える必要がない。
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

**統合しない（候補 A）。** ただし理由は「変更がない」ではなく、**grade と review は判定の対象が違う**ためである。

[[prj-0001:pjr-2zvs-grade-review-integration]] の最終結論で、grade は成果物の品質を、review はタスクの完了可否を判定する別の経路と定めた。review は成果物を再評価せず、grade の結果を確定済みの事実として受け取る。

| 経路   | 記録するもの                             | 形式               |
| ------ | ---------------------------------------- | ------------------ |
| grade  | 観点ごとの判定（level、score、findings） | sidecar の YAML    |
| review | 完了の判断とその根拠、改善指示           | result の Markdown |

**review は観点ごとに評価しなくなるので、review 側から観点ごとの記録がなくなる。** 観点ごとの判定は grade の sidecar にしか存在しない。確認事項に挙げた「集計できるのは grade 側だけで、review の結果は件数も傾向も追えない」という問題は、review が観点を持たなくなることで生じなくなる。

記録の形式が違うのは判定の対象が違うためであり、揃える必要はない。候補 B・C（review を YAML 化する）は、観点ごとの記録が review からなくなるので不要になる。候補 D（grade を Markdown 化する）は集計できなくなるので採らない。

`done_criteria` の二重判定も同じ理由で解消する。`done_criteria` の充足は grade が判定し、review はその結果を完了判断の材料として使う。

review の観点ごとの記録をなくす作業は [[prj-0001:pjr-n22n-xrp-xrr-review]] で行う。

## 5. 承認

| 項目     | 内容                                                                  |
| -------- | --------------------------------------------------------------------- |
| 回答者   | naoji3x                                                               |
| 回答日   | 2026-09-26                                                            |
| 承認方式 | commit                                                                |
| 証跡     | register event `close`（`events/pjr-td1g.yaml`）と本個票の遷移 commit |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
