---
specdojo:
  id: prj-0001:pjr-0161-register-approval-workflow-policy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0161 登録簿承認typeの承認フローとPR/commit使い分けの規約化

## 1. 概要

承認を要する登録簿 type（`change-request` / `decision` / `risk` / `question` / `issue`）について、承認フロー（誰が・どの状態遷移で承認するか）と承認方式（Pull Request ベースか単なる commit か）が未規定である。SpecDojo は既に `exec → develop` を自動 commit 統合、`develop → main` を PR 必須とする階層モデルを持つため、これに整合する形で type 別の承認運用を明文化する。

承認の実体（register status 遷移＋チケットの承認欄）は常に commit で残し、人による強制ゲート（PR）は「変更が `main` に載る境界」と「提案者と承認者の分離が必要な高リスク type」に限定する、という原則を規約化する。

## 2. 完了条件

- 承認に関わる2種類（成果物レビュー / 内容承認）の区別が定義されている。
- 承認を要する type ごとに、`register` 状態遷移（`review` → `close`/`reject`/`defer`/`wait`）に沿った承認フローが定義されている。
- 承認方式の使い分け（既定 commit ＋ 限定 PR）と、PR を強制する3ケース（`develop → main` 昇格 / `change-request` 承認 / 不可逆・高リスク・framework schema 破壊的変更）が明文化されている。
- 承認者ロール（RACI の A）が type ごとに割り当てられている。
- `main` / `develop` の branch protection と `CODEOWNERS` による承認者強制の方針が定義されている。
- `decision` / `question` テンプレートに承認者・承認日（決定者/決定日・回答者/回答日）欄が追加されている。
- 上記が `branch-workflow-guide` / `git-branching-standard` / `register-operation-guide` / `pjr-rulebook` に齟齬なく反映され、`npm run lint:md` が通る。

## 3. 設計方針

### 3.1. 承認の2区分

- 成果物レビュー: agent 生成物の妥当性確認。exec の `review` 状態＋review result＋register `close` で成立。
- 内容承認: 権限者が判断・変更・対応方針を承認する行為。チケットの「審査・決定」「採択理由」「対応方針」欄が担う。本 PJR が運用を定めるのは主に後者。

### 3.2. type 別の承認方式

| type                  | 既定方式                     | ゲート / 境界                        | 承認者                   |
| --------------------- | ---------------------------- | ------------------------------------ | ------------------------ |
| `change-request`      | PR ベース                    | feature/exec → develop の PR approve | 変更承認権限者（PO/CCB） |
| `decision`            | commit ベース                | §3/§4＋決定者を記入し close→decided  | 意思決定者               |
| `risk`                | commit ベース                | 対応方針を記入し close/defer         | リスクオーナー           |
| `question`            | commit ベース                | 回答確定し close→decided             | 回答権限者               |
| `issue`               | commit ベース（exec review） | exec review→close                    | 課題リード               |
| `todo`                | commit ベース（exec review） | exec review→close                    | -                        |
| `note` / `dependency` | commit ベース                | close / update                       | -                        |
| 全 type 共通          | PR ベース                    | develop → main 昇格                  | リポジトリ管理者         |

### 3.3. PR を強制する3ケース

- `develop → main` 昇格（現行どおり・最終承認境界）。
- `change-request` の承認（実装＋職務分離＋CI ゲートが必要）。
- `todo`/`issue`/`decision` のうち、不可逆・高リスク・framework schema 破壊的変更（例: PJR-0160 の dependency enum 変更、PJR-0158 の exec-run ロック）。

### 3.4. 判断軸

可逆性（記録のみか実装を伴うか）、職務分離（自己承認の回避）、自動化整合（PR ゲートを自動 `exec → develop` の内側に置かない）の3点で方式を選ぶ。

## 4. 作業内容

| No  | 作業                                                        | 担当   | 状態 | メモ                                    |
| --- | ----------------------------------------------------------- | ------ | ---- | --------------------------------------- |
| 1   | 承認2区分と type 別承認フロー（状態遷移ベース）の定義       | _TODO_ | open | register-operation-guide / pjr-rulebook |
| 2   | 承認方式（既定 commit ＋ 限定 PR）と PR 強制3ケースの明文化 | _TODO_ | open | branch-workflow-guide / 標準            |
| 3   | type 別承認者ロールの割り当て（RACI の A）                  | _TODO_ | open | pm-raci との整合                        |
| 4   | branch protection ＋ CODEOWNERS による承認者強制方針の策定  | _TODO_ | open | main/develop                            |
| 5   | decision/question テンプレへの承認者・承認日欄の追加        | _TODO_ | open | pjr-decision/pjr-question テンプレート  |
| 6   | 関連文書への反映と lint 検証                                | _TODO_ | open | lint:md                                 |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[specdojo:branch-workflow-guide]]
- [[specdojo:git-branching-standard]]
- [[specdojo:register-operation-guide]]
- [[specdojo:pjr-rulebook]]
