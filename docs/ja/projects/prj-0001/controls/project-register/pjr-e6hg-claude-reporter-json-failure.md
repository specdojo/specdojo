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
  completed_at: "2026-08-24T10:19:04Z"
  conclusion: claude CLI（Nodeプロセス）内で JSON.parse が失敗して非ゼロ終了したことまでは確実だが、パース対象は特定できていない。初回調査の「credentials JSON が不正」という結論は誤りであり訂正した。当該文言は Node の JSON.parse 失敗時の標準形式であり認証情報固有の診断ではなく、再検証では最小プロンプトと約22KiBのプロンプトのいずれでも claude-reporter が正常に応答した。6回連続の失敗後に再現しなくなっており、一過性の事象であった可能性が高い。生の stderr が保全されていなかったため原因を追えなかった。保全の整備は PJR-KAQV で行う。
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
| 原因     | 未特定。claude CLI（Node プロセス）内で `JSON.parse` が失敗して非ゼロ終了したことまでは確実だが、パース対象は判別できていない。SpecDojo の reporter 出力解析の失敗ではない           |
| 対応策   | 失敗時の生の stderr を保全したうえで再調査する。保全の仕組みは PJR-KAQV で扱う。再発時は `--reporter-by codex-reporter` へ切り替えて実行を継続する                                   |
| 依存事項 | PJR-Q828（reporter の再評価手段）と同じ reporter 段階を扱うため、実装が重なる場合は順序を調整する                                                                                    |
| 完了条件 | 失敗の再現条件と原因が特定され、本個票に記録されている。原因が SpecDojo 側にある場合は修正方針が判断できる状態になっている。修正そのものは本個票の範囲に含めず、必要なら別途起票する |

## 4. 対応結果

- PJR-K4TA と PJR-JT1Y の保存済み plan / evidence を比較した。入力はそれぞれ約28 KiB（plan 約11 KiB、evidence 約17 KiB）と約26 KiB（plan 約11 KiB、evidence 約15 KiB）で、変更一覧は78件と59件だった。いずれも JSON として読み込め、`diff_summary` などの可変長項目には既定の上限が適用されていた。
- `.specdojo/claude/settings.report.json` と共通 `.claude/settings.json` は現在と両実行の成果コミット（`5a2e9011`、`03aa42e0`）で JSON として妥当だった。reporter command も両実行で同一であり、変更一覧の件数が settings の解決結果を変える経路はない。
- SpecDojo が reporter の stdout を解析できない場合の診断は `response is not a single JSON value: ...` である。記録された文言は `agent exited with non-zero code: "... is not valid JSON` で接頭辞が異なるため、SpecDojo の出力解析の失敗ではなく、claude CLI 自身が非ゼロ終了したことによる。この点は裏付けられた。

### 訂正（オーケストレーターによる再検証）

初回の調査では「実行環境側の credentials JSON が不正だった」と結論づけたが、これは誤りである。以下の再検証により訂正する。

- `"... is not valid JSON` は Node.js が `JSON.parse` 失敗時に出力する標準形式であり、認証情報の読み込み失敗に固有の診断ではない。`node -e 'JSON.parse("this is a long non-json string here")'` は `Unexpected token 'h', "this is a l"... is not valid JSON` を出力する。`"..."` は Node が入力を切り詰めた跡である。したがって、この文言から「パース対象が credentials である」とは導けない。
- claude-reporter を最小プロンプト（約30 B）と失敗時と同規模のプロンプト（約22 KiB）で直接起動したところ、いずれも exit 0 で正常に応答した。認証情報は壊れておらず、入力サイズも要因ではない。
- オーケストレーター自身が claude として動作し続けている状態で claude-reporter だけが認証に失敗する、という当初の説明は整合しない。
- 失敗した2回の実行の stderr ログには当該メッセージが記録されておらず、残っていたのは stdout の切り詰められた要約行のみであった。初回の調査は生の出力を確認できないまま推論しており、結論の根拠が不足していた。

### 現時点の判定

| 判定 | 内容                                                                  |
| ---- | --------------------------------------------------------------------- |
| 確実 | claude CLI（Node プロセス）内で `JSON.parse` が失敗し、非ゼロ終了した |
| 確実 | SpecDojo の reporter 出力解析の失敗ではない                           |
| 確実 | 現在は再現しない。入力サイズは要因ではない                            |
| 不明 | パース対象が何だったか（認証情報・設定・ストリーム応答のいずれか）    |

6回連続で失敗した後、現在は正常に動作する。間に何が変わったかは特定できていない。一過性の事象であった可能性が高いが、断定はできない。再発時に原因を追えるよう、生の stderr を保全する仕組みを PJR-KAQV で整備する。

## 5. 関連ドキュメント

- 1回目の発生: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 2回目の発生: [[prj-0001:pjr-jt1y-kata-undecided-state|PJR-JT1Y 実践の型の要否に未判断の状態を追加]]
- 同じ reporter 段階の課題: [[prj-0001:pjr-q828-reporter-revalidation|PJR-Q828 reporterの再評価]]
- 実行ログ: `logs/exec-register-PJR-K4TA.stderr.log`、`logs/exec-register-PJR-JT1Y.stderr.log`
- 生ログ保全の整備: [[prj-0001:pjr-kaqv-agent-raw-stderr-retention|PJR-KAQV agent失敗時の生のstderrを保全する]]
