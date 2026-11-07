---
specdojo:
  id: prj-0001:pjr-9by9-exec-run-record-migration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-06T15:06:07Z"
  due_on: null
  derived_from:
    - PJR-VH8D
  depends_on:
    - PJR-VH8D
    - PJR-Z0XR
    - PJR-BVS9
    - PJR-BRN4
---

# PJR-9BY9 既存の実行記録を run 単位のディレクトリへ移す

## 1. 概要

既存の plan・result・evidence・ログ約 3,000 件を git mv で execution/runs/ へ移すコマンドを作って実行し、記録の中のパスの欄を書き換え、古い配置の読み取りと plans/done/ をなくす

## 2. 入力

- PJR-VH8D の決定（2026-11-07 indie）: 実行記録は run 単位のディレクトリ execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に plan.md・result.md・evidence.json・ログを置く（R1）。出どころは register・schedule・job。置き場所を決める処理はコードの 1 つのモジュールにまとめる（R2）。exec validate と CI で置き場所を検査する（R3）。ガイドの構成図をモジュールと照らすテストを置く（R4）。grade/results と jobs/ の定義は外に残す。既存は git mv で移し、パスの欄だけ書き換える

## 3. 完了条件

- 既存の実行記録（`execution/exec/plans`・`results`・`evidence` と、job の plan・result・evidence）を、PJR-Z0XR のモジュールの規則で `execution/runs/` へ移すコマンドがある。`--dry-run` で移す先の一覧を出せる。何度流しても同じ結果になる。
- コマンドは `git mv` で移し、記録の中のパスの欄（`evidence.json` の `log_refs`、`pipeline-state.json` の参照、result の frontmatter のパスなど）だけを書き換える。ログの本文と plan・result の `id` は変えない。plan のない result、result のない plan も移し、どちらか欠けたものの一覧を個票の対応結果に書く。
- コマンドを prj-0001 に流して、移した件数と、移せなかったもの（とその理由）を個票の対応結果に書いている。`trials` の扱いは executor が決めて理由を書く。
- 古い配置の読み取りと `plans/done/` の処理がコードからなくなっている。古い配置にファイルが残っていない。
- plan-result-lifecycle-guide と docs-structure-guide の構成図と説明が、新しい配置になっている。
- `npx specdojo exec validate --project prj-0001`・`exec status`・`dashboard build` が通り、移した後も記録が読めている。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration` を含む）が通っている。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えていない。
- 保護された設定（`package.json`・`lefthook.yml`・`.github/workflows/`・`.specdojo/` の設定・agent の定義・`.gitignore` が保護されている場合はそれも）を変える必要があるときは、変えずに案を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。反映は利用者の承認のもと行う。
- 未決の点は executor が決め、決めた内容と理由を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。

## 4. 作業内容

| No  | 作業                   | 担当 | 状態 | メモ                                                          |
| --- | ---------------------- | ---- | ---- | ------------------------------------------------------------- |
| 1   | 移すコマンドを作る     | DEV  | done | `exec migrate-records`、`--dry-run`、残存 worktree の事前拒否 |
| 2   | prj-0001 の記録を移す  | DEV  | done | ホスト側で 5,576 件を `git mv`。`d17dcdeba` に記録            |
| 3   | 古い配置の処理をなくす | DEV  | done | 通常の探索を `runs/` に統一。移行後の読み取りを確認           |
| 4   | ガイドを直す           | DEV  | done | lifecycle・docs-structure と未公開 CHANGELOG                  |

## 5. 対応結果

### 実装と判断

- `src/exec/migrate-records.ts` に移行コマンドを追加した。`git mv` の前に移動先の衝突と移動元の追跡状態を検査し、`--dry-run` は移動元・移動先・参照更新対象・対の欠落一覧を JSON で出す。配置は `src/shared/run-records.ts` を使う。
- checkpoint の `artifacts` を優先して plan / result と evidence を対応付けた。同じ対を複数の checkpoint が参照するときは最新の run に対を置き、先行試行の evidence・ログは各 run に残す。checkpoint の参照がなく、同じタスクの対が 1 つだけなら対応付ける。特定できない対は旧 stem を run ID とし、時刻の近さから対応を推測しない。
- JSON の参照フィールド、`log_refs` のパス、Markdown frontmatter の参照パス、共通規約の版への相対リンクだけを更新する。ログのバイト列、plan / result の `id`、自由記述・過去の変更一覧を保持する。対が欠けていても存在する記録を移し、欠けたファイルは作らない。
- 判断: `exec/trials/` の 40 ファイルは比較実験独自の形式なので移行対象外とする。通常の run の探索には含めない。PJR-Z0XR の対象範囲を引き継ぎ、job の状態管理 JSON 96 件は `execution/jobs/runs/` に保持して参照のみ更新する。job 定義と `grade/results/` も維持する。
- `exec/events/` の 791 ファイルは claim / complete / block などのタスクの状態遷移を記録する正本であり、run ごとの plan・result・evidence・ログとは別の履歴なので移さない。`exec validate`・`exec status` は引き続きこのイベントを読み、タスク状態を導出する。
- 通常の plan・result・evidence・再開候補の旧配置探索を削除し、`archive` は plan を同じ run に保持するようにした。job の変更なし判定は同じ job 実行の各 attempt を bookkeeping として扱う。旧名の commit 保護判定は、読み取りと切り離して保持した。
- 移行の単体テスト、移行対象の worktree が残る場合に停止する統合テスト、dashboard・archive・規約リンクの回帰テスト、2 ガイドの配置例と共通モジュールを照らすテストを追加・更新した。保護された設定は変更していない。
- 親検証で失敗した condense・Markdown 記法検査・worktree 操作の fixture と期待値を、新配置へ揃えた。移行テストの Git 起動には `gitEnvironment()` を追加した。
- 判断: 移行対象に対応する exec worktree が残っていないことを移行の前提とする。PJR-VH8D の「移動のあいだはほかの run を止める」に沿い、再開に使う未コミット成果や独立した index を持つ worktree を移行で扱わないためである。`exec migrate-records` は対象タスクと元の項目（review を含む）の worktree を確認し、残っていれば項目 ID・パス・ブランチと撤去の指示を示して、`--dry-run` でも変更前に停止する。
- 前回の親検証で失敗した「移行後の進行中 run を再開する」2 件は、dry-run／実行の事前拒否を検証する 2 件へ置き換えた。root と worktree の両方で拒否し、plan・result のバイト列、Git index・変更一覧と worktree 自体が保持されることを検証する。単体テストでは register・schedule・job・review、別 project／別 task の worktree、撤去後と移行済みの再実行も扱う。

### 移動件数と実施結果

- dry-run の移動対象は 5,576 ファイル（plan 1,190、result 1,204、evidence・state・ログ 3,182）。出どころ別は register 4,049、schedule 792、job 735。参照更新対象は 3,214 ファイル。分類不能・移動先衝突による除外は 0 件。
- 初回の sandbox 実行は Git index の書き込み制約で実移動 0 件だった。その後、orchestrator がホスト側で dry-run を確認して実行し、全 5,576 件を `git mv` で移動した（commit `d17dcdeba`）。内容を保持した移動は 2,458 件、パスの欄を更新した移動は 3,118 件、配置を維持して参照だけ更新した job 状態は 96 件。ログ本文の更新、移せなかったもの、除外はいずれも 0 件。
- 移行直後の再実行は移動・更新とも 0 件。今回の再開では移動をやり直さず、`--dry-run` でも移動・更新・欠落・除外がすべて 0 件であることを確認した。旧 `exec/plans/`・`exec/results/`・`exec/evidence/`（`plans/done/` を含む）の残存ファイルは 0 件。`exec/` に残るのは上記の events と trials だけである。

### 対の欠落（移行前の 18 件）

- `T-LAUNCH-prj-stakeholder-register-010`: result なし
- `pjr-tndh-20260815T031037Z-dd02`: result なし
- `T-DATA-FLOW-cdfd-agent-config-operation-140`: plan なし
- `T-DATA-FLOW-cdfd-catalog-planning-140`: plan なし
- `T-DATA-FLOW-cdfd-deprecation-140`: plan なし
- `T-DATA-FLOW-cdfd-derived-content-140`: plan なし
- `T-DATA-FLOW-cdfd-init-140`: plan なし
- `T-DATA-FLOW-cdfd-multi-project-140`: plan なし
- `T-DATA-FLOW-cdfd-overview-140`: plan なし
- `T-DATA-FLOW-cdfd-register-operation-140`: plan なし
- `T-DATA-FLOW-cdfd-reporting-140`: plan なし
- `T-DATA-FLOW-cdfd-routine-140`: plan なし
- `T-DATA-FLOW-cdfd-task-execution-140`: plan なし
- `pjr-2219-20261018T074259Z-3e7d`: plan なし
- `pjr-b0b8-20261102T130909Z-327c69f6`: plan なし
- `pjr-k87y-20261025T150259Z-72bf680f`: plan なし
- `pjr-mh9e-20260926T142505Z-9f77`: plan なし
- `pjr-vgng-20261018T000455Z-a5a9`: plan なし

### 検証と申し送り

- 初回の一時リポジトリ検証ではログ 1,257 件のバイト一致、文書 ID 2,394 件の保持、更新されたログ参照 1,231 件の存在を確認した。本体の移行前後でも、orchestrator が `exec validate`・`exec status` の同一結果と、生成時刻以外の `dashboard build --dry-run` 出力の一致を確認した。
- 再開後の実プロジェクトで `exec validate` は成功（events 791 件）、`exec status` は `No doing tasks.`、`dashboard build` と `--dry-run` も成功した。develop から同期した新しい run を含め、plan 1,197 件・result 1,211 件を読み取った。既存の schedule・カタログ・非推奨 timeline の警告は残るが、エラーはない。
- コードを調べ、通常の探索・再開・dashboard・job が旧配置を読まないことと、`plans/done/` への移動処理の廃止を確認した。旧配置への読み取りは移行コマンドに限り、旧名の commit 範囲などの保護判定は残している。回帰テストと、2 ガイドの構成図を共通モジュールと照らすテストも維持している。
- PJR-G1W9 の履歴リンク違反は develop で修正済み。今回の履歴リンク・カタログ検査、register の派生生成、変更ファイルの Prettier、`git diff --check` は成功した。ステージ上の秘密情報スキャンは対象 0 件・検出 0 件だった。lint・型検査・単体／統合テスト・schema は親 runner が修正後に実行するため、前回の失敗を成功扱いにはしていない。result と登録項目の状態遷移も runner が行う。
- 保護された設定の変更案、未決の判断、移動の残作業はない。runner 変更の統合後は [[prj-0001:pm-orchestrator-playbook|運用メモ]] に従って PJR-JSEY で動作を確認してから close する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-vh8d-execution-records-layout]]: 配置の決定
- [[specdojo:plan-result-lifecycle-guide]]: plan と result の扱い
- [[specdojo:docs-structure-guide]]: 構成図の正本
