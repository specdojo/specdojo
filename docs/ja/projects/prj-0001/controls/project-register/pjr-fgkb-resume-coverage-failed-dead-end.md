---
specdojo:
  id: prj-0001:pjr-fgkb-resume-coverage-failed-dead-end
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-21T09:02:58Z"
---

# PJR-FGKB 再開時の対象の検証に失敗すると executor が failed になり、作業を捨てる --force-restart しか残らない

## 1. 課題内容

未完了の試行がうっかり作ったファイル（出力先を誤った build の生成物など）が attempt_changes に入り、再開時の target coverage の下限になる。そのファイルを消しても下限から外せず、executor が報告しきれないと runner は executor を failed にする。failed は --resume でも --resume-from executor でも再開できず、worktree を捨てる --force-restart しか残らないため、確かめ済みで commit 前の編集を失う。下限から不要な対象を外す手段か、failed からの再開経路を用意する

## 2. 入力

- 発端は利用者のプロジェクト coderdojo-lessons-specdojo の prj-0001:PJR-AF5N（SpecDojo 0.9.2、2026-11-21）。
- opus-executor の試行で、npx slidev build の --out がスライドのディレクトリ基準で解決され、プロダクトリポジトリに未追跡の build 生成物（数十ファイル）ができた。executor は削除を許されず incomplete で終わり、その evidence の `attempt_changes` に生成物が入った。
- orchestrator が生成物を削除して --resume --resume-from executor で再開した。executor は個票の記録だけを直して complete と報告したが、下限の生成物の一部しか `target_coverage` に書かなかったため、validateResumedTargetCoverage が「did not account for every plan target」で失敗し、executor の段が failed になった。
- 次の --resume --resume-from executor は「executor stage is failed …; re-run the item instead」で拒まれた。残る経路は worktree と未 commit の変更を捨てる --force-restart だけだった。利用者のプロジェクトでは、orchestrator が差分を控えて feature ブランチに手で当て、統合した。
- 関連：[[prj-0001:pjr-ppyf-register-targets-from-first-attempt]]（最初の試行の `attempt_changes` を下限にした項目。下限に漏れがあれば failed にするのはこの仕様）。

## 3. 影響範囲

| 観点         | 影響                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| スコープ     | `exec run --register --resume --resume-from executor` の再開時の対象の検証と、executor の段の失敗の扱い |
| スケジュール | なし（回避策: 差分を控えて手で当てる）                                                                  |
| コスト       | 小さい（runner と CLI の一部の修正）                                                                    |
| 品質         | 確かめ済みで commit 前の作業を `--force-restart` で失う                                                 |
| 関係者       | 利用者のプロジェクト（coderdojo-lessons-specdojo など）と prj-0001 のオーケストレーター                 |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 最初の試行の `attempt_changes` が再開時の `target_coverage` の下限になり（PJR-PPYF）、試行がうっかり作って後で消されたファイルも下限に残る。`validateResumedTargetCoverage` に落ちると executor の段が failed になり、failed は `--resume` でも `--resume-from executor` でも再開できない                                             |
| 対応策   | 利用者の決定（2026-11-21、indie）で A+B とする。A: 再開時の対象の検証に落ちたときは failed にせず、項目を waiting にして `block_reason` に足りない対象を書き、`--resume --resume-from executor` で再開できるようにする。B: 下限のファイルが作業ツリーになく、統合先との差分にもないときは、下限から外し、外したことを evidence に残す |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                  |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                                                                                                                                                                                                                                          |

- 前の試行が作って消されたファイルは、再開時の検証の下限から外れ、外したことが evidence に残る（テストで確かめる）。
- 再開時の対象の検証に落ちると、項目が waiting になり、足りない対象が `block_reason` に残る。その後 `--resume --resume-from executor` で再開できる（テストで確かめる）。
- `exec-operation-guide` の再開の節を直す。
- runner の動きを変えるため、統合の後に実際の `exec run --register` を 1 回流して確かめる（オーケストレーターが行う）。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分（追加・変更・不具合修正など）と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

- A（failed にしない）: 再開時の対象の検証（`resumedTargetCoverageFailure`）に落ちたとき、evidence のプロセスの結果は `succeeded` のまま `completion_status: incomplete` にし、足りない対象と再開コマンドを `block_reason` に書くようにした。executor の段は `failed` でなく `blocked` になり、register 項目は `waiting` に戻る。再開の判定は未完了の報告を executor の再開対象にするため、`--resume --resume-from executor` で同じ worktree のまま再開できる。schedule の経路（`specdojo exec resume --task <id> --resume-from executor`）も同じ扱いにした。
- 同じ run を再開すると `evidence.json` が上書きされ、最初の試行の `attempt_changes`（下限）が失われて 2 回目の再開で検証が素通りする問題が A の確認中に見つかった。退避済みの `evidence.attempt-<n>.json` を試行順に読み、最初の未完了の試行を下限に使うようにした。
- B（消えたファイルを下限から外す）: plan が `targets` を宣言せず下限を使うとき、下限のパスが作業ツリーになく累積 worktree 差分（git status）にもなければ、runner が下限から外し、evidence の `excluded_coverage_targets`（schema に追加）に対象と理由を残すようにした。宣言された `targets` は外さない。`<repo>:<path>` はそのプロダクト worktree で判定する。
- テスト: 統合テストで、下限を申告しない再開が `blocked`・`waiting` になり `block_reason` に対象が残ること、続く `--resume --resume-from executor` が拒まれず再開されること、最初の試行の生成物を消して再開すると下限から外れて `review` まで進み `excluded_coverage_targets` に残ることを確かめた。単体テストで、退避済み evidence の読み込みと下限の選択、未完了への記録、宣言済み `targets` を外さないことを確かめた。
- [[specdojo:exec-operation-guide]] の「register実行の再開」の節を直した。
- 残り: runner の動きを変えたため、統合の後に実際の `exec run --register` を 1 回流して確かめる（オーケストレーターが行う）。
- 判断（_ASSUMPTION_）: 「統合先との差分にもない」は、作業ツリーにファイルがなく git status にも出ないこと（HEAD にも無いこと）で判定した。task ブランチの commit で消したファイルは対象外になるが、worktree 実行では commit が統合の時だけに作られるため、実害はないと判断した。

### 5.1. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: `exec run --register --resume` で executor が下限の対象を申告しきれなかったとき、executor の段を failed にせず blocked（項目は waiting）にし、`--resume --resume-from executor` で作業を捨てずに再開できるようにした。以前の試行が作って再開前に消されたファイルは下限から外し、evidence の `excluded_coverage_targets` に残す。同じ run を繰り返し再開しても最初の試行の下限を保つ。

## 6. 関連ドキュメント

- [[prj-0001:pjr-ppyf-register-targets-from-first-attempt]]（下限を導入した項目）
- [[specdojo:exec-operation-guide]]（再開の手順）
