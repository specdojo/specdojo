---
specdojo:
  id: prj-0001:pjr-964d-git-index-lock-wait-longer
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-16T03:13:34Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-G90K
  commit_type: fix
  commit_scope: exec
---

# PJR-964D 統合の git 操作が index.lock の長い保持を待てるようにする

## 1. 概要

runner の統合の git 操作の index.lock の待ち時間を延ばし、hook の実行中の lock で失敗せずに待つ

## 2. 入力

- 2026-11-15、orchestrator の手の commit で lefthook の pre-commit の npm test が負荷の下で 17 分ほど index.lock を握り、runner の統合の git restore・merge が「Unable to create index.lock」で失敗した（sld-090 などが blocked）。PJR-G90K で入れた再試行は短い取り合いだけを吸収し、長い保持を越えられない
- 本命の直列化（PJR の specdojo git）が入るまでの手当てとして、待ち時間を延ばす。利用者が 2026-11-16 に起票を依頼した

## 3. 完了条件

- runner の統合・記帳の git 操作（`src/shared/git.ts` の index.lock の再試行）が、既定で 20 分程度まで lock の解放を待ってから再試行する。待ち時間は exec-defaults で変えられる。
- 待っている間は「index.lock を待っている」旨と経過時間を定期的に出し、黙って止まって見えない。
- 待ち時間を越えた場合は、従来どおり lock のパスと原因の候補を示して失敗する。
- lock を握ったまま残った古い index.lock（プロセスがいない）を誤って待ち続けない扱いを決め、テストで確かめる。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ |
| --- | ----------------------------------------------------- | ---- | ---- | ---- |
| 1   | 待ち時間の既定と exec-defaults の設定を決めて実装する | DEV  | open | -    |
| 2   | 待機中の表示と、古い lock の扱いを実装する            | DEV  | open | -    |
| 3   | 回帰テストと文書（exec-config-guide など）を更新する  | DEV  | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-g90k-integrate-index-lock-retry]]
- [[prj-0001:pjr-30sa-specdojo-git-serialized]]
