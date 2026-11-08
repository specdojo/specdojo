---
specdojo:
  id: prj-0001:pjr-fqz5-br-bps-guide-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-08T00:03:35Z"
  derived_from:
    - PJR-3APD
---

# PJR-FQZ5 業務ルールと業務プロセスの文書を、規範文書とガイドとどう分けるかを決める

## 1. 背景

業務ルール（br）と業務プロセス（bps）は、実装の判定の処理に加えて、規範文書（pjr-rulebook など）と運用のガイド（review-guide・register-operation-guide など）とも内容が重なる。同じことを 2 か所に書かないよう、どちらを正とし、他方は何を書いて何を参照に寄せるかを決める

## 2. 入力

- 業務仕様の代表を種類ごとに 1 件作る方針で、実装と同じことを 2 回書く文書を調べた（2026-11-08）。cld・ifx-cmd・sf は bdd・ccd と同じく型の手入れで参照に寄せる（indie が決定）。
- br・bps は規範文書・ガイドとの役割の分け方を先に決める。決まるまでは代表 1 件も今の型のまま作る（indie が決定）。
- 例: br-review-verdict は review-guide の verdict の説明と、br-branch-integration-direction はブランチ運用のガイドと重なる。

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
