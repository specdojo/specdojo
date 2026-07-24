---
specdojo:
  id: prj-0001:pjr-0124-human-plan-integrate-result
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0124 human実行時のplan非生成とresultへの統合

## 1. 概要

`execution: human` のタスクでは、実行者が plan を参照せず result だけで確認していた。plan の固有価値は HEAD 由来の改ざん耐性ある commit スコープ導出だが、これは agent のプロンプトインジェクション対策であり、敵対 agent が存在しない human では無効になる。したがって human 時は plan を生成せず result へ統合し、commit スコープは result frontmatter の `targets` から導出する。result のチェックは現状で最低限のため温存し、done_criteria 確認の一元的な受け皿とする。

## 2. 完了条件

- `execution: human` のタスクで plan が生成されない（`exec build` の `generateReadyHumanPlans` が human plan を作らない）。
- human タスクの commit スコープが result frontmatter の `targets` から導出される（agent 非敵対のため HEAD 改ざん耐性は要件から外す）。
- done_criteria の確認が result 側に一元化され、plan と result の二重掲載が解消している。
- finalize の確定手順・共通規約が静的な recipe / standard に一本化され、plan 生成に依存しない。
- `npm run build`・`npm run lint:ts`・関連テストが通る。

## 3. 作業内容

<!-- prettier-ignore -->
| No | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1 | `exec build` の human plan 生成（`generateReadyHumanPlans`）を停止する | ARC | open | `src/exec-plans.ts` |
| 2 | commit スコープ導出を human 時に result frontmatter の `targets` 由来へ切替える | ARC | open | `src/exec-worktree-ops.ts` `resolveCommitScope` / `partitionCommitTargets` |
| 3 | human result テンプレへ done_criteria チェックを集約（plan の最終確認項目を統合） | ARC | open | `xer-human-*-template.md` は現状維持で受け皿化 |
| 4 | finalize の確定手順・共通規約を静的 recipe / standard へ移設し result から参照する | ARC | open | `xep-human-*-template.md` の定型部を移設 |
| 5 | 既存 human plan テンプレ・生成物を整理し、影響とテストを更新する | ARC | open | agent フローとの非対称は脅威モデル差として許容 |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]] — 起票元（対策案「executionがhuman時にplanをつくるか」）
- [[specdojo-exec-config-guide]] — commit 許可リスト / プロンプトインジェクション対策の正本（影響先）
