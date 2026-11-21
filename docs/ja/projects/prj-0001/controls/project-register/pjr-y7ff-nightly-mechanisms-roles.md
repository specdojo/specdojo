---
specdojo:
  id: prj-0001:pjr-y7ff-nightly-mechanisms-roles
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-11-16T11:00:25Z"
  due_on: null
  derived_from:
    - PJR-C5AF
  commit_type: docs
  commit_scope: routine
---

# PJR-Y7FF 夜間の仕組み（orchestrator night・routine・job）の役割をどう分けるか

## 1. 確認事項

夜間に項目を流す仕組みとして `orchestrator night`（人が承認した todo・issue を流して朝報告を書く）、`routine run`（定期の処理）、`job`（job の定義を流す）の 3 つがある。どれを正にし、ほかを残すか・まとめるか・内部用にするかを決める。

## 2. 入力

- PJR-C5AF で、夜間に項目を流す仕組みが orchestrator night・routine run・job の 3 つあり、役割が重なっていることが分かった。どれを正にし、ほかをどう整理するかを決める

## 3. 背景

0.8.0 までにコマンドを機能ごとに足してきた結果、22 系統・サブコマンド 92 個になった。利用者が覚える範囲と、実装・保守と不具合の面が広がっている（2026-11-16、利用者の指摘）。 コマンドの棚卸し（PJR-C5AF）で、夜間の仕組みが重なっていることが分かった。

## 4. 回答候補

| 候補 | 内容                                                                      | 利点                          | 懸念                                                                      |
| ---- | ------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| A    | routine を正にし、orchestrator night と job は routine から呼ぶ部品にする | 定期の実行の入口が 1 つになる | 朝報告など orchestrator night の固有の振る舞いを routine に移す必要がある |
| B    | 3 つとも残し、役割の違いをガイドで明確にする                              | 互換性を壊さない              | 重なりと保守の負担が残る                                                  |

## 5. 回答・結論

-

## 6. 承認

| 項目     | 内容 |
| -------- | ---- |
| 回答者   | -    |
| 回答日   | -    |
| 承認方式 | -    |
| 証跡     | -    |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 7. 関連ドキュメント

- [[prj-0001:pjr-c5af-command-inventory]]
