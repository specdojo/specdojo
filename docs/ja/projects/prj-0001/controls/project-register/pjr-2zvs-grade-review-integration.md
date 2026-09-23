---
specdojo:
  id: prj-0001:pjr-2zvs-grade-review-integration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-23T05:10:56Z"
  due_on: "2026-10-17"
---

# PJR-2ZVS grade と review の役割分担を evaluation 区分で定義し、評価経路を統合する

## 1. 背景

grade は routine（夜間）で kata と成果物を評価し、sidecar へ level / score / findings を書く。schedule の review はフェーズとして実行され、ロール別の観点で verdict を出す。両者は独立した経路だが、実際には同じ資産を共有している。

`pm-review-viewpoints.yaml` の `grade_rubric` にはこう書かれている。

> grade と review が共有する離散ルーブリック。review の blocked は判定不能を表すため level へ写像せず、根拠が揃った判定だけを pass / conditional_pass / changes_requested へ対応させる。

level 0〜4 には `review_verdict` が対応づけられており、grade の結果を review 判定へ読み替える意図が設計に残っている。しかし現在この写像は使われていない。

### 1.1. 観点は evaluation で分類済み

28 観点には `evaluation` が付いており、機械が判定できるものと人が判定するものが既に分かれている。

| `evaluation`    | 件数 | 内訳                                                                                                                                                                                                                              |
| --------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agent`         | 10   | `vp-arc-cross-document-consistency` / `conciseness` / `single-responsibility`、`vp-qe-done-criteria` / `verifiability` / `omissions-consistency` / `kata-conformance`、`vp-ux-readability` / `user-flow` / `language-consistency` |
| `deterministic` | 2    | `vp-arc-document-structure`、`vp-qe-config-validity`                                                                                                                                                                              |
| `human`         | 16   | PO / PM / BA / DEV / OPS の全観点と `vp-arc-technical-constraints`                                                                                                                                                                |

実際の grade 結果（`cdfd-overview`）に載る観点は `agent` と `deterministic` のみで、PO / BA / DEV の観点は評価されていない。grade は形式適合だけを見ているのではなく、機械が判定できる範囲の内容妥当性を評価している。`vp-arc-cross-document-consistency` は「成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか」を見る観点である。

### 1.2. 現状の重複

|              | grade                               | review                               |
| ------------ | ----------------------------------- | ------------------------------------ |
| 契機         | 時間（夜間の routine）              | 変更（フェーズ実行）                 |
| 対象観点     | `agent` / `deterministic`           | ロール別サブセット（`human` を含む） |
| 出力         | sidecar（level / score / findings） | review result（verdict）             |
| ルーブリック | `grade-rubric-v1`                   | 同じ（写像経由）                     |

`agent` 観点は両方で評価されている。review plan には grade の findings が渡っておらず（`_GRADE_FINDINGS_` は `xep-*` 7 種にあり `xrp-*` には無い）、レビュアは grade が検出済みの事項を一から探している。

### 1.3. kata 保守タスクの現状

`sch-strategy-launch.yaml` に kata の保守タスクが 4 つある。いずれも `mode: edit` で review フェーズを持たない。

| id                     | approach               |
| ---------------------- | ---------------------- |
| `recipe-consolidate`   | `recipe-maintenance`   |
| `rulebook-consolidate` | `rulebook-maintenance` |
| `sample-consolidate`   | `sample-maintenance`   |
| `template-consolidate` | `template-maintenance` |

一方、レビュー plan テンプレート `xrp-recipe-maintenance-template.md` / `xrp-rulebook-maintenance-template.md` / `xrp-sample-maintenance-template.md` / `xrp-template-maintenance-template.md` は 4 つとも存在する。review フェーズを置く部品は揃っているが、strategy 側で使われていない。

## 2. 検討した選択肢

| 選択肢 | 内容                                                                            | 利点                                                                 | 懸念                                                                               |
| ------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| A      | 現状維持。grade と review を独立に運用する                                      | 変更不要                                                             | `agent` 観点の二重評価が残る。レビュー通過後も findings が残り誰も解消を確認しない |
| B      | review plan へ grade の findings を参考として渡す                               | 実装が小さい                                                         | 夜間評価のため鮮度が保証されない。二系統で評価する構造は残る                       |
| C      | review フェーズの中で対象文書へ grade を実行し、結果を verdict の一次入力にする | 鮮度が保証され、評価が 1 回になる。`review_verdict` の写像を活かせる | agent 実行が 1 回増える                                                            |
| D      | grade を review へ完全に置き換える                                              | 経路が 1 本になる                                                    | ロール別サブセットと一文書一責務の制御が失われ、過剰なレビューになる               |

## 3. 決定内容

_UNDECIDED_: 下表の 5 点を決める。

| No  | 決めること         | 案                                                                                                                        |
| --- | ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | 観点の分担         | `evaluation` を唯一の基準にする。`agent` / `deterministic` は grade、`human` は review が判定する                         |
| 2   | grade のロール認識 | 対象文書の owner ロールの観点を主とし、他ロールの `agent` 観点は入力適合性の確認に限定する（review と同じ一文書一責務）   |
| 3   | verdict の合成     | grade の level から `review_verdict` を導いて初期値とし、`human` 観点の判定と合成する。レビュアが覆す場合は理由を記録する |
| 4   | 定期実行の役割     | 変更契機では回さない。依存先の `content_hash` 変化、rulebook 更新後の遡及確認に限定する                                   |
| 5   | kata 保守タスク    | 4 つの保守タスクへ review フェーズを追加し、既存の `xrp-*-maintenance` テンプレートを使う                                 |

案 C を骨格とする。案 D を採らない理由は、review plan が定める「owner 以外のロールは入力適合性の最低限の確認にとどめる（一文書一責務）」という制御が grade 側に無く、置き換えると全観点を一律に当てる過剰なレビューになるためである。

## 4. 採択理由

_UNDECIDED_: 決定内容の確定後に記載する。検討時点での根拠は次のとおり。

- 観点とルーブリックは既に共有されており、`review_verdict` への写像も存在する。統合は新しい概念の追加ではなく、既にある設計の接続である。
- 定期実行は廃止できない。`vp-arc-cross-document-consistency` は対象文書が変わらなくても依存先の変更で劣化する。`content_hash` が変わらないため review は再実行されず、時間契機でしか検知できない。rulebook 更新による遡及的な不適合も同じ構造である。
- 「kata に schedule タスクがない」は成立しない。保守タスクは存在し、review テンプレートも揃っている。定期 grade の役割は当初想定より狭く、依存関係の変化による劣化検知に絞られる。
- findings をレビュアへ渡す際は提示の向きに注意する。gemma で grade を多段構成にしたとき、前回の findings を再引用して主要な問題を見落とす挙動が観測された（[[prj-0001:pjr-w5jt-grade-single-stage-nightly]] の経緯）。「確認済みのため再指摘しない」という向きで渡す必要がある。

## 5. 承認

| 項目     | 内容                                     |
| -------- | ---------------------------------------- |
| 決定者   | _TODO_                                   |
| 決定日   | _TODO_                                   |
| 承認方式 | commit                                   |
| 証跡     | _TODO_: close 時の遷移 commit を記載する |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 影響範囲   | `src/grade.ts`、`src/review-plan.ts`、`src/exec-plans.ts`、`xrp-*` テンプレート 9 種、`sch-strategy-launch.yaml` の kata 保守タスク、routine の `rtn-grade-*` 3 種 |
| 必要な対応 | 決定後に実装項目を分割して起票する                                                                                                                                 |
| 追跡先     | 本項目および派生する todo                                                                                                                                          |

決定後の実装は、観点分担と verdict 合成（review 経路）、定期実行の契機変更（routine 経路）、kata 保守タスクへの review 追加（schedule 経路）の 3 系統に分かれる見込みである。1 項目にまとめず分割する。

## 7. 関連ドキュメント

- [[prj-0001:pjr-xkks-grade-sidecar]]
- [[prj-0001:pjr-w5jt-grade-single-stage-nightly]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/ja/projects/prj-0001/schedule/sch-strategy-launch.yaml`
- `docs/ja/specdojo/exec-templates/xrp-template.md`
