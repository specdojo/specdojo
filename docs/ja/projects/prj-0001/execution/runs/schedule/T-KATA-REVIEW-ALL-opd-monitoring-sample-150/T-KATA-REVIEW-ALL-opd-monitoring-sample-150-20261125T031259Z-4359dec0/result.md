---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-monitoring-sample-150-20261125t031259z-4359dec0
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-monitoring-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-monitoring-sample-150/T-KATA-REVIEW-ALL-opd-monitoring-sample-150-20261125T031259Z-4359dec0/plan.md
  started_at: "2026-11-25T03:13:07.821Z"
  completed_at: "2026-11-25T03:25:48.050Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-monitoring-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、opd-monitoring-sample を opd-index と同系列の sample に合わせて直した。具体的には、監視対象の名前、9:30 の判定対象、役割の初出表記、誤検知の記録先をそろえた。
- opd-access-control-sample の関連ドキュメント導線に、障害対応 sample への行を追加した。
- 相手側（opr-monitoring-sample、opd-incident-management-sample、opd-rulebook、用語集）を直すべき点は変更せず、直す案を handoff に残した。
- executor が実行した prettier と markdownlint は通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-access-control-sample.md`: 関連ドキュメント導線に、運用方針・設計（障害対応）の行を追加した。内容は「緊急権限を使う P1 の判定と、復旧で記録を訂正する場面」で、障害対応 sample が緊急権限として本書を参照していることと対応させた。表の整形も反映している。
- `docs/ja/specdojo/samples/opd-monitoring-sample.md`: 監視対象の名前を「夜間バックアップ」から opd-index の「閉店後のバックアップ」に 5 か所で統一した。9:30 の判定で確かめる対象を「当日分の成功記録」から「前日の閉店後の成功記録」に改めた。`PO`・`OPS`・`DEV` の初出に正式名を付けた（店主代表（`PO`）、`OPS`（Operations / Release Manager）、開発担当（`DEV`））。誤検知の件数は「障害記録から数え、月次点検の記録に残す」に直した。表の列幅は prettier でそろえた。

## 3. 申し送り

- R5 の指摘の一覧は、executor handoff の No 1〜10 を参照する。No 1〜5 は sample 側を直した。No 6〜10 は相手側の修正案で、このタスクでは変更していない。
- 要判断として残したのは次の 3 件。No 7 は PO に連絡がつかない場合の紙の販売控えへの切替で、opd-incident-management-sample と opr-monitoring-sample の記述が食い違っている。No 9 は監視サービスのアカウントを「共有のアカウントは作らない」の対象に含めるかどうか。No 10 は用語集に monitoring などの論理名キーを置くかどうか。いずれも人の判断を待つ。
- `status` は `draft` のまま据え置き、`ready` への昇格は行っていない。
- No 1: R5 / 監視・アラート方針（opd-monitoring-sample の 2 章・2.1・2.2・2.3） / 監視対象の名前が「夜間バックアップ」で、opd-index の「閉店後のバックアップ」（監視・アラート方針、定期運用方針）と食い違う / 5 か所を「閉店後のバックアップ」に統一した / vp-qe-kata-conformance（opd-index と opd-&lt;term&gt; が食い違う場合は opd-index を正とする: opd-rulebook の位置づけ） / -
- No 2: R5 / 測定元と通知の手段（opd-monitoring-sample） / 9:30 の判定で「当日分の成功記録」を確かめるとあるが、opd-index は「前日の閉店後の成功記録」を閾値にしている / 「前日の閉店後の成功記録を確かめる」に直した / vp-qe-kata-conformance、opd-index の監視・アラート方針の閉店後のバックアップの行 / -
- No 3: R5 / 概要・初動の時限と完了条件（opd-monitoring-sample） / `PO`・`OPS`・`DEV` に正式名がなく、同系列の opd-incident-management-sample・opd-access-control-sample の「店主代表（`PO`）」などの書き方とそろっていない / 初出を「店主代表（`PO`）」「`OPS`（Operations / Release Manager）」「開発担当（`DEV`）」にした / vp-qe-kata-conformance（kata 相互）、W8 / -
- No 4: R5 / 閾値の見直し（opd-monitoring-sample） / 誤検知の件数を「障害記録に残す」とあるが、opr-monitoring-sample の点検手順は障害記録から数えて月次点検の記録に残す / 「障害記録から数え、月次点検の記録に残す」に直した / vp-qe-kata-conformance（適用先の opr-monitoring-sample）、vp-dev-change-impact / -
- No 5: R5 / 関連ドキュメント導線（opd-access-control-sample） / opd-incident-management-sample は緊急権限として本書を参照しているが、本書の導線には障害対応 sample の行がなく、緊急権限を使う P1 の判定の参照先が分からない / 方針の行「運用方針・設計（障害対応）: 緊急権限を使う P1 の判定と、復旧で記録を訂正する場面」を追加した / vp-qe-kata-conformance（kata 相互）、vp-dev-change-impact / -
- No 6: R5 / 相手側 opr-monitoring-sample（全体） / 「夜間バックアップ」と 9:30 の「当日分の成功記録」が残っており、No 1・No 2 で直した opd-monitoring-sample および opd-index と食い違う / 直さない。直す案: opr-monitoring-sample の「夜間バックアップ」を「閉店後のバックアップ」に、「当日分の成功記録」を「前日の閉店後の成功記録」にそろえる / vp-dev-change-impact（opr-monitoring-sample の `based_on` は opd-monitoring-sample と opd-index） / -
- No 7: R5 / 相手側 opr-monitoring-sample のアラート対応手順と opd-incident-management-sample の停止・切替の判断 / PO に連絡がつかない場合について、opd-incident-management-sample は「店番担当が紙の販売控えへ切り替えて PO の連絡を待つ」、opr-monitoring-sample は「紙の販売控えへの切替は PO の判断を待つ」とし、食い違っている / 直さない。直す案: 方針の側の opd-incident-management-sample を正とし、opr-monitoring-sample の末尾の段落を「店番担当が紙の販売控えへ切り替えて PO の連絡を待つ」に改める / vp-qe-kata-conformance。迷った理由: opd-index は切替を PO が決めるとだけ定め、連絡がつかない場合を定めていないため、opr 側の慎重な扱いを正とする案も成り立つ。選ばなかった案: opd-incident-management-sample の補足を削る / 要判断
- No 8: R5 / 相手側 opd-rulebook の記述ガイド（差分を持つ章） / 良い例「棚卸しは opd-index の四半期を月次に短縮する（例外: 共有アカウントを使うため）」が、sample の文脈（opd-index は月次の棚卸し、共有のアカウントは作らない）と食い違い、読み手が sample と取り違える / 直さない。直す案: 共有アカウントを前提にしない例へ差し替える（例: 「棚卸しの照合対象に、opd-index にない店番の予定表を加える（具体化: タブレットを共用するため）」） / vp-qe-kata-conformance（rulebook と sample） / -
- No 9: R5 / 相手側 opr-monitoring-sample のアカウント付与・剥奪手順と opd-index・opd-access-control-sample / 監視サービスと連絡用アドレスを「窓口の共用」として扱う記述と、「共有のアカウントは作らない」の範囲（販売管理システムだけか、監視サービスも含むか）との関係が読み取れない / 直さない。直す案: opd-access-control-sample の権限・アカウント運用の冒頭に、対象を販売管理システムのアカウントに限り、監視サービスは窓口の連絡用アドレスで扱うことを補足として書く / vp-qe-kata-conformance。迷った理由: 監視サービスのアカウントを方針の対象に含めるかを sample から判断できないため。選ばなかった案: 監視サービスにも 1 人 1 アカウントを求める / 要判断
- No 10: R5 / 相手側 用語集（docs/ja/product/010-business-specs/060-glossary/） / opd-rulebook は ID の `&lt;term&gt;` に用語集の論理名キーを使うと定めるが、用語集に monitoring・incident-management・access-control のキーがない / 直さない。直す案: 用語集にこの 3 つの論理名キーを加えるか、rulebook の規則を「用語集にある場合は論理名キーを使う」に緩める / vp-qe-kata-conformance。迷った理由: 用語集は SpecDojo 自身の用語の正本で、sample の運用ドメイン名を載せる場所かどうかが決まっていないため / 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

sample-maintenance の R5（整合）として、opd-monitoring-sample と opd-access-control-sample を、同じ接頭辞の opd-index および同系列の sample と照合した。opd-rulebook の位置づけに従い、opd-index と食い違う場合は opd-index を正とした。そのため、監視対象の名前と 9:30 の判定対象は opd-index に合わせた。plan に展開された grade の finding と、成果物から届いた Kata 起因の finding はなかった。相手側を直すべき点は sample の差分に含めず、直す案と根拠を handoff に記録した。迷った 3 件は「要判断」とした。
