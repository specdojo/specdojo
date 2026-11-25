---
specdojo:
  id: prj-0001:xer-t-kata-review-all-otp-sample-140-20261125t022249z-179ab6c6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-otp-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-otp-sample-140/T-KATA-REVIEW-ALL-otp-sample-140-20261125T022249Z-179ab6c6/plan.md
  started_at: "2026-11-25T02:22:58.476Z"
  completed_at: "2026-11-25T02:35:40.089Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:otp-sample
    - specdojo:otp-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`otp-sample` の事実（frontmatter、章構成と表の列、参照先の記述）を rulebook、schema、`otp-index-sample`、`mip-index-sample`、`cop-sample`、`dmd-index-sample` と突き合わせた。
- 不一致は 1 件だけだった。問合せ窓口/一次対応の P2 のエスカレーション記述が `otp-index-sample` の優先度の表と合っていなかったため、これを修正した。
- 確かめの結果は次の表のとおり。
- | No | 主張 | 正本 | 結果 | | --- | --- | --- | --- | | 1 | frontmatter の `type: operations` と `rulebook: specdojo:otp-rulebook` | `otp-rulebook.md` の「推奨 Frontmatter 項目」、`deliverable-frontmatter.schema.yaml` | 一致 | | 2 | 11 章の順序と各表の列（監視/アラート、運用手順の変更点、初期増員体制） | `otp-rulebook.md` の「本文要件」 | 一致 | | 3 | P1 または P2 のときは `otp-index` のエスカレーション先へすぐ渡す | `otp-index-sample.md` の優先度の表 | 不一致のため修正。P2 のエスカレーション条件は「当日の日次締めまでに店主代表が訂正できない」で、即時ではない | | 4 | 正本切替は `mip-index` の GO4（閉店後） | `mip-index-sample.md` | 一致 | | 5 | `cop-cutover-day` は切替日午前の手順 | `cop-sample.md` の概要 | 一致 | | 6 | 初期増員体制の P3 は 3 営業日続いたら上げる | `otp-index-sample.md` の優先度の表 | 一致 | | 7 | バックアップは USB メモリ、リストアは開発担当、戻す日は店主代表、手順は `opr-backup-restore` | `otp-index-sample.md` の「バックアップ/リストア」 | 一致 | | 8 | クローズ判断者は店主代表、最終報告物はハイパーケア終了報告 | `otp-index-sample.md` の「移行完了後のクローズ条件」 | 一致 | | 9 | 旧ノートの参照期間は `dmd-index` の保管期間に合わせ未決 | `dmd-index-sample.md` | 一致 | | 10 | `opr-support`、`opr-shift-handover`、`opr-backup-restore` が実在する | `opr-*-sample.md` | 確かめられない。sample の id はファイル名ベースで term 宣言がなく、`opr-shift-handover` と `opr-backup-restore` が `otp-index-sample` でも使われていることだけ確認した |
- 検証では、executor の `markdownlint` と `prettier --check` が通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。変更種別により対象外となった検査は `not_applicable` である。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/otp-sample.md`: 問合せ窓口/一次対応の P2 のエスカレーションの記述を 1 行修正した。P1 は即時に `otp-index` のエスカレーション先へ渡す。P2 は一次対応の受け手へ渡し、以後は `otp-index` の条件（当日の日次締めまでに店主代表が訂正できない場合）に従う。この修正で `otp-index-sample` の優先度の表と一致した。

## 3. 申し送り

- R5（整合）への追加メモ: executor の申し送りにある `opr-support` と `opr-index` の食い違いのほか、`opr-*` 参照先の実在は R4 では確かめられなかった（確かめ No10）。R5 で判断する。
- 確かめ No1: 主張=frontmatter `type: operations`・`rulebook: specdojo:otp-rulebook`／正本=docs/ja/specdojo/rulebooks/otp-rulebook.md「推奨 Frontmatter 項目」、docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml／確かめ方=読み取り・grep operations／結果=一致／根拠=schema 17 行の enum operations、rulebook の指定
- 確かめ No2: 主張=11 章の順序と各表の列（監視/アラート、運用手順の変更点、初期増員体制）／正本=otp-rulebook.md「本文要件」／確かめ方=読み取り／結果=一致／根拠=章名・列名が同一
- 確かめ No3: 主張=問合せ窓口/一次対応「P1 または P2 のときは `otp-index` のエスカレーション先へすぐ渡す」／正本=docs/ja/specdojo/samples/otp-index-sample.md 優先度の表／確かめ方=読み取り／結果=不一致（修正済み）／根拠=P2 のエスカレーション条件は『当日の日次締めまでに店主代表が訂正できない』で即時ではない。P1 は即時、P2 は一次対応の受け手へ渡し以後は `otp-index` の条件に従う、と改めた
- 確かめ No4: 主張=正本切替は `mip-index` の GO4・日の閉店後／正本=docs/ja/specdojo/samples/mip-index-sample.md 120 行／確かめ方=grep GO4／結果=一致／根拠=T+7 日（閉店後）正本切替 GO4
- 確かめ No5: 主張=`cop-cutover-day` が切替日午前の手順／正本=docs/ja/specdojo/samples/cop-sample.md 概要／確かめ方=grep／結果=一致／根拠=『概要（cutover-day）』と `cop-cutover-day` の宣言
- 確かめ No6: 主張=初期増員体制『`otp-index` は 3 営業日続いたら上げる』（P3）／正本=otp-index-sample.md 優先度の表／確かめ方=読み取り／結果=一致／根拠=P3: 3 営業日続けて同じ問合せ
- 確かめ No7: 主張=バックアップは USB メモリ、リストアは開発担当・戻す日は店主代表、手順は `opr-backup-restore`／正本=otp-index-sample.md「バックアップ/リストア」／確かめ方=読み取り／結果=一致／根拠=同章の保管先・リストア責任者の記述
- 確かめ No8: 主張=クローズ判断者は店主代表、最終報告物はハイパーケア終了報告／正本=otp-index-sample.md「移行完了後のクローズ条件」／確かめ方=読み取り／結果=一致／根拠=判定者・最終報告物の記述
- 確かめ No9: 主張=旧ノートの参照期間は `dmd-index` の保管期間に合わせ未決／正本=docs/ja/specdojo/samples/dmd-index-sample.md 51 行／確かめ方=grep 保管／結果=一致／根拠`=_UNDECIDED_:` 旧ノートの保管期間
- 確かめ No10: 主張=参照先の term `opr-support`・`opr-shift-handover`・`opr-backup-restore` が実在する／正本`=docs/ja/specdojo/samples/opr-*-sample.md`／確かめ方=grep id／結果=確かめられない／根拠=sample の id はファイル名ベースで term 宣言がない。`opr-shift-handover`・`opr-backup-restore` は otp-index-sample でも使用されていることのみ確認
- R5 への申し送り: 「権限/アカウント移行」の開発担当行がハイパーケア後の問合せ先を `opr-support` とし、otp-index-sample は『`opr-index` の運用へ引き継ぐ』と書く。食い違いの判断は R5（整合）で扱う

## 4. 進め方と実践の型の適用

R4（正しさ）の段として、sample の事実主張を rulebook、schema、関連 sample（`otp-index-sample`、`mip-index-sample`、`cop-sample`、`dmd-index-sample`）と突き合わせた。plan に展開された grade と condense の finding はなかった。誤りは P2 のエスカレーション条件の 1 件だけで、`otp-index-sample` を正として直した。他の主張は正本と一致していたため維持した。正本のない駄菓子屋の業務の値は、共通サンプル文脈と食い違わないため確かめの対象にしていない。`opr-*` の term 実在は確かめられず、表に残した。frontmatter の `status` は `draft` のまま変えていない。
