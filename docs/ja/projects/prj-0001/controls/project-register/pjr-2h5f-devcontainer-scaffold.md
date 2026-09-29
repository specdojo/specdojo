---
specdojo:
  id: prj-0001:pjr-2h5f-devcontainer-scaffold
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                                                      | 担当 | 状態 | メモ                                 |
| --- | --------------------------------------------------------- | ---- | ---- | ------------------------------------ |
| 1   | 配布用の最小構成とオプションを設計する                    | ARC  | open | 現行 `.devcontainer/` から切り出す   |
| 2   | テンプレートと `devcontainer scaffold` コマンドを実装する | DEV  | open | `config scaffold` の仕組みに合わせる |
| 3   | 実機でコンテナを作り、orchestrator の起動を確認する       | DEV  | open | Docker Desktop on macOS              |
| 4   | README・コマンドリファレンスへ記載する                    | DEV  | open | -                                    |
| 5   | PJR-E8TT に判断の変更を追記する                           | PM   | open | 完了後                               |

## 4. 対応結果

-

## 5. 関連ドキュメント

- PJR-E8TT（初期リリースで前面に出すものの決定）
- `.devcontainer/`（本リポジトリ専用の現行構成）、`templates/`（provider ごとのテンプレート）
- `src/exec-provider-scaffold.ts`（`config scaffold` の実装）
