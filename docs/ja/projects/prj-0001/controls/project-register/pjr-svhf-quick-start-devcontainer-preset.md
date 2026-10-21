---
specdojo:
  id: prj-0001:pjr-svhf-quick-start-devcontainer-preset
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-20T13:39:26Z"
  completed_at: "2026-10-20T21:32:20Z"
  conclusion: Quick Start ガイドの体験の手順を Dev Container と推奨 preset を選ぶ例にし、入るものと開き方、使わない場合の進め方を書いた。個別に設定する場合の例を --preset recommended 付きにし、init --yes --devcontainer で推奨 preset が入ることを書いた
  derived_from:
    - PJR-EN6M
---

# PJR-SVHF quick start に Dev Container の推奨 preset を入れる

## 1. 概要

Quick Start ガイドの導入の手順を、Dev Container を作り推奨の preset（tmux・emacs・vim・推奨の VS Code 拡張）を入れる例にそろえる。今は Dev Container を作らない例と、preset のない scaffold の例のままになっている

## 2. 完了条件

- 0.4.1 の範囲とする（2026-10-20、利用者が承認）。
- [[specdojo:quick-start-guide]] の「道場を開く（導入と初期設定）」の対話の例で、Dev Container を作るかの質問に「はい」、推奨の preset を入れるかの質問に Enter（既定の「はい」）と答える例にする。質問の文言と既定値は、今の `specdojo init` の表示に合わせる（`src/commands/init.ts` で確かめる）。
- 同じ節に、推奨の preset で入るもの（tmux・emacs・vim・推奨の VS Code 拡張と設定・`.vscode/extensions.json`）と、作ったコンテナを開く方法（VS Code の「コンテナーで再度開く」または `devcontainer up`）を短く書く。詳しい説明は [[specdojo:remote-host-development-guide]] へ案内し、同じ説明を重ねて書かない。
- 「個別に設定する場合」の `devcontainer scaffold` の例を `--preset recommended` 付きにし、preset を使わない場合に `--ollama`・`--cron`・`--tmux` で個別に足せることを残す。
- 「CLIを初期設定する」の `init` の説明と `--yes` の例が、`--devcontainer` で推奨の preset が入ることと食い違わないようにする。
- 10 分で体験する流れ（記帳だけで進められること）は変えない。Dev Container を使わずに進めたい人が「いいえ」で先へ進めることも書く。
- `npm run lint:md` と `npm run docs:build` が通る。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                     | 担当 | 状態 | メモ         |
| --- | -------------------------------------------------------- | ---- | ---- | ------------ |
| 1   | Quick Start ガイドの導入の手順を推奨の preset に合わせる | DEV  | done | 0.4.1 の範囲 |

## 4. 対応結果

- 実施内容:
  - [[specdojo:quick-start-guide]] の「道場を開く（導入と初期設定）」における対話の例で、Dev Container を作る質問に `y`、推奨 preset を入れる質問に Enter（既定の「はい」）と答える例へ更新し、推奨 preset の内容（tmux・Emacs・Vim・推奨 VS Code 拡張と設定・`.vscode/extensions.json`）、コンテナの開き方（VS Code の「コンテナーで再度開く」または `devcontainer up`）、ホストで進める場合の案内を追記。
  - 「CLIを初期設定する」の `init --yes` の説明に、`--devcontainer` 指定時に推奨 preset が入ることと無効化オプション（`--devcontainer-preset none`）を追記。
  - 「個別に設定する場合」の `devcontainer scaffold` の例を `--preset recommended` 付きにし、preset を使わない場合のオプション（`--ollama`・`--cron`・`--tmux`）の説明を整理。
  - CHANGELOG の `## [0.4.1] - 未定` に Quick Start ガイドの更新内容を記録。
- 成果物:
  - `docs/ja/specdojo/guides/quick-start-guide.md`
  - `CHANGELOG.md`
- 残課題:
  - なし

## 5. 関連ドキュメント

- [[specdojo:quick-start-guide]]
- [[specdojo:remote-host-development-guide]]
- prj-0002:PJR-H2A8（LP の初期設定の手順を同じく推奨の preset に合わせる）
