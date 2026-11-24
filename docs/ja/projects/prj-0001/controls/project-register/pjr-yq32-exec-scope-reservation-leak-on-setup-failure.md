---
specdojo:
  id: prj-0001:pjr-yq32-exec-scope-reservation-leak-on-setup-failure
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T04:56:14Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0JVB
  commit_type: fix
  commit_scope: exec
---

# PJR-YQ32 準備の段で失敗した run が変更範囲の予約を blocked のまま残す

## 1. 課題内容

朝の cycle で人の確定の 13 件が予約を残し、後の run が blocked by unintegrated で止まった。準備の段の失敗で予約を外し、古い予約を片付ける

## 2. 入力

- 利用者の決定（2026-11-23）: オーケストレーターの推奨どおり起票する
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 影響範囲

| 観点         | 影響                                                                  |
| ------------ | --------------------------------------------------------------------- |
| スコープ     | runner の変更範囲予約、単体テスト、設計・運用ガイド・CLI リファレンス |
| スケジュール | v0.10.0 に含め、統合後の smoke を経て close する                      |
| コスト       | 追加サービスなし。予約回収時に状態と worktree を照合する              |
| 品質         | 準備失敗による後続の停止を防ぎ、未統合成果の保護を維持する            |
| 関係者       | DEV が修正し、orchestrator が統合後の smoke を確認する                |

## 4. 対応方針

| 項目     | 内容                                                                                                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 準備の段（plan の生成など）で失敗したタスクの変更範囲の予約が blocked のまま残り、片付けは終わった項目しか対象にしない（PJR-B6NS） |
| 対応策   | 準備の段の失敗で予約を外し、todo のまま worktree も lock もない古い予約を片付ける                                                  |
| 依存事項 | なし                                                                                                                               |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                                       |

- `exec run`（`--auto`・`exec cycle` を含む）が準備の段（plan の生成など）で失敗したとき、そのタスクの変更範囲の予約（`exec/.locks/change-scopes/`）を `blocked` のまま残さず外す。2026-11-23 の朝の cycle で、第 3 波の人の確定の 13 件が予約を残し、後の `exec run --register PJR-E73Z` が「blocked by unintegrated」で止まった（オーケストレーターが 13 件を手で消した）。
- worktree も lock もなく、状態が todo のままのタスクの古い予約を、次の予約の判定で片付ける（PJR-B6NS の終わった項目の片付けと同じ考え方）。
- 単体テストを足す（準備の段の失敗で予約が残らないこと、古い予約が片付くこと）。
- 関連する設計・ガイド・CLI リファレンスを直す。
- runner の動きを変える場合は、統合の後に orchestrator が `exec smoke` を流して確かめてから close する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。

## 5. 対応結果

### 5.1. 作業内容

| 作業                           | 状態 | メモ                                                                                                                        |
| ------------------------------ | ---- | --------------------------------------------------------------------------------------------------------------------------- |
| 準備失敗時の予約解放           | done | schedule の準備失敗は同じ run 内の待ち合わせを保って終了時に解放し、provider 待機と register の準備失敗は直ちに解放する     |
| 古い予約の回収                 | done | 未着手で exec worktree と予約 lock のない予約を、照合 mutex 内で回収する                                                    |
| 回帰テスト追加                 | done | 準備失敗、既存予約復元、古い予約回収、worktree・lock・実行中状態の保護に加え、同一 run の待機と次の run の実行を検査する    |
| 設計・ガイド・CLI リファレンス | done | 失敗時の境界と自動回収条件を更新した                                                                                        |
| 統合後の smoke                 | open | executor sandbox では実 agent CLI を起動しない。統合後に orchestrator が `exec smoke` を流し、成功を確認してから close する |

### 5.2. 判断と対応

- 準備完了を境界に、新規予約の取り消しと実行後の未統合予約の保持を分けた。再実行の準備失敗では取得前の予約を復元し、既存 worktree がある register run の失敗も予約を保持する。既存成果の保護を優先するためである。
- 再開指示に従い、schedule の準備失敗時は同じ run 内の scope barrier を保ち、worker pool 終了時の `finally` で予約を取り消す。失敗直後に解放すると `--unknown-scope serialize` の後続まで準備してしまうためである。既存テストの期待は変えず、失敗戻り値・例外と loop 有無の組合せで、同じ run 内の待機、終了後の予約・lock 不在、次の run での実行を検査する。
- 回収対象の未着手状態は schedule の `todo` と register の `open` とした。register には `todo` 状態がなく、`todo` は項目種別だからである。schedule は生成済みキャッシュではなく event と strategy の初期状態から判定する。予約ディレクトリは共用のため、どちらの実行経路からも両種の未着手予約を判定・回収する。
- 古さの時間閾値は設けず、未着手・worktree 不在・予約 lock 不在がそろうことを回収の根拠とした。heartbeat が止まった lock も、不在とは扱わない。状態または worktree を確認できない場合も予約を保持する。
- 保護された設定、登録簿の状態、`CHANGELOG.md`、result、grade サイドカーは変更していない。

### 5.3. 検証

Prettier、hook の catalog 検証（`node --import tsx tools/catalog-validate-if-configured.mjs`）、`npm run validate:history-links`、`npm run check:src-imports`、`register build --project prj-0001`、`git diff --check` は成功した。catalog は対象外の既存参照に警告を出したが、エラーはなかった。

前回の親検証では `track-filter.test.ts` の準備失敗時の待ち合わせテストが失敗した。今回、その原因となった解放時点を修正した。親 runner が `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と設定済みの共通検証を再実行するため、executor では重複実行しない。単体テストの実行結果は親 runner の evidence を参照する。統合後の実動作確認は 5.1 の smoke として引き継ぐ。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正（v0.10.0）
- 文案: `exec run`（`--auto`・`exec cycle` を含む）の準備失敗で変更範囲の予約が残って後続を止める問題を修正。未着手で worktree と予約 lock のない古い予約も自動で回収する。

## 6. 関連ドキュメント

- [[specdojo:exec-operation-guide|exec 運用ガイド]]
- [[specdojo:command-reference|CLI コマンドリファレンス]]
- [[prj-0001:pjr-b6ns-reject-leaves-change-scope-reservation|終端項目の予約回収（PJR-B6NS）]]
