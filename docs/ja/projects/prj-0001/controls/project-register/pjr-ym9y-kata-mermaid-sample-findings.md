---
specdojo:
  id: prj-0001:pjr-ym9y-kata-mermaid-sample-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-21T05:47:33Z"
  due_on: "2026-10-10"
---

# PJR-YM9Y mermaid rulebook 2 本と cdfd / stsd sample の grade 指摘を解消する

## 1. 概要

PJR-EQDB の再周回後の評価（`MANUAL-eqdb6-20260921b`、codex 単段）で `cdfd-rulebook` 89 と `stsd-rulebook` 86 は pass になったが、改訂で派生した指摘が 4 件に残った。finding は `docs/ja/projects/prj-0001/execution/grade/results/specdojo.<id>.yaml` にある。

| Kata                    | score | findings      | 指摘の中心                                                                                                                                                                                                                                    |
| ----------------------- | ----- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stsd-mermaid-rulebook` | 82    | 5（major 2）  | 複合状態を許可しながら、親状態・下位状態と状態一覧の対応、内部の開始・終了、境界をまたぐ遷移の規則がない。分割図の共有状態に「別名を付けない」とする一方、3 章は別名と複数図での `state_id` 維持を認めており矛盾                              |
| `cdfd-mermaid-rulebook` | 81    | 3（major 3）  | `cdfd-overview-rulebook` は CDFD が 1 つだけなら「凡例（本プロダクト共通）」を省略可とするが、本書は図直後の凡例参照を必須としており、包含元と共有 rulebook の適用条件が一致しない                                                            |
| `stsd-sample`           | 73    | 4（major 4）  | 分岐の合格経路が「売場補充完了」、不合格経路が「検品完了」と異なるイベントで、改訂した rulebook の「共通イベント + 相互排他条件」の適用例になっていない。検品結果の記録後、在庫更新・売場配置または返品保管箱への分離までを受け持つ状態がない |
| `cdfd-sample`           | 73    | 13（major 3） | 在庫記録の更新主体が `cdfd-overview-sample` / `cdfd-uc-sample`（仕入グループが直接更新）と本書（在庫グループへ委譲）で矛盾。`P-02-05` の起動条件が表・図・例外表で不一致。「補充基準」「受入判定 / 検品結果」の用語不統一                     |

### 1.1. 決定事項（ARC）

- 複合状態（親状態と下位状態）は STSD では**使わない**。状態一覧に載る状態だけを図に置き、階層が必要なら対象を分けて別の STSD にする。`stsd-mermaid-rulebook` から複合状態の許可を外し、禁止事項に加える。
- 分割図の共有状態は同じ表示名と同じ `state_id` を維持する。「別名」は表示名の変更を指す用語として定義し、分割図では使わない。3 章の記述をこれに合わせる。
- 凡例は `cdfd-overview-rulebook` の規則を正とする。CDFD が 1 つだけで共通凡例を置かない場合、`cdfd-mermaid-rulebook` は図直後の参照を「共通凡例があるときは参照、ないときは本 rulebook の既定凡例に従う旨を注記」とする。包含元 3 種（overview / group / uc）と共有 rulebook の適用条件を同じ判定規則にする。
- `stsd-sample` の分岐は共通イベント「検品完了」に相互排他条件（合格 / 不合格）を付けた 2 本の矢印にする。検品完了から在庫更新・売場配置または返品分離までは「検品済み」の中間状態を設けて未分類期間をなくす。
- `cdfd-sample` は上位の `cdfd-overview-sample` に合わせ、仕入グループが在庫記録を直接更新する構成にする。`P-02-05` の起動条件は「仕入記録確定後に検品で数量違いまたは品質不良が判明した」に統一し、「受入判定」は「検品結果」に統一、「補充基準」は商品台帳の利用内容から外す。

## 2. 完了条件

- 4 件の Kata が上記の決定事項どおりに改訂され、`stsd-mermaid-rulebook` / `cdfd-mermaid-rulebook` / `stsd-rulebook` / `cdfd-overview-rulebook` の間に凡例・複合状態・別名の矛盾がない。
- `stsd-sample` と `cdfd-sample` が改訂後の rulebook の適用例として成立し、`cdfd-overview-sample` / `cdfd-uc-sample` と在庫記録の更新主体が一致している。
- 再評価（codex 単段）で 4 件の verdict が pass になっている。
- `npm run lint:md` と `npm run validate:schema` が通過している。

## 3. 作業内容

| No  | 作業                                                                                                                                        | 担当 | 状態 | メモ                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------- |
| 1   | `stsd-mermaid-rulebook` と `stsd-rulebook` を複合状態禁止・別名の定義に合わせて改訂し、`stsd-sample` を共通イベント分岐と中間状態の例に直す | ARC  | open | codex-expert-executor / gemma-reporter / worktree |
| 2   | `cdfd-mermaid-rulebook` の凡例参照を `cdfd-overview-rulebook` の省略条件に揃え、`cdfd-sample` の在庫記録更新主体・起動条件・用語を統一する  | ARC  | open | 作業 1 と同一タスク                               |
| 3   | 再評価で 4 件の解消を確認する                                                                                                               | ARC  | open | 夜間 routine または手動 `--stages 1 --path`       |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:stsd-mermaid-rulebook]]
- [[specdojo:cdfd-mermaid-rulebook]]
- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:stsd-sample]]
- [[specdojo:cdfd-sample]]
- [[specdojo:cdfd-overview-sample]]
- [[specdojo:cdfd-uc-sample]]
- [[prj-0001:pjr-eqdb-kata-cdfd-stsd-rulebook-findings]]
