---
specdojo:
  id: prj-0001:pjr-vv3m-kata-creation-policy-by-type
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: high
  owner: BA
  registered_at: "2026-08-23T11:48:35Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-26T05:49:26Z"
  conclusion: 種別ごとに作成方針を変える方針を実装まで完了した。sample は rulebook がある系統へ一律に作り要否を判断しない。template は rulebook 系統単位で持ち骨組みが固定の系統に作る。recipe は品質差が出る系統のみ他の型と独立して判断する。rulebook は従来どおり判断して作る。sample を作らない条件は構造が schema で完全に決まる YAML 成果物に限定した。実装は PJR-JT1Y でガイドへ反映、PJR-1Z1H で宣言の欠落を解消、PJR-K9KG で実在成果物の要否を確定、PJR-5N64 で template の解決と代表系統の整備を行った。宣言先は PJR-3N21 の決定により rulebook frontmatter へ一本化されている。
  register_events:
    - v: 1
      id: reg_790af8e2c5589447c76e24a72099f903
      ts: "2026-08-23T11:50:59Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): 実践の型の作成方針に関する5件を起票する"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: 実践の型は種別ごとに作成方針を変える
        - field: description
          from: ""
          to: PJR-QESV は4種すべてを機械的に作らず要否を判断すると定めたが、種別ごとの性質の違いを扱っていない。PJR-K4TA の宣言結果を確認したところ、4種を同じ枠組みで判断させた結果、未作成の成果物171件が根拠のないまま `not-needed` となった。種別ごとに判断の前提条件が異なることを踏まえ、判断の枠組みを具体化する。
        - field: type
          from: ""
          to: decision
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: BA
        - field: registered
          from: ""
          to: "2026-08-23"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 3dbc7a661e9b50d6bdeb59073fbdc3fb62dcbc83
    - v: 1
      id: reg_78490b30b620898afbe8614160f3714c
      ts: "2026-08-26T05:49:48Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: decided
      reason: "docs(register): PJR-5N64 と PJR-VV3M をクローズする"
      changes:
        - field: status
          from: open
          to: decided
        - field: completed
          from: "-"
          to: "2026-08-26"
        - field: conclusion
          from: "-"
          to: 種別ごとに作成方針を変える方針を実装まで完了した。sample は rulebook がある系統へ一律に作り要否を判断しない。template は rulebook 系統単位で持ち骨組みが固定の系統に作る。recipe は品質差が出る系統のみ他の型と独立して判断する。rulebook は従来どおり判断して作る。sample を作らない条件は構造が schema で完全に決まる YAML 成果物に限定した。実装は PJR-JT1Y でガイドへ反映、PJR-1Z1H で宣言の欠落を解消、PJR-K9KG で実在成果物の要否を確定、PJR-5N64 で template の解決と代表系統の整備を行った。宣言先は PJR-3N21 の決定により rulebook frontmatter へ一本化されている。
      legacy_commit: f5fd1586b2cd13c7d9358005d6cb66be70216c3c
      previous_event_id: reg_790af8e2c5589447c76e24a72099f903
---

# PJR-VV3M 実践の型は種別ごとに作成方針を変える

## 1. 背景

PJR-QESV は4種すべてを機械的に作らず要否を判断すると定めたが、種別ごとの性質の違いを扱っていない。PJR-K4TA の宣言結果を確認したところ、4種を同じ枠組みで判断させた結果、未作成の成果物171件が根拠のないまま `not-needed` となった。種別ごとに判断の前提条件が異なることを踏まえ、判断の枠組みを具体化する。

## 2. 検討した選択肢

| 選択肢 | 内容                                                                   | 利点                                                        | 懸念                                                                     |
| ------ | ---------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| A      | 4種すべてを同一の基準で判断する（PJR-QESV のまま）                     | 基準が1つで単純                                             | 前提条件の異なる種別を同列に扱うため、判断できない型まで確定させてしまう |
| B      | 4種すべてを一律に作る                                                  | 判断が不要で agent が迷わない                               | 内容の薄い型が量産され、保守対象だけが増える                             |
| C      | 種別ごとに作成方針を変える（sample は一律、template と recipe は判断） | 前提条件のない sample から判断を外し、迷う対象を2種に絞れる | 基準が種別ごとに分かれ、説明がやや増える                                 |

## 3. 決定内容

選択肢 C を採択する。種別ごとの方針を次のとおり定める。

| 種別       | 方針                                              |
| ---------- | ------------------------------------------------- |
| `rulebook` | 従来どおり判断して作る                            |
| `sample`   | rulebook があれば一律に作る（要否を判断しない）   |
| `template` | rulebook 系統単位で持ち、骨組みが固定の系統に作る |
| `recipe`   | 品質差が出る系統のみ、他の型と独立して判断する    |

あわせて、PJR-QESV の基準にある sample を作らない条件「template の穴埋めから完成形を想像できる」は、構造が schema で完全に決まる YAML 成果物に限定する。

## 4. 採択理由

- sample には前提条件がない。recipe は繰り返される指摘という実績を、template は骨組みの固定を必要とするが、sample は rulebook さえあれば必ず1本書ける。判断を要求する意味が乏しい。
- sample の一律化は実態の追認である。sample の実ファイルは107本あり rulebook 106本とほぼ1対1で、散文成果物では73系統中68系統（93%）が既に sample を持つ。
- 判断対象を template と recipe の2種に絞ることで、agent が迷う範囲を狭められる。
- template は `deliverable scaffold` が読む唯一の型であり、機械が骨組みを生成する用途は他の型では代替できない。一方この機能差は sample と recipe には及ばないため、template の整備を他の型を作る理由にはしない。
- rulebook 106本のうち87本が「本文構成」の章に見出しの羅列を持ち、実質的な template を人間にしか読めない形で保持している。骨組みの正本を template へ移すことで二重保守を解消できる。
- 散文成果物では template は見出しの羅列にとどまり、粒度と文体を伝えられない。sample にしか担えない役割が残るため、template の存在を sample 不要の根拠にはできない。

## 5. 承認

| 項目     | 内容                                                      |
| -------- | --------------------------------------------------------- |
| 決定者   | PO                                                        |
| 決定日   | 2026-08-23                                                |
| 承認方式 | commit                                                    |
| 証跡     | 本個票を追加した commit（`docs(register): add PJR-VV3M`） |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | 実践の型の作成方針ガイド、成果物カタログの型宣言、`deliverable scaffold` の template 解決、rulebook の本文構成章                                                 |
| 必要な対応 | 判断基準への種別ごとの方針の反映、未着手成果物の宣言の見直し、template の宣言解決への変更と系統単位の整備、rulebook と成果物カタログにまたがる型宣言の突き合わせ |
| 追跡先     | PJR-JT1Y（未判断状態の区別）、PJR-K9KG（実在成果物の要否確定）、PJR-5N64（template の宣言解決と整備）、PJR-1Z1H（型宣言の突き合わせ）                            |

## 7. 関連ドキュメント

- 要否判断基準の正本: [[specdojo:kata-guide|実践の型ガイド]]
- 前提となる決定: [[prj-0001:pjr-qesv-kata-creation-criteria|PJR-QESV 実践の型の要否判断基準]]
- 本決定の契機となった実装: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
