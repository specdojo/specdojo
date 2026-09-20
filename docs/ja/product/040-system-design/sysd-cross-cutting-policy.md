---
specdojo:
  id: sysd-cross-cutting-policy
  type: architecture
  status: draft
  rulebook: specdojo:sysd-cross-cutting-policy-rulebook
  part_of:
    - sysd-index
  grade:
    rubric: grade-rubric-v1
    target: deliverable
    verdict: needs-work
    score: 70
    graded_at: "2026-09-19T16:35:31.850Z"
    graded_by: codex-expert-executor
    content_hash: 8c23094ec79fde23f02092ae04549d185fd85f2435bdd349af7fa46b6a4a3389
    categories:
      consistency: { score: 50 }
      usability: { score: 81 }
      architecture: { score: 100 }
      quality: { score: 58 }
    viewpoints:
      vp-arc-cross-document-consistency: { level: 2, score: 50 }
      vp-arc-conciseness: { level: 4, score: 100 }
      vp-arc-single-responsibility: { level: 4, score: 100 }
      vp-qe-done-criteria: { level: 1, score: 25 }
      vp-qe-verifiability: { level: 2, score: 50 }
      vp-qe-omissions-consistency: { level: 2, score: 50 }
      vp-ux-readability: { level: 3, score: 75 }
      vp-ux-user-flow: { level: 3, score: 75 }
      vp-ux-language-consistency: { level: 3, score: 75 }
      vp-arc-document-structure: { level: 4, score: 100 }
      vp-qe-config-validity: { level: 4, score: 100 }
    findings: { blocker: 0, major: 5, minor: 4, note: 0 }
    done_criteria:
      satisfied: 2
      total: 4
      unsatisfied:
        DC-002: [DEV]
        DC-004: [OPS]
      detail_ref: sysd-cross-cutting-policy-grade-criteria
---

# SpecDojo システム設計横断ルール

<!-- specdojo:finding id=F001 severity=major rule=vp-arc-cross-document-consistency line=3 成果物カタログはエラー・タイムアウト・冪等・トレーシング・設定上書き階層・モジュール境界を対象として宣言しているが、本文はSpecDojoのagent実行規範に限定されているため、カタログまたは本文の適用範囲を一致させる必要がある。 -->
SpecDojo CLI、agent、実行runner、Git worktreeへ横断的に適用する責務、設定解決、状態遷移、失敗処理、権限のルールを定義する。実装・設定を一次情報とし、本書は設計意図と検証可能な制約のSSOTである。

## 1. 概要（適用範囲・優先順位）

対象は`specdojo exec run`によるtask実行、provider CLI起動、plan / result / event、worktree統合である。ルールは最小限かつ検証可能にし、例外は期限・影響範囲・決定者を持つDECまたは登録項目で管理する。

競合時の優先順位は`SEC > STA > GIT > RET > CFG > SEL > EXE`とする。上位カテゴリに反するretry、fallback、設定上書き、agent出力は採用しない。

<!-- specdojo:finding id=F003 severity=major rule=vp-qe-done-criteria line=11 DC-002が要求する冪等方針、タイムアウトの設定・打切り方針、ログ方針がルール一覧および詳細に存在せず、provider障害の判定・retry規則だけでは条件を満たさない。 -->
<!-- specdojo:finding id=F006 severity=major rule=vp-qe-omissions-consistency line=11 rulebookと成果物カタログが要求する共通エラー、冪等、タイムアウト、ログ・監査ログ、トレーシング、設定上書き階層、モジュール境界のルールが欠落しているため、必須領域を追加するか適用範囲の正式な変更が必要である。 -->
## 2. ルール一覧（ID/カテゴリ/要約/必須度）

<!-- specdojo:finding id=F009 severity=minor rule=vp-ux-language-consistency line=20 `scp-CFG-002`の要約「設定と秘密情報の責務を分離する」に`MUST NOT`を組み合わせると責務分離を禁止する意味になるため、詳細規則に合わせて要約を「秘密情報を設定・文書へ保存しない」等へ修正する必要がある。 -->
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
| scp-GIT-004 | Git | agentへrepository固有環境を継承せずGit状態変更を検知する | MUST | ARC |
| scp-SEC-001 | Security | agentへ無制限権限・秘密情報を与えない | MUST NOT | ARC / OPS |
| scp-SEC-002 | Security | agentによる親実行設定の変更を統合・実行しない | MUST NOT | ARC / OPS |

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

- **Rule（MUST）**: task状態の変更は1 eventを1 JSONファイルとして追加して表し、既存eventを削除・変更しない。result、plan履歴、Git履歴を状態訂正のために消去しない。
- **Rationale（意図）**: eventを過去のファイルへ追記せず、Git上でも1回の状態遷移を1ファイルの追加として識別できる境界にすることで、状態の再構成、破損箇所の特定、過去の判断の監査を単純に保つ。task単位のファイルでも排他は成立するが、既存ファイルのread-modify-writeと形式移行を導入するだけの運用上の問題が確認されていないため、ファイル数だけを理由に集約しない。
- **Scope（適用範囲）**: claim、note、block、unblock、complete、reopen、release、cancel、link、estimate。
- **Enforcement（検証）**: eventごとのschema検証、全eventの時系列fold、状態遷移検証、project lock。
- **Exception（例外）**: 破損ファイルの復旧は人間判断と別の監査記録を要求する。
- **References（参照）**: `cdfd-task-execution`、[[specdojo:exec-operation-guide|exec運用ガイド]]の「実行eventの保存粒度」。

### scp-STA-002: reopen

<!-- specdojo:finding id=F008 severity=minor rule=vp-ux-user-flow line=96 `登録簿運用ガイド`および複数箇所の`provider別子設計`が文書ID・相対パス・リンクを持たず参照先を一意に特定できないため、正式なIDまたはリポジトリ相対パスへ置き換える必要がある。 -->
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

<!-- specdojo:finding id=F005 severity=major rule=vp-qe-verifiability line=109 `scp-RET-002`はcriticalityと正規化signalに応じてretry・fallback・blockを選ぶとしているが, criticality区分、signalとの対応表、attempt・backoff上限の値または設定キーがなく、実装・テストのpass/failを一意に判定できない。 -->
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

### scp-GIT-004: agent・テストのGit環境隔離と状態ガード

<!-- specdojo:finding id=F007 severity=minor rule=vp-ux-readability line=154 `scp-GIT-004`のRuleが環境変数除去、Vitest setup、Git起動環境、executor権限、HEAD・config比較、除外条件、fixture identityを一段落に集約しているため、同一Rule内の条件別箇条書きへ分けて判断点を追いやすくする必要がある。 -->
- **Rule（MUST）**: agent、agent配下の子プロセス、親検証、Vitest workerへ`GIT_DIR`、`GIT_WORK_TREE`その他のrepository固有環境変数を継承しない。Vitestは全設定の共通setupでtest module読込前にこれらを除去し、個々のTypeScriptテストからGitを起動する場合も`gitEnvironment()`から作った環境を明示する。executorにはcommitとGit設定を親runnerへ委ねるよう明示し、agent起動前後でagent worktreeのHEADと共有local configを比較して、差分があれば親検証・reporter・統合へ進めずblockする。runnerが作成したbranchの表示用metadataは比較から除外するが、`core.bare`を含むrepository動作に関わる設定は除外しない。テストfixtureのidentityはプロセス環境だけに注入し、local configへ書き込まない。
- **Rationale（意図）**: Git hookから継承した`GIT_DIR`が一時fixture向けの`git init`や`git commit`を実repositoryへ向け、`core.bare`やidentity設定の変更、履歴混入を起こすことを防ぐ。
- **Scope（適用範囲）**: executor / reporter、in-place / worktree / trial / 分割worktree command、親runner検証、および3つのVitest実行設定。shell scriptとnpm scriptの直接Git起動はVitestの静的検査対象外とし、hookからテストを起動する境界ではVitest setupを防御点とする。
- **Enforcement（検証）**: 共通のrepository固有環境変数一覧と`gitEnvironment()`による除去、Vitest setup、TypeScript ASTによるGit起動環境の静的検査、executor promptのGit操作禁止契約、agent worktreeのHEAD・local config比較、fixture commit後もlocal identityが未設定であること、およびrunner遷移commitの除外と危険な継承環境・Git状態変更の回帰テスト。
- **Exception（例外）**: なし。agentが必要とするrepositoryはcwdからGit自身に再解決させる。
- **References（参照）**: `src/git-environment.ts`、`src/exec-agent-git-state.ts`、[[prj-0001:pjr-a99j-agent-git-isolation-breach|PJR-A99J agentのgit操作が実リポジトリを破壊する事象が再発した]]、[[prj-0001:pjr-76ag-test-git-env-leak-repo-corruption|PJR-76AG テストがgitフック配下でGIT_DIRを引き継ぎ実リポジトリを破壊する事故が3度目の再発をした]]、[[prj-0001:pjr-44cw-git-state-guard-false-positive|PJR-44CW git状態の検知がrunner自身の操作を誤検知して実行を止める]]。

### scp-SEC-001: agent権限制約

- **Rule（MUST NOT）**: 通常運用で確認回避、repository外の無制限書き込み、review agentの成果物編集、agentによる最終承認を許可しない。
- **Rationale（意図）**: 自動実行の影響範囲と人間の説明責任を維持する。
- **Scope（適用範囲）**: agent定義、sandbox、approval policy、PR承認。
- **Enforcement（検証）**: provider設定review、commit許可範囲、branch protection。
- **Exception（例外）**: 緊急権限は人間の承認・期限・監査証跡を要求する。
- **References（参照）**: `sysd-critical-flows`のPR承認フロー、`opd-access-management`。

### scp-SEC-002: 親実行設定の agent 書き込み禁止

- **Rule（MUST NOT）**: agent 実行中に `package.json`、lefthook 設定、`.specdojo/**`、commitlint 設定、CI 設定を変更し、その変更後の内容で親検証、commit、merge を行わない。
- **Rationale（意図）**: sandbox 外の親 runner や Git hook が実行するコマンドを agent に差し替えさせず、固定 argv と許可 ID の安全境界を維持する。
- **Scope（適用範囲）**: provider を問わない agent executor / reporter の in-place・worktree・register 実行。
- **Enforcement（検証）**: CLI の固定パス定義を用い、agent 起動前後の差分を親検証前に検査する。worktree 統合時は未 commit 差分と exec branch 上の commit 済み差分を再検査し、違反パスを標準エラーへ出力して block する。
- **Exception（例外）**: agent 向け解除設定は設けない。必要な変更は result の申し送りへ記録し、人間または対話型 orchestrator が agent 実行外で内容を確認して適用する。
- **References（参照）**: [[prj-0001:pjr-3s8q-agent-writable-config-scope|PJR-3S8Q 実行コマンドを定義する設定ファイルは agent の書き込み範囲に含めない]]、`src/exec-agent-protected-config.ts`、`src/exec-worktree-ops.ts`。

## 4. 例外（DECリンク）

現時点で恒久例外はない。例外を追加する場合は、Rule ID、影響範囲、期限、承認者、復帰条件、DECまたは登録項目IDを記録する。

## 5. 関連ドキュメント導線（SYSD/SYSD-CF/NFR/OPD/OPR/DEC）

<!-- specdojo:finding id=F002 severity=minor rule=vp-arc-cross-document-consistency line=190 関連文書表がstatus=deprecatedかつtrash配下へ移動済みの`cdfd-task-execution`、`cdfd-register-lifecycle`、`cdfd-multi-project`を現行参照としているため、後継SSOTへの更新または履歴参照である旨の明示が必要である。 -->
<!-- specdojo:finding id=F004 severity=major rule=vp-qe-done-criteria line=194 DC-004が要求する監視およびトレーシングの運用観点がなく、関連文書表でもOPDを「なし」としているため、セキュリティ規則だけでは条件を満たさない。 -->
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
