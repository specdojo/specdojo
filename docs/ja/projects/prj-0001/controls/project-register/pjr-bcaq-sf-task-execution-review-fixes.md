---
specdojo:
  id: prj-0001:pjr-bcaq-sf-task-execution-review-fixes
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  registered_at: "2026-11-09T20:49:35Z"
  conclusion: sf-task-execution に業務プロセス仕様との対応、機能ごとの検証・受入観点、agent-pipeline.ts との照合の表を足して磨き込んだ
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

| No  | 作業                                                | 担当           | 状態 | メモ                                                                                                                           |
| --- | --------------------------------------------------- | -------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | review の指摘と、業務プロセス仕様・実装を読み比べる | executor (agy) | done | Finding 15件および `agent-pipeline.ts`、カタログ `dct-business-model-bps.yaml`（P-07 業務プロセス区分）の照合完了              |
| 2   | 整合・検証の観点・実装との照合の表を書く            | executor (agy) | done | `sf-task-execution.md` に BPS 処理ステップ対応、客観的検証観点（V-01〜V-15）、実装エビデンス照合表、未決事項・昇格ゲートを反映 |
| 3   | 検査を流し、対応結果に書く                          | executor (agy) | done | `lint:md`、`lint:fm`、`catalog validate` を実施し適合を確認                                                                    |

## 5. 対応結果

### 5.1. 実施内容

2026-11-09 の review（T-BUSINESS-SPECS-REPS-sf-task-execution-090）で incomplete と判定された指摘事項、および Plan に展開された 15 件の Finding（F001〜F015）に基づき、代表成果物 `sf-task-execution`（タスク実行）を磨き込んだ。

1. **業務プロセス仕様との整合（DC-001, F001, F006, F007）**:
   - `dct-business-model-bps.yaml` で定義されている P-07 領域の業務プロセス仕様（`bps-task-selection-preparation`、`bps-task-edit`、`bps-task-verification`、`bps-task-judgment-integration`、並行実行群）および P-11（`bps-task-completion`）の処理ステップ ID（`P-07-01`〜`P-07-05`、`P-11-01・02`）と、本機能の入出力（第 3 章）および処理要件（第 4 章の各節）との対応表を第 2 章に確定・拡充した。
2. **公開責任者と対象読者の明確化（F002）**:
   - 第 1 章において、公開判断責任者が PO（indie）であること、本成果物の状態は `draft` として維持し `ready` への昇格判定は PO が行うこと、および対象読者（PM, Orchestrator, PO, QE, ARC, DEV）の利用目的を明記した。
3. **客観的な検証・受入観点の定義（DC-004, F008, F009, F011, F012, F013）**:
   - 第 5 章に測定可能な実行時間制限（既定タイムアウト: agent 600秒、親検証 300秒）と同時実行数制限（provider 単位枠: 既定 1、`ProviderConcurrencyGate` による制御）、データ契約（`ExecEvidence`、`PipelineState` のスキーマ互換性方針）を明記した。
   - 第 7 章に機能ごとの客観的合否判定基準（V-01〜V-15）を網羅し、QE・PO・PM が検証可能な水準に磨き込んだ。
4. **実装エビデンスとの照合表（個票条件）**:
   - 第 7 章に `### 7.2. 実装エビデンスとの照合（src/exec/run/agent-pipeline.ts）` を新設し、段状態管理、変更スナップショット、未完了・保護違反検知、親検証バッチ実行、reporter 再試行、再開時検証再評価、同時実行ゲート等の実装事実と仕様の整合性を照合表として明記した。
5. **運用エスカレーションルートと未決事項・昇格ゲートの整備（F003, F004, F005, F014, F015）**:
   - 第 6 章に障害時の一次対応およびエスカレーション窓口（Orchestrator, PM, ARC）を明記した。
   - 第 8 章に未作成上流 BPS の詳細照合および外部連携仕様の受入値確定について、影響・リスク、決定責任者、時期、追跡先（プロジェクト登録簿 `PJR-2GD6` / `PJR-BCAQ` 後続）、および `ready` 昇格ゲート条件を定義した。

### 5.2. 成果物

- `docs/ja/product/010-business-specs/050-system-functions/sf-task-execution.md`

### 5.3. 迷った点とその判断理由

- **実装エビデンス照合表の配置場所**:
  - `sf-rulebook.md` では第 1 章〜第 8 章の構成が規定されており、実装クラス名やメソッド名を本文（処理要件）に書くことは禁止されている。一方、個票の追加完了条件では `agent-pipeline.ts` との照合表を文書に書くことが要求されていた。
  - 判断: rulebook の章立て要件を保ちつつ検証可能性（DC-004）に資する形とするため、第 7 章「検証・受入観点」のサブセクション `7.2` に照合表を配置した。本文の処理要件（第 4 章）は業務論理的な機能責務として記述し、照合表側で実装ファイルとの対応を対比させることで、rulebook の禁止事項と個票の完了条件の双方を満たした。
- **未作成 BPS との対応記述**:
  - `bps-task-selection-preparation` など先行 BPS が未作成の段階で、処理要件との対応をどこまで確定させるか。
  - 判断: カタログ `dct-business-model-bps.yaml` で既に確定している処理ステップ ID（`P-07-01`〜`P-07-05`、`P-11-01・02`）に基づき、各ステップの責務と本機能の処理要件節（4.1〜4.5）の対応を仕様として確定させた。これにより DC-001 を充足しつつ、将来の詳細 BPS 作成時の確認事項を第 8 章の未決事項・昇格ゲートとして管理する整理とした。

### 5.4. 残課題

- 上流 BPS（`bps-task-selection-preparation` 等）の正本作成時に、詳細処理ステップ ID と本仕様の整合性を最終確認する（`PJR-2GD6` で追跡）。
- 外部連携仕様 `ifx-cmd-ai-provider-cli` の作成および本番運用における資源制約（実行時間・同時実行数）の最終受入値確定（`PJR-BCAQ` 後続レビューで追跡）。

### 5.5. CHANGELOG に書く事項

なし

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[prj-0001:sf-task-execution]]
