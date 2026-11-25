---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sf-sample-120-20261125t232556z-b0705b16
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sf-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sf-sample-120/T-KATA-REVIEW-ALL-sf-sample-120-20261125T232556Z-b0705b16/plan.md
  started_at: "2026-11-25T23:26:06.181Z"
  completed_at: "2026-11-25T23:33:58.978Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sf-sample
    - specdojo:sf-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として sf-sample の章の順・粒度を sf-rulebook の本文構成と照合した。章 1〜8 の順、章タイトル、小節、表の列は rulebook の記述ガイドと一致しており、章の移動・分割・統合は不要と判断した。
- 「業務プロセス・画面との対応」で、利用接点の種類（GUI）と CLI 会計が対象外であることを述べた文が接点の表の後にあった。これを根拠領域の表と接点の表の間へ移し、表の前の 1 文として前提から結論の順に読めるようにした。
- grade の指摘 F001〜F006 は R2 の観点（`vp-arc-document-structure`、`vp-qe-omissions-consistency`）に当たらないため、この段では扱っていない。該当する段に任せる。
- 検証は executor の prettier チェックと、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` がいずれも passed だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 構成 | docs/ja/specdojo/samples/sf-sample.md「業務プロセス・画面との対応」、接点の表の後の文（旧41行目） | 利用接点の種類（GUI）と CLI 会計が対象外であることは接点の表の前提だが、表の後に置かれていて前提から結論の順に読めない。接点の表の前にも、何を示す表かの 1 文がない。 | 「利用接点は GUI とし、CLI による会計は対象外とする。画面と連携先との受け渡しと責務境界は次のとおり。」を根拠領域の表と接点の表の間へ移した（sample に反映済み）。 | sf-rulebook の記述ガイド「業務プロセス・画面との対応」、sample-authoring-standard の表の前の 1 文の規定、`vp-arc-document-structure` | 反映済み |
| R2-2 | R2 構成 | sf-sample の全章 | 指摘なし。章の順（1〜8）と章タイトルは sf-rulebook の「本文要件」の章の表と一致する。小節（入出力と前提条件、通常処理と例外・回復条件）と表の列も記述ガイドの推奨どおりで、移動・分割・統合は要らない。 | - | sf-rulebook の「本文要件」と「記述ガイド」、`vp-qe-omissions-consistency` | 確認のみ |
| R2-3 | R2 構成 | grade の指摘 F001〜F006 | R2 の観点（`vp-arc-document-structure`、`vp-qe-omissions-consistency`）に当たる指摘はない。F001・F002（`vp-pm-*`）は kata のレビューから外す観点。F003・F005 は R4、F004 は R5、F006 は R1 または R5 の観点。 | R2 では直さず、該当する段に任せる。 | docs/ja/specdojo/guides/kata-guide.md「kata の観点の組」 | 申し送り |
| R2-4 | R2 構成 | 「目的と概要」の範囲の表、「入出力」「通常処理」「例外・回復条件」「非機能・技術制約」「操作手順・コマンド参照」の各表 | どの表にも、何を示す表かの 1 文が前にない。これは文章の確かめ（表の前の 1 文）なので R3 に任せる。 | R3 で各表の前に 1 文を足す。 | sample-authoring-standard の表の前の 1 文の規定、kata-guide「文章のチェック項目」 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sf-sample.md`: 「業務プロセス・画面との対応」で、利用接点は GUI とし CLI による会計は対象外とする旨の文を接点の表の後から前へ移動した（2 行追加、2 行削除）。章の順・粒度は変更していない。

## 3. 申し送り

- R2 の範囲外として、各表の前に何を示す表かの 1 文がない点を R3 へ回す必要がある（R2-4 を参照）。
- grade の指摘 F001〜F006 は R2 では未対応。F003・F005 は R4、F004 は R5、F006 は R1 または R5 の観点で扱う。F001・F002 は kata のレビューから外す観点。F004・F005 は R1 が「未決事項」に足した「確定後に見直す箇所」の列で一部が解消している。
- No: R2-1 / 段: R2 構成 / 箇所: docs/ja/specdojo/samples/sf-sample.md「業務プロセス・画面との対応」、接点の表の後の文（旧41行目） / 指摘: 利用接点の種類（GUI）と CLI 会計が対象外であることは接点の表の前提だが、表の後に置かれていて前提から結論の順に読めない。接点の表の前にも、何を示す表かの 1 文がない / 直した案: 「利用接点は GUI とし、CLI による会計は対象外とする。画面と連携先との受け渡しと責務境界は次のとおり。」を根拠領域の表と接点の表の間へ移した（sample に反映済み） / 根拠: sf-rulebook の記述ガイド「業務プロセス・画面との対応」（画面のない機能では起動接点を示す）、sample-authoring-standard「表の前に、何と何の対応を示す表かを 1 文で書く」、vp-arc-document-structure / 印: 反映済み
- No: R2-2 / 段: R2 構成 / 箇所: sf-sample の全章 / 指摘: なし。章の順（1〜8）と章タイトルは sf-rulebook の「本文要件」の章の表と一致する。小節（入出力と前提条件、通常処理と例外・回復条件）と表の列も記述ガイドの推奨どおりで、移動・分割・統合は要らない。rulebook が `template: not-needed` のため、template とは照らしていない / 直した案: 変更なし / 根拠: sf-rulebook の「本文要件」と「記述ガイド」、vp-qe-omissions-consistency / 印: 確認のみ
- No: R2-3 / 段: R2 構成 / 箇所: grade の指摘 F001〜F006 / 指摘: R2 の観点（vp-arc-document-structure、vp-qe-omissions-consistency）に当たる指摘はない。F001・F002（`vp-pm-*`）は kata-guide「kata の観点の組」で kata のレビューから外す観点。F003・F005 は R4、F004 は R5、F006 は R1 または R5 の観点。F004・F005 は R1 が「未決事項」に足した「確定後に見直す箇所」の列で一部が解消している / 直した案: R2 では直さず、該当する段に任せる / 根拠: docs/ja/specdojo/guides/kata-guide.md「kata の観点の組」 / 印: 申し送り
- No: R2-4 / 段: R2 構成 / 箇所: 「目的と概要」の範囲の表、「入出力」「通常処理」「例外・回復条件」「非機能・技術制約」「操作手順・コマンド参照」の各表 / 指摘: どの表にも、何を示す表かの 1 文が前にない。これは文章の確かめ（表の前の 1 文）なので R3 に任せる / 直した案: R3 で各表の前に 1 文を足す / 根拠: sample-authoring-standard の表の前の 1 文の規定、kata-guide「文章のチェック項目」 / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/sf-sample.md だけで、plan・result・個票の履歴ファイルを変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml`・`*.yml` がない）

## 4. 進め方と実践の型の適用

sample-maintenance の R2 として、sf-rulebook の「本文構成」と「記述ガイド」、sample-authoring-standard、kata-guide の「kata の観点の組」を根拠に章構成を照合した。R1 が直した版を読み、R1 の指摘は繰り返していない。rulebook が `template: not-needed` のため template とは照合していない。構成の不整合は 1 件だけで、sample 側の文の移動で解消した。rulebook など sample 以外は変更していない。frontmatter の `status` も変更していない。
