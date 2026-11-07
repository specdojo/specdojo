---
specdojo:
  id: prj-0001:pjr-8yh0-resume-stale-validation-logs
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
  registered_at: "2026-11-06T23:21:32Z"
  derived_from:
    - PJR-TA6W
---

# PJR-8YH0 executor から再開した run に前回の親の検証のログが元の名前で残る

## 1. 課題内容

再開の前の試行の退避が写しを作るだけで元のログを残すため、成功した再開の run に、失敗した前回の親の検証のログが今回の名前のまま commit される

## 2. 入力

- PJR-TA6W の executor からの再開（commit fe25cef49）。run のディレクトリに parent-validation-attempt-1-lint-fm.log と parent-validation-attempt-1-test-integration.log が残り、中身は退避の写し（`*.attempt-1.log`）と同じで exit code 1 を示す。再開後の親の検証はすべて passed で、evidence.json の `log_refs` はこれらを参照しない（2026-11-07 orchestrator の確認）
- 原因の見立て: snapshotRunAttempt（src/shared/run-records.ts）は pipeline-state・evidence・ログを `*.attempt-N.*` へ copyFileSync で写すだけで、元のファイルを消さない。親の検証のログは失敗したときだけ書かれるため、成功した再開では上書きされずに前回のものが残る（2026-11-07）
- 決定: 試行の退避では、ログを写さずに移す。ただし引き継ぐ evidence の `log_refs` が指すログは元の名前で残し、`pipeline-state.json` と `evidence.json` は今のまま写す（2026-11-07 indie が決定）

## 3. 影響範囲

| 観点         | 影響                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| スコープ     | `snapshotRunAttempt`（`src/shared/run-records.ts`）による試行の退避と、再開した run の記録                |
| スケジュール | なし                                                                                                      |
| コスト       | 退避の処理と単体テストの修正                                                                              |
| 品質         | 成功した再開の run に、失敗した前回の親の検証のログが今回の名前で残り、監査のときに今回の失敗と読み違える |
| 関係者       | DEV、run の記録を確かめる orchestrator と利用者                                                           |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `snapshotRunAttempt` はログを `*.attempt-N.*` へ `copyFileSync` で写すだけで元を消さない。親の検証のログは失敗したときだけ書かれるため、成功した再開では上書きされない |
| 対応策   | ログは写さずに移す。引き継ぐ evidence の `log_refs` が指すログは元の名前で残す（2026-11-07 indie が決定）                                                              |
| 依存事項 | なし                                                                                                                                                                   |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                                                           |

完了条件の内訳。

- 試行を退避するとき、ログ（`*.log`）は `*.attempt-N.*` へ移し、元の名前のファイルを残さない。
- ただし、退避の後も引き継ぐ evidence の `log_refs` が指すログは、元の名前のまま残す（例: reporter から再開するときの executor のログ）。
- `pipeline-state.json` と `evidence.json` は再開に使うため、今のまま写して元も残す。
- 単体テストで次を確かめる。失敗した親の検証のログが、成功した再開の後に元の名前で残らず、`*.attempt-N.*` にだけある。reporter から再開したときに、引き継ぐ evidence が指す executor のログが元の名前で残る。退避した evidence の `log_refs` が `*.attempt-N.*` を指す。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration`）が通る。
- 保護された設定（`.github/`、`.specdojo/` の定義、`package.json` など）は変えない。変更が要ると判断した場合は、案を個票の対応結果に書き、報告の `handoff` にも書く。

## 5. 対応結果

- `src/shared/run-records.ts` の `snapshotRunAttempt` を修正し、ログは `*.attempt-N.log` へ移動する。引き継ぐ `log_refs` を指定したログだけは元も保持し、`pipeline-state.json` と `evidence.json` は従来どおりコピーする。退避した evidence は実際に退避したログだけ参照を書き換え、過去の退避済みログの参照は維持する。
- `tests/src/exec/run-records.test.ts` に、古い親検証ログの元ファイルが残らないこと、引き継ぐ evidence のログを保持すること、退避先への参照更新、複数回の退避と不正な evidence の保存を確認する単体テストを追加・拡張した。`tests/src/exec/register-resume.integration.test.ts` では、親検証の失敗後に executor から再開して成功する経路と、reporter 再開で executor ログの内容・参照を保持する経路の確認を強化した。
- 前回の親検証は、`agent-output-excerpt` の参照を executor だけとみなしたテストの前提誤りで失敗した。`executor.log` のパスで参照を特定し、reporter 再開後の参照・元の名前・内容を照合するよう修正した。既存の統合先同期テストは元の名前と筋書きに戻し、親検証失敗からの executor 再開を別のテストとして追加した。
- 実行記録のライフサイクルガイドに移動・保持の規則を追記し、`CHANGELOG.md` の未公開節に修正内容を記載した。保護された設定の変更は不要。
- 再開時の追加指示に従い、`npx vitest run --config vitest.integration.config.ts tests/src/exec/register-resume.integration.test.ts` を試したが、全14件が fixture の初期化時に `spawnSync git EPERM` で停止した。テスト本体の判定には到達していないため、親 runner の `test-integration` に検証を引き継ぐ。
- executor では Prettier、カタログ検査、履歴リンク検査、登録簿の派生ビュー生成、`git diff --check` が成功した。カタログ検査には変更対象外の再エクスポート参照・参照文書の欠落に関する警告がある。単体・結合テストの全件、型検査と lint・schema 検査は親 runner、result の記入と状態遷移は reporter・runner が行う。

## 6. 関連ドキュメント

- [[specdojo:plan-result-lifecycle-guide|plan/resultライフサイクルガイド]]
