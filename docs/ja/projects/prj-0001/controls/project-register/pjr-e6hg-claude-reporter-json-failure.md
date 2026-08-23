---
specdojo:
  id: prj-0001:pjr-e6hg-claude-reporter-json-failure
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: high
  owner: ARC
  registered_at: "2026-08-23T13:03:45Z"
  due_on: "2026-08-31"
  conclusion: "agent exited with non-zero code: executor validation `npm run test:unit` がfailedであり、doc-index.test.tsが生成前のpjr-index不在により1件失敗した。計画は終了前に検査失敗をすべて修正することを要求しているため、代替コマンドの成功だけでは完了を支持できない。"
---

# PJR-E6HG claude-reporterがJSON解析失敗で再現性をもってブロックする

## 1. 課題内容

claude-reporter が PJR-K4TA で3回、PJR-JT1Y で3回、いずれも is not valid JSON を理由に失敗した。変更規模はそれぞれ79ファイルと61ファイルで、出力が長大になる条件で再現する疑いがある。設定ファイルはいずれも妥当な JSON であり、worktree にも存在することを確認済みである。現状 claude-reporter は reporter として使えず、codex-reporter への差し替えで回避している。原因を特定して解消する。

## 2. 影響範囲

| 観点         | 影響                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------- |
| スコープ     | agent pipeline の reporter 段階。executor 段階と成果物そのものには影響しない                       |
| スケジュール | reporter が完了できないため register の遷移が止まり、代行記入と手動統合が必要になる                |
| コスト       | 失敗のたびに3回の再試行が走り、実行時間と agent 利用量を消費する                                   |
| 品質         | 成果物の品質への直接の影響はない。ただし result が未記入のまま残り、実行記録としての価値が失われる |
| 関係者       | pm-members.yaml で claude-reporter を指定する全タスク                                              |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | 未特定。変更規模が大きい実行で再現しているため、出力長との関係を疑っている                                                                                                           |
| 対応策   | 再現条件を絞り込み、失敗時の生の標準出力を保全して解析する。原因が SpecDojo 側にあれば修正し、claude CLI 側にあれば回避策と適用範囲を記録する                                        |
| 依存事項 | PJR-Q828（reporter の再評価手段）と同じ reporter 段階を扱うため、実装が重なる場合は順序を調整する                                                                                    |
| 完了条件 | 失敗の再現条件と原因が特定され、本個票に記録されている。原因が SpecDojo 側にある場合は修正方針が判断できる状態になっている。修正そのものは本個票の範囲に含めず、必要なら別途起票する |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- 1回目の発生: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 2回目の発生: [[prj-0001:pjr-jt1y-kata-undecided-state|PJR-JT1Y 実践の型の要否に未判断の状態を追加]]
- 同じ reporter 段階の課題: [[prj-0001:pjr-q828-reporter-revalidation|PJR-Q828 reporterの再評価]]
- 実行ログ: `logs/exec-register-PJR-K4TA.stderr.log`、`logs/exec-register-PJR-JT1Y.stderr.log`
