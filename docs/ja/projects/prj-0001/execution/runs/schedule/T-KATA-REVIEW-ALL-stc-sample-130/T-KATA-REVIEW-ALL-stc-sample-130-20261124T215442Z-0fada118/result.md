---
specdojo:
  id: prj-0001:xer-t-kata-review-all-stc-sample-130-20261124t215442z-0fada118
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-stc-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-stc-sample-130/T-KATA-REVIEW-ALL-stc-sample-130-20261124T215442Z-0fada118/plan.md
  started_at: "2026-11-24T21:54:51.012Z"
  completed_at: "2026-11-24T22:02:22.542Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stc-sample
    - specdojo:stc-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として `stc-sample.md` の文を3か所直した。「実施」行の削除と「外部依存」行の差分化、観点名の「会計維持」への変更、「共通方針との差」行の文末の補正である。
- F002（意図の1合否命題）は R2、F003（対象外の重複）と F004（`TR` の食い違い）は R5 の観点のため、この段では扱っていない。F003 の対象外の行は前の段ですでに直っている。
- executor 実行の `npx prettier --write` は成功した。runner 検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。変更の種類により、`lint:ts`、`lint:md`、`lint:fm`、`typecheck`、`test:unit`、`test:integration` は `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stc-sample.md`: 境界/環境/依存の「実施」行を削除した。「実施」行は `stc-index-sample` の責任行の再掲だった（F001）。「外部依存」行は共通方針に従うとだけ書き、この term で使う2種のスタブ（用紙切れ・30秒タイムアウト）だけを残した（F001）。6.2 の見出しを「観点: 未確定停止」から「観点: 会計維持」に改めた（F005）。`perspective_key` の `print-failure` は変えていない。「共通方針との差」行の理由を「在庫不足になり、応答を測れないためである。」と、述語のある文にした。差分は 3 行追加・4 行削除。

## 3. 申し送り

- R3-1: 段 R3 / 箇所 4. 境界/環境/依存 の「実施」行 / 指摘: 準備は DEV、実施・照合・合否判定は QE という内容が、`stc-index-sample` の「総合テスト共通の境界/環境の扱い」の「責任」行の再掲になっている（F001） / 直した案: 行を削除した / 根拠: `vp-arc-conciseness`、stc-rulebook の「境界/環境/依存」 / 印: なし
- R3-2: 段 R3 / 箇所 4. 境界/環境/依存 の「外部依存」行 / 指摘: プリンタ検証機・保管サービスの実接続を共通方針から再掲している（F001） / 直した案: 実接続は共通方針に従うとだけ書き、この term で使う2種のスタブだけを残した / 根拠: `vp-arc-conciseness` / 印: なし
- R3-3: 段 R3 / 箇所 6.2. 観点 / 指摘: 観点名「未確定停止」が、会計確定後も会計を維持するという意図と逆の意味になる。`stc-index-sample` の分配表では「未確定停止」は `stc-sale-hold` 側の観点である（F005） / 直した案: 見出しを「観点: 会計維持」に改めた / 根拠: `vp-ux-language-consistency`、W8 / 印: なし
- R3-4: 段 R3 / 箇所 4. 境界/環境/依存 の「共通方針との差」行 / 指摘: 理由の文が「〜ため。」で切れ、述語がない / 直した案: 「在庫不足になり、応答を測れないためである。」にした / 根拠: W2 / 印: なし
- R3-5: 段 R3 / 箇所 4. 境界/環境/依存、5. トレース、6.x.2. 条件・ケース表 / 指摘: Sample 記述標準の「表の前に1文」が、6.5.2 以外の表で満たされていない / 直した案: 見送った。小見出しの名前で何の表かは読み取れ、全表に文を足すと冗長になる。足すなら各表の前に、何を確かめる表かを1文で書く / 根拠: Sample 記述標準の表の前の1文 / 印: 要判断
- R3-1: R3 / 4. 境界/環境/依存 / 「実施」行（準備は DEV、実施・照合・合否判定は QE）が `stc-index-sample` の「総合テスト共通の境界/環境の扱い」の「責任」行の再掲になっている（F001） / 「実施」行を削った / `vp-arc-conciseness`、stc-rulebook の「境界/環境/依存」（対象で使う扱いだけを書く） / -
- R3-2: R3 / 4. 境界/環境/依存 / 「外部依存」行がプリンタ検証機・保管サービスの実接続を共通方針から再掲している（F001） / 実接続は共通方針に従うとだけ書き、この term で使う2種のスタブ（用紙切れ・30秒タイムアウト）だけを残した / `vp-arc-conciseness` / -
- R3-3: R3 / 6.2. 観点 / 観点名「未確定停止」が、会計確定後も会計を維持するという意図と逆の意味になる。`stc-index-sample` の分配表では `stc-cash-sale` に当たる観点は「会計維持」で、「未確定停止」は `stc-sale-hold` 側（F005） / 見出しを「観点: 会計維持」に改めた（`perspective_key` の `print-failure` は変えていない） / `vp-ux-language-consistency`、W8 / -
- R3-4: R3 / 4. 境界/環境/依存 / 「共通方針との差」行の理由の文が「〜ため。」で切れ、述語がない / 「在庫不足になり、応答を測れないためである。」にした / W2 / -
- R3-5: R3 / 4. 境界/環境/依存、5. トレース、6.x.2. 条件・ケース表 / Sample 記述標準の「表の前に1文」が、6.5.2 以外の表で満たされていない / - / Sample 記述標準の表の前の1文。小見出しの名前で何の表かは読み取れ、全表に文を足すと冗長になるため見送った。足すなら各表の前に、何を確かめる表かを1文で書く案 / 要判断
- F002（意図の1合否命題）は R2、F003（対象外の重複）と F004（`TR` の食い違い）は R5 の観点のため、この段では扱わない。F003 の対象外の行は前の段ですでに直っている。

## 4. 進め方と実践の型の適用

plan が指定する kata レビューの段 R3（読みやすさ）として、W1〜W10 の観点で文の直しだけを `stc-sample.md` に入れた。意味と判断に要る背景・例外・制約は変えていない。F001 は `vp-arc-conciseness` と stc-rulebook の「境界/環境/依存」（対象で使う扱いだけを書く）に照らして、共通方針の再掲を削り、対象固有の差分だけを残した。F005 は `stc-index-sample` の分配表との名称整合を根拠に、見出しの観点名だけを改めた。F002 は R2、F003 と F004 は R5 の観点なので扱っていない。未解消として扱うのは、表の前の1文を足すかどうか（R3-5）で、「要判断」とした。成果物 frontmatter の `status` は変更しておらず、`draft` のままである。
