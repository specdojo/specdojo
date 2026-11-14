---
specdojo:
  id: sysd-cross-cutting-policy
  type: architecture
  status: draft
  rulebook: specdojo:sysd-cross-cutting-policy-rulebook
  based_on:
    - sysd-index
  part_of:
    - sysd-index
---

# SpecDojo システム設計横断ルール

SpecDojo の実装・運用に共通する制約と受入条件の正本である。値・構文・データ構造は [[sysd-index|システム設計索引]] が示す実装・schema・リファレンスへ委ね、本書は適用条件、意図、検証、未決事項を管理する。

## 1. 概要（適用範囲・優先順位）

対象は CLI、agent / runner、Git / worktree、Job / Routine / Grade、文書・サイト生成、VS Code 拡張に共通するエラー、冪等、タイムアウト、ログ・監査、トレーシング、設定、モジュール境界である。agent 固有規則は agent 実行だけに適用する。常駐 HTTP API・外部イベントバス・RDBMS は設計索引の現行構成では非該当であり、CLI・外部プロセス・ファイル保存で代替する。導入時は適用範囲を再判断する。

[[prj-0001:prj-overview|プロジェクト概要]] の `BV-01` には人間の判断責任と変更追跡、`BV-02` には無限再試行と重複処理の防止、`BV-03` には監査・回復情報の共有で寄与する。対象者は開発・AI Agent 活用担当と将来の貢献者であり、属人的な障害対応と再調査の負担を減らす。価値の成功基準そのものは上位文書へ委ねる。

競合時は秘密・権限・保存状態の保護を優先し、それに反する retry、fallback、設定上書きを採用しない。例外は「例外（DECリンク）」に集約する。本書の MUST は設計制約であり、実装済みの保証ではない。

### 1.1. 利用・確認・承認責務

| Role       | 合意・確認対象                                                               |
| ---------- | ---------------------------------------------------------------------------- |
| ARC        | 横断制約・適用境界・変更影響と正本への導線を保守する                         |
| DEV        | 実装、schema、設定解決と各規則の適合状況を照合する                           |
| QE         | 入力別期待結果と検証証跡から適合・不適合を判定する                           |
| OPS        | 監視・秘匿化・再開条件と障害時の引継ぎを確認する                             |
| PM         | 未決事項・不適合を登録簿と Schedule へ接続して追跡する                       |
| PO（人間） | 留保・差し戻し・公開可否を最終判断し、説明責任を負う。`ready` 昇格を承認する |

## 2. ルール一覧（ID/カテゴリ/要約/必須度）

| Rule ID     | Category      | Summary                                                  | Level    | Owner     |
| ----------- | ------------- | -------------------------------------------------------- | -------- | --------- |
| scp-EXE-001 | Execution     | CLI・agent・runnerの3層責務を分離する                    | MUST     | ARC       |
| scp-EXE-002 | Execution     | editとreviewを権限・成果で分離する                       | MUST     | ARC / QE  |
| scp-SEL-001 | Selection     | phase要件とmember属性で実行者を選択する                  | MUST     | ARC       |
| scp-CFG-001 | Configuration | provider起動コマンドを宣言的に解決する                   | MUST     | ARC       |
| scp-CFG-002 | Configuration | 秘密情報を設定・文書へ保存しない                         | MUST NOT | ARC / OPS |
| scp-STA-001 | State         | eventをappend-onlyとし状態訂正を追記する                 | MUST     | PM / ARC  |
| scp-STA-002 | State         | reopenを人間によるdoneからtodoへの訂正に限定する         | MUST     | PM        |
| scp-RET-001 | Retry         | provider固有シグナルで利用制限を判定する                 | MUST     | ARC       |
| scp-RET-002 | Retry         | retry・fallback・停止の適用条件と上限を確認する          | MUST     | ARC / OPS |
| scp-RET-003 | Retry         | 自動再開は根拠のある再開時刻と排他を要求する             | MUST     | ARC / OPS |
| scp-GIT-001 | Git           | 並列edit taskをtask単位worktreeへ分離する                | MUST     | ARC       |
| scp-GIT-002 | Git           | commit・merge・completeを順序保証する                    | MUST     | ARC       |
| scp-GIT-003 | Git           | Git共有資源の一時競合だけを安全に再試行する              | MUST     | ARC       |
| scp-GIT-004 | Git           | agentへrepository固有環境を継承せずGit状態変更を検知する | MUST     | ARC       |
| scp-SEC-001 | Security      | agentへ無制限権限・秘密情報を与えない                    | MUST NOT | ARC / OPS |
| scp-SEC-002 | Security      | agentによる親実行設定の変更を統合・実行しない            | MUST NOT | ARC / OPS |
| scp-ERR-001 | Error         | 共通の失敗分類と利用者の次の手を示す                     | MUST     | ARC / DEV |
| scp-IDM-001 | Idempotency   | 同一論理処理と再試行を識別する                           | MUST     | ARC / DEV |
| scp-TIM-001 | Timeout       | 時間上限と打切り後の保存・再開条件を定める               | MUST     | ARC / OPS |
| scp-LOG-001 | Logging       | 診断ログと監査証跡を分け秘密を残さない                   | MUST     | OPS / QE  |
| scp-TRC-001 | Tracing       | 実行から結果まで同じ識別子で追跡する                     | MUST     | ARC / OPS |
| scp-CFG-003 | Configuration | 設定項目ごとに上書き階層と反映時点を特定する             | MUST     | ARC / DEV |
| scp-MOD-001 | Module        | 機能境界と実行時依存を正本で検証する                     | MUST     | ARC / DEV |

### 2.1. 適合確認の順序と時機

現時点の各規則の実装済み・未実装の照合結果は未取得である。既存規則を残すことや検証先が存在することを適合済みと数えない。以下の確認群で全 Rule ID を覆い、DEV が実装済み・不足・非該当と証跡を記録し、QE が判定した後に PM が残作業を計画へ展開する。実作業の進捗正本は Schedule / PJR とする。

| 確認群        | Rule ID                                               | 現状                            | 依存・確認タイミング                       | 担当           |
| ------------- | ----------------------------------------------------- | ------------------------------- | ------------------------------------------ | -------------- |
| V1 責務・保護 | EXE-001〜002、SEL-001、GIT-001〜004、SEC-001〜002     | 既存規定・実装適合未照合        | 全変更の起動・統合前。最初に保護境界を確認 | ARC / DEV / QE |
| V2 設定       | CFG-001〜003                                          | CFG-003 を補強・適合未照合      | V1 後、provider 起動前と設定変更時         | DEV            |
| V3 失敗・回復 | ERR-001、IDM-001、TIM-001、RET-001〜003、STA-001〜002 | 規定補強・上限等は Q1 / Q2 待ち | V2 後、再実行・自動再開の受入前            | DEV / OPS / QE |
| V4 観測       | LOG-001、TRC-001                                      | 規定追加・通知等は Q3 待ち      | V3 の失敗注入時と公開前                    | OPS / QE       |
| V5 境界       | MOD-001                                               | 規定追加・適合未照合            | 機能追加・import 変更時、公開前            | ARC / DEV      |

表内の短縮 ID は `scp-` を補って読む。Q1〜Q4 の判断待ちは「未決事項と公開前確認」で管理する。

## 3. 各ルール詳細（ID単位）

### 3.1. scp-EXE-001: 3層責務分離

- **Rule（MUST）**: SpecDojo CLIは状態・依存・記録、agentはplanに限定した成果物処理、runnerは選択・起動・並列・worktree・終了反映を担当する。agentはschedulerまたは状態管理者として動作しない。
- **Rationale（意図）**: 内容判断と排他・統合制御を分離し、provider差し替え時もtask状態を一貫させる。
- **Scope（適用範囲）**: 全provider、edit / review、register item実行、schedule task実行。
- **Enforcement（検証）**: agent指示、runner統合テスト、event actorと状態遷移の検証。
- **Exception（例外）**: 人間が明示的に行うin-place操作は対象外だが、状態を追跡する場合は同じevent規則に従う。
- **References（参照）**: [[sysd-agent-settings|agent 実行設計 hub]]、[[prj-0001:stsd-task-execution|状態遷移仕様（タスク実行）]]。

### 3.2. scp-EXE-002: edit / review分離

- **Rule（MUST）**: phaseの`mode`でeditとreviewを区別し、review agentは成果物を変更しない。resultと許可されたevidence以外の変更を統合しない。
- **Rationale（意図）**: 作成者と検証者の役割を追跡し、レビューによる意図しない修正を防ぐ。
- **Scope（適用範囲）**: agent実行pipeline。
- **Enforcement（検証）**: member属性検証、commit対象許可リスト、review agent定義の権限制約。
- **Exception（例外）**: review結果を受けた修正は別のedit phaseまたはtaskとして行う。
- **References（参照）**: [[sysd-agent-settings|agent 実行設計 hub]] のプロバイダ別分冊。

### 3.3. scp-SEL-001: member選択

- **Rule（MUST）**: phaseの`mode`、`capabilities`、`proficiency`と、`.specdojo/agent-members.yaml`のmember属性を照合し、適合候補だけをpriority順に選択する。
- **Rationale（意図）**: scheduleへCLI名やモデル名を固定せず、要求と実行環境を分離する。
- **Scope（適用範囲）**: `exec run --auto`と明示member指定。
- **Enforcement（検証）**: 設定schema、候補解決テスト、適合候補なしの事前エラー。
- **Exception（例外）**: 人間taskは明示的に登録されたagent上書きがない限り自動起動しない。
- **References（参照）**: `.specdojo/exec-defaults.yaml`、`.specdojo/agent-members.yaml`。

### 3.4. scp-CFG-001: 起動コマンド解決

- **Rule（MUST）**: 起動コマンドは`providers.<provider>.command_template`と`command_params`から解決する。追加変数は`by_nickname`、`by_proficiency`、`by_mode`の順で優先し、memberの`command`は特殊構成だけに使う。plan本文は標準入力で渡す。
- **Rationale（意図）**: provider設定の重複とshell解釈による事故を防ぐ。
- **Scope（適用範囲）**: 全providerの非対話起動。
- **Enforcement（検証）**: 未解決placeholder、組み込み変数の再定義、template欠落を起動前にエラーとする。
- **Exception（例外）**: `provider: custom`はmember commandで上書きできる。
- **References（参照）**: [[sysd-agent-settings|agent 実行設計 hub]] の起動設定・プロバイダ別分冊。

### 3.5. scp-CFG-002: 設定と秘密情報

- **Rule（MUST NOT）**: command template、member、agent定義、文書へtoken、秘密鍵、個人環境だけの絶対pathを保存しない。認証は環境またはCLI認証storeから注入する。
- **Rationale（意図）**: repository経由の漏えいと環境依存を防ぐ。
- **Scope（適用範囲）**: 設定・文書・実行ログ。
- **Enforcement（検証）**: review、secret scan、設定schema。
- **Exception（例外）**: なし。
- **References（参照）**: [[sysd-agent-settings|agent 実行設計 hub]] の認証設計、未作成の `opd-access-management`（Q3）。

### 3.6. scp-STA-001: append-only event

- **Rule（MUST）**: task状態の変更は1 eventを1 JSONファイルとして追加して表し、既存eventを削除・変更しない。result、plan履歴、Git履歴を状態訂正のために消去しない。
- **Rationale（意図）**: 状態の再構成、破損箇所の特定、判断の監査を単純に保つ。保存粒度の変更はファイル数だけで判断せず、移行と監査への影響を確認する。
- **Scope（適用範囲）**: claim、note、block、unblock、complete、reopen、release、cancel、link、estimate。
- **Enforcement（検証）**: eventごとのschema検証、全eventの時系列fold、状態遷移検証、project lock。
- **Exception（例外）**: 破損ファイルの復旧は人間判断と別の監査記録を要求する。
- **References（参照）**: [[prj-0001:stsd-task-execution|状態遷移仕様（タスク実行）]]、[[specdojo:exec-operation-guide|exec運用ガイド]]の「実行eventの保存粒度」。

### 3.7. scp-STA-002: reopen

- **Rule（MUST）**: `reopen`は人間memberだけが理由付きで`done`から`todo`へ訂正する。活動中または完了済みの下流taskがある場合は拒否し、下流から整合させる。
- **Rationale（意図）**: 確定済み依存関係を無言で無効化しない。
- **Scope（適用範囲）**: 完了判定の訂正。
- **Enforcement（検証）**: actor type、遷移元、下流状態、理由の検証。
- **Exception（例外）**: 通常の再試行はreopenではなくblock / resume経路を使う。
- **References（参照）**: [[prj-0001:stsd-task-execution|状態遷移仕様（タスク実行）]]、[[specdojo:register-operation-guide|登録簿運用ガイド]]。

### 3.8. scp-RET-001: 利用制限検出

- **Rule（MUST）**: rate limit、session limit、quota、timeout、overloadはprovider固有の終了コード・stderr patternで判定し、raw signalと正規化状態を両方保持する。汎用`exit 1`だけで利用制限と判定しない。
- **Rationale（意図）**: agent自身のblockや通常失敗を誤ってretryしない。
- **Scope（適用範囲）**: provider processの異常終了。
- **Enforcement（検証）**: provider別fixture、exit 0時の誤検出防止テスト。
- **Exception（例外）**: providerが専用終了コードを保証する場合だけ単独判定に使用できる。
- **References（参照）**: [[sysd-agent-settings|agent 実行設計 hub]] のプロバイダ別分冊、`.specdojo/exec-defaults.yaml`。

### 3.9. scp-RET-002: retry / fallback / block

- **Rule（MUST）**: 再試行には冪等性または途中状態の照合、有限の attempt・待機上限、適合候補への切替条件を要求する。quota exhausted は自動 retry しない。設定・条件が確認できない経路を自動化の受入済みとしない。
- **Rationale（意図）**: 利用枠と参加者の待機負荷を制限し、不明な途中状態への重複実行を防ぐ。
- **Scope（適用範囲）**: provider 障害後の retry / fallback / block。
- **Enforcement（検証）**: 次表の入力別期待結果を V3 で確認する。許可された根拠には criticality 区分、signal 対応、attempt・backoff の値または設定キーの定義がないため、Q1 で実装と設定正本を照合するまで数値境界の合否は保留する。
- **Exception（例外）**: 保護違反、内容競合、冪等性不明は自動再試行の例外許可で回避しない。
- **References（参照）**: [[sysd-index|設計索引]] の設定正本・変更の入口、[[sysd-critical-flows|重要フロー]]。

| 入力・前提                                           | 期待する判断・観測結果                                                  |
| ---------------------------------------------------- | ----------------------------------------------------------------------- |
| 汎用非ゼロ終了のみ、専用 signal なし                 | 利用制限と断定せず失敗記録を保持する                                    |
| quota exhausted                                      | 自動 retry しない。fallback 可否は適合候補と Q1 の確定方針で判定する    |
| 一時制限、冪等性・上限・適合候補を確認済み           | 正本の条件で retry / fallback。上限到達時の処置も同じ方針で一意に決める |
| criticality・signal 対応、上限、または途中状態が不明 | 受入保留。ARC / DEV が Q1 を解消し、OPS が回復条件を確認する            |
| 推測の再開時刻しかない                               | 自動再開せず人間の判断を待つ（RET-003）                                 |

### 3.10. scp-RET-003: 延期と自動再開

- **Rule（MUST）**: 自動再開はprovider reset、retry-after、明示cooldownのいずれかから再開時刻を解決できる場合だけ許可する。scheduler lock内で最新eventを再読込し、一つのprocessだけが再開を確保する。
- **Rationale（意図）**: 推測時刻による再失敗と多重再開を防ぐ。
- **Scope（適用範囲）**: 利用制限でblockしたtask。
- **Enforcement（検証）**: resume時刻、timezone、重複起動、quota除外のテスト。
- **Exception（例外）**: 時刻根拠がない場合は人間による再開判断を待つ。
- **References（参照）**: [[sysd-critical-flows|重要フロー]]、未作成の `opr-incident-response`（Q3）。

### 3.11. scp-GIT-001: task単位worktree

- **Rule（MUST）**: 並列edit taskはproject修飾task IDから導出したbranchとworktreeへ分離する。成果物を変更しないreview taskは分離不要とする。
- **Rationale（意図）**: 同じworking treeへの同時書き込みを防ぎ、taskごとの変更を追跡する。
- **Scope（適用範囲）**: worktree modeのagent実行。
- **Enforcement（検証）**: path・branch対応、repository外base、既存worktree所属の検証。
- **Exception（例外）**: 明示的なin-place単一実行。
- **References（参照）**: [[sysd-critical-flows|重要フロー]]のworktreeフロー、[[specdojo:exec-worktree-guide|Worktree ガイド]]。

### 3.12. scp-GIT-002: commit・統合・完了順序

- **Rule（MUST）**: agent成功後に検証、result確定、許可対象commit、project統合先への直列merge、complete、worktree削除の順で処理する。blockまたは競合時は未統合branchとworktreeを保持する。
- **Rationale（意図）**: 成果物未統合のままtaskを完了扱いにする事故を防ぐ。
- **Scope（適用範囲）**: edit taskの統合。
- **Enforcement（検証）**: merge ancestor、dirty target、overlap、complete event順序の検証。
- **Exception（例外）**: 再生成可能な派生物だけは削除時に明示して破棄できる。
- **References（参照）**: [[specdojo:exec-worktree-guide|Worktree ガイド]]、[[sysd-critical-flows|重要フロー]]。

### 3.13. scp-GIT-003: 共有Git資源の競合

- **Rule（MUST）**: `.git/index.lock`競合のように変更前と判定できる一時失敗だけを短いbackoffで上限付き再試行する。内容競合は自動解消しない。
- **Rationale（意図）**: 安全な一時競合と意味のあるmerge conflictを区別する。
- **Scope（適用範囲）**: 並列worktreeのGit操作。
- **Enforcement（検証）**: lock error識別、retry上限、merge conflict保持のテスト。
- **Exception（例外）**: なし。
- **References（参照）**: [[sysd-critical-flows|重要フロー]]のworktreeフロー。

### 3.14. scp-GIT-004: agent・テストのGit環境隔離と状態ガード

- **Rule（MUST）**:
  - agent・子プロセス・親検証・テストへ repository 固有の Git 環境を継承しない。
  - commit と Git 設定変更は親 runner が担い、agent 起動前後の HEAD・共有 local config の変更を検知したら後続段階へ進めない。
  - runner 自身の表示用 metadata 以外は検知から除外しない。fixture の identity はプロセス環境に限定する。
- **Rationale（意図）**: 別 repository を操作するつもりの Git 呼出しが実 repository を変更する事故を防ぐ。
- **Scope（適用範囲）**: 全 agent 起動経路、親検証、Vitest worker。shell / npm script の直接 Git 起動は TypeScript 静的検査の範囲外であり、呼出し境界で隔離する。
- **Enforcement（検証）**: `gitEnvironment()` と共通 Vitest setup、Git 起動の静的検査、HEAD / config ガードの回帰を V1 で確認する。危険な環境の注入と agent の状態変更では停止し、runner 表示用 metadata だけの変更では停止しないことを判定する。
- **Exception（例外）**: なし。repository は cwd から解決する。
- **References（参照）**: `src/shared/git-environment.ts`、`src/exec/agent-git-state.ts`。検証経路は [[sysd-index|設計索引]] の Git / Worktree 変更行。

### 3.15. scp-SEC-001: agent権限制約

- **Rule（MUST NOT）**: 通常運用で確認回避、repository外の無制限書き込み、review agentの成果物編集、agentによる最終承認を許可しない。公開可否と留保の最終判断・説明責任は人間の PO が負う。
- **Rationale（意図）**: 自動実行の影響範囲と人間の説明責任を維持する。
- **Scope（適用範囲）**: agent定義、sandbox、approval policy、PR承認。
- **Enforcement（検証）**: provider設定review、commit許可範囲、branch protection。
- **Exception（例外）**: 緊急権限は人間の承認・期限・監査証跡を要求する。
- **References（参照）**: [[sysd-critical-flows|重要フロー]]のPR承認フロー、未作成の `opd-access-management`（Q3）。

### 3.16. scp-SEC-002: 親実行設定の agent 書き込み禁止

- **Rule（MUST NOT）**: agent 実行中に `package.json`、lefthook 設定、`.specdojo/**`、commitlint 設定、CI 設定を変更し、その変更後の内容で親検証、commit、merge を行わない。
- **Rationale（意図）**: sandbox 外の親 runner や Git hook が実行するコマンドを agent に差し替えさせず、固定 argv と許可 ID の安全境界を維持する。
- **Scope（適用範囲）**: provider を問わない agent executor / reporter の in-place・worktree・register 実行。
- **Enforcement（検証）**: CLI の固定パス定義を用い、agent 起動前後の差分を親検証前に検査する。worktree 統合時は未 commit 差分と exec branch 上の commit 済み差分を再検査し、違反パスを標準エラーへ出力して block する。
- **Exception（例外）**: agent 向け解除設定は設けない。必要な変更は result の申し送りへ記録し、人間または対話型 orchestrator が agent 実行外で内容を確認して適用する。
- **References（参照）**: [[sysd-index|設計索引]] の保護設定・変更の入口、`src/exec/agent-protected-config.ts`、`src/exec/worktree-ops.ts`。

### 3.17. scp-ERR-001: 共通エラーと回復案内

- **Rule（MUST）**: 入力・設定不正、実行失敗、利用制限、統合競合、保護違反を識別し、対象実行、停止段階、保持した記録、次の確認先を利用者へ示す。終了コードだけを完了判定にせず、evidence と検証・統合結果を照合する。
- **Rationale（意図）**: 利用者と引継ぎ担当が、入力訂正・復旧・人間判断のどれが必要か選べるようにする。
- **Scope（適用範囲）**: CLI、agent runner、Job / Routine、生成処理、拡張からの CLI 呼出し。HTTP エラー schema の追加は非該当。
- **Enforcement（検証）**: V3 で不正設定は起動前拒否、汎用失敗は利用制限と誤分類しない、内容競合・保護違反は統合せず停止、終了成功でも不完全な報告は完了扱いにしないことを確認する。
- **Exception（例外）**: 原因を分類できない場合は未分類の失敗として保持し、推測した原因で再試行しない。
- **References（参照）**: [[sysd-index|設計索引]] の公開 CLI・外部連携・実行証跡の正本。終了コードの値は [[specdojo:command-reference|コマンドリファレンス]]。

### 3.18. scp-IDM-001: 冪等と途中状態

- **Rule（MUST）**: 同一論理処理と別の実行を識別し、再開前に保存済みの状態・統合結果を照合する。外部 agent の非決定的編集や利用枠消費は冪等とみなさない。生成物は入力正本から再生成し、状態記録や人の判断を生成物として消去しない。
- **Rationale（意図）**: 重複実行による費用・履歴の二重化と、成功済み処理の巻戻しを防ぐ。
- **Scope（適用範囲）**: task、register、Job / Routine の再実行と文書生成。Job の論理実行キー・checkpoint の詳細は個別設計へ委ねる。
- **Enforcement（検証）**: V3 で同一処理の重複起動、途中失敗からの再開、統合済み処理への再開、生成の再実行を確認する。二重の完了反映や過去証跡の消失がなく、失敗時の状態を照合できることを合格条件とする。
- **Exception（例外）**: 重複排除を保証できない操作は、差分・外部状態を人間が確認するまで自動再送の受入を保留する。
- **References（参照）**: [[sysd-index|設計索引]] の保存・移行・Job 正本、[[sysd-job-execution|Job 実行設計]]、[[specdojo:exec-operation-guide|exec 運用ガイド]]。

### 3.19. scp-TIM-001: タイムアウトと打切り

- **Rule（MUST）**: 外部プロセス・検証・待機には、適用する時間上限の正本と単位、打切り対象、部分成果と再開条件を対応させる。時間切れを成功や未変更とみなさず、子プロセスの終了と保存状態を確認する。
- **Rationale（意図）**: 無期限の占有と、打切り後の遅延書込み・二重実行を防ぐ。
- **Scope（適用範囲）**: provider CLI、command Job、親検証、Git 一時競合、Routine 起動からの実行。常駐 API の応答時間は非該当。
- **Enforcement（検証）**: V3 で上限直前・到達時・終了不能な子プロセスを確認し、時間切れでは成功・統合・完了を進めず、部分出力と停止理由を保持することを要求する。設定キー・値・単位と強制終了の猶予は Q2 の照合待ちであり、実装保証は保留する。
- **Exception（例外）**: 上限を確認できない経路を便宜的な固定値で埋めない。OPS が手動停止・状態照合の手順を確認するまでその経路の無人運転の受入を保留する。
- **References（参照）**: [[sysd-index|設計索引]] の設定・外部連携・Job 正本と「未決事項と公開前確認」の Q2。

### 3.20. scp-LOG-001: 診断ログと監査証跡

- **Rule（MUST）**: 進捗・原因調査用ログと、状態変更・判断・承認を追う監査証跡を区別する。保存前に秘密値を除去し、実行対象、時刻、実行主体、処理結果と証跡参照から原因を追えるようにする。構造・保持場所は証跡 schema と運用正本へ委ねる。
- **Rationale（意図）**: 障害時の引継ぎと判断の監査を成立させ、公開履歴への秘密流出を防ぐ。
- **Scope（適用範囲）**: stdout / stderr の保存、plan / result / evidence / event、Job Run、Routine の失敗記録、Grade。全出力の無加工保存は許可しない。
- **Enforcement（検証）**: V4 で秘密を模した値の秘匿化、失敗記録と実行の対応、状態変更の追跡、保存失敗の検知を確認する。正常終了だけでは監査可能と判定しない。
- **Exception（例外）**: 保持・圧縮で失う情報、閲覧権限、保存期間は Q3 の OPS / PO 判断前に自動削除の許可として解釈しない。
- **References（参照）**: [[sysd-index|設計索引]] の Observability・保存移行、`docs/specdojo/schemas/v1/exec-evidence.schema.yaml`、`src/routine/failure.ts`、`tools/check-evidence-secrets.mjs`。

### 3.21. scp-TRC-001: 実行相関と監視への引渡し

- **Rule（MUST）**: project、task または Job、実行・attempt の関係を、plan から結果・証跡・失敗・統合まで追跡可能にする。外部 CLI が共通 trace を受け取れない場合も、親側の起動と終了記録を同じ実行へ対応させる。
- **Rationale（意図）**: 並列実行の失敗と再開対象を取り違えず、次の担当が同じ証跡へ到達できるようにする。
- **Scope（適用範囲）**: runner、Job / Routine、Grade、CLI 利用元。常駐 APM の導入や全 provider への trace 伝播保証は対象外。
- **Enforcement（検証）**: V4 で並列二実行と retry の証跡が混在せず、失敗元から plan / result と統合結果へたどれることを確認する。OPS は失敗・待機・保護違反を確認し、対象と保持状態を PM へ引き渡す。通知先・閾値・確認間隔の受入は Q3 待ち。
- **Exception（例外）**: 外部側に trace がない場合は相関の限界を記録する。観測不能を無障害とみなさない。
- **References（参照）**: [[sysd-index|設計索引]] の実行証跡・Routine 状態の正本、[[specdojo:routine-operation-guide|定期処理運用ガイド]]。

### 3.22. scp-CFG-003: 設定上書き階層

- **Rule（MUST）**: 項目ごとに、CLI 明示指定・環境変数・project 設定・実行既定値のうち適用する階層、優先順、反映時点を正本から解決する。項目間で一律の優先順位を仮定せず、不正値・未解決変数を黙って既定値へ落とさない。起動コマンドの選択は CFG-001 に従う。
- **Rationale（意図）**: 利用者の明示指定と実際の起動内容の食違いを防ぐ。
- **Scope（適用範囲）**: CLI、project / provider 設定、Job / Routine の入力、拡張から渡す設定。
- **Enforcement（検証）**: V2 で指定なし、単一階層、競合する階層、不正値を与え、正本どおりの値を採用または起動前に拒否することを確認する。優先順が正本から特定できない項目は Q4 へ戻す。
- **Exception（例外）**: 実行中の設定変更を既存実行へ即時適用できるとはみなさない。個別仕様に反映時点がなければ確認待ちとする。
- **References（参照）**: [[specdojo:specdojo-config-reference|設定リファレンス]]、[[specdojo:exec-config-guide|exec 設定ガイド]]。所在は [[sysd-index|設計索引]] の設定正本。

### 3.23. scp-MOD-001: モジュール境界と依存

- **Rule（MUST）**: CLI の公開入口、各機能、共通処理、文書生成・サイト、拡張の責務を区別し、実行時 import を依存宣言と一致させる。状態遷移・排他・統合を agent や表示生成へ委譲しない（EXE-001）。生成された索引・状態表示を正本として直接編集しない。
- **Rationale（意図）**: 表示や provider の変更が状態・統合の責務を侵食することを防ぐ。
- **Scope（適用範囲）**: `src/`、`packages/docs-site/`、`packages/vscode-specdojo/` と生成経路。未定義の domain / application 層を実在する構成として導入しない。
- **Enforcement（検証）**: V5 で機能配置・呼出し境界をレビューし、`npm run check:src-imports`・型検査を通す。公開入口の変更はコマンド登録・実行経路の回帰、表示変更は正本に状態変更が逆流しないことを確認する。
- **Exception（例外）**: 新しい依存方向が必要なら ARC が設計索引と変更影響を更新し、人間の PO へ境界変更の判断を依頼する。
- **References（参照）**: [[sysd-index|設計索引]] のモジュール境界・変更の入口。詳細の配置・禁止 import は実装と静的検査設定を正とする。

## 4. 例外（DECリンク）

### 4.1. 例外の入口

現時点で本書に承認済みの例外はない。新規例外には Rule ID、理由・影響範囲、期限、判断者、復帰条件、DEC 相当の PJR decision と関連する issue / change の参照を必須とする。緊急権限も人間の承認と監査証跡を必要とし、未登録の実装差分は適合とは扱わない。

### 4.2. 報告と追跡

| 事象                                       | 記録先・種別                               | 報告・追跡責務                                                 |
| ------------------------------------------ | ------------------------------------------ | -------------------------------------------------------------- |
| 既に発生したルール違反・障害・未解決の不足 | PJR issue。失敗実行の証跡と Rule ID を付す | DEV / OPS が報告、PM が担当・期限・再確認を追跡、QE が解消判定 |
| 将来起こり得る依存遅延・重複実行・観測欠落 | PJR risk                                   | ARC / OPS が影響を報告、PM が発現条件と対応を追跡              |
| 横断ルール・設定契約・保護境界の変更要求   | PJR change                                 | ARC が変更影響を示し、PM が計画へ接続、人間の PO が採否判断    |
| 例外許可・留保・設計方針の確定             | PJR decision（DEC 相当）                   | 人間の PO が判断、ARC が本文と正本への反映、PM が期限を追跡    |

PJR / Schedule の実 ID が未発行なら発行済みと記さず、次の「未決事項と公開前確認」から起票へ引き継ぐ。登録先は [[prj-0001:pjr-index|登録簿索引]]、操作は [[specdojo:register-operation-guide|登録簿運用ガイド]] を参照する。

## 5. 関連ドキュメント導線（SYSD/SYSD-CF/NFR/OPD/OPR/DEC）

### 5.1. 正本と運用への入口

| 対象                        | 参照                                                                                                                                                                           | 用途・状態                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| 全規則                      | [[sysd-index\|設計索引]]                                                                                                                                                       | 実装・schema・設定・生成物・検査コマンドの所在を確認              |
| EXE / SEL / CFG / RET / SEC | [[sysd-agent-settings\|agent 実行設計 hub]]、[[ifx-cmd-ai-provider-cli\|AI CLI 連携契約]]、[[opr-agent-cli-update\|外部 CLI 更新手順]]                                         | provider 別起動・認証・更新の詳細へ進む                           |
| STA / GIT / IDM             | [[prj-0001:stsd-task-execution\|タスク状態遷移]]、[[cdfd-uc-register\|登録簿フロー]]、[[cdfd-uc-schedule\|Schedule フロー]]、[[specdojo:exec-worktree-guide\|Worktree ガイド]] | 現行の状態・統合契約へ進む。廃止 CDFD は使用しない                |
| ERR / IDM / TIM / LOG / TRC | [[sysd-job-execution\|Job 設計]]、[[sysd-critical-flows\|重要フロー]]、[[specdojo:exec-operation-guide\|exec 運用]]、[[specdojo:routine-operation-guide\|Routine 運用]]        | 失敗・保存・再開経路の確認                                        |
| NFR                         | `nfr-index`（未作成）、[[prj-0001:dct-non-functional-requirements\|非機能要件カタログ]]                                                                                        | Q1 / Q2 の上限・Q3 の運用目標を接続する                           |
| OPD / OPR                   | `opd-index`、`opd-access-management`、`opr-index`、`opr-incident-response`（未作成）、[[prj-0001:dct-operations\|運用カタログ]]                                                | Q3 の通知・権限・一次対応を接続する。当面は上記の運用ガイドを使用 |
| DEC / PJR                   | [[prj-0001:pjr-index\|登録簿索引]]、[[prj-0001:pm-decision-log\|決定ログ]]                                                                                                     | 専用 DEC の代わりに登録簿の decision を正とする                   |

### 5.2. 変更影響と再検証

以下は将来の変更時の手順であり、本タスクでの実行済み証跡ではない。検証はリポジトリルートで行い、単体・統合各 script の該当ケースが全件成功し、規則詳細の期待結果を満たすことを要求する。

| 確認群 | 更新・追従する対象                                                                           | 検証コマンド・対象                                                                                                                                                                                                                                                  |
| ------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| V1     | ARC / DEV が agent・worktree・保護実装を更新。CLI 互換性と統合順序は関連仕様にも反映         | `npm run test:unit`、`npm run test:integration`。`tests/src/exec/agent-config.test.ts`、`agent-protected-config.test.ts`、`agent-git-state.integration.test.ts`、`worktree*.integration.test.ts`                                                                    |
| V2     | DEV が設定実装・schema・設定リファレンスを同期。廃止キーは移行案内を準備                     | `npm run validate:schema`、`npm run typecheck`、`npm run test:unit`。`tests/src/shared/specdojo-config*.test.ts`                                                                                                                                                    |
| V3     | DEV が状態・移行・再開実装と証跡 schema を同期。保存形式変更時は既存形式の移行と再実行を確認 | `npm run validate:schema`、`npm run test:unit`、`npm run test:integration`。`tests/src/exec/` の失敗・再開、`tests/src/register/migration.test.ts`、`tests/src/exec/migrate-records.test.ts`、`tests/src/job/job.test.ts`。Q1 / Q2 の境界ケースは定義後に対象を確定 |
| V4     | OPS / DEV が失敗保持・秘匿化・運用設定を更新。監査の保存先と通知先変更は運用導線へ反映       | `npm run validate:schema`、`npm run test:unit`。`tests/src/routine/storage.test.ts` の失敗保存・秘匿化、`tests/src/grade/`。相関・通知は Q3 の受入証跡を別途確認                                                                                                    |
| V5     | ARC / DEV が機能配置・依存宣言・CLI 仕様を同期                                               | `npm run check:src-imports`、`npm run typecheck`、`npm run lint:ts`、単体・統合テスト。`tests/src/commands/` と `tests/src/exec/cycle.integration.test.ts`                                                                                                          |

全群で保存契約や文書 ID が変わる場合は、[[sysd-index|設計索引]] の「自動生成物」「変更の入口」に従い、PM がカタログ・Schedule、DEV が生成処理と表示、ARC が参照元を追従させる。生成物は元の定義から再生成する。後方互換性を失う変更は移行手順・回帰対象を人間の PO の判断へ渡す。

## 6. 未決事項と公開前確認

### 6.1. 判断待ちと後続への影響

_TODO_: 次表は今回の参照範囲では確定できない事項である。Q ID は本書内の論点 ID であり、PJR や Schedule の発行済み ID ではない。PM は次の計画更新時かつ各表の確認期限までに issue / risk と必要な変更タスクを登録し、実 ID を本表へ接続する。未起票のまま完了済みとは扱わない。

| ID・作成対象                                                                                           | 判断者・担当                                                   | 判断期限                                        | 影響・当面の扱い                                                                 | 次アクションと解消条件                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Q1: RET-002 の criticality / signal / attempt / backoff / 上限到達時処置、`nfr-index`                  | ARC / DEV が照合案、OPS が費用・回復確認、人間の PO が採否     | retry / fallback の変更着手前・無人実行の受入前 | 数値境界の合否は判断不能。自動制御の受入を保留                                   | `.specdojo/exec-defaults.yaml` と設定正本の対応を確認し、キー・単位・回数の数え方・入力別動作と実在する回帰対象を特定。PM が issue / 必要なら change を起票し、decision と本書を接続 |
| Q2: TIM-001 の経路別 timeout・終了猶予・子プロセス停止、`nfr-index`                                    | DEV / OPS が案、ARC が境界確認、人間の PO が留保判断           | 時間制御の実装着手前・対象経路の無人運転受入前  | timeout の設定変更と境界の合否を確定できない                                     | 各実行経路の設定キー・値・単位、打切りと保存の現在動作を照合。PM が issue と確認タスクを登録し、QE が境界・停止・回復ケースの証跡を確認                                              |
| Q3: `opd-index`、`opd-access-management`、`opr-index`、`opr-incident-response`、`nfr-index` の観測目標 | OPS が設計、QE が受入確認、人間の PO が公開可否、PM が依存追跡 | 公開判断前、通知・削除・権限変更の着手前        | 確認間隔・通知先・閾値・保持期間が未確定。観測規則は定義したが運用の適合は未確認 | カタログ登録先は設計索引と同じ。PM が起票・Schedule 接続、OPS が相関の限界、失敗検知、一次対応、秘匿化・保持を具体化。PO が解消または期限付き留保を判断                              |
| Q4: CFG-003 の項目別優先順・反映時点、全規則の実装状況                                                 | ARC / DEV が照合、QE が判定、PM が計画化、人間の PO が承認     | 各規則の変更着手前、全件は公開前                | 実装済み・未実装を未照合。設定項目の全階層を本書から一意に確定できない           | 設計索引の正本・検証経路で V1→V2→V3→V4 と V5 を確認し、実装済み／不足／非該当と証跡を記録。不足の作業 ID・依存・実行時機を Schedule / PJR に接続                                     |

### 6.2. 公開・昇格の判断条件

- ARC / DEV は全規則の適用範囲と正本を照合し、未実装・不明を Q1〜Q4 または登録簿へ接続する。未確認を実装済みとしない。
- QE は V1〜V5 の期待結果と検査の成功証跡を確認する。OPS は失敗検知から相関・秘匿化・一次対応・再開まで確認し、監視が未整備の範囲を明示する。
- PM は未決事項の担当・期限・実 ID・依存先を確認し、必要な NFR / OPD / OPR の整備と受入が計画へ接続された状態を提示する。
- 人間の PO は解消結果と残る制約を読み、承認・期限付き保留・差し戻しを選ぶ。期限付き留保には影響範囲・責任者・再確認期限の decision を要求する。公開と `ready` 昇格の最終説明責任は PO が負い、agent は `status: draft` を維持する。
