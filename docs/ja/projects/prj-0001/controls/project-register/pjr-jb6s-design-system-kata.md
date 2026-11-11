---
specdojo:
  id: prj-0001:pjr-jb6s-design-system-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T12:46:14Z"
  derived_from:
    - PJR-MXQB
  autopilot: approved
---

# PJR-JB6S GUI のデザインのルール（デザインシステム）の型を新しく作る

## 1. 概要

uis はワイヤーフレームとレイアウトを含めないため、画面をまたいで見た目を揃えるデザインのルール（色・文字・余白などの基本の値、部品、レイアウトの型、アクセシビリティ）を、設計の新しい種類として定める rulebook と sample を作る

## 2. 入力

- indie の要望（2026-11-10）: uis はワイヤーフレームを含めないので、デザインシステムを別途設計として定める型を作る。
- orchestrator の案（PJR-MXQB の入力、2026-11-08）: デザインのルールは設計の範疇で、実装の共通ルールを扱う sysd-cross-cutting-policy とは分けた新しい型にする。ワイヤーフレームは文書として保守せず、uis とデザインのルールから agent に試作を作らせ、プロダクトのリポジトリに置く。nfr-usability は測れる目標を決める要求で、デザインのルールはそれを満たす設計の決まりにあたる。
- 略号・ID・置き場所（設計の文書の階層）は executor が既存の命名の標準と設計の型を読んで決め、理由を個票の対応結果に書く。

## 3. 完了条件

- デザインのルールの新しい種類の略号・ID・成果物の置き場所を、[[specdojo:id-and-file-naming-standard]] と既存の設計の型（sysd 系）を読んで決め、既存の略号と紛れないことを確かめ、理由を個票の対応結果に書いている。
- その種類の rulebook と sample を作っている。[[specdojo:rulebook-authoring-standard]] の章立てに従い、rulebook にサンプルの章を置かず、見出しに連番を付けている。
- rulebook に、次の範囲と分け方を書いている。
  - 扱うもの: 色・文字・余白・角丸などの基本の値（デザイントークン）、部品（ボタン・入力・表・ダイアログなど）の使い方、レイアウトの型、状態（エラー・無効・読み込み中など）の見せ方、アクセシビリティの決まり。
  - 扱わないもの: 画面ごとの利用目的・項目・操作・遷移（uis が持つ）、画面ごとのワイヤーフレーム（文書として保守せず、uis とこの型から試作を作る）、実装の共通ルール（sysd-cross-cutting-policy が持つ）。
  - 使いやすさの測れる目標（nfr-usability）との関係（目標は nfr、それを満たす決まりはこの型）。
  - デザインツールや実装のトークンの正本がある場合は、その中身を繰り返さず参照する（PJR-2GD6 の方針）。
- sample は、駄菓子屋の販売管理システムの GUI のデザインのルールの完成例で、[[specdojo:clis-sample]] 程度の厚さにしている。
- recipe と template の要否を決め、frontmatter に書いている。
- ID の命名の標準・成果物のリファレンス・文書サイトの sidebar・レビューの観点の設定など、種類の一覧を持つ文書と設定に足している。保護された設定に当たるものは executor が変えず、変更案を個票の対応結果と報告の `handoff` に書いている。
- uis-rulebook の「扱わないもの」の記述から、この型を案内している。
- 2 回目の実行（2026-11-11 追加）: 1 回目の後の grade（run id `uis-dss-20261111`）で、dss-rulebook は pass 97、dss-sample は needs-work 94 だった。次を直し、grade で dss-rulebook と dss-sample がどちらも pass になっている（grade は orchestrator が流してよい）。
  - dss-rulebook に、[[specdojo:rulebook-authoring-standard]] の「運用ルール」の章を足す（ほかの型と同じ章立てにする）。
  - 記述ガイドに、章ごとの判断の基準と良い例・悪い例を足し、[[specdojo:clis-rulebook]] 程度の厚さにする。
  - dss-sample の grade の指摘を直す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `specdojo index build`・`npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                               | 担当         | 状態 | メモ                                           |
| --- | -------------------------------------------------- | ------------ | ---- | ---------------------------------------------- |
| 1   | 命名の標準と設計の型を読み、略号と置き場所を決める | executor     | done | 既存の DSS の命名と設計階層を確認              |
| 2   | rulebook と sample を作り、種類の一覧に足す        | executor     | done | 既存の一覧追加を確認し、2 回目の改訂を実施     |
| 3   | 検査を流し、決めた点と理由を対応結果に書く         | executor     | done | sandbox 内の検査は成功。親検証は runner が実施 |
| 4   | 改訂後の rulebook・sample を grade で再評価する    | orchestrator | done | run id `dss-20261111c` で両方 pass 100         |

## 5. 対応結果

### 5.1. 命名・配置と判断理由

- 略号は既存の `dss`（Design System Specification）を維持する。[[specdojo:id-and-file-naming-standard|ID・ファイル命名標準]] の種類一覧では DSS だけに `dss-` を割り当てており、UIS・SYSD・TSD 等と区別できる。型の ID は `specdojo:dss-rulebook`、完成例は `specdojo:dss-sample` とし、authority とファイル名の規則に従う。
- 成果物は `dss-<term>`（既定 `dss-common.md`）を `docs/ja/product/040-system-design/` に置く。画面をまたぐ設計の共通定義なので `common` を使い、要求である UIS・NFR と分ける。既存の sysd 系と同じ設計階層に置きつつ、実装の横断ルールとは責務が異なるため独立した型とする。
- recipe・template は `not-needed` を維持する。Markdown の章ごとの判断基準と完成例で作成でき、別の手順や骨組みを保守する必要がないため。完成例の所在は Frontmatter だけで宣言する。

### 5.2. 成果物と種類一覧の確認

- [[specdojo:dss-rulebook|DSS 作成ルール]]: 「運用ルール」を追加し、記述ガイドを成果物の八つの章に対応させた。各章に判断基準・推奨表または記述項目・良い例・悪い例を置き、正本参照、状態表示、検証・変更・例外の扱いを具体化した。
- [[specdojo:dss-sample|DSS 完成例]]: 駄菓子屋の GUI の設計値・部品・レイアウトを保ち、Role code と責任の対応、入力の確認時点、試作から実装採用までの節目、不適合・変更・例外の記録先を追加した。同梱完成例の公開責任と条件を作中の承認から分けた。利用端末は [[specdojo:sample-authoring-standard|Sample 記述標準]] に合わせて店頭タブレット 1 台とした。
- 命名標準、[[specdojo:deliverables-reference|成果物リファレンス]]、[[specdojo:directory-layout-reference|ディレクトリ配置リファレンス]]、`packages/docs-site/.vitepress/sidebar-config.ts` の rulebook・sample 両メニューには DSS が追加済みであり、再変更は不要と判断した。
- [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] では、種類を列挙する `vp-ba-business-value` と `vp-arc-single-responsibility` の双方で DSS を `confirmed_default` として適用済み。利用者の課題と設計の対応、独立した責務を確認する必要があるため、この扱いを維持する。追加の保護設定変更案はない。
- [[specdojo:uis-rulebook|UIS 作成ルール]] の全体方針には、対象外の色・文字・余白・部品・レイアウト等を DSS へ案内し、ワイヤーフレームを UIS・DSS から試作する記述が追加済み。責務境界は変更しなかった。

### 5.3. 前回 grade の指摘への対応

前回の run `uis-dss-20261111`（rulebook: pass 97、sample: needs-work 94）の指摘に対して、次を修正した。以下は改訂箇所の対応であり、再評価の pass を示す記録ではない。

| 対象・finding           | 改訂箇所と対応                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| rulebook F001・F002     | 「ファイル命名・ID規則」から sample ID の重複宣言を削除し、規則 ID の命名だけ残した                                                             |
| sample F001・F003       | 「検証の節目と基準版の採用」で試作確認、規則検証、利用者評価、PO の採用判断の順と必要証跡を定めた                                               |
| sample F002・F007       | 「同梱する完成例の公開条件」で公開範囲、人間の SpecDojo PO の責任、昇格・公開前の適合・検査・grade・レビュー・承認記録を定めた                  |
| sample F004             | 「検証」で想定する入力・試験・受入文書の定義 Role と確認時点、未確定時に止める段階を定めた                                                      |
| sample F005・F006・F008 | 「正本と適用方法」で役割名と Role code を対応付け、「変更・不適合・例外」で報告先、PO の例外判断、PM の記録維持と承認・却下・失効の追跡を定めた |

### 5.4. 検証と申し送り

sandbox 内では次の検査が成功した。

| 検査                                                                  | 結果                                                                                                                          |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `npx prettier --write`（改訂した 3 文書）                             | 整形済み                                                                                                                      |
| `node --import tsx tools/catalog-validate-if-configured.mjs`          | 終了コード 0。変更対象外のカタログに、実体未作成と再 export のみの `evidence_refs` に関する警告あり。カタログは変更していない |
| `npm run validate:history-links`                                      | 終了コード 0。履歴リンク検査が成功                                                                                            |
| `node --import tsx src/specdojo.ts register build --project prj-0001` | 終了コード 0。登録簿・管理ビューの生成が成功                                                                                  |
| `node tools/check-evidence-secrets.mjs --staged`                      | 終了コード 0。検査対象の実行記録 0 件、検出 0 件                                                                              |
| `git diff --check`                                                    | 差分の空白エラーなし                                                                                                          |

親 runner の lint・schema・型検査・単体／結合試験は executor から二重実行していない。`specdojo index build` も runner の責務とし、executor は実行していない。変更した成果物は Markdown だけであり、`validate:schema:file` は対象 YAML がないため適用外。

2026-11-11 の再開では、前回の運用ルール・章ごとの判断基準と例・sample の修正を引き継ぎ、完了条件と種類一覧への反映を再確認した。前回は再 grade が残ることを理由に executor が未完了と報告したが、同日の orchestrator の再開指示に従い、executor の編集・sandbox 内検査は完了として報告する。

改訂後の grade は未実施であり、両文書の pass は未確認。実 agent CLI の起動・使用量を伴うため、統合後に orchestrator が sandbox 外で次を実行し、両方の最新結果が pass であることを確認する。再評価で指摘が残る場合は修正する。前回とは内容が変わるので新しい run ID を使う。

```bash
node --import tsx src/specdojo.ts grade run --project prj-0001 --target kata \
  --path docs/ja/specdojo/rulebooks/dss-rulebook.md \
  --path docs/ja/specdojo/samples/dss-sample.md \
  --run-id dss-jb6s-recheck-20261111 --by sol-review-executor
```

grade サイドカーと result は executor では編集していない。公開・昇格・decision の決定・保護された設定変更も行っていない。

統合の後、orchestrator が run id `dss-20261111c` で grade を流し、dss-rulebook・dss-sample とも pass 100 を確かめた（2026-11-11）。

### 5.5. CHANGELOG に書く事項

- 区分: 追加
- 行の文案: GUI の色・文字・余白、部品、レイアウトの型、状態表示、アクセシビリティを定めるデザインシステム（DSS）の作成ルールと、駄菓子屋の販売管理 GUI の完成例を追加。UIS・操作性要件・システム設計の横断ルールとの分担、正本参照、検証・採用・変更管理の手本を示した。

`CHANGELOG.md` は変更していない。

## 6. 関連ドキュメント

- 由来: [[prj-0001:pjr-mxqb-gui-wireframe-design-rules]]
- 関係する型: [[specdojo:uis-rulebook]]、[[specdojo:nfr-usability-rulebook]]、[[specdojo:sysd-cross-cutting-policy-rulebook]]
