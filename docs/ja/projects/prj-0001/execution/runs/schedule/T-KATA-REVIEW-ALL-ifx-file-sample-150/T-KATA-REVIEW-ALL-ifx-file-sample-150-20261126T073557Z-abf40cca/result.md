---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-file-sample-150-20261126t073557z-abf40cca
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-file-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-file-sample-150/T-KATA-REVIEW-ALL-ifx-file-sample-150-20261126T073557Z-abf40cca/plan.md
  started_at: "2026-11-26T07:36:08.737Z"
  completed_at: "2026-11-26T07:42:05.633Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:ifx-file-sample
    - specdojo:ifx-file-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として ifx-file-sample を、プロジェクト概要・外部システムI/F一覧・販売管理 CLI 仕様・メンバー定義の各 sample と突き合わせ、sample 側の食い違い 2 件を直した。
- 相手側を直すべき点 2 件（clis-sample、ifx-api-sample）は変更せず、直す案を findings に残した。
- grade の finding F001・F002・F003・F005・F006・F007・F008 は前の段までで解消済みと本文で確認した。F004 は未解消で、人の判断が要る。
- ランナー検証では lint:md:changed、lint:fm:changed、lint:mermaid、lint:d2、test:docs、validate:schema が通った。executor の prettier 検査も通った。その他は変更種別により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 | ifx-file-sample.md の概要の `_ASSUMPTION_` 段落 | 外部システムI/F一覧が初期リリースの対象を店頭販売・在庫・つけ管理とするかのように書いていたが、ifx-index-sample.yaml はつけ販売を対象外としている。 | 範囲の根拠を「プロジェクト概要は初期公開を単一店舗の店頭運用に絞り、仕入れ支援を後続の拡張とする」「外部システムI/F一覧は仕入先システム連携を対象外とする」に分けて書き直した（sample に反映済み）。 | docs/ja/specdojo/samples/prj-overview-sample.md の 44 行目、docs/ja/specdojo/samples/ifx-index-sample.yaml の対象外のコメント | - |
| 2 | R5 | 「異常時の判断と利用者の次の手」の表の前の 1 文 | 表で使う「店番担当」の指す人が本書の中で決まっていなかった。 | 「店番担当は、販売管理 CLI 仕様と同じく店主代表か家族利用者代表を指す」を書き足した（sample に反映済み）。 | docs/ja/specdojo/samples/clis-sample.md の 31 行目、docs/ja/specdojo/samples/pm-members-sample.yaml | - |
| 3 | R5 | 相手側 docs/ja/specdojo/samples/clis-sample.md の「入力情報」の `current-tx.json` の行と「代表的な表示と利用者の次の手」 | 本書では未解決の控え（`api_sync_status` が `pending` / `unknown` / `rejected`）があると `sales start` が新規取引を始めず exit code 3 で止まる。CLI 仕様は「`start` は欠落時に作成」とだけ書いており、この停止の行がない。 | clis-sample の代表的な表示の表に「未解決の控えがあるときの取引開始拒否（exit code 3）」の行を足し、入力表の扱いの列にも同じ条件を書く（相手側は未変更）。 | ifx-file-sample の `error_handling.missing.current_tx_json`、clis-sample の 62 行目と 110 行目 | - |
| 4 | R5 | 相手側 docs/ja/specdojo/samples/ifx-api-sample.yaml の 92 行目（500 応答） | 500 応答では「結果不明として保持し、同じ取引 ID で送り直す」と自動再送を認めているが、ifx-file-sample と clis-sample は、結果不明の取引は受付照会の方式が決まるまで自動再送しないとしている。 | ifx-api 側を「再送せずに保留する」に揃えるか、取引 ID による重複排除を理由に再送を認めて ifx-file-sample・clis-sample を直すかを決める（相手側は未変更）。 | ifx-api-sample の 92 行目、ifx-file-sample の 2 つめの YAML の `_UNDECIDED_` のコメント、clis-sample の 124 行目 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-file-sample.md`: 概要の `_ASSUMPTION_` 段落で、範囲の根拠を「プロジェクト概要は初期公開を単一店舗の店頭運用に絞る」と「外部システムI/F一覧は仕入先システム連携を対象外とする」に分けて書き直した。異常時の表の前に、「店番担当」が販売管理 CLI 仕様と同じく店主代表か家族利用者代表を指す旨を 1 文足した。

## 3. 申し送り

- F004（rulebook の `target_format` は yaml だが本 sample は .md）は、YAML sample への再構成か、rulebook に md とする例外を宣言するかを人が判断する必要がある。
- No: 1 / 段: R5 / 箇所: 概要の `_ASSUMPTION_` 段落 / 指摘: 外部システムI/F一覧が初期リリースの対象を店頭販売・在庫・つけ管理とするかのように書いていたが、ifx-index-sample.yaml はつけ販売を対象外としている / 直した案: 範囲の根拠を「プロジェクト概要は初期公開を単一店舗の店頭運用に絞り、仕入れ支援を後続の拡張とする」「外部システムI/F一覧は仕入先システム連携を対象外とする」に分けて書き直した（sample に反映済み） / 根拠: docs/ja/specdojo/samples/prj-overview-sample.md の 44 行目、docs/ja/specdojo/samples/ifx-index-sample.yaml の対象外のコメント / 印: なし
- No: 2 / 段: R5 / 箇所: 「異常時の判断と利用者の次の手」の表の前の 1 文 / 指摘: 表で使う「店番担当」の指す人が本書の中で決まっていなかった / 直した案: 「店番担当は、販売管理 CLI 仕様と同じく店主代表か家族利用者代表を指す」を書き足した（sample に反映済み） / 根拠: docs/ja/specdojo/samples/clis-sample.md の 31 行目、docs/ja/specdojo/samples/pm-members-sample.yaml / 印: なし
- No: 3 / 段: R5 / 箇所: 相手側 docs/ja/specdojo/samples/clis-sample.md の「入力情報」の `current-tx.json` の行と「代表的な表示と利用者の次の手」 / 指摘: 本書では未解決の控え（`api_sync_status` が `pending` / `unknown` / `rejected`）があると `sales start` が新規取引を始めず exit code 3 で止まるが、CLI 仕様は「`start` は欠落時に作成」とだけ書いており、この停止の行がない / 直した案: clis-sample の代表的な表示の表に「未解決の控えがあるときの取引開始拒否（exit code 3）」の行を足し、入力表の扱いの列にも同じ条件を書く（相手側は未変更） / 根拠: ifx-file-sample の `error_handling.missing.current_tx_json`、clis-sample の 62 行目と 110 行目 / 印: なし
- No: 4 / 段: R5 / 箇所: 相手側 docs/ja/specdojo/samples/ifx-api-sample.yaml の 92 行目（500 応答） / 指摘: 500 応答では「結果不明として保持し、同じ取引 ID で送り直す」と自動再送を認めているが、ifx-file-sample と clis-sample は、結果不明の取引は受付照会の方式が決まるまで自動再送しないとしている / 直した案: ifx-api 側を「再送せずに保留する」に揃えるか、取引 ID による重複排除を理由に再送を認めて ifx-file-sample・clis-sample を直すかを決める（相手側は未変更） / 根拠: ifx-api-sample の 92 行目、ifx-file-sample の 2 つめの YAML の `_UNDECIDED_` のコメント、clis-sample の 124 行目 / 印: 要判断
- grade の finding のうち F001・F002・F003・F005・F006・F007・F008 は、前の段までで直っていることを本文で確かめた。F004（rulebook の `target_format` は yaml だが本 sample は .md で、ほかの ifx sample とも形式が違う）は R1・R2 の観点で未解消のため、YAML の sample に組み直すか、rulebook に md とする例外を宣言するかを人が判断する。

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample に切り替え、同じ接頭辞の ifx-index-sample、prj-overview-sample、clis-sample、pm-members-sample、ifx-api-sample と突き合わせた。食い違いのうち sample 側で直せるものだけを反映した。相手側の修正は変更せず案として記録した。grade の finding は本文で解消を確認し、F004 は rulebook 側の判断が要るため未解消として記録した。
