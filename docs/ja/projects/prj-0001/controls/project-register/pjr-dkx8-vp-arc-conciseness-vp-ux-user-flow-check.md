---
specdojo:
  id: prj-0001:pjr-dkx8-vp-arc-conciseness-vp-ux-user-flow-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-25T12:45:12Z"
---

# PJR-DKX8 vp-arc-conciseness と vp-ux-user-flow の check へ判定規準を書き込む

## 1. 概要

`vp-arc-conciseness` と `vp-ux-user-flow` は、[[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]] の基準で `discretionary`（判定者が規準を持ち込む）に分類される。`check` に判定規準を書き込めば `referential`（参照との照合）へ移せる。同じ扱いの `vp-arc-single-responsibility` と `vp-ux-readability` が先例になる。

## 2. 事実

### 2.1. 先例は check 自身が規準を供給している

同じく「必要十分」「責務が一つ」という裁量の語を含むが、`check` が判定の境界を書き込んでいるため照合できる。

| 観点                           | `check` が供給する規準                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| `vp-arc-single-responsibility` | 分量や型の数だけでは不備としない。index・catalog・overview は分割対象から除外する      |
| `vp-ux-readability`            | 長さだけでは fail にしない。冗長箇所を特定できれば minor、主旨が読み取れなければ major |

### 2.2. 対象の 2 観点は規準を持たない

| 観点                 | 現在の `check`                                                                                       | finding |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `vp-arc-conciseness` | 各節が固有の判断または手順に寄与し、同じ主張の反復、一般論、正本の過剰な再掲がなく、必要十分な記述か | 46      |
| `vp-ux-user-flow`    | 利用者や将来貢献者が迷わず必要情報へ到達できる構成になっているか                                     | 22      |

`vp-arc-conciseness` は禁止する事象（反復、一般論、過剰な再掲）を列挙しているが、**何を残すべきかの下限**を書いていない。`vp-ux-user-flow` は「迷わず到達できる」の判定方法を書いていない。

### 2.3. vp-ux-readability との責務境界を確認する必要がある

`vp-ux-readability` の `check` は「同じ主張の反復、判断に不要な一般論、表と本文の内容重複、正本からの過剰な再掲がなく、必要十分な記述になっているか」を含む。これは `vp-arc-conciseness` と**重複している**。`vp-arc-single-responsibility` は「同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない」と明示的に境界を書いているが、`vp-ux-readability` には対応する記述がない。

## 3. 完了条件

- `vp-arc-conciseness` の `check` に、何を残すべきかの下限と、fail としない条件が書かれている。
- `vp-ux-user-flow` の `check` に、到達可否の判定方法（目次、参照、説明順序のどれを見るか）が書かれている。
- 両観点が [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]] の基準で `referential` と判定できる。
- `vp-ux-readability` と `vp-arc-conciseness` の責務境界が `check` に明示されている。
- 書き換え後に grade を試行し、finding 数と内容が改善または維持されている。悪化した場合は書き換えを見直す。
- `evaluation` の値を `referential` へ変更するか、`discretionary` に留めるかを決めている。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ                             |
| --- | ------------------------------------------------ | ---- | ---- | -------------------------------- |
| 1   | `vp-ux-readability` との責務境界を決める         | UX   | open | 冗長性の判定をどちらが担うか     |
| 2   | `vp-arc-conciseness` の `check` へ規準を書き込む | ARC  | open | 先例の書き方に合わせる           |
| 3   | `vp-ux-user-flow` の `check` へ規準を書き込む    | UX   | open | 判定に使う要素を列挙する         |
| 4   | grade を試行し finding を比較する                | QE   | open | 書き換え前 46 件 / 22 件との比較 |
| 5   | `evaluation` の値を確定する                      | ARC  | open | 試行結果を見て決める             |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/ja/specdojo/guides/review-guide.md`
