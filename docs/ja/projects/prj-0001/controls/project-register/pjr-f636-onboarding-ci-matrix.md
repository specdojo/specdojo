---
specdojo:
  id: prj-0001:pjr-f636-onboarding-ci-matrix
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
  registered_at: "2026-11-23T13:17:07Z"
  due_on: "2026-11-30"
  depends_on:
    - PJR-B6M3
  commit_type: ci
  commit_scope: onboarding
---

# PJR-F636 導入のパターンを CI で確かめる（Linux の Dev Container と macOS）

## 1. 概要

Linux の Dev Container と macOS の手元の導入を GitHub Actions で確かめ、WSL はリリースの前のチェックリストにする

## 2. 入力

- 利用者の依頼（2026-11-23）: 多くの人に使ってもらうため、Dev Container・Dev Container ＋ tmux・mac・mac ＋ tmux・WSL・WSL ＋ tmux のパターンですぐに使えるようにする
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- Linux の Dev Container の導入と、macOS の手元の導入（`init`・`doctor`・`register add`）を、GitHub Actions で確かめる。WSL は CI で確かめにくいので、リリースの前に人が流すチェックリストを運用メモに書く。
- ワークフロー（`.github/`）は保護された設定のため、案を個票の対応結果に書き、反映は利用者の承認のもとでオーケストレーターが行う。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
