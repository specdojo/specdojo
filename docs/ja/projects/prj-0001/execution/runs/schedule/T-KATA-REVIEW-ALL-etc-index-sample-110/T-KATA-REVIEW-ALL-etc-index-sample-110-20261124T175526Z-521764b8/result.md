---
specdojo:
  id: prj-0001:xer-t-kata-review-all-etc-index-sample-110-20261124t175526z-521764b8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-etc-index-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-etc-index-sample-110/T-KATA-REVIEW-ALL-etc-index-sample-110-20261124T175526Z-521764b8/plan.md
  started_at: "2026-11-24T17:55:34.154Z"
  completed_at: "2026-11-24T18:03:02.083Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:etc-index-sample
    - specdojo:etc-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を実施し、`docs/ja/specdojo/samples/etc-index-sample.md` を 1 ファイルだけ修正した。ET の対象である読取経路 `PATH-06` に対し、契約の例と対象別への分配が転送に偏っていた点を補った。
- F001・F008 は、現行の `tsp-index-sample` が `PATH-04`・`PATH-07` を内部結合テストとしていること、rulebook が内部結合の重複掲載を禁じていることから、`PATH-05`・`PATH-06` への限定を維持した。外部の範囲を広げる案は採らず、相手側（`itc-index-sample`）の修正案を申し送りに残した。
- F002〜F004 は管理観点で R1 の対象外とした。F005 は R4、F006・F007 は R2、F009 は R5 で扱う。
- Prettier と `git diff --check` は成功し、runner 実行の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/etc-index-sample.md`: 観点の立て方（共通）と、観点/条件の採用基準・対象別への分配方針（共通）を修正した。観点名を「転送・読取結果の判別」に改め、選択したコピーの読取を `etc-backup-storage` に分配した。読取の成否・コピー識別子・内容を観測する契約の例を追加した。差分は 2 行追加・1 行削除。

## 3. 申し送り

- R1 の指摘一覧（実施内容の表） | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R1-1 | R1 | 観点の立て方（共通）、観点/条件の採用基準と対象別への分配方針（共通） | ET の対象である読取経路 `PATH-06` に対し、契約の例と分配が転送に偏っていた | 観点名を「転送・読取結果の判別」にし、選択したコピーの読取を `etc-backup-storage` に分配した。読取の成否・コピー識別子・内容を観測する例を追加した | `vp-po-purpose-alignment`。`etc-index-rulebook` 6.4・6.6、`tsp-index-sample` 2.1・4.2、`ifd-sample` 4 の `PATH-06` | - | | R1-2 | R1 | テスト対象の括り方と分割基準（F001・F008 の確認） | grade 時点と異なり、現行の `tsp-index-sample` は `PATH-04`・`PATH-07` を内部結合テストとしているが、`itc-index-sample` は依然として ET へ委譲している | 本 sample は `PATH-05`・`PATH-06` への限定を維持した。相手側は `itc-index-sample` 1〜3 で `PATH-04`・`PATH-07` を内部結合テストの対象に戻し、取得・回復の観点と分配を定める案とする。この修正は本タスクの編集範囲外 | `vp-po-purpose-alignment`。`etc-index-rulebook` 6.1・6.2・禁止事項は内部結合の重複掲載を禁じる。現行の `tsp-index-sample` 2.1・4.2 と `ifd-sample` 2〜4 も内部経路であることを示す | 要判断 |
- F008 は F001 と同じ責務境界の問題として確認したが、`itc-index-sample` 側の不整合は未解消である。R1-2 の案を後続段へ引き継ぐ。
- R1-1: R1 / 4. 観点の立て方（共通）、6. 観点/条件の採用基準と対象別への分配方針（共通） / ET の対象である読取経路 PATH-06 に対し、契約の例と分配が転送に偏っていた / 観点名を「転送・読取結果の判別」にし、選択したコピーの読取を etc-backup-storage に分配。読取の成否・コピー識別子・内容を観測する例を追加 / vp-po-purpose-alignment。etc-index-rulebook 6.4・6.6、tsp-index-sample 2.1・4.2、ifd-sample 4 の PATH-06 / -
- R1-2: R1 / 2. テスト対象の括り方と分割基準（F001・F008 の確認） / grade 時点と異なり、現行 tsp-index-sample は PATH-04・PATH-07 を IT としているが、itc-index-sample は依然として ET へ委譲している / - / vp-po-purpose-alignment。etc-index-rulebook 6.1・6.2・禁止事項は内部結合の重複掲載を禁じ、現行 tsp-index-sample 2.1・4.2 と ifd-sample 2〜4 も内部経路であることを示す。このため対象 sample の PATH-05・PATH-06 への限定を維持した。相手側の修正案は itc-index-sample 1〜3 で PATH-04・PATH-07 を IT の対象に戻し、取得・回復の観点と分配を定めること。ET を PATH-04〜PATH-07 に広げる案は現在の規範・戦略に反するため採らなかった。相手側の修正は本タスクの編集範囲外 / 要判断
- 進め方と実践の型の適用: kata-guide 6.1・6.3・6.5、Sample 記述標準、etc-index-rulebook、dct-kata.yaml の対象項目の `done_criteria`、共通レビュー観点、grade result（specdojo.etc-index-sample.yaml）、tsp-index-sample、ifd-sample、itc-index-sample を確認した。対応 recipe は rulebook で undecided のため参照対象なし。grade の F001・F008 は現行資料と照合して判断し、内部経路を ET に追加する修正は行わなかった。condense の記録は plan にない。共通方針と対象別への分配という責務を保ち、個別ケースを追加していない。
- 段の範囲による扱い: F002〜F004 は kata-guide 6.3 が段のレビューから除外する管理観点のため対象外。F005 は R4、F006・F007 は R2、F009 は R5 の kata 相互の整合で扱うため維持した。F008 は F001 と同じ責務境界の問題として確認したが、相手側の不整合は未解消であり、R1-2 の案を後続段へ引き継ぐ。
- 変更ファイル: docs/ja/specdojo/samples/etc-index-sample.md のみ。result、grade サイドカー、rulebook、他の sample、Git 状態・設定は変更していない。reporter は R1-1・R1-2 を実施内容の表へ各1行で記載し、申し送りには表を重ねないこと。親 runner に指定された lint・テスト・schema 検証は実行を委ねた。
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下だけで、docs/ja/projects/ 配下に及ばない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan・result を変更していない。）
- 適用外の検証: `npm run validate:schema:file`（変更した YAML・YML ファイルがない。）

## 4. 進め方と実践の型の適用

sample メンテナンスとして、`kata-guide` 6.1・6.3・6.5、Sample 記述標準、`etc-index-rulebook`、`dct-kata.yaml` の対象項目の `done_criteria`、共通レビュー観点、grade result（`specdojo.etc-index-sample.yaml`）、`tsp-index-sample`、`ifd-sample`、`itc-index-sample` を確認した。対応する recipe は rulebook で undecided のため参照対象がない。condense の記録は plan にない。F001・F008 は現行資料と照合して判断し、内部経路を ET に追加する修正は行わなかった。rulebook を正とし、共通方針と対象別への分配という責務を保ったまま、個別ケースは追加していない。F002〜F004 は kata-guide 6.3 が段のレビューから除外する管理観点のため対象外とした。F005 は R4、F006・F007 は R2、F009 は R5 の kata 相互の整合で扱うため、この段では維持した。
