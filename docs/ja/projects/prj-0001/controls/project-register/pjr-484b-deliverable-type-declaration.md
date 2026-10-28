---
specdojo:
  id: prj-0001:pjr-484b-deliverable-type-declaration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  registered_at: "2026-10-28T10:07:40Z"
  derived_from:
    - PJR-RYK8
---

# PJR-484B 成果物の type に requirement と glossary を足し、rulebook の宣言と lint で照合する

## 1. 概要

schema に requirement と glossary を足し、rulebook 107 件の frontmatter に扱う成果物の type を宣言させる。Markdown の成果物・sample・テンプレートの type を宣言にそろえ、違えば lint でエラーにする

- PJR-RYK8 の決定（1-B・2-B）に従い、type の値を足し、rulebook の宣言を正本として成果物の type を照合する。

## 2. 完了条件

- 成果物の frontmatter の schema の type に `requirement`（システム機能・非機能要件・受入基準）と `glossary`（用語集）がある。
- rulebook の frontmatter の schema に、扱う成果物の type を宣言する必須のフィールドがある（名前の案は `deliverable_type`。変える場合は理由を記録する）。
- rulebook 107 件すべてに宣言がある。`project` はプロジェクトの管理文書（prj・pm・dct・tml など）に限る。割り当ての一覧（rulebook・type・理由）を本個票の対応結果に書き、index の rulebook など迷ったものは理由と一緒に書く。
- Markdown の成果物・sample・テンプレート（`frontmatter_template`）の type が宣言と一致している。
- `lint:fm` など既存の検査で、Markdown の成果物・sample・テンプレートの type が rulebook の宣言と違えばエラーにし、文面に宣言された type を示す。
- `document-metadata-standard` と `rulebook-authoring-standard` に、値の意味・宣言の書き方・検査を書く。
- CHANGELOG の `## [Unreleased]` に、移行の手順（rulebook への宣言の追加と type の書き換え）を書く。公開済みの版の節は変えない。
- YAML の type と YAML の表示用ページは PJR-0D0T で扱うため、本項目では変えない。
- 単体テストで、宣言の必須・type のずれのエラー・新しい値を確かめる。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。

## 3. 作業内容

| No  | 作業                                                | 担当     | 状態 | メモ |
| --- | --------------------------------------------------- | -------- | ---- | ---- |
| 1   | schema に値と rulebook の宣言のフィールドを追加する | executor | done | -    |
| 2   | rulebook 107 件に宣言を足し、割り当てを記録する     | executor | done | -    |
| 3   | Markdown の成果物・sample・テンプレートをそろえる   | executor | done | -    |
| 4   | lint の照合を実装する                               | executor | done | -    |
| 5   | standard・CHANGELOG を更新し、テストを足す          | executor | done | -    |

## 4. 対応結果

### 4.1. 実施内容

- 成果物 schema に `requirement` と `glossary` を追加した。分類の enum は成果物 schema の `$defs.deliverableType` に集約し、rulebook schema の必須項目 `deliverable_type` から参照する。`template` と互換用の `sample` は成果物側のみ許可する。
- rulebook 107 件すべてに宣言を追加した。Markdown 対象 rulebook の本文にある成果物 type の表・記述例も宣言値へそろえた。YAML 対象 rulebook の本文・データ・表示用ページは PJR-0D0T の範囲として維持した。
- Markdown sample 50 件の Frontmatter を宣言へ移行した。既存のプロダクト成果物・プロジェクト成果物と Markdown テンプレートの `frontmatter_template` は既に宣言と一致し、type の書き換えは不要だった。
- `lint:fm` が使う frontmatter plugin に照合処理を追加した。schema のパスにマッチしないテンプレートにも適用する。宣言不一致は宣言された値と置き換え先を示す。宣言欠落、参照先不明、曖昧な ID もエラーにする。
- [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] と [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]] に分類の意味・宣言方法・検査を追記し、CHANGELOG の Unreleased に移行手順を記載した。
- 単体テストに宣言必須、新しい値、不一致の置き換え先、sample、テンプレートの生成物 type、`rulebook: none`、表示用ページ除外、ID 解決・曖昧さ・同梱 fallback・ローカル優先、recipe 除外、`includes` 非遡及を追加した。実行は指定された親 runner の検証に委ねる。

### 4.2. 設計判断と申し送り

- フィールド名は提案どおり `deliverable_type` とした。rulebook 自身の `type: rulebook` と、扱う成果物の分類を区別できるためである。
- index は内容で分類する。`sf-index`・`bes-index`・`nfr-index` は `requirement`、テスト系 index は `test`、構成・システム設計・技術スタックの index は `architecture`、運用系 index は `operations`。カタログやタイムラインは管理文書なので `project` とした。
- `prj-success-criteria-and-acceptance-criteria` はプロジェクトの成功・受入の管理基準なので `project` とし、製品の受入基準を定義する BAC/SAC の `requirement` と区別した。
- 影響調査 5 系統は仕様本文を各専門成果物へ委譲し、変更要否・影響度・対応方針を判断する管理報告なので `project`。トレーサビリティ 2 系統も型付き参照から派生する管理ビューなので `project` とした。
- 移行全体の合意・範囲・体制を扱う MIP は `project`、DMD はデータの抽出・変換・検証を定義する `data`、COP/OTP は `operations`、MTP/NTP は `test` とした。概念クラス図 CCD は構成図ではなくデータモデルなので `data`。非推奨 CSTD も後継 STSD と同じ `data` とした。
- 主 rulebook の宣言のみを正本とし、`includes` はたどらない。テンプレート自身の `type: template` は比較せず、`frontmatter_template.specdojo` の type と rulebook を比較する。recipe 等の専用種別は成果物照合から除外する。
- 完全 ID でローカル rulebook を解決し、未導入分を同梱 rulebook から補う。同じ完全 ID はローカルを優先し、未修飾 ID は一意なときだけ許可する。宣言の欠落・参照の不明や曖昧さを黙ってスキップしない。
- YAML データと `generated/` 配下の YAML 表示用ページは本照合の対象外。表示用ページは `yaml-pages` の生成マーカーも確認して除外し、それ以外の生成 Markdown は照合する。PJR-0D0T では宣言に従い YAML の type と表示用ページをそろえる。BDD 等の YAML 本文に残る旧 type の記述も同項目で追従する。
- 参照した skill の旧 `docs-contents-guide` は、`supersedes` を宣言している [[specdojo:deliverables-reference|成果物リファレンス]] に置き換えて確認した。類似 rulebook と sample は各系統の既存文書を用いた。
- 親 runner 指定の 7 検査は sandbox 内では実行しない。実際の成否は親 runner が evidence/result へ追記する。result は reporter/runner が記入し、個票のステータスと登録簿一覧は変更していない。

### 4.3. 割り当て一覧（107 件）

以下は今回の判断の記録であり、今後の照合の正本は各 rulebook の宣言とする。

| rulebook                                                                                                                  | type           | 理由                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [[specdojo:atc-index-rulebook\|atc-index-rulebook]]                                                                       | `test`         | 検証の方針・ケース・実施計画を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする                   |
| [[specdojo:atc-rulebook\|atc-rulebook]]                                                                                   | `test`         | 検証の方針・ケース・実施計画を定義するため                                                                                                  |
| [[specdojo:bac-rulebook\|bac-rulebook]]                                                                                   | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため                                                                                |
| [[specdojo:bdd-rulebook\|bdd-rulebook]]                                                                                   | `data`         | 概念モデル・データの構造や状態・保管・変換を定義するため                                                                                    |
| [[specdojo:bds-rulebook\|bds-rulebook]]                                                                                   | `ui`           | 画面または帳票の利用者向け仕様を定義するため                                                                                                |
| [[specdojo:bes-index-rulebook\|bes-index-rulebook]]                                                                       | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする |
| [[specdojo:bes-rulebook\|bes-rulebook]]                                                                                   | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため                                                                                |
| [[specdojo:bps-rulebook\|bps-rulebook]]                                                                                   | `flow`         | 業務プロセスと情報の流れを定義するため                                                                                                      |
| [[specdojo:br-rulebook\|br-rulebook]]                                                                                     | `rule`         | 業務の判断条件・規則を定義するため                                                                                                          |
| [[specdojo:ccd-mermaid-rulebook\|ccd-mermaid-rulebook]]                                                                   | `data`         | 業務概念とデータの関係を表す概念モデルであり、システム構成図ではないため。includes の記法部品も主 rulebook と同じ成果物を扱う               |
| [[specdojo:cdfd-mermaid-rulebook\|cdfd-mermaid-rulebook]]                                                                 | `flow`         | 業務プロセスと情報の流れを定義するため。includes の記法部品も主 rulebook と同じ成果物を扱う                                                 |
| [[specdojo:cdfd-overview-rulebook\|cdfd-overview-rulebook]]                                                               | `flow`         | 業務プロセスと情報の流れを定義するため                                                                                                      |
| [[specdojo:cdfd-rulebook\|cdfd-rulebook]]                                                                                 | `flow`         | 業務プロセスと情報の流れを定義するため                                                                                                      |
| [[specdojo:cdfd-uc-rulebook\|cdfd-uc-rulebook]]                                                                           | `flow`         | 業務プロセスと情報の流れを定義するため                                                                                                      |
| [[specdojo:cdsd-rulebook\|cdsd-rulebook]]                                                                                 | `data`         | 概念モデル・データの構造や状態・保管・変換を定義するため                                                                                    |
| [[specdojo:cld-rulebook\|cld-rulebook]]                                                                                   | `data`         | 概念モデル・データの構造や状態・保管・変換を定義するため                                                                                    |
| [[specdojo:cnd-mermaid-rulebook\|cnd-mermaid-rulebook]]                                                                   | `architecture` | システム構成・設計・技術選定を定義するため。includes の記法部品も主 rulebook と同じ成果物を扱う                                             |
| [[specdojo:cnd-rulebook\|cnd-rulebook]]                                                                                   | `architecture` | システム構成・設計・技術選定を定義するため                                                                                                  |
| [[specdojo:cop-index-rulebook\|cop-index-rulebook]]                                                                       | `operations`   | 運用・本番切替・引継ぎの設計や手順を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする             |
| [[specdojo:cop-rulebook\|cop-rulebook]]                                                                                   | `operations`   | 運用・本番切替・引継ぎの設計や手順を定義するため                                                                                            |
| [[specdojo:cpd-mermaid-rulebook\|cpd-mermaid-rulebook]]                                                                   | `architecture` | システム構成・設計・技術選定を定義するため。includes の記法部品も主 rulebook と同じ成果物を扱う                                             |
| [[specdojo:cpd-rulebook\|cpd-rulebook]]                                                                                   | `architecture` | システム構成・設計・技術選定を定義するため                                                                                                  |
| [[specdojo:cstd-rulebook\|cstd-rulebook]]                                                                                 | `data`         | 非推奨文書だが後継 STSD と同じ状態モデルを扱うため                                                                                          |
| [[specdojo:cxd-mermaid-rulebook\|cxd-mermaid-rulebook]]                                                                   | `architecture` | システム構成・設計・技術選定を定義するため。includes の記法部品も主 rulebook と同じ成果物を扱う                                             |
| [[specdojo:cxd-rulebook\|cxd-rulebook]]                                                                                   | `architecture` | システム構成・設計・技術選定を定義するため                                                                                                  |
| [[specdojo:dct-index-rulebook\|dct-index-rulebook]]                                                                       | `project`      | プロジェクトの計画・体制・管理記録を扱うため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする                 |
| [[specdojo:dct-rulebook\|dct-rulebook]]                                                                                   | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:dec-rulebook\|dec-rulebook]]                                                                                   | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:dmd-index-rulebook\|dmd-index-rulebook]]                                                                       | `data`         | 移行データの抽出・変換・冪等性・検証の共通設計であり、データ仕様の索引であるため                                                            |
| [[specdojo:dmd-rulebook\|dmd-rulebook]]                                                                                   | `data`         | データ単位のマッピング・変換・検証を定義するため                                                                                            |
| [[specdojo:etc-index-rulebook\|etc-index-rulebook]]                                                                       | `test`         | 検証の方針・ケース・実施計画を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする                   |
| [[specdojo:etc-rulebook\|etc-rulebook]]                                                                                   | `test`         | 検証の方針・ケース・実施計画を定義するため                                                                                                  |
| [[specdojo:gl-rulebook\|gl-rulebook]]                                                                                     | `glossary`     | 用語と定義の正本を管理するため                                                                                                              |
| [[specdojo:ifd-mermaid-rulebook\|ifd-mermaid-rulebook]]                                                                   | `architecture` | システム構成・設計・技術選定を定義するため。includes の記法部品も主 rulebook と同じ成果物を扱う                                             |
| [[specdojo:ifx-api-rulebook\|ifx-api-rulebook]]                                                                           | `api`          | 方式を問わず外部 I/F の契約を定義するため                                                                                                   |
| [[specdojo:ifx-cmd-rulebook\|ifx-cmd-rulebook]]                                                                           | `api`          | 方式を問わず外部 I/F の契約を定義するため                                                                                                   |
| [[specdojo:ifx-file-rulebook\|ifx-file-rulebook]]                                                                         | `api`          | 方式を問わず外部 I/F の契約を定義するため                                                                                                   |
| [[specdojo:ifx-index-rulebook\|ifx-index-rulebook]]                                                                       | `api`          | 方式を問わず外部 I/F の契約を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする                    |
| [[specdojo:ifx-msg-rulebook\|ifx-msg-rulebook]]                                                                           | `api`          | 方式を問わず外部 I/F の契約を定義するため                                                                                                   |
| [[specdojo:imp-business-rulebook\|imp-business-rulebook]]                                                                 | `project`      | 変更要求の影響度・変更要否・対応方針を判断する管理報告であり、仕様本文は各専門成果物へ委譲するため                                          |
| [[specdojo:imp-data-rulebook\|imp-data-rulebook]]                                                                         | `project`      | 変更要求の影響度・変更要否・対応方針を判断する管理報告であり、仕様本文は各専門成果物へ委譲するため                                          |
| [[specdojo:imp-interface-rulebook\|imp-interface-rulebook]]                                                               | `project`      | 変更要求の影響度・変更要否・対応方針を判断する管理報告であり、仕様本文は各専門成果物へ委譲するため                                          |
| [[specdojo:imp-operations-rulebook\|imp-operations-rulebook]]                                                             | `project`      | 変更要求の影響度・変更要否・対応方針を判断する管理報告であり、仕様本文は各専門成果物へ委譲するため                                          |
| [[specdojo:imp-test-rulebook\|imp-test-rulebook]]                                                                         | `project`      | 変更要求の影響度・変更要否・対応方針を判断する管理報告であり、仕様本文は各専門成果物へ委譲するため                                          |
| [[specdojo:itc-index-rulebook\|itc-index-rulebook]]                                                                       | `test`         | 検証の方針・ケース・実施計画を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする                   |
| [[specdojo:itc-rulebook\|itc-rulebook]]                                                                                   | `test`         | 検証の方針・ケース・実施計画を定義するため                                                                                                  |
| [[specdojo:mip-index-rulebook\|mip-index-rulebook]]                                                                       | `project`      | 移行全体の範囲・体制・成功条件を合意する管理計画。実行手順は cop/otp に分離するため                                                         |
| [[specdojo:mm-rulebook\|mm-rulebook]]                                                                                     | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:mtp-rulebook\|mtp-rulebook]]                                                                                   | `test`         | 検証の方針・ケース・実施計画を定義するため                                                                                                  |
| [[specdojo:nfr-availability-rulebook\|nfr-availability-rulebook]]                                                         | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため                                                                                |
| [[specdojo:nfr-index-rulebook\|nfr-index-rulebook]]                                                                       | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする |
| [[specdojo:nfr-integrity-rulebook\|nfr-integrity-rulebook]]                                                               | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため                                                                                |
| [[specdojo:nfr-maintainability-rulebook\|nfr-maintainability-rulebook]]                                                   | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため                                                                                |
| [[specdojo:nfr-operations-rulebook\|nfr-operations-rulebook]]                                                             | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため                                                                                |
| [[specdojo:nfr-performance-rulebook\|nfr-performance-rulebook]]                                                           | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため                                                                                |
| [[specdojo:nfr-reliability-rulebook\|nfr-reliability-rulebook]]                                                           | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため                                                                                |
| [[specdojo:nfr-security-safety-rulebook\|nfr-security-safety-rulebook]]                                                   | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため                                                                                |
| [[specdojo:nfr-usability-rulebook\|nfr-usability-rulebook]]                                                               | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため                                                                                |
| [[specdojo:ntp-rulebook\|ntp-rulebook]]                                                                                   | `test`         | 検証の方針・ケース・実施計画を定義するため                                                                                                  |
| [[specdojo:opd-index-rulebook\|opd-index-rulebook]]                                                                       | `operations`   | 運用・本番切替・引継ぎの設計や手順を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする             |
| [[specdojo:opd-rulebook\|opd-rulebook]]                                                                                   | `operations`   | 運用・本番切替・引継ぎの設計や手順を定義するため                                                                                            |
| [[specdojo:opr-index-rulebook\|opr-index-rulebook]]                                                                       | `operations`   | 運用・本番切替・引継ぎの設計や手順を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする             |
| [[specdojo:opr-rulebook\|opr-rulebook]]                                                                                   | `operations`   | 運用・本番切替・引継ぎの設計や手順を定義するため                                                                                            |
| [[specdojo:otp-index-rulebook\|otp-index-rulebook]]                                                                       | `operations`   | 運用・本番切替・引継ぎの設計や手順を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする             |
| [[specdojo:otp-rulebook\|otp-rulebook]]                                                                                   | `operations`   | 運用・本番切替・引継ぎの設計や手順を定義するため                                                                                            |
| [[specdojo:pjr-rulebook\|pjr-rulebook]]                                                                                   | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:pm-change-request-log-rulebook\|pm-change-request-log-rulebook]]                                               | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:pm-communication-plan-rulebook\|pm-communication-plan-rulebook]]                                               | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:pm-issue-log-rulebook\|pm-issue-log-rulebook]]                                                                 | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:pm-members-rulebook\|pm-members-rulebook]]                                                                     | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:pm-organization-rulebook\|pm-organization-rulebook]]                                                           | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:pm-plan-rulebook\|pm-plan-rulebook]]                                                                           | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:pm-quality-management-plan-rulebook\|pm-quality-management-plan-rulebook]]                                     | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:pm-raci-rulebook\|pm-raci-rulebook]]                                                                           | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:pm-risk-register-rulebook\|pm-risk-register-rulebook]]                                                         | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:pm-roles-rulebook\|pm-roles-rulebook]]                                                                         | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:pr-rulebook\|pr-rulebook]]                                                                                     | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:prj-assumptions-constraints-dependencies-rulebook\|prj-assumptions-constraints-dependencies-rulebook]]         | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:prj-charter-rulebook\|prj-charter-rulebook]]                                                                   | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:prj-comparison-of-alternatives-rulebook\|prj-comparison-of-alternatives-rulebook]]                             | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:prj-issues-and-approach-rulebook\|prj-issues-and-approach-rulebook]]                                           | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:prj-overview-rulebook\|prj-overview-rulebook]]                                                                 | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:prj-scope-rulebook\|prj-scope-rulebook]]                                                                       | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:prj-stakeholder-register-rulebook\|prj-stakeholder-register-rulebook]]                                         | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:prj-success-criteria-and-acceptance-criteria-rulebook\|prj-success-criteria-and-acceptance-criteria-rulebook]] | `project`      | プロジェクトの成功と受入の管理基準であり、製品の受入要件 bac/sac とは責務が異なるため                                                       |
| [[specdojo:sac-rulebook\|sac-rulebook]]                                                                                   | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため                                                                                |
| [[specdojo:sch-rulebook\|sch-rulebook]]                                                                                   | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:sf-index-rulebook\|sf-index-rulebook]]                                                                         | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする |
| [[specdojo:sf-rulebook\|sf-rulebook]]                                                                                     | `requirement`  | 機能・非機能要件、業務イベントの要求、受入条件を定義するため                                                                                |
| [[specdojo:sld-rulebook\|sld-rulebook]]                                                                                   | `data`         | 概念モデル・データの構造や状態・保管・変換を定義するため                                                                                    |
| [[specdojo:stc-index-rulebook\|stc-index-rulebook]]                                                                       | `test`         | 検証の方針・ケース・実施計画を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする                   |
| [[specdojo:stc-rulebook\|stc-rulebook]]                                                                                   | `test`         | 検証の方針・ケース・実施計画を定義するため                                                                                                  |
| [[specdojo:stsd-mermaid-rulebook\|stsd-mermaid-rulebook]]                                                                 | `data`         | 概念モデル・データの構造や状態・保管・変換を定義するため。includes の記法部品も主 rulebook と同じ成果物を扱う                               |
| [[specdojo:stsd-rulebook\|stsd-rulebook]]                                                                                 | `data`         | 概念モデル・データの構造や状態・保管・変換を定義するため                                                                                    |
| [[specdojo:sysd-critical-flows-rulebook\|sysd-critical-flows-rulebook]]                                                   | `architecture` | システム構成・設計・技術選定を定義するため                                                                                                  |
| [[specdojo:sysd-cross-cutting-policy-rulebook\|sysd-cross-cutting-policy-rulebook]]                                       | `architecture` | システム構成・設計・技術選定を定義するため                                                                                                  |
| [[specdojo:sysd-index-rulebook\|sysd-index-rulebook]]                                                                     | `architecture` | システム構成・設計・技術選定を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする                   |
| [[specdojo:sysd-rulebook\|sysd-rulebook]]                                                                                 | `architecture` | システム構成・設計・技術選定を定義するため                                                                                                  |
| [[specdojo:tml-rulebook\|tml-rulebook]]                                                                                   | `project`      | プロジェクトの計画・体制・管理記録を扱うため                                                                                                |
| [[specdojo:trc-requirements-to-specs-rulebook\|trc-requirements-to-specs-rulebook]]                                       | `project`      | 型付き参照から派生する任意の管理ビューであり、要求本文やテスト仕様の正本ではないため                                                        |
| [[specdojo:trc-requirements-to-tests-rulebook\|trc-requirements-to-tests-rulebook]]                                       | `project`      | 型付き参照から派生する任意の管理ビューであり、要求本文やテスト仕様の正本ではないため                                                        |
| [[specdojo:tsd-index-rulebook\|tsd-index-rulebook]]                                                                       | `architecture` | システム構成・設計・技術選定を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする                   |
| [[specdojo:tsd-rulebook\|tsd-rulebook]]                                                                                   | `architecture` | システム構成・設計・技術選定を定義するため                                                                                                  |
| [[specdojo:tsp-index-rulebook\|tsp-index-rulebook]]                                                                       | `test`         | 検証の方針・ケース・実施計画を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする                   |
| [[specdojo:uis-rulebook\|uis-rulebook]]                                                                                   | `ui`           | 画面または帳票の利用者向け仕様を定義するため                                                                                                |
| [[specdojo:utc-index-rulebook\|utc-index-rulebook]]                                                                       | `test`         | 検証の方針・ケース・実施計画を定義するため。index は管理用という名前だけで project にせず、収録する成果物と同じ分類とする                   |
| [[specdojo:utc-rulebook\|utc-rulebook]]                                                                                   | `test`         | 検証の方針・ケース・実施計画を定義するため                                                                                                  |

### 4.4. 検証

- 変更対象 166 件を Prettier で整形し、追加した照合処理と変更した frontmatter plugin の `node --check` が通った。
- hook と同じ `node --import tsx tools/catalog-validate-if-configured.mjs` は終了コード 0。未作成成果物に対する既存の `based_on` 検証警告は残るが、検証エラーはない。
- `node --import tsx src/specdojo.ts register build` は終了コード 0 で登録簿の派生ビューを生成した。登録簿一覧の正本と状態項目は編集していない。
- `git diff --check` はエラーなし。
- rulebook 宣言は 107 件（`project`: 34、`requirement`: 15、`glossary`: 1、`flow`: 5、`rule`: 1、`data`: 10、`ui`: 2、`api`: 5、`architecture`: 13、`test`: 13、`operations`: 8）。
- 検証結果は executor evidence と親 runner の追記を参照する。親検証の 7 件（型・TS/Markdown/Frontmatter lint・schema・単体・結合）は指定に従って親 runner が実行する。

## 5. 関連ドキュメント

- [[specdojo:document-metadata-standard]]
- [[specdojo:rulebook-authoring-standard]]
