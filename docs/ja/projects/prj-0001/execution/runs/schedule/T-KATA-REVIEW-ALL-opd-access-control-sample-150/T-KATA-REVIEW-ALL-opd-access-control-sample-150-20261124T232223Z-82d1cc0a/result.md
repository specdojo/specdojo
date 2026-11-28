---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-access-control-sample-150-20261124t232223z-82d1cc0a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-access-control-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-access-control-sample-150/T-KATA-REVIEW-ALL-opd-access-control-sample-150-20261124T232223Z-82d1cc0a/plan.md
  started_at: "2026-11-24T23:22:32.752Z"
  completed_at: "2026-11-24T23:35:54.588Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-access-control-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- kata のレビュー R5（整合）として、`opd-access-control-sample` を `opd-index-sample`、`opr-access-control-sample`、`pm-members-sample.yaml` と照合した。食い違い 3 件は sample 側を直した。
- 直したのは、剥奪と保守付与の契機の行の追加、`OPS` 兼務者のアカウントの扱い、棚卸しの照合対象の表現である。
- 相手側を直すべき 2 件（`opr-access-control-sample` の「夜間バックアップ」表記、`opd-index-sample` の棚卸し照合の表現）は変更せず、直す案を handoff に残した。
- frontmatter の `status` は `draft` のままである。`prettier --check`、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は通った。`validate:history-links` は履歴蓄積ファイルを変更していないため対象外とした。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-access-control-sample.md`: 「付与・剥奪の契機」の表に 2 行を足した。「店番をやめる」はやめた日のうちにアカウントを停止する行、「開発担当の保守作業が始まる」は作業を始める前日までに保守の区分を付与する行である。「権限区分」の表の後に、`OPS` を兼ねる人のアカウントには運用の区分を加え、運用のためのアカウントは別に作らないと明記した。「棚卸し」の表の 1 行目は、店番の予定表にも保守作業中の権限変更記録にもない人の有効なアカウントが残っていないこと、という表現に変えた。差分は 10 行追加、8 行削除。

## 3. 申し送り

- 実施内容の指摘一覧（Markdown の表として 1 回だけ記載する）: | No | 段 | 箇所 | 指摘 | 直した案・直す案 | 根拠 | 印 | | - | - | - | - | - | - | - | | 1 | R5 | `opd-access-control-sample` の「付与・剥奪の契機」の表 | `opd-index` は店番をやめた日のうちの剥奪を定めるが、sample に該当行がなかった。`opr-access-control` にある `DEV` の保守作業開始時の付与の行もなかった | 「店番をやめる」と「開発担当の保守作業が始まる」の 2 行を足した | `opd-index-sample` の権限・アカウント運用の表、`opr-access-control-sample` の申請を受け付ける条件の表 | なし | | 2 | R5 | `opd-access-control-sample` の「権限区分」の表の後の文 | アカウントは店番担当と `DEV` に限られるのに、運用の区分を `OPS` に付けるため、`OPS` 用に別のアカウントがあるように読めた。`pm-members-sample.yaml` では店主代表が `OPS` を兼ねており、「区分は 1 つだけ」の文とも食い違っていた | `OPS` を兼ねる人のアカウントには運用の区分を加え、別のアカウントは作らない旨を足した | `opd-index-sample`、`pm-members-sample.yaml` の `shop-owner`（roles: `PO`, `OPS`） | なし | | 3 | R5 | `opd-access-control-sample` の「棚卸し」の表の 1 行目 | 「店番の予定表にない人の有効なアカウント 0 件」では、正当に持つ `DEV` の保守アカウントも違反になる | 予定表と保守作業中の権限変更記録のどちらにもない人のアカウントが残っていないこと、という表現に変えた | `opd-index-sample` の「アカウントは店番担当と `DEV` に限る」 | 要判断（照合元に権限変更記録を使う表現でよいか） | | 4 | R5 | `opr-access-control-sample` のアラート対応手順（相手側・未変更） | 「夜間バックアップ」と書いているが、`opd-index` は「閉店後のバックアップ」と書く | 表記を「閉店後のバックアップ」にそろえる。`opd-monitoring-sample` の「夜間バックアップ」を分冊での呼び方として残すかも合わせて決める | `opd-index-sample` の監視・アラート方針と定期運用方針 | 要判断 | | 5 | R5 | `opd-index-sample` の権限・アカウント運用の表の「棚卸しの頻度」の行（相手側・未変更） | 「有効なアカウントと店番担当の一覧が一致するか」とあり、`DEV` の保守アカウントが不一致として扱われる | 「有効なアカウントが、店番担当と保守作業中の `DEV` の一覧と一致するか」に直す | 同じ章の「アカウントは店番担当と `DEV` に限る」 | 要判断 |
- 相手側（`opr-access-control-sample`、`opd-index-sample`）は本タスクでは変更していない。No 4 と No 5 は、それぞれの担当の段で直す必要がある。
- No: 1 / 段: R5 / 箇所: opd-access-control-sample「付与・剥奪の契機」の表 / 指摘: opd-index は「店番をやめた日のうちに剥奪する」と定めるが、sample の表に「店番をやめる」行がなかった。opr-access-control にある「`DEV` の保守作業が始まる」付与の行もなかった / 直した案: 「店番をやめる → アカウントを停止する → やめた日のうち（具体化）」と「開発担当の保守作業が始まる → 保守の区分を付与する → 作業を始める前日まで（具体化）」の 2 行を足した / 根拠: opd-index-sample の権限・アカウント運用の表、opr-access-control-sample の申請を受け付ける条件の表 / 印: なし
- No: 2 / 段: R5 / 箇所: opd-access-control-sample「権限区分」の表の後の文 / 指摘: opd-index はアカウントを店番担当と `DEV` に限る。sample は運用の区分を `OPS` に付けるため、`OPS` 用に別のアカウントがあるように読めた。また pm-members-sample では `OPS` を店主代表が兼ねており、「区分は 1 つだけ」の文と食い違っていた / 直した案: 「`OPS` を兼ねる人のアカウントには運用の区分を加え、運用のためのアカウントは別に作らない（具体化）」を足した / 根拠: opd-index-sample の権限・アカウント運用の章、pm-members-sample.yaml の shop-owner（roles: PO, OPS） / 印: なし
- No: 3 / 段: R5 / 箇所: opd-access-control-sample「棚卸し」の表の 1 行目 / 指摘: 「店番の予定表にない人の有効なアカウント 0 件」だと、正当に持つ `DEV` の保守アカウントも違反になる / 直した案: 「店番の予定表にも保守作業中の権限変更記録にもない人の有効なアカウントが残っていない」に変えた / 根拠: opd-index-sample の「アカウントは店番担当と `DEV` に限る」 / 印: 要判断（照合元に権限変更記録を使う表現でよいか）
- No: 4 / 段: R5 / 箇所: opr-access-control-sample のアラート対応手順（相手側・未変更） / 指摘: 「夜間バックアップ」と書いているが、opd-index は「閉店後のバックアップ」と書く / 直す案: opr-access-control-sample の表記を「閉店後のバックアップ」にそろえる。opd-monitoring-sample の「夜間バックアップ」を分冊での呼び方として残すかも合わせて決める / 根拠: opd-index-sample の監視・アラート方針と定期運用方針 / 印: 要判断
- No: 5 / 段: R5 / 箇所: opd-index-sample の権限・アカウント運用の表の「棚卸しの頻度」の行（相手側・未変更） / 指摘: 「有効なアカウントと店番担当の一覧が一致するか」とあり、`DEV` の保守アカウントが不一致として扱われる / 直す案: 「有効なアカウントが、店番担当と保守作業中の `DEV` の一覧と一致するか」に直す / 根拠: 同じ章の「アカウントは店番担当と `DEV` に限る」 / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

根拠にしたのは `opd-index-sample`、`opr-access-control-sample`、`pm-members-sample.yaml` と、plan が指定した sample 記述標準、用語集である。grade と condense の finding は plan になかった。R5 の観点に沿って、同じ接頭辞の sample と参照先の食い違いを確かめた。sample 側で直せる 3 件（No 1〜3）は修正し、整合している記述は維持した。相手側の文書を直すべき 2 件（No 4・5）は変更せず、直す案を handoff に残した。構造・必須項目は rulebook を正とした。根拠不足で見送った finding はない。
