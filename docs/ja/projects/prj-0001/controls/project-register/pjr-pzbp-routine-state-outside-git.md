---
specdojo:
  id: prj-0001:pjr-pzbp-routine-state-outside-git
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-06T15:05:10Z"
  due_on: null
  block_reason: "parent validation failed: test-unit"
  derived_from:
    - PJR-VH8D
---

# PJR-PZBP 定期処理の状態を Git の外へ移し、何もしなかった job の記録を残さない

## 1. 概要

routine-state.json と routine-runs.jsonl を端末の状態を置く場所へ移し、job の記録なしで失敗した実行だけを Git に残す。何も変えなかった job の実行記録は commit しない（VH8D の #8）

## 2. 入力

- PJR-VH8D の決定（2026-11-07 indie）: 実行記録は run 単位のディレクトリ execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に plan.md・result.md・evidence.json・ログを置く（R1）。出どころは register・schedule・job。置き場所を決める処理はコードの 1 つのモジュールにまとめる（R2）。exec validate と CI で置き場所を検査する（R3）。ガイドの構成図をモジュールと照らすテストを置く（R4）。grade/results と jobs/ の定義は外に残す。既存は git mv で移し、パスの欄だけ書き換える
- 利用者の決定（PJR-VH8D #8）: 定期処理の実行状態と履歴は Git の外の端末の状態を置く場所へ移す。Git に残すのは job の実行記録を残さずに失敗した定期処理の実行だけとし、正常に何もしなかった実行（skip を含む）は残さない。precondition を持たない job が動いて何も変えなかった場合も実行記録を commit しない。実現の方法は設計で決める（2026-11-06）

## 3. 完了条件

- `routine-state.json` と `routine-runs.jsonl` の置き場所が、`docs/` の下の `generated/` から、端末の状態を置く場所（Git の外。場所は executor が決め、既存の端末の状態の置き場所があればそれにそろえて理由を書く）へ移っている。既存の状態を新しい場所へ引き継ぐ方法（初回に移す、など）がある。
- 定期処理の実行が、job の実行記録を残さずに失敗したときだけ、その実行の記録を Git に残す（置き場所と形式は executor が決める）。成功・skip・何もしなかった実行は Git に残さない。
- `precondition` を持たない job が動いて何も変えなかった場合、その job の実行記録を commit しない。判定の方法（runner が変更の有無で判定する、など）と理由を個票の対応結果に書いている。
- `routines/.locks/` を文書のツリーの外へ移すか、Git の無視の対象にしている（`.gitignore` が保護されている場合は案を書く）。
- dashboard の定期処理の表示と、stsd-routine-run が管理場所とする記録との関係を個票の対応結果に書いている（ステータス定義の本文は変えない）。
- 単体テストで、状態の置き場所、失敗の記録の残し方、何もしなかった job の記録を commit しないことを確かめている。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration` を含む）が通っている。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えていない。
- 保護された設定（`package.json`・`lefthook.yml`・`.github/workflows/`・`.specdojo/` の設定・agent の定義・`.gitignore` が保護されている場合はそれも）を変える必要があるときは、変えずに案を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。反映は利用者の承認のもと行う。
- 未決の点は executor が決め、決めた内容と理由を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。

## 4. 作業内容

| No  | 作業                                      | 担当 | 状態 | メモ                                                       |
| --- | ----------------------------------------- | ---- | ---- | ---------------------------------------------------------- |
| 1   | 状態と履歴の置き場所を移す                | DEV  | done | 端末側の状態ディレクトリへ移し、旧状態を初回コピー         |
| 2   | 失敗の記録だけを Git に残す               | DEV  | done | Job Run ID がない failure の JSON だけを単独 commit        |
| 3   | 何もしなかった job の記録を commit しない | DEV  | done | runner が成果物の差分を比較し、無変更 Run を端末側へ保存   |
| 4   | テストを足す                              | DEV  | done | 保存先・移行・失敗保存・無変更判定の単体テストと統合テスト |

## 5. 対応結果

- 保存先は `$XDG_STATE_HOME/specdojo/<repository-key>/`（未設定・相対パス時は `~/.local/state/specdojo/` 以下）に決定した。既存の `src/exec/product-branch-records.ts` と同じ Git 共通ディレクトリの実パスで repository を識別し、linked worktree 間で状態を共有する。保存ファイルは文書ツリーと Git 追跡の外に置くため、既存の `.git/specdojo/` 内の記録そのものとは分けた。`src/shared/local-state.ts` が repository の保存先、`src/routine/storage.ts` が routine ツリー別の状態・履歴・lock の保存先を解決する。
- 旧 `generated/routine-state.json` と `generated/routine-runs.jsonl` は初回の list・通常実行・dashboard 集計時にコピーし、新しいファイルは上書きしない。旧ファイルは復旧用に残し、以後の更新・参照先は端末側とする。移行前に旧プロセスを停止する手順を [[specdojo:routine-operation-guide|routine 運用ガイド]] に記載した。lock も端末側へ移したため、`.gitignore` の変更は不要。
- routine 自身が Git に保存するのは、集約結果が `failure` かつ関連 Job Run ID が空の実行だけとした。`<execution-path>/routines/failures/<routine-id>/<UUID>.json` に履歴項目と `run_id` を書き、理由を伏せ字処理して、そのファイルだけを commit する。Job Run があれば既存の実行記録を診断に使う。成功・skip の履歴は端末側だけに残す。配列 action の Job Run ID は各段の直後に回収し、前段の waiting 記録も認識する。
- 無変更の判定は runner が実行前後の変更ファイルの内容・モードと HEAD 間の差分で行う。その Run の plan・result・evidence・Run JSON、`generated/`、exec の lock を除き、子の exec event と grade result は変更として数える。成功時だけ適用し、`precondition` の有無や in-place / worktree に依存しない。無変更なら記録を端末側の `noop` へ移して commit・統合前 review を省き、worktree を撤去する。端末側の記録で冪等性と checkpoint を維持し、既存 attempt の記録や利用者の変更は保持する。失敗・部分完了はこの抑制の対象外。
- dashboard は `src/routine/storage.ts` を通して CLI と同じ状態・履歴を読む。[[prj-0001:stsd-routine-run|ステータス定義（定期処理の実行結果）]] の管理場所「routine 実行状態」は端末側の `routine-state.json` に対応し、履歴は dashboard の日別実績に対応する。状態値・遷移・本文は変更していない。[[prj-0001:sysd-job-execution|Job実行設計]] と運用ガイド、command reference、CHANGELOG の Unreleased を更新した。
- 単体テストは保存先・旧状態の非上書き移行・dashboard の参照先・成功/skip/部分完了/Job Run ありの失敗の非保存・Job Run なしの失敗の単独 commit・無変更記録の除去・既存 attempt の復元・既存の利用者差分の保持・子 exec/grade の差分検出を追加した。統合テストは `precondition` のない無変更 command Job を、review 宣言あり/なしの両方で実行し、HEAD・index・作業ツリー・worktree 撤去・同じ枠の再実行抑止を検証する。
- executor 検証は Prettier、`npm run validate:history-links`、`node --import tsx tools/catalog-validate-if-configured.mjs`、`node --import tsx src/specdojo.ts register build`、`node tools/check-evidence-secrets.mjs --staged` が通過した。catalog は既存の未作成文書・re-export 参照などの警告があるが終了コードは 0。型・lint・単体/統合テスト・schema は指定された親 runner の検証に委ねる。
- 保護設定の変更案と未決事項はない。統合後は運用メモに従い、オーケストレーターが PJR-JSEY の対象へ PJR-PZBP を追加して実 CLI の動作確認を行う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-vh8d-execution-records-layout]]: #8 の決定
- [[prj-0001:stsd-routine-run]]: 定期処理の状態の定義
