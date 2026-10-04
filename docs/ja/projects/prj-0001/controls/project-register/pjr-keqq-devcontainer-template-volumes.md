---
specdojo:
  id: prj-0001:pjr-keqq-devcontainer-template-volumes
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T06:29:15Z"
  due_on: null
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

| No  | 作業                                               | 担当 | 状態 | メモ                                 |
| --- | -------------------------------------------------- | ---- | ---- | ------------------------------------ |
| 1   | opencode のデータ volume の追加                    | DEV  | open | 確実に直す                           |
| 2   | volume 名の共有方針の決定と反映                    | DEV  | open | 利便性とプロジェクト間の分離を比べる |
| 3   | GitHub CLI の volume の要否の判断と反映            | DEV  | open | -                                    |
| 4   | 保存先の一覧と dotfiles の説明の記載、テストの更新 | DEV  | open | -                                    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-mp2p-devcontainer-config-persistence]]: 本体の devcontainer の保存先の一覧を整えた項目。
- [[prj-0001:pjr-ezaf-devcontainer-template-codex-sandbox]]: テンプレートで codex の sandbox が動くかの確認。同じテンプレートを変更するため、作業の順序に注意する。
- [[tsd-home-mac-dev-server]]: 本体の保存先の一覧と、dotfiles によるエディタ設定の導入。
- `templates/devcontainer/devcontainer.json`、`templates/devcontainer/post-create.sh`、`src/devcontainer-scaffold.ts`
