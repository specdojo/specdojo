---
specdojo:
  id: prj-0001:pjr-17s7-unit-test-double-run-hang
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: medium
  owner: ARC
  registered_at: "2026-08-23T03:22:01Z"
  due_on: "2026-08-31"
  conclusion: "agent exited with non-zero code: 本タスク（個票 PJR-17S7）の完了条件は「executor が unit test を二度実行しないよう規約で示され、かつ src/tests を変更するタスクで終了待ちの中断が起きないこと」の両方である。executor は規約更新と回帰テストにより前半は満たしたが、検証として実施した npm run test:unit（対…"
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

-

再現の記録:

- PJR-ZJZD: 対象限定の実行は成功し、全件で収束せず中断。reporter は検証未完として block と判定した。
- PJR-AQ9G: 同じ経緯。executor のログに「先行して残った Vitest プロセスとの競合で終了待ちが収束せず中断」と記録されている。
- いずれも orchestrator が worktree で全件を1回だけ実行したところ、すべて成功している（PJR-AQ9G では 87 ファイル・1261 件）。

## 5. 関連ドキュメント

- 再現した実行: [[prj-0001:pjr-zjzd-dct-index-nested-groups|PJR-ZJZD dct-index にサブグループ階層を追加し、成果物リファレンスの節構成へ揃える]]
- 再現した実行: [[prj-0001:pjr-aq9g-exec-plan-angle-placeholder-escape|PJR-AQ9G plan 生成でも山括弧プレースホルダをインラインコード化する]]
- 検査対象表を持つ規約: `.github/instructions/specdojo-exec-workflow.instructions.md` と plan へ注入する共通規約
- 設定: `vitest.unit.config.ts` の `maxWorkers`
