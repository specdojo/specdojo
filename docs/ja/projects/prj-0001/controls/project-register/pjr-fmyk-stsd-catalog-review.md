---
specdojo:
  id: prj-0001:pjr-fmyk-stsd-catalog-review
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-04T22:58:04Z"
  derived_from:
    - PJR-3APD
  approach: catalog-planning
  targets:
    - domain:data-model
---

# PJR-FMYK stsd のカタログを CDFD に合わせて見直す

## 1. 概要

stsd の試行（3APD）の最初の段。dct-data-model-stsd.yaml の 5 件を、再編した概念データフロー図と現行の実装に照らして見直す

## 2. 入力

- 対象は dct-data-model-stsd.yaml だけ。data-model のほかの種類（bdd・cdsd・cld・ccd）の分割ファイルは変えない（3APD の範囲）
- カタログは概念データフロー図の再編の前に作った。CDFD は stsd-deliverable・stsd-task-execution・stsd-job-run・stsd-register-entry・stsd-routine-run を状態定義の正本として名指ししている（cdfd-uc-schedule・cdfd-uc-register・cdfd-uc-routine の適用範囲）
- 代表の 1 件は stsd-task-execution を draft で書く（2026-11-05 利用者が決定）

## 3. 完了条件

- `dct-data-model-stsd.yaml` の 5 件それぞれについて、状態を持つ対象・`overview`・`depends_on`・`evidence_refs`（実装のパスと目的）が、概念データフロー図（[[cdfd-overview]]・[[cdfd-uc-register]]・[[cdfd-uc-routine]]・[[cdfd-uc-schedule]]）と現行の実装に合っているかを確かめ、合わないものを直している。`evidence_refs` のパスは実在するファイルを指している。
- CDFD が状態の正本として名指しする対象に、カタログで欠けているものや余分なものがないかを確かめている。足す・除く・分ける・まとめる判断をした場合は、理由を個票の対応結果に書いている。
- `local_id` を変えた場合は、CDFD など既にある文書からの参照を一覧にして個票の対応結果に書いている。参照している文書そのものはこの項目では直さない。`stsd-task-execution` は代表の 1 件として次の段で使うため、変える場合はその理由も書く。
- `dct-data-model-stsd.yaml` 以外のカタログと、成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s validate:catalog` と `npm run -s lint:md` が通っている。

## 4. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ |
| --- | -------------------------------------------- | ---- | ---- | ---- |
| 1   | CDFD と実装に照らして 5 件を確かめる         | BA   | open | -    |
| 2   | カタログを直し、検査を通す                   | BA   | open | -    |
| 3   | 判断と理由、参照の一覧を個票の対応結果に書く | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[cdfd-overview]]・[[cdfd-uc-register]]・[[cdfd-uc-routine]]・[[cdfd-uc-schedule]]: 照らし合わせる概念データフロー図
- [[specdojo:stsd-rulebook]]: 1 対象 1 ファイルの規範
- [[specdojo:dct-rulebook]]: カタログの書き方の規範
