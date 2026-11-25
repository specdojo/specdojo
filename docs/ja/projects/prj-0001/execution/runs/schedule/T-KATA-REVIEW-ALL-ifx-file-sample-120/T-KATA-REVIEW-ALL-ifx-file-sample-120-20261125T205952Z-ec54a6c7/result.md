---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-file-sample-120-20261125t205952z-ec54a6c7
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-file-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-file-sample-120/T-KATA-REVIEW-ALL-ifx-file-sample-120-20261125T205952Z-ec54a6c7/plan.md
  started_at: "2026-11-25T21:00:01.840Z"
  completed_at: "2026-11-25T21:08:48.911Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:ifx-file-sample
    - specdojo:ifx-file-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として ifx-file-sample.md を見直した。rulebook の本文構成にない章「メモ / 将来課題」を削除し、未決事項を rulebook が求める YAML コメント `# _UNDECIDED_:` に移した。
- 再開判定の表の末尾行が後ろの章を参照していたため、前に定義済みの YAML の `missing` の `current_tx_json` を指すよう直した。
- sample のファイル形式（F004）は人の判断に回した。F002 は R4、F006 は R3・R5 に任せた。F001・F003・F005・F007・F008 は R1 までの版で解消済みと確認した。
- 検証は prettier と markdownlint-cli2 が通り、runner の lint:md:changed、lint:fm:changed、lint:mermaid、lint:d2、test:docs、validate:schema も通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 4. メモ / 将来課題 | rulebook の本文構成にない独自の章である。rulebook の「仮置き・前提条件の明記」は、未決事項を YAML コメント `# _UNDECIDED_:` に書くよう求めている。週次発注の行も既存の YAML コメントと重なっていた。 | 章を削除した。週次発注の着手可否は「単一ファイル・インライン定義の例」の既存の `_UNDECIDED_` コメントにまとめた。本部売上登録 API の受付照会の未整備は、「複数ファイル・正本参照の例」に `_UNDECIDED_` コメントとして追加した。担当ロールの割り当ては sample-authoring-standard に合わせて移していない。 | `vp-arc-document-structure`、`vp-qe-omissions-consistency`、ifx-file-rulebook「ファイル基本情報と責務境界の判断基準」、sample-authoring-standard「構成の原則」 | - |
| R2-2 | R2 | 2.4. 会計確定の書き込み順序と再開判定 | 表の最後の行が後ろにある章 3 の「取引状態の欠落」を参照しており、前提から結論の順に読めない。 | 参照先を、前に定義済みの YAML の `missing` の `current_tx_json` に変えた。 | `vp-arc-document-structure` | - |
| R2-3 | R2 | 文書全体（2.3・2.4・3 と sample のファイル形式） | rulebook の `target_format` は `yaml` で、sample-authoring-standard はファイル名を `target_format` に合わせ独自の章立てを作らないよう求める。本 sample は .md で、rulebook にない章（参照する正本スキーマの制約と検証、再開判定、異常時の次の手）を持ち、ほかの ifx sample（.yaml）とも形式が合わない（grade F004）。 | 案 (1) 2 つの契約例を `ifx-file-sample.yaml` などの YAML sample に分け、2.3〜3 の補足を YAML コメントか `error_handling` の action へ移す。案 (2) md の補足章（正本スキーマの制約、再開判定、異常時の次の手）を持つ例外を ifx-file-rulebook に宣言する。どちらにするかは人が決める。 | `vp-qe-kata-conformance`、`vp-arc-document-structure`。形式を変えるとファイルのパス、dct-kata.yaml の path、2 つの契約例の分け方まで変わり、R2 の章の移動・統合の範囲を超えるため判断を保留した。 | 要判断 |
| R2-4 | R2 | 3. 異常時の判断と利用者の次の手 | 「取引状態の欠落」の行が、取引未開始（exit code 2）と未解決の控えによる停止（exit code 3）を 1 行に混ぜている（grade F002）。 | - | `vp-qe-verifiability` は R4 の観点なので、R4 で事象ごとに行を分ける。 | - |
| R2-5 | R2 | 1. 概要 | 家族利用者代表の Role code を「`PO` 業務助言」と書いているが、pm-members-sample では UX である（grade F006）。 | - | `vp-ux-language-consistency` は R3、メンバー定義との突き合わせは R5 で直す。 | - |
| R2-6 | R2 | grade F001・F003・F005・F007・F008 | R1 までの版で、スキーマの全文掲載の抜粋化と、status・承認判断の記述の削除が済んでいることを確かめた。 | - | R1 の差分（commit 9b7b25dff4） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-file-sample.md`: 独自章「メモ / 将来課題」を削除した。週次発注の着手可否は既存の `_UNDECIDED_` コメントにまとめ、本部売上登録 API の受付照会の未整備は複数ファイル例に `_UNDECIDED_` コメントとして追加した。再開判定の表の最終行の参照先を、前に定義済みの `current_tx_json` の `missing` に変更した。

## 3. 申し送り

- F004（sample を .md から YAML sample へ再構成するか、md とする例外を rulebook に宣言するか）は形式変更がパス、`dct-kata.yaml` の path、2 つの契約例の分け方に及ぶため、人が決める必要がある。
- R2-1: R2 / 4. メモ / 将来課題 / rulebook の本文構成にない独自の章で、rulebook の「仮置き・前提条件の明記」は未決事項を YAML コメント `# _UNDECIDED_:` に書くよう求めている。週次発注の行も既存の YAML コメントと重なっていた / 章を削り、週次発注の着手可否は「単一ファイル・インライン定義の例」の既存の `_UNDECIDED_` コメントにまとめ、本部売上登録 API の受付照会の未整備は「複数ファイル・正本参照の例」に `_UNDECIDED_` コメントとして足した。担当ロールの割り当ては sample-authoring-standard に合わせて移していない / `vp-arc-document-structure`、`vp-qe-omissions-consistency`、ifx-file-rulebook「ファイル基本情報と責務境界の判断基準」、sample-authoring-standard「構成の原則」 / -
- R2-2: R2 / 2.4. 会計確定の書き込み順序と再開判定 / 表の最後の行が、後ろにある章 3 の「取引状態の欠落」を参照しており、前提から結論の順に読めない / 参照先を、前に定義済みの YAML の `missing` の `current_tx_json` に変えた / `vp-arc-document-structure` / -
- R2-3: R2 / 文書全体（2.3・2.4・3 と sample のファイル形式）/ rulebook の `target_format` は `yaml` で、sample-authoring-standard はファイル名を `target_format` に合わせ独自の章立てを作らないよう求める。本 sample は .md で、rulebook にない章（参照する正本スキーマの制約と検証、再開判定、異常時の次の手）を持ち、ほかの ifx sample（.yaml）とも形式が合わない（grade F004）/ - / `vp-qe-kata-conformance`、`vp-arc-document-structure`。迷った理由: 形式を変えるとファイルのパス、dct-kata.yaml の path、2 つの契約例の分け方まで変わり、R2 の章の移動・統合の範囲を超える。選ばなかった案: (1) 2 つの契約例を `ifx-file-sample.yaml` などの YAML sample に分け、2.3〜3 の補足を YAML コメントか `error_handling` の action へ移す。(2) md の補足章（正本スキーマの制約、再開判定、異常時の次の手）を持つ例外を ifx-file-rulebook に宣言する。どちらにするかは人が決める / 要判断
- R2-4: R2 / 3. 異常時の判断と利用者の次の手 / 「取引状態の欠落」の行が、取引未開始（exit code 2）と未解決の控えによる停止（exit code 3）を 1 行に混ぜている（grade F002）/ - / `vp-qe-verifiability` は R4 の観点なので R4 で事象ごとに行を分ける / -
- R2-5: R2 / 1. 概要 / 家族利用者代表の Role code を「`PO` 業務助言」と書いているが、pm-members-sample では UX である（grade F006）/ - / `vp-ux-language-consistency` は R3、メンバー定義との突き合わせは R5 で直す / -
- R2-6: R2 / grade F001・F003・F005・F007・F008 / R1 までの版で、スキーマの全文掲載の抜粋化と、status・承認判断の記述の削除が済んでいることを確かめた / - / R1 の差分（commit 9b7b25dff4）/ -

## 4. 進め方と実践の型の適用

R2 は構成の観点で、rulebook の本文構成と sample-authoring-standard に照らして章の有無と参照の順序を確認した。rulebook にない章を削除して YAML コメントへ統合し、前方参照を解消した。R1 の差分を確認し、grade F001・F003・F005・F007・F008 が解消済みと判断した。ほかの段に属する指摘は扱わず、形式の判断が要る F004 は要判断として残した。
