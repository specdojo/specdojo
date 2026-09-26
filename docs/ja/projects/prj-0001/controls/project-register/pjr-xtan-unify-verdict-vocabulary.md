---
specdojo:
  id: prj-0001:pjr-xtan-unify-verdict-vocabulary
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-24T14:01:35Z"
  due_on: "2026-10-31"
---

# PJR-XTAN 判定語彙を判定対象ごとに整理し 同じ対象の語彙だけを統一する

## 1. 概要

判定に使う語彙が 4 種類ある。当初は [[prj-0001:pjr-2zvs-grade-review-integration]] の決定 3.3 に従い、すべてを `verdict_definitions` へ統一する予定だった。しかし同項目の最終結論で、**grade と review は違う対象を判定する**ことが分かった。違う対象を同じ語彙にすると、かえって混同を招く。4 語彙を判定の対象で分け、**同じ対象を判定している語彙だけを統一する**。

## 2. 事実

### 2.1. 4 語彙の判定対象

| 使用箇所                                             | 語彙                                                          | 判定対象                       |
| ---------------------------------------------------- | ------------------------------------------------------------- | ------------------------------ |
| `pm-review-viewpoints.yaml` の `verdict_definitions` | `pass` / `conditional_pass` / `changes_requested` / `blocked` | **タスクの完了可否**（review） |
| `xrr-template.md` の `decision.recommendation`       | `approve` / `revise` / `reject`                               | **タスクの完了可否**（review） |
| grade の文書 verdict                                 | `pass` / `needs-work` / `fail`                                | **成果物の品質**（grade）      |
| `xrr-viewpoint-detail-template.md` の `result`       | `pass` / `fail` / `unclear`                                   | review 内での観点ごとの評価    |

**同じ対象（タスクの完了可否）を 2 つの語彙で表しているのは上の 2 行だけである。** `revise` が `conditional_pass` と `changes_requested` のどちらに当たるか、定めがない。

### 2.2. 観点ごとの評価は役割を失う

[[prj-0001:pjr-n22n-xrp-xrr-review]] で review は観点ごとに評価しなくなる。`xrr-viewpoint-detail-template.md` の `result` は、テンプレート自体を残すかどうかと合わせて決まる。**本項目で語彙を揃えても、N22N で削除されれば無駄になる。**

### 2.3. grade と review の対応はすでに写像がある

`review-guide.md` は grade の level から review の verdict への対応を定めている。

```text
level 4 → pass、level 3 → conditional_pass、level 0-2 → changes_requested
```

違う対象を同じ語彙にするのではなく、**この写像を「grade の結果を review の入力にする規則」として保つ**のが、判定対象を分けた結論に沿う。

## 3. 判断が必要な点

| 案  | 内容                                                             | 評価                                           |
| --- | ---------------------------------------------------------------- | ---------------------------------------------- |
| A   | 当初の案。4 語彙すべてを `verdict_definitions` へ統一する        | 違う対象を同じ語彙にする。移行は 260 件        |
| B   | review 側の 2 語彙だけを統一する。grade の語彙は残し、写像を保つ | 判定対象の区別と合う。grade の結果は移行しない |
| C   | 何もしない                                                       | `revise` の曖昧さが残る                        |

**B を推す。** 同じ対象の二重表現だけが本当の問題であり、B はそれだけを解消する。grade の結果 260 件の移行も要らなくなる。

## 4. 完了条件

- 案 A・B・C のどれを採るか決まり、理由が記録されている。
- B の場合、`decision.recommendation` が `verdict_definitions` の値を使っている。`revise` の対応先が決まっている。
- B の場合、grade の語彙と level からの写像が維持され、写像が「review の入力規則」であることがガイドから読み取れる。
- `xrr-viewpoint-detail-template.md` の扱いを [[prj-0001:pjr-n22n-xrp-xrr-review]] と揃えている。
- 旧値を読み込んだ場合、新しい値を示すエラーで失敗する。
- `npm run check` が通過している。

## 5. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ                       |
| --- | ----------------------------------------------------- | ---- | ---- | -------------------------- |
| 1   | 案 A・B・C から方針を決める                           | ARC  | open | **着手前の判断**。B を起点 |
| 2   | `decision.recommendation` を `verdict_definitions` へ | DEV  | open | B の場合                   |
| 3   | 写像を review の入力規則としてガイドへ記載する        | DEV  | open | `review-guide.md`          |
| 4   | `xrr-viewpoint-detail` の扱いを N22N と揃える         | QE   | open |                            |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-n22n-xrp-xrr-review]]
- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/ja/specdojo/exec-templates/xrr-template.md`
- `docs/ja/specdojo/guides/review-guide.md`
