---
specdojo:
  id: prj-0001:pjr-keqq-devcontainer-template-volumes
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T06:29:15Z"
  due_on: null
  completed_at: "2026-10-04T08:25:41Z"
  conclusion: scaffold の named volume を `<repository>-specdojo-`* としてリポジトリごとに分離し、OpenCode のデータと GitHub CLI の volume を追加した。保存先の一覧、分離の理由、dotfiles の自動導入、volume 名の衝突の注意をコマンドリファレンスに記載した
---

# PJR-KEQQ devcontainer テンプレートの named volume を本体とそろえ、共有の方針を決める

## 1. 概要

specdojo devcontainer scaffold のテンプレートは、opencode provider でも ~/.local/share/opencode を named volume にしないため、リビルドで OpenCode の API key（auth.json）が消える（本体は PJR-MP2P までに specdojo-opencode-data で対応済み）。volume 名は本体と同じ specdojo-* に固定され、利用リポジトリと本体で認証情報や git 設定を共有する。GitHub CLI の volume もない。テンプレートで作るコンテナの保存先の一覧と、dotfiles が VS Code のユーザー設定で自動導入されることも文書にない

## 2. 完了条件

- opencode provider を指定したとき、scaffold が `~/.local/share/opencode` を named volume として mount し、`prepare` 相当の処理で所有者を整える。リビルド後も OpenCode の `auth.json` が残ることを確認している。
- volume 名を本体と共有するか、プロジェクトごとに分けるか（例: リポジトリ名を接頭辞にする）を決め、理由とともに記録している。判断では、認証情報を使い回せる利便性、プロジェクトごとのアカウントの使い分け、`safe.directory` などコンテナ固有の git 設定の混在を比べる。決めた方針に scaffold の出力をそろえる。
- GitHub CLI（`~/.config/gh`）の volume を、`gh` を使う場合に追加するかを決め、決めた内容に合わせる。
- テンプレートで作るコンテナの設定・認証情報の保存先の一覧と、dotfiles が VS Code のユーザー設定（`dotfiles.repository`）で自動導入されることを、`docs/ja/specdojo/references/command-reference.md` の `devcontainer scaffold` の説明、または利用者向けのガイドに記載している。本体の一覧（[[tsd-home-mac-dev-server]] の「設定と認証情報の保存先」）と対応が取れている。
- scaffold の unit test を、追加した volume と方針に合わせて更新している。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                               | 担当 | 状態 | メモ                       |
| --- | -------------------------------------------------- | ---- | ---- | -------------------------- |
| 1   | opencode のデータ volume の追加                    | DEV  | done | `opencode-data` を追加     |
| 2   | volume 名の共有方針の決定と反映                    | DEV  | done | リポジトリごとに分離       |
| 3   | GitHub CLI の volume の要否の判断と反映            | DEV  | done | 常時 mount する            |
| 4   | 保存先の一覧と dotfiles の説明の記載、テストの更新 | DEV  | done | コマンドリファレンスへ記載 |

## 4. 対応結果

scaffold が生成する named volume は、保存先を本体の構成とそろえたうえで、対象リポジトリ名を正規化した `<repository>-specdojo-*` に変更した。本体や別リポジトリと認証情報を共有する利便性より、プロジェクトごとのアカウント分離とコンテナ固有の `safe.directory` などを混在させないことを優先した。同じリポジトリの Dev Container を rebuild / recreate する場合は同じ volume 名になるため、設定と認証情報は引き継ぐ。

OpenCode provider には `/home/node/.local/share/opencode` の `opencode-data` volume を追加し、`post-create.sh` で設定・認証用の mount 先とともに所有者を整えるようにした。GitHub CLI の `/home/node/.config/gh` は、後から `gh` を導入する利用者も認証を失わないよう、provider に関係なく常時 mount する。

[[specdojo:command-reference]] の `devcontainer scaffold` に保存先と volume 名の一覧、共有しない理由、OpenCode の `auth.json`、Git 設定、VS Code User Settings の `dotfiles.repository` による dotfiles の自動導入を記載した。unit test はリポジトリ別の volume 名、GitHub CLI、OpenCode の設定とアプリデータの mount を検証するよう更新した。残課題はない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-mp2p-devcontainer-config-persistence]]: 本体の devcontainer の保存先の一覧を整えた項目。
- [[prj-0001:pjr-ezaf-devcontainer-template-codex-sandbox]]: テンプレートで codex の sandbox が動くかの確認。同じテンプレートを変更するため、作業の順序に注意する。
- [[tsd-home-mac-dev-server]]: 本体の保存先の一覧と、dotfiles によるエディタ設定の導入。
- `templates/devcontainer/devcontainer.json`、`templates/devcontainer/post-create.sh`、`src/devcontainer-scaffold.ts`
