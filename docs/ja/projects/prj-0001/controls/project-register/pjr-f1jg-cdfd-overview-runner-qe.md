---
specdojo:
  id: prj-0001:pjr-f1jg-cdfd-overview-runner-qe
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-26T10:47:18Z"
  completed_at: "2026-09-26T11:07:16Z"
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

`cdfd-overview.md` の Check 概要を「runner が…一度だけ照合し、QE が grade・finding を確定する」へ改めた（`772dece3`）。P-08 行の担当（QE）と、97 行目の Action の記述（確定済みの事実として受け取る）は整合していたため変更していない。

### 6.1. grade の結果

`--stages 1`、`codex-expert-executor` / `gemma-reporter` で 2 文書を評価した。終了コードを保つためパイプを通さずに実行し、`grade pipeline complete` の行で完走を確かめた。

| 文書            | 前回（09-26 午前） | 今回   | major     |
| --------------- | ------------------ | ------ | --------- |
| `cdfd-check`    | 79                 | **83** | 3 → **2** |
| `cdfd-overview` | 79                 | 79     | 4 → **7** |

**`cdfd-check` の確定者に関する finding は消えた。** 完了条件の「該当 finding が解消している」を満たす。

### 6.2. cdfd-overview の major が増えた理由

増えた 3 件のうち **2 件は、私が以前 `cdfd-overview` に加えた変更を下位の CDFD へ反映していなかったこと**による。

| finding                                                                                        | 原因                                         |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Do の入力に `Schedule（track）` があるが、`cdfd-do` にない                                     | `1d735942` で `cdfd-overview` だけに追加した |
| track は状態を持たないとしたが、`cdfd-plan` と `cdfd-check` 4.2 は状態を持つとしている         | `1d735942` で `cdfd-overview` だけを訂正した |
| 担当を `owner_rules` から展開するが、`cdfd-orchestrator` 4.1 はカタログから `owner` を参照する | 以前からの不整合                             |

変更内容自体は実装と一致しており正しい。`cdfd-rulebook` は「名称と区分は全体概要から変更しません」と定めており、全体概要を変えたら下位を追従させる必要があった。**その作業が漏れていた。**

前回は `agy-expert-executor`、今回は `codex-expert-executor` で評価したため、検出力の違いが混じっている可能性がある。ただし 2 件は事実として確認できた（`cdfd-do` に Schedule の入力がない、`cdfd-check` 4.2 と `cdfd-plan` の Schedule 行に「状態」がある）。

追従させる作業は別項目で扱う。

## 7. 関連ドキュメント

- [[prj-0001:pjr-h5z7-cdfd-3-bps-2-grade-finding]]
- [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]]
- [[bps-deliverable-evaluation]]
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-check.md`
