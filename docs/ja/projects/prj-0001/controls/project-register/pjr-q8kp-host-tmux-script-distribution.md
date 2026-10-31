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

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
