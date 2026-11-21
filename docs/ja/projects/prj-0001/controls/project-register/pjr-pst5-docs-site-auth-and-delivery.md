---
specdojo:
  id: prj-0001:pjr-pst5-docs-site-auth-and-delivery
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: medium
  owner: PO
  registered_at: "2026-11-21T08:22:33Z"
  derived_from:
    - PJR-Q9DF
---

# PJR-PST5 文書サイトの閲覧の認証と配信（構築環境・配信先・公開範囲）をどうするか

## 1. 確認事項

cnd-specdojo の留保 A。生成ドキュメントサイトの構築環境、配信先、公開範囲、到達先、閲覧の認証を決める

## 2. 入力

- cnd-specdojo の 4.2 で、人間の PO が 2026-11-15 に留保を承認した（運用設計・非機能要件の整備まで）。追跡先の PJR が未登録だった
- 留保の間も進めてよい作業: 作業環境でのサイト構築と内容確認、ifd-specdojo での候補整理、選別方式の案の作成。保留する作業: 配信先への公開、認証方式と配信先の確定、配信の運用手順の確定
- 関係: cnd-specdojo の REL-04（承認者 → サイトの閲覧）と REL-06（サイト → リポジトリの構築時の参照）

## 3. 背景

_TODO_: この確認が必要になった背景、前提、制約を記載する。

## 4. 回答候補

| 候補 | 内容   | 利点   | 懸念   |
| ---- | ------ | ------ | ------ |
| A    | _TODO_ | _TODO_ | _TODO_ |

## 5. 回答・結論

_TODO_: 回答または採択した方針を記載する。未回答の場合は `-` とする。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 回答者   | _TODO_ |
| 回答日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
