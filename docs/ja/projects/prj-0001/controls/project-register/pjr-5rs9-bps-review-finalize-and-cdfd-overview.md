---
specdojo:
  id: prj-0001:pjr-5rs9-bps-review-finalize-and-cdfd-overview
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T23:23:17Z"
  completed_at: "2026-09-27T00:20:17Z"
  conclusion: local_id を bps-task-verification へ改め参照元3件を追随、cdfd-overview の Check への要求を評価・報告・生成要求にし、Plan/Do/Check/Action から Orchestrator への応答4本を cdfd-orchestrator と一致させた
---

# PJR-5RS9 bps-task-review-finalize の local_id を中身に合わせ cdfd-overview の不整合を直す

## 1. 概要

夜間作業の評価で、次の 2 つの不整合を確認した。

1. local_id と中身の不一致
   - 成果物カタログ `dct-business-model-bps.yaml` の `bps-task-review-finalize` は、中身が成果検証（P-07-03）である。
   - 確定・統合は後続の `bps-task-judgment-integration`（P-07-04・05）が扱うため、名前の finalize が中身と合わない。
   - 文書本体は未作成で、参照は `dct-business-model-bps.yaml`・`dct-business-model-br.yaml`・`dct-business-acceptance-criteria.yaml` にある。
2. [[cdfd-overview]] と [[cdfd-orchestrator]] / [[cdfd-check]] の不一致
   - Check への要求: overview は「評価・報告要求」で、生成要求を含まない。cdfd-orchestrator と cdfd-check（P-10-01）は「評価・報告・生成要求」である。
   - Orchestrator への応答: overview には、実行記録を経由した「実行状態」の 1 本しかない。cdfd-orchestrator では、Plan・Do・Check・Action の 4 つがそれぞれ応答を返している。

## 2. 完了条件

- `bps-task-review-finalize` の local_id と path が、成果検証を表す名前に変わっている（例: `bps-task-review`。最終的な名前は作業時に決める）。
- 旧 local_id を参照する `depends_on` などが、成果物カタログ全体から無くなっている。
- cdfd-overview で、Orchestrator から Check への要求が「評価・報告・生成要求」になっている。
- cdfd-overview の Orchestrator への応答が、cdfd-orchestrator の 4 本（計画要求への応答、実行状態・判断依頼、評価・報告・生成結果、完了・改善判断）と矛盾しない。集約して表す場合は、集約の規則が本文に明記されている。
- `npx specdojo catalog validate --project prj-0001` と `npm run lint:md` が成功する。

## 3. 作業内容

| No  | 作業                                                                                          | 担当 | 状態 | メモ                           |
| --- | --------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------ |
| 1   | `bps-task-review-finalize` の local_id・path・name を中身に合わせて変更し、参照元を追随させる | DEV  | done | `bps-task-verification` へ改名 |
| 2   | cdfd-overview の Check への要求ラベルを修正する                                               | DEV  | done | -                              |
| 3   | cdfd-overview の Orchestrator への応答を cdfd-orchestrator と整合させる                       | DEV  | done | 4 本の応答エッジを追加         |

## 4. 対応結果

- `local_id` を `bps-task-verification`、`path` を `bps-task-verification.md` へ変更した。`name` は既に「業務プロセス仕様（成果検証）」で中身と一致していたため据え置いた。
  - 改名先は、後続の `bps-task-judgment-integration` が確定・統合を担うため、確定を含まない「検証（verification）」を選んだ。`review` は Action（`P-11`）の review phase と紛れるため避けた。
  - 参照元の `depends_on`（`dct-business-model-bps.yaml` の `bps-task-judgment-integration`、`dct-business-model-br.yaml` の `br-review-verdict`、`dct-business-acceptance-criteria.yaml` の `bac-task-execution`）を追随させ、カタログ内に旧 `local_id` は残っていない。文書本体は未作成のため、ファイルの移動はない。
- [[cdfd-overview]] の Check の主要入力と図のエッジを「評価・報告・生成要求」へ改めた。
- [[cdfd-overview]] に、Plan・Do・Check・Action から Orchestrator への応答エッジ 4 本（計画要求への応答、実行状態・判断依頼、評価・報告・生成結果、完了・改善判断）を追加し、各グループの主要出力と Orchestrator の主要入力へ反映した。実行記録からのエッジは「記録済みの実行状態」とし、応答は Orchestrator が実行記録へ記録してから次の判断に参照するという関係を本文に明記した。
- あわせて grade finding のうち、Orchestrator の主要入力への rulebook 参照の追加と、詳細 CDFD 一覧の表を rulebook どおり 3 列にする修正を行った。

## 5. 関連ドキュメント

- [[cdfd-overview]]
- [[cdfd-orchestrator]]
- [[cdfd-check]]
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-model-bps.yaml`
