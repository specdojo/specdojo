---
specdojo:
  id: prj-0001:pjr-2zvs-grade-review-integration
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: high
  owner: ARC
  registered_at: "2026-09-23T05:10:56Z"
  due_on: "2026-10-17"
  completed_at: "2026-09-23T05:17:27Z"
  conclusion: 観点の evaluation 区分を判定主体の唯一の基準とし、review フェーズ内で runner が grade を実行して verdict の一次入力とする。grade は owner ロールを認識し、定期実行は変化検知に限定する。kata 保守タスクへ review フェーズを追加する。
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

選択肢 C を採る。review フェーズの中で対象文書へ grade を実行し、その結果を verdict の一次入力とする。5 点を次のとおり定める。

### 3.1. 観点の分担は evaluation を唯一の基準とする

| `evaluation`    | 判定主体          | 扱い                           |
| --------------- | ----------------- | ------------------------------ |
| `agent`         | grade             | level と findings を算出する   |
| `deterministic` | grade             | 検証コマンドの結果から判定する |
| `human`         | review のレビュア | grade は判定しない             |

観点ごとに判定主体を二重化しない。`agent` 観点をレビュアが再評価することも、`human` 観点を grade が評価することもしない。観点を追加・変更するときは `evaluation` を必ず指定し、それが実行経路の割り当てになる。

### 3.2. grade は対象文書の owner ロールを認識する

対象文書の owner ロールの観点を主の判定軸とする。owner 以外のロールの `agent` 観点は入力適合性の確認に限定し、`blocker` / `major` を出せるのは「そのロールが自分の責務の成果物を作成できない」場合だけとする。それ以外の指摘は `note` とし、level を下げない。

これは review plan が定める一文書一責務の制御を grade へ移したものである。現在の grade は全文書へ同じ観点を一律に当てているため、責務範囲外の指摘で level が下がる。

### 3.3. verdict は grade の level と human 観点の判定を合成する

grade の level を `grade_rubric` の `review_verdict` で verdict へ写像し、初期値とする。`human` 観点の判定と合成し、最も厳しい判定を採る（`changes_requested` > `conditional_pass` > `pass`）。`blocked` は判定不能を表すため level へ写像せず、レビュアの判断だけで付与する。

レビュアが grade 由来の判定を覆す場合は、対象の viewpoint ID と理由を review result へ記録する。記録のない上書きは行わない。

### 3.4. 定期実行は変化検知に限定する

全件の時間契機実行をやめ、次の 3 つに限定する。

| 契機                         | 対象                                                                 |
| ---------------------------- | -------------------------------------------------------------------- |
| 依存先の `content_hash` 変化 | 自身は変わらないが `depends_on` 先が変わった文書                     |
| kata の更新                  | rulebook / standard の変更後に、それを `rulebook` として宣言する文書 |
| review 経路を持たない文書    | schedule タスクが割り当てられていない文書                            |

変更契機では定期実行を回さない。その文書は review で評価済みである。

### 3.5. kata 保守タスクへ review フェーズを追加する

`sch-strategy-launch.yaml` の `recipe-consolidate` / `rulebook-consolidate` / `sample-consolidate` / `template-consolidate` へ review フェーズを追加し、既存の `xrp-recipe-maintenance-template` / `xrp-rulebook-maintenance-template` / `xrp-sample-maintenance-template` / `xrp-template-maintenance-template` を使う。owner ロールは各 edit タスクの owner を踏襲し、観点セットには `vp-qe-kata-conformance` を必ず含める。

### 3.6. 実行コストの制御

review 内の grade は runner が実行し、executor には行わせない。判定の独立性を保つためである。

対象文書の `content_hash` が既存 sidecar と一致する場合は再実行せず、既存の結果を使う。編集がなければ評価も変わらないため、agent 実行の増加は実際に内容が変わった場合に限られる。

## 4. 採択理由

- 観点とルーブリックは既に共有されており、`review_verdict` への写像も存在する。本決定は新しい概念の追加ではなく、既にある設計の接続である。`evaluation` 区分をそのまま実行経路の分岐に使うため、判定主体の定義を新設する必要がない。
- 案 B（findings を参考提示）では鮮度が保証されない。grade は夜間実行のため、レビュー直前の編集が反映されない。案 C は review の中で実行するため、評価対象と評価結果が常に一致する。
- 案 D（grade で置換）を採らない理由は、review plan の「owner 以外のロールは入力適合性の最低限の確認にとどめる」という制御が grade に無いことである。決定 3.2 でこの制御を grade へ移すが、`human` 観点は機械判定できないため置換はできない。
- 定期実行は廃止できない。`vp-arc-cross-document-consistency` は対象文書が変わらなくても依存先の変更で劣化し、`content_hash` が変わらないため review は再実行されない。rulebook 更新による遡及的な不適合も同じ構造である。一方、当初想定した「kata に schedule タスクがない」は成立しなかった。保守タスクは存在し review テンプレートも揃っているため、定期実行の役割は変化検知に絞れる。
- コスト増は `content_hash` の一致判定で抑えられる。内容が変わっていなければ再実行しないため、追加の agent 実行は実際の編集があった review に限られる。
- findings をレビュアへ渡す向きの問題は、決定 3.1 で解消する。`agent` 観点をレビュアが再評価しない以上、findings を「確認すべき指摘」として渡す必要がない。[[prj-0001:pjr-w5jt-grade-single-stage-nightly]] で観測した、前回 findings の再引用による見落としは構造的に起きなくなる。

## 5. 承認

| 項目     | 内容                                                                  |
| -------- | --------------------------------------------------------------------- |
| 決定者   | naoji3x                                                               |
| 決定日   | 2026-09-23                                                            |
| 承認方式 | commit                                                                |
| 証跡     | register event `close`（`events/pjr-2zvs.yaml`）と本個票の遷移 commit |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 影響範囲   | `src/grade.ts`、`src/review-plan.ts`、`src/exec-plans.ts`、`xrp-*` テンプレート 9 種、`sch-strategy-launch.yaml` の kata 保守タスク、routine の `rtn-grade-*` 3 種 |
| 必要な対応 | 実装を review 経路 / routine 経路 / schedule 経路の 3 系統へ分割して起票する                                                                                       |
| 追跡先     | 本項目および派生する todo                                                                                                                                          |

決定後の実装は、観点分担と verdict 合成（review 経路）、定期実行の契機変更（routine 経路）、kata 保守タスクへの review 追加（schedule 経路）の 3 系統に分かれる見込みである。1 項目にまとめず分割する。

## 7. 関連ドキュメント

- [[prj-0001:pjr-xkks-grade-sidecar]]
- [[prj-0001:pjr-w5jt-grade-single-stage-nightly]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/ja/projects/prj-0001/schedule/sch-strategy-launch.yaml`
- `docs/ja/specdojo/exec-templates/xrp-template.md`
