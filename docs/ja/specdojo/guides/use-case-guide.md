---
specdojo:
  id: use-case-guide
  type: guide
  status: draft
  based_on:
    - specdojo-overview-guide
    - quick-start-guide
---

# ユースケース別ガイド

Use Case Guide

「やりたいこと」から、進め方の筋道と読むべき文書へ最短で入るためのガイドです。Quick Start の次に何をどの順で進めればよいかを、代表的なシナリオごとに示します。各ステップの詳細は既存の guide / reference へのリンクに委ねます。

**対象読者**

- Quick Start を終え、自分の状況に合わせて次に何をすればよいか知りたい利用者

**この文書で分かること**

- 代表的なシナリオごとの、ゴール・進め方の要点・主に使う文書

**次に読む文書**

- トピックからどの文書かを引く平坦な索引は [全体概要ガイド](specdojo-overview-guide.md) の `目的別の次の読み物`、コマンドの詳細は [CLIコマンドリファレンス](../references/command-reference.md) を参照してください。

## 1. このガイドの使い方

本ガイドは「シナリオ → 進め方 → 使う文書」の筋道を示すもので、文書やコマンドの正本ではありません。各シナリオは次の3点で構成します。

- ゴール: そのシナリオで達成したいこと
- 進め方: 大まかな手順の流れ
- 主に使う文書: 詳細を確認する guide / reference

「この項目はどの文書か」を平坦に引きたい場合は [全体概要ガイド](specdojo-overview-guide.md) の `目的別の次の読み物` を、コマンドとオプションは [CLIコマンドリファレンス](../references/command-reference.md) を参照してください。まず一度通す体験は [Quick Startガイド](quick-start-guide.md) が最短です。

## 2. 立ち上げと計画

### 2.1. 新規プロジェクトを最短で立ち上げる

- ゴール: 設定から1タスク完了までを最短で通す。
- 進め方: `config init` → 成果物カタログ作成・検証・生成 → トラック戦略作成 → `schedule build` → `exec build` → 1タスクを claim / complete。
- 主に使う文書: [Quick Startガイド](quick-start-guide.md)、[CLI概要ガイド](cli-overview-guide.md)。

### 2.2. 課題整理から目的・スコープを固める

- ゴール: 目的・スコープ・対象成果物が未確定な状態を、記録しながら決めていく。
- 進め方: `issue` / `question` を登録し、調査のうえ `decision` で方針を確定し、`todo` で成果物カタログ作成につなげる。決定後は schedule 側で計画済み作業を管理する。
- 主に使う文書: [登録簿運用ガイド](register-operation-guide.md)、[Quick Startガイド](quick-start-guide.md) の `registerで課題と判断を整理する`。

### 2.3. 既存プロダクト（文書なし）から着手する

- ゴール: ドキュメントが無い既存プロダクトを対象に、現物・実績から仕様を起こす。
- 進め方: 後続トラック（実装・運用の現物確認など）を先に着手し、そこで分かったことをもとに AS-IS 側の成果物を後から起こす。逆順区間は最後に整合を取るタスクを明示する。
- 主に使う文書: [トラック設計ガイド](track-design-guide.md) の `入力元より先に後続トラックへ着手する場合`、[成果物リファレンス](../references/deliverables-reference.md)。

## 3. 作成と実行

### 3.1. agentに成果物を量産させる

- ゴール: 計画済みタスクを agent に実行させ、レビューへ回す。
- 進め方: `pm-members.yaml` の agent と `.specdojo/exec-defaults.yaml` を用意し、`execution: agent` のフェーズで schedule を組む。`exec run --auto` で Ready 順に実行する。参照の深さは `approach` で切り替える。
- 主に使う文書: [exec設定ガイド](exec-config-guide.md)、[Schedule実行運用ガイド](schedule-operation-guide.md)、[実践の型活用ガイド](kata-guide.md)。

### 3.2. worktreeで隔離実行する

- ゴール: agent の変更を task 単位で隔離し、成功時だけ統合する。
- 進め方: 統合先ブランチにいることを確認し、`exec run --worktree`（または `--auto`）で実行する。段階ごとに確認する場合は分割コマンドを使う。
- 主に使う文書: [Quick Startガイド](quick-start-guide.md) の `（発展）worktreeで1タスクを隔離実行する`、[exec worktree運用ガイド](exec-worktree-guide.md)、[ブランチワークフローガイド](branch-workflow-guide.md)。

### 3.3. 対話（チャット）で運用する

- ゴール: CLI を直接叩く代わりに、会話で計画・実行・状況確認を進める。
- 進め方: `npm run orch:sonnet` でオーケストレーターを起動し、やりたいことを自然文で伝える。状態を変える操作は提示・承認のうえ実行される。
- 主に使う文書: [オーケストレーター運用ガイド](orchestrator-operation-guide.md)、[CLI概要ガイド](cli-overview-guide.md) の `代表フロー`。

## 4. 管理・品質・運用

### 4.1. レビューを回して成果物をreadyにする

- ゴール: 観点別レビューで完全性・整合性・妥当性を確認し、成果物を `ready` へ確定する。
- 進め方: `mode: review` のタスクで review plan / result を回し、指摘を扱う。`ready` への昇格は human が finalize タスクで行う。
- 主に使う文書: [レビューガイド](review-guide.md)、[exec運用ガイド](exec-operation-guide.md) の `humanタスクの実行`。

### 4.2. 計画外の単発対応・調査を管理する

- ゴール: 進行中に発生した計画外の対応・調査・判断を、台帳として追跡する。
- 進め方: `register add` で登録し、agent 実行可能な type は `exec run --register` で対応する。成功後は人が確認して `register close` する。schedule の計画済み作業とは二重管理しない。
- 主に使う文書: [登録簿運用ガイド](register-operation-guide.md)、[exec運用ガイド](exec-operation-guide.md) の `実行経路の使い分け`。

### 4.3. 定期実行を組む

- ゴール: 日次スイープや夜間バッチなど、時刻条件で繰り返す作業を自動化する。
- 進め方: `rtn-*.yaml` に register 実行または schedule 実行を定義し、外部スケジューラから `routine run --due` を冪等に呼ぶ。
- 主に使う文書: [routine運用ガイド](routine-operation-guide.md)。

### 4.4. 複数プロジェクト・ブランチを並行する

- ゴール: 複数の `prj-xxxx` や worktree を同じリポジトリで安全に並行運用する。
- 進め方: project `develop` を軸に feature / exec のブランチを分離し、統合方向と同期手順を守る。worktree のベース取り込みはベースブランチを明示する。
- 主に使う文書: [ブランチワークフローガイド](branch-workflow-guide.md)、[exec worktree運用ガイド](exec-worktree-guide.md)。
