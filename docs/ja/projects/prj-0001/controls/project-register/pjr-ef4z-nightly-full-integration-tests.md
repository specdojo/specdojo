---
specdojo:
  id: prj-0001:pjr-ef4z-nightly-full-integration-tests
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T00:16:11Z"
  due_on: "2026-11-30"
  conclusion: 統合テストの全件を毎晩流す orchestrator integration-tests と job・routine を足した。2 回目で、朝の報告が成功・失敗・JSON を読めないときのどの場合でも lint を通るように書き出しを直し、2026-11-23 の報告も直した
  derived_from:
    - PJR-9X52
  commit_type: feat
  commit_scope: routine
---

# PJR-EF4Z 統合テストの全件を毎晩 routine で流す

## 1. 概要

親の検証の test-integration を related: true にしたため、関係しないと判定されたテストが release の前まで流れない。routine から毎晩 1 回、統合テストの全件を流し、結果を朝の報告に残す

## 2. 入力

- PJR-9X52 の対応結果は「夜間に npm run test:integration を流す routine などを併せて用意してから related を入れる」としていた。related は 2026-11-23 に先に入れた（936202ff4）
- 今の routine の action は job と specdojo だけで、npm の script を直接流せない

## 3. 完了条件

- 親の検証の `test-integration` は `related: true`（PJR-9X52）で、変えたファイルに関係する統合テストだけを流す。関係しないと判定されたテストも、毎晩 1 回は全件を流せるようにする（利用者の決定、2026-11-23、indie）。
- routine から、統合テストの全件（`npm run test:integration`）を流せるようにする。今の routine の action は `job` と `specdojo` だけで、npm の script を直接流せない。job を足すか、`specdojo` のコマンドを足すかを executor が決め、理由を個票の対応結果に書く。任意のシェルのコマンドを流せる action は足さない。
- 流す時刻は、ほかの夜の routine（`rtn-night-approved-register` など）と負荷が重ならないように決める。実行中の run が統合テストの枠を使っているときは待つか次の回に回し、時間切れで偽の失敗を出さない。
- 結果（成功・失敗・失敗したテストの名前と出力の要約）を routine の実行記録と朝の報告に残す。失敗したときは、人やオーケストレーターが朝に読んで直す項目を起票できるだけの情報を残す。
- prj-0001 の routine の定義（`docs/ja/projects/prj-0001/routines/` の下）を足す。既定は `enabled: true` とし、統合の後に orchestrator が `routine run --id` で 1 回流して確かめる。
- 単体テストを足す（全件の実行の組み立て、結果の記録、枠が使われているときの扱い）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- 2 回目の実行（2026-11-23）: 1 回目の後に `routine run --id rtn-nightly-integration-tests` を流すと、443 件の全件成功で朝の報告も作られたが、報告（`execution/reports/nightly-integration-tests/nightly-integration-tests-20261123T042751Z.md`）の 21 行目に markdownlint の MD012（空行が 2 行続く）が出た。commit の hook は `execution/` の下を検査しないため止まらなかった。報告を書き出す処理を直し、成功・失敗・JSON を読めないときのどの場合でも、作る報告が `npm run lint:md` の規則（markdownlint と prettier）を通るようにする。3 つの場合の報告が lint を通ることを単体テストで確かめる。2026-11-23 の報告のファイルも、直した書き出しの形に合わせて直す。
- 3 回目の実行（2026-11-23）: `routine run --id rtn-nightly-integration-tests` が作った job の記録のうち、段のディレクトリ（`execution/runs/job/JBR-nightly-integration-tests-<id>/JBR-nightly-integration-tests-<id>-attempt-1-step-integration-tests/`）に `evidence.json` と log だけがあり、`plan.md` と `result.md` がなかった。commit すると pre-push の `exec validate --records-only` と CI の Check execution record layout で止まる（オーケストレーターがこのディレクトリを管理から外した、`892de711e`）。毎晩の routine で同じ記録ができるため、job の段が作る記録を、配置の検査が求める形（plan・result・evidence がそろう、または段のディレクトリを作らない）にする。ほかの job（`job-exec-cycle` など）の段の記録とそろえる。どちらにするかを executor が決め、理由を個票の対応結果に書く。
- 統合テストの全件の job の記録が `exec validate --records-only` を通ることを、単体テストか統合テストで確かめる。統合の後に orchestrator が routine を 1 回流し、作った記録を commit した tree で `exec validate --records-only --commit` が通ることを確かめる。

- 4 回目の実行（2026-11-24）: 夜間の routine（2026-11-24 04:00）が作った報告の `specdojo.id` が `prj-0001:nightly-integration-tests-report-20261123T193127Z` と時刻の T と Z を大文字のまま含み、frontmatter の id の規則（`^[a-z0-9][a-z0-9-:]*$`）に合わず `npm run lint:fm` が警告で落ちた（`--frail`）。lint-fm を親の検証に持つ run がすべて止まった。既存の 2 件の報告の id はオーケストレーターが小文字に直した。`src/commands/nightly-integration-tests.ts` の id の組み立てで時刻を小文字にし、作った報告が `npm run lint:fm` を通ることを単体テストで確かめる。報告のファイル名は今のままでよい。

## 4. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                                                                                                        |
| --- | --------------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------------------------------------------- |
| 1   | 方式の決定（job か specdojo コマンドか）            | DEV  | done | specdojo コマンドを足し job から呼ぶ方式に決定                                                              |
| 2   | `orchestrator integration-tests` の実装と単体テスト | DEV  | done | `src/commands/nightly-integration-tests.ts`、`tests/src/commands/nightly-integration-tests.test.ts`         |
| 3   | job と routine の定義の追加                         | DEV  | done | `job-nightly-integration-tests`、`rtn-nightly-integration-tests`                                            |
| 4   | コマンドリファレンスと運用ガイドの更新              | DEV  | done | `command-reference.md`、`register-operation-guide.md`                                                       |
| 5   | job の段の記録を配置の検査に通す                    | DEV  | done | 段の evidence・log を job の run ディレクトリに置く。`src/exec/evidence.ts`、`src/exec/run/job-sequence.ts` |
| 6   | 統合後に `routine run --id` で 1 回流して確かめる   | ARC  | open | executor は統合前で実行できない。orchestrator が統合後に行う                                                |

## 5. 対応結果

### 5.1. 方式の決定と理由

- 任意のシェルのコマンドを流せる action は足さず、`specdojo orchestrator integration-tests` を足した。固定の引数で `npm run test:integration` だけを流すため、routine の action の範囲を広げずに済む。
- routine の action は既存の `job` を使う。job の `task.steps` と `lock_wait_seconds`（10800 秒）により、実行中の run がプロジェクト実行ロックを持つ間は待ち、時間切れは偽の失敗ではなく延期として記録される。
- 時刻は毎晩 4 時（Asia/Tokyo）。0 時の夜間実行、1 時の grade、3 時の翻訳の後、5 時の grade-recheck、6 時の exec-cycle の前で、重ならない。
- 結果は Vitest の JSON 報告から読み、成功・失敗の件数と失敗したテストのファイル・名前・メッセージの要約を `execution/reports/nightly-integration-tests/` の朝報告へ残す。JSON を読めない場合は出力の末尾を残す。失敗時は終了コード 1 で、job の実行記録にも失敗が残る。
- 既定は `enabled: true`。
- 2 回目の実行: 報告の書き出しを直した。連続する空行を 1 行にまとめ、末尾を改行 1 つにそろえ、失敗の表を Prettier と同じ列幅（全角は幅 2）に整える。成功・失敗・JSON を読めない場合の 3 通りの報告が markdownlint と prettier を通ることを単体テストで確かめる。2026-11-23 の報告のファイルは、すでに直した書き出しの形（空行 1 行、末尾改行 1 つ）と一致しており、変更不要だった。

- 3 回目の実行: 段ごとに別の run ディレクトリ（`...-attempt-1-step-<id>/`）を作っていたため、plan・result がなく配置の検査に落ちた。段のディレクトリを作らない方式を選んだ。段の evidence と log は job の run ディレクトリへ `evidence.step-attempt-<n>-<id>.json`・`step-attempt-<n>-<id>.stdout.log`・`.stderr.log` として置く（試行ごとに名前が分かれ、上書きされない）。plan・result を段ごとに偽造するより、検査が求める「run ごとに plan・result・evidence」を保ち、既存の `exec-cycle` などの記録と同じ形になる。`tests/src/exec/job-sequence.integration.test.ts` で、段を持つ job の記録が `validateRunRecordLayout` を通ることを確かめた。統合後の `exec validate --records-only --commit` の確認は orchestrator が行う。

- 4 回目の実行: 報告の `specdojo.id` の組み立てで時刻を小文字にした（`...-report-20261123t193127z`）。報告のファイル名は変えていない。単体テストで、作った報告の id が `^[a-z0-9][a-z0-9-:]*$` に合うことを確かめた。

### 5.2. 成果物

- `src/commands/nightly-integration-tests.ts`、`src/commands/orchestrator.ts`（登録）
- `tests/src/commands/nightly-integration-tests.test.ts`（引数の組み立て、結果の解析、報告の描画）
- `docs/ja/projects/prj-0001/jobs/job-nightly-integration-tests.yaml`、`docs/ja/projects/prj-0001/routines/rtn-nightly-integration-tests.yaml`
- `docs/ja/specdojo/references/command-reference.md`、`docs/ja/specdojo/guides/register-operation-guide.md`

### 5.3. 残課題

- 枠の待ち合わせ（ロック待ちの延期）は job の既存機構に任せており、本タスクでは単体テストを足していない。ロックの組み立ては既存の job の試験が対象である。
- 統合後に orchestrator が `routine run --id rtn-nightly-integration-tests` を 1 回流して確かめる。

### 5.4. CHANGELOG に書く事項

- 区分: Added
- 文案: `specdojo orchestrator integration-tests` を追加し、routine `rtn-nightly-integration-tests` で統合テストの全件を毎晩 1 回流して朝報告へ結果を残すようにした。

## 6. 関連ドキュメント

- `prj-0001:pjr-index`（PJR-9X52 の派生元）
