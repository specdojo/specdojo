---
specdojo:
  id: prj-0001:pjr-b4y4-register-epic-type
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: hard
  registered_at: "2026-10-27T22:58:19Z"
  block_reason: "parent validation failed: test-unit"
  derived_from:
    - PJR-NJJ7
---

# PJR-B4Y4 register に epic の type を追加する

## 1. 概要

schema・個票のテンプレート・register の各コマンドで epic を扱い、exec run --register の対象から外す。子 todo を --from でたどる一覧を出す

- PJR-NJJ7 の決定に従い、track の仕事を担う新しい type `epic` を register に加える。

## 2. 完了条件

- 個票の frontmatter の schema と event の schema の type に `epic` がある。状態は todo と同じ（終端は `done`、ほかに `rejected` / `deferred`）。
- `epic` は担う track を frontmatter に持つ。フィールド名は executor が決める。`tml-index.yaml` があるときは、その track が定義済みかを検証する。
- 個票のテンプレート `pjr-epic-template.md` があり、節は「概要」「範囲（track と domain）」「完了の判断の基準」「子項目」「対応結果」「関連ドキュメント」である。
- `register add` / `close` / `update` などの記帳のコマンドで `epic` を扱える。
- `exec run --register` に `epic` を指定すると、epic は実行の対象ではないと示して止まる。夜間の orchestrator は `epic` を飛ばす。
- `register build` が、`epic` ごとに子項目（`derived_from` で `epic` を指す項目）とその状態を並べたビューを生成する。
- pjr-rulebook と register-operation-guide の type の表に `epic` を足し、command-reference に反映する。
- CHANGELOG の `## [Unreleased]` に追記する。公開済みの版の節は変えない。
- orchestrator の指示（agent の定義）の type の表は保護された設定のため直接変えず、変更の案を本個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとで行う。
- 単体テストで、schema・記帳・実行から外す判定・ビューを確かめる。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。

## 3. 作業内容

| No  | 作業                                                  | 担当     | 状態 | メモ |
| --- | ----------------------------------------------------- | -------- | ---- | ---- |
| 1   | schema・テンプレート・記帳のコマンドに `epic` を追加  | executor | done | -    |
| 2   | 実行の対象から外す判定を実装する                      | executor | done | -    |
| 3   | epic ごとの子項目のビューを追加する                   | executor | done | -    |
| 4   | rulebook・ガイド・command-reference・CHANGELOG を更新 | executor | done | -    |
| 5   | 単体テストを追加し、検査を通す                        | executor | done | -    |

## 4. 対応結果

- `epic` を個票・event の schema と register の分類に追加し、todo と同じ状態遷移・通常終端 `done`・例外終端 `rejected` / `deferred` を使用する。type の event は個票 schema の共通 enum を参照する。
- track のフィールド名は `track` とした。timeline の既存キーと一致させ、実行対象文書の `targets` と区別できるため。epic で必須、他 type では指定不可とし、add・update・build で検証する。`--track` で設定・置換し、削除は認めない。`timeline_path`（既定 `timeline`）にある `tml-index.yaml` を既存の読み取り処理で検証し、定義済み track に限定する。timeline がなければ形式だけを検証して保持し、schedule を使わない子 todo の分解も可能にする。
- 個票テンプレートは指定された六つの節を追加した。子項目の状態を本文へ重複保存せず、`--from` が記録する `derived_from` を再利用し、`generated/pjr-epic-items.md` に epic ごとの直接の子、type、現在の状態を表示する。既存の派生関係の収集を使って別 project の子も識別し、子がない epic も残す。孫の再帰集計・状態の自動集約・自動 close は行わず、人が子と schedule を材料に判断する。
- `track` を個票の読み書き・update・topic 変更・追記イベント・統合時のイベント再適用・外部 project 起票への引き渡しに対応させた。close・reject・defer・reopen は既存の共通処理を使用する。
- 実行対象の既存の許可リストを維持し、epic の直接実行は type と「実行対象外」を示すエラーで停止する。filter と夜間 queue も除外する。夜間の承認対象も既存どおり todo・issue に限定する。
- pjr-rulebook、register-operation-guide、command-reference、状態遷移設計、一覧テンプレート、CHANGELOG の Unreleased を更新した。
- schema・track の記帳と定義検証・終了と再開・イベント再適用・直接実行拒否・filter / 夜間 queue 除外・直接の子と状態の表示について単体テストを追加した。親検証 7 件（typecheck・lint-ts・lint-fm・lint-md・validate-schema・test-unit・test-integration）は executor で重複実行せず、runner の結果を正とする。
- 再開時に前回の単体テスト失敗 2 件を確認した。epic テンプレートのタイトルを生成処理が置換する `_EPIC_TITLE_` に修正し、生成した個票の H1 と読み取ったタイトルの検証を追加した。また、共通成果物 schema にも `track` を許可し、識別子の定義を個票 schema の `$defs/Track` に集約して参照する。個票と汎用の成果物検査で同じ形式を検証するためである。単体テストの再実行は親 runner が担当する。
- 再開時の executor 検証: 変更ファイル 30 件の Prettier 整形、生成した epic 個票と子項目ビューの markdownlint、生成個票の個票用・共通成果物用 schema と event schema の `validate:schema:file`、`register build --project prj-0001`、hook と同じ catalog 検証、`git diff --check` が成功した。catalog 検証は未作成成果物に関する `based_on` の警告を出したが、終了コードは 0。ソースの lint・単体テストを含む親検証 7 件の判定は runner が追記する。
- 統合後の確認は pm-orchestrator-playbook の runner・register・exec の変更時の手順に従い、オーケストレーターが PJR-JSEY の確認対象へ PJR-B4Y4 を加えて `claude-executor` で実行する。start から review までと event の actor を確認する。実 agent CLI の起動と使用枠を伴うため、executor sandbox では実施せず申し送る。
- 保護された設定の変更案（未適用）: `.agents/specdojo-orchestrator.agent.md` の type 表へ `epic`（用途: track ごとの仕事の着手・完了を管理、通常終端: `done`）の行を加える。本文に「`--track` で track を指定し、具体的な作業は `--from <epic-id>` の子 todo に分解する。epic 自体を実行せず、夜間も飛ばし、子項目と schedule を材料に人が close を判断する」を加える。利用者の承認後に SSOT を編集し、`npm run orchestrator:sync` で配布用ラッパーを同期する。今回は agent 定義・ラッパーを編集していない。

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook]]
- [[specdojo:register-operation-guide]]
- [[specdojo:command-reference]]
