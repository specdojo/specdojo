---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-monitoring-sample-140-20261125t023453z-9f11b316
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-monitoring-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-monitoring-sample-140/T-KATA-REVIEW-ALL-opr-monitoring-sample-140-20261125T023453Z-9f11b316/plan.md
  started_at: "2026-11-25T02:35:03.975Z"
  completed_at: "2026-11-25T02:48:19.423Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-monitoring-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）を `opr-monitoring-sample` に対して実施した。本書の事実を opd-index-sample・opd-monitoring-sample・opr-sample・opr-rulebook・opr-template・deliverable-frontmatter.schema と突き合わせた。
- 誤りは 1 件で、「2. 手順適用範囲・前提」の連絡先の欄にあった。3 つの監視対象すべての通知が `OPS` の連絡用アドレスに届くと読めたが、日次締めの差異の通知先は `PO` である。これを直した。
- plan に展開された F001・F004 は、kata-guide で kata の段のレビューに使わない観点（`vp-po-decision-readiness`・`vp-ops-release-readiness`）とされているため扱わなかった。F002・F003 は `opr-sample` の旧版を指す指摘で、現行版では保管期間の未決事項の行と分冊の一覧がすでに直っており、解消済みである。
- `opr-sample` は変更していない。plan の編集対象は `opr-sample.md` に解決されていた。しかしタスクの対象の kata は `opr-monitoring-sample` なので、kata-guide の「対象の kata だけを直す」に従い `opr-monitoring-sample` だけを直した。
- runner の検査（`lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema`）は passed だった。変更種別により `not_applicable` となった検査は runner が保持する。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-monitoring-sample.md`: 「2. 手順適用範囲・前提」の連絡先の欄を直した。「死活と夜間バックアップの通知は `OPS` の連絡用アドレスに届く。日次締めの差異は店番担当が `PO` へ口頭で伝える」とし、opd-index-sample の監視・アラート方針の表および opd-monitoring-sample と合わせた。差分は 8 行追加・8 行削除。一部は prettier による表の列幅調整である。

## 3. 申し送り

- 確かめの結果（executor の確かめの表 C1〜C13 の要約）: C1〜C10 は一致した。内容は、frontmatter の `type` と `rulebook`、12 章の構成、wikilink の参照先 4 件、死活・夜間バックアップの時限、`OPS` から `PO` へのエスカレーション、P1 の紙の販売控えへの切り替え、閾値の見直し、再取得の上限と重複の防止、未決の保管期間の扱いである。C11 は不一致だったので直した。C12 と C13 は確かめられなかった。
- C12（確かめられなかった）: 日次締めの差異を P2 として `PO` が翌朝確かめる点のうち、翌朝 `PO` が確かめる部分は正本と一致する。P2 とする分類は正本に記述がなく、P2 の条件への当てはめは人の判断が要る。
- C13（確かめられなかった）: 通知の抑止の承認者は `OPS`、通知先の変更の承認者は `PO` とする記述について、正本の変更管理の表に監視の設定変更の行がない。opd-index-sample か opd-monitoring-sample に行を足すかどうかの判断が要る。
- 要判断 R4-2: 本書は `opr-sample` を差分元（`opr-index`）とするが、`opr-incident-sample` は `opr-index-sample` を差分元としており、分冊の間で差分元が割れている。R5 で扱う。`opr-incident-sample` を `opr-sample` へそろえるか、全分冊を `opr-index-sample` へ寄せるかを決める。本書だけ `opr-index-sample` へ変える案は、多数派の分冊と食い違うので選ばなかった。
- 要判断 R4-3: 日次 9:30 の点検が「閉店後に届いた死活の通知の履歴を見る」とする一方、opd-index-sample と opd-monitoring-sample の測定の表は、死活の監視を営業時間 10:00〜18:00 に限っている。opd-monitoring-sample の初動の節は営業時間外の通知を前提にしており、正本の側で食い違っている。opd-monitoring-sample で営業時間外も測るのかを決め、表と本文をそろえる案がある。本書は初動の節に従っているため直していない。
- 要判断 R4-4: 「監視サービスと連絡用アドレスは窓口の共用として `OPS` が扱い、個人のアカウントは作らない」が、opd-index-sample の「共有のアカウントは作らない」と食い違う疑いがある。ただし opd-index-sample の対象は販売管理システムのアカウントとも読め、opr-access-control-sample は外部の管理者アカウントを対象外にしているため確かめきれない。opd-access-control-sample で外部サービスのアカウントの扱いを明示する案がある。本書で個人のアカウントへ変える案は、正本がないので選ばなかった。
- plan 生成の挙動の確認が別途必要: sample 宣言の先頭が編集対象に解決され、タスクの対象の kata と食い違った。
- R4-1: R4 / 2. 手順適用範囲・前提 / 連絡先の欄が、3 つの監視対象すべての通知が `OPS` の連絡用アドレスに届くと読める。opd-index-sample の監視・アラート方針の表では、日次締めの差異の通知先は `PO`。opd-monitoring-sample では、店番担当が日次締め記録に書いて `PO` へ口頭で伝える / 「死活と夜間バックアップの通知は `OPS` の連絡用アドレスに届く。日次締めの差異は店番担当が `PO` へ口頭で伝える」に直した / vp-arc-technical-constraints（OPD と矛盾する手順の禁止） / -
- R4-2: R4 / 1. 概要・12. 関連ドキュメント導線 / 本書は [[specdojo:opr-sample]] を差分元（`opr-index`）としている。一方、opr-incident-sample は [[specdojo:opr-index-sample]] を差分元とし、分冊の間で差分元が割れている。本書の参照先の内容（連絡先、優先度、再取得の上限、重複の防止、保管期間の未決事項）は opr-sample に実在し、opr-access-control・batch・backup-restore・change・support の各 sample も opr-sample を参照している / - / R5 で扱う。opr-incident-sample を opr-sample へそろえるか、全分冊を opr-index-sample へ寄せるかを決める。選ばなかった案は、本書だけ opr-index-sample へ変えること（多数派の分冊と食い違うため） / 要判断
- R4-3: R4 / 3. 日次・週次・月次点検手順 / 日次 9:30 の点検が「閉店後に届いた死活の通知の履歴を見る」とする一方、本書の時間帯と opd-index-sample・opd-monitoring-sample の測定の表は、死活の監視を営業時間 10:00〜18:00 に限っている。opd-monitoring-sample の初動の節は営業時間外の通知を前提にしており、正本の側で食い違っている / - / opd-monitoring-sample で、営業時間外も測るのかを決めて表と本文をそろえる案。本書は opd-monitoring-sample の初動の節に従っているため直していない / 要判断
- R4-4: R4 / 9. アカウント付与・剥奪手順 / 「監視サービスと連絡用アドレスは窓口の共用として `OPS` が扱い、個人のアカウントは作らない」が、opd-index-sample の「共有のアカウントは作らない」と食い違う疑いがある。ただし opd-index-sample の対象は販売管理システムのアカウント（店番担当と `DEV`）とも読め、opr-access-control-sample は外部の管理者アカウントを対象外にしているため確かめきれない / - / opd-access-control-sample で、外部サービスのアカウントの扱いを明示する案。選ばなかった案は、本書で個人のアカウントへ変えること（正本がないため） / 要判断
- F001・F004（vp-po-decision-readiness・vp-ops-release-readiness）は、kata-guide の『kata の観点の組』で kata の段のレビューに使わない観点とされているため扱わない。F002・F003 は opr-sample の旧版を指す指摘で、現行の opr-sample では保管期間の未決事項の行と分冊の一覧がすでに直っており解消済み
- 編集対象: plan の『編集対象』は opr-sample.md に解決されていたが、タスクの対象の kata は opr-monitoring-sample であり、kata-guide の『対象の kata だけを直す』に従って opr-monitoring-sample だけを直した。sample 宣言の先頭が編集対象に解決される plan 生成の挙動は、別途確認が必要
- 確かめの表（No / 主張 / 正本 / 確かめ方 / 結果 / 根拠）: C1 / frontmatter の type: operations、rulebook: specdojo:opr-rulebook / deliverable-frontmatter.schema.yaml、opr-rulebook の推奨 Frontmatter 項目 / 読み取り / 一致 / schema の type 列挙に operations があり、rulebook の表と一致
- C2 / 章の構成 12 章と、該当のない章の『`opr-index` 参照』 / opr-template.md、opr-rulebook の本文要件 / 見出しの比較 / 一致 / 見出し 12 章が template と同じ。『`opr-index` 参照』は本文要件の許可された表記
- C3 / wikilink の参照先（opr-sample、opd-monitoring-sample、opd-index-sample、opr-incident-sample）が存在する / docs/ja/specdojo/samples/ / ls と各 id の読み取り / 一致 / 4 件とも存在し、id が一致
- C4 / 死活は 1 分ごとの確認（`_ASSUMPTION_`）、営業時間 10:00〜18:00 / opd-monitoring-sample の測定の表 / 読み取り / 一致 / 同表の死活の行
- C5 / 夜間バックアップの確認は 9:30、確認の時限は 10:00 まで、死活の確認は通知から 10 分以内 / opd-monitoring-sample の測定・初動の表 / 読み取り / 一致 / 同表の死活と夜間バックアップの行
- C6 / `OPS` が 15 分以内に応答しなければ `PO` へ / opr-sample の障害対応手順、opd-monitoring-sample の初動の節 / 読み取り / 一致 / P1 のエスカレーションの列
- C7 / P1 で 30 分再開できなければ `PO` の判断で紙の販売控えへ切り替え、つけの新規記録は止める / opd-index-sample の障害対応方針、opr-sample の P1 / 読み取り / 一致 / 障害対応方針の箇条書き
- C8 / 誤検知が月 3 件以上なら閾値の変更案を出す（例: 5 分を 10 分に）。先に opd-index を改訂し、承認者は `PO` / opd-monitoring-sample の閾値の見直し / 読み取り / 一致 / 閾値の見直しの箇条書き
- C9 / 夜間バックアップの再取得の上限と重複の防止は `opr-index` のバッチ再実行・失敗時対応に従い、`run_id` を障害記録に書く / opr-sample のバッチ再実行・失敗時対応 / 読み取り / 一致 / 再実行・上限・重複の防止の箇条書き
- C10 / 未決の保管期間の扱いは `opr-index` の概要の未決事項に従う / opr-sample の概要の未決事項の表 / 読み取り / 一致 / 『監査ログ以外の証跡の保管期間』の行
- C11 / 日次締めの差異の通知の届き先（修正前は `OPS` の連絡用アドレス） / opd-index-sample の監視・アラート方針の表、opd-monitoring-sample の測定の表 / 読み取り / 不一致（直した） / 通知先 `PO`、店番担当が口頭で伝える
- C12 / 日次締めの差異を P2 として `PO` が翌朝確かめる / opd-monitoring-sample の初動の表、opr-sample の障害対応手順 / 読み取り / 確かめられない / 翌朝 `PO` が確かめる点は一致。P2 とする分類は正本に記述がなく、P2 の条件（確認・締めができない）への当てはめは人の判断が要る
- C13 / 通知の抑止の承認者は `OPS`、通知先の変更の承認者は `PO` / opd-index-sample の変更管理の表 / 読み取り / 確かめられない / 正本の変更管理の表に監視の設定変更の行がない。opd-index-sample か opd-monitoring-sample に行を足すかどうかの判断が要る
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown の 1 ファイルだけで、`*.yaml` / `*.yml` の変更がないため）
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、kata-guide の「kata を agent でレビューする」に従い、sample に書かれた事実を正本と突き合わせた。正本は opd-index-sample、opd-monitoring-sample、opr-sample、opr-rulebook、opr-template、deliverable-frontmatter.schema である。誤りがあった連絡先の欄だけを、正本が明示する内容へ直した。既存の記述のうち正本と整合するものは維持した。 正本どうしの食い違いや正本がない主張は推測で直さず、「要判断」の申し送りに回した。grade の finding は次のとおり扱った。F001・F004 は R4 の観点に当たらないので扱わなかった。F002・F003 は現行の `opr-sample` で解消済みであることを確認した。grade result サイドカーは直接編集していない。rulebook と矛盾する箇所はなかった。frontmatter の `status` は `draft` のまま据え置いた。
