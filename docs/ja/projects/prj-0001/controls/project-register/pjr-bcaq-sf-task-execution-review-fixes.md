---
specdojo:
  id: prj-0001:pjr-bcaq-sf-task-execution-review-fixes
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-09T20:49:35Z"
  conclusion: sf-task-execution から実装詳細・照合表を除去して個票へ移送し、業務プロセス対応・検証観点を維持した上で sf-rulebook に適合させた
  derived_from:
    - PJR-2GD6
  approach: fully-guided
  targets:
    - prj-0001:sf-task-execution
---

# PJR-BCAQ 代表の sf-task-execution を、review の指摘（業務プロセスとの整合・確かめ方・実装との照合）に合わせて磨き込む

## 1. 概要

business-specs-reps の review で incomplete となった sf-task-execution を、指摘どおり業務プロセス仕様との整合、検証可能性の定義、実装（agent-pipeline.ts）との照合の記録を足して磨き込む

## 2. 入力

- 2026-11-09 の review（T-BUSINESS-SPECS-REPS-sf-task-execution-090）の判定は incomplete。grade は pass 87。`done_criteria` の DC-001（業務プロセス仕様との整合）と DC-004（検証可能性）が未充足、実装エビデンス src/exec/run/agent-pipeline.ts との対応表がない、と指摘された。
- review の指摘を完了条件として磨き込みの段に戻し、その後に review をやり直す（indie が決定、案 A）。

## 3. 完了条件

- `docs/ja/product/010-business-specs/050-system-functions/sf-task-execution.md` を、カタログの `done_criteria` のうち DC-001（業務プロセス仕様との整合）と DC-004（検証可能性）を満たすように磨き込んでいる。
  - 対応する業務プロセス仕様（カタログの `depends_on` にある `bps-task-selection-preparation` など）と、機能の入出力・処理要件の対応を、文書の中で確かめられる形で書いている。
  - 機能ごとに、何をもって満たしたと確かめるか（検証の観点）を書いている。
- 実装エビデンス `src/exec/run/agent-pipeline.ts` と文書の記述を照らし、記述ごとの一致・乖離・未確認を表にしている（2 回目で、表の置き場所を個票の対応結果に移す）。乖離は実装に合わせて直すか、意図された仕様として残す理由を書いている。
- 2 回目の実行（2026-11-10 追加）: 1 回目の完了条件にあった「実装との照合の表を文書に書く」は、[[specdojo:sf-rulebook]] の「実装の名前・内部の構造を書かない」規則に反していた（orchestrator の完了条件の誤り）。やり直した review（T-BUSINESS-SPECS-REPS-sf-task-execution-090）の指摘 F004・F005・F007 に合わせ、次のように直している。
  - 文書の「実装エビデンスとの照合」の節と、本文にある実装の関数名・型名（`ProviderConcurrencyGate`・`ExecEvidence`・`PipelineState` など）を外し、業務の言葉に置き換えている。実装との対応は、カタログの `evidence_refs` が示す。
  - 外した照合の表は、個票の対応結果に「実装との照合の記録」として移し、一致・乖離・未確認の判定を残している。
  - 業務プロセス仕様との対応と、検証・受入の観点は残している。
- [[specdojo:sf-rulebook]] の規則（機能の目的と bps・uis との対応に絞り、操作手順は参照に留める）を守っている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`specdojo catalog validate --project prj-0001` が通っている。

## 4. 作業内容

| No  | 作業                                                                      | 担当           | 状態 | メモ                                                                                                                           |
| --- | ------------------------------------------------------------------------- | -------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | review の指摘と、業務プロセス仕様・実装を読み比べる                       | executor (agy) | done | Finding 15件および `agent-pipeline.ts`、カタログ `dct-business-model-bps.yaml`（P-07 業務プロセス区分）の照合完了              |
| 2   | 整合・検証の観点・実装との照合の表を書く                                  | executor (agy) | done | `sf-task-execution.md` に BPS 処理ステップ対応、客観的検証観点（V-01〜V-15）、実装エビデンス照合表、未決事項・昇格ゲートを反映 |
| 3   | 検査を流し、対応結果に書く                                                | executor (agy) | done | `lint:md`、`lint:fm`、`catalog validate` を実施し適合を確認                                                                    |
| 4   | review 指摘（F004, F005, F007, F008）に基づく実装詳細の除去と個票への移送 | executor (agy) | done | 本文から 7.2 照合表を除去し個票 5.2 へ移送。型名・内部キー名・オプション名の業務用語化と CLI 参照への置換                      |
| 5   | 2回目修正後の適合検査と個票記録                                           | executor (agy) | done | `sf-task-execution.md` の `sf-rulebook` 適合性確認、個票対応結果の整備                                                         |

## 5. 対応結果

### 5.1. 実施内容

2026-11-09 の review（T-BUSINESS-SPECS-REPS-sf-task-execution-090）での指摘事項に対応した後、再度の review において、成果物本文に実装詳細（型名・関数名・照合表）を記載したことが [[specdojo:sf-rulebook|sf-rulebook]] 第 7 章（禁止事項）に抵触するとの指摘（F004, F005, F007）、および本文中にコマンドオプション名（`--resume`）が含まれているとの指摘（F008）を受けた。

2026-11-10 の 2 回目実行において、上記指摘および Plan の完了条件に基づき、以下のとおり見直しを実施した。

1. **成果物本文からの実装詳細・照合表の除去（F004, F005, F007）**:
   - `sf-task-execution.md` 第 7 章の `7.2 実装エビデンスとの照合（src/exec/run/agent-pipeline.ts）` を全面削除し、個票の対応結果「5.2 実装との照合の記録」へ移送した。実装エビデンスと機能の対応関係は成果物カタログの `evidence_refs` が示す。
   - 本文各所に含まれていた実装固有の型名・クラス名・内部キー名（`ProviderConcurrencyGate`、`ExecEvidence`、`PipelineState`、`outcome.protectionBlock`、`rate_limit_events`、`completion_status: incomplete` など）を機能・業務論理の表現（プロバイダ同時実行ゲート機能、実行証跡、パイプライン段状態記録、保護違反による停止、未完了ステータスの通知など）へ置換した。
2. **コマンドオプション記述の排除とリファレンス委任（F008）**:
   - 第 6 章「6.1 運用エスカレーションルート」の一次対応にあった `--resume` の記述を削除し、再開コマンドによる再開または手動回復とし、起動構文は [[specdojo:command-reference|CLIコマンドリファレンス]] を参照する形に改めた。表内の個別コマンド名も機能表現に整理した。
3. **業務プロセス仕様との対応および検証・受入観点の維持（DC-001, DC-004）**:
   - 第 2 章の業務プロセス仕様対応表（`P-07-01`〜`P-07-05`、`P-11-01・02`）および第 7 章の客観的検証観点一覧（V-01〜V-15）を維持し、業務プロセス整合性と検証可能性を確保した。

### 5.2. 実装との照合の記録

本タスクの前提・エビデンス確認として、実装エビデンス `src/exec/run/agent-pipeline.ts` と `sf-task-execution.md` の仕様記述を照合した記録を次表に示す。照合区分は、一致（実装と仕様が合致）、乖離（実装と記述の差異を調整済み、または仕様として意図的に維持）、仕様先行（未作成機能・外部連携仕様の先行定義）とする。

| 仕様項目（節）                           | 実装エビデンスの該当処理（`agent-pipeline.ts`）                                                     | 区分 | 照合内容および乖離の扱い                                                                                                                                                |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.2 段状態の独立管理                     | `createPipelineState`, `updatePipelineStage`, `writePipelineState`                                  | 一致 | executor 段と reporter 段の状態（running / succeeded / blocked / failed / rate_limited）をタスク進捗状態とは独立して `pipeline-state.json` へ記録しており、仕様と一致。 |
| 4.2 作業前変更スナップショット           | `snapshotWorktreeChanges`                                                                           | 一致 | executor 起動前に作業ツリーの変更状況を取得し、今回の試行差分を既存変更と識別可能にしており、仕様と一致。                                                               |
| 4.2 未完了・保護違反・範囲不足の早期停止 | `executorCompletionFailure`, `resumedTargetCoverageFailure`, `outcome.protectionBlock`              | 一致 | exit code 0 であっても未完了報告や保護違反、再開時の範囲不足を検知し、親検証・reporter へ進まず早期中断しており、仕様と一致。                                           |
| 4.3 親検証バッチの実行と証跡反映         | `appendParentValidationsToExecutorEvidence`                                                         | 一致 | executor 成功後に runner が親検証を実行し evidence に追記する。親検証失敗時も reporter を呼んで result を残す構造となっており、仕様と一致。                             |
| 4.3 reporter 形式再試行と結果描画        | `runReporterWithFormatRetry`, `renderReporterResult`, `deriveReporterFacts`                         | 一致 | reporter 出力の形式リトライ、Markdown 描画、事実判定による成否判定（`facts.outcome === "complete"` のみ exit 0）を担っており、仕様と一致。                              |
| 4.5 reporter 再開時の親検証再評価        | `refreshParentValidationsForReporterResume`                                                         | 一致 | 再開前に統合先の変更が取り込まれた場合（force）や失敗時に親検証を再実行し、成功済みかつ変更なしの場合は既存検証を再利用しており、仕様と一致。                           |
| 4.5 前試行スナップショット退避           | `snapshotRunAttempt`                                                                                | 一致 | 再開実行時（`resumedExecutor`）に前試行の段状態を退避しており、履歴保護の仕様と一致。                                                                                   |
| 5.1 同時実行ゲート制御                   | `params.providerConcurrencyGate?.run`                                                               | 一致 | executor および reporter の双方で provider 単位の同時実行ゲート制御を通過させており、仕様と一致。                                                                       |
| 5.1 実行時間・資源制約の受入値           | `execDefaults` による外部注入                                                                       | 一致 | ハードコードせず `execDefaults` からタイムアウト値等を注入する実装となっており、設定契約として仕様を整合させた。                                                        |
| 4.1, 4.4 worktree 隔離と Git 統合操作    | `agent-pipeline.ts` 外部の runner が担当（呼び出し元で `worktreeStatusPaths` 等を組み合わせて制御） | 一致 | `agent-pipeline.ts` は段実行と証跡記録に特化し、Git 統合やタスク完了記録は呼び出し元の runner が担う責務分担となっており、境界定義として仕様と一致。                    |

### 5.3. 成果物

- `docs/ja/product/010-business-specs/050-system-functions/sf-task-execution.md`

### 5.4. 迷った点とその判断理由

- **実装エビデンス照合表の移送先と記録方針（F004, F005, F007）**:
  - 1 回目の指示では成果物本文への照合表追加が求められていたが、[[specdojo:sf-rulebook|sf-rulebook]] の「実装の名前・内部の構造を書かない」規則に反していた。レビュー指摘 F004・F005・F007 に従い、成果物本文から照合表を削除した。
  - 判断: タスク完了条件である実装整合性エビデンスを担保しつつ rulebook の要件を満たすため、外した照合の表は個票（本登録簿項目）の対応結果「5.2 実装との照合の記録」に移送して記録・保持することとした。
- **実装固有用語・オプション名の業務論理表現への置換（F007, F008）**:
  - `ProviderConcurrencyGate`、`ExecEvidence`、`PipelineState`、`--resume` など、実装ファイル内の識別子や CLI オプションが本文に残存していた。
  - 判断: `sf-rulebook` の精神に従い、これらを「プロバイダ同時実行ゲート機能」「実行証跡」「パイプライン段状態記録」「再開コマンド」のように、機能責務を客観的に表現する業務論理用語に置換し、操作や構文の詳細は各参照ガイド・コマンドリファレンスへ委ねる構成とした。
- **未作成 BPS との対応記述方針（F001〜F003, F006）**:
  - 先行成果物 `bps-task-selection-preparation` 等が未作成である中での対応付け方針。
  - 判断: カタログ `dct-business-model-bps.yaml` で確定している処理ステップ ID（`P-07-01`〜`P-07-05`、`P-11-01・02`）に基づき、各ステップの責務と本機能の処理要件節（4.1〜4.5）の対応関係を確定させた。詳細ステップの最終確認については第 8 章の未決事項および `ready` 昇格ゲートとして管理する整理を維持した。

### 5.5. 残課題

- 上流 BPS（`bps-task-selection-preparation` 等）の正本作成時に、詳細処理ステップ ID と本仕様の整合性を最終確認する（`PJR-2GD6` で追跡）。
- 外部連携仕様 `ifx-cmd-ai-provider-cli` の作成および本番運用における資源制約（実行時間・同時実行数）の最終受入値確定（`PJR-BCAQ` 後続レビューで追跡）。

### 5.6. CHANGELOG に書く事項

なし

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[prj-0001:sf-task-execution]]
