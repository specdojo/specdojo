---
specdojo:
  id: prj-0001:xer-t-kata-review-all-etc-index-sample-120-20261124t182412z-762ae9b4
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-etc-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-etc-index-sample-120/T-KATA-REVIEW-ALL-etc-index-sample-120-20261124T182412Z-762ae9b4/plan.md
  started_at: "2026-11-24T18:24:21.032Z"
  completed_at: "2026-11-24T18:36:00.655Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:etc-index-sample
    - specdojo:etc-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `docs/ja/specdojo/samples/etc-index-sample.md` を見直した。章の名称・順序と必須表は維持し、観点の型と記入例の構成を補った。
- | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 4. 観点の立て方（共通） / F006 | rulebook が挙げる非機能の型が観点表にない | 「ET で扱う範囲の非機能」の行を追加し、印刷応答待ちの上限、保管応答待ち・再送回数・再送間隔の遵守を例示した | `vp-qe-omissions-consistency`。`etc-index-rulebook` 6.4 の6種類の型と照合し、7章の既存方針に対応させた | - | | R2-2 | R2 | 8. ケース表の共通カラム / F007 | トレースの記入例が説明文だけで参照先の ID を持たない | `specdojo:tsp-index-sample` の文書 ID を持つ wikilink と、5章の外部結合テスト出口条件への指定に変更した | `vp-qe-omissions-consistency`。`etc-index-rulebook` 6.8 の ID によるトレース要件。参照先の5章に印刷失敗・タイムアウトを含む契約観点の出口条件があることを確認した | - | | R2-3 | R2 | 8. ケース表の共通カラム | 記入例で使う識別子の構成・維持規則が表の後に置かれている | `case_id` の規則を記入例の前へ移し、規則→例の順に統合した | `vp-arc-document-structure`。kata-guide 6.1 の「前提から結論の順」。既存の規則・値・カラム順は維持した | - |
- finding の扱い: F006・F007 を解消した。F001・F008 は R1 が確認した責務境界の判断を維持した。F002〜F004 は管理観点で kata-guide 6.3 が除外し、F005 は R4、F009 は R5 に任せた。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/etc-index-sample.md`: 観点の型の表に非機能の行を追加した。ケース表の共通カラムでは、`case_id` の規則を記入例の前へ移した。トレース列の記入例は、文書 ID を持つ wikilink による参照に改めた。

## 3. 申し送り

- F001・F008 に関わる `itc-index-sample` 側の不整合と修正案は R1 result を引き継ぐ。この sample では新しい指摘として繰り返していない。
- R2-1: R2 / 4. 観点の立て方（共通） / F006: rulebook が挙げる非機能の型が観点表にない / 「ET で扱う範囲の非機能」の行を追加し、印刷応答待ちの上限、保管応答待ち・再送回数・再送間隔の遵守を例示した / `vp-qe-omissions-consistency`。`etc-index-rulebook` 6.4 の6種類の型と照合し、7章の既存方針に対応させた / -
- R2-2: R2 / 8. ケース表の共通カラム / F007: トレースの記入例が説明文だけで参照先の ID を持たない / `specdojo:tsp-index-sample` の文書 ID を持つ wikilink と、5章の外部結合テスト出口条件への指定に変更した / `vp-qe-omissions-consistency`。`etc-index-rulebook` 6.8 の ID によるトレース要件。参照先の5章に印刷失敗・タイムアウトを含む契約観点の出口条件が存在することを確認した / -
- R2-3: R2 / 8. ケース表の共通カラム / 記入例で使う識別子の構成・維持規則が表の後に置かれている / `case_id` の規則を記入例の前へ移し、規則→例の順に統合した / `vp-arc-document-structure`。kata-guide 6.1 の「前提から結論の順」。既存の規則・値・カラム順は維持した / -
- 進め方と実践の型の適用: 共通規約2文書、kata-guide 6.1・6.3・6.5、Sample 記述標準、etc-index-rulebook、共通レビュー観点、dct-kata.yaml の対象項目の `done_criteria`、grade result（specdojo.etc-index-sample.yaml）、R1 result（T-KATA-REVIEW-ALL-etc-index-sample-110）、tsp-index-sample、ifd-sample、itc-index-sample を確認した。rulebook の recipe・template はともに undecided で、対応ファイルはない。全9章の名称・順序と必須表を維持し、4章は6種類の観点、8章は共通10カラムを確認した。condense 記録は plan にない。reporter は R2-1〜R2-3 を実施内容の表へ各1行で記載し、申し送りに表を重ねないこと。
- finding の扱い: F006・F007 を解消した。F001・F008 は R1 が確認した現行 tsp・ifd と rulebook に基づく責務境界の判断を維持し、新しい指摘として繰り返さない。itc-index-sample 側の不整合と修正案は R1 result を引き継ぐ。F002〜F004 は kata-guide 6.3 が除外する管理観点、F005 は R4、F009 は R5 に任せる。
- 変更ファイル: docs/ja/specdojo/samples/etc-index-sample.md のみ。result は reporter が記入する。構成の再照合と `git diff --check` は問題なし。指定された lint・テスト・schema の親検証は runner に委ねた。
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下に及ばない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan・result を変更していない。）
- 適用外の検証: `npm run validate:schema:file`（変更した YAML・YML ファイルがない。）

## 4. 進め方と実践の型の適用

共通規約2文書、kata-guide 6.1・6.3・6.5、Sample 記述標準、`etc-index-rulebook`、共通レビュー観点、`dct-kata.yaml` の `done_criteria`、grade result、R1 result、`tsp-index-sample`、`ifd-sample`、`itc-index-sample` を根拠とした。rulebook の recipe と template はともに undecided で、対応ファイルはない。rulebook を正として、全9章の名称・順序と必須表を維持した。4章は6種類の観点、8章は共通10カラムであることを確認した。plan に condense 記録はない。F001・F008 は R1 が確認した責務境界の判断を維持した。F002〜F004 は管理観点、F005 は R4、F009 は R5 に任せた。
