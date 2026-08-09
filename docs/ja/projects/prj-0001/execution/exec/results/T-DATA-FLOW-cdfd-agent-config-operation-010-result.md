---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-agent-config-operation-010
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-agent-config-operation-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-agent-config-operation-010-plan.md
  started_at: "2026-08-09T21:16:50.429Z"
  completed_at: "2026-08-09T21:24:48.823Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: retrofit
  targets:
    - prj-0001:cdfd-agent-config-operation
---

# Edit Result

## 1. 実施内容

対象成果物が存在しなかったため「新設」を選択し、`P-07 構成変更` の領域別 CDFD を作成した。作業要件または実行上の問題を起点に、変更要件・問題評価、構成案作成、権限・安全境界確認、人間承認、承認済み設定変更、構成検証・引き渡しへ進む正常経路を、同じプロセス ID・名称の一覧と Mermaid 図で定義した。

あわせて、`sch-strategy-<track>.yaml`、`pm-members.yaml`、`.specdojo/exec-defaults.yaml`、provider 固有設定、環境・CLI 認証ストアの変更責務と相互参照を整理し、認証情報の分離、最小権限、プロンプトインジェクション対策、人間専用の承認境界を記載した。capability 不足、provider 利用不能、設定不整合、権限超過、承認不成立について、停止・差し戻し・再開条件を主要例外として定義した。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-agent-config-operation.md`（新規）
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-agent-config-operation-010-result.md`（本 result）

## 3. 申し送り

- `src/exec-strategy.ts` は、読込不能な `sch-strategy-*.yaml`、phase set 選択の正規化エラー、または一部の不正値を読み飛ばし、既定値へ解決する経路を持つ。上流の schema 検証で必ず停止する契約が指定 evidence からは確認できないため、設定不整合を実行時に明示エラーとするか、上流検証を必須ゲートとして設計・テストで保証するかを ARC・QE が確認する。
- `src/exec-agent-config.ts` は、`providers.<provider>.max_concurrency` が未指定・非整数・非正値の場合に「provider 制限なし」として扱う。schema 検証で不正値を拒否する経路は指定 evidence 外であるため、誤設定を無制限実行へ読み替えてよいかを確認し、必要なら検証強化を別タスクにする。
- 同実装には `.specdojo/exec-agent.yaml` と `exec-strategy-*.yaml` を参照する互換 fallback が残る。移行期間・廃止条件・承認根拠は今回の参照範囲から確認できないため、現行正本との二重管理リスクを後続で確認する。

## 4. 進め方と実践の型の適用

`approach: retrofit` として、実装を意図された仕様の正本とはみなさず、指定 evidence から抽出した現在動作、既存成果物・決定記録・プロジェクト文脈が示す意図、カタログの done criteria を照合した。文書構造は `specdojo:cdfd-rulebook`、図の記号・ラベル・領域外ノードは同 rulebook が include する `specdojo:cdfd-mermaid-rulebook` に従った。対象成果物は不存在で、カタログに path と done criteria が定義済みだったため「新設」と判断した。

### 4.1. 参照した実装エビデンスと現在動作

| 実装エビデンス             | 抽出した現在動作                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/exec-agent-config.ts` | `.specdojo/exec-defaults.yaml` から provider 別 command template・変数、利用制限検出・policy、並列上限を読み、member の provider・mode・proficiency・nickname から起動コマンドを解決する。member 個別 command があれば上書きし、command source がなければ実行候補にできない。template の未解決変数、組み込み変数の再定義、mode / proficiency 間の変数重複、不正 nickname はエラーにする。利用制限の detection と policy は独立して provider 上書きから解決し、片方がなければ global へ fallback する。provider 並列上限は実行中件数を reserve / release して判定する。現行ファイルがない場合は旧設定を参照する互換 fallback がある |
| `src/exec-strategy.ts`     | `sch-strategy-*.yaml` の phase set、既定 phase set、owner rule、成果物別 phase override、cross-deliverable pass から、task の mode・execution・approach・capabilities・proficiency と owner を索引化する。成果物別 override、phase 定義、既定値の順に解決し、未指定時は mode=`edit`、execution=`agent`、capabilities=`[]`、approach / proficiency=`undefined` とする。strategy の読込・phase set 正規化に失敗したファイルは読み飛ばす経路がある                                                                                                                                                                                    |

### 4.2. 照合結果

| 分類     | 照合内容                                                                                                                                                                | 成果物での扱い                                                                                                                                                    |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 一致     | phase の mode・execution・approach・capabilities・proficiency を strategy から解決し、member の provider・mode・proficiency と provider command template を連携する責務 | `P-07-02`、`P-07-05` と「構成正本の変更責務と相互参照」へ反映した                                                                                                 |
| 一致     | provider 別の command、利用制限検出・policy、並列上限と、nickname・template 変数の検証                                                                                  | 構成案、設定変更、構成検証、および `E-02`・`E-03` へ概念レベルで反映した                                                                                          |
| 意図仕様 | 人間による変更承認、認証情報の設定文書からの分離、mode・targets に応じた最小権限、worktree・commit 許可範囲・外部通信制限を組み合わせたプロンプトインジェクション対策   | 現行実装の目的から推測せず、依存 CDFD、既存の agent 共通設定、exec 設定ガイド、完了済み決定記録、done criteria を根拠に `P-07-03`・`P-07-04` と承認条件へ反映した |
| 乖離候補 | strategy の読込・一部正規化失敗を読み飛ばす動作は、「設定不整合を検知して差し戻す」という意図と両立するための前提が指定 evidence だけでは確認できない                   | 意図仕様の `E-03` を維持し、実装または上流検証契約の確認候補として申し送った                                                                                      |
| 乖離候補 | 不正な provider 並列上限を「制限なし」と扱う現在動作は、誤設定を検知する意図との整合が指定 evidence だけでは確認できない                                                | 成果物へ無条件に合わせず、検証強化または仕様確認の候補として申し送った                                                                                            |
| 未確認   | provider 固有 CLI の実際の権限設定、認証ストア、worktree・commit 許可リスト、member 選択全体、schema 検証、provider 疎通確認、Schedule 再展開                           | evidence_refs 外のため現在動作とは断定せず、既存の意図仕様として境界だけを記載した                                                                                |

### 4.3. 成果物への反映判断

- 判断: **新設**。
- 根拠: 対象 path に成果物が存在せず、成果物カタログに path、depends_on、rulebook、done criteria が定義済みである。`P-07` の全体境界は既存 overview と task execution に存在するが、領域内の正常経路、正本責務、承認条件、例外後の再開条件は詳細化されていなかった。
- 反映内容: `P-07-01`〜`P-07-06` の表・図、四つの構成正本と認証ストアの責務、権限・安全境界の承認条件、五つの主要例外、`P-01`〜`P-04` への委譲、BA・ARC・PO・QE の受入条件を新設した。
- 未反映の乖離: strategy 読み飛ばし、不正な provider 並列上限の無制限扱い、旧設定 fallback は、承認根拠または全体経路を確認できなかったため成果物の正常仕様へ取り込まず、上記申し送りに残した。実装を変更する場合は本タスクへ混在させず別タスクとする。
- 未確認範囲: 指定された二つの実装ファイルから呼び出される roster 読込、schema 検証、agent 選択、provider process 起動、権限適用、worktree commit、状態 event、外部 CLI・認証サービスの分岐は調査対象外とした。指定 evidence の全パスは読み取れたため、未調査の evidence path はない。

## 5. 検証結果

- `npx prettier --write docs/ja/product/010-business-specs/010-data-flow/cdfd-agent-config-operation.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-agent-config-operation-010-result.md`: 成功。
- `npx markdownlint docs/ja/product/010-business-specs/010-data-flow/cdfd-agent-config-operation.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-agent-config-operation-010-result.md`: 成功。エラーなし。
- `node --import tsx src/specdojo.ts catalog validate`: 成功。全 8 catalog が `OK`。未作成の別成果物に関する既存 warning は出たが、本成果物の path・frontmatter・`based_on` にエラーはない。
- `node --import tsx src/specdojo.ts index build`: 成功。1025 文書を索引化した。
- `git diff --check`: 成功。空白エラーなし。

標準起動方法の `npx tsx src/specdojo.ts catalog validate` と `npx tsx src/specdojo.ts index build` は、sandbox が `/tmp/tsx-1000/*.pipe` の IPC socket 作成を `EPERM` で拒否したため起動できなかった。検査内容を変えず、tsx の Node loader を直接使う上記コマンドへ切り替えて両検査の成功を確認した。
