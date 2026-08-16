---
specdojo:
  id: sysd-cross-cutting-policy
  type: architecture
  status: draft
  rulebook: specdojo:sysd-cross-cutting-policy-rulebook
  part_of:
    - sysd-index
---

# SpecDojo システム設計横断ルール

SpecDojo CLI、agent、実行runner、Git worktreeへ横断的に適用する責務、設定解決、状態遷移、失敗処理、権限のルールを定義する。実装・設定を一次情報とし、本書は設計意図と検証可能な制約のSSOTである。

## 1. 概要（適用範囲・優先順位）

対象は`specdojo exec run`によるtask実行、provider CLI起動、plan / result / event、worktree統合である。ルールは最小限かつ検証可能にし、例外は期限・影響範囲・決定者を持つDECまたは登録項目で管理する。

競合時の優先順位は`SEC > STA > GIT > RET > CFG > SEL > EXE`とする。上位カテゴリに反するretry、fallback、設定上書き、agent出力は採用しない。

## 2. ルール一覧（ID/カテゴリ/要約/必須度）

<!-- prettier-ignore -->
| Rule ID | Category | Summary | Level | Owner |
| --- | --- | --- | --- | --- |
| scp-EXE-001 | Execution | CLI・agent・runnerの3層責務を分離する | MUST | ARC |
| scp-EXE-002 | Execution | editとreviewを権限・成果で分離する | MUST | ARC / QE |
| scp-SEL-001 | Selection | phase要件とmember属性で実行者を選択する | MUST | ARC |
| scp-CFG-001 | Configuration | provider起動コマンドを宣言的に解決する | MUST | ARC |
| scp-CFG-002 | Configuration | 設定と秘密情報の責務を分離する | MUST NOT | ARC / OPS |
| scp-STA-001 | State | eventをappend-onlyとし状態訂正を追記する | MUST | PM / ARC |
| scp-STA-002 | State | reopenを人間によるdoneからtodoへの訂正に限定する | MUST | PM |
| scp-RET-001 | Retry | provider固有シグナルで利用制限を判定する | MUST | ARC |
| scp-RET-002 | Retry | retry・fallback・blockをcriticalityに従って制御する | MUST | ARC / OPS |
| scp-RET-003 | Retry | 自動再開は根拠のある再開時刻と排他を要求する | MUST | ARC / OPS |
| scp-GIT-001 | Git | 並列edit taskをtask単位worktreeへ分離する | MUST | ARC |
| scp-GIT-002 | Git | commit・merge・completeを順序保証する | MUST | ARC |
| scp-GIT-003 | Git | Git共有資源の一時競合だけを安全に再試行する | MUST | ARC |
| scp-SEC-001 | Security | agentへ無制限権限・秘密情報を与えない | MUST NOT | ARC / OPS |

## 3. 各ルール詳細（ID単位）

### scp-EXE-001: 3層責務分離

- **Rule（MUST）**: SpecDojo CLIは状態・依存・記録、agentはplanに限定した成果物処理、runnerは選択・起動・並列・worktree・終了反映を担当する。agentはschedulerまたは状態管理者として動作しない。
- **Rationale（意図）**: 内容判断と排他・統合制御を分離し、provider差し替え時もtask状態を一貫させる。
- **Scope（適用範囲）**: 全provider、edit / review、register item実行、schedule task実行。
- **Enforcement（検証）**: agent指示、runner統合テスト、event actorと状態遷移の検証。
- **Exception（例外）**: 人間が明示的に行うin-place操作は対象外だが、状態を追跡する場合は同じevent規則に従う。
- **References（参照）**: `sysd-agent-settings`、`cdfd-task-execution`。

### scp-EXE-002: edit / review分離

- **Rule（MUST）**: phaseの`mode`でeditとreviewを区別し、review agentは成果物を変更しない。resultと許可されたevidence以外の変更を統合しない。
- **Rationale（意図）**: 作成者と検証者の役割を追跡し、レビューによる意図しない修正を防ぐ。
- **Scope（適用範囲）**: agent実行pipeline。
- **Enforcement（検証）**: member属性検証、commit対象許可リスト、review agent定義の権限制約。
- **Exception（例外）**: review結果を受けた修正は別のedit phaseまたはtaskとして行う。
- **References（参照）**: provider別`sysd-*-agent-settings`。

### scp-SEL-001: member選択

- **Rule（MUST）**: phaseの`mode`、`capabilities`、`proficiency`と、`pm-members.yaml`のmember属性を照合し、適合候補だけをpriority順に選択する。
- **Rationale（意図）**: scheduleへCLI名やモデル名を固定せず、要求と実行環境を分離する。
- **Scope（適用範囲）**: `exec run --auto`と明示member指定。
- **Enforcement（検証）**: 設定schema、候補解決テスト、適合候補なしの事前エラー。
- **Exception（例外）**: 人間taskは明示的に登録されたagent上書きがない限り自動起動しない。
- **References（参照）**: `.specdojo/exec-defaults.yaml`、`pm-members.yaml`。

### scp-CFG-001: 起動コマンド解決

- **Rule（MUST）**: 起動コマンドは`providers.<provider>.command_template`と`command_params`から解決し、memberの`command`は特殊構成だけに使う。plan本文は標準入力で渡す。
- **Rationale（意図）**: provider設定の重複とshell解釈による事故を防ぐ。
- **Scope（適用範囲）**: 全providerの非対話起動。
- **Enforcement（検証）**: 未解決placeholder、重複変数、template欠落を起動前にエラーとする。
- **Exception（例外）**: `provider: custom`はmember commandで上書きできる。
- **References（参照）**: `sysd-agent-settings`、provider別子設計。

### scp-CFG-002: 設定と秘密情報

- **Rule（MUST NOT）**: command template、member、agent定義、文書へtoken、秘密鍵、個人環境だけの絶対pathを保存しない。認証は環境またはCLI認証storeから注入する。
- **Rationale（意図）**: repository経由の漏えいと環境依存を防ぐ。
- **Scope（適用範囲）**: 設定・文書・実行ログ。
- **Enforcement（検証）**: review、secret scan、設定schema。
- **Exception（例外）**: なし。
- **References（参照）**: provider別認証設計、`opd-access-management`。

### scp-STA-001: append-only event

- **Rule（MUST）**: task状態の変更はeventを追記して表し、既存eventを削除・変更しない。result、plan履歴、Git履歴を状態訂正のために消去しない。
- **Rationale（意図）**: 並列処理と再開を監査可能にし、過去の判断を保持する。
- **Scope（適用範囲）**: claim、complete、block、release、reopen、unblock。
- **Enforcement（検証）**: event schema、状態遷移検証、project lock。
- **Exception（例外）**: 破損ファイルの復旧は人間判断と別の監査記録を要求する。
- **References（参照）**: `cdfd-task-execution`。

### scp-STA-002: reopen

- **Rule（MUST）**: `reopen`は人間memberだけが理由付きで`done`から`todo`へ訂正する。活動中または完了済みの下流taskがある場合は拒否し、下流から整合させる。
- **Rationale（意図）**: 確定済み依存関係を無言で無効化しない。
- **Scope（適用範囲）**: 完了判定の訂正。
- **Enforcement（検証）**: actor type、遷移元、下流状態、理由の検証。
- **Exception（例外）**: 通常の再試行はreopenではなくblock / resume経路を使う。
- **References（参照）**: `cdfd-task-execution`、登録簿運用ガイド。

### scp-RET-001: 利用制限検出

- **Rule（MUST）**: rate limit、session limit、quota、timeout、overloadはprovider固有の終了コード・stderr patternで判定し、raw signalと正規化状態を両方保持する。汎用`exit 1`だけで利用制限と判定しない。
- **Rationale（意図）**: agent自身のblockや通常失敗を誤ってretryしない。
- **Scope（適用範囲）**: provider processの異常終了。
- **Enforcement（検証）**: provider別fixture、exit 0時の誤検出防止テスト。
- **Exception（例外）**: providerが専用終了コードを保証する場合だけ単独判定に使用できる。
- **References（参照）**: `.specdojo/exec-defaults.yaml`、provider別子設計。

### scp-RET-002: retry / fallback / block

- **Rule（MUST）**: policyはtaskのcriticalityと正規化signalに従い、上限付きretry、適合memberへのfallback、またはblockを選ぶ。独立したReady taskと別providerは継続できる。
- **Rationale（意図）**: 一つのprovider障害による全体停止と無限再試行を防ぐ。
- **Scope（適用範囲）**: provider利用制限・一時障害。
- **Enforcement（検証）**: attempt上限、backoff上限、候補順、on_exhaustedのテスト。
- **Exception（例外）**: quota exhaustedは自動retry対象にしない。
- **References（参照）**: `sysd-critical-flows`の利用制限フロー。

### scp-RET-003: 延期と自動再開

- **Rule（MUST）**: 自動再開はprovider reset、retry-after、明示cooldownのいずれかから再開時刻を解決できる場合だけ許可する。scheduler lock内で最新eventを再読込し、一つのprocessだけが再開を確保する。
- **Rationale（意図）**: 推測時刻による再失敗と多重再開を防ぐ。
- **Scope（適用範囲）**: 利用制限でblockしたtask。
- **Enforcement（検証）**: resume時刻、timezone、重複起動、quota除外のテスト。
- **Exception（例外）**: 時刻根拠がない場合は人間による再開判断を待つ。
- **References（参照）**: `sysd-critical-flows`、`opr-incident-response`。

### scp-GIT-001: task単位worktree

- **Rule（MUST）**: 並列edit taskはproject修飾task IDから導出したbranchとworktreeへ分離する。成果物を変更しないreview taskは分離不要とする。
- **Rationale（意図）**: 同じworking treeへの同時書き込みを防ぎ、taskごとの変更を追跡する。
- **Scope（適用範囲）**: worktree modeのagent実行。
- **Enforcement（検証）**: path・branch対応、repository外base、既存worktree所属の検証。
- **Exception（例外）**: 明示的なin-place単一実行。
- **References（参照）**: `sysd-critical-flows`のworktreeフロー、`cdfd-multi-project`。

### scp-GIT-002: commit・統合・完了順序

- **Rule（MUST）**: agent成功後に検証、result確定、許可対象commit、project統合先への直列merge、complete、worktree削除の順で処理する。blockまたは競合時は未統合branchとworktreeを保持する。
- **Rationale（意図）**: 成果物未統合のままtaskを完了扱いにする事故を防ぐ。
- **Scope（適用範囲）**: edit taskの統合。
- **Enforcement（検証）**: merge ancestor、dirty target、overlap、complete event順序の検証。
- **Exception（例外）**: 再生成可能な派生物だけは削除時に明示して破棄できる。
- **References（参照）**: `cdfd-multi-project`、`sysd-critical-flows`。

### scp-GIT-003: 共有Git資源の競合

- **Rule（MUST）**: `.git/index.lock`競合のように変更前と判定できる一時失敗だけを短いbackoffで上限付き再試行する。内容競合は自動解消しない。
- **Rationale（意図）**: 安全な一時競合と意味のあるmerge conflictを区別する。
- **Scope（適用範囲）**: 並列worktreeのGit操作。
- **Enforcement（検証）**: lock error識別、retry上限、merge conflict保持のテスト。
- **Exception（例外）**: なし。
- **References（参照）**: `sysd-critical-flows`のworktreeフロー。

### scp-SEC-001: agent権限制約

- **Rule（MUST NOT）**: 通常運用で確認回避、repository外の無制限書き込み、review agentの成果物編集、agentによる最終承認を許可しない。
- **Rationale（意図）**: 自動実行の影響範囲と人間の説明責任を維持する。
- **Scope（適用範囲）**: agent定義、sandbox、approval policy、PR承認。
- **Enforcement（検証）**: provider設定review、commit許可範囲、branch protection。
- **Exception（例外）**: 緊急権限は人間の承認・期限・監査証跡を要求する。
- **References（参照）**: `sysd-critical-flows`のPR承認フロー、`opd-access-management`。

## 4. 例外（DECリンク）

現時点で恒久例外はない。例外を追加する場合は、Rule ID、影響範囲、期限、承認者、復帰条件、DECまたは登録項目IDを記録する。

## 5. 関連ドキュメント導線（SYSD/SYSD-CF/NFR/OPD/OPR/DEC）

| 種別            | ドキュメントID            | 目的                    | 備考   |
| --------------- | ------------------------- | ----------------------- | ------ |
| SYSD            | `sysd-index`              | 設定・実装SSOTの入口    | 必須   |
| SYSD            | `sysd-agent-settings`     | agent実行設計hub        | 必須   |
| SYSD-CF         | `sysd-critical-flows`     | 重要な順序・失敗経路    | 必須   |
| CDFD            | `cdfd-task-execution`     | task状態の概念フロー    | 参照   |
| CDFD            | `cdfd-register-lifecycle` | register ID・承認フロー | 参照   |
| CDFD            | `cdfd-multi-project`      | branch / worktree統合   | 参照   |
| OPR             | `opr-agent-cli-update`    | provider CLI更新手順    | 該当時 |
| OPD / NFR / DEC | （なし）                  | 後続成果物で接続        | 現時点 |
