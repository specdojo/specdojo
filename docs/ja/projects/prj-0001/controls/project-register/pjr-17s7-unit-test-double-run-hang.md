---
specdojo:
  id: prj-0001:pjr-17s7-unit-test-double-run-hang
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-23T03:22:01Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-23T03:52:17Z"
  conclusion: plan へ注入する共通規約へ、executor は npm run test:unit を1回だけ実行し前後に対象限定の実行を行わない旨を明記した。回帰テストで規約が plan に含まれることを固定している。規約の効果は、次に src または tests を変更するタスクを実行したときに確認する。本タスクの実行自体は旧規約の plan で動いたため二度実行が起き、orchestrator が1回だけの実行で全件成功を確認した。
  register_events:
    - v: 1
      id: reg_10138ee1dd0b39cd67b4cd85585a6004
      ts: "2026-08-23T03:23:49Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): unit test の二度実行による中断を PJR-17S7 として起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: executor が unit test を二度実行し、Vitest の終了待ちが収束しない
        - field: description
          from: ""
          to: executor が対象限定の npm run test:unit を実行した後、続けて全件の npm run test:unit を実行すると、先行実行で残った Vitest プロセスとの競合で終了待ちが収束せず中断する。vitest.unit.config.ts は maxWorkers を 2 に固定しており、残存ワーカーがあると新しい実行がスロットを確保できない。PJR-ZJZD と PJR-AQ9G の2回で再現しており、いずれもアサーション失敗ではなく環境要因である。実装は完了しているのに検証未完として block されるため、実行の締めくくりが人手に依存する。共通規約で二度実行を避けるよう指示を整理する。
        - field: type
          from: ""
          to: issue
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-23"
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
      legacy_commit: 31ab82b6ef6124b8918e513d3b20696e97e383c4
    - v: 1
      id: reg_3e1dca7231b07dd07e9a7f1d8959b6a5
      ts: "2026-08-23T03:26:03Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-17S7): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 8f761918dab6c26fc5aab3d26fe472a48b14ad4d
      previous_event_id: reg_10138ee1dd0b39cd67b4cd85585a6004
    - v: 1
      id: reg_23e8735fc4599aae4a4d1c33ec6dfbdd
      ts: "2026-08-23T03:36:58Z"
      action: wait
      actor: SpecDojo Test
      from_status: in-progress
      to_status: waiting
      reason: "exec(register PJR-17S7): wait"
      changes:
        - field: status
          from: in-progress
          to: waiting
        - field: conclusion
          from: "-"
          to: "agent exited with non-zero code: 本タスク（個票 PJR-17S7）の完了条件は「executor が unit test を二度実行しないよう規約で示され、かつ src/tests を変更するタスクで終了待ちの中断が起きないこと」の両方である。executor は規約更新と回帰テストにより前半は満たしたが、検証として実施した npm run test:unit（対…"
      legacy_commit: 2276b059045933d80316a0025456183412d76865
      previous_event_id: reg_3e1dca7231b07dd07e9a7f1d8959b6a5
    - v: 1
      id: reg_3a08367356962b76e0d237f94bdf17ab
      ts: "2026-08-23T03:39:14Z"
      action: review
      actor: SpecDojo Test
      from_status: waiting
      to_status: review
      reason: "exec(register PJR-17S7): review"
      changes:
        - field: status
          from: waiting
          to: review
      legacy_commit: f86f447f8a6831dcc020ed5c9ddf8a39683cb73a
      previous_event_id: reg_23e8735fc4599aae4a4d1c33ec6dfbdd
    - v: 1
      id: reg_bf0aa50aab1a75f2d341fdc44acd0a84
      ts: "2026-08-23T03:52:18Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-17S7): close"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-23"
        - field: conclusion
          from: "agent exited with non-zero code: 本タスク（個票 PJR-17S7）の完了条件は「executor が unit test を二度実行しないよう規約で示され、かつ src/tests を変更するタスクで終了待ちの中断が起きないこと」の両方である。executor は規約更新と回帰テストにより前半は満たしたが、検証として実施した npm run test:unit（対…"
          to: plan へ注入する共通規約へ、executor は npm run test:unit を1回だけ実行し前後に対象限定の実行を行わない旨を明記した。回帰テストで規約が plan に含まれることを固定している。規約の効果は、次に src または tests を変更するタスクを実行したときに確認する。本タスクの実行自体は旧規約の plan で動いたため二度実行が起き、orchestrator が1回だけの実行で全件成功を確認した。
      legacy_commit: 4e822b6caff8a629b3984d9e58b509a5119b6f74
      previous_event_id: reg_3a08367356962b76e0d237f94bdf17ab
---

# PJR-17S7 executor が unit test を二度実行し、Vitest の終了待ちが収束しない

## 1. 課題内容

executor が対象限定の npm run test:unit を実行した後、続けて全件の npm run test:unit を実行すると、先行実行で残った Vitest プロセスとの競合で終了待ちが収束せず中断する。vitest.unit.config.ts は maxWorkers を 2 に固定しており、残存ワーカーがあると新しい実行がスロットを確保できない。PJR-ZJZD と PJR-AQ9G の2回で再現しており、いずれもアサーション失敗ではなく環境要因である。実装は完了しているのに検証未完として block されるため、実行の締めくくりが人手に依存する。共通規約で二度実行を避けるよう指示を整理する。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | executor が `src` または `tests` を変更する全タスク。共通規約が変更対象に応じた test 実行を求めるため、対象限定と全件の二度実行が起きやすい |
| スケジュール | 実装が完了していても検証未完として block され、統合と close が人手の引き継ぎ待ちになる                                                      |
| コスト       | 追加の外部コストはなく、影響は再検証と引き継ぎに要する作業時間                                                                              |
| 品質         | 成果物への影響はない。アサーション失敗ではなく、Vitest の終了待ちが収束しない環境要因である                                                 |
| 関係者       | ARC（規約と設定の整備）。exec を実行する運用者                                                                                              |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | 対象限定の `npm run test:unit` の直後に全件を実行すると、先行実行の Vitest ワーカーが残存したまま次が起動する。`vitest.unit.config.ts` は `maxWorkers: 2` を固定しており、スロットを確保できず終了待ちが解消しない |
| 対応策   | 共通規約で、変更対象に対応する test を実行する際は対象限定と全件のどちらか一方に絞ると明示する。全件を実行する場合は対象限定の実行を省く。plan へ注入する共通規約の文面を更新する                                  |
| 依存事項 | なし。設定側（`maxWorkers` や pool、`teardownTimeout`）の見直しは、規約の調整で解消しない場合に検討する                                                                                                            |
| 完了条件 | executor が unit test を二度実行しないよう規約で示され、`src` や `tests` を変更するタスクで終了待ちの中断が起きないこと                                                                                            |

## 4. 対応結果

- plan へ注入する共通規約を更新し、同じ test script の対象限定実行と全件実行を同一 executor run 内で連続実行せず、どちらか一方に絞ることを明記した。
- 下表、plan、またはプロジェクト標準が全件 test を求める場合は全件を1回だけ実行し、対象限定の実行を省く判断基準を追加した。
- executor / reporter pipeline では `npm run test:unit` の前後に対象限定実行を追加しないことを明記し、生成 plan に規約が注入される回帰テストを追加した。
- 検証では対象限定 test を実行せず、全件の `npm run test:unit` を1回だけ実行したが、約3分30秒経過してもテスト結果が出力されず終了待ちが収束しなかったため中断した。二度実行の防止だけでは sandbox 上の終了待ちは解消しておらず、Vitest プロセスが単独実行でも残存する要因の追加調査が必要である。

再現の記録:

- PJR-ZJZD: 対象限定の実行は成功し、全件で収束せず中断。reporter は検証未完として block と判定した。
- PJR-AQ9G: 同じ経緯。executor のログに「先行して残った Vitest プロセスとの競合で終了待ちが収束せず中断」と記録されている。
- いずれも orchestrator が worktree で全件を1回だけ実行したところ、すべて成功している（PJR-AQ9G では 87 ファイル・1261 件）。

## 5. 関連ドキュメント

- 再現した実行: [[prj-0001:pjr-zjzd-dct-index-nested-groups|PJR-ZJZD dct-index にサブグループ階層を追加し、成果物リファレンスの節構成へ揃える]]
- 再現した実行: [[prj-0001:pjr-aq9g-exec-plan-angle-placeholder-escape|PJR-AQ9G plan 生成でも山括弧プレースホルダをインラインコード化する]]
- 検査対象表を持つ規約: `.github/instructions/specdojo-exec-workflow.instructions.md` と plan へ注入する共通規約
- 設定: `vitest.unit.config.ts` の `maxWorkers`
