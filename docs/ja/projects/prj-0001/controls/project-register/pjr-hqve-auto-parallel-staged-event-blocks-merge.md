---
specdojo:
  id: prj-0001:pjr-hqve-auto-parallel-staged-event-blocks-merge
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  registered_at: "2026-11-05T15:55:21Z"
  completed_at: "2026-11-08T00:38:28Z"
  conclusion: register --commit が開始前の dirty を除いた全体の差分を stage していたため、並行して書かれた block の event を巻き込んでいた。操作が変えるパスだけを stage し、中断時も自分の stage を外す形に直し、統合の前に無関係な stage があれば対象と直し方を示して止まるようにした
  derived_from:
    - PJR-3APD
---

# PJR-HQVE schedule の --auto --parallel の統合が、index に残った記録のファイルで止まる

## 1. 課題内容

stsd-pilot の schedule を --auto --parallel 2 で流している間に、block の event ファイルが commit されずに index に載ったまま残り、別のタスクの統合の git merge が「local changes would be overwritten」で止まった。原因を調べ、統合が止まらないようにする

## 2. 入力

- 2026-11-05 13:07 に T-STSD-PILOT-stsd-register-entry-070 が block され、その block の event ファイルが index に追加（A）されたまま残った。13:14 の T-STSD-PILOT-stsd-routine-run-070 の統合の git merge が、このファイルを理由に止まった（integrate.log）。index から外すと統合できた
- 同じ時間帯に orchestrator が register add --commit を続けて実行していた（10 件の起票）。そのうち 1 件は利用者の中断で commit の前に止まり、自分の 2 ファイルを index に載せたまま残した。どちらが block の event を index に載せたかは確かめていない
- schedule の --auto で流したタスクの claim・complete・block の event は、統合の後も作業ツリーに untracked のまま残り、orchestrator が手で commit している（exec(schedule): ... を記録する）

## 3. 影響範囲

| 観点         | 影響                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| スコープ     | schedule の `--auto --parallel` と register の `--commit` を同じ時間帯に使うと、統合の `git merge` が止まる |
| スケジュール | 止まった run は人が index から外すまで統合されず、業務仕様の代表を schedule で並べて流す前に直す必要がある  |
| コスト       | 止まるたびに、原因のファイルを探して index から外し、`--resume` する手間がかかる                            |
| 品質         | index に残ったファイルが、無関係な commit に混ざるおそれがある                                              |
| 関係者       | runner を使う orchestrator と利用者                                                                         |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `register --commit` が開始後に増えた差分を対象にするため、並行して作られた exec event を巻き込める。シグナル中断時の stage 解除もなかった。実事象の stage 実行元は記録不足で断定できない |
| 対応策   | register の更新対象を明示したパスに限定し、失敗・中断時に自分の stage を解除する。統合先に stage が残る場合は、merge 前に対象パスと復旧手順を示して停止する                              |
| 依存事項 | runner の変更のため、統合の後に JSEY の手順で実際の `exec run --register` を 1 回流して確かめる                                                                                          |
| 完了条件 | 下の一覧のとおり                                                                                                                                                                         |

完了条件:

- どの処理が event のファイルを index に残したかを、コードと再現で特定し、個票の対応結果に書いている。特定できない場合はその理由を書いている。pipeline では報告の `handoff` にも書く。
- 統合の前に、統合と関係のない index の変更があっても merge が止まらない。または、止まる場合は対象のファイルと直し方を示すメッセージで止まる。どちらにするかは executor が決め、理由を個票の対応結果と報告の `handoff` に書いている。
- index にファイルを残した処理が、失敗したときや中断されたときに、自分が stage したファイルを index から外す。
- 上の 2 つを再現する統合テストを足している。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証 `test-integration` も通る。
- CHANGELOG は未公開の版の節にだけ書き、公開済みの版の節を変えていない。
- schedule の `--auto` の event が統合の後も untracked で残る件は、この項目の範囲の外とする。

## 5. 対応結果

- 原因調査: `src/exec/core.ts` の block 記帳と `src/exec/events.ts` の `writeEventFile` はファイルを書くだけで stage しない。一方、`src/register/register.ts` の `commitRegisterMutation` は開始前の dirty パスを除いたリポジトリ全体の差分を stage していた。この間に別プロセスが作った block event も対象になり、シグナルで終了すると例外時の解除を通らず index に残り得た。2026-11-05 の `integrate.log` は当該 event による失敗を示すが、stage を行ったコマンドや中断との前後関係は保存されていないため、実事象の実行元までは断定しない。
- 修正: 各 register 操作が書き込み前に検査する対象パスを commit の許可集合として使う。個票・register event・改題や再採番の参照文書を含め、並行して増えた exec event は除外する。`SIGINT`・`SIGTERM`・`SIGHUP` は Git が戻った時点で検知し、通常の失敗と同じ対象限定の解除を行う。既存の staged 変更と作業ツリーの本文は保持する。
- 統合の選択: 無関係な stage を自動解除・commit すると、別の操作が所有する index を変えてしまうため、明示的な停止を採用した。プロジェクト・プロダクト統合先の事前検査と merge 直前に、重複しないパスも含めて検出する。停止メッセージに worktree、対象パス、`git restore --staged -- <path>`、commit 後または stage 解除後の再開手順を示す。root の記帳複製を解放する前に停止し、dry-run にも適用する。
- 再現テスト: `tests/src/register/commit.integration.test.ts` に、記帳中に block event を作る成功・hook 拒否のケース、3 種のシグナル中断、改題・再採番時の参照更新を追加した。`tests/src/exec/worktree-ops.integration.test.ts` は別タスクの staged event と部分 stage を保持した停止、解除後の統合を確認する。`tests/src/exec/task-repos.integration.test.ts` はいずれかの統合先に stage があると全リポジトリの統合前に停止することを確認する。
- 検証: Prettier 整形、`register build --project prj-0001`、`validate:history-links`、hook と同じカタログ検査、`git diff --check` は成功。カタログ検査は未変更の参照先の欠落・re-export に関する警告を出すが、終了コードは 0。型検査・各 lint・unit/integration test・schema 検査は pipeline 指定に従い親 runner が実行する。
- 申し送り: 統合後、[[prj-0001:pm-orchestrator-playbook|運用メモ]] の 5.1 に従い [[prj-0001:pjr-jsey-exec-run-split-smoke|PJR-JSEY]] の対象に本件を追加し、実際の `exec run --register` を `claude-executor` で 1 回流してから close する。実 agent CLI の起動は sandbox 外で行う。schedule の event が untracked で残る件は範囲外。捕捉できない強制終了では自動解除を保証できないが、残った stage は統合前の検査で案内する。

## 6. 関連ドキュメント

- [[specdojo:register-operation-guide|登録簿運用ガイド]]
- [[specdojo:schedule-operation-guide|Schedule 実行運用ガイド]]
- [[specdojo:exec-worktree-guide|Exec Worktree 運用ガイド]]
