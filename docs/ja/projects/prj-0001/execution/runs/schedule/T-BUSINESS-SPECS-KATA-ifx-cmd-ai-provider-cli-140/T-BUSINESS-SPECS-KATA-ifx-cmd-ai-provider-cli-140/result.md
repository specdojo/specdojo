---
specdojo:
  id: prj-0001:xer-t-business-specs-kata-ifx-cmd-ai-provider-cli-140
  type: exec-result
  task_id: T-BUSINESS-SPECS-KATA-ifx-cmd-ai-provider-cli-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  started_at: "2026-11-10T13:02:59.982Z"
  agent: indie
  execution: human
  approach: bootstrap-finalize
  targets:
    - ifx-cmd-ai-provider-cli
    - specdojo:ifx-cmd-rulebook
    - specdojo:ifx-cmd-recipe
    - specdojo:ifx-cmd-sample
    - specdojo:ifx-cmd-template
---

# Finalize Result

## 1. 実施基準

- 実施手順: [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]
- 共通規約: [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]

この result を作業指示と確認記録の正本とし、frontmatter の `targets` に含まれる成果物と実践の型だけを確認・修正・確定する。

## 2. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [ ] AI provider CLI の実行契約・入出力の約束・エラー処理が業務観点で整理されていること（BA / vp-ba-requirements-completeness）
- [ ] AI provider CLI との連携スコープと方式を承認できること（PO / vp-po-purpose-alignment）
- [ ] 外部コマンド連携仕様（正本参照・入出力の約束・認証注入）の設計として妥当であること（ARC / vp-arc-technical-constraints）
- [ ] 外部 CLI 起動テスト・結合テスト設計に活用できること（QE / vp-qe-verifiability）
- [ ] プロセス起動・連携エラー処理実装の基礎として参照できること（DEV / vp-dev-implementation-readiness）

- [ ] 確定対象の成果物と実践の型の本文に未反映の `_CONTEXT_:` が残っていない（残っていれば承認せず、draft へ差し戻す）

## 3. 実践の型の確認

実践の型を種別ごとに確認し、満たしていればチェックを付ける。「確定対象」に無い種別はスキップし、行を削除する。

- [ ] rulebook: 章構成・必須項目・禁止事項・判定基準が完成版の成果物と整合している
- [ ] recipe: 問い・観点・深掘り手順が完成版の作成過程に照らして有効である
- [ ] sample: 粒度・文体・表の書き方が完成例として適切である
- [ ] template: 章構成の骨組みとプレースホルダが雛形として再利用できる
- [ ] 共通: プロジェクト固有の内容が一般化されており、他プロジェクトでも再利用できる

## 4. 確定対象

最終確認と frontmatter の `status` の `ready` への昇格が済んだ対象にチェックを付ける。既に `ready` の実践の型は、劣化がないことを確認してチェックを付ける。

- [ ] 成果物: `docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml`
- [ ] rulebook: `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md`
- [ ] recipe: `docs/ja/specdojo/recipes/ifx-cmd-recipe.md`
- [ ] sample: `docs/ja/specdojo/samples/ifx-cmd-sample.yaml`
- [ ] template: `docs/ja/specdojo/templates/ifx-cmd-template.yaml`

## 5. 確定判断

- judgement: _TODO_（承認 / 差し戻し）

## 6. 備考

_TODO_: 差し戻し理由、確定対象以外に修正した内容、後続タスクへの申し送りなど、必要な場合のみ記入する（なければ削除）。

## 確定の記録（orchestrator が indie の決定を代行、2026-11-10）

- 型一式（`ifx-cmd-rulebook.md`、`ifx-cmd-recipe.md`、`ifx-cmd-sample.yaml`、`ifx-cmd-template.yaml`）の `status` を `ready` に上げた。
- 判断の根拠: 手入れの後の grade（run id `kata-bsk-20261110`、sol-review-executor）で、Markdown の rulebook と sample はすべて pass で、指摘は minor だけだった。minor の指摘は PJR-8E7Z・PJR-1VF0・PJR-8BSV で後で直す（indie が決定）。YAML の sample は grade の対象にならないため（PJR-V05D）、人が確かめる扱いとした。
- 代表の成果物は `draft` のままとする。型の確定の後に business-specs-reps の track で磨き込みから流し直すため（indie が決定、案 A）。
- 追記: `ifx-cmd-rulebook.md` は `ready` にすると `validate:schema` の enum の網羅の検査（`ready` の rulebook は schema の enum の値をすべて説明する）が落ちた。`arguments` の `kind`・`value_source` などの値を、引数の表を持たない方針のため説明していないことによる。rulebook は `draft` のままとし、直し方を PJR-8BSV で扱う。recipe・sample・template は `ready` とした。
