---
specdojo:
  id: prj-0001:pjr-k351-continuous-abolition-all-viewpoints
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-25T12:45:13Z"
---

# PJR-K351 continuous を廃止し 28 観点すべてを grade の対象にする

## 1. 概要

`continuous` を廃止し、28 観点すべてを grade の対象にする。grade と review が同じ観点集合を見るという [[prj-0001:pjr-2zvs-grade-review-integration]] の最終結論を実装する。rubric の重みを 4 category から 9 category へ広げるため、**既存の score がすべて変わる**。一度しか起こせない変更なので、観点定義を安定させてから行う。

## 2. 経緯

当初は `vp-ops-agent-boundary` 1 件を試し、`continuous: true` にできるかを決める項目だった。[[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]] の検討で、除外する根拠がどれも成り立たないことが分かり、範囲を 28 観点へ広げた。

| 当初の除外理由                                | 検証の結果                                                                         |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| 主観的な判断を毎回繰り返しても意味がない      | grade は変化したときだけ動く。無変化での再評価は 19 回中 0 回                      |
| 主観的な判断は繰り返すと不安定になる          | 裁量型の `vp-arc-conciseness` の level 変動は 19 回中 1 回（5%）。最も安定していた |
| `vp-dev-change-impact` は変更を対象にしている | 対象は影響の記述の有無であり、スナップショットで判定できる                         |

## 3. 事実

### 3.1. grade の score に入っていない category が 5 つある

| 項目                           | 値                                                           |
| ------------------------------ | ------------------------------------------------------------ |
| 定義された category            | 9                                                            |
| grade の score に入る category | 4（architecture、consistency、quality、usability）           |
| 一度も入らない category        | 5（purpose、planning、business、implementation、operations） |
| score 100 の成果物             | 23 件                                                        |

**23 件の満点は、9 category のうち 5 つを一度も見ていない満点である。**

### 3.2. rubric の重みは 4 category しかない

```yaml
weights:
  kata: { architecture: 20, consistency: 20, quality: 35, usability: 25 }
  deliverable: { architecture: 20, consistency: 25, quality: 30, usability: 25 }
```

### 3.3. grade.ts が continuous に拒否権を重ねている

```typescript
viewpoint.continuous === true && viewpoint.evaluation !== "human";
```

`evaluation !== "human"` は [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]] の改名で外す。本項目では `continuous` の条件そのものを消す。

## 4. 移行の影響

| 影響     | 内容                                                    |
| -------- | ------------------------------------------------------- |
| schema   | `continuous` を削除し、weights を 9 category にする     |
| 既存結果 | 303 件の score が変わる。過去の結果とは比べられなくなる |
| prompt   | agent へ渡す観点が 12 から 28 に増える（2.3 倍）        |
| 閾値     | 70 点という v1 の閾値の意味が変わるため、決め直す       |

**prompt が長くなることが残る懸念である。** 注意が分散し、既存観点の finding の質が下がるおそれがある。実測で確かめる。

## 5. 前提

| 前提                                            | 項目                                                           |
| ----------------------------------------------- | -------------------------------------------------------------- |
| 観点の適用範囲を文書の種類で宣言している        | [[prj-0001:pjr-ag7b-viewpoint-applicability-by-document-kind]] |
| `check` へ判定規準を書き込んでいる              | [[prj-0001:pjr-dkx8-vp-arc-conciseness-vp-ux-user-flow-check]] |
| `evaluation` の改名と実行経路の変更が済んでいる | [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]            |

**適用範囲の宣言がないまま 28 観点へ広げると、絞り込みがないまま全文書に全観点を当てることになり、noise が増える。** 前提 3 件を先に終える。

## 6. 完了条件

- `pm-review-viewpoints.schema.yaml` から `continuous` が削除されている。
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` の 28 観点から `continuous` が削除されている。
- `src/grade.ts` が `continuous` を参照していない。grade の対象は `grade_targets` と文書の種類で決まる。
- rubric の weights が 9 category を持ち、kata と成果物それぞれの重みに理由がある。
- 閾値を決め直しており、理由が記録されている。
- 旧形式の `continuous` を読み込んだ場合、削除済みであることを示すエラーで失敗する。黙って無視しない。
- 標本の文書で試行し、prompt が長くなったことで既存観点の finding の質が下がっていないことを確かめている。
- 既存結果の score が変わることを、利用者が読むガイドに記載している。
- `npm run check` が通過している。

## 7. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                      |
| --- | --------------------------------------------------- | ---- | ---- | ------------------------- |
| 1   | 前提 3 件の完了を待つ                               | ARC  | open |                           |
| 2   | rubric の 9 category の重みを決める                 | QE   | open | kata と成果物で分ける     |
| 3   | 標本で試行し、finding の質を確かめる                | QE   | open | 12 観点と 28 観点を比べる |
| 4   | 閾値を決め直す                                      | QE   | open |                           |
| 5   | schema・defaults・grade.ts から `continuous` を消す | DEV  | open |                           |
| 6   | ガイドへ score の非互換を記載する                   | OPS  | open |                           |

## 8. 対応結果

-

## 9. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- [[prj-0001:pjr-dkx8-vp-arc-conciseness-vp-ux-user-flow-check]]
- [[prj-0001:pjr-49d2-quality-assessment]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml`
- `src/grade.ts`
