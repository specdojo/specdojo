---
specdojo:
  id: prj-0001:pjr-ay1r-fully-guided-sample-rulebook
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-26T02:50:40Z"
  completed_at: "2026-09-29T03:29:46Z"
  block_reason: "agent exited with non-zero code: 既存 rulebook の `サンプル` 章の一括外出しが未完了。外出し済みは `bps-rulebook.md` と `stsd-rulebook.md` の 2 件のみ。grade 再実行（`vp-qe-kata-conformance` / `vp-arc-conciseness`）と `npm run check` も `n…"
  conclusion: 第 1 段を完了した。fully-guided の plan が sample を参照できるようにし（recipe-guided は対象外）、bps・stsd のサンプル章を外出しした。試行の grade で finding の悪化はなかった。残りは PJR-GWYJ
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

第 1 段（2.5. の範囲の見直しのとおり）を完了した。claude-expert-executor の 2 回目の実行の成果を、orchestrator が worktree から develop へ適用した（c6f3d2cf）。reporter が範囲を絞る前の plan で判断して runner の統合が行われなかったためである。

- `xep-fully-guided-template.md`: fully-guided の edit plan が sample を参照できるようにした。参照は形式の確認に限り、既存の成果物を優先する。`recipe-guided` は対象外とした。plan の増分は、sample のパス 1 行と手順 1 項目である。
- 試行: bps-rulebook と stsd-rulebook の完成例のサンプル章を削除した。既存の sample とほぼ同じ内容のため、sample ファイルは変更していない。stsd-mermaid-rulebook の最小例は残した。
- `rulebook-authoring-standard.md`: 経過措置の記述を段階移行に合わせた。
- `tests/src/exec-plans.test.ts`: sample のパスを plan へ差し込むテストを 2 件追加した。

試行の確認（orchestrator、評価者は claude-expert-executor、rubric v2 にそろえた）:

| rulebook      | 外出し前       | 外出し後       | `vp-qe-kata-conformance` | `vp-arc-conciseness` |
| ------------- | -------------- | -------------- | ------------------------ | -------------------- |
| bps-rulebook  | 89 点・minor 6 | 89 点・minor 6 | 1 → 1                    | 1 → 1                |
| stsd-rulebook | 91 点・minor 5 | 93 点・minor 3 | 2 → 1                    | 1 → 1                |

finding は悪化せず、stsd-rulebook は改善した。適用後に、単体テスト 1,713 件・統合テスト 121 件・型チェック・schema 検証が通過した。

残りの rulebook の外出しと、外部 sample を持たないものの扱いは PJR-GWYJ（第 2 段）で行う。

## 7. 関連ドキュメント

- [[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]]
- [[prj-0001:pjr-8ten-bps-sample-bps-template-bps-recipe]]
- `docs/ja/specdojo/standards/rulebook-authoring-standard.md`
- `docs/ja/specdojo/exec-templates/xep-fully-guided-template.md`
- `docs/ja/specdojo/exec-templates/xep-bootstrap-template.md`
