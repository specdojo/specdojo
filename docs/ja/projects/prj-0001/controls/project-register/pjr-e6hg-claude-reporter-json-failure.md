---
specdojo:
  id: prj-0001:pjr-e6hg-claude-reporter-json-failure
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-23T13:03:45Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-24T09:43:44Z"
  conclusion: claude-reporter の失敗は Claude CLI が reporter prompt の処理前に読む実行環境側の credentials JSON が不正だったことによるもので、SpecDojo の出力解析やプロジェクト内の settings JSON の問題ではない。診断文言の出所で切り分け、出力長との関連は否定した。復旧には利用者による Claude CLI の再認証が必要で、それまでは codex-reporter で回避する。原因が実行環境側のため SpecDojo 側の修正は不要であり、本項目の範囲である原因特定と記録を完了した。
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
| 原因     | Claude CLI が reporter prompt の処理前に読む、実行環境側の credentials JSON が不正だった。SpecDojo の reporter 出力解析やプロジェクト内の settings JSON の失敗ではない               |
| 対応策   | Claude CLI の正規の認証操作で credentials を再生成してから reporter を再開する。復旧までは `--reporter-by codex-reporter` を使い、不正な credentials を手編集・共有・成果物化しない  |
| 依存事項 | PJR-Q828（reporter の再評価手段）と同じ reporter 段階を扱うため、実装が重なる場合は順序を調整する                                                                                    |
| 完了条件 | 失敗の再現条件と原因が特定され、本個票に記録されている。原因が SpecDojo 側にある場合は修正方針が判断できる状態になっている。修正そのものは本個票の範囲に含めず、必要なら別途起票する |

## 4. 対応結果

- PJR-K4TA と PJR-JT1Y の保存済み plan / evidence を比較した。入力はそれぞれ約28 KiB（plan 約11 KiB、evidence 約17 KiB）と約26 KiB（plan 約11 KiB、evidence 約15 KiB）で、変更一覧は78件と59件だった。いずれも JSON として読み込め、`diff_summary` などの可変長項目には既定の上限が適用されていた。
- `.specdojo/claude/settings.report.json` と共通 `.claude/settings.json` は現在と両実行の成果コミット（`5a2e9011`、`03aa42e0`）で JSON として妥当だった。reporter command も両実行で同一であり、変更一覧の件数が settings の解決結果を変える経路はない。
- SpecDojo が reporter の stdout を解析できない場合の診断は `response is not a single JSON value` である。一方、当該実行で記録された `is not valid JSON` は Claude CLI の credentials 読み込み失敗の診断と一致する。Claude CLI の `--settings` 構文エラーは `Invalid JSON provided to --settings` / `Invalid JSON syntax in settings file` という別の診断になる。この文言の発生箇所と、同じローカル状態のまま3回とも起動時に失敗したことから、reporter 出力長ではなく実行環境側 credentials の不正が再現条件だったと特定した。
- この失敗は agent が応答を生成する前に起きるため、reporter JSON schema、形式リトライ、evidence の変更ファイル数を調整しても解消しない。プロジェクト成果物に credentials を取り込まず、Claude CLI の正規の logout / login 相当の操作でローカル認証状態を再生成することを復旧手順とした。認証情報へアクセスしないプロジェクト方針に従い、本対応では credentials の読み取り・編集・再生成を行っていない。
- 復旧確認は、認証状態を管理する利用者が Claude CLI の認証を再設定した後、同じ checkpoint を `specdojo exec resume --task <task-id> --reporter-by claude-reporter` で再開して行う。復旧までの回避策は、実績のある `--reporter-by codex-reporter` への切り替えとする。原因は SpecDojo の実装・設定ではないため、ソースコードと provider 設定は変更していない。

## 5. 関連ドキュメント

- 1回目の発生: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 2回目の発生: [[prj-0001:pjr-jt1y-kata-undecided-state|PJR-JT1Y 実践の型の要否に未判断の状態を追加]]
- 同じ reporter 段階の課題: [[prj-0001:pjr-q828-reporter-revalidation|PJR-Q828 reporterの再評価]]
- 実行ログ: `logs/exec-register-PJR-K4TA.stderr.log`、`logs/exec-register-PJR-JT1Y.stderr.log`
