---
specdojo:
  id: prj-0001:pjr-q8kp-host-tmux-script-distribution
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-31T13:13:44Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-P9ZC
    - PJR-CCXN
---

# PJR-Q8KP ホストから tmux へ入る script の本体を SpecDojo から配る

## 1. 概要

ホストの ~/bin/specdojo-tmux は node の PATH 設定などを含み分かりにくい。本体を SpecDojo が配る bash の script とし、workspace の .specdojo/host/ へ書き出す。ホスト側は workspace のパスを渡して本体を呼ぶ数行に縮める。通常の接続では node を要らなくし、対応 OS は mac・Linux・Windows の WSL2 とする

## 2. 入力

- ホストの script は小さくし、本体は SpecDojo の npm で配る script で動かしたい（利用者の要望、2026-10-31）
- 本体は bash の script とし、TypeScript にはしない。ホストで node を要らなくするため（2026-10-31 の対話で推奨の B を採用）
- 本体の置き場所は CLI のコマンドで workspace の .specdojo/host/ へ書き出す方式とする。`node_modules` を直接呼ぶ方式は PJR-TATP の named volume 化と両立しないため採らない
- 止まっているコンテナは docker start で起こし、devcontainer up はコンテナが無いときだけ利用者のログインシェル経由で動かす。`SPECDOJO_NODE_BIN` で上書きできるようにする
- コンテナ内の作業ディレクトリは docker inspect のマウント情報から、実行ユーザーは devcontainer.json の remoteUser から求める
- 対応 OS は mac・Linux・Windows の WSL2 とする。ネイティブの Windows（PowerShell・Git Bash）は対象外とし、要望が出てから検討する
- 書き出すコマンドの名前（仮: specdojo devcontainer host-script）と書き出し先のファイル名は executor が決め、理由を個票の対応結果に記録してよい

## 3. 完了条件

1. CLI のコマンドで、実行できる bash の script を workspace の `.specdojo/host/` へ書き出せる。コマンドの名前とファイル名は executor が決め、理由を個票の対応結果に書く。同じ版で 2 回実行しても内容は変わらない。
2. 書き出した script は、workspace のパスを引数に 1 つ受け取るだけで動く。ホスト側の script は、本体を呼ぶ 3 行程度で済む。
3. 書き出した script は、次のとおりに動く。
   - ラベル `devcontainer.local_folder` が一致する、動いているコンテナがあれば、そのまま tmux へ入る。
   - 止まっているコンテナがあれば、`docker start` で起こしてから入る。この場合 node は要らない。
   - コンテナが無いときだけ `devcontainer up` を動かす。`SPECDOJO_NODE_BIN` があればそこを PATH に足し、なければ利用者のログインシェル（`"$SHELL" -lic`）経由で起動する。
   - コンテナの中の作業ディレクトリはマウント情報から、実行ユーザーは `devcontainer.json` の `remoteUser` から求める。求められないときは、原因を stderr に出して終了する。
4. `docker`・`devcontainer` を差し替えた bash の挙動テストで、上の 3 つの経路と失敗時の出力を確かめる。テストは `tests/src/devcontainer/` に置く。
5. `devcontainer scaffold` が生成する `specdojo-tmux.sh.sample` は、新しい方式を呼ぶだけの数行の例に置き換える。`ssh-config.sample` との整合も保つ。
6. [[specdojo:remote-host-development-guide]] と command-reference を新しい方式に直す。対応 OS は mac・Linux・Windows の WSL2 と書き、mise を使う場合は shims のディレクトリを使うと書く。
7. CHANGELOG の未公開の版の節に追記する。公開済みの節は変えない。
8. 終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通す。あわせて親の検証も通す。
9. ホストでの実際の接続は利用者が確かめる。確かめ方を個票の対応結果に書く。

## 4. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                       |
| --- | --------------------------------------------------------- | ---- | ---- | -------------------------- |
| 1   | 完了条件に沿って script・コマンド・テスト・文書を変更する | DEV  | done | 完了条件 1〜9 の対応を完了 |

## 5. 対応結果

### 実施内容

1. **コマンド名とファイル名の選定と実装**:
   - コマンド名: `specdojo devcontainer host-script`
     - 選定理由: 既存の Dev Container 関連機能（`devcontainer scaffold` など）の体系的なサブコマンドとして配置し、ホスト向けスクリプトを生成・配布する目的が直感的に分かる名称としました。
   - ファイル名: `.specdojo/host/devcontainer-tmux.sh`
     - 選定理由: ホスト側に置く呼び出し用ラッパー（`specdojo-tmux.sh`）と区別しやすく、コンテナ内の tmux セッションへ入る実体スクリプトであることが明確になるよう命名しました。
   - `src/devcontainer/host-script.ts` および `src/devcontainer/command.ts` に実装し、テンプレート（`templates/devcontainer/remote-host/devcontainer-tmux.sh`）を `.specdojo/host/devcontainer-tmux.sh` へ実行権限（`0o755`）付きで書き出す処理を追加しました。同じ版で複数回実行しても内容は同一（冪等性）です。`--dry-run` にも対応しています。
2. **スクリプト本体の動作**:
   - 引数として `workspace` パスを 1 つ受け取り、`devcontainer.json` の `remoteUser` を抽出します。
   - `devcontainer.local_folder` ラベルが一致する稼働中コンテナがあればそのまま tmux に接続します。
   - 停止中コンテナがあれば `docker start` で起動して接続します（この場合ホスト側に Node.js は不要です）。
   - コンテナが存在しない場合のみ `devcontainer up` を動かします。`SPECDOJO_NODE_BIN` があれば `PATH` に追加し、なければ利用者のログインシェル（`"$SHELL" -lic`）経由で起動します。
   - コンテナ内の作業ディレクトリは `docker inspect` のマウント情報から自動判定します。判定できない場合やコンテナ内にディレクトリが存在しない場合は原因を stderr に出力して終了します。
   - 対応 OS は macOS、Linux、Windows の WSL2 です。
3. **サンプルの更新**:
   - `templates/devcontainer/remote-host/specdojo-tmux.sh.sample` を、workspace パスを引数に渡して `.specdojo/host/devcontainer-tmux.sh` を呼び出す数行のラッパーに置き換えました。
   - `templates/devcontainer/remote-host/ssh-config.sample` および `src/devcontainer/scaffold.ts` の接続説明を、通常接続時は Node.js 不要、コンテナ未作成時のみ CLI 起動、`SPECDOJO_NODE_BIN` を設定可能とする新方式に合わせて更新しました。
4. **テストの追加と更新**:
   - `tests/src/devcontainer/host-script.test.ts` を追加し、コマンドの書き出し・実行権限・冪等性・dry-run と、fake docker/devcontainer を用いた 3 つの経路（稼働中・停止中・未作成）および異常系（引数なし・ディレクトリなし・devcontainer.json なし・remoteUser なし・マウント不一致・コンテナ内パスなし・起動失敗）を検証しました。
   - `tests/src/devcontainer/scaffold.test.ts` および `tests/src/devcontainer/scaffold.integration.test.ts` を新方式に合わせて更新しました。
5. **ドキュメントと CHANGELOG**:
   - [[specdojo:remote-host-development-guide]] および `docs/ja/specdojo/references/command-reference.md` を更新し、新方式の動作、対応 OS（macOS、Linux、Windows WSL2）、mise 使用時の shims ディレクトリ指定について記載しました。
   - `CHANGELOG.md` の未公開の版の節（`## [Unreleased]`）に追記しました。

### ホストでの実際の接続の確かめ方（利用者向け確認手順）

1. ワークスペースで `npx specdojo devcontainer host-script` を実行し、`.specdojo/host/devcontainer-tmux.sh` が作成され実行権限が付与されていることを確認します。
2. `.devcontainer/remote-host/specdojo-tmux.sh.sample` をホスト側の `~/bin/specdojo-tmux.sh` などへコピーし、実行権限（`chmod +x ~/bin/specdojo-tmux.sh`）を付与します。スクリプト内の `workspace_dir` をホスト上のワークスペースのパスに合わせます。
3. **経路 1（稼働中コンテナ）の確認**: コンテナが起動している状態で `~/bin/specdojo-tmux.sh` を実行し、即座にコンテナ内の tmux セッションへ接続できることを確認します。
4. **経路 2（停止中コンテナ）の確認**: コンテナを `docker stop` で停止させた状態で `~/bin/specdojo-tmux.sh` を実行し、コンテナが自動起動して tmux セッションへ接続できることを確認します（ホスト側の PATH に node/devcontainer がない状態でも接続できます）。
5. **経路 3（未作成コンテナ）の確認**: コンテナを削除した状態で `~/bin/specdojo-tmux.sh` を実行し、`devcontainer up` が起動して新しいコンテナが作成され、tmux セッションへ接続できることを確認します（mise などの環境で起動しない場合は環境変数 `SPECDOJO_NODE_BIN` に shims ディレクトリを設定してください）。

### 残課題・申し送り

- ホスト実環境での実際の接続確認は、Docker daemon および実環境を持つホスト上で利用者が上記の手順に沿って実施します。

## 6. 関連ドキュメント

- [[specdojo:remote-host-development-guide]]
- [[prj-0001:pjr-p9zc-remote-tmux-wrong-container]]
- [[prj-0001:pjr-ccxn-devcontainer-remote-host-samples]]
- [[prj-0001:pjr-tatp-devcontainer-named-volumes]]
