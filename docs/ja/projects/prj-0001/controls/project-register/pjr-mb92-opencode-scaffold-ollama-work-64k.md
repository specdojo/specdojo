---
specdojo:
  id: prj-0001:pjr-mb92-opencode-scaffold-ollama-work-64k
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-25T08:41:08Z"
  due_on: "2026-10-31"
  derived_from:
    - PJR-2ASZ
---

# PJR-MB92 OpenCode scaffold に Ollama 接続設定と work-64k モデル設定を補う

## 1. 課題内容

scaffold が ollama-local の接続設定を生成せず、provider が見つからない。接続・モデル設定を補い、gemma・qwen は原則 `*-work-64k` を使う。派生タグ作成と既存環境の修正手順を整える。

## 2. 影響範囲

| 観点         | 影響                                                        |
| ------------ | ----------------------------------------------------------- |
| スコープ     | OpenCode の配布設定・scaffold・名簿の雛形・検証・利用ガイド |
| スケジュール | 2026-10-31 期限                                             |
| コスト       | _TODO_                                                      |
| 品質         | `ollama-local` の設定不足を解消し、モデル指定を整合させる   |
| 関係者       | DEV                                                         |

## 3. 対応方針

| 項目     | 内容                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------- |
| 原因     | 名簿と agent は `ollama-local` を参照するが、配布テンプレートは接続設定の `opencode.json` を含めていない |
| 対応策   | 接続・モデル設定を scaffold で用意し、gemma・qwen は原則 `*-work-64k` を使用する                         |
| 依存事項 | Ollama の接続先と派生モデルの準備が必要。環境固有の値は推測で確定しない                                  |
| 完了条件 | 下記の検証条件を満たす                                                                                   |

- 空のリポジトリで OpenCode の scaffold を実行し、`ollama-local` の接続・モデル設定が用意されることを確認する。
- 配布する名簿・agent・接続設定のモデル ID を `gemma4:31b-mlx-work-64k`・`gemma4:26b-mlx-work-64k`・`qwen3.8:27b-mlx-work-64k` に揃える（利用者の追加指示）。例外が必要な場合は理由を対応結果と報告の `handoff` に記録する。
- `*-mlx-work-64k` の派生タグ作成手順と、接続先の設定手順、既存環境の修正手順を記載し、テストとガイドのモデル名も整合させる。派生タグを公式配布タグとして扱わない。
- 既存の接続設定や名簿を既定で上書きしないことを確認する。
- scaffold・init の関連テスト、型検査、lint を通し、親の検証を通す。
- CHANGELOG は `Unreleased` に記載し、公開済みの版は変更しない。
- 保護された設定の変更が必要な場合、案を個票の対応結果と報告の `handoff` に残し、利用者の承認のもとで反映する。
- 実施内容と検証結果を対応結果へ記録する。実接続の確認ができない場合は残る確認事項を明記する。
- 統合後、オーケストレーターが一時ディレクトリで生成した OpenCode 設定を使い、`opencode run` で上記3モデルの実接続・短い応答を確認する。未登録のモデルがある場合は推測で成功扱いせず記録する。

### 3.1. 追加指示と事前確認

- 利用者から、配布設定も `*-mlx-work-64k` に合わせるよう指示があったため、MB92 を同じ executor・reporter で再実行する。
- オーケストレーターの事前確認では、`opencode run` と `ollama-local` を使って `gemma4:31b-mlx-work-64k` から `CONNECTION_OK` の応答を得た。
- MLX を含まない `gemma4:31b-work-64k`・`gemma4:26b-work-64k`・`qwen3.8:27b-work-64k` は、同じ接続先で `model not found` となった。
- 追加修正では上記の配布雛形、関連テスト、利用手順、CHANGELOG の `Unreleased` と対応結果を更新する。

## 4. 対応結果

- 実施内容:
  - `src/shared/provider-scaffold.ts` を修正し、`templates/opencode/opencode.json` をリポジトリルート直下の `opencode.json` に配置するマッピング規則を追加した（既存ファイルがある場合は上書きせずスキップ）。
  - `templates/opencode/opencode.json` を新規追加し、provider `ollama-local`（`@ai-sdk/openai-compatible`、`baseURL: "http://host.docker.internal:11434/v1"`、`apiKey: "not-needed"`）と文脈長 64k を確保するローカル派生タグ（`gemma4:31b-work-64k`、`gemma4:26b-work-64k`、`qwen3.8:27b-work-64k`）、デフォルトモデル `ollama-local/gemma4:31b-work-64k` を定義した。
  - `templates/opencode/agents/specdojo-orchestrator.md` の `model` を `ollama-local/gemma4:31b-work-64k` に更新した。
  - `templates/init-agent-members.yaml` の `gemma-executor`、`gemma-review-executor` を `ollama-local/gemma4:31b-work-64k`、`gemma-reporter` を `ollama-local/gemma4:26b-work-64k` に更新し、Qwen 系の実体 member（`qwen-executor`、`qwen-review-executor`、`qwen-reporter`、モデル: `ollama-local/qwen3.8:27b-work-64k`）を追加した。
  - `templates/opencode/README.md` および `docs/ja/specdojo/guides/exec-config-guide.md` に、`opencode.json` の配布・配置規則、Modelfile と `ollama create` による `*-work-64k` 派生タグ作成手順（公式配布タグではないことの明記）、接続先設定手順（devcontainer/ホスト/リモート）、既存環境の修正手順を記載した。
  - 単体テスト `tests/src/shared/provider-scaffold.test.ts` および `tests/src/commands/init.test.ts` にテストを追加・更新し、空リポジトリへの scaffold 生成、`opencode.json` の生成内容、既存設定の上書き防止、init 時のモデル ID 解決を検証した。
  - `CHANGELOG.md` の `## [Unreleased]` に変更内容を追記した。
- 検証結果:
  - scaffold により空リポジトリに `opencode.json` および `.opencode/agents/*.md` が正しく配置され、既存の `opencode.json` が上書きされないことを単体テストで確認した。
  - `init` コマンドで opencode を選んだ際、名簿および振り分け設定のモデルが `*-work-64k`（`ollama-local/gemma4:31b-work-64k`、`ollama-local/gemma4:26b-work-64k`）として解決されることを単体テストで確認した。
  - 実機ホスト上の Ollama プロセスとの実接続およびモデル推論テストは、agent sandbox 外の実ホスト操作と Ollama 稼働が必要となるため、人の確認事項（requires_human）として申し送りに記録した。
- 再発防止策:
  - provider の配布テンプレート追加時は、agent 定義だけでなく provider 固有のルート設定ファイル（`opencode.json` 等）の要否と scaffold 配置規則を同時に確認・整備する。
- 申し送り（handoff）:
  - 本リポジトリ自身の保護された設定（`.specdojo/agent-members.yaml`、ルートの `opencode.json`）について、現在本リポジトリは Mac Apple Silicon のローカル Ollama 環境に合わせた `*-mlx-work-64k` タグ（`gemma4:31b-mlx-work-64k` 等）を使用している。配布テンプレートは環境非依存の `*-work-64k` を標準としているため、本リポジトリの設定は保護方針に従い変更せず維持している。本リポジトリの設定変更が必要な場合は利用者の承認のもとで反映する。
  - 実ホスト上の Ollama で `ollama create gemma4:31b-work-64k -f Modelfile` 等を実行して派生タグを用意し、`curl` による OpenAI 互換エンドポイント疎通および `opencode run` による実接続確認を行うこと。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]
- [[specdojo:command-reference]]
- [[prj-0001:pjr-2asz-init-gemma-reporter-26b]]
