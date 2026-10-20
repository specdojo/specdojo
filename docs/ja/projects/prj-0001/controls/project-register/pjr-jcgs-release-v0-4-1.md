---
specdojo:
  id: prj-0001:pjr-jcgs-release-v0-4-1
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-19T22:11:27Z"
  derived_from:
    - PJR-HZW3
---

# PJR-JCGS v0.4.1 を公開する

## 1. 概要

0.4.0 の公開の後に統合した不具合の修正と追加機能（統合後の review と夜間の orchestrator、devcontainer の推奨の設定、orch の script の名前の統一など）と A6PV を範囲とし、CHANGELOG を見直して develop を main へ昇格し v0.4.1 を公開する（2026-10-20、利用者が推奨の流れを承認）

## 2. 完了条件

- 次の 0.4.1 の範囲の項目がすべて close されている。
  - 追加機能: PJR-T46Y（統合後の review と自動の close）・PJR-6DHY（夜間の orchestrator）・PJR-NS8Y（親検証の build と format-check）・PJR-EN6M（devcontainer の推奨の設定の preset）
  - 変更: PJR-16S0（orch の script の名前を model の系統にそろえる）・PJR-283N（雛形の空行をまとめる）
  - 不具合修正: PJR-7AW0・PJR-8WBN・PJR-0EFN・PJR-G90K・PJR-E412・PJR-DKD8・PJR-GHBP・PJR-A6PV・PJR-EJ4F（2026-10-20 に追加）・PJR-0M7W（2026-10-20 に追加）・PJR-5JRJ（2026-10-20 に追加）・PJR-2DA0（2026-10-20 に追加）・PJR-C50G（2026-10-20 に追加）・PJR-5HYP（2026-10-20 に追加）・PJR-3K1X・PJR-XRAB・PJR-HE9R・PJR-87XS（2026-10-20 に追加）・PJR-SVHF（2026-10-20 に追加）・PJR-7P27（2026-10-21 に追加）
- 範囲を広げる場合は、利用者の承認を得て、この個票の範囲に書き足す。
- CHANGELOG の `## [0.4.1] - 未定` の節に範囲の項目の利用者に見える変更が載っていることを確かめ、漏れを補う。公開日を記入する。
- develop の `npm run check` が通る。
- `npm pack` の tarball を `npm init -y` で作った空のリポジトリへ入れ、`init --yes --provider claude --exec --devcontainer`（推奨の preset を含む）と、`register add` → `exec run --register --worktree` → `register close` が通る。
- develop から main への昇格の PR（merge commit）を作り、利用者が merge する。PR の作成・push・tag・公開の承認は利用者が行う。
- `v0.4.1` のタグで `publish-specdojo.yml` と `deploy.yml` が通り、公開された 0.4.1 を導入して確かめる。
- 公開の後に、prj-0002 の PJR-SGM6（LP の orch の script の表）を流せることを利用者へ伝える。

## 3. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ         |
| --- | ------------------------------------ | ---- | ---- | ------------ |
| 1   | 範囲の項目を終える                   | DEV  | open | -            |
| 2   | CHANGELOG を補い、公開前の確認をする | DEV  | open | -            |
| 3   | 昇格・タグ・公開を行う               | DEV  | open | 利用者が行う |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-hzw3-release-v0-4-0]]（前の版の公開）
