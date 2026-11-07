---
specdojo:
  id: prj-0001:pjr-kc0t-validate-missing-records-warn
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  registered_at: "2026-11-07T06:32:53Z"
  derived_from:
    - PJR-JT5J
---

# PJR-KC0T 普通の exec validate で実行記録の欠落を警告にする

## 1. 概要

JT5J の後、develop の exec validate が過去の記録の欠落などで失敗するため、欠落を警告にし、別形式の grade の生成物と空の lock のディレクトリを検査から外して終了コード 0 に戻す

## 2. 入力

- 由来: PJR-JT5J の統合後、develop で npx specdojo exec validate --project prj-0001 がエラー 665 件で失敗した。内訳は missing 644 件、misplaced 10 件、lock-not-ignored 1 件（2026-11-07）
- missing の大半は記録の世代の違いによる。evidence がない run 365 件のうち pipeline-state.json を持つのは 4 件で、ほかは evidence の仕組みより前の run。plan と result の欠落は、PJR-9BY9 の移行で plan と result を最新の試行のディレクトリに集めたため（2026-11-07）
- misplaced の 10 件は、すべて execution/grade/generated/runs/ にある品質評価の plan（`*-grade-plan.md`・`*-grade-reporter-plan.md`）で、実行記録とは別の形式（2026-11-07）
- lock-not-ignored の 1 件は docs/ja/projects/prj-0001/routines/.locks の空のディレクトリ。今の src はこの場所に lock を作らないが、ディレクトリは 2026-11-07 02:00 に更新されている。更新した主体は分かっていない（2026-11-07）
- agent への指示（.github/instructions/specdojo-exec-workflow.instructions.md）は、作業の後の exec validate が成功で終了コード 0 になることを前提にしている（2026-11-07）
- 決定（A 案）: 普通の exec validate では記録の欠落を警告にし、終了コードに含めない。置き場所の外のファイルと lock はエラーのまま。--records-only（CI 用）は欠落もエラーのまま。欠落の基準の見直しは別の項目で扱う（2026-11-07 indie が決定）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
