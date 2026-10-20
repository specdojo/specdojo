---
specdojo:
  id: prj-0001:pjr-3rxy-host-devcontainer-e2e-script
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-20T11:08:30Z"
  derived_from:
    - PJR-GHBP
---

# PJR-3RXY ホストで本物の devcontainer を作って確かめる E2E のスクリプトを用意する

## 1. 概要

ホストの Mac（docker と Dev Container CLI がある）で実行し、一時ディレクトリに scaffold した devcontainer を devcontainer up で作り、devcontainer exec で利用者が node であること、~/.local/bin が node の持ち物であること、tmux・vim・emacs と agent の CLI が入ったことを確かめ、最後に container と volume を片づけるスクリプトを用意する。開発用の container には docker を入れない（agent にホストの権限を与えないため。2026-10-20、利用者が案 C を選んだ）

## 2. 完了条件

- `tools/e2e/` に、ホストで実行する E2E のスクリプトを置き、`package.json` を変えずに `node --import tsx tools/e2e/<名前>.ts` などで起動できるようにする（`package.json` に script を足す場合は、案を result に書き、人が反映する）。
- スクリプトは次を行う。
  - 一時ディレクトリに空のリポジトリを作り、手元の specdojo（`npm pack` の tarball または dist）で `init --yes --provider claude --devcontainer`（推奨の preset）を行う。
  - `devcontainer up` で container を作り、`devcontainer exec` で、利用者が `node` であること、`~/.local/bin` が node の持ち物であること、tmux・vim・emacs が入っていること、Claude Code の CLI が `~/.local/bin` に入ったことを確かめる。
  - 結果を項目ごとに表示し、どれかが失敗したら終了コード 1 で終わる。
  - 最後に、作った container・image・volume を片づける（`--keep` を指定したときは残す）。
- docker と Dev Container CLI が見つからないときは、確かめ方を表示して終わる。
- スクリプトの使い方を [[specdojo:remote-host-development-guide]] か開発用の文書に書く。
- executor の sandbox には docker がないため、スクリプトの実行は `requires_human` とし、利用者がホストで流して結果を個票に残す。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG には記載しない（開発用のスクリプトのため）。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                                 |
| --- | --------------------------------------------------------- | ---- | ---- | ------------------------------------ |
| 1   | ホストで動かす devcontainer の E2E のスクリプトを用意する | DEV  | done | `tools/e2e/devcontainer-host-e2e.ts` |

## 4. 対応結果

- `tools/e2e/devcontainer-host-e2e.ts` を追加した。手元のソースを npm tarball にし、一時リポジトリで `init --yes --provider claude --devcontainer`、`devcontainer up`、`devcontainer exec` による項目別検査を行う。
- remote user と `~/.local/bin` の所有者が `node` であること、tmux・Vim・Emacs・Claude Code CLI が導入されること、および開発用コンテナに Docker CLI がないことを検査する。
- 通常終了時と異常終了時に container・名前付き volume・新規 container image・一時ディレクトリを片づけ、`--keep` 指定時だけ調査用に残す。
- [[specdojo:remote-host-development-guide|常時稼働ホスト運用ガイド]] に実行方法と前提条件を追記した。
- executor の sandbox では Docker を利用できないため、Mac ホストでの実行結果の記録は利用者による確認を要する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ghbp-devcontainer-local-bin-and-tmux-user]]（元の項目）
- [[prj-0001:pjr-en6m-devcontainer-recommended-preset]]（確かめる preset）
