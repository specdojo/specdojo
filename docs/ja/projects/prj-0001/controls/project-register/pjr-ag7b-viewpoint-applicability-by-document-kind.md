---
specdojo:
  id: prj-0001:pjr-ag7b-viewpoint-applicability-by-document-kind
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-26T10:59:16Z"
---

# PJR-AG7B 観点の適用範囲を文書の種類で宣言し check の場当たり的な除外条件を移す

## 1. 概要

観点がどの種類の文書に当てはまるかを宣言する仕組みがなく、観点側が `check` の文面へ場当たり的に除外条件を書き込んで補っている。`grade_targets`（`kata` / `deliverable` の 2 値）を文書の種類へ細かく分け、除外条件を宣言へ移す。[[prj-0001:pjr-k351-continuous-abolition-all-viewpoints]] で 28 観点へ広げる前提である。

## 2. 事実

### 2.1. check に除外条件が書き込まれている

28 観点のうち 3 件が、`check` の中に適用条件を書いている。**3 件とも条件の軸は文書の種類である。**

| 観点                           | 書き込まれた条件                                                |
| ------------------------------ | --------------------------------------------------------------- |
| `vp-ba-business-value`         | 構造・設定中心の成果物では業務上の Why の詳細な再掲を要求しない |
| `vp-ux-readability`            | 説明を持つ成果物では…／構造・設定中心の成果物では…              |
| `vp-arc-single-responsibility` | index・catalog・overview は分割対象から除外する                 |

役割（Role）を軸にした除外は 1 件もない。そのため RACI や owner で観点を絞っても、これらは `check` に残る（[[prj-0001:pjr-d4kg-document-owner-declaration]] の検討で確認済み）。

### 2.2. grade_targets は粗い形で機能している

| 観点                     | rulebook | sample | template | recipe | 成果物 |
| ------------------------ | -------- | ------ | -------- | ------ | ------ |
| `vp-qe-done-criteria`    | 0%       | 0%     | 0%       | 0%     | 62%    |
| `vp-ux-user-flow`        | 0%       | 0%     | 0%       | 0%     | 48%    |
| `vp-qe-kata-conformance` | 82%      | 86%    | 47%      | 61%    | 0%     |

数値は非満点率である。`grade_targets` で除外した組み合わせは正しく 0% になっている。**この仕組みを 2 値から文書の種類へ細かくすればよい。**

### 2.3. 文書の種類は既に宣言されている

frontmatter の `specdojo.rulebook` が文書の種類を表す。実在する rulebook は 93 種類である。新しくフィールドを設けなくても種類を特定でき、二重管理にならない。

ただし 1793 文書のうち `rulebook` を持つのは 1086 件で、そのうち 513 件は値が `none` である。**`rulebook` を持たない文書の扱いを決める必要がある。**

## 3. 完了条件

- 観点ごとに、当てはまる文書の種類を宣言できる。宣言の粒度（rulebook 単位か、型の分類単位か）が決まっている。
- 上の 3 観点の除外条件が `check` から宣言へ移っている。`check` には判定の中身だけが残る。
- `rulebook` を持たない文書、`none` の文書の扱いが決まっている。
- grade が宣言に従って観点を選ぶ。適用しない観点は prompt へ渡さない。
- review の観点選択も同じ宣言を使う。grade と review で適用範囲が食い違わない。
- 既存の `grade_targets` との関係が整理されている。置き換えるか、併用するか。
- 除外条件を移したあと grade を試行し、finding が不当に増えたり減ったりしていない。

## 4. 検討事項

### 4.1. 宣言の粒度

| 案  | 粒度                                        | 利点                                   | 懸念                           |
| --- | ------------------------------------------- | -------------------------------------- | ------------------------------ |
| 1   | rulebook ID（93 種類）                      | 正確                                   | 宣言の数が多い                 |
| 2   | 型の分類（構造中心 / 説明中心 / 索引 など） | 宣言が少ない。除外条件の書き方に近い   | 分類を新しく定義する必要がある |
| 3   | 1 と 2 の併用                               | 既定を分類で、例外を rulebook で書ける | 仕組みが複雑になる             |

除外条件の文面は「構造・設定中心の成果物」「説明を持つ成果物」「index・catalog・overview」と**分類**で書かれている。案 2 が自然である。

## 5. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ            |
| --- | ------------------------------------------ | ---- | ---- | --------------- |
| 1   | 宣言の粒度を決める                         | ARC  | open | 案 2 を起点     |
| 2   | `rulebook` を持たない文書の扱いを決める    | ARC  | open | 513 件が `none` |
| 3   | schema と defaults へ宣言を追加する        | DEV  | open |                 |
| 4   | 3 観点の除外条件を宣言へ移す               | ARC  | open |                 |
| 5   | grade と review の観点選択を宣言に従わせる | DEV  | open |                 |
| 6   | grade を試行して finding の増減を確かめる  | QE   | open |                 |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-k351-continuous-abolition-all-viewpoints]]
- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- [[prj-0001:pjr-d4kg-document-owner-declaration]]
- [[prj-0001:pjr-2zvs-grade-review-integration]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
