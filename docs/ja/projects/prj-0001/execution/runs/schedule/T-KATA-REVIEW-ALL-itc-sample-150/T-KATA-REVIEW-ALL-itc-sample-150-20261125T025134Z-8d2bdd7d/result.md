---
specdojo:
  id: prj-0001:xer-t-kata-review-all-itc-sample-150-20261125t025134z-8d2bdd7d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-itc-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-itc-sample-150/T-KATA-REVIEW-ALL-itc-sample-150-20261125T025134Z-8d2bdd7d/plan.md
  started_at: "2026-11-25T02:51:43.510Z"
  completed_at: "2026-11-25T03:04:59.025Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:itc-sample
    - specdojo:itc-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `itc-sample` を、同じ接頭辞の `itc-index-sample`、`tsp-index-sample`、`ifd-sample` と突き合わせた。
- 3 つの文書が `itc-sales-checkout` の主担当としている「応答欠落時の照合待ちの識別」が本書に無かったため、観点とケースを追加した。
- F001（状態遷移の理由と代わりのケース）と F003（導入段落の表への分割）は前の段で解消済みだと確認した。手は入れていない。
- F002 は相手側の `itc-index-sample` を直す案として申し送る。index 側は変更していない。
- executor は prettier と markdownlint を実行し、markdownlint は 0 件だった。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/itc-sample.md`: 観点 6.4「応答欠落時の照合待ちの識別」（`perspective_key: response-reconciliation`）と、ケース `it-sales-checkout-response-reconciliation-010` を追加した。あわせて、責務の項目、依存の表の「`PATH-02` の応答」行、トレース TR-07、frontmatter `based_on` の `specdojo:ifd-sample`、観点の型の表の「依存障害時の挙動」を揃えた。

## 3. 申し送り

- R5 の指摘一覧（reporter が整理した表） | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R5-1 | R5 | 6. テスト観点とケース、2. 責務、4. 結合境界/依存/環境前提、5. トレース、`based_on` | 応答欠落時の照合待ちの識別が、index 2 文書では `itc-sales-checkout` の主担当なのに本書に無い | 観点 6.4 とケース `it-sales-checkout-response-reconciliation-010` を追加し、関連する表と `based_on` を揃えた | `vp-qe-kata-conformance` | 要判断（`awaiting-reconciliation` と「要求元」は ifd・tsp に名前の定めが無く、本書で仮に置いた） | | R5-2 | R5 | 6. 観点の型の表（依存障害時の挙動） | F002。`itc-index-sample` は DB 停止時に未保存を成功表示しないとするが、本書は DB 停止・接続断を採らず更新拒否で扱う | 本書は変更しない。`itc-index-sample` の「観点の立て方（共通）」の該当文言を「DB の更新拒否時に未保存を成功表示しない」に改める案。「条件の立て方（共通）」の「DB の更新拒否・接続断」から接続断を外すか、`itc-credit-balance` に限る旨を足すかも決める | `vp-qe-kata-conformance` | 要判断（index 側に DB 停止を残す意図があるかもしれない） | | R5-3 | R5 | 6. 観点の型の表（状態遷移の整合性） | F001。前の段で理由と代わりのケース `it-sales-checkout-persistence-integrity-010` が入っており解消済み | なし | `vp-qe-omissions-consistency` | なし | | R5-4 | R5 | 6. 導入 | F003。前の段で表に分割済みで解消済み。R5 の観点ではないため確認のみ | なし | `vp-ux-readability` | なし |
- 確かめた範囲は次のとおり。同じ接頭辞の `itc-index-sample`。`based_on` と wikilink の先（`tsp-index-sample`、`bac-sample` の BAC-01〜03 と C-01〜C-04、`utc-sample`、`ifd-sample` の PATH-02）。`itc-rulebook`。用語集。用語集は SpecDojo の用語だけで駄菓子屋の業務用語を含まないため、照合するものは無かった。数値（在庫 5→3／5→0、単価 30 円、受領額）と BAC の対応に食い違いは無かった。
- R5-1: R5 / 箇所: 6. テスト観点とケース、2. 責務（結合として保証）、4. 結合境界/依存/環境前提、5. トレース、frontmatter `based_on` / 指摘: itc-index-sample の「観点の立て方（共通）」と「観点/条件の採用基準と対象別への分配方針（共通）」は、応答欠落時の照合待ちの識別（`PATH-02` の遅延・無応答）の主担当を `itc-sales-checkout` にしている。tsp-index-sample の「I/F の確認範囲と代替方法」も内部結合テストで確かめる対象としている。それなのに本書には観点もケースも無かった。 / 直した案: 観点 6.4「応答欠落時の照合待ちの識別」（`perspective_key: response-reconciliation`）とケース `it-sales-checkout-response-reconciliation-010` を足した。ケースは、保存後の応答を捨てる Stub を使い、要求元が `awaiting-reconciliation` を識別して再送しないこと（Stub が受けた要求1件）、販売記録1件・在庫3個が残ることを確かめる。あわせて責務1項目、依存の表の「`PATH-02` の応答」行、トレース TR-07（ifd-sample の PATH-02）、`based_on` の `specdojo:ifd-sample`、観点の型の表の「依存障害時の挙動」を揃えた。 / 根拠: `vp-qe-kata-conformance`。itc-index-sample の観点の型の表・分配の表・共通の境界/依存の表の「`PATH-02` の応答」行、tsp-index-sample の 4.2 と自動化の方針、ifd-sample の PATH-02 障害時の行、itc-rulebook の「トレース」（根拠は先にトレース表へ足す。`based_on` は対応を揃える）。 / 印: 要判断（迷った理由: 照合待ちの結果名 `awaiting-reconciliation` と「要求元」の扱いは、ifd-sample・tsp-index-sample に名前の定めが無く、本書で仮に置いたもの。選ばなかった案: ケースを足さず、観点の型の表に不採用の理由を書く案。index・tsp がこの観点を主担当・回帰必須にしているため採らなかった）
- R5-2: R5 / 箇所: 6. テスト観点とケース（観点の型の表 依存障害時の挙動） / 指摘: F002。itc-index-sample の「観点の立て方（共通）」は `itc-sales-checkout` の依存障害を「DB 停止時に未保存を成功表示しない」としている。本書は DB 停止・接続断を採らず（理由: CI の他ケースを巻き込む、代わり: ST の障害・回復）、DB の更新拒否で扱っており、食い違う。 / 直した案: - / 根拠: `vp-qe-kata-conformance`。直すのは相手側。itc-index-sample の「観点の立て方（共通）」の `itc-sales-checkout` 列の「DB 停止時に未保存を成功表示しない」を「DB の更新拒否時に未保存を成功表示しない」に改める案。同じ文書の「条件の立て方（共通）」の環境の例「DB の更新拒否・接続断」から接続断を外すか、`itc-credit-balance` の DB 停止に限ると書き添えるかもあわせて決める。 / 印: 要判断（迷った理由: index 側で DB 停止を残す意図があるかもしれない。選ばなかった案: 本書で DB 停止を扱う案。本書が書いている再現性の理由と食い違うため採らなかった）
- R5-3: R5 / 箇所: 6. テスト観点とケース（観点の型の表 状態遷移の整合性） / 指摘: F001。補完後の確定への遷移を扱わない理由と代わりのケースが無いという指摘だった。前の段で表に「理由: 補完後の購入は通常の会計確定と同じ入力になる、代替: `it-sales-checkout-persistence-integrity-010`」が入っており、解消済みと確かめた。 / 直した案: - / 根拠: `vp-qe-omissions-consistency`。itc-index-sample の「観点の立て方（共通）」（該当しない型は理由を1行残す）。 / 印: -
- R5-4: R5 / 箇所: 6. テスト観点とケース（導入） / 指摘: F003。導入の段落が1段落に詰め込まれていて読みにくいという指摘だった。前の段で「観点の型／本書での扱い／理由・代わり」の表に分けてあり、解消済みと確かめた。 / 直した案: - / 根拠: `vp-ux-readability`。R5 の観点ではないため、確かめただけで手は入れていない。 / 印: -
- 確かめた範囲: 同じ接頭辞の itc-index-sample、`based_on` と wikilink の先（tsp-index-sample、bac-sample の BAC-01〜03 と C-01〜C-04、utc-sample、新しく足した ifd-sample の PATH-02）、itc-rulebook、用語集（docs/ja/product/010-business-specs/060-glossary/）。用語集は SpecDojo の用語だけで駄菓子屋の業務用語を含まないため、照らし合わせるものは無かった。数値（在庫5→3／5→0、単価30円、受領額）と BAC の対応は食い違いなし。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/itc-sample.md だけで、plan・result・個票は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` が無い）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従った。`itc-index-sample`、`tsp-index-sample`、`ifd-sample`、`itc-rulebook`、`bac-sample` を読み、本書の側だけを直した。構造・必須項目は rulebook を正として照合した。rulebook の「トレース」に従い、根拠を先にトレース表へ足してから `based_on` を揃えた。F001・F003 は前の段の修正で判定根拠を満たしていると確認し、維持した。F002 は、直す対象が `itc-index-sample` で本タスクの範囲外のため、直す案を handoff に記録した。本書の DB 停止を採らない理由は、再現性と ST への代替として本書に書かれている。根拠不足による見送りは無い。
