---
specdojo:
  id: prj-0001:pjr-6qda-interactive-init
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-10-08T12:52:00Z"
  due_on: null
---

# PJR-6QDA 選択式の specdojo init で、オーケストレーターと agent の実行までの設定を行う

## 1. 概要

公開物での実地の確認で、オーケストレーターや exec を使うまでに、provider ごとの scaffold、起動コマンドと agent の名簿の手書き、人の名簿の作成など手作業が多いと分かった。質問に答えるだけで、これらの設定を済ませる選択式の init を v0.3.0 に入れる。

根拠は [[prj-0001:pjr-p8tk-release-stabilization-criteria]] の「公開物での実地の確認の途中経過」。入口を register にする普及戦略（[[prj-0001:pjr-nyzr-adoption-strategy]]）の最初の一歩になる。名簿の読み込みの不具合 [[prj-0001:pjr-wzyw-agent-members-onboarding-gap]] を直した後に着手する。

## 2. 完了条件

- 新しいコマンド `specdojo init` を加える。対話できる端末では、次を順に質問し、答えに応じて設定を作る。既存の `config init` の動きは変えない。

| 質問                                                                                    | 答えに応じて行うこと                                                                                                                                                              |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| プロジェクトの ID と名前                                                                | `.specdojo/specdojo.config.json` と `.gitignore`（`config init` と同じ内容）                                                                                                      |
| 記帳（register）を用意するか（既定: はい）                                              | `register scaffold` と同じ登録簿                                                                                                                                                  |
| あなたの nickname と表示名                                                              | schema を満たす人の名簿（`pm-members.yaml`）と `members_path`                                                                                                                     |
| オーケストレーターに使う agent（claude・codex・opencode・antigravity・copilot、複数可） | provider ごとの `config scaffold` と `npm run orch:<provider>`                                                                                                                    |
| 作業を agent に任せるか（実戦・exec）                                                   | 選んだ provider の起動コマンドを `.specdojo/exec-defaults.yaml` に、executor と reporter の member を `.specdojo/agent-members.yaml` に書く。値は同梱のテンプレートの推奨値を使う |
| 成果物カタログを使うか（既定: 使わない。使う場合は small・medium・large）               | `catalog_path` などの設定のキーと `catalog scaffold --size`                                                                                                                       |
| devcontainer を作るか（既定: いいえ）                                                   | `devcontainer scaffold`（選んだ provider を渡す）                                                                                                                                 |

- 対話できない環境（標準入力が端末でない場合や CI）では質問せず、オプション（例: `--yes`、`--project`、`--provider claude,codex`、`--exec`、`--catalog small`、`--devcontainer`）だけで同じ設定を作れる。足りない値は既定値を使い、使った既定値を表示する。
- `--dry-run` で作る予定のファイルと変更を表示し、何も書かない。既存のファイルは上書きせず、スキップしたことを表示する。
- 外部の依存を追加せず、Node 標準（`node:readline/promises`）で実装する。
- 最後に、次の一歩（例: `npm run orch:claude` で起動し、まず 1 件起票する）と、作ったファイルを commit する必要があることを表示する。
- 作った設定で、名簿の読み込みと `exec run --register --dry-run` が agent を解決できることを、unit test または integration test で確かめる（対話は入力を差し替えて試す）。
- quick-start ガイドとコマンドリファレンスに `specdojo init` を載せ、手作業の手順は「個別に設定する場合」として残す。CHANGELOG の v0.3.0 の追加機能に載せる。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                             | 担当         | 状態 | メモ             |
| --- | ------------------------------------------------ | ------------ | ---- | ---------------- |
| 1   | `specdojo init` を実装し、テストと文書を更新する | DEV          | open | PJR-WZYW の後    |
| 2   | 公開物（tarball）で init から exec までを試す    | orchestrator | open | 公開の判定基準 3 |

### 2.1. review での追加の作業（2026-10-08）

公開物（`npm pack` の tarball）を新しいリポジトリに入れ、`specdojo init --yes --provider codex --exec` から `exec run --register` までを試した。init と名簿の読み込みは成功したが、次の不具合が見つかった。

- init が作る `.specdojo/exec-defaults.yaml` に、SpecDojo 本体の開発用の親検証（`lint-ts`・`lint-fm`・`lint-md`・`test-integration`・`validate-schema`・`typecheck`・`test-unit`）がそのまま入っている。新しい利用者のリポジトリにはこれらの npm script がないため、親検証がすべて失敗し、項目が waiting になった。
- `config init` と `init` が作る `run.worktree_base` の既定値が `../app1-worktrees` で、利用者のリポジトリの名前と関係がない。
- 担当（owner）が未定の項目は `exec run --register` で agent を自動では選ばない。init の最後の「次の一歩」は `npm run orch:<provider>` だけを案内しており、オーケストレーターを使わずに実行する場合の `--executor-by` / `--reporter-by` の指定が分からない。

次のとおり直す。

- init は `pipeline.parent_validations` に、利用者の `package.json` に対応する npm script（例: `lint-ts` なら `lint:ts`）がある ID だけを入れる。対応する script がなければ `pipeline.parent_validations` を作らない。入れた ID と、入れなかった理由を表示する。
- `run.worktree_base` の既定値を、リポジトリのディレクトリ名から作る（例: `../<リポジトリ名>-worktrees`）。`config init` と `init` の両方に適用する。
- init の最後の案内に、オーケストレーターを使わずに実行する場合の例（作成した executor と reporter の nickname を使った `exec run --register <id> --executor-by ... --reporter-by ...`）を加える。
- unit test で、script がない場合に親検証を作らないこと、script がある ID だけを入れること、`worktree_base` の既定値がリポジトリ名から作られることを確かめる。

## 4. 対応結果

- `specdojo init` を追加し、対話端末では project、register、人の名簿、provider、exec、成果物カタログ、Dev Container を順に選べるようにした。非対話環境では `--yes`、`--project`、`--provider`、`--exec`、`--catalog`、`--devcontainer` などで同じ設定を作り、省略した既定値を表示する。
- `.specdojo/specdojo.config.json`、`.gitignore`、`pm-members.yaml`、provider scaffold と `orch:<provider>`、選択 provider の `.specdojo/agent-members.yaml` と `.specdojo/exec-defaults.yaml`、任意の register・catalog・Dev Container を一つの処理で用意する。既存ファイルは上書きせず、`--dry-run` は書き込まない。
- 対話入力、非対話での exec 設定、agent command の解決、dry-run、複数 provider の絞り込みを unit test に追加した。Quick Start、コマンドリファレンス、CHANGELOG を更新した。
- review の実地確認を受け、利用先の `package.json` に対応する npm script がある親検証だけを `pipeline.parent_validations` へ設定し、0 件なら設定自体を省略するようにした。採用した ID と省略理由も出力する。
- `config init` と `init` の `run.worktree_base` は、実行したリポジトリのディレクトリ名から `../<リポジトリ名>-worktrees` を作るようにした。
- 次の一歩に、選択した provider の executor / reporter nickname を使う `exec run --register <id> --executor-by ... --reporter-by ...` の例を追加した。
- 残課題は、公開物の tarball を使い、実際の agent CLI の認証・利用枠を用意した環境で init から `exec run --register --dry-run` までを確認する作業である。これは作業 No. 2 として orchestrator が行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-wzyw-agent-members-onboarding-gap]]（名簿の読み込みの不具合）
- [[prj-0001:pjr-nyzr-adoption-strategy]]（普及戦略）
