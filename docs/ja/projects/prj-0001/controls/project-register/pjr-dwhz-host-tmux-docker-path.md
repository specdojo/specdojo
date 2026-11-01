---
specdojo:
  id: prj-0001:pjr-dwhz-host-tmux-docker-path
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-01T07:10:43Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-Q8KP
---

# PJR-DWHZ ssh で入るとホストの tmux スクリプトが docker を見つけられない（mac・WSL2・Linux）

## 1. 課題内容

ssh で入ったホストの非対話シェルでは PATH に docker がなく、devcontainer-tmux.sh が line 46 で docker: command not found になる。mac・WSL2・Linux で docker を探せるようにし、見つからない・動かせないときは OS に合ったヒントを出す

## 2. 入力

- 利用者が tmux でリモートから入ると、devcontainer-tmux.sh の line 46 で docker: command not found になる（2026-11-01）
- ssh で入ると mac のログインシェルの設定が読まれず、PATH は /usr/bin:/bin:/usr/sbin:/sbin になる。以前のホストのスクリプトは /opt/homebrew/bin と /usr/local/bin を PATH に足していた
- 今の本体は devcontainer up を呼ぶときだけ PATH を補い、最初の docker ps では補っていない
- ラッパーは小さく保ち、PATH の補いは本体で行う。mac・Windows（WSL2）・Linux で動くようにする（2026-11-01 の利用者の要望）
- 探し方は、今の PATH、ログインシェル（"$SHELL" -lc）への問い合わせ、よくある場所の順とし、環境変数 `SPECDOJO_DOCKER_BIN` で直接指定もできるようにする（2026-11-01 の対話で承認）
- 実機で確かめられるのは利用者の mac だけ。WSL2 と Linux は単体テストでの確認にとどめ、実機が未確認であることを記録する

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
