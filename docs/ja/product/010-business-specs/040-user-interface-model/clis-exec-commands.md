---
specdojo:
  id: clis-exec-commands
  type: ui
  status: draft
  rulebook: specdojo:clis-rulebook
  based_on: []
---

# CLI仕様（exec コマンド群）

## 1. 概要

`specdojo exec` は、作業指示の準備、人・AI Agent による実行、進捗の確認、中断後の再開をつなぐコマンド群である。作業結果と判断の記録を残し、別の参加者が続きを引き継げるようにする。

## 2. 利用目的と対象ユーザー

- **作業を管理する人**: 対象・担当・完了条件を確認し、着手可能な作業を選んで進捗と障害を共有する。
- **開発者・AI Agent 活用担当**: plan に従って編集またはレビューを実行し、成果物と検証結果を受け渡す。
- **レビュー担当・品質保証担当**: result と evidence から完了条件の充足、失敗理由、追加対応を確認する。
- **成果物を確定する人**: 最終判断を記録し、成果物の `status` を `ready` に昇格する。agent による昇格は禁止する。

対象は exec 配下の準備・実行・状態記録・隔離・回復操作とする。登録簿の起票と完了判断、schedule の設計、定期起動の設定は、それぞれの管理コマンドへ引き渡す。実行経路の責務は [[specdojo:exec-operation-guide|exec運用ガイド]]、外部 agent の設定は [[specdojo:exec-config-guide|exec設定ガイド]] を正本とする。

## 3. 操作の流れ

1. **対象と前提を確認する**: `exec where` で対象 project の保存先、`exec status` で実行中・停止中の schedule task を確認する。`exec validate` で schedule・event・実行記録の不整合を確認し、`exec refresh` で Ready と進捗表示を更新する。
2. **指示を準備する**: 内容を先に確認する場合は `exec plan` で plan を生成する。schedule task、カタログの成果物、登録簿項目から対象を一つ選ぶ。plan 生成だけでは着手や完了を記録しない。
3. **作業の出どころに応じて実行する**:
   - 登録簿項目は `exec run --register` で実行する。開始で `in-progress`、成功で `review`、失敗で `waiting` となる。項目の完了判断は登録簿で行う。統合後レビューによる自動 close を選ぶ場合は、その判定条件も確認する。
   - schedule task は `exec run --task` で指定するか、`exec run --auto` で Ready から選ぶ。worktree 実行と自動実行は状態追跡を伴い、成功時は成果を統合して `done`、失敗時は `blocked` として worktree を保持する。カレントでの単発実行は状態追跡を選んだ場合だけ進捗へ反映する。
   - 反復作業は `exec run --job` で入力を確定した Job Run として実行する。完了済みの schedule task の再実行とは分け、定期起動は routine から引き渡す。
   - human task は `exec claim` で作成される result を入口に人が作業する。agent の自動起動を前提にしない。
4. **成果と判断を確認する**: result、検証結果、差分を確認する。レビューは `mode: review` の task として実行し、成果物の修正が必要なら edit 作業へ戻す。schedule の `done` と成果物の `ready` は別の判断とする。
5. **次の作業へ引き渡す**: `exec refresh` で後続の Ready を更新する。手動の状態追跡では、作業開始を `claim`、完了を `complete`、障害を `block` で記録する。runner が状態を記録する経路では runner に任せる。

段階ごとに隔離実行を確認する場合は、claim 後に `exec worktree prepare` → `agent` → `commit` → `merge` → `remove` と進める。分割コマンドは `claim`・`complete`・`block` を暗黙に記録しないため、完了または障害の記録は別途必須とする。詳細は [[specdojo:exec-worktree-guide|exec worktree運用ガイド]] を参照する。

中断した同じ試行は、保存済みの run と worktree を確認して再開する。schedule は `exec resume`、登録簿の worktree 実行は `exec run --register` の再開経路を使う。完了判断の訂正は人が `exec reopen` で `done` から `todo` へ戻す。追加作業は新しい task として扱う。

## 4. 操作とコマンド参照

構文・引数・オプションの正本は [[specdojo:command-reference|CLIコマンドリファレンス]] の「exec」「exec worktree」とする。

| 操作                           | 対象コマンド                                    | 利用目的・操作の意味                                                                  | 正本リファレンス                                                          |
| ------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 保存先・状況確認               | `exec where` / `exec status`                    | 解決されたパスと、状態・actor で絞った schedule task を確認する                       | [[specdojo:command-reference#7-exec\|exec]]                               |
| 検証・再計算                   | `exec validate` / `exec refresh`                | 前提を検証し、event に基づく進捗と Ready を再生成する                                 | [[specdojo:command-reference#7-exec\|exec]]                               |
| plan の準備・保管              | `exec plan` / `exec archive`                    | 指示を生成し、完了後の plan を同じ run に保持する。削除を選ぶ場合は対象を確認する     | [[specdojo:command-reference#7-exec\|exec]]                               |
| 次の作業を確保                 | `exec scheduler` / `exec claim`                 | 担当ロールに合う着手可能な作業を選ぶ、または指定 task の着手を記録する                | [[specdojo:command-reference#7-exec\|exec]]                               |
| 実行                           | `exec run`                                      | plan に従って編集・レビューを行い、結果を記録する                                     | [[specdojo:command-reference#7-exec\|exec]]                               |
| 完了・完了訂正                 | `exec complete` / `exec reopen`                 | 完了を記録し、誤った完了判断は履歴を残して訂正する                                    | [[specdojo:command-reference#7-exec\|exec]]                               |
| 障害・再着手・中止             | `exec block` / `unblock` / `release` / `cancel` | 停止理由を共有する。同じ試行の継続、未着手への戻し、恒久中止を使い分ける              | [[specdojo:command-reference#7-exec\|exec]]                               |
| 補足記録                       | `exec note` / `exec link` / `exec estimate`     | 判断メモ、参照先、見積もりを event として残す                                         | [[specdojo:command-reference#7-exec\|exec]]                               |
| 再開・連続運転                 | `exec resume` / `exec cycle` / `exec slots`     | 保存済み作業を再開し、定期的な再計算・自動実行や共有枠の確認を行う                    | [[specdojo:command-reference#7-exec\|exec]]                               |
| 段階的な隔離実行               | `exec worktree`                                 | 準備、実行、差分確認、commit、統合、撤去を段階ごとに行う                              | [[specdojo:command-reference#9-exec-worktree\|exec worktree]]             |
| 比較試行                       | `exec trial`                                    | 同じ plan を複数 agent で試し、評価後に採用・破棄を判断する。通常の進捗とは分けて扱う | [[specdojo:command-reference#71-agent比較trial\|agent比較trial]]          |
| 設定の準備・保護設定の引き継ぎ | `exec scaffold` / `exec handoff`                | レビュー観点の差分雛形を準備し、保護設定の提案は人が差分を確認して適用する            | [[specdojo:command-reference#7-exec\|exec]]                               |
| 旧記録の移行                   | `exec migrate-records`                          | 必要な旧記録を現行の run 配置へ移す                                                   | [[specdojo:plan-result-lifecycle-guide\|plan/resultライフサイクルガイド]] |

## 5. 入力と出力の要点

### 5.1. 入力情報

| 種類                   | 対象・主な利用操作                                                     | 役割                                           | 正本の参照                                                                                                                                                                | ない／壊れている／届かないときの扱い                                                                                 |
| ---------------------- | ---------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| ファイル・環境変数     | project 設定、`SPECDOJO_PROJECT`、`SPECDOJO_OWNER`                     | 対象 project、保存先、担当を解決する           | [[specdojo:exec-config-guide\|exec設定ガイド]]、`specdojo-config.schema.yaml`                                                                                             | 解決できなければ「対象・担当の不整合」として設定・指定を確認する                                                     |
| ファイル               | schedule 定義と実行 event（`validate`・`refresh`・`status`・状態操作） | task の依存・担当・実行状態を判断する          | [[specdojo:sch-rulebook\|スケジュール作成ルール]]、[[sysd-cross-cutting-policy\|システム設計横断ルール]]                                                                  | 不整合は「schedule・event 不正」として停止し、正本を訂正する                                                         |
| ファイル               | 成果物カタログ・参照文書、登録簿個票（`plan`・`run`）                  | 対象、完了条件、根拠を確定する                 | [[specdojo:dct-rulebook\|成果物カタログ作成ルール]]、[[specdojo:pjr-rulebook\|プロジェクト登録簿作成ルール]]                                                              | 「対象・担当の不整合」として対象 ID と参照先を確認する                                                               |
| ファイル               | Job Definition と実行ごとの入力（`run`）                               | 反復可能な作業の内容と今回の実行単位を確定する | [[specdojo:exec-operation-guide\|exec運用ガイド]]、`job.schema.yaml`、`job-run.schema.yaml`                                                                               | 定義や入力が不正なら「指定不足・競合」「対象・担当の不整合」として修正する                                           |
| ファイル               | 人・agent の名簿、実行設定、レビュー観点                               | 操作権限と編集・レビューの担当を選ぶ           | [[specdojo:pm-members-rulebook\|メンバー定義ルール]]、[[specdojo:exec-config-guide\|exec設定ガイド]]、`agent-members.schema.yaml`                                         | 共通観点を使う設定では差分ファイルなしでも進む。actor や実行条件を満たせなければ「対象・担当の不整合」として停止する |
| ファイル               | plan、result、evidence、段の状態、残存 worktree（実行・再開）          | 作業範囲と既存成果、再開する段を引き継ぐ       | [[specdojo:plan-result-lifecycle-guide\|plan/resultライフサイクルガイド]]、`pipeline-state.schema.yaml`、`exec-evidence.schema.yaml`                                      | 初回は経路に応じて生成する。再開時の必須記録の欠落は「再開条件不足」として停止する                                   |
| 対話での入力           | 対象 ID、actor、理由、差分適用の確認                                   | 操作対象と判断責任、変更の意思を明示する       | [[specdojo:command-reference#7-exec\|exec]]                                                                                                                               | 対象選択や理由の不足は「指定不足・競合」として修正する。handoff の適用確認がなければ変更しない                       |
| 外部コマンドの実行結果 | agent の応答・終了状態、Git・検証の結果（実行・統合）                  | 成果と完了可否、再開すべき段を判断する         | [[specdojo:exec-operation-guide\|exec運用ガイド]]、[[specdojo:exec-worktree-guide\|exec worktree運用ガイド]]。外部 agent の連携契約は `ifx-cmd-ai-provider-cli`（未作成） | 「外部処理失敗・利用制限」「検証・統合失敗」として理由を記録し、保存済み成果を確認して回復する                       |

### 5.2. 出力情報

| 種類                 | 対象・主な利用操作                                                                                           | 役割                                                                                                                | 正本の参照                                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 標準出力             | `where` のパス、`status` の task・名称・最終操作 actor・日時、scheduler の選択結果／対象なし                 | 保存先と次に着手・回復する作業を確認する                                                                            | [[specdojo:command-reference#7-exec\|exec]]                                                                                                                                                          |
| 標準出力             | `OK:`・`WARN:`・`ERROR:` の検証結果、`Generated:`・`Written:`・`Skipped`・`Archived:`・`Deleted:` の処理結果 | 診断と生成・保持・削除の結果を確認する。検証の `ERROR:` も標準出力に現れる                                          | [[specdojo:command-reference#7-exec\|exec]]                                                                                                                                                          |
| 標準出力             | コマンド入口で扱う失敗メッセージ                                                                             | 失敗の原因を確認し、非 `0` の終了コードと併せて次の対応を判断する                                                   | [[specdojo:command-reference#7-exec\|exec]]                                                                                                                                                          |
| 作る／変えるファイル | plan、result、evidence、段の状態・ログ、対象成果物                                                           | 指示、実施内容、検証結果、次の担当への引き継ぎを残す                                                                | [[specdojo:plan-result-lifecycle-guide\|plan/resultライフサイクルガイド]]、`exec-plan-frontmatter.schema.yaml`、`exec-result-frontmatter.schema.yaml`、`exec-evidence.schema.yaml`                   |
| 作る／変えるファイル | 状態 event、登録簿の状態、Job Run 履歴、再生成する state・Ready・CPM・gantt-chart                            | 状態変更の根拠と進捗を共有する。`status` は schedule の event から状態を確認し、派生表示の更新には `refresh` を使う | [[sysd-cross-cutting-policy\|システム設計横断ルール]]、[[specdojo:schedule-operation-guide\|Schedule実行運用ガイド]]、[[specdojo:pjr-rulebook\|プロジェクト登録簿作成ルール]]、`job-run.schema.yaml` |
| 作る／変えるファイル | レビュー観点の差分雛形、provider 設定、比較試行の記録                                                        | 実行環境の準備と比較結果を保存する                                                                                  | [[specdojo:exec-config-guide\|exec設定ガイド]]、[[specdojo:command-reference#71-agent比較trial\|agent比較trial]]                                                                                     |
| 外部コマンドの起動   | agent への作業指示、Git への隔離・commit・統合操作、検証コマンド                                             | 指示に基づく処理を実行し、成果を共有先へ引き渡す                                                                    | [[specdojo:exec-worktree-guide\|exec worktree運用ガイド]]。外部 agent の連携契約は `ifx-cmd-ai-provider-cli`（未作成）                                                                               |

## 6. 終了コードとエラー表示・利用者の次の手

正常終了は `0`、コマンドの入力・検証・実行条件の不備は `1` として判断する。`exec worktree agent` は agent command の終了コードをそのまま返すため、その数値は [[specdojo:exec-worktree-guide|exec worktree運用ガイド]] に従う。終了コードだけで業務上の完了を判断せず、対象の状態と result を併せて確認する。

| 事象                                            | 終了コード                                           | 表示要点                                                             | 利用者の次の手                                                                                                                                                    |
| ----------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 正常な生成・記録・確認                          | `0`                                                  | 出力先、処理結果、対象の一覧                                         | 出力先と内容を確認し、第 3 章の次の操作へ進む                                                                                                                     |
| Ready や状態フィルターの該当 task なし          | `0`                                                  | `No ready task to claim.`、担当・mode に合う対象なし、`No ... tasks` | 作業は新規に確保されていない。依存 task、担当ロール、human task の有無を確認し、必要な作業後に `refresh` する                                                     |
| run の一部記録の欠落                            | 通常の検証は `0`、記録のみの厳格検証は `1`           | 通常は `WARN:`、厳格検証は `ERROR:` と対象パス                       | 未完了の実行か確認する。完了後の記録をそろえて再検証する。過去世代の除外条件は [[specdojo:plan-result-lifecycle-guide\|ライフサイクルガイド]] に従う              |
| 指定不足・競合                                  | `1`                                                  | plan は対象を一つ選ぶ必要がある、指定を併用できない                  | task・成果物・登録簿項目から対象を一つ選び、リファレンスに従って指定し直す                                                                                        |
| 対象・担当の不整合                              | `1`                                                  | project・成果物・actor が不明、担当や実行条件が不適合                | `where` と名簿・カタログ・設定を照合する。正しい ID と実行者を選び、無条件の強制操作で回避しない                                                                  |
| schedule・event 不正、記録配置・lock の除外不備 | `1`                                                  | 検証で対象パスと理由を表示                                           | 該当する正本または Git 除外設定を管理者が訂正する。`validate` が通ってから `refresh`・実行を再試行する                                                            |
| 状態遷移の拒否                                  | `1`                                                  | 着手・完了・再開の前提を満たさない、actor 不一致                     | `status` と event を確認し、担当者と状態を合わせる。完了判断の訂正は人が `reopen` の条件を確認する                                                                |
| 再開条件不足                                    | `1`                                                  | worktree・plan・evidence がない、再開段が不適合                      | 残存成果と最新 run の記録を確認する。同じ試行の再開か、新規のやり直しかを判断し、既存成果を確認する前に破棄しない                                                 |
| 外部処理失敗・利用制限                          | 異常は非 `0`。待機・延期・切替は選んだ運用方針による | 接続不能、起動失敗、利用制限、再開条件                               | 接続・実行環境を確認する。利用制限は待機・代替 agent・延期の設定に従い、再開時刻と保存済み run を確認する。agent 単体の終了コードを exec 全体へ一律に当てはめない |
| 検証・統合失敗、保護対象への変更                | 非 `0`                                               | 失敗した検査・段・対象パス、block 理由                               | result・evidence・ログと保持 worktree を確認して原因を解消し、該当段から再開する。保護設定は提案差分を人が確認し、handoff 経路で適用する                          |

`unblock` は障害解消後に同じ試行を継続する操作、`release` は `doing` / `blocked` を `todo` へ戻す操作、`cancel` は未着手の task を恒久中止する操作である。`release` に worktree の破棄を伴わせる場合は未 commit の成果も失われるため、先に `exec worktree status` で内容を確認する。回復の具体的な手順は [[specdojo:exec-operation-guide|exec運用ガイド]] の「中断・訂正・再実行」に従う。

## 7. メモ / 将来課題

- 全体構成の依存先 `clis-index` は未作成である。作成後に本書のスコープ・操作順・用語を照合し、索引からの導線と `based_on` を整える。
- 外部 agent の連携契約 `ifx-cmd-ai-provider-cli` は未作成である。作成後に第 5 章の入出力参照を接続する。
- 実装調査は exec のコマンド入口を対象とした。実行・統合・外部連携の内部経路と終了コードの全分岐は未確認であり、後続レビューで運用ガイドの期待動作と照合する。
