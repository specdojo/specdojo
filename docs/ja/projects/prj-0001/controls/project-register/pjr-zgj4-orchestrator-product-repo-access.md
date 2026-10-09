---
specdojo:
  id: prj-0001:pjr-zgj4-orchestrator-product-repo-access
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-10-09T19:58:13Z"
  due_on: "2026-10-31"
---

# PJR-ZGJ4 orchestrator の起動に宣言済みのプロダクトリポジトリへのアクセスを付ける

## 1. 課題内容

orch:* の起動コマンドは repos を読まないため、orchestrator から app1/ を参照・変更できない。exec と同じく宣言済みのリポジトリだけを provider ごとの方法で許可する。

## 2. 影響範囲

| 観点         | 影響                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| スコープ     | orchestrator の起動入口（`ORCHESTRATOR_NPM_SCRIPTS` と CLI）、opencode の orchestrator テンプレート、関連文書 |
| スケジュール | PJR-P08H の Dev Container 構成と合わせて、別リポジトリ構成の利用を可能にする                                  |
| コスト       | CLI の入口の追加と、provider ごとの引数の共通化                                                               |
| 品質         | orchestrator からプロダクトの実装・文書を調査・変更できず、利用者の操作の確認が増える、または書き込めない     |
| 関係者       | 別リポジトリ構成で orchestrator を使う利用者                                                                  |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `ORCHESTRATOR_NPM_SCRIPTS`（`src/exec-provider-scaffold.ts`）の `orch:*` は固定のコマンドで、`repos` の宣言を読まない。exec は runner が `agentExtraRootArguments`（`src/exec-task-repos.ts`）で provider ごとの許可を付けるが、orchestrator には同等の仕組みが無い |
| 対応策   | 起動時に対象 project の `repos` を読み、`agentExtraRootArguments` と同じ規則で許可の引数を付けて provider を起動する CLI の入口を設け、`orch:*` をその入口を呼ぶ形に変える                                                                                          |
| 依存事項 | PJR-P08H（Dev Container でプロダクトリポジトリが見えること）                                                                                                                                                                                                        |
| 完了条件 | 下記「完了条件」のとおり                                                                                                                                                                                                                                            |

### 3.1. 完了条件

- orchestrator を起動する CLI の入口があり、対象 project（解決順は既存の project 解決に従う）の `repos` に宣言したリポジトリのルートを、provider ごとの方法で許可して起動する。
  - claude・codex・antigravity・copilot は、exec と同じ引数規則（`agentExtraRootArguments` の再利用）で許可する。対象はプロダクトリポジトリの本体（`repos[].path`）とする。
  - `repos` が無い project では、従来と同じコマンドで起動する。
  - 利用者が追加で渡した引数を provider へそのまま渡せる。
- `config scaffold` が追加する `orch:*` の npm script が、その入口を呼ぶ。scaffold の時点で絶対パスを書き込まない。
- opencode の orchestrator について、宣言済みのリポジトリだけを `external_directory` で許可する方法（起動時の設定の注入など）を調べ、実現できれば実装する。実現できない場合は、制約と回避方法を文書に残す。
- unit test で、provider ごとの起動コマンド、`repos` が無い場合に従来どおりであること、未宣言のリポジトリが許可に含まれないことを確かめる。
- `command-reference`、`specdojo-config-reference` の「`repos`のキー」、`docs-structure-guide` の別リポジトリ構成に、orchestrator 経路の許可を書く。`docs-structure-guide` の「宣言していないリポジトリは exec の管理外であり、`app1-specdojo/` の agent から直接更新しません」は、宣言済みのリポジトリは orchestrator も扱えることが分かるように書き分ける。
- CHANGELOG に記載する。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run lint:md` が通る。

### 3.2. 作業内容

- 保護設定（`package.json`、`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`.github/agents/` 配下の orchestrator 本文とラッパー）は変更しない。orchestrator 本文（SSOT は `.agents/specdojo-orchestrator.agent.md`）に加える規則は、result の申し送りに文案として残す。文案の範囲は次のとおり。
  - 宣言済みのプロダクトリポジトリは参照してよい。
  - 変更は利用者が orchestrator を実装者に指定した場合に限り、そのリポジトリで `feature/<project-id>/<topic>` ブランチを切って commit する。`git push` は行わない。
  - 未宣言のリポジトリは参照・変更しない。
- 本文とラッパーへの反映は、レビュー後に orchestrator が利用者の承認を得て行う。

## 4. 対応結果

- `specdojo orchestrator launch` を追加し、`--project`、`SPECDOJO_PROJECT`、`current_project`、`projects` の先頭の順で対象 project を解決するようにした。対象 project の `repos[].path` だけを絶対パスへ解決し、Claude Code、Codex、Antigravity、GitHub Copilot には exec と共通の `agentExtraRootArguments` で許可を追加する。
- OpenCode は公式の `OPENCODE_CONFIG_CONTENT` を使い、選択した orchestrator agent の `permission.external_directory` を「全拒否、宣言済みルートだけ許可」にし、同じルートの `permission.edit` も許可して起動する。既存 inline config の他項目と永続設定は変更しない。
- `config scaffold` が追加する全 provider の `orch:*` を新しい入口へ切り替えた。コマンドには絶対パスを埋め込まず、`--` 以降の利用者引数を provider CLI へそのまま渡す。`repos` が無い場合は provider に渡すコマンドと引数を変更しない。
- unit test に provider ごとの起動コマンド、追加引数、OpenCode の許可、`repos` が無い場合、project 解決順、未宣言ルートを含めないことを追加した。
- [[specdojo:command-reference|CLIコマンドリファレンス]]、[[specdojo:specdojo-config-reference|SpecDojo設定リファレンス]]、[[specdojo:docs-structure-guide|ドキュメント構成ガイド]]、オーケストレーター運用ガイド、システム設計、CHANGELOG を更新した。
- 再発防止として、scaffold の生成コマンドと provider 別の許可 plan を unit test で固定した。保護設定の `package.json` と orchestrator 本文・ラッパーは変更していない。

## 5. 関連ドキュメント

- [[specdojo:docs-structure-guide]]（別リポジトリ構成）
- [[specdojo:specdojo-config-reference]]（`repos`のキー）
- PJR-P08H（devcontainer の親ディレクトリのマウント）
