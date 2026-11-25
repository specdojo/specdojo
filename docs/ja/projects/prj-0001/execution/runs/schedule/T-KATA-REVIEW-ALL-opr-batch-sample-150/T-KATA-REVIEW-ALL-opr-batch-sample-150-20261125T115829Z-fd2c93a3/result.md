---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-batch-sample-150-20261125t115829z-fd2c93a3
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-batch-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-batch-sample-150/T-KATA-REVIEW-ALL-opr-batch-sample-150-20261125T115829Z-fd2c93a3/plan.md
  started_at: "2026-11-25T11:58:39.517Z"
  completed_at: "2026-11-25T13:21:07.818Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-batch-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、opr-batch-sample と opr-sample の食い違いを直した。直したのは、概要の差分元の書き方、未決事項の実行中の扱い、関連導線の追加、opr-sample のバッチ章からの導線である。
- 相手側（opr-index-sample、opr-backup-restore-sample、系列の呼び名）は変更せず、直す案を指摘に残した。
- grade finding の F001・F004 は kata のレビューから外す観点のため直していない。F002 は R5 の観点ではなく、opr-sample の未決事項の表に保管期間の行がすでにあるため直していない。F003 は opr-sample 側が直っていて、残りは R5-6 で扱う。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 1. 概要（opr-batch-sample） | 差分元の書き方がほかの分冊（opr-support・opr-change など）と違い、`opr-index` の後ろにリンクがない。 | 「[[specdojo:opr-sample\|運用手順]]（`opr-index`）の差分として」に揃えた。 | vp-qe-kata-conformance | - |
| R5-2 | R5 | 1. 概要の未決事項の表（opr-batch-sample） | 「実行中であっても失敗として扱う」が、再実行の前提の確認の「実行中なら終わるまで待つ」と食い違う。 | 「P2 の障害記録を起こし、実行の終了を待ってから再実行するかを決める」に直した。 | vp-qe-kata-conformance | - |
| R5-3 | R5 | 12. 関連ドキュメント導線（opr-batch-sample） | 通知を本書へ引き継ぐ元の opr-monitoring-sample が表にない。opr-monitoring-sample は本書を参照している。 | 運用手順（アラート対応）の行を足し、表の前の 1 文に引き継ぐ元を加えた。 | vp-qe-kata-conformance | - |
| R5-4 | R5 | 12. 関連ドキュメント導線（opr-batch-sample） | 取り直した世代は月次の復元演習の対象だが、復元・演習の手順を持つ opr-backup-restore-sample への導線がない。opr-sample のバックアップ確認・リストア手順は、詳細をこの分冊に任せている。 | 運用手順（バックアップ確認・リストア）の行を足した。 | vp-qe-kata-conformance | - |
| R5-5 | R5 | 7. バッチ再実行・失敗時対応（opr-sample） | 分冊 opr-batch-sample へのリンクがなく、ほかの章（障害対応・バックアップ・アカウント）と導線の書き方が揃っていない。 | 「再実行の前提の確認・操作・完了条件の詳細は opr-batch-sample に従う」を足した。 | vp-qe-kata-conformance | - |
| R5-6 | R5 | 12. 関連ドキュメント導線（opr-index-sample） | 「分冊は障害対応だけ」とあるが、opr-rulebook の sample 宣言には分冊 sample が 7 つある（F003 の残り）。 | 変更していない。相手側の opr-index-sample の表に分冊の行を足し、この文を「各作業領域の分冊は次のとおり」に直す案。 | vp-qe-kata-conformance | - |
| R5-7 | R5 | 系列全体の呼び名（opr-sample と分冊、opr-index-sample） | rulebook の id 規約では、全分冊が opr-sample を `opr-index` と呼ぶ。一方で opr-index-sample（opr-index-rulebook）が別にあるため、`opr-index` がどちらを指すかがぶれる。 | 変更していない。batch だけ呼び名を変えると兄弟の分冊と食い違うため。案は (a) opr-index-sample を手順群の入口として `opr-index` と呼び、分冊は opr-sample を別の呼び名で参照する、(b) 分冊の `opr-index` を opr-sample へのリンクに置き換える。 | vp-qe-kata-conformance | 要判断 |
| R5-8 | R5 | 7. バッチ再実行・失敗時対応の前の章（opr-backup-restore-sample の運用変更作業の前の章） | 再実行の参照先が `opr-index` だけで、opr-batch-sample へのリンクがない。 | 変更していない。相手側の opr-backup-restore-sample に「[[specdojo:opr-batch-sample\|運用手順（バッチ再実行）]] に従う」を足す案。 | vp-qe-kata-conformance | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-batch-sample.md`: 概要の差分元を「運用手順（`opr-index`）の差分として」に揃えた。未決事項の実行中の扱いを「P2 の障害記録を起こし、実行の終了を待ってから再実行するかを決める」に直し、再実行の前提の確認と合わせた。関連ドキュメント導線に運用手順（アラート対応）と運用手順（バックアップ確認・リストア）の行を足し、表の前の 1 文に通知の引き継ぎ元を加えた。
- `docs/ja/specdojo/samples/opr-sample.md`: 7. バッチ再実行・失敗時対応の章に、「再実行の前提の確認・操作・完了条件の詳細は opr-batch-sample に従う」を足し、ほかの章と導線の書き方を揃えた。

## 3. 申し送り

- R5-6、R5-7、R5-8 は相手側や系列全体に関わるため今回は直していない。直す案は findings に記載した。
- R5-7 は系列全体の判断が要るため「要判断」とした。
- R5-1: R5 / 1. 概要（opr-batch-sample） / 差分元の書き方がほかの分冊（opr-support・opr-change など）と違い、`opr-index` の後ろにリンクがない / 「[[specdojo:opr-sample|運用手順]]（`opr-index`）の差分として」に揃えた / vp-qe-kata-conformance / -
- R5-2: R5 / 1. 概要の未決事項の表（opr-batch-sample） / 「実行中であっても失敗として扱う」が、再実行の前提の確認の「実行中なら終わるまで待つ」と食い違う / 「P2 の障害記録を起こし、実行の終了を待ってから再実行するかを決める」に直した / vp-qe-kata-conformance / -
- R5-3: R5 / 12. 関連ドキュメント導線（opr-batch-sample） / 通知を本書へ引き継ぐ元の opr-monitoring-sample が表にない（opr-monitoring-sample は本書を参照している） / 運用手順（アラート対応）の行を足し、表の前の 1 文に引き継ぐ元を加えた / vp-qe-kata-conformance / -
- R5-4: R5 / 12. 関連ドキュメント導線（opr-batch-sample） / 取り直した世代は月次の復元演習の対象だが、復元・演習の手順を持つ opr-backup-restore-sample への導線がない（opr-sample のバックアップ確認・リストア手順は詳細をこの分冊に任せている） / 運用手順（バックアップ確認・リストア）の行を足した / vp-qe-kata-conformance / -
- R5-5: R5 / 7. バッチ再実行・失敗時対応（opr-sample） / 分冊 opr-batch-sample へのリンクがなく、ほかの章（障害対応・バックアップ・アカウント）と導線の書き方が揃っていない / 「再実行の前提の確認・操作・完了条件の詳細は opr-batch-sample に従う」を足した / vp-qe-kata-conformance / -
- R5-6: R5 / 12. 関連ドキュメント導線（opr-index-sample） / 「分冊は障害対応だけ」とあるが、opr-rulebook の sample 宣言には分冊 sample が 7 つある（F003 の残り） / - / vp-qe-kata-conformance。相手側の opr-index-sample の表に分冊の行を足し、この文を「各作業領域の分冊は次のとおり」に直す案 / -
- R5-7: R5 / 系列全体の呼び名（opr-sample と分冊、opr-index-sample） / rulebook の id 規約では、全分冊が opr-sample を `opr-index` と呼ぶ。一方で opr-index-sample（opr-index-rulebook）が別にあるため、`opr-index` がどちらを指すかがぶれる / - / vp-qe-kata-conformance。迷った理由: batch だけ呼び名を変えると兄弟の分冊と食い違うため、ここでは直さない。案は (a) opr-index-sample を手順群の入口として `opr-index` と呼び、分冊は opr-sample を別の呼び名で参照する、(b) 分冊の `opr-index` を opr-sample へのリンクに置き換える。系列全体の判断が要る / 要判断
- R5-8: R5 / 7. バッチ再実行・失敗時対応の前の章（opr-backup-restore-sample の運用変更作業の前の章） / 再実行の参照先が `opr-index` だけで、opr-batch-sample へのリンクがない / - / vp-qe-kata-conformance。相手側の opr-backup-restore-sample に「[[specdojo:opr-batch-sample|運用手順（バッチ再実行）]] に従う」を足す案 / -
- grade finding の扱い: F001・F004（vp-po-decision-readiness・vp-ops-release-readiness）は kata-guide で kata のレビューから外す観点のため直していない。F002（vp-qe-verifiability）は R5 の観点ではなく、opr-sample の未決事項の表に保管期間の行がもうあるため、直す要はない。F003 は opr-sample 側が直っていて、残りは R5-6。
- 作業ツリーには、再開前の試行の差分がすでに残っていた（R5-1、R5-2、R5-3 の行の追加、R5-5）。内容を確かめ、正しい直しとして残した。今回足したのは R5-4 と表の前の 1 文。
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票を変更しておらず、変更したのは docs/ja/specdojo/samples 配下の sample だけ）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples 配下だけで、docs/ja/projects/ に届く成果物の変更はない）

## 4. 進め方と実践の型の適用

根拠とした資料は、kata-guide の R5 の段、同じ接頭辞の sample、wikilink と参照先、用語集、共通サンプル文脈である。sample 側の食い違いは直し、相手側の食い違いは変更せず案だけを残した。rulebook と矛盾する箇所はなく、構造は rulebook を正とした。F001・F004・F002 は R5 の観点に当たらないため扱っていない。F003 は opr-sample 側が直っていて、残りは R5-6 に回した。作業ツリーには再開前の試行の差分が残っていた。内容を確かめ、正しい直しとして残した。
