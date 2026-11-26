---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-interface-sample-140-20261126t202514z-81dfc07e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-interface-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-interface-sample-140/T-KATA-REVIEW-ALL-imp-interface-sample-140-20261126T202514Z-81dfc07e/plan.md
  started_at: "2026-11-26T20:25:24.857Z"
  completed_at: "2026-11-26T20:27:43.694Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-interface-sample
    - specdojo:imp-interface-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、sample の事実を rulebook、`ifx-index`、`ifx-msg`、`ifx-cmd`、ほかの imp 系 sample、`sf-sample`、`cxd-sample` と突き合わせた。
- 不一致だった receipt I/F の波及先 ID を `ifx-cmd-receipt-print` から `ifx-cmd-receipt-printer` に直した。
- F001（変更要求の個票 ID の形式）は前の段で解消済みだった。本文は `PJR-C4A1`、frontmatter は `pjr-c4a1` になっている。
- `prettier --check`、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed。そのほかの検査は変更種別により `not_applicable`。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 正しさ | `docs/ja/specdojo/samples/imp-interface-sample.md` の「影響詳細一覧」（本部商品マスタの照会）と「未解決事項」（バーコード照会の応答時間） | 障害波及を「中（照会できなくても商品コードの手入力で会計を続けられる）」とし、応答時間の当面の扱いも「商品コードの手入力で会計を続ける」としている。しかし `ifx-index-sample` の `error_handling` は、接続不能・時間切れ・認証拒否のとき CLI が明細を追加せず停止すると定めている。商品コード照会も同じ API を使うため、API 停止時は手入力でも会計を続けられない。集約した影響度（高）は変わらない。 | バーコード値の未登録・読取失敗（手入力で継続）と、照会 API の停止（障害波及 高）を分けて書く。または一覧の `error_handling` を見直す。どちらにするかは ARC が決める。 | `ifx-index-sample` の `error_handling` | 未修正（ARC 判断待ち） |
| 2 | R4 正しさ | `docs/ja/specdojo/samples/imp-interface-sample.md` の「在庫変更イベント」 | 「在庫変更イベント」は `ifx-msg-sample` の仕様名である。一方、`ifx-msg-sample` の description は `ifx-index` での連携名を「本部への在庫変更通知」としており、これは一覧に未掲載である。 | 影響調査での呼び名を連携名にそろえるかを判断する。 | `ifx-msg-sample` の description と `ifx-index-sample` | 未修正（判断待ち） |
| 3 | R4 正しさ | `docs/ja/specdojo/samples/imp-interface-sample.md` の「影響詳細一覧」（確定済みレシートの印字） | 波及先 ID が `ifx-cmd-receipt-print` になっていたが、正しい表記は `ifx-cmd-receipt-printer` だった。 | `sf-sample` の表記にそろえて `ifx-cmd-receipt-printer` に直した。 | `sf-sample` の表記 | 修正済み |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-interface-sample.md`: 「影響詳細一覧」の確定済みレシートの印字の波及先 ID を、`sf-sample` の表記にそろえて `ifx-cmd-receipt-print` から `ifx-cmd-receipt-printer` に修正した（1 行の変更）。

## 3. 申し送り

- R4 の確かめで見つかった、本部商品マスタ照会の障害波及の扱い（major）と「在庫変更イベント」の呼び名（minor）は、sample に未反映で ARC の判断待ちである。詳細は findings に記載した。
- [major/R4 正しさ] imp-interface-sample の「影響詳細一覧」の本部商品マスタの照会で、障害波及を「中（照会できなくても商品コードの手入力で会計を続けられる）」としている。また「未解決事項」のバーコード照会の応答時間の当面の扱いが「商品コードの手入力で会計を続ける」となっている。これらは ifx-index-sample の `error_handling`（接続不能・時間切れ・認証拒否なら CLI は明細を追加せず停止する）と食い違う。商品コード照会も同じ API を使うため、API 停止時は手入力でも会計を続けられない。集約した影響度（高）は変わらない。次のアクション: バーコード値の未登録・読取失敗（手入力で継続）と照会 API の停止（障害波及 高）を分けて書くか、一覧の `error_handling` を見直すかを ARC が決める。
- [minor/R4 正しさ] imp-interface-sample の「在庫変更イベント」は ifx-msg-sample の仕様名だが、ifx-msg-sample の description では ifx-index での連携名を「本部への在庫変更通知」（一覧に未掲載）としている。次のアクション: 影響調査での呼び名を連携名にそろえるかを判断する。
- [修正済み/R4 正しさ] 「影響詳細一覧」の確定済みレシートの印字の波及先 `ifx-cmd-receipt-print` を、sf-sample の表記 `ifx-cmd-receipt-printer` にそろえた。

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の事実を rulebook、`ifx-index`、`ifx-msg`、`ifx-cmd`、ほかの imp 系 sample、`sf-sample`、`cxd-sample` と突き合わせた。誤りが確定した波及先 ID のみを直し、判断が要る 2 件は推測で改訂せず指摘として残した。F001 は前の段の修正で解消済みと確認した。rulebook と矛盾する箇所はなかった。
