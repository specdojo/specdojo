---
specdojo:
  id: prj-0001:pjr-q8kp-host-tmux-script-distribution
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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

| No  | 作業                                                      | 担当 | 状態 | メモ |
| --- | --------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 完了条件に沿って script・コマンド・テスト・文書を変更する | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:remote-host-development-guide]]
- [[prj-0001:pjr-p9zc-remote-tmux-wrong-container]]
- [[prj-0001:pjr-ccxn-devcontainer-remote-host-samples]]
- [[prj-0001:pjr-tatp-devcontainer-named-volumes]]
