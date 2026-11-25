---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-monitoring-sample-140-20261125t023058z-db94552b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-monitoring-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-monitoring-sample-140/T-KATA-REVIEW-ALL-opd-monitoring-sample-140-20261125T023058Z-db94552b/plan.md
  started_at: "2026-11-25T02:31:08.595Z"
  completed_at: "2026-11-25T02:43:42.330Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-monitoring-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`opd-monitoring-sample` の事実を `opd-index-sample`、`opd-rulebook`、frontmatter スキーマ、参照先の sample と突き合わせ、誤り 3 件を直した。
- 直した内容は、RPO の暫定値の注記、閾値を変えるときの承認経路、関連ドキュメント導線の表の状態と wikilink 化である。
- 編集対象に挙がっていた `opd-access-control-sample` は、この段では確かめておらず、変更していない。
- 検証は、Prettier、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。これ以外の runner 検査は、変更の種類により非適用だった。
- このタスクで見直した誤りの指摘は、人への報告の形に従い、下の確かめの表と handoff に分けて残す。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-monitoring-sample.md`: 事実の誤り 3 件を直した（12 行追加・12 行削除）。(1) 監視対象と守る業務の表で、夜間バックアップの RPO を「前日閉店」と言い切っていたのを、正本で RPO が `_UNDECIDED_` であることに合わせ「RPO（決まるまでは前日の閉店時点）」に直した。(2) 閾値の見直しの節で、`opd-index` の変更管理に閾値の行がないため、「変更要求として `PO` の承認を得て」に直した。(3) 関連ドキュメント導線の表で、作成済の 3 件が「予定」になっていたため、全行を wikilink にし、備考を「作成済」にした。

## 3. 申し送り

- 確かめの表（主張ごと）。一致: frontmatter の `type` と `rulebook`（`opd-rulebook` とスキーマ）。一致: 章の構成（rulebook の本文構成）。一致: 未決事項。一致: 自動の監視の範囲。一致: KPI と SLO の名前。一致: 営業時間 10:00〜18:00。一致: 閾値の 5 分。一致: 通知先。一致: 9:30 の判定（「翌朝の開店時」の具体化）。一致: P1・P2 と 15 分の期限。一致: 差異が解けないときは翌朝 `PO` が確かめる（定期運用方針）。不一致のため修正: RPO の言い切り、閾値変更の承認経路、関連ドキュメントの状態。正本がない業務の仮定として確かめの対象外にした: 外部監視を 1 分ごと、初動 10 分、誤検知が月 3 件で見直す。
- 確かめの表は reporter が result の実施内容に Markdown の表として 1 回だけ書く材料であり、申し送りには表を重ねない。
- `opd-access-control-sample` は plan の編集対象に挙がっていたが、この段では確かめていない。変更もしていない。
- R4 指摘 1（不一致・修正済）: 監視対象と守る業務の表で、夜間バックアップの対応目標が RPO を「前日閉店」と言い切っていた。正本 docs/ja/specdojo/samples/opd-index-sample.md のバックアップ・リストア方針では RPO は `_UNDECIDED_` で、前日の閉店時点は決まるまでの扱いである。「RPO（決まるまでは前日の閉店時点）」に直した。
- R4 指摘 2（不一致・修正済）: 閾値の見直しの節に「`opd-index` の変更管理に従って」とあったが、opd-index-sample の変更管理の表には閾値の変更の行がない。SLO・SLA・KPI の章には「目標値を変える場合は変更要求として `PO` の承認を得る」とあり、opr-monitoring-sample も先に `opd-index` を改訂するとしている。「変更要求として `PO` の承認を得て」に直した。
- R4 指摘 3（不一致・修正済）: 関連ドキュメント導線の表で、opd-incident-management・opr-index・opr-monitoring が「予定」になっていた。docs/ja/specdojo/samples/ に 3 件とも作成済みで、opd-index-sample の導線も作成済としている。全行を wikilink（[[specdojo:opd-index-sample]]・[[specdojo:opd-incident-management-sample]]・[[specdojo:opr-index-sample]]・[[specdojo:opr-monitoring-sample]]）に替え、備考を「作成済」にした。
- R4 確かめの表（reporter が result の実施内容に書く材料）: 一致したのは次の主張である。frontmatter の type と rulebook（opd-rulebook とスキーマ）、章の構成（rulebook の本文構成）、未決事項、自動の監視の範囲、KPI と SLO の名前、営業時間 10:00〜18:00、閾値の 5 分、通知先、9:30 の判定（「翌朝の開店時」の具体化）、P1・P2 と 15 分の期限、差異が解けないときは翌朝 `PO` が確かめる（定期運用方針）。正本のない業務の仮定として確かめの対象外にしたのは、外部監視を 1 分ごと、初動 10 分、誤検知が月 3 件で見直す、の 3 つである。
- 編集対象に挙がった opd-access-control-sample は、この段（監視の sample の R4）では確かめておらず、変更していない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan・result・個票に当たる履歴ファイルを変えていない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として実施した。grade と condense の finding は plan に展開されていなかった。根拠にしたのは `opd-index-sample`（バックアップ・リストア方針、変更管理、SLO・SLA・KPI の章）、`opd-rulebook`、frontmatter スキーマ、参照先の sample（`opd-incident-management-sample`、`opr-index-sample`、`opr-monitoring-sample`）である。正本と食い違う 3 箇所だけを直し、一致した記述は維持した。rulebook と矛盾した箇所はなかった。`status` は `draft` のまま据え置いた。駄菓子屋の業務の仮定のうち正本がないものは、共通サンプル文脈と食い違わないため、確かめの対象にしなかった。
