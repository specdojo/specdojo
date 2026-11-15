---
specdojo:
  id: prj-0001:pjr-bj7e-integration-test-paths-and-e2e-flake
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T10:47:44Z"
  derived_from:
    - PJR-T01P
  commit_type: test
  commit_scope: exec
---

# PJR-BJ7E sample だけの変更で流れる test-integration と、負荷で揺れる pipeline-e2e のテストを見直す

## 1. 概要

test-integration を流す条件を見直し、pipeline-e2e のテストを負荷に強くする

## 2. 入力

- 2026-11-15、kata-wave-2 で sample だけを変えたタスクでも test-integration が流れ、pipeline-e2e.integration.test.ts が 30 秒の時間切れや一時ファイルの消失で 3 回落ちた（PJR-TN43 の F）
- test-integration の paths は .specdojo/exec-defaults.yaml（保護）にあり、`docs/ja/specdojo/**` を含む（PJR-T01P）

## 3. 完了条件

- test-integration を流す条件（`.specdojo/exec-defaults.yaml` の `paths`）を見直し、sample・rulebook だけの変更で流す必要があるかを決めている。統合テストが実際の型の文書を読むかを調べ、流さなくてよい範囲を変更案に書いている（保護された設定のため）。
- `tests/src/exec/pipeline-e2e.integration.test.ts` が、並べて流す負荷の下で時間切れや一時ファイルの消失（`Cannot find module '/tmp/specdojo-pipeline-e2e-*/fake-agent.mjs'`）を起こす原因を調べ、テストの作りを直している。一時ディレクトリはテストごとに作り、ほかのテストの片付けで消えない。
- 直した後、並べて流す run の親の検証で同じ揺らぎが起きないことを確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | test-integration を流す条件を調べ、変更案を書く | DEV  | open | -    |
| 2   | pipeline-e2e のテストの揺らぎの原因を直す       | DEV  | open | -    |
| 3   | 並べて流す run で確かめる                       | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
