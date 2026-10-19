---
specdojo:
  id: specdojo:orchestrator-operation-guide
  type: guide
  status: ready
---

# オーケストレーター運用ガイド

Orchestrator Operation Guide

会話から `specdojo` CLI を実行する対話型オーケストレーターエージェント `specdojo-orchestrator` の使い方を説明します。起動方法、対話の進め方、承認を伴う実行、安全上の制約、設定ファイルの構成を扱います。個別コマンドの詳細は [CLIコマンドリファレンス](../references/command-reference.md) を、CLI 全体像は [遂行の技活用ガイド](waza-guide.md) を参照します。

**対象読者**

- `specdojo` のプロジェクト実行管理（登録・計画・実行・状況確認）を、CLI を直接叩く代わりに対話で進めたい利用者

**この文書で分かること**

- オーケストレーターの位置づけ、起動用スクリプト、対話フロー、承認と安全の扱い、設定ファイルの構成

**次に読む文書**

- タスク実行の運用は [exec運用ガイド](exec-operation-guide.md)、登録簿の運用は [登録簿運用ガイド](register-operation-guide.md)、コマンド詳細は [CLIコマンドリファレンス](../references/command-reference.md) を参照してください。

## 1. オーケストレーターの位置づけ

`specdojo-orchestrator` は、利用者との対話から意図を読み取り、対応する `specdojo` サブコマンド（`register` / `exec` / `catalog` / `schedule` / `routine` など）を組み立てて実行する司令塔エージェントです。

`specdojo exec run` が起動する edit / review agent とは役割が異なります。

| 観点             | edit / review agent            | `specdojo-orchestrator`             |
| ---------------- | ------------------------------ | ----------------------------------- |
| 起動             | `specdojo exec run` から非対話 | 利用者との対話                      |
| 入力             | 標準入力で渡される1件の plan   | 会話（自由入力）                    |
| 実行対象         | 成果物または result の編集     | `specdojo` サブコマンドの実行       |
| claim / complete | 実行しない                     | `specdojo` コマンドとして実行しうる |

CLI を直接操作する場合の代表フローは [遂行の技活用ガイド](waza-guide.md) の `代表フロー` を参照します。オーケストレーターは、この代表フローを会話で組み立てて実行する用途に向きます。

## 2. 起動方法

`package.json` に、対話起動用の npm スクリプトを `orch:` 接頭辞で用意しています。Claude Code / Codex はモデル別に用意し、`:work` 付きは固定 worktree で起動します。

| スクリプト          | CLI・モデル                           | worktree                                        |
| ------------------- | ------------------------------------- | ----------------------------------------------- |
| `orch:sonnet`       | Claude Code / `sonnet`                | なし                                            |
| `orch:sonnet:work`  | Claude Code / `sonnet`                | `../worktrees/claude-work`（無ければ自動作成）  |
| `orch:opus`         | Claude Code / `opus`                  | なし                                            |
| `orch:opus:work`    | Claude Code / `opus`                  | `../worktrees/claude-work`（無ければ自動作成）  |
| `orch:terra`        | Codex / `gpt-5.6-terra`               | なし                                            |
| `orch:terra:work`   | Codex / `gpt-5.6-terra`               | `../worktrees/codex-work`（無ければ自動作成）   |
| `orch:sol`          | Codex / `gpt-5.6-sol`                 | なし                                            |
| `orch:sol:work`     | Codex / `gpt-5.6-sol`                 | `../worktrees/codex-work`（無ければ自動作成）   |
| `orch:copilot`      | GitHub Copilot                        | なし                                            |
| `orch:copilot:work` | GitHub Copilot                        | `../worktrees/copilot-work`（無ければ自動作成） |
| `orch:qwen`         | OpenCode / Qwen 3.8                   | なし                                            |
| `orch:qwen:work`    | OpenCode / Qwen 3.8                   | `../worktrees/qwen-work`（無ければ自動作成）    |
| `orch:gemma`        | OpenCode / Gemma 4                    | なし                                            |
| `orch:gemma:work`   | OpenCode / Gemma 4                    | `../worktrees/gemma-work`（無ければ自動作成）   |
| `orch:flash`        | Antigravity / `gemini-3.8-flash-high` | なし                                            |
| `orch:flash:work`   | Antigravity / `gemini-3.8-flash-high` | `../worktrees/agy-work`（無ければ自動作成）     |

Antigravity CLI（`agy`）はファイル定義の agent を持たないため、Codex と同じく SSOT `.agents/specdojo-orchestrator.agent.md` の本文を `-i`（初期プロンプトを与えて対話を続ける）で渡します。ラッパーは不要で、`.agents/rules/*.md` の薄いラッパー経由で `.github/instructions/` の規則も読み込まれます。

Antigravity で使えるモデル ID は `agy models` で確認してください。配布時点の既定値は、agy 1.3.5 で提供される `gemini-3.8-flash-high` です。

`specdojo init` と `config scaffold` が利用者の `package.json` へ追加するスクリプトは、Claude Code が `orch:opus`・`orch:sonnet`、Codex が `orch:sol`・`orch:terra`、Antigravity が `orch:flash`、OpenCode が `orch:opencode` です。Codex と Antigravity のスクリプトは、名前に対応するモデルを起動コマンドで明示します。

0.4.0 以前に作った `orch:codex`・`orch:agy` は自動では削除・上書きされません。`config scaffold --provider codex` または `config scaffold --provider antigravity` を再実行して新しいスクリプトを追加し、新しい名前で起動できることを確認してから、旧スクリプトを `package.json` から削除してください。

用途に応じて使い分けます。

```bash
# 通常の対話（既定モデル）
npm run orch:sonnet

# 込み入った判断が必要なときは frontier モデル
npm run orch:opus

# 変更を隔離したいときは worktree で起動
npm run orch:sonnet:work
```

frontier モデルは Claude Code が `opus`、Codex が `gpt-5.6-sol` に対応します。通常運用はそれぞれ既定の `sonnet` / `gpt-5.6-terra` を使います。

worktree 付きは、全 CLI で `tools/worktree/open-agent-worktree.sh` を通して固定名の worktree を使い、無ければ起動時に作成します。ブランチは `worktree/<name>`、配置は `../worktrees/<name>` です。既存 worktree のブランチが一致しない場合は agent を起動しません。Claude Code の `--worktree` はブランチ名と配置を他の CLI に揃えられないため使用しません。

### 2.1. 利用リポジトリへ設定を配置する

npm package から利用する場合は、起動前に provider の設定と npm script を利用リポジトリへ配置します。

```bash
npx specdojo config scaffold --provider <name>
```

scaffold が追加する `orch:*` は `specdojo orchestrator launch` を経由します。起動時に対象 project の `repos` を解決し、宣言済みのプロダクトリポジトリ本体だけを provider の追加ルートとして許可します。`repos` が無い場合の provider コマンドは従来どおりです。npm script に追加引数を渡す場合は `npm run orch:<name> -- <引数>` とし、その引数は provider CLI へそのまま渡されます。

OpenCode は起動引数に追加ルートの指定を持たないため、選択した orchestrator agent の `permission.external_directory` を実行時の inline config で上書きします。全外部ディレクトリを拒否してから宣言済みルートだけを許可し、同じルートの `permission.edit` も許可します。設定ファイル自体は変更しません。

Antigravity CLI の無人実行に必要な permission rule は、利用者のすべてのリポジトリに効くグローバル設定です。通常の scaffold では変更されないため、明示的に dry-run で追加 rule を確認してから適用します。既存設定は保持され、実適用前にバックアップされます。

```bash
npx specdojo config scaffold --provider antigravity --global --dry-run
npx specdojo config scaffold --provider antigravity --global
```

分離環境が必要な場合は、追加の任意手順として `devcontainer scaffold` を利用できます。既存の `.devcontainer/` は上書きされず、provider の設定ディレクトリは名前付きボリュームへ保存されます。詳細は [CLIコマンドリファレンス](../references/command-reference.md) の `devcontainer` を参照してください。

## 3. 対話の進め方

オーケストレーターは「提案 → 承認 → 実行」を基本とします。

1. 要望から「対象プロジェクト」「やりたいこと（登録・計画・実行・状況確認）」を特定します。曖昧な場合は質問で絞り込みます。
2. 対応する `specdojo` サブコマンドと引数へマッピングします。必要なら該当コマンドの `--help` を先に確認します。
3. 実行予定のコマンドを、目的と影響範囲（生成・更新されるファイル）とともに提示します。
4. 状態を変える操作は承認を得てから実行します。影響が大きい場合は、先に `--dry-run` を提案します。
5. 実行後は結果（生成物・イベント・次の作業）を要約し、必要なら検証コマンド（`specdojo exec validate` など）を案内・実行します。

読み取り・状況確認のみのコマンド（`--help` / `list` / `status` / `where` / `validate` / `--dry-run`）は、説明の上でそのまま実行します。

対象 project は、`--project <id>` → 環境変数 `SPECDOJO_PROJECT` → `specdojo.config.json` の `current_project` → `projects` 先頭、の順で解決します（[遂行の技活用ガイド](waza-guide.md) の `プロジェクト解決順序` を参照）。会話で対象を特定できない場合は確認します。

### 3.1. plan モードと register の使い分け

Claude Code などの AI ツールが備える plan モード（計画モード）と、`specdojo` のプロジェクト登録簿（register）は、目的とライフサイクルが異なります。オーケストレーターとの対話では、両者の役割を理解して適切に使い分けることが重要です。

#### plan モードと register の性質の違い

Claude Code の plan モードで作成される plan は、会話の中でアイデアを整理し、作業手順の当たりをつけるための「使い捨ての下書き（ドラフト）」です。既定では `~/.claude/plans/` 配下にランダムな名前で保存され、古いファイルは一定期間（約 30 日）で自動削除される一時的な性質を持ちます（Claude Code では `plansDirectory` 設定で保存先を変更できます）。これは Claude Code に限らず、他の AI ツール（Codex、Antigravity、OpenCode など）が提供する一時的な plan 機能や計画モードにも共通する特徴です。

一方、`specdojo` のプロジェクト登録簿（register）は、プロジェクト進行中の意思決定、課題、作業を体系的に記録・追跡する「リポジトリの正本台帳」です（詳細は [[specdojo:register-operation-guide|登録簿運用ガイド]] を参照してください）。

両者の違いを次の観点で対比します。

| 観点                      | plan モードの plan（会話の下書き）                                 | プロジェクト登録簿（register）                                                                                              |
| :------------------------ | :----------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **識別**                  | ランダムな名前（UUID 等）。会話外や後からの参照は困難              | `PJR-XXXX` の恒久的な ID。コミットログや他文書から `Refs:` で追跡可能                                                       |
| **種類**                  | 種別の区別なし（Markdown の自由記述）                              | 明確な種別区分（`decision`・`todo`・`issue`・`question`・`risk`・`note` など）                                              |
| **状態の遷移とイベント**  | 状態管理なし（会話終了や時間経過とともに消去）                     | 明示的な状態遷移（`open` → `in-progress` → `resolved` / `closed` 等）と `events/pjr-XXXX.yaml` による変更履歴の追跡         |
| **exec・commit との接続** | exec の plan / result や Git コミットとの体系的な紐付けなし        | `specdojo exec` の plan / result への接続（[[specdojo:exec-operation-guide\|exec運用ガイド]] 参照）、統合コミットとの紐付け |
| **意思決定の記録**        | 決定内容や合意の経緯が会話ログに埋もれて散逸する                   | `decision` による決定者・決定日・承認方式（合意・レビュー・委任等）の確実な記録                                             |
| **履歴の永続性**          | 既定で一時ディレクトリに保存され、一定期間（約 30 日）で削除される | リポジトリ内の個票（`pjr-XXXX-<topic>.md`）として Git 履歴とともに永続管理                                                  |
| **一覧での見渡し**        | 会話横断での俯瞰や残課題の一覧化は困難                             | 生成される一覧（`pjr-index.md`）や派生ビューにより、全体の状況や残課題を一覧で見渡し可能                                    |

#### 運用の流れ

オーケストレーターと対話しながら進める場合、次のように plan モードから register へ情報を昇格させる運用を推奨します。

1. **会話の中での検討・下書き（plan モード）**: オーケストレーターと対話しながらアプローチを検討する段階では、AI ツールの plan モードを使って自由に方針や作業手順を下書きします。この plan は使い捨てのドラフトとして扱います。手元にログを残したい場合でも、`plansDirectory` を `tmp/plans` などの Git コミット対象外のディレクトリに指定し、リポジトリにコミットしません。
2. **残す判断の記録（register: decision）**: 会話や plan モードで合意した設計方針・重要な判断は、plan モード内に放置せず、`decision` 種別の個票として登録簿に書き写します。決定者、決定日、承認方式を記録することで、後から経緯を検証可能にします。
3. **作業範囲と完了条件の確定（register: todo）**: 実行すべき作業範囲は、`todo` 種別の個票として登録簿に登録し、plan モードで検討した具体的な作業項目や検証条件を「完了条件」セクションへ書き写します。
4. **タスクの実行と追跡（exec）**: 登録された todo に対して `specdojo exec` を実行し、exec plan と result を通じて成果物の変更と検証を進めます。

## 4. 安全と権限

オーケストレーターは、状態やファイルを変える操作を承認なしに実行しません。CLI 側の権限機構でも同じ方針を多重に担保します。

- 破壊的変更や `git push` は行いません。`git commit` は明示的に依頼した場合のみ行います。
- 認証情報・秘密鍵・`.env` / `secrets/` は読み込みません。
- 会話で確定していないプロジェクト事実（担当・期日・結論など）を勝手に埋めません。
- Codex は `approval_policy` により状態変更時に承認を求めます。OpenCode は読み取り系の `specdojo` のみ許可し、その他の `specdojo` 実行は都度確認します。

影響の大きい操作（`specdojo exec run` など、エージェントを起動して成果物を生成・更新するもの）は、対象と実行範囲を提示して承認を得てから実行します。

## 5. 設定ファイルの構成

指示本文（システムプロンプト）の正本を1ファイルに集約し、各 agent CLI の設定はその本文を埋め込む薄いラッパーとしています。4系統の設定形式は非互換のため、単一のネイティブ設定ファイルを共有することはできません。リポジトリ内で使うラッパーに加え、`config scaffold` で利用者へ配る provider テンプレートも同じ本文から生成します。

| 役割               | パス                                       |
| ------------------ | ------------------------------------------ |
| 本文の正本（SSOT） | `.agents/specdojo-orchestrator.agent.md`   |
| Claude Code        | `.claude/agents/specdojo-orchestrator.md`  |
| GitHub Copilot     | `.github/agents/specdojo-orchestrator.md`  |
| Codex              | `.codex/agents/specdojo-orchestrator.toml` |
| OpenCode / Qwen    | `.opencode/agents/qwen-orchestrator.md`    |
| OpenCode / Gemma   | `.opencode/agents/gemma-orchestrator.md`   |

本文を変更する場合は、次の手順で全環境を同期します。

1. SSOT の `.agents/specdojo-orchestrator.agent.md` を編集します。
2. `npm run orchestrator:sync` を実行し、環境別ラッパーと配布テンプレートへ本文を生成します。
3. `npm run lint:orchestrator-sync` を実行し、10個の同期対象が SSOT とバイト単位で一致することを確認します。

同期対象の一覧は `tools/validate-orchestrator-sync.mjs` を正本とします。pre-commit hook は対象ファイルの変更時に `npm run orchestrator:sync` を実行し、本文の反映漏れを自動で補います。モデル・権限・provider の変更は本文ではなく、各ラッパーの frontmatter / TOML 側で行います。
