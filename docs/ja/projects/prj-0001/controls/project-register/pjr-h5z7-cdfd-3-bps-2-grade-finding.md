---
specdojo:
  id: prj-0001:pjr-h5z7-cdfd-3-bps-2-grade-finding
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: QE
  registered_at: "2026-09-26T07:46:14Z"
  completed_at: "2026-09-26T10:47:16Z"
---

# PJR-H5Z7 CDFD 3 本と BPS 2 件の grade を実行し finding を確認する

## 1. 概要

grade と review の関係を確定する一連の作業で、CDFD 3 本を変更し BPS 2 件を新規作成した。いずれも grade を実行していない。5 文書の評価結果を確認し、変更が finding を増やしていないこと、新規 2 件が基準を満たすことを確かめる。

## 2. 対象

| 文書                         | 状態     | 変更元                                                                                                       |
| ---------------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `cdfd-overview`              | 変更     | [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]]、[[prj-0001:pjr-00qv-cdfd-rulebook]] |
| `cdfd-check`                 | 変更     | 同上                                                                                                         |
| `cdfd-action`                | 変更     | 同上                                                                                                         |
| `bps-deliverable-evaluation` | **新規** | [[prj-0001:pjr-h4h7-bps-grade-review]]                                                                       |
| `bps-task-completion`        | **新規** | 同上                                                                                                         |

## 3. 事実

### 3.1. 新規 2 件はカタログに未登録である

`done_criteria` がないため `vp-qe-done-criteria` は評価できない。カタログ登録は [[prj-0001:pjr-mh9e-bps-29-cdfd-14]] で行う。**本項目では `done_criteria` 以外の観点を確認する。**

`vp-arc-cross-document-consistency` がカタログとの不整合を検出する可能性がある。検出された場合、カタログ未登録が原因であることを記録し、`vp-qe-*` の観点と区別する。

### 3.2. 観点の適用範囲が変わっている

[[prj-0001:pjr-ebtz-vp-arc-cross-document-consistency-target-kata-conformance]] で `vp-arc-cross-document-consistency` に `grade_targets: [deliverable]` を設定した。CDFD と BPS はいずれも成果物であるため対象に含まれる。

同項目で finding に「突き合わせ先の文書 ID またはパスと、双方の相反する記述」の明示を必須化した。**この要件が実際に守られるかを確認する初回の機会になる。**

### 3.3. cdfd-overview は 3 回変更されている

| commit     | 内容                                                      |
| ---------- | --------------------------------------------------------- |
| `1d735942` | Do の Schedule 参照を補い、track が状態を持たない旨を訂正 |
| `1cbb2419` | データストア名へ概念の英語名を併記                        |
| `553982be` | edit phase / grade / review phase の所属を反映            |

3 者の変更が矛盾していないかを grade で確認する。

## 4. 完了条件

- 5 文書の grade を実行し、結果が記録されている。
- CDFD 3 本について、変更前と比べて finding が増えていない。増えた場合は原因を特定している。
- 新規 2 件の verdict と finding を確認し、blocker がない。
- `vp-arc-cross-document-consistency` の finding が、突き合わせ先の文書 ID またはパスを明示している。明示されていない場合は [[prj-0001:pjr-ebtz-vp-arc-cross-document-consistency-target-kata-conformance]] の要件が機能していない証拠として記録する。
- カタログ未登録が原因の finding を、内容の問題と区別して記録している。
- BPS 2 件が互いに矛盾していないことを確認している。
- 解消すべき finding があれば起票している。本項目で修正しない。

## 5. 実行方法

対象を限定して実行する。全件再評価は行わない。

```sh
tools/grade/run-per-document.sh --run-id <id> --target deliverable \
  --path docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md \
  --path docs/ja/product/010-business-specs/010-data-flow/cdfd-check.md \
  --path docs/ja/product/010-business-specs/010-data-flow/cdfd-action.md \
  --path docs/ja/product/010-business-specs/030-business-model/bps-deliverable-evaluation.md \
  --path docs/ja/product/010-business-specs/030-business-model/bps-task-completion.md
```

sandbox 内では Codex クライアントが初期化できない場合がある。sandbox 外で実行する。

## 6. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ                    |
| --- | ------------------------------------------ | ---- | ---- | ----------------------- |
| 1   | 5 文書の grade を実行する                  | QE   | open | 対象限定。sandbox 外    |
| 2   | CDFD 3 本の finding を変更前と比較する     | QE   | open |                         |
| 3   | 新規 2 件の verdict と finding を確認する  | QE   | open | blocker の有無          |
| 4   | 突き合わせ先の明示が守られているか確認する | QE   | open | PJR-EBTZ の要件の初検証 |
| 5   | 解消すべき finding を起票する              | QE   | open | 本項目で修正しない      |

## 7. 対応結果

5 文書の grade を実行した。新規 BPS 2 件は良好で、CDFD 3 本は既存の問題と今回の変更由来の不整合を含む。

### 7.1. 評価結果

| 文書                         | verdict      | score | findings | executor                |
| ---------------------------- | ------------ | ----- | -------- | ----------------------- |
| `cdfd-overview`              | `needs-work` | 79    | M4 m3    | `agy-expert-executor`   |
| `cdfd-check`                 | `needs-work` | 79    | M3 m6    | `codex-expert-executor` |
| `cdfd-action`                | `needs-work` | 65    | M5 m2    | `agy-expert-executor`   |
| `bps-deliverable-evaluation` | `needs-work` | 92    | M1 m1    | `agy-expert-executor`   |
| `bps-task-completion`        | **`pass`**   | 96    | M0 m2    | `agy-expert-executor`   |

いずれも codex 単段（`--stages 1`）で評価した。`cdfd-check` のみ codex、残りは codex の rate limit により `agy-expert-executor` で評価したため、executor が揃っていない。

### 7.2. 突き合わせ先の明示は機能している

[[prj-0001:pjr-ebtz-vp-arc-cross-document-consistency-target-kata-conformance]] で `check` へ追加した「不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する」は、**5 件すべての `vp-arc-cross-document-consistency` の finding で守られた。**

```text
成果物カタログの `cdfd-onboarding` は…本書の P-01 は…限定しており
本書は Action の主要入力を…とする一方、`cdfd-action` は…生成しており
「member・agent・runner の責任分担」の正本を `pm-roles` としているが…
```

`check` への記述要件の追加が agent の出力形式を実際に変えた。記述による強制が機能する実証である。

### 7.3. 今回の変更が新しい矛盾を作った

**評価結果の確定者**が文書間で食い違っている。

| 文書             | 記述                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `cdfd-overview`  | 「editor から独立した runner が成果物の品質を一度だけ評価して **grade・finding を確定する**」 |
| `cdfd-check`     | `P-08-03`「**QE の最終判断により** grade と finding を確定し」                                |
| `cdfd-uc-*` 2 本 | QE が確定する                                                                                 |

[[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]] で `cdfd-overview` の Check 概要を書き換えた際、評価の**実行者**（runner）と**確定者**（QE）を混同した。変更前の `cdfd-overview` の P-08 は担当を QE としており、確定者は QE である。

**runner は評価を実行し、QE が確定する**という [[bps-deliverable-evaluation]] の構造（`S-02` 担当 runner、`S-03` 担当 QE）とも食い違う。`cdfd-overview` の 1 文だけが誤っている。

### 7.4. 既存の問題

今回の変更と無関係に以前から存在する指摘である。

| 文書            | 指摘                                                                              |
| --------------- | --------------------------------------------------------------------------------- |
| `cdfd-overview` | P-01 の起点が `cdfd-onboarding` の対象範囲より狭い                                |
| `cdfd-overview` | 14 領域・六グループへの改訂について PO の承認記録がない                           |
| `cdfd-check`    | プロセス表に rulebook 必須の「完了条件」列がない                                  |
| `cdfd-action`   | プロセス表に「完了条件」列、例外表に「停止範囲」列がない                          |
| `cdfd-action`   | P-12 の承認結果と P-13 の非推奨化判断が、上位の外部入力から内部生成へ変わっている |

`cdfd-action` の 65 点は主にこれらによる。

### 7.5. BPS 2 件の指摘

| 文書                         | 重大度 | 指摘                                                            |
| ---------------------------- | ------ | --------------------------------------------------------------- |
| `bps-deliverable-evaluation` | major  | `T-02` の不成立時の扱いが「本プロセスを開始する」で論理的に矛盾 |
| `bps-deliverable-evaluation` | minor  | 既存評価結果の再利用の記述が 3 章で反復                         |
| `bps-task-completion`        | minor  | 再評価しない方針が概要と処理ステップで重複                      |
| `bps-task-completion`        | minor  | 前提条件に yes / no で判定できない遵守事項が入っている          |

いずれも正当な指摘であり、構造上の問題ではない。

### 7.6. カタログ未登録の影響は出なかった

BPS 2 件はカタログ未登録だが、`vp-arc-cross-document-consistency` はカタログとの不整合を指摘しなかった。`vp-qe-done-criteria` も finding を出していない。**先行作成の代償として想定した問題は発生しなかった。**

### 7.7. 実行の経緯

3 回を要した。

| 回  | 段構成       | 結果                                                                     |
| --- | ------------ | ------------------------------------------------------------------------ |
| 1   | 3 段（誤り） | `--stages` を省略し廃止済みの gemma 構成になった。中断                   |
| 2   | 単段 codex   | 2 文書で打ち切り。終了コード 0。`cdfd-action` が前回状態の移行で完了扱い |
| 3   | 単段 agy     | 4 文書を完走                                                             |

1 回目の原因は script の既定が `stages=3` のままだったことで、`593c36e8` で既定を 1 へ修正した。2 回目の打ち切りが検出されない問題は [[prj-0001:pjr-9pz7-grade-0]] で扱う。

## 8. 関連ドキュメント

- [[prj-0001:pjr-h4h7-bps-grade-review]]
- [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]]
- [[prj-0001:pjr-ebtz-vp-arc-cross-document-consistency-target-kata-conformance]]
- [[prj-0001:pjr-mh9e-bps-29-cdfd-14]]
- `tools/grade/run-per-document.sh`
