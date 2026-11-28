---
specdojo:
  id: prj-0001:pjr-vdhc-release-v0-10-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: PO
  registered_at: "2026-11-28T11:19:22Z"
  due_on: "2026-11-30"
---

# PJR-VDHC v0.10.0 をリリースする

## 1. 概要

0.9.2 の公開の後に close した項目を CHANGELOG に集め、release ブランチで版を 0.10.0 に上げて検査し、利用者が PR の merge・タグ・npm の公開を行う

## 2. 入力

- 範囲（indie、2026-11-28）: v0.10.0 に入れると決めた項目（GDMB・HPAW・AVCB・CA6G・MACP・AG0C・DV1R・ZF6Q・QCJ5・D5RS・VKY2・VM2S など）が close 済みで、リリースの作業に入る
- v0.10.0 に入れないもの: PXNQ（リリース後に main の Dependabot を確かめる）、3R7V（`kata_locale`）、6XYD（普及の計画）、0BGE（全 sample のレビュー）、期限を 2026-12-31 に延ばした BA の項目（DJZD・MNM5・WYTX・T1D1・3APD・0T83・3R8F）
- CHANGELOG を集める範囲は、0.9.2 の公開（PJR-1FMG の close、2026-11-21T01:58:41Z）の後に close した項目
- 手順は pm-orchestrator-playbook の「リリースの手順」に従う。push・PR の merge・タグ・npm の公開の承認と、WSL の導入確認は利用者が行う。codex は 2026-12-01 1:00 まで使わない
- 担当 PO・期限 2026-11-30 は indie の指示（2026-11-28）

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
