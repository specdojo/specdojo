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
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `specdojo index build`・`npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                               | 担当     | 状態 | メモ                                                      |
| --- | -------------------------------------------------- | -------- | ---- | --------------------------------------------------------- |
| 1   | 命名の標準と設計の型を読み、略号と置き場所を決める | executor | done | DSS、`dss-<term>`、システム設計配下を採用                 |
| 2   | rulebook と sample を作り、種類の一覧に足す        | executor | done | 型・完成例と命名標準、参照先、sidebar、レビュー観点を更新 |
| 3   | 検査を流し、決めた点と理由を対応結果に書く         | executor | done | 整形・適用検査を実施し記録。親検証は runner が実行        |

## 5. 対応結果

### 5.1. 実施内容・成果物

- [[specdojo:dss-rulebook|デザインシステム作成ルール]] と [[specdojo:dss-sample|駄菓子屋きぬやの GUI デザインシステム完成例]] を追加した。rulebook は記述標準の連番付き章立てに従い、完成例は sample にのみ置いた。
- 色・文字・余白・角丸のトークン、ボタン・入力・表・ダイアログ、レイアウトの型、通常・エラー・無効・読み込み中・空・完了の状態、アクセシビリティを定義する。完成例は店舗レジの GUI を対象に、値と選択条件、幅変化、通知・フォーカス、検証・更新責任まで記載した。
- UIS、操作性要件、実装の横断ルールとの分担を明記した。デザインツールや実装に正本があれば参照し、本文へ転載しない。画面別ワイヤーフレームは文書として保守せず、UIS と DSS から作った試作をプロダクトのリポジトリへ置く。
- [[specdojo:id-and-file-naming-standard|命名標準]]、[[specdojo:deliverables-reference|成果物リファレンス]]、[[specdojo:directory-layout-reference|ディレクトリレイアウトリファレンス]]、[[specdojo:sysd-index-rulebook|設計の入口の書き分け方針]]、[[specdojo:uis-rulebook|UIS の対象外への案内]] を更新した。
- `packages/docs-site/.vitepress/sidebar-config.ts` のシステム設計の rulebook・sample メニューへ追加した。[[specdojo:pm-review-viewpoints|共通レビュー観点]] の列挙がある二観点では、`vp-ba-business-value`（利用者の課題と採用理由）、`vp-arc-single-responsibility`（GUI 共通設計としての責務）の適用を確認し、いずれも `confirmed_default` へ登録した。プロジェクト固有の観点は共通正本を継承するため追加変更は不要。

### 5.2. 決めた内容と理由

| 論点                   | 決めた内容・理由                                                                                                                                                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 略号                   | DSS（Design System Specification）、prefix は `dss-`。命名標準のプロダクト文書一覧、既存の rulebook・sample・プロダクト文書を確認し、同じ略号・ID がないことを確認した。画面仕様の UIS、システム設計の SYSD、技術スタックの TSD と役割を区別できる     |
| ID・ファイル名         | `dss-<term>` / `dss-<term>.md`。既定は `dss-common` とし、命名標準の `common` の意味に合わせ、複数の画面仕様等から参照する共通定義とする。適用対象が独立する場合だけ `dss-store-gui` 等へ分ける                                                        |
| 分類・配置             | 成果物は `architecture`、`docs/ja/product/040-system-design/dss-common.md`。測れる目標を要求として持つ NFR、業務ユーザー視点の UIS と分け、既存の設計ドメインを使う。専用 rulebook を持つ種類として、汎用の `sysd-<term>` や実装横断ルールに吸収しない |
| 型の ID・配置          | `specdojo:dss-rulebook` / `docs/ja/specdojo/rulebooks/dss-rulebook.md`、`specdojo:dss-sample` / `docs/ja/specdojo/samples/dss-sample.md`。core authority と主題語・種別 suffix の標準に従う                                                            |
| recipe・template       | いずれも `not-needed` を Frontmatter に宣言。単独の設計文書であり、rulebook の本文要件と記述ガイドで作成方法を判断できるため、別の手順や骨組みは追加しない                                                                                             |
| 正本がない場合の完成例 | 本例では外部ツール・実装定義を未導入とし、本書を表現の正本とした。将来移管する場合は参照へ置換する。未作成の関連文書は想定 ID と明記し、実在する完成例へのリンクと区別した                                                                             |

### 5.3. 検証と申し送り

| executor が実施した検証                                                      | 結果                                                                                                               |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `npx prettier --write`（変更した Markdown 8 件、YAML 1 件、TypeScript 1 件） | 整形済み                                                                                                           |
| `node --import tsx src/docs/viewpoint-document-kinds-check.ts`               | 成功。全 111 rulebook の観点適用判断に漏れなし                                                                     |
| `node --import tsx tools/catalog-validate-if-configured.mjs`                 | 成功。変更範囲外のカタログに、参照文書の不在と再 export のみのコード参照の警告あり。カタログの変更は本項目の対象外 |
| `npm run validate:history-links`                                             | 成功                                                                                                               |
| `node --import tsx src/specdojo.ts register build --project prj-0001`        | 成功。gitignore 対象の派生ビューを生成                                                                             |
| `node tools/check-evidence-secrets.mjs --staged`                             | 成功。検査対象の staged 実行記録は 0 件                                                                            |
| `git diff --check`                                                           | 成功                                                                                                               |

`lint:md`、`lint:fm`、`test:unit`、YAML を含む `validate:schema` 等は pipeline の親検証に設定済みのため、executor では重複実行せず runner に委ねる。個票の完了条件にある `specdojo index build` も pipeline の明示指示に従い executor から実行せず、runner の再生成へ委ねる。保護された設定の変更案、未決定事項はない。result は reporter が記入する。

### 5.4. CHANGELOG に書く事項

- 区分: 追加
- 行の文案: GUI の共通デザインを設計するデザインシステム（DSS）の rulebook と、駄菓子屋の販売管理 GUI の完成例を追加。デザイントークン、部品、レイアウトの型、状態表示、アクセシビリティを定義し、画面仕様・操作性要件・実装横断ルールとの分担と正本への参照方法を明確化。

## 6. 関連ドキュメント

- 由来: [[prj-0001:pjr-mxqb-gui-wireframe-design-rules]]
- 関係する型: [[specdojo:uis-rulebook]]、[[specdojo:nfr-usability-rulebook]]、[[specdojo:sysd-cross-cutting-policy-rulebook]]
