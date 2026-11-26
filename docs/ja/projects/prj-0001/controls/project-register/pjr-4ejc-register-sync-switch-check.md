---
specdojo:
  id: prj-0001:pjr-4ejc-register-sync-switch-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: open
  priority: medium
  registered_at: "2026-11-26T22:26:24Z"
  derived_from:
    - PJR-VM2S
---

# PJR-4EJC register_sync を有効にした直後の確かめの記録

## 1. メモ

2026-11-26（JST 2026-11-27）に、prj-0001 で `register_sync` を有効にした直後の動きを確かめた。

| 確かめたこと                     | 結果                                                                                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `register add --commit` の記帳先 | 専用ブランチの worktree で commit され（af1d56a585）、`origin/project/prj-0001/register` へ push された。develop の HEAD と作業ツリーは変わらなかった |
| `register branch-check`          | af1d56a585 で「Register push checks passed.」                                                                                                         |
| `register branch-merge`          | develop へ `--no-ff` で取り込まれた（2fb5e53e86）                                                                                                     |
| `register branch-guard --staged` | develop で個票を直接変えて stage すると、終了コード 1 で止めた（試した変更は戻した）                                                                  |
| `register branch-guard --range`  | 取り込みと smoke の範囲で「No direct register file changes found.」                                                                                   |
| `exec smoke`（JSEY）             | smoke-targets・start・対応結果の転送・review が専用ブランチへ commit・push され、develop 側の exec の commit は run の記録だけだった                  |

- 専用ブランチの worktree（`.git/specdojo/register/a9c7880d34d6b51c/worktree`）には、commit の hook のため `node_modules` のリンクを置いた。

## 2. 入力

- 2026-11-26 に indie が develop を push し、register branch-push で project/prj-0001/register を作った

## 3. 背景・文脈

_TODO_: このメモを残す理由、関連する経緯、参照時の注意点を記載する。

## 4. フォローアップ

- まだ確かめていないこと: schedule の claim・complete のイベントが専用ブランチへ書かれること（次の型の run で見る）、prj-0002 からの起票が同じブランチに入り `branch-check` を通ること、`branch-check` が範囲外のファイルを含む commit を止めること。
- 試しの期間は PJR-VM2S のとおり 2026-11-30 まで。結果は VM2S の切り替えの条件に照らして利用者が判断する。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
