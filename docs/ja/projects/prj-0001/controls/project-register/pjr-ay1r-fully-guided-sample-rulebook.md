---
specdojo:
  id: prj-0001:pjr-ay1r-fully-guided-sample-rulebook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: ARC
  registered_at: "2026-09-26T02:50:40Z"
  block_reason: "agent exited with non-zero code: executor 自身が完了条件は未達と報告している。残りの rulebook のサンプル章の外出し、grade の再実行、`npm run check` が未実施で、plan の完了条件を根拠をもって満たしたと言えない。runner 検証はすべて passed だが、成果物の作業は未完了である。"
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
- 既存の sample ファイルは、rulebook のサンプル章から外出しした内容を反映する場合を除き、書き直さない。YAML / JSON の sample（例: `ifx-cmd-sample.yaml`）の先頭のスキーマ指定（`# yaml-language-server: $schema=...` または `# specdojo-schema: ...`）を消さない（2026-09-29 の 1 回目の実行で `ifx-cmd-sample.yaml` のスキーマ指定が消え、`validate-schema` が失敗した）。
- 段階的に移行する（検討事項「段階的な移行」のとおり）。最初に rulebook 3 件程度で外出しを行い、plan の肥大化と grade の finding を確認してから、残りへ広げる。確認結果を対応結果に記録する。
- runner の検証（`test-unit`・`test-integration`・`typecheck`・`validate-schema`）がすべて通過している（1 回目の実行では `test-integration` と `validate-schema` が失敗した）。

## 4. 検討事項

### 4.1. 参照範囲を広げる影響

fully-guided は「plan に列挙されていない他のプロジェクト文書を独自に探索・参照しない」と定め、根拠の範囲を絞ることで成果物の逸脱を防いでいる。sample を加えると根拠が 1 つ増える。**sample の内容が対象成果物へ混入する恐れ**がないかを確認する。

`xep-fully-guided-template.md` は現在「粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる」と定める。sample を読み込む場合、既存成果物と sample のどちらを優先するかを明示する必要がある。

### 4.2. 段階的な移行

54 件を一度に変更せず、参照範囲の変更を先に行い、動作を確認してから外出しへ進む。standard には「参照範囲の変更後に一括で外出しする。個別の改訂で先行して削除しない」と明記済みである。

### 4.3. 判断の結果（2026-09-29）

利用者が次のとおり判断した。

- `recipe-guided` の扱い（作業 No.3）: 同じ変更を適用しない。本項目の変更は `fully-guided` だけを対象とする。
- 外部 sample を持たない 2 件の扱い（作業 No.6）: サンプル章を外出しした後の参照先は空のままにする。sample は後で作成する想定であり、本項目では作成しない。

## 5. 作業内容

| No  | 作業                                             | 担当 | 状態        | メモ                                                                          |
| --- | ------------------------------------------------ | ---- | ----------- | ----------------------------------------------------------------------------- |
| 1   | 参照範囲を広げる影響を評価する                   | ARC  | done        | sample は形式の参照に限定し、業務内容の転記と具体化の裏付けへの流用を禁止した |
| 2   | `xep-fully-guided-template.md` を変更する        | ARC  | done        | 既存の対象成果物を sample より優先すると明示した                              |
| 3   | `recipe-guided` の扱いを決める                   | ARC  | done        | 利用者判断により対象外とした                                                  |
| 4   | 少数の rulebook で試行し plan の肥大化を確認する | QE   | in-progress | 3 件で試行した。plan の増分はパス 1 行と手順 1 項目                           |
| 5   | 54 件の `サンプル` 章を外出しする                | ARC  | in-progress | 試行分の 2 件を外出しした。残りは試行の確認後に広げる                         |
| 6   | 外部 sample を持たない 2 件の扱いを決める        | ARC  | done        | 利用者判断により参照先を空のままにする                                        |
| 7   | grade を再実行し finding の悪化がないか確認する  | QE   | open        | executor の sandbox では grade を実行できないため未実施                       |

## 6. 対応結果

### 6.1. fully-guided の参照範囲の変更（2026-09-29）

- `xep-fully-guided-template.md` の参照ファイルに `sample: _SAMPLE_REF_` を追加した。参照先は rulebook frontmatter の `sample` から解決される既存の `_SAMPLE_REF_` を使い、plan 生成コードは変更していない。
- 進め方に sample の手順を追加した。sample は完成例の形式（章・表・記述の粒度）の確認に限って使い、業務内容・固有名詞・値を対象成果物へ転記しない。
- 「磨き込みでは sample / template は読み込まない」を「template は読み込まない」に改めた。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。
- 参照してよい文書の列挙に sample を加えた。根拠のない具体化の禁止に、sample を対象成果物の具体的な記述の裏付けにしないことを追記した。
- `rulebook-authoring-standard.md` の経過措置の記述を、参照範囲の変更後の状態へ合わせた。段階的に外出しする方針も同書へ反映した。
- `tests/src/exec-plans.test.ts` に、fully-guided plan へ sample のパスが注入されること、rulebook 未宣言時は `_MISSING_` になることのテストを追加した。

### 6.2. plan の肥大化の確認

sample はパスだけを plan に注入し、本文は agent が読み込む。plan の増分は参照ファイルの 1 行と進め方の 1 項目であり、sample の行数に比例して plan が大きくなることはない。

### 6.3. 試行（3 件）

| rulebook                | 判断         | 理由                                                                                               |
| ----------------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| `bps-rulebook`          | 外出し       | 70 行の完成例を埋め込んでいた。`bps-sample` が同じ章構成の完成例を持つため、章を削除した           |
| `stsd-rulebook`         | 外出し       | 完成例を埋め込んでいた。`stsd-sample` が同じ対象（商品のステータス定義）の完成例を持つため削除した |
| `stsd-mermaid-rulebook` | 最小例を残す | 5 遷移の図だけの最小例であり、形式の輪郭を示す経過措置の範囲に収まるため                           |

- 既存の sample ファイルは変更していない。
- 外出し後の rulebook の本文に sample へのリンクや wikilink は追加していない。対応は Frontmatter の `sample` 宣言だけで示している。

### 6.4. 未完了の事項

- grade の再実行（`vp-qe-kata-conformance`・`vp-arc-conciseness`）は未実施である。試行の 2 件で finding が悪化しないことを確認してから、残りの `サンプル` 章の外出しへ広げる。
- 外部 sample を持たない 2 件（`ifx-index-rulebook`・`tml-rulebook`。いずれも `sample: not-needed`）は、利用者判断のとおり参照先を空のままにする。外出しは残りの移行と併せて行う。

## 7. 関連ドキュメント

- [[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]]
- [[prj-0001:pjr-8ten-bps-sample-bps-template-bps-recipe]]
- `docs/ja/specdojo/standards/rulebook-authoring-standard.md`
- `docs/ja/specdojo/exec-templates/xep-fully-guided-template.md`
- `docs/ja/specdojo/exec-templates/xep-bootstrap-template.md`
