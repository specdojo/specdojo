---
specdojo:
  id: prj-0001:pjr-f1jg-cdfd-overview-runner-qe
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-09-26T10:47:18Z"
---

# PJR-F1JG cdfd-overview の評価結果の確定者を runner から QE へ戻す

## 1. 概要

`cdfd-overview.md` の Check 概要が「runner が grade・finding を確定する」と記述しており、`cdfd-check.md`（QE が確定）、`cdfd-uc-deliverable.md` と `cdfd-uc-register.md`（QE が確定）、[[bps-deliverable-evaluation]]（`S-03` 担当 QE）と矛盾する。[[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]] の変更で評価の**実行者**と**確定者**を混同したことが原因である。`cdfd-overview.md` の 1 文を修正する。

## 2. 事実

### 2.1. 矛盾している記述

| 文書                         | 記述                                                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `cdfd-overview` 3.4.         | 「P-08 の grade は editor から独立した runner が成果物の品質を一度だけ評価して **grade・finding を確定する**」 |
| `cdfd-check` `P-08-03`       | 「**QE の最終判断により** grade と finding を確定し」                                                          |
| `cdfd-uc-deliverable`        | QE が確定する                                                                                                  |
| `cdfd-uc-register`           | QE が確定する                                                                                                  |
| `bps-deliverable-evaluation` | `S-02` 担当 runner（照合）、`S-03` 担当 QE（確定）                                                             |

**`cdfd-overview` の 1 文だけが他の 4 文書と食い違う。**

### 2.2. 変更前は QE だった

`cdfd-overview` の P-08 行は変更前も後も担当を QE としている。

```text
変更前: | `P-08` | 成果物評価 | 成果物や登録項目の対応結果を確認し、品質や適合性を評価する。 | QE |
変更後: | `P-08` | 成果物評価 | editor から独立した runner が…一度だけ確認し、品質や適合性を評価する。 | QE |
```

表の担当は QE のまま、概要の文だけが「runner が確定する」になった。**同一文書内でも矛盾している。**

### 2.3. 実行者と確定者は別である

[[prj-0001:pjr-2zvs-grade-review-integration]] の原則は「評価者は作成者から独立する」であり、独立すべき対象は editor である。runner は editor から独立した**実行者**として照合を行い、確定は QE が担う。[[bps-deliverable-evaluation]] はこの分担で書かれている。

## 3. 完了条件

- `cdfd-overview.md` の Check 概要で、runner が評価を実行し QE が確定することが読み取れる。
- `cdfd-overview.md` の P-08 行と概要が一致している。
- `cdfd-check.md`、`cdfd-uc-deliverable.md`、`cdfd-uc-register.md`、[[bps-deliverable-evaluation]] と矛盾しない。
- 「editor から独立」「一度だけ」の記述は維持している。
- grade を再実行し、`cdfd-check` の該当 finding が解消している。

## 4. 修正案

```text
変更前: P-08 の grade は editor から独立した runner が成果物の品質を一度だけ評価して
        grade・finding を確定する。
変更後: P-08 の grade は editor から独立した runner が成果物の品質を一度だけ照合し、
        QE が grade・finding を確定する。
```

## 5. 作業内容

| No  | 作業                                    | 担当 | 状態 | メモ                    |
| --- | --------------------------------------- | ---- | ---- | ----------------------- |
| 1   | `cdfd-overview.md` の 1 文を修正する    | ARC  | open | 実行者と確定者を分ける  |
| 2   | 他 4 文書との整合を確認する             | QE   | open |                         |
| 3   | grade を再実行して finding の解消を確認 | QE   | open | `--stages 1` を明示する |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-h5z7-cdfd-3-bps-2-grade-finding]]
- [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]]
- [[bps-deliverable-evaluation]]
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-check.md`
