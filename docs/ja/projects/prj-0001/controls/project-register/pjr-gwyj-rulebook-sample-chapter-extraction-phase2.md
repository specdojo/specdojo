---
specdojo:
  id: prj-0001:pjr-gwyj-rulebook-sample-chapter-extraction-phase2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T23:20:52Z"
---

# PJR-GWYJ 残りの rulebook のサンプル章を sample へ外出しする（AY1R 第 2 段）

## 1. 概要

PJR-AY1R の第 2 段である。第 1 段で、fully-guided の plan が sample を参照できるようにし（`recipe-guided` は対象外）、bps-rulebook と stsd-rulebook のサンプル章を外出しして試行した。本項目では、残りの rulebook のサンプル章を sample へ外出しする。

利用者の判断（2026-09-29）により、外部 sample を持たない rulebook は、サンプル章を外出ししたあと参照先を空のままにする。sample は後で作成する想定であり、本項目では作成しない。

## 2. 完了条件

- 残りの rulebook のうち、完成例を埋め込んでいる `サンプル` 章が外出しされている。最小例だけを残す判断をしたものは、その理由が対応結果で確認できる。
- 外出し後の rulebook で、本文に sample へのリンクや wikilink が発生していない。sample との対応は Frontmatter の `sample` で宣言されている。
- 外部 sample を持たない rulebook は、参照先を空のままにしている。
- 既存の sample ファイルは、外出しした内容を反映する場合を除き書き直さない。YAML / JSON の sample の先頭のスキーマ指定を消さない。
- 外出しした rulebook のうち数件を grade で評価し、`vp-qe-kata-conformance` と `vp-arc-conciseness` の finding が悪化していないことを確認している。
- runner の検証（`test-unit`・`test-integration`・`typecheck`・`validate-schema`）がすべて通過している。

## 3. 作業内容

| No  | 作業                                               | 担当 | 状態 | メモ                             |
| --- | -------------------------------------------------- | ---- | ---- | -------------------------------- |
| 1   | 残りの rulebook のサンプル章を外出しする           | ARC  | open | 完成例を埋め込んでいるものを優先 |
| 2   | 外部 sample を持たないものの参照先を空のままにする | ARC  | open | -                                |
| 3   | 数件を grade で評価して確認する                    | QE   | open | -                                |

## 4. 対応結果

-

## 5. 関連ドキュメント

- PJR-AY1R（第 1 段）
- `docs/ja/specdojo/exec-templates/xep-fully-guided-template.md`、`docs/ja/specdojo/standards/rulebook-authoring-standard.md`
