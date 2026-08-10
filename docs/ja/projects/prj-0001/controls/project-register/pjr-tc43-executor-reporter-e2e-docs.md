---
specdojo:
  id: prj-0001:pjr-tc43-executor-reporter-e2e-docs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-10T06:28:46Z"
  due_on: "2026-08-31"
---

# PJR-TC43 executor / reporterパイプラインのE2E検証と文書化を行う

## 1. 概要

従来フローとの後方互換、ローカルLLM構成、クラウドagent構成、失敗・再開経路をテストし、設定例と運用手順を文書化する。

## 2. 完了条件

- 従来の単一エージェントフローと新しい pipeline フローの E2E テストが成功する。
- Gemma を executor と reporter の両方に使うローカル LLM 構成を検証できる。
- Codex または Claude を executor に使う構成でも、共通の reporter と result 生成経路を利用できる。
- executor、reporter、result 検証の各失敗と、ステージ単位の再開を E2E テストで確認できる。
- strategy、member、CLI、ログと evidence の運用例が利用者向け文書へ反映される。

## 3. 作業内容

| No  | 作業                                          | 担当 | 状態 | メモ                            |
| --- | --------------------------------------------- | ---- | ---- | ------------------------------- |
| 1   | 従来フローの回帰テストを追加する              | ARC  | open | pipeline 未指定の挙動を固定する |
| 2   | ローカル LLM 構成の E2E テストを追加する      | ARC  | open | Gemma の二段実行を対象にする    |
| 3   | クラウド executor 構成の E2E テストを追加する | ARC  | open | reporter 経路の共通性を確認する |
| 4   | 失敗、block、resume の E2E テストを追加する   | ARC  | open | reporter 単独再開を含む         |
| 5   | 設定例、運用、復旧手順を文書化する            | ARC  | open | ログ引き渡し方針も記載する      |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-jfwq-executor-reporter-pipeline-schema]]
- [[prj-0001:pjr-nsxt-executor-reporter-agent-definitions]]
- [[prj-0001:pjr-jxv7-executor-evidence-collection]]
- [[prj-0001:pjr-rg7c-reporter-result-generation]]
- [[prj-0001:pjr-7mxj-pipeline-resume-recovery]]
- [[specdojo:exec-config-guide]]
- [[specdojo:exec-operation-guide]]
