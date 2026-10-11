---
specdojo:
  id: prj-0001:pjr-2gfh-exec-handoff-clarity
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-09T11:49:21Z"
  completed_at: "2026-10-09T12:32:13Z"
  conclusion: runner の適用外の判定と、executor が変えた runner 管理の記録を reporter の入力（runner_context）へ渡し、矛盾した申し送りと不要な確認依頼を止めた。引数付きの npm run も not_applicable の反証の対象にした。
---

# PJR-2GFH 公開物の試用で見えた申し送りと反証の細かな問題

## 1. 課題内容

2026-10-09 の公開物の試用で、(1) reporter が runner の適用外の判定と矛盾する申し送り（catalog validate を実行せよ）を書く、(2) claude の executor が個票を更新したと報告し、変更の一覧に出ないため毎回確認の申し送りが付く、(3) 引数付きの npm run が適用外の申告の反証から漏れる、の 3 点を観測した。

## 2. 影響範囲

| 観点         | 影響                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------- |
| スコープ     | reporter へ渡す事実（`evidenceForReporter` など）、result の申し送りの生成、`not_applicable` の反証 |
| スケジュール | v0.3.0 の公開前に直すと、公開物の利用者が最初に読む申し送りが分かりやすくなる                       |
| コスト       | 不要な確認の申し送りを人が読み解く手間                                                              |
| 品質         | 申し送りに矛盾や誤った確認依頼が残る                                                                |
| 関係者       | exec を使う利用者                                                                                   |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | (1) runner の機械の適用外の判定（PJR-755T）が reporter の入力に含まれない。(2) 個票などの runner 管理の記録は変更の一覧から除くため、executor が個票を更新したと報告すると reporter が食い違いとして扱う。(3) 反証の script 名の読み取りが `npm run <name>` の完全一致だけを対象にしている |
| 対応策   | 下記の「完了条件の詳細」のとおり                                                                                                                                                                                                                                                           |
| 依存事項 | PJR-A0NE、PJR-755T                                                                                                                                                                                                                                                                         |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                                                                                                                                                                           |

### 3.1. 完了条件の詳細

- (1) runner が機械的に適用外と判定した検証を、reporter の入力（evidence の要約など）に含め、reporter の指示に「runner が適用外と判定した検証の実行を申し送りで求めない」ことを加える。runner が自動で付ける「適用外の検証（runner の判定）」の申し送りは保つ。
- (2) executor が runner 管理の記録（当該の個票の作業内容・対応結果など）を変更した場合、その事実を reporter の入力に含め、「変更の一覧に個票がない」ことを理由にした確認の申し送りが出ないようにする。runner 管理の記録を変更の一覧（`changed_files`）から除く扱いは変えない。
- (3) `npm run <name> -- <args>` や `npm run <name> <args>` の形でも script 名を読み取り、script が存在すれば `not_applicable` の申告を反証する。委譲した検証の判定（PJR-979N・PJR-SDWF）で引数付きの形をどう扱っているかと矛盾しないようにする。
- unit test で (1)〜(3) をそれぞれ確かめる。
- CHANGELOG の v0.3.0 の該当する項目に追記する。
- `npm run check` が通る。

## 4. 対応結果

- reporter 専用の bounded evidence に `runner_context` を追加し、runner が機械的に適用外と判断した検証と、executor の試行中に変更された runner 管理記録を渡すようにした。reporter の指示では、前者の実行を申し送りで求めず、後者が `changed_files` にないことだけを理由に確認を求めないよう明記した。runner が result に自動追記する「適用外の検証（runner の判定）」は維持している。
- npm script の適用条件確認では `npm run <name> -- <args>` と `npm run <name> <args>` から `<name>` を抽出し、存在する script の `not_applicable` 申告を反証するようにした。委譲・合成コマンドの判定では従来の完全一致を保ち、引数付きコマンドを引数なしの親検証と同一視しない。
- 成功した executor でも開始前との差分を `attempt_changes` に保存するようにし、`tests/src/exec-reporter.test.ts` と `tests/src/exec-register-pipeline-e2e.integration.test.ts` で reporter 入力、指示文、機械判定、試行差分の記録を検証するようにした。検証は executor と親 runner の分担に従い、親 runner 対象外の検査を executor で、unit test などの固定許可リスト検証を親 runner で実行する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]（公開の判定基準）
