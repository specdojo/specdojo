---
specdojo:
  id: opr-agent-cli-update
  type: operations
  status: draft
  rulebook: specdojo:opr-rulebook
  based_on:
    - sysd-agent-settings
---

# 運用手順: 外部エージェントCLI更新

Claude Code、Codex、OpenCode、GitHub Copilot CLIをdevcontainer内で更新し、バージョンと永続化範囲を検証する手順である。`opr-index` の個別手順として、更新作業と証跡を具体化する。

## 1. 概要（agent-cli-update）

外部エージェントCLIの実行中プロセスを保護しながら、実行中コンテナの一時更新またはコンテナ再作成後も維持する更新を行う。

## 2. 手順適用範囲・前提

| 項目     | 内容                                                                 |
| -------- | -------------------------------------------------------------------- |
| 対象     | devcontainer内のClaude Code、Codex、OpenCode、GitHub Copilot CLI     |
| 対象外   | Host Mac、接続元端末へのCLI導入・更新                                |
| 必要権限 | devcontainer内の`sudo`、永続更新時はHost Mac上のdevcontainer操作権限 |
| 事前条件 | `specdojo exec run`、build、test、対話中agent CLIが停止していること  |
| 参照環境 | `tsd-home-mac-dev-server`で定義したSSH・tmux・devcontainer構成       |

## 3. 日次/週次/月次点検手順

定期点検は本書の範囲外とし、更新要求または脆弱性対応時に本手順を起動する。

## 4. 障害対応手順（P1/P2…、切り分け、一次対応、復旧）

更新後に起動できない場合は、新規agent実行を停止し、更新方法と導入元を確認する。一時更新ではコンテナ再作成、永続更新ではlockfile差分の取り消しまたは既知バージョンへの固定を復旧候補とし、実行中の会話やtaskを更新途中から再開しない。

## 5. アラート対応手順（確認→暫定対応→恒久対応）

自動アラートは設けない。CLIの起動失敗、認証失敗、version不一致を検知した場合は、provider別システム設計と公式リリース情報を確認し、設定変更が必要なら別の変更としてレビューする。

## 6. バックアップ確認・リストア手順（演習含む）

認証、設定、会話履歴はnamed volumeに保持する。更新前にvolumeを削除しないことを確認し、復旧時もvolumeの削除を通常手段にしない。

## 7. バッチ再実行・失敗時対応

（本書の範囲外）

## 8. 運用変更作業（設定変更・デプロイ・ロールバック）

### 8.1. 実行中devcontainerの更新

1. 接続元端末からtmux sessionへ入る。

   ```bash
   ssh home-mbp-tmux
   ```

2. 対象CLIだけを更新する。

   ```bash
   sudo npm install -g @openai/codex@latest opencode-ai@latest
   claude update
   copilot update
   ```

3. 同じdevcontainer内でバージョンを確認する。

   ```bash
   codex --version
   opencode --version
   claude --version
   copilot version
   ```

CodexとOpenCodeは`.devcontainer/post-create.sh`のnpm global installに合わせてnpmで更新する。この更新は実行中コンテナだけに反映される。

### 8.2. コンテナ再作成後も維持する更新

1. Host Macへ接続してrepositoryへ移動する。

   ```bash
   ssh -t home-mbp
   cd ~/workspaces/specdojo-workspace/specdojo
   ```

2. Feature更新対象を確認し、lockfileを更新する。

   ```bash
   devcontainer outdated --workspace-folder .
   devcontainer upgrade --workspace-folder .
   ```

3. `.devcontainer/devcontainer-lock.json`の差分をレビューする。
4. 実行中処理がないことを再確認し、コンテナを再作成する。

   ```bash
   devcontainer up --workspace-folder . --remove-existing-container
   ```

5. tmux sessionへ入り直し、8.1のversion確認を行う。

`--remove-existing-container`はtmux sessionを終了させる。named volumeは削除しない。

## 9. アカウント付与/剥奪手順

（本書の範囲外。更新を理由に再認証や認証情報の再発行を行わない）

## 10. 問い合わせ一次対応手順（テンプレ・ナレッジ）

更新失敗時は、対象CLI、更新前後version、実行した更新方式、一時更新か永続更新か、エラー概要を記録し、provider別システム設計の公式仕様参照から切り分ける。

## 11. 証跡（ログ、チケット、チェックリスト、実施記録）

| 証跡     | 保存先                         | 最低限残す内容                      |
| -------- | ------------------------------ | ----------------------------------- |
| 更新差分 | Git commit / PR                | lockfile、導入script、設定の差分    |
| 実施記録 | 対応する登録項目または変更記録 | 実施日時、実施者、対象CLI、更新方式 |
| 検証結果 | 実施記録                       | 4 CLIのversion、代表CLIの起動可否   |
| 障害記録 | 登録項目                       | エラー概要、停止範囲、復旧内容      |

## 12. 関連ドキュメント導線（`opd` 参照、`mip` / `otp` / `cop` 連携）

| 種別         | ドキュメントID                 | 目的                             |
| ------------ | ------------------------------ | -------------------------------- |
| システム設計 | `sysd-agent-settings`          | agent実行共通設計への入口        |
| provider設計 | `sysd-claude-agent-settings`等 | CLI固有設定・公式仕様            |
| 技術スタック | `tsd-home-mac-dev-server`      | SSH・tmux・devcontainer構成      |
| 運用方針     | `opd-index`                    | （未作成。運用方針整備時に接続） |
