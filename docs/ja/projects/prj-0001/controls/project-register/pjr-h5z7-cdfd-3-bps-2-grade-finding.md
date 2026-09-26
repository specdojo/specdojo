---
specdojo:
  id: prj-0001:pjr-h5z7-cdfd-3-bps-2-grade-finding
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: QE
  registered_at: "2026-09-26T07:46:14Z"
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

-

## 8. 関連ドキュメント

- [[prj-0001:pjr-h4h7-bps-grade-review]]
- [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]]
- [[prj-0001:pjr-ebtz-vp-arc-cross-document-consistency-target-kata-conformance]]
- [[prj-0001:pjr-mh9e-bps-29-cdfd-14]]
- `tools/grade/run-per-document.sh`
