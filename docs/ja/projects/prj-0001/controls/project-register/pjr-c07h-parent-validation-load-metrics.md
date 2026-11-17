---
specdojo:
  id: prj-0001:pjr-c07h-parent-validation-load-metrics
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-17T12:22:09Z"
  due_on: "2026-11-30"
  block_reason: "parent validation failed: lint-ts, test-unit"
  commit_type: feat
  commit_scope: exec
---

# PJR-C07H 親の検証の時間切れの原因を調べるため、検証の実行時の負荷と待ち時間を記録する

## 1. 概要

並べて流した run の親の検証が時間切れになる原因を特定するため、各検証の開始・終了時刻、検証の順番待ち、同時に動く run、CPU・メモリ・I/O の負荷を記録に残す

## 2. 入力

- 2026-11-16〜17 に、並べて流した run の親の検証（統合テストなど）が時間切れで止まることがあった。親の検証は `parent_validation_concurrency:` 1 で 1 件ずつ流れ、各検証の上限は 10 分である
- orchestrator の調べ（2026-11-17）: 止まった時間帯に動いていたのは opus・sol・sonnet の agent だけで、opencode のローカル LLM（Mac の Ollama）は使われておらず、job も動いていなかった。原因の候補は、親の検証の直列化の外で executor が流すテスト、メモリの圧迫（container は 15GB・swap 4GB のうち 2.9GB 使用）、共有フォルダの I/O の遅さ（PJR-TATP）である
- 利用者が 2026-11-17 に、対策の前に原因を明確にするよう指示し、計測の todo の起票を依頼した。自動の再開（PJR-52EE）は原因が分かるまで保留している

## 3. 完了条件

- 親の検証の記録に、検証ごとに開始・終了の時刻と所要時間、順番待ちの時間（`ParentValidationGate`）、その時点で動いている run と executor の数を残す。
- 検証の開始・終了・時間切れの時点で、CPU・メモリ・I/O の負荷（Linux の `/proc/pressure`、メモリと swap の使用量）を記録する。取れない環境では記録を省き、検証そのものは止めない。
- 時間切れのときは、どのテストのファイルを流していたかが分かる情報を残す。
- 検証の動き（順番・上限・合否の判定）は変えない。計測で検証が目立って遅くならない。
- 記録の見方を [[specdojo:exec-operation-guide|exec運用ガイド]] に書く。
- 原因の分析と対策は、記録がたまってから別の項目で行う。この項目では行わない。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                              | 担当 | 状態 | メモ                                                                                  |
| --- | --------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------- |
| 1   | 記録する項目と置き場所を決める    | DEV  | done | run ごとの JSONL へ追記し、バッチ ID で再開前後を区別する                             |
| 2   | 計測を実装し、テストを足す        | DEV  | done | 待機・検証イベント、負荷、run/executor 数、時間切れ時のファイル追跡と回帰テストを追加 |
| 3   | exec 運用ガイドに記録の見方を書く | DEV  | done | フィールド・配置・計測範囲・取得できない場合を記載                                    |

## 5. 対応結果

### 5.1. 実施内容

- `src/exec/validation-metrics.ts` に計測を集約した。`ParentValidationGate` の要求・取得と、各検証の開始・終了・時間切れを `parent-validation-metrics.jsonl` へ追記する。検証の UTC 時刻と単調時計の所要時間、同一プロセス内と共有ロックの待ち時間、Linux PSI・メモリ・swap 使用量、同じ project の run/executor 数を保存する。
- 通常の pipeline、in-place、reporter/統合からの再開では evidence と同じディレクトリに保存し、trial は比較記録の trial ディレクトリに保存する。バッチ ID と検証 ID・repo で記録を対応付ける。既存 evidence の構造と検証判定は変えていない。
- Vitest の既定 reporter に通知用 reporter を追加し、親検証時だけテストファイルの開始・終了を通知する。時間切れでは終了要求より先に実行中ファイルと直近の出力を保存する。順序・同時数・10 分の上限・合否は維持した。
- 回帰テストに、負荷取得の欠落、executor の開始・終了と reporter 除外、ローカル/共有枠の待機、再開時の追記、repo の区別、時間切れ時のファイル保持、書き込み不能時の続行を追加した。親検証のテスト・型・lint は executor では重複実行せず runner に委ねる。
- [[specdojo:exec-operation-guide|exec運用ガイド]] に記録の見方を追加した。

### 5.2. 判断と申し送り

- 負荷は境界時点でだけ採取する。継続的な走査やベンチマークは負荷を増やすため行わない。取得・保存できない場合は検証を続ける。
- run は heartbeat が有効な primary/join の枠、executor はこの版の runner が起動した生存中の子プロセスを数える。共有ロックのない場合は自プロセスだけが対象。別 project・旧版 runner・手動起動のテストは含まない。コマンド、prompt、環境変数は収集しない。
- テストファイルは開始・終了通知から特定し、最後に完了したファイルから推測しない。通知に対応しない別リポジトリ、初期化前の停止では未特定となる。メモリは `/proc/meminfo` の値で、cgroup 上限ではない。
- 保護された設定と `CHANGELOG.md` は変更していない。原因分析・対策・PJR-52EE の再開判断は、実運用の記録がたまってから別項目で行う。
- 統合後は playbook に従って PJR-JSEY の runner 動作確認を行い、実運用の並行 run の JSONL を確認する。実 agent 起動と統合先の操作が必要なため executor sandbox では行わない。

### 5.3. CHANGELOG に書く事項

- 追加: 親検証の待ち時間・実行時間、同時実行中の run/executor 数、Linux の負荷、時間切れ時の実行中テストファイルを run ごとの計測ログへ保存する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-52ee-exec-watch-auto-recover]]
- [[prj-0001:pjr-tatp-devcontainer-named-volumes]]
