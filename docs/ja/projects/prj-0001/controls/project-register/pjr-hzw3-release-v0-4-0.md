---
specdojo:
  id: prj-0001:pjr-hzw3-release-v0-4-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-18T05:54:03Z"
  completed_at: "2026-10-18T13:47:40Z"
  conclusion: "範囲の 14 件を close し、specdojo 0.4.0 と @specdojo/docs-lint 0.2.1 を 2026-10-18 に公開した（PR #16 の merge commit 445e611d0、npm run check を通した develop の d56af8fc8 と同じ内容）。公開の workflow と GitHub Pages の deploy は成功し、公開された 0.4.0 を空のリポジトリへ入れて init で 2 段構成の名簿と接続のサンプルが作られることを確かめた。tarball での導入の確認で、新しいリポジトリの最初の実行が止まる不具合 2 件（PJR-Z104・PJR-6EF8）を見つけて公開前に直した"
---

# PJR-HZW3 v0.4.0 を公開する

## 1. 概要

0.4.0 の範囲（agent の名簿の 2 段構成の EANK・YK1C・TSP6・8MPY・8TGQ と、7WME・SJ0G・4Z6N・0JJB）を終えた後、CHANGELOG の記載漏れを補い、develop を main へ昇格して v0.4.0 を公開する

## 2. 完了条件

- 次の 0.4.0 の範囲の項目がすべて close されている。
  - agent の名簿の 2 段構成: PJR-EANK・PJR-YK1C・PJR-TSP6・PJR-8MPY・PJR-8TGQ（[[prj-0001:pjr-zm1k-agent-members-model-alias]]）
  - PJR-7WME（derived_from）・PJR-SJ0G（plan の一覧の参照）・PJR-4Z6N（approach の手順のガイド）・PJR-0JJB（統合テストの時間切れ）
  - PJR-G5AB（init の対話からカタログの質問をなくす。2026-10-18 に追加）
  - PJR-NJ6J（`--on-rate-limit wait` が codex の usage limit で待たずに止まる。2026-10-18 に追加）
  - PJR-CCXN（devcontainer の scaffold で常時稼働ホストへの接続のサンプルを作る。2026-10-18 に追加）
  - PJR-Z104（plan の要点に検査の扱いがなく、新しいリポジトリの最初の実行が止まる。2026-10-18 に追加）
  - PJR-6EF8（npm init の仮の test script で最初の実行が止まる。2026-10-18 に追加）
- 範囲を広げる場合は、利用者の承認を得て、この個票の範囲に書き足す。
- CHANGELOG の `## [0.4.0] - 未定` の節で、0.3.1 の後に統合した利用者に見える変更の記載漏れを補う。少なくとも PJR-2CQR（実行中の routine の表示）と PJR-VGNG（Job Run の部分成功）を載せ、PJR-MX4F・PJR-YFBW を載せるかを確かめる。
- 公開日を記入し、develop の `npm run check` が通る。
- `npm pack` の tarball を空のリポジトリへ入れ、`init`・`register scaffold`・`register add`・`register build`・`kata list` と、`exec run --register --worktree` から `register close` までが通る。2 段構成の名簿の雛形が生成され、schema の検証を通る。
- develop から main への昇格の PR（merge commit）を作り、利用者が merge する。PR の作成・push・tag・公開の承認は利用者が行う。
- `v0.4.0` のタグで `publish-specdojo.yml` と `deploy.yml` が通り、公開された 0.4.0 を導入して確かめる。

## 3. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ         |
| --- | ------------------------------------ | ---- | ---- | ------------ |
| 1   | 範囲の項目を終える                   | DEV  | open | -            |
| 2   | CHANGELOG を補い、公開前の確認をする | DEV  | open | -            |
| 3   | 昇格・タグ・公開を行う               | DEV  | open | 利用者が行う |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zm1k-agent-members-model-alias]]（0.4.0 の対象の決定）
