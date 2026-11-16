---
specdojo:
  id: prj-0001:pjr-r7bq-hide-internal-commands
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-16T11:00:22Z"
  due_on: null
  derived_from:
    - PJR-C5AF
  commit_type: refactor
  commit_scope: grade
---

# PJR-R7BQ grade と exec の内部用のコマンドを利用者の一覧から外す

## 1. 概要

grade と exec の内部用のコマンドを利用者の一覧から外す。runner・job・orchestrator の部品として使うもので、利用者が直接打つことがないため（PJR-C5AF）。

## 2. 入力

- PJR-C5AF の内部用の候補: grade の plan・apply・translation-plan・localize・state・result・validate、agent launch・run、exec trial・slots・scheduler
- grade の内部用は、定期の job（job-grade-kata・job-grade-deliverable）が使う tools/grade/run-per-document.sh を grade run に移してから外す。外したコマンドは help に出さないだけにし、runner・job・orchestrator からの呼び出しは保つ

## 3. 完了条件

- 定期の job が `tools/grade/run-per-document.sh` ではなく `grade run` で grade する。
- 対象の内部用のコマンドが help の一覧に出ない。runner・job・orchestrator からの呼び出しは変わらず動く。
- リファレンスで、内部用のコマンドを利用者向けの説明から分けて書く。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                    | 担当 | 状態 | メモ |
| --- | --------------------------------------- | ---- | ---- | ---- |
| 1   | 定期の job の grade を grade run に移す | DEV  | open | -    |
| 2   | 内部用のコマンドを help から外す        | DEV  | open | -    |
| 3   | 文書を更新する                          | DEV  | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-c5af-command-inventory]]
