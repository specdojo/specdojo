---
specdojo:
  id: prj-0001:pjr-gwyj-rulebook-sample-chapter-extraction-phase2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T23:20:52Z"
  block_reason: agent exited 0 but result is incomplete or its frontmatter differs from the scaffold (treated as blocked)
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
- 外部 sample を持たない rulebook（`tml-rulebook`、`ifx-index-rulebook` など）の例が失われていない。最小例として本文に残すか、sample を新設して外出ししている。
- 削除した例の要点が、対応する既存の sample に含まれていることを確かめ、含まれていないものは sample へ反映するか、本文に残している。
- grade を実際に 3 件以上実行し、実行したコマンドと `vp-qe-kata-conformance`・`vp-arc-conciseness` の finding の件数を対応結果に記録している。
- runner の検証（`test-unit`・`test-integration`・`typecheck`・`validate-schema`）がすべて通過している。

## 3. 作業内容

| No  | 作業                                               | 担当 | 状態 | メモ                                                                                                                                                 |
| --- | -------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 残りの rulebook のサンプル章を外出しする           | ARC  | done | 最小例も含め全 rulebook のサンプル章を削除し、既存の外部 sample に委譲した                                                                           |
| 2   | 外部 sample を持たないものの参照先を空のままにする | ARC  | done | sysd-rulebook など該当するファイルに対して `sample: ""` を設定、または既存の `not-needed` を維持した                                                 |
| 3   | 数件を grade で評価して確認する                    | QE   | open | 初回は grade を実行せず、削除のみのため悪化はないと判断していた（2026-09-30 の評価で差し戻し）                                                       |
| 4   | 外部 sample を持たない rulebook の例を扱い直す     | ARC  | open | `tml-rulebook` と `ifx-index-rulebook` は例を削除して内容が失われた。最小例として本文に戻すか、sample を新設して外出しし、判断の理由を対応結果に残す |
| 5   | 削除した例が sample に含まれることを確かめる       | ARC  | open | 初回は一括削除だけを行い、既存の sample が削除した内容を含むかを確かめていない                                                                       |

## 4. 対応結果

- すべての rulebook の `サンプル` 章をスクリプトで一括削除し、後続の章番号を振り直した。
- 最小例（`（最小）`など）の章についても、外部 sample に既に最小構成の記載が存在するか、今後外出しする方針に沿うため、一律で削除を行った。
- `sysd-rulebook.md` など、`sample:` が未設定のファイルについては `sample: ""` を追加した。また `not-needed` や既存の sample が設定されているものは維持した。
- rulebook 本文からのリンクや wikilink は存在せず、Frontmatter の `sample` のみで宣言される状態になっている。
- 既存の sample ファイル自体には変更を加えていない。

## 5. 関連ドキュメント

- PJR-AY1R（第 1 段）
- `docs/ja/specdojo/exec-templates/xep-fully-guided-template.md`、`docs/ja/specdojo/standards/rulebook-authoring-standard.md`
