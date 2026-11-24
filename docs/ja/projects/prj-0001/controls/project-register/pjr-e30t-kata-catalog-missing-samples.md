---
specdojo:
  id: prj-0001:pjr-e30t-kata-catalog-missing-samples
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-24T13:32:20Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0BGE
  commit_type: docs
  commit_scope: catalog
---

# PJR-E30T dct-kata に載っていない sample 31 件を載せる

## 1. 概要

非推奨でない sample のうち dct-kata に載っていない 31 件を catalog に足す

## 2. 入力

- 担当は BA、期限は 2026-11-30（利用者、2026-11-24）
- PJR-0BGE の段取りとして 2026-11-24 の晩の実行の前に行う（利用者、2026-11-24）

## 3. 完了条件

- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-kata.yaml` に、非推奨でないのに載っていない次の 31 件の sample を足す: `bac-sample`�`bdd-sample`�`bds-sample`�`bes-index-sample`�`bes-sample`�`br-sample`�`ccd-sample`�`cdfd-uc-sample`�`cdsd-sample`�`cdt-sample`�`clis-sample`�`dct-index-sample`�`ifd-sample`�`ifx-cmd-sample`�`ifx-file-sample`�`ifx-index-sample`�`opd-sample`�`pm-orchestrator-playbook-sample`�`pm-organization-sample`�`pm-plan-sample`�`pm-quality-management-plan-sample`�`pm-raci-sample`�`pm-roles-sample`�`prj-assumptions-constraints-dependencies-sample`�`prj-comparison-of-alternatives-sample`�`sf-index-sample`�`sf-sample`�`sld-sample`�`sysd-critical-flows-sample`�`sysd-cross-cutting-policy-sample`�`sysd-index-sample`。
- 各項目は、既存の sample の項目（例: `prj-overview-sample`）と同じ形にする（`local_id`・`name`・`kind: work`・`depends_on`・`overview`・`path`・`rulebook`・`done_criteria` の 3 行）。`rulebook` は各 sample の frontmatter の `rulebook` に合わせる。置く場所は、同じ rulebook の系列の既存の項目の近くにする。
- 既存の項目は変えない。載せないと判断した sample があれば、理由を個票の対応結果に書く。
- `npm run validate:catalog` と、catalog の schema に対する `npm run validate:schema:file` を通す。`npm run lint:md` は親の検証に任せる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                    | 担当 | 状態 | メモ                                                           |
| --- | --------------------------------------- | ---- | ---- | -------------------------------------------------------------- |
| 1   | 未掲載 sample 31 件をカタログへ追加する | BA   | done | 各 sample の形式と rulebook を確認し、共通の完了条件を設定した |

## 5. 対応結果

指定された 31 件を [[prj-0001:dct-kata|成果物カタログ（実践の型）]] に追加した。対象外とした sample はなく、残課題はない。

新規項目の `depends_on` は空とした。既存項目の依存関係は作業の順序付けに用いられており、今回の追加だけでは新たな作業順序を確定できないためである。同じ rulebook の項目がない場合は同じ系列の項目の近くに置き、系列もない場合はプロジェクト概要の近くに置いた。

### 5.1. CHANGELOG に書く事項

なし。

## 6. 関連ドキュメント

- [[prj-0001:dct-kata|成果物カタログ（実践の型）]]
