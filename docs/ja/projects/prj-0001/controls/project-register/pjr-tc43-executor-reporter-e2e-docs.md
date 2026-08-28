---
specdojo:
  id: prj-0001:pjr-tc43-executor-reporter-e2e-docs
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-10T06:28:46Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-10T22:42:31Z"
  conclusion: 従来フロー・ローカルLLM・クラウドexecutor構成・失敗/再開経路のE2Eテスト9件を追加し、exec設定/運用ガイドへpipeline構成と復旧手順を文書化。typecheck/lint/test 1050件成功、schema/catalog/index検証成功。
  register_events:
    - v: 1
      id: reg_99a6c0606aada3cbb5fe562bcf82f816
      ts: "2026-08-10T06:36:41Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): add executor reporter pipeline todos"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: executor / reporterパイプラインのE2E検証と文書化を行う
        - field: description
          from: ""
          to: 従来フローとの後方互換、ローカルLLM構成、クラウドagent構成、失敗・再開経路をテストし、設定例と運用手順を文書化する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-10"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 05c3d3781552e051565e003506dd009eb1312db5
    - v: 1
      id: reg_7f571768a9f726372efedc779c570933
      ts: "2026-08-10T08:01:36Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-TC43): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: c74a308bed6bb9aefa4d2b8670b92c9919a3b183
      previous_event_id: reg_99a6c0606aada3cbb5fe562bcf82f816
    - v: 1
      id: reg_beec98993026ceb6d4d8de627f4822aa
      ts: "2026-08-10T08:02:06Z"
      action: wait
      actor: SpecDojo Test
      from_status: in-progress
      to_status: waiting
      reason: "exec(register PJR-TC43): wait"
      changes:
        - field: status
          from: in-progress
          to: waiting
        - field: conclusion
          from: "-"
          to: rate limit reached
      legacy_commit: a7aa5dc49e249521e3e3da0aba4815db185447e7
      previous_event_id: reg_7f571768a9f726372efedc779c570933
    - v: 1
      id: reg_e71ab2d91e54b4720c5239493f599ed1
      ts: "2026-08-10T22:46:50Z"
      action: close
      actor: SpecDojo Test
      from_status: waiting
      to_status: done
      reason: "exec(register PJR-TC43): executor / reporterパイプラインのE2E検証と文書化"
      changes:
        - field: status
          from: waiting
          to: done
        - field: completed
          from: "-"
          to: "2026-08-11"
        - field: conclusion
          from: rate limit reached
          to: 従来フロー・ローカルLLM・クラウドexecutor構成・失敗/再開経路のE2Eテスト9件を追加し、exec設定/運用ガイドへpipeline構成と復旧手順を文書化。typecheck/lint/test 1050件成功、schema/catalog/index検証成功。
      legacy_commit: 095189d5df7fcb58163a4c5c1f6e847a113a1db3
      previous_event_id: reg_beec98993026ceb6d4d8de627f4822aa
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

| No  | 作業                                          | 担当 | 状態 | メモ                                                                    |
| --- | --------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------- |
| 1   | 従来フローの回帰テストを追加する              | ARC  | done | pipeline 未指定 phase で単一 agent が plan を受け取り result を記入する |
| 2   | ローカル LLM 構成の E2E テストを追加する      | ARC  | done | 同一 provider の executor / reporter を stage 要件だけで自動選択        |
| 3   | クラウド executor 構成の E2E テストを追加する | ARC  | done | expert executor は別 provider、reporter と result 生成は共通経路        |
| 4   | 失敗、block、resume の E2E テストを追加する   | ARC  | done | executor 失敗・reporter 失敗・形式不正・blocked と reporter 単独再開    |
| 5   | 設定例、運用、復旧手順を文書化する            | ARC  | done | 設定ガイドへ構成例とログ引き渡し方針、運用ガイドへ stage 別の復旧手順   |

## 4. 対応結果

- `tests/src/exec-pipeline-e2e.test.ts` を追加し、実 git リポジトリのフィクスチャに対して `exec run` / `exec resume` を CLI 経由で実行する E2E を 9 件用意した。agent は provider の `command_template` から起動されるテスト用スクリプトで、nickname ごとの振る舞い（成功・失敗・形式不正・blocked）を切り替える。
- 従来フローの回帰では、`agent_pipeline` を持たない phase で単一 agent が plan をそのまま受け取り、agent 自身が result を記入し、evidence や pipeline state を作らないことを固定した。stage role 付き agent が従来フローの候補へ混入しないことも、`--executor-by` に従来 agent を指定した場合の拒否とあわせて確認した。
- ローカル LLM 構成では、`stage_role` と `proficiency` だけで executor / reporter が自動選択され、同一 provider のテンプレートが member 属性で展開されること、成果物更新・evidence 収集・reporter の構造化出力からの result 描画までが通ることを確認した。クラウド executor 構成では expert 要件が別 provider の executor を選び、reporter と result 生成は同じ経路を共有することを確認した。
- ログ引き渡しでは、reporter へ渡るのが plan と上限つき evidence とスキーマだけであり、executor の生ログ本文が渡らないこと、ログは run 単位のファイルに残り秘匿値が伏せ字化されることを確認した。
- 失敗経路では、executor 失敗時に reporter が起動しないこと、reporter の形式不正が executor を再実行せず reporter だけを 3 回試行して blocked になること、`outcome=blocked` が result へ反映されることを確認した。worktree 経路では reporter 失敗の block イベントに stage checkpoint が残り、`exec resume --task` が executor を再実行せず reporter だけを再開して完了することを確認した。
- [[specdojo:exec-config-guide|exec設定ガイド]] に `executor / reporter pipeline の構成` 章を追加し、ローカル LLM 構成、クラウド executor 混在構成、evidence とログの引き渡し方針を記載した。[[specdojo:exec-operation-guide|exec運用ガイド]] には `executor / reporter pipelineの実行と復旧` 節を追加し、run 単位の記録の見方と stage 別の失敗・復旧手順を記載した。
- 検証は `npm run typecheck`、`npm run lint:ts`、`npm test`（79 ファイル 1,050 件）、変更 Markdown の `prettier` / `markdownlint`、`register build`、`catalog validate`、`index build` を実行した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-jfwq-executor-reporter-pipeline-schema]]
- [[prj-0001:pjr-nsxt-executor-reporter-agent-definitions]]
- [[prj-0001:pjr-jxv7-executor-evidence-collection]]
- [[prj-0001:pjr-rg7c-reporter-result-generation]]
- [[prj-0001:pjr-7mxj-pipeline-resume-recovery]]
- [[specdojo:exec-config-guide]]
- [[specdojo:exec-operation-guide]]
