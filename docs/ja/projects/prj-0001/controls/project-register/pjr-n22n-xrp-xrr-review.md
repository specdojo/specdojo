---
specdojo:
  id: prj-0001:pjr-n22n-xrp-xrr-review
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: QE
  registered_at: "2026-09-26T06:13:37Z"
---

# PJR-N22N xrp と xrr テンプレートを review が評価しない前提へ改訂する

## 1. 概要

[[prj-0001:pjr-h4h7-bps-grade-review]] で確定した設計では、review は成果物を再評価せず、grade を事実として受け取ってタスクの完了可否を判断する。現在の `xrp-*` テンプレートはレビュー観点ごとに pass / fail / unclear を判定する指示であり、**review が評価を行う前提**で書かれている。12 本のテンプレートを改訂する。

## 2. 事実

### 2.1. 現在は review が観点を評価する指示である

`xrp-freeform-template.md` の記述である。

```text
1. レビュー観点（`RVP-NNN`）を満たしているかを主な基準にする。
- レビュー観点ごとの pass / fail / unclear 判定と根拠:
  review result の `レビュー観点別結果` セクション（各 `RVP-NNN`）。
```

これは成果物の評価であり、`bps-deliverable-evaluation` が定める `P-08` の責務と重複する。

### 2.2. owner 以外のロールを絞る指示が残っている

```text
owner ロールの観点は、成果物がその責務を果たしているかを確認する。owner 以外の
ロールの観点は…入力適合性の最低限の確認とし…過剰な再レビューはしない
```

[[prj-0001:pjr-2zvs-grade-review-integration]] の決定 3.2 は責務による重み付けを撤回している。review が評価しない前提では、この指示自体が不要になる。

### 2.3. 対象は 12 本

| 種別    | 本数 |
| ------- | ---- |
| `xrp-*` | 10   |
| `xrr-*` | 2    |

`xrp-viewpoint-detail-template.md` と `xrr-viewpoint-detail-template.md` は観点別の詳細を記録する雛形であり、review が評価しないなら役割が変わる。

## 3. 改訂の方向

| 対象                   | 変更前                                  | 変更後                                           |
| ---------------------- | --------------------------------------- | ------------------------------------------------ |
| `xrp-*`                | 観点ごとに pass / fail / unclear を判定 | grade の結果を確認し、タスクの完了可否を判断する |
| `xrr-*`                | 観点別結果を記録                        | 判断とその根拠、改善指示を記録                   |
| `*-viewpoint-detail-*` | 観点別の詳細を記録                      | **要否を判断する**。grade 側へ移るなら不要       |

`bps-task-completion` の受入観点が改訂の基準になる。

```text
完了可能 / 品質 finding を伴う完了 / 品質良好だが未完了 /
評価結果が最新でない / 評価不能 / review 中の成果物変更
```

## 4. 完了条件

- `xrp-*` が観点ごとの評価を指示していない。grade の結果を入力として使う指示になっている。
- `xrp-*` に grade が最新でない場合の扱いがある。`bps-task-completion` の `E-01` と対応する。
- `xrr-*` が判断とその根拠、改善指示を記録する構成になっている。
- `xrr-*` の verdict が `bps-task-completion` の受入観点 6 区分と対応している。
- `*-viewpoint-detail-*` の要否が決まっている。不要なら削除し、参照元から外す。
- owner 以外のロールを絞る指示が削除されている。決定 3.2 で撤回済みである。
- 12 本の間で記述が矛盾していない。共通事項は `xep-common-conventions-template.md` へ寄せる。
- `specdojo exec validate` が通過している。
- review を 1 件試行し、生成される plan と result が意図どおりであることを確認している。

## 5. 留意点

**review の実務が変わる変更である。** 現在 review を通す運用があるため、改訂と同時に既存の review plan が無効にならないかを確認する。`sch-strategy-*.yaml` の `review` phase の位置づけ変更も連動するが、そちらは別途扱う。

grade が 28 観点すべてを見る前提（[[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]] と [[prj-0001:pjr-k351-continuous-abolition-all-viewpoints]]）が未実装の段階では、grade は 12 観点しか見ない。**改訂の適用時期を、観点範囲の拡大と合わせるかを判断する。** 先に改訂すると、review が見なくなった 16 観点を誰も見ない期間が生じる。

## 6. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ                               |
| --- | -------------------------------------- | ---- | ---- | ---------------------------------- |
| 1   | 観点範囲の拡大との適用順序を決める     | QE   | open | **着手前の判断**。空白期間を避ける |
| 2   | `*-viewpoint-detail-*` の要否を決める  | QE   | open | 2 本                               |
| 3   | `xrp-*` 10 本を改訂する                | QE   | open | grade の結果を入力に               |
| 4   | `xrr-*` 2 本を改訂する                 | QE   | open | 受入観点 6 区分と対応              |
| 5   | owner 以外のロールを絞る指示を削除する | QE   | open | 決定 3.2 で撤回済み                |
| 6   | review を 1 件試行して確認する         | QE   | open | plan と result を確認              |

## 7. 対応結果

-

## 8. 関連ドキュメント

- [[prj-0001:pjr-h4h7-bps-grade-review]]
- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- [[bps-task-completion]]
- `docs/ja/specdojo/exec-templates/xrp-template.md`
- `docs/ja/specdojo/exec-templates/xrr-template.md`
