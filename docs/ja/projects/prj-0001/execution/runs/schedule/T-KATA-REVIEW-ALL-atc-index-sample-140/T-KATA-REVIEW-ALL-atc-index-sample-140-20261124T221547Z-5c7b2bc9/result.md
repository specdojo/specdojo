---
specdojo:
  id: prj-0001:xer-t-kata-review-all-atc-index-sample-140-20261124t221547z-5c7b2bc9
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-atc-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-atc-index-sample-140/T-KATA-REVIEW-ALL-atc-index-sample-140-20261124T221547Z-5c7b2bc9/plan.md
  started_at: "2026-11-24T22:15:56.438Z"
  completed_at: "2026-11-24T22:28:00.430Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:atc-index-sample
    - specdojo:atc-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）として、`atc-index-sample` を TSP・成功基準と受入条件の sample・rulebook・pm-members-sample と突き合わせ、誤りを直した。
- 直した内容: 受入範囲と P0 の条件 ID（SC-07・SC-09・AC-05 の欠落）、運用開始後の SC の範囲（SC-02〜SC-06・SC-08・SC-10）、SC-09 を根拠にした非機能の記述、DEV の AC-04 文書照合、分割の目安（50件以上）。
- F001〜F003 は前の段で解消済みで、今回の差分では再修正していない。
- `atc-stock-credit-check` の受け持ち拡張（R4-4）と分配表への `両代表の確認の整合` 行の追加（R4-8）は、executor が要判断とした。
- 検証は executor の markdownlint・prettier と、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` がすべて passed。ほかの検査は変更種別により `not_applicable` だった。
- 主張ごとの確かめ（15件）の結果は次の表のとおり。 | # | 主張 | 正本 | 結果 | | - | - | - | - | | 1 | 受入範囲（1章） | `tsp-index-sample.md` | 不一致→直した | | 2 | 出口条件に例外を設けない（P0） | `tsp-index-sample.md` | 一致 | | 3 | 判定 PO・照合 QE・進行 BA | `tsp-index-sample.md` | 一致 | | 4 | 家族利用者代表の Role code は UX | `pm-members-sample.md` | 一致 | | 5 | BAC-01〜BAC-03 の内容 | `bac-sample.md` | 一致 | | 6 | SC-02〜SC-06 は運用開始後 | 成功基準と受入条件の sample | 不一致→直した | | 7 | AC-04 の条件 ID・確認日・確認者 | 成功基準と受入条件の sample | 一致 | | 8 | `stc-cash-sale`・`stc-record-recovery` の term 名と境界 | `stc-index-sample.md` | 一致 | | 9 | `kinuya-test-data` の値 | `tsp-index-sample.md` | 一致（常連顧客を1名とする点は確かめられない） | | 10 | 受入環境 | `tsp-index-sample.md` | 一致（`kinuya-at` と保管サービスの接続は確かめられない） | | 11 | `case_id` 形式と採番 | `atc-index-rulebook.md` | 一致 | | 12 | 章構成・列順 | `atc-index-rulebook.md` | 一致 | | 13 | 分割の目安 | `atc-index-rulebook.md` | 不一致→直した | | 14 | frontmatter の `type: test` と rulebook ID | `deliverable-frontmatter.schema.yaml`・rulebook | 一致 | | 15 | P2 の合格率90% | なし | 確かめられない（`_ASSUMPTION_` として明示済み） |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/atc-index-sample.md`: 受入範囲と P0 の条件 ID を SC-01・SC-07・SC-09・AC-01〜AC-05 に直した。DEV の責務に AC-04 の文書照合を足した。`atc-stock-credit-check` の業務成果を在庫・つけの登録→検索→確認に広げ、分割の理由を開始条件の違いに書き直した。分割の目安を「50件以上」にし、運用開始後の SC の範囲を SC-02〜SC-06・SC-08・SC-10 に直した。非機能の根拠を SC-09 の基準に置き換えた。分配表に `両代表の確認の整合`（主担当 `atc-stock-credit-check`、従担当 `atc-cash-sale`）を足した。

## 3. 申し送り

- 要判断 R4-4: `atc-stock-credit-check` の業務成果を広げ、AC-05・SC-07・SC-09 を受け持たせた。別の term（例 `atc-stock-credit-update`）を新設する案もあるが、atc-sample の構成と R1・R2 の範囲に及ぶため採らなかった。採否の判断が要る。
- 要判断 R4-8: SC-07 を受け持つ観点を、系統表ではなく分配表の1行（`両代表の確認の整合`）で足した。系統表に観点として立てるかの判断が要る。
- 確かめられなかった主張: 常連顧客を1名とする点、受入用領域名 `kinuya-at` と保管サービスの接続、P2 の合格率90%。正本は TSP・環境定義・実案件の合格基準の決定が要る。
- R4-1: R4 / 1. 本ドキュメントの目的と適用対象 / TSP の受入テストの範囲を「SC-01・AC-01〜AC-04 の代表シナリオ」と書いていたが、TSP の範囲は SC-01・SC-07・SC-09・AC-01〜AC-05 の代表シナリオと文書照合 / 「SC-01・SC-07・SC-09・AC-01〜AC-05 の代表シナリオと文書照合」に直した / vp-qe-verifiability（tsp-index-sample の受入テスト行と出口条件） / -
- R4-2: R4 / 1.1. 合格基準 / P0 の対象を SC-01・AC-01〜AC-04 としていたが、TSP の受入テストの出口条件は SC-01・SC-07・SC-09・AC-01〜AC-05 がすべて合格 / P0 の対象を出口条件の条件 ID に直した / vp-qe-verifiability / -
- R4-3: R4 / 1. 関係者の表 / TSP と成功基準・受入条件 sample では DEV が AC-04 の文書照合を行うが、DEV の責務に書かれていなかった / DEV の責務に「AC-04 の文書照合」を足した / vp-dev-implementation-readiness（tsp-index-sample の受入テスト行、prj-success-criteria の AC-04） / -
- R4-4: R4 / 2. 受入テスト対象の括り方と分割基準 / 範囲を直すと AC-05（在庫・つけの登録と更新）・SC-07・SC-09 を受け持つ term がなくなる。分割の理由にあった「照合責任を店主代表だけが負う」は、AC-02 の確認者が両代表のため正本と合わない / atc-stock-credit-check の業務成果を「在庫・つけの登録→検索→確認」に広げ、根拠を SC-01、SC-07、SC-09、AC-02、AC-05 とし、分割の理由を開始条件の違いに書き直した / vp-qe-verifiability。迷った理由: 別の term（例 atc-stock-credit-update）を新しく作る案もあるが、atc-sample の構成と R1・R2 の範囲に及ぶため採らなかった / 要判断
- R4-5: R4 / 2. 受入テスト対象の括り方と分割基準 / 分割の目安を「50件を超えた」としていたが、rulebook は「50 ケース以上」を分割候補とする / 「50件以上になった」に直した / vp-qe-kata-conformance（atc-index-rulebook の分割基準の記述ガイド） / -
- R4-6: R4 / 3. 対象外・除外理由（共通） / 運用開始後の効果を SC-02〜SC-06 としていたが、正本は SC-02〜SC-06・SC-08・SC-10 / 範囲を直した / vp-qe-verifiability（prj-success-criteria sample、tsp-index-sample の対象外） / -
- R4-7: R4 / 4. 受入観点の立て方（共通） / AT で扱う非機能の根拠を共通サンプル文脈の期待効果としていたが、正本の条件は SC-09（両代表のすべての試行で1分以内） / 状態の記述を SC-09 の基準に置き換えた / vp-qe-verifiability / -
- R4-8: R4 / 6. 観点/条件の採用基準と対象別への分配方針（共通） / 採用根拠の条件 ID に SC-07・SC-09・AC-05 が欠け、SC-07 を受け持つ観点がない / 根拠の ID を直し、分配表に `両代表の確認の整合`（主担当 atc-stock-credit-check、従担当 atc-cash-sale）を足した / vp-qe-verifiability。迷った理由: SC-07 を系統表の観点として立てる案もあるが、変更を分配表の1行に留めた / 要判断
- R4-9: R4 / 全体 / F001〜F003（取引照合の保証の主担当、主要操作の自力完了の成立の命名、家族利用者代表の Role code）は前の段で解消済み。UX は pm-members-sample の Role code と一致した / - / vp-qe-omissions-consistency、vp-qe-kata-conformance、vp-ux-language-consistency / -
- 確かめ1: 主張=受入範囲（1章）/ 正本=docs/ja/specdojo/samples/tsp-index-sample.md / 確かめ方=grep で受入テストの範囲と出口条件を読んだ / 結果=不一致→直した / 根拠=受入テストの範囲は SC-01・SC-07・SC-09・AC-01〜AC-05 の代表シナリオと文書照合、出口条件は同じ ID がすべて合格
- 確かめ2: 主張=受入テストの出口条件に例外を設けない（P0）/ 正本=tsp-index-sample.md / 確かめ方=読み取り / 結果=一致 / 根拠=「受入テストの出口条件には例外を設けない」
- 確かめ3: 主張=判定者は PO、照合は QE、進行は BA / 正本=tsp-index-sample.md / 確かめ方=読み取り / 結果=一致 / 根拠=受入テスト行「BA が進行」、出口条件「判定: PO、照合: QE」
- 確かめ4: 主張=家族利用者代表の Role code は UX / 正本=docs/ja/specdojo/samples/generated/pm-members-sample.md / 確かめ方=grep family-user-representative / 結果=一致 / 根拠=family-user-representative の Role は UX
- 確かめ5: 主張=BAC-01〜BAC-03 の内容（現金販売、在庫不足時の停止、入力不足時の引継ぎ）/ 正本=docs/ja/specdojo/samples/bac-sample.md / 確かめ方=grep BAC- / 結果=一致 / 根拠=2.1〜2.3 の見出し
- 確かめ6: 主張=SC-02〜SC-06 は運用開始後 / 正本=prj-success-criteria-and-acceptance-criteria-sample.md / 確かめ方=読み取り / 結果=不一致→直した / 根拠=運用開始後は SC-02〜SC-06・SC-08・SC-10
- 確かめ7: 主張=AC-04 は条件 ID・確認日・確認者を辿れること / 正本=prj-success-criteria sample / 確かめ方=読み取り / 結果=一致 / 根拠=AC-04 の行。文書照合は開発担当
- 確かめ8: 主張=stc-cash-sale・stc-record-recovery の term 名、在庫と同数の境界は ST で確定 / 正本=docs/ja/specdojo/samples/stc-index-sample.md / 確かめ方=grep stc- / 結果=一致 / 根拠=分割表と分配表の `販売確定成立` / 在庫と同数の購入
- 確かめ9: 主張=kinuya-test-data は商品A 単価30円・在庫5個、架空の常連顧客、実在の顧客名を使わない / 正本=tsp-index-sample.md / 確かめ方=読み取り / 結果=一致（常連顧客を1名とする点は正本に記述がなく確かめられない）/ 根拠=テストデータの節
- 確かめ10: 主張=受入環境は店舗端末の本番相当構成、受入用の店舗データ領域を使う / 正本=tsp-index-sample.md / 確かめ方=読み取り / 結果=一致（領域名 kinuya-at と保管サービスを検証用領域へ接続する点は正本に記述がなく確かめられない。確かめには TSP か環境定義に受入の接続先が要る）/ 根拠=テスト環境の店舗端末行
- 確かめ11: 主張`=case_id` は `at-&lt;term&gt;-&lt;perspective_key&gt;-&lt;nnn&gt;`、010 から 10 刻み / 正本=docs/ja/specdojo/rulebooks/atc-index-rulebook.md / 確かめ方=読み取り / 結果=一致 / 根拠=ケース表の共通カラムの記述ガイド
- 確かめ12: 主張=章構成、共通カラムの順序、分配表の列順 / 正本=atc-index-rulebook.md / 確かめ方=読み取り / 結果=一致 / 根拠=本文要件と記述ガイド
- 確かめ13: 主張=分割の目安 / 正本=atc-index-rulebook.md / 確かめ方=読み取り / 結果=不一致→直した / 根拠=「50 ケース以上…は分割候補」
- 確かめ14: 主張=frontmatter の type: test と rulebook ID / 正本=docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml、atc-index-rulebook.md / 確かめ方=grep test、読み取り / 結果=一致 / 根拠=schema の enum に test、rulebook は specdojo:atc-index-rulebook
- 確かめ15: 主張=P2 の合格率90% / 正本=なし / 確かめ方=- / 結果=確かめられない（本文で `_ASSUMPTION_` として明示済み）/ 根拠=確かめには実案件の合格基準の決定が要る
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/atc-index-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample の事実を `tsp-index-sample`、成功基準と受入条件の sample、`bac-sample`、`stc-index-sample`、`pm-members-sample`、`atc-index-rulebook`、frontmatter schema と突き合わせた。正本と食い違う箇所だけを直し、rulebook を正とした。確かめ結果は summary の表に1回だけ記した。plan に展開された F001〜F003 は前の段で解消済みと確認し、重ねて直していない。根拠不足で見送った改訂はない。
