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
  completed_at: "2026-08-25T22:33:15Z"
  conclusion: "根本原因は Claude Code の既知の不具合で、~/.claude.json への並行書き込みが競合し不完全な内容を読んだプロセスで JSON.parse が失敗する。SpecDojo 側の問題ではない。issue #15608 や #40226 として報告されており、2.1.61 のホットフィックスは過剰な書き込みのみを対象とし根本の競合は未対応、2.1.86 で再報告された #40226 は closed as not planned のため修正の見込みがない。バージョンアップでは解決しない。適用範囲は reporter に限らず claude provider の agent 全般であり、実行時間の長い executor の方が競合に当たる機会は多い。回避策は、claude 系を使う実行中はオーケストレーターが待機するか、codex 系で統一することである。"
---

# PJR-E6HG claude-reporterがJSON解析失敗で再現性をもってブロックする

## 1. 課題内容

claude-reporter が PJR-K4TA で3回、PJR-JT1Y で3回、いずれも is not valid JSON を理由に失敗した。変更規模はそれぞれ79ファイルと61ファイルで、出力が長大になる条件で再現する疑いがある。設定ファイルはいずれも妥当な JSON であり、worktree にも存在することを確認済みである。現状 claude-reporter は reporter として使えず、codex-reporter への差し替えで回避している。原因を特定して解消する。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | claude provider の agent 全般。当初は reporter 段階のみと見ていたが、原因が共有設定ファイルの競合であるため executor 段階も対象となる |
| スケジュール | reporter が完了できないため register の遷移が止まり、代行記入と手動統合が必要になる                                                   |
| コスト       | 失敗のたびに3回の再試行が走り、実行時間と agent 利用量を消費する                                                                      |
| 品質         | 成果物の品質への直接の影響はない。ただし result が未記入のまま残り、実行記録としての価値が失われる                                    |
| 関係者       | pm-members.yaml で claude provider の agent を指定する全タスク（executor / reporter とも）                                            |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | Claude Code の既知の不具合。`~/.claude.json` への並行書き込みが競合し、不完全な内容を読んだプロセスで `JSON.parse` が失敗する。SpecDojo 側の問題ではない                             |
| 対応策   | Claude Code 側に修正の予定がないため回避策で運用する。claude provider の agent を使う実行中はオーケストレーターが待機し、効率を優先する場合は codex 系で統一する                     |
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

| 判定 | 内容                                                                                  |
| ---- | ------------------------------------------------------------------------------------- |
| 確実 | claude CLI（Node プロセス）内で `JSON.parse` が失敗し、非ゼロ終了した                 |
| 確実 | SpecDojo の reporter 出力解析の失敗ではない                                           |
| 確実 | 入力サイズは要因ではない（後述の再発でさらに裏付けられた）                            |
| 判明 | パース対象は `~/.claude.json`。並行書き込みの競合による（後述の根本原因の特定を参照） |

6回連続で失敗した後、直接起動では正常に動作した。この時点では一過性の事象であった可能性が高いと判断した。再発時に原因を追えるよう、生の stderr を保全する仕組みを PJR-KAQV で整備する。

### 追記（PJR-XGJK での再発）

本個票をクローズした後、PJR-XGJK の実行で同じ失敗が再発した。一過性ではない。あわせて入力サイズ説も明確に否定された。

| 実行     | reporter | evidence サイズ | 結果 |
| -------- | -------- | --------------- | ---- |
| PJR-K4TA | claude   | 17,078 B        | 失敗 |
| PJR-JT1Y | claude   | 15,126 B        | 失敗 |
| PJR-1Z1H | claude   | 17,889 B        | 成功 |
| PJR-XGJK | claude   | 23,674 B        | 失敗 |

最大サイズより小さい入力で失敗し、より大きい入力で成功している。次の要因も否定した。

- 認証情報の不正: 直接起動が3回とも正常終了する。
- worktree 環境: PJR-XGJK の worktree 内で直接起動しても正常終了する。
- 生ログ: 今回も stderr に当該メッセージは残らなかった。PJR-KAQV の必要性が改めて裏付けられた。

唯一データと矛盾しない仮説は、オーケストレーター（claude）が並行して作業していたかどうかとの相関である。成功した PJR-1Z1H の実行中、オーケストレーターは待機していた。失敗した3回はいずれも、個票の編集・`register add`・整形・テスト・コミットを並行して実行していた。親の claude セッションが書き換える JSON を、子プロセスの claude が途中状態で読んだ可能性がある。

### 追記（PJR-K9KG による仮説の検証）

仮説を検証するため、PJR-K9KG の実行中はオーケストレーターが進捗確認を含め一切のコマンドを実行せずに待機した。claude-reporter は正常に完了し、JSON 解析失敗は発生しなかった。

| 実行     | オーケストレーターの状態 | claude-reporter |
| -------- | ------------------------ | --------------- |
| PJR-K4TA | 並行作業                 | 失敗            |
| PJR-JT1Y | 並行作業                 | 失敗            |
| PJR-1Z1H | 待機                     | 成功            |
| PJR-XGJK | 並行作業                 | 失敗            |
| PJR-K9KG | 待機                     | 成功            |

5例すべてが仮説と整合する。待機した2回はいずれも成功し、並行作業した3回はいずれも失敗した。ただしこれは相関の観測であり、因果の証明ではない。どのファイルが競合しているかは特定できていない。

運用上の回避策として、claude-reporter を使う場合はオーケストレーターが実行中に待機する。確実性を優先する場合は codex-reporter を指定する。根本原因の特定には、引き続き PJR-KAQV による生ログの保全が前提となる。

### 追記（根本原因の特定）

利用者の指摘により Claude Code のバージョン起因を調査したところ、既知の不具合であることが判明した。仮説は裏付けられた。

- 原因は `~/.claude.json` への並行書き込みによる競合である。複数の Claude Code プロセスが同時に読み書きすると、書き込み途中の不完全な内容を別プロセスが読み、`JSON.parse` が失敗する。SpecDojo 側の問題ではない。
- 報告例は Anthropic の claude-code リポジトリの issue #15608、#28847、#29051、#40226 など多数ある。症状として記録されている `SyntaxError: Unexpected token 'C', "Claude con"... is not valid JSON` は、本項目で観測した文言と同じ形式である。
- 2.1.61 で「過剰な書き込み」を減らすホットフィックスが入ったが、根本の競合は対象外と明言されている。その後 2.1.86 で再報告された issue #40226 は **closed as not planned** であり、修正の予定がない。
- 本環境は 2.1.226 であり 2.1.61 の修正を含む。最新の 2.1.245 へ更新しても、2.1.86 で再現し対応しないと判断された問題であるため解決は見込めない。
- 適用範囲は reporter に限らない。`~/.claude.json` は claude provider のプロセス全体で共有されるため、**claude-expert-executor などの executor も同じ競合の対象**である。executor は実行時間が10〜25分と reporter の10倍近く長いため、競合に当たる機会はむしろ多い。executor が失敗すると成果物そのものが失われる点で影響も大きい。

### 確定した運用方針

| 構成                             | 並行作業                         |
| -------------------------------- | -------------------------------- |
| executor・reporter とも codex 系 | 可                               |
| reporter が claude 系            | **不可**                         |
| executor が claude 系            | **不可**（10〜25分の待機が必要） |

効率を優先する場合は codex 系で統一する。claude 系を使う場合、オーケストレーターはその実行中に一切のコマンドを実行しない。issue の報告者が採った回避策もセマフォによる直列化であり、同じ考え方である。

## 5. 関連ドキュメント

- 1回目の発生: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 2回目の発生: [[prj-0001:pjr-jt1y-kata-undecided-state|PJR-JT1Y 実践の型の要否に未判断の状態を追加]]
- 同じ reporter 段階の課題: [[prj-0001:pjr-q828-reporter-revalidation|PJR-Q828 reporterの再評価]]
- 実行ログ: `logs/exec-register-PJR-K4TA.stderr.log`、`logs/exec-register-PJR-JT1Y.stderr.log`
- 生ログ保全の整備: [[prj-0001:pjr-kaqv-agent-raw-stderr-retention|PJR-KAQV agent失敗時の生のstderrを保全する]]
- 根本原因の出典（並行実行による設定ファイル破損）: `https://github.com/anthropics/claude-code/issues/15608`
- 同（レースコンディション、closed as not planned）: `https://github.com/anthropics/claude-code/issues/40226`
- 同（非アトミックな書き込み）: `https://github.com/anthropics/claude-code/issues/29051`
