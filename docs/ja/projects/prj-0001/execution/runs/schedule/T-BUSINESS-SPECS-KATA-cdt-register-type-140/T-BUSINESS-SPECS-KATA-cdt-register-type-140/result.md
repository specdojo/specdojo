---
specdojo:
  id: prj-0001:xer-t-business-specs-kata-cdt-register-type-140
  type: exec-result
  task_id: T-BUSINESS-SPECS-KATA-cdt-register-type-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  started_at: "2026-11-10T13:02:42.075Z"
  agent: indie
  execution: human
  approach: bootstrap-finalize
  targets:
    - prj-0001:cdt-register-type
    - specdojo:cdt-rulebook
    - specdojo:cdt-sample
---

# Finalize Result

## 1. 実施基準

- 実施手順: [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]
- 共通規約: [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]

この result を作業指示と確認記録の正本とし、frontmatter の `targets` に含まれる成果物と実践の型だけを確認・修正・確定する。

## 2. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [ ] 分類名・説明が業務観点で正確に定義されていること（BA / vp-ba-requirements-completeness）
- [ ] 分類実装（マスタデータ・コード値）の基礎として参照できること（DEV / vp-dev-implementation-readiness）

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

- [ ] 成果物: `docs/ja/product/010-business-specs/020-data-model/cdt-register-type.md`
- [ ] rulebook: `docs/ja/specdojo/rulebooks/cdt-rulebook.md`
- [ ] sample: `docs/ja/specdojo/samples/cdt-sample.md`

## 5. 確定判断

- judgement: _TODO_（承認 / 差し戻し）

## 6. 備考

_TODO_: 差し戻し理由、確定対象以外に修正した内容、後続タスクへの申し送りなど、必要な場合のみ記入する（なければ削除）。

## 確定の記録（orchestrator が indie の決定を代行、2026-11-10）

- 型一式（`cdt-rulebook.md`、`cdt-sample.md`）の `status` を `ready` に上げた。
- 判断の根拠: 手入れの後の grade（run id `kata-bsk-20261110`、sol-review-executor）で、Markdown の rulebook と sample はすべて pass で、指摘は minor だけだった。minor の指摘は PJR-8E7Z・PJR-1VF0・PJR-8BSV で後で直す（indie が決定）。YAML の sample は grade の対象にならないため（PJR-V05D）、人が確かめる扱いとした。
- 代表の成果物は `draft` のままとする。型の確定の後に business-specs-reps の track で磨き込みから流し直すため（indie が決定、案 A）。
