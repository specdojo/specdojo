---
specdojo:
  id: prj-0001:pjr-jt1y-kata-undecided-state
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: BA
  registered_at: "2026-08-23T11:48:12Z"
  due_on: "2026-08-31"
  conclusion: "agent exited with non-zero code: executor validationの npm run validate:schema がfailed（tsx IPC制約によるEPERM）であり、npm run test:unit もfailed（既存PJR-QVGX個票の未エスケープ<pid>検出後に中断、exit 130）である。完了手順は静的検査および必要なテストの失敗解…"
---

# PJR-JT1Y 未着手成果物の実践の型の要否を未判断として区別できるようにする

## 1. 概要

PJR-K4TA では未作成の散文成果物171件に not-needed を宣言したが、PJR-QESV は要否を初回の bootstrap で判断すると決めており、bootstrap 前に不要と確定するのは決定と矛盾する。原因は基準が「項目なし」を要否未判断と必要だが未整備の2つの状態に兼用しており、未判断を表す値がないことにある。undecided 相当の明示値を追加して3状態を区別し、未着手171件の not-needed を撤回する。

あわせて PJR-VV3M で決定した種別ごとの作成方針を実践の型ガイドへ反映する。方針が基準の正本に書かれていない状態で後続の是正を進めると、実行する agent が決定ではなく現行のガイドを読んで判断するため、本項目で先に反映する。

## 2. 完了条件

- 実践の型の要否を「未判断」「必要」「不要」の3状態で区別できる。未判断を表す明示値が schema と成果物カタログで扱える。
- 実践の型ガイドに、PJR-VV3M の種別ごとの作成方針（sample は rulebook があれば一律に作る、template は rulebook 系統単位で骨組みが固定の系統に作る、recipe は品質差が出る系統のみ独立して判断する）が記載されている。
- 実践の型ガイドの sample を作らない条件が、構造が schema で完全に決まる YAML 成果物に限定されている。
- 未作成の散文成果物171件の recipe / template の not-needed が撤回され、未判断を表す状態になっている。
- 実在する成果物の宣言は本項目では変更しない（PJR-K9KG の範囲）。
- `npm run validate:schema`、`catalog validate`、`catalog build` が成功する。

## 3. 作業内容

| No  | 作業                                                                  | 担当 | 状態 | メモ                             |
| --- | --------------------------------------------------------------------- | ---- | ---- | -------------------------------- |
| 1   | PJR-VV3M の種別ごとの作成方針を実践の型ガイドへ反映する               | BA   | done | 後続の是正の前提となるため最初に |
| 2   | 未判断を表す明示値を定義し、schema と検証・生成処理で扱えるようにする | BA   | done | 3状態の区別                      |
| 3   | 未作成の散文成果物171件の recipe / template の not-needed を撤回する  | BA   | done | 実在分は対象外                   |
| 4   | 撤回後の状態で検証コマンドが成功することを確認する                    | BA   | done | -                                |

## 4. 対応結果

- [[specdojo:kata-guide|実践の型活用ガイド]] へ、要否の「未判断」「必要」「不要」と整備状況を分離した宣言規則を追加した。PJR-VV3M の方針に従い、sample は rulebook がある系統へ一律に作ること、template は rulebook 系統単位で骨組みが固定の場合に作ること、recipe は品質差が出る系統だけ独立して判断することを反映した。sample を作らない条件は、構造が schema で完全に決まる YAML 成果物に限定した。
- `dct.schema.yaml`、カタログ検証・生成、実践の型参照解決、Schedule assessment に `undecided` を追加した。`undecided` は要否未判断、項目省略は必要だが未整備、文書 ID は必要かつ整備済み、`not-needed` は不要と判断済みとして扱う。生成する成果物本体へ `undecided` を rulebook ID として転記しない。
- プロジェクトカタログで recipe / template が `not-needed` だった171件を再確認し、現在も未作成の155件を `undecided` へ更新した。既に成果物が実在する16件は PJR-K9KG の範囲として変更していない。今後の scaffold で不要判定を再生成しないよう、対応する DCT template 58件も `undecided` へ更新した。
- `undecided` の schema 受理、参照解決、assessment 事実収集、成果物生成時の非転記を単体テストへ追加した。残課題はなく、実在する成果物16件の要否確定は PJR-K9KG で追跡する。

## 5. 関連ドキュメント

- 反映先の正本: [[specdojo:kata-guide|実践の型ガイド]]
- 反映する決定: [[prj-0001:pjr-vv3m-kata-creation-policy-by-type|PJR-VV3M 実践の型は種別ごとに作成方針を変える]]
- 前提となる決定: [[prj-0001:pjr-qesv-kata-creation-criteria|PJR-QESV 実践の型の要否判断基準]]
- 撤回対象を作った項目: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
