---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-change-sample-150-20261125t132450z-f91eb671
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-change-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-change-sample-150/T-KATA-REVIEW-ALL-opr-change-sample-150-20261125T132450Z-f91eb671/plan.md
  started_at: "2026-11-25T13:25:02.618Z"
  completed_at: "2026-11-25T13:41:52.190Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-change-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`opr-change-sample.md` を `opr-sample`・`opr-index-sample` と、同系列の分冊 sample の導線に照らして確かめた。食い違い 3 件を sample 側で直した。
- 直した内容は次の 3 点である。アプリの版の更新の実施条件を事前周知の範囲に合わせた。必要権限と適用の手順 6 の確認の権限を揃えた。導線の表に障害対応の分冊を足した。
- 相手側の `opr-sample` と `opr-incident-sample` を直す案 2 件は、相手側を変更せず findings に残した。
- `prettier`、`markdownlint-cli2`、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 8.1. 変更種別と承認・実施条件（アプリの版の更新の実施条件） | 実施条件がすべての版に事前周知を求めている。`opr-sample` の運用変更作業は、記録の操作が変わる版の更新と価格の一括変更だけを周知する。本書の影響の範囲の判定も、操作が変わる場合だけ事前周知を求める。この 2 点と食い違う。 | 実施条件を「閉店後。記録の操作が変わる版は前日の閉店時に事前周知した」にした。 | `vp-qe-kata-conformance`。根拠は `opr-sample` の運用変更作業の本文と、本書 8.2 の表の 1 行目。 | - |
| R5-2 | R5 | 2. 手順適用範囲・前提（必要権限）、8.3. 適用の手順 | 適用後の確認を店番担当の記録の権限で行うとあるが、手順 6 で確かめるのは `DEV` である。`opr-sample` の「共有のアカウントは使わない」、`opr-index-sample` の権限（店番担当は記録、`DEV` は管理者）とも食い違う。価格の照合は店番担当が行う。 | 必要権限を「適用・戻し・適用後の確認は `DEV` の管理者の権限、開店前の価格の照合は店番担当の記録の権限で行う。共有のアカウントは使わない」にした。手順 6 に「価格の一括変更は、翌朝の開店前に店番担当が照合する」を足した。 | `vp-qe-kata-conformance`。迷った理由は、元の意図が「`DEV` が店番担当の区分の試験用アカウントで確かめる」だった可能性があることである。`opr-access-control-sample` に試験用アカウントの区分がないため、その案は選ばなかった。 | 要判断 |
| R5-3 | R5 | 12. 関連ドキュメント導線 | 8.4 で戻しが終わらないときや記録できないときは P1 として障害対応手順へ進む。しかし、P1 の切替と復旧を具体化した `opr-incident-sample` が導線の表にない。同系列の分冊（batch、monitoring）は、P1 の行き先として `opr-incident-sample` を表に載せている。 | 表に「手順 / 運用手順（障害対応） / 戻しで P1 になった場合の切替と復旧の手順を行う / 作成済」を足した。 | `vp-qe-kata-conformance`、`vp-dev-change-impact` | - |
| R5-4 | R5 | 相手側 `opr-sample.md` の 8. 運用変更作業 | `opr-sample` は障害対応・バックアップ・バッチ・権限の章で、本文から分冊へ渡している。運用変更作業の章だけ、本文で `opr-change-sample` を指していない（導線の表にはある）。 | 相手側を直す案: 運用変更作業の章の表の前に「影響の判定・適用・戻しの詳細は [[specdojo:opr-change-sample\|運用手順（運用変更）]] に従う。」を足す。本タスクでは変更していない。 | `vp-qe-kata-conformance` | - |
| R5-5 | R5 | 相手側 `opr-incident-sample.md` の障害対応手順（直近の変更をロールバックする行とその直後の段落）、運用変更作業の章 | ロールバックの手順の参照先が `opr-index` の運用変更作業になっている。具体化した `opr-change-sample` のロールバックとエスカレーションを指していない。 | 相手側を直す案: 該当の 3 か所の参照先を [[specdojo:opr-change-sample\|運用手順（運用変更）]] のロールバックとエスカレーションに替え、導線の表に `opr-change-sample` の行を足す。本タスクでは変更していない。 | `vp-dev-change-impact` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-change-sample.md`: 8.1 の版の更新の実施条件を「記録の操作が変わる版は前日の閉店時に事前周知」に直した。必要権限は、適用・戻し・確認を `DEV` の管理者の権限で行い、開店前の価格の照合を店番担当が行う形にし、共有のアカウントは使わないと明記した。適用の手順 6 に翌朝の価格の照合を足した。12. 関連ドキュメント導線の表に `opr-incident-sample`（障害対応）の行を足した。

## 3. 申し送り

- plan の編集対象は `opr-sample.md` だが、kata-guide は直す対象を対象の kata だけと定めている。そのため、タスク名の対象である `opr-change-sample.md` だけを直し、`opr-sample` は R5-4 の案に留めた。
- grade の F001〜F004 は現行の `opr-sample.md` の行番号・本文と合わず、古い版への指摘とみられる。F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は kata の段のレビューで使わない観点のため扱わなかった。F002（`vp-qe-verifiability`）は R4 の観点で、`opr-sample` にはすでに保管期間の未決事項の行がある。F003 は分冊が導線の表に載っていて解消済みである。次のアクションは、grade の再評価で古い指摘を消すことである。
- R5-1: R5 / 8.1. 変更種別と承認・実施条件 / アプリの版の更新の実施条件がすべての版に事前周知を求め、opr-sample の運用変更作業（記録の操作が変わる版の更新と価格の一括変更だけを周知）と、本書の影響の範囲の判定（操作が変わる場合に事前周知が要る）と食い違う / 実施条件を「閉店後。記録の操作が変わる版は前日の閉店時に事前周知した」にした / `vp-qe-kata-conformance`。根拠は opr-sample の運用変更作業の本文と本書 8.2 の表の 1 行目 / -
- R5-2: R5 / 2. 手順適用範囲・前提（必要権限）、8.3. 適用の手順 / 「適用後の確認は店番担当の記録の権限で行う」とあるが、適用の手順 6 で確かめるのは `DEV` で、opr-sample の「共有のアカウントは使わない」、opr-index-sample の権限（店番担当は記録、`DEV` は管理者）と食い違う。価格の照合は店番担当が行う / 必要権限を「適用・戻し・適用後の確認は `DEV` の管理者の権限、開店前の価格の照合は店番担当の記録の権限で行う。共有のアカウントは使わない」にし、手順 6 に「価格の一括変更は、翌朝の開店前に店番担当が照合する」を足した / `vp-qe-kata-conformance`。迷った理由: 元の意図が「`DEV` が店番担当の区分の試験用アカウントで確かめる」だった可能性がある。その案は opr-access-control-sample に試験用アカウントの区分がないため選ばなかった / 要判断
- R5-3: R5 / 12. 関連ドキュメント導線 / 8.4 で戻しが終わらないときや記録できないときは P1 として障害対応手順へ進むが、P1 の切替と復旧を具体化した opr-incident-sample が導線の表にない。同系列の分冊（batch、monitoring）は P1 の行き先として opr-incident-sample を表に載せている / 表に「手順 / 運用手順（障害対応） / 戻しで P1 になった場合の切替と復旧の手順を行う / 作成済」を足した / `vp-qe-kata-conformance`、`vp-dev-change-impact` / -
- R5-4: R5 / 相手側 opr-sample.md の 8. 運用変更作業 / opr-sample は障害対応・バックアップ・バッチ・権限の章で本文から分冊へ渡しているが、運用変更作業の章だけ本文で opr-change-sample を指していない（導線の表にはある） / - / `vp-qe-kata-conformance`。相手側の案: opr-sample の運用変更作業の章の表の前に「影響の判定・適用・戻しの詳細は [[specdojo:opr-change-sample|運用手順（運用変更）]] に従う。」を足す / -
- R5-5: R5 / 相手側 opr-incident-sample.md の障害対応手順（直近の変更をロールバックする行、その直後の段落）と運用変更作業の章 / ロールバックの手順の参照先が `opr-index` の運用変更作業で、具体化した opr-change-sample のロールバックとエスカレーションを指していない / - / `vp-dev-change-impact`。相手側の案: 該当の 3 か所の参照先を [[specdojo:opr-change-sample|運用手順（運用変更）]] のロールバックとエスカレーションに替え、導線の表に opr-change-sample の行を足す / -
- 申し送り（編集対象）: plan の編集対象は opr-sample.md（rulebook の sample 宣言から解決したもの）だが、kata-guide の「kata を agent でレビューする」は直すのは対象の kata だけと定めるため、タスク名の対象 opr-change-sample.md だけを直し、opr-sample は R5-4 の案に留めた。
- 申し送り（grade の指摘 F001〜F004）: F001〜F004 は現行の opr-sample.md の行番号・本文と合わず、古い版への指摘とみられる。F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は kata の段のレビューで使わない観点のため扱わない。F002（`vp-qe-verifiability`）は R4 の観点で、opr-sample にはすでに「監査ログ以外の証跡の保管期間」の未決事項の行がある。F003 は opr-index-sample があり、opr-sample の導線の表に分冊がすべて載っているため解消済み。次のアクション: grade の再評価で古い指摘を消す。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/opr-change-sample.md だけで、plan・result・個票は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

根拠として、`opr-sample`・`opr-index-sample`、同系列の分冊（batch、monitoring、incident）の導線、kata-guide の R5 の段の定義を照らして確かめた。食い違いのうち `opr-change-sample` の側で直せるものは直し、相手側の修正は案として残した。rulebook との構成は変えていない。frontmatter の `status` は `draft` のまま据え置いた。
