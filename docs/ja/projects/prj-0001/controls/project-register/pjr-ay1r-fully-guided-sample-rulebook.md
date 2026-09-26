---
specdojo:
  id: prj-0001:pjr-ay1r-fully-guided-sample-rulebook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-26T02:50:40Z"
---

# PJR-AY1R fully-guided が sample を参照できるようにし rulebook のサンプル章を外出しする

## 1. 概要

完成例の正本を sample に一本化する方針を `rulebook-authoring-standard.md` へ明記した。実現には `xep-fully-guided-template.md` の参照範囲を変える必要がある。現在 fully-guided は sample を読み込まないため、rulebook から `サンプル` 章を外すと例が参照できなくなる。参照範囲を変えたうえで、既存 rulebook の `サンプル` 章を一括で外出しする。

## 2. 事実

### 2.1. fully-guided は sample を読み込まない

`xep-fully-guided-template.md` の記述である。

```text
磨き込みでは sample / template は読み込まない。
粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。
```

参照が許されるのは rulebook、併せて適用する rulebook、recipe、`depends_on` 成果物、プロジェクトコンテキストに限られる。

### 2.2. サンプル章はその制約への対処である

`rulebook-authoring-standard.md` の補足が理由を明示している。

```text
fully-guided 実行では rulebook と recipe だけが読み込まれるため、
sample / template への本文中のリンクは実行不能な指示になる
```

`サンプル` 章は古い記述の名残ではなく、**参照範囲の制約に対する回避策**である。

### 2.3. approach によって sample の可視性が異なる

| approach             | sample の可視性  |
| -------------------- | ---------------- |
| `fully-guided`       | **読み込まない** |
| `recipe-guided`      | 読み込まない     |
| `bootstrap`          | 読み込む         |
| `sample-maintenance` | 読み込む         |

`xep-bootstrap-template.md` は rulebook / recipe / sample / template を同一タスクで編集するため sample を扱う。

### 2.4. 対象は 54 件ある

| 項目                                 | 件数 |
| ------------------------------------ | ---- |
| rulebook の総数                      | 107  |
| `サンプル` 章を持つもの              | 54   |
| うち外部 sample も持つもの           | 52   |
| 埋め込みコードブロックの行数の中央値 | 9    |

大半は 9 行程度の断片であり、完成例を丸ごと埋め込んでいるものは少数である。`bps-rulebook` は 70 行で全体の 2 位だった。

## 3. 完了条件

- fully-guided 実行で sample を参照できる。参照範囲の変更が `xep-fully-guided-template.md` に反映されている。
- sample を参照させることで plan が肥大化しないことを確認している。肥大化する場合は参照方法を見直す。
- `recipe-guided` の扱いが決まっている。同じ変更を適用するか、対象外とするかを明示する。
- 既存 54 件の `サンプル` 章のうち、完成例を埋め込んでいるものが sample へ外出しされている。
- 最小例だけを残す判断をしたものは、その理由が確認できる。
- 外出し後の rulebook で、本文に sample へのリンクや wikilink が発生していない。対応は Frontmatter の `sample` 宣言だけで示す。
- 外部 sample を持たない 2 件について、sample を作るか `サンプル` 章を残すかが決まっている。
- grade を再実行し、`vp-qe-kata-conformance` と `vp-arc-conciseness` の finding が悪化していない。
- `npm run check` が通過している。

## 4. 検討事項

### 4.1. 参照範囲を広げる影響

fully-guided は「plan に列挙されていない他のプロジェクト文書を独自に探索・参照しない」と定め、根拠の範囲を絞ることで成果物の逸脱を防いでいる。sample を加えると根拠が 1 つ増える。**sample の内容が対象成果物へ混入する恐れ**がないかを確認する。

`xep-fully-guided-template.md` は現在「粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる」と定める。sample を読み込む場合、既存成果物と sample のどちらを優先するかを明示する必要がある。

### 4.2. 段階的な移行

54 件を一度に変更せず、参照範囲の変更を先に行い、動作を確認してから外出しへ進む。standard には「参照範囲の変更後に一括で外出しする。個別の改訂で先行して削除しない」と明記済みである。

## 5. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ                             |
| --- | ------------------------------------------------ | ---- | ---- | -------------------------------- |
| 1   | 参照範囲を広げる影響を評価する                   | ARC  | open | 逸脱防止との両立                 |
| 2   | `xep-fully-guided-template.md` を変更する        | ARC  | open | sample の優先順位を明示          |
| 3   | `recipe-guided` の扱いを決める                   | ARC  | open | 同じ変更を適用するか             |
| 4   | 少数の rulebook で試行し plan の肥大化を確認する | QE   | open | 3 件程度                         |
| 5   | 54 件の `サンプル` 章を外出しする                | ARC  | open | 完成例を埋め込んでいるものを優先 |
| 6   | 外部 sample を持たない 2 件の扱いを決める        | ARC  | open |                                  |
| 7   | grade を再実行し finding の悪化がないか確認する  | QE   | open |                                  |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]]
- [[prj-0001:pjr-8ten-bps-sample-bps-template-bps-recipe]]
- `docs/ja/specdojo/standards/rulebook-authoring-standard.md`
- `docs/ja/specdojo/exec-templates/xep-fully-guided-template.md`
- `docs/ja/specdojo/exec-templates/xep-bootstrap-template.md`
