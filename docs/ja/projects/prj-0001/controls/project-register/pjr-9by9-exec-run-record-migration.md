---
specdojo:
  id: prj-0001:pjr-9by9-exec-run-record-migration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-06T15:06:07Z"
  due_on: null
  block_reason: "parent validation failed: test-integration, test-unit"
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

| No  | 作業                   | 担当 | 状態    | メモ                                                    |
| --- | ---------------------- | ---- | ------- | ------------------------------------------------------- |
| 1   | 移すコマンドを作る     | DEV  | done    | `exec migrate-records` と `--dry-run`                   |
| 2   | prj-0001 の記録を移す  | DEV  | blocked | Git index が読み取り専用。実移動 0 件                   |
| 3   | 古い配置の処理をなくす | DEV  | done    | 通常の探索を `runs/` に統一。移行の実行と同時に反映する |
| 4   | ガイドを直す           | DEV  | done    | lifecycle・docs-structure と未公開 CHANGELOG            |

## 5. 対応結果

### 実装と判断

- `src/exec/migrate-records.ts` に移行コマンドを追加した。`git mv` の前に移動先の衝突と移動元の追跡状態を検査し、`--dry-run` は移動元・移動先・参照更新対象・対の欠落一覧を JSON で出す。配置は `src/shared/run-records.ts` を使う。
- checkpoint の `artifacts` を優先して plan / result と evidence を対応付けた。同じ対を複数の checkpoint が参照するときは最新の run に対を置き、先行試行の evidence・ログは各 run に残す。checkpoint の参照がなく、同じタスクの対が 1 つだけなら対応付ける。特定できない対は旧 stem を run ID とし、時刻の近さから対応を推測しない。
- JSON の参照フィールド、`log_refs` のパス、Markdown frontmatter の参照パス、共通規約の版への相対リンクだけを更新する。ログのバイト列、plan / result の `id`、自由記述・過去の変更一覧を保持する。対が欠けていても存在する記録を移し、欠けたファイルは作らない。
- 判断: `exec/trials/` の 40 ファイルは比較実験独自の形式なので移行対象外とする。通常の run の探索には含めない。PJR-Z0XR の対象範囲を引き継ぎ、job の状態管理 JSON 96 件は `execution/jobs/runs/` に保持して参照のみ更新する。job 定義と `grade/results/` も維持する。
- 通常の plan・result・evidence・再開候補の旧配置探索を削除し、`archive` は plan を同じ run に保持するようにした。job の変更なし判定は同じ job 実行の各 attempt を bookkeeping として扱う。旧名の commit 保護判定は、読み取りと切り離して保持した。
- 移行の単体テスト、旧 checkpoint を移行してから再開する統合テスト、dashboard・archive・規約リンクの回帰テスト、2 ガイドの配置例と共通モジュールを照らすテストを追加・更新した。保護された設定は変更していない。

### 移動件数と停止理由

- dry-run の移動対象は 5,576 ファイル（plan 1,190、result 1,204、evidence・state・ログ 3,182）。出どころ別は register 4,049、schedule 792、job 735。参照更新対象は 3,214 ファイル。分類不能・移動先衝突による除外は 0 件。
- prj-0001 でコマンドを実行したが、最初の `git mv` が worktree の `index.lock` を作れず `Read-only file system` で終了した。実移動は 0 件、未移動は全 5,576 件。旧配置には全件が残っている。ファイル移動への代替や Git 設定の変更は行っていない。
- 次の作業: ほかの run を止め、Git index に書き込める親 runner / ホスト側で `node --import tsx src/specdojo.ts exec migrate-records --project prj-0001 --dry-run` を確認してから、`--dry-run` を外して実行する。移行と読み取りの切り替えを同じ変更として取り込み、旧配置の残存 0 件と移行後の CLI を再確認する。別 run の記録は既存の commit 保護で除外されるため、統合は PJR-BRN4 の保持・停止手順に従って親側で移動の両側を確認する。

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

- 一時 Git リポジトリへ全対象記録を複製し、5,576 件を実際に `git mv` で移した。ログ 1,257 件のバイト一致、文書 ID 2,394 件の保持、更新されたログ参照 1,231 件の存在、dashboard での plan 1,190 件・result 1,204 件（1,206 run）の読み取りを確認した。再実行は移動・参照更新とも 0 件だった。一時データは削除した。これは本体での移動完了を意味しない。
- ビルド・変更ファイルの Prettier・`exec validate`・`exec status`・`dashboard build`・カタログ検査・register の派生生成・ステージ上の秘密情報スキャンを実施した。既存の schedule・カタログ・非推奨 timeline の警告がある。実プロジェクトの CLI は移行前であり、移行後の全履歴を確認する検査は未完了。lint・型検査・単体／統合テスト・schema は親 runner の検証に委ねる。
- `npm run validate:history-links` は既存の別個票 `pjr-g1w9-plan-conventions-markdown-link.md` の 27 行目の Markdown リンクで失敗した。同じ内容が HEAD にあることを確認した。本個票だけを対象とする検査は通過した。対象外の個票は変更せず、PJR-G1W9 側で記法を直して再検査する申し送りとする。
- 完了判定は未完了。Git index の書き込み制約を解消した実移動、移行後の CLI 確認、既存の履歴リンク違反の解消、親検証の通過が必要。executor は result と登録項目のステータスを変更していない。

## 6. 関連ドキュメント

- [[prj-0001:pjr-vh8d-execution-records-layout]]: 配置の決定
- [[specdojo:plan-result-lifecycle-guide]]: plan と result の扱い
- [[specdojo:docs-structure-guide]]: 構成図の正本
