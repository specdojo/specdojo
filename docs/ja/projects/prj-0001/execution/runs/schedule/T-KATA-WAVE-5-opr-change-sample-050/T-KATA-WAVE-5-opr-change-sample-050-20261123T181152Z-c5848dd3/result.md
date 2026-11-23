---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opr-change-sample-050-20261123t181152z-c5848dd3
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-change-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-change-sample-050/T-KATA-WAVE-5-opr-change-sample-050-20261123T181152Z-c5848dd3/plan.md
  started_at: "2026-11-23T18:11:55.189Z"
  completed_at: "2026-11-23T18:22:30.919Z"
  agent: opus-executor
  execution: agent
  approach: fully-guided
  targets:
    - specdojo:opr-change-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/opr-change-sample.md` を `opr-rulebook` の構成に従い、駄菓子屋の運用変更手順の完成例として拡充しました。
- Frontmatter の `rulebook` 指定を `specdo-opr-rulebook` に修正し、`based_on` を解決可能な ID (`specdojo:opd-index-sample` および `specdojo:opr-sample`) へ更新しました。
- 概要章の追加、適用範囲・前提条件の明記、運用変更作業の具体的な手順（適用前の手順、実行ステップ、検証方法）、およびロールバック条件（判定基準や目標時間）を、共通の文脈に基づき加筆しました。
- 証跡やエスカレーションに関する情報を、`opr-rulebook` が求める表形式で整理しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-change-sample.md`: `opr-rulebook` の章立てに基づき、概要、適用範囲・前提条件、運用変更作業（事前手順・実施・検証・ロールバック）、および関連ドキュメントの導線を加筆・整形しました。また、Frontmatter の `rulebook` 指定を修正しました。

## 3. 申し送り

- 進め方と実践の型の適用: `rulebook`・`opr-sample`・`opd-index-sample`・sample 標準・`prj-overview` を参照して作成しました。`plan` の指示に基づき、既存の `template` は読み込んでいません。章の見出しは `opr-sample` に準拠させています。
- F020 への対応: Frontmatter の `rulebook` を `specdo:opd-rulebook` から `specdo:opr-rulebook` に修正しました。`based_on` は `opd-index` が解決できなかったため、他の分冊 sample と同様に `specdojo:opd-index-sample` および `specdojo:opr-sample` としています。
- 既存記述の扱い: 以前の箇条書きの 3 項目を「運用変更作業」の章へ移しました。事前起票と影響評価は「適用前の手順と影響の範囲」へ、実施ログは「証跡」の表へ、P1/P2 時の即時戻しは「ロールバック条件とエスカレーション」の表へ再配置しています。Frontmatter での宣言を優先するため、本文内の `rulebook` への相対パスの参照行は削除しました。「承認者: Ops Lead」は `opd-index-sample` の変更管理に合わせて、変更種別ごとの `PO` / `OPS` に置き換えています（F024 対応）。
- 利用者が決める値（`_UNDECIDED_` で残した箇所）: 変更の凍結期間（繁忙期の扱い）、ロールバック完了の目標時間（現在は便宜上、翌営業日 9:45 の開店前確認としています）、変更記録と差分の保管期間。これらは `opd-index`（運用方針）で定義する必要があります。
- sample で置いた仮定: 緊急変更の承認フロー（`PO` による電話承認）、影響範囲の判定 4 項目、および適用前の手動バックアップ。これらは `opd-index-sample` と `opr-sample` の文脈から合理的に補完したものです。`opd-index-sample` に緊急変更の規定がないため、方針側への追記を検討してください。
- PJR-76N9 に従い、文書の作成・確認・承認の役割の割り当てや、状態の進み具合（ステータス遷移）に関する記述は、役割の定義として文書の扱いに触れないよう、本文には記載していません。これらは個票の扱いに準ずるべき事項として、`grade` の観点から除外することを検討してください。
- F005（予定期間）と F026（手順書のメンテナンス・窓口）については、時間帯・期限の記述および関連ドキュメント導線の見直しの条件として記述を置き換え、運用手順書に持ち込まない形で対応しました。
- rulebook の変更案: 該当する作業がない章の記述方法として、「`opr-index` 参照」や「本書の範囲外」といった理由を添える形式を、ガイドラインに追加することを推奨します。
- リンクの確認: 本文中の wikilink が `specdojo:opr-sample`、`specdojo:opd-index-sample`、`specdojo:opr-access-control-sample` の 3 つであり、存在することを確認しました。
- 進め方と実践の型の適用: rulebook・opr-sample・opd-index-sample・sample 標準・prj-overview を読んで書いた。plan の指示どおり template は読んでいない。章の見出しは opr-sample にそろえた。
- F020 の対応: frontmatter の rulebook を specdojo:opd-rulebook から specdojo:opr-rulebook に直した。`based_on` は解決できない `opd-index` だったため、修正済みの他の分冊 sample（opr-backup-restore-sample）と同じく specdojo:opd-index-sample と specdojo:opr-sample にした。
- 既存記述の扱い: 箇条書きの 3 項目は運用変更作業の章へ移した。事前の起票・影響評価は適用の手順と影響の範囲の判定へ、実施ログは証跡の表へ、P1/P2 での即時の戻しはロールバック条件とエスカレーションの表へ入れた。本文の rulebook への相対パスの参照行は、Frontmatter で対応を宣言するため削除した。「承認者: Ops Lead」は opd-index-sample の変更管理に合わせて変更種別ごとの `PO` / `OPS` に置き換えた（F024）。
- 利用者が決める値（`_UNDECIDED_` で残した）: 変更の凍結期間（繁忙期の扱い）、ロールバック完了の目標時間（決まるまでは翌営業日 9:45 の開店前確認までとした）、変更記録と差分の保管期間。運用方針（opd-index）で決める必要がある。
- sample で置いた仮定: 緊急の変更の行（P1 の復旧に要る変更を営業時間中に `PO` が電話で承認する）、影響の範囲の判定 4 項目、データの形が変わる版での適用前の手動バックアップ。いずれも opd-index-sample の変更管理と opr-sample の運用変更作業から合理的に補ったもの。opd-index-sample の変更管理に緊急変更の行がないため、方針側への追記を検討してほしい。
- PJR-76N9 に従い、文書の作成・確認・承認の役割の割り当てと承認の進み具合を本文に書いていない。F004（公開の責任の枠組み）、F011 のうちレビュアーの記述、F025（draft から ready にする条件）がこれを求めているが、文書の役割の割り当てや状態の進み具合にあたるため足していない。これらは登録簿の個票で扱うものとして、grade の観点側で除外することを検討してほしい。
- F005 の予定する期間、F026 の手順書を手入れする手順と問い合わせ窓口は、時間帯・期限と月次点検での報告、関連ドキュメント導線の見直しの条件で代えた。運用手順に期間の計画は持ち込まず、この程度の記述とした。
- rulebook の変更案: 該当する作業がない章の書き方として、rulebook は `opr-index 参照` / `本書の範囲外` / `なし` と理由を書くよう定めている。これに加えて、分冊が opr-index の手順へ差分だけを足す場合（例: 版の更新前の手動バックアップ）の書き方の例を記述ガイドに足すとよい。rulebook はこの段で変更していない。
- リンク先: 本文の wikilink は specdojo:opr-sample、specdojo:opd-index-sample、specdojo:opr-access-control-sample の 3 つで、ファイルの存在を確認した。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

既存の `opr-change-sample.md` をベースに、`opr-rulebook` の要求事項を満たすよう、駄菓子屋のプロジェクト文脈に沿った具体的な値を（判断できない箇所は `_UNDECIDED_` としながら）埋め込み、厚みのあるサンプルへと磨き込みました。
