---
specdojo:
  id: prj-0001:pjr-8tdx-devcontainer-tmux-conf
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
  registered_at: "2026-11-03T10:21:19Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-03T22:51:58Z"
  conclusion: tmux を入れる構成で .devcontainer/tmux.conf を生成し、post-create.sh で既存の普通のファイルを上書きせずに ~/.tmux.conf へリンクするようにした
  commit_type: feat
  commit_scope: devcontainer
---

# PJR-8TDX devcontainer の生成で tmux の設定を配置する

## 1. 概要

tmux を入れる構成で .devcontainer/tmux.conf を生成し、コンテナの起動時に ~/.tmux.conf へリンクする。既存の ~/.tmux.conf は上書きしない

## 2. 入力

- このリポジトリの .devcontainer には tmux.conf（マウス操作・クリップボード・256 色の 6 行）があり、post-start.sh が ~/.tmux.conf へ ln -sfn でリンクしている。init --devcontainer と devcontainer scaffold が作る .devcontainer には tmux.conf も配置の処理もなく、post-start.sh もない（postCreateCommand だけ）（2026-11-03）
- tmux は --tmux を付けるか preset が recommended 以上のときに apt で入る。ホストから tmux で入る使い方は remote-host 開発ガイドで案内している（2026-11-03）
- 利用者の判断: tmux を入れる構成では、このリポジトリと同じ内容の tmux.conf を生成し、生成する post-create.sh で ~/.tmux.conf へリンクを張る（post-start.sh と postStartCommand は足さない。リンクなので tmux.conf の中身の変更はそのまま反映される）。利用者が既に ~/.tmux.conf（リンクでないもの）を持っている場合は上書きしない。生成物のテストと remote-host 開発ガイドの説明を足す（2026-11-03）

## 3. 完了条件

- tmux を入れる構成（`devcontainer scaffold --tmux`、または preset が `recommended` 以上、`init --devcontainer` から呼ぶ場合も含む）で、`.devcontainer/tmux.conf` が生成される。中身は、マウス操作（`set -g mouse on`）、クリップボード（`set -g set-clipboard on`）、256 色（`set -g default-terminal "tmux-256color"` と `set -as terminal-overrides ',*:Tc'`）の設定と、説明の注記である
- tmux を入れない構成では、`tmux.conf` もリンクの処理も生成しない
- 生成する `post-create.sh` が、スクリプトと同じ `.devcontainer/` の下の `tmux.conf` を `~/.tmux.conf` へリンクする（`ln -sfn`）。`~/.tmux.conf` がないか、すでにリンクの場合だけ張り、普通のファイルは上書きしない。`tmux.conf` がなければ何もしない。`post-start.sh` と `postStartCommand` は足さない
- `--dry-run` の出力に `tmux.conf` が含まれ、既存の `.devcontainer/` は `--force` なしでは上書きしない（今の動きを保つ）
- 生成物のテスト（tmux あり・なしの両方）を足し、post-create.sh のリンクの処理を shellcheck で確かめている
- remote-host 開発ガイド（[[specdojo:remote-host-development-guide]]）に、生成される `tmux.conf` とリンクの扱い、既存の `~/.tmux.conf` を上書きしないことを書いている
- CHANGELOG の Unreleased の節に書いている。保護された設定（`.specdojo/**`・`package.json` など）と、このリポジトリの `.devcontainer/` は変えない
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流し、親の検証が通る。未決の点は executor が決め、理由を個票の対応結果に記録する

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ |
| --- | ---------------------------------------------- | ---- | ---- | ---- |
| 1   | scaffold で tmux.conf とリンクの処理を生成する | DEV  | done | -    |
| 2   | テストとガイド・CHANGELOG を足す               | DEV  | done | -    |

## 5. 対応結果

- `devcontainer scaffold` で tmux を含める構成（`--tmux`、preset `recommended` / `full`、`init --devcontainer`）において、`.devcontainer/tmux.conf`（マウス操作・クリップボード・256 色設定）を生成するようにした（`templates/devcontainer/tmux.conf` および `src/devcontainer/scaffold.ts`）。
- 生成する `post-create.sh` で、スクリプトと同じ `.devcontainer/tmux.conf` を `~/.tmux.conf` へ `ln -sfn` でリンクする処理を追加した。`~/.tmux.conf` が存在しないか既にシンボリックリンクの場合のみリンクし、利用者の通常ファイルは上書きしない。また `tmux.conf` が存在しない場合は何もしない。`post-start.sh` と `postStartCommand` は追加しない。
- tmux を含めない構成（`preset: "minimal"` や `--tmux` なしの個別指定）では、`tmux.conf` もリンク処理も生成しないようにした。
- `--dry-run` 出力に `tmux.conf` を含め、既存 `.devcontainer/` は `--force` なしでは上書きしない動作を維持した。
- `tests/src/devcontainer/scaffold.test.ts` に tmux あり・なしの両方の生成物テスト、`post-create.sh` のリンク処理の動作検証（未作成時・既存シンボリックリンク時・通常ファイル存在時・tmux.conf 不在時）、および shellcheck による検証テストを追加した。
- `docs/ja/specdojo/guides/remote-host-development-guide.md` に生成される `tmux.conf` とシンボリックリンクの仕様、既存 `~/.tmux.conf` の保護について追記した。
- `CHANGELOG.md` の `[Unreleased]` の追加機能節に項目を記載した。
- 保護された設定（`.specdojo/**`、`package.json` 等）および本リポジトリの `.devcontainer/` は変更していない。

## 6. 関連ドキュメント

- [[specdojo:remote-host-development-guide]]
