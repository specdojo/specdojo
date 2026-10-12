---
specdojo:
  id: prj-0001:pjr-2h5f-devcontainer-scaffold
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-09-28T23:27:46Z"
---

# PJR-2H5F specdojo devcontainer scaffold で利用リポジトリに devcontainer を生成する

## 1. 概要

PJR-E8TT（初期リリースで前面に出すものの決定）は、devcontainer を初期リリースから外した。理由は「現行の `.devcontainer/` が本リポジトリ専用（ollama、agy、claude、codex、6 個のボリューム、cron）で、配布には設計作業を要する」ためであり、価値を否定したものではない。

2026-09-29、利用者から、tmux によるリモート接続と違い devcontainer は設定すれば動くため、`specdojo devcontainer scaffold` で設定できれば初期リリースに加えてよいという提案があった。orchestrator は、配布用に範囲を絞ることを条件に賛成した。「npm で導入し、会話で起票・実行する」までの体験に、agent の CLI がそろった隔離環境を 1 コマンドで足せ、E8TT が前面に出すと決めた orchestrator の体験を補強する。

scaffold の土台として、`config scaffold --provider <name>` が provider ごとのテンプレート（`templates/<provider>/`）を配置する仕組みがある。

## 2. 完了条件

- `specdojo devcontainer scaffold` が、利用リポジトリに `.devcontainer/`（`devcontainer.json` と必要な補助ファイル）を生成する。
- 既定の構成は Node と git を基本とし、agent の CLI は指定した provider の分だけ入れる（例: `--provider claude,codex`）。各 CLI は公式の導入方法に従う（claude は `install.sh`）。
- ollama への接続、定期実行（cron）、tmux は、既定では入れず、オプションで追加できる。
- agent の認証情報は、名前付きボリュームで永続化する方式にとどめる。ホストの認証情報・秘密鍵・`.env` をコンテナへマウントする設定は、既定では生成しない。
- 利用リポジトリに `.devcontainer/` がすでにある場合は上書きしない。`--force` を指定したときだけ上書きし、`--dry-run` で生成する予定のファイルを表示できる。
- 生成する設定のテンプレートは package に同梱され、本リポジトリ専用の `.devcontainer/` とは分けて保守される。
- 生成した設定から、少なくとも Docker Desktop on macOS でコンテナを作り、`npm run orch:<provider>` でオーケストレーターを起動できることを確認し、手順と結果を対応結果に記録する。
- README の「使い始める」と、`command-reference.md` に記載されている。README では devcontainer を任意の手順として示す。
- 単体テストで、生成されるファイルとオプションの反映、既存の `.devcontainer/` を上書きしないことを確かめる。
- 完了後、PJR-E8TT の個票に、devcontainer を初期リリースへ加えた判断の変更を追記する。
- `npm run check` が成功する。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                                                               |
| --- | --------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------ |
| 1   | 配布用の最小構成とオプションを設計する                    | ARC  | done | Node・Git を基本とし、provider と追加機能を任意指定にした          |
| 2   | テンプレートと `devcontainer scaffold` コマンドを実装する | DEV  | done | package 同梱の `templates/devcontainer/` から 2 ファイルを生成する |
| 3   | 実機でコンテナを作り、orchestrator の起動を確認する       | DEV  | done | Host Mac で確認（2026-10-12）                                      |
| 4   | README・コマンドリファレンスへ記載する                    | DEV  | done | 任意手順、オプション、上書き・認証情報の方針を記載した             |
| 5   | PJR-E8TT に判断の変更を追記する                           | PM   | done | 2026-09-29 の追記として反映済み                                    |

## 4. 対応結果

`specdojo devcontainer scaffold` を実装し、package に同梱する `templates/devcontainer/` から `devcontainer.json` と `post-create.sh` を生成するようにした。既定は Node 22 と Git の最小構成であり、agent CLI は `--provider` で指定した `antigravity`、`claude`、`codex`、`opencode` だけを導入する。2026-10-07 に公式手順を再確認し、Claude と Antigravity は公式の `install.sh`、Codex は `@openai/codex`、OpenCode は `@opencode/cli` を利用する構成にそろえた。

Ollama 接続、cron、tmux はそれぞれ `--ollama`、`--cron`、`--tmux` を指定した場合だけ追加する。provider の設定・認証情報と Git・GitHub CLI の設定はリポジトリ名を接頭辞とする named volume に保存する。ホストの認証情報、秘密鍵、`.env` は mount しない。既存の `.devcontainer/` は通常実行では変更せず、`--force` の場合だけ生成対象を上書きする。`--dry-run` は書き込む予定の 2 ファイルを表示する。

README の「使い始める」では Dev Container を任意手順として案内し、[[specdojo:command-reference]] には全オプション、named volume の保存先、分離方針、dotfiles の扱いを記載した。[[prj-0001:pjr-e8tt-initial-release-positioning]] には、配布用の最小構成を分離できたため初期リリースへ含めるという判断変更を追記した。単体テストは基本構成、追加機能、provider ごとの mount と導入コマンド、既存構成の保護、`--force`、リポジトリ名の正規化を対象とする。

executor 環境には Docker と `devcontainer` CLI が無いため、Docker Desktop on macOS での作成と orchestrator の起動確認は実施できない。Host Mac で空のリポジトリに `config scaffold --provider <provider>` と `devcontainer scaffold --provider <provider>` を適用し、`devcontainer up --workspace-folder .` の後に `devcontainer exec --workspace-folder . npm run orch:opus`（Claude）、`orch:codex`、`orch:opencode`、`orch:agy` をそれぞれ実行して確認する。この確認は対話ログインや provider の利用枠を使うため、人が実施する。Codex の sandbox 固有の確認は [[prj-0001:pjr-ezaf-devcontainer-template-codex-sandbox]] で追跡する。

実機の確認（2026-10-12、利用者）: Host Mac の Docker Desktop で、`npm pack` の tarball（0.3.0）を入れた確認用のリポジトリに `specdojo devcontainer scaffold --provider claude,codex --editor emacs --tmux` で devcontainer を生成してコンテナを作り、`config init`・`config scaffold --provider claude` の後に `npm run orch:opus` で orchestrator が起動することを確かめた。確認の過程で次の点が分かった。

- `docker exec` で直接入ると既定のユーザーが root になり、node のホームに入った `claude` が見つからない（`spawn claude ENOENT`）。`-u node` を付けると解消する。[[prj-0001:pjr-pv5b-devcontainer-scaffold-observations]] に記録した。
- `--tmux` などの任意機能は指定しないと入らない（同上）。
- codex の sandbox がシステムの bubblewrap で失敗する件は [[prj-0001:pjr-xy4c-devcontainer-codex-system-bwrap]] で扱う。

## 5. 関連ドキュメント

- PJR-E8TT（初期リリースで前面に出すものの決定）
- `.devcontainer/`（本リポジトリ専用の現行構成）、`templates/`（provider ごとのテンプレート）
- `src/exec-provider-scaffold.ts`（`config scaffold` の実装）
