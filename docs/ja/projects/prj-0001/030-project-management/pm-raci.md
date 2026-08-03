---
specdojo:
  id: prj-0001:pm-raci
  type: project
  status: ready
  rulebook: specdojo:pm-raci-rulebook
  based_on:
    - specdojo:people-and-organization-definition-standard
    - prj-0001:pm-organization
---

# RACI

## 1. 適用方針

初期公開と代表試行に必要な責任境界を示す。列は [[prj-0001:pm-roles|ロール定義]] の Role code を用い、各行の `A` は1ロールとする。AI Agent は `R` または `C` の作業を支援できるが、`A` は担わない。

| 記号 | 意味                     |
| ---- | ------------------------ |
| R    | 実作業を担当する         |
| A    | 最終承認または判断を行う |
| C    | 事前に相談・レビューする |
| I    | 結果の共有を受ける       |

## 2. 成果物別 RACI

同じ責任分担の成果物は、Schedule で個別管理したまま本表ではまとめる。

| 成果物                                                        | PO  | PM  | BA  | ARC | DEV | QE  | UX  | OPS |
| ------------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| 概要、スコープ、ステークホルダー、成功基準、課題とアプローチ  | A   | C   | R   | C   | I   | C   | C   | I   |
| プロジェクト憲章                                              | A/R | C   | C   | I   | I   | C   | I   | I   |
| 前提・制約・依存、代替案比較                                  | A   | C   | C   | R   | I   | C   | C   | I   |
| 組織、ロール、メンバー                                        | A   | R   | C   | C   | I   | C   | I   | I   |
| RACI、管理計画、コミュニケーション計画、Launch Track Strategy | C   | A/R | C   | C   | I   | C   | I   | C   |
| 品質管理計画                                                  | A   | C   | C   | C   | I   | R   | C   | I   |
| Schedule defaults                                             | A   | C   | I   | R   | I   | C   | I   | I   |
| 登録簿の管理ビュー、Schedule                                  | C   | A/R | C   | C   | C   | C   | C   | C   |
| 成果物カタログ                                                | C   | C   | C   | A/R | I   | C   | I   | I   |

## 3. 判断・プロセス別 RACI

| 判断・プロセス                     | PO  | PM  | BA  | ARC | DEV | QE  | UX  | OPS |
| ---------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| 社会課題、期待価値、優先順位の判断 | A   | R   | C   | C   | I   | C   | C   | I   |
| 代表課題・試行成果の設計           | A   | C   | R   | C   | C   | C   | C   | I   |
| 費用・参加時間上限の判断           | A   | R   | C   | C   | I   | C   | I   | I   |
| 作業順序、進捗、課題・リスク管理   | C   | A/R | C   | C   | C   | C   | C   | C   |
| 成果物作成                         | C   | A   | R   | R   | R   | C   | R   | C   |
| 成果物・品質ゲートの確認           | C   | C   | C   | C   | C   | A/R | C   | I   |
| 変更要求の採否、初期公開、継続判断 | A   | R   | C   | C   | I   | C   | C   | C   |

## 4. Schedule・実行主体との対応

- Schedule の `owner` は、成果物または作業を主導する `R` の Role code と一致させる。
- 初期 Launch Track で使う `owner` は `PO`、`PM`、`BA`、`ARC`、`QE` であり、本表の責任分担と整合させる。
- 実行主体と兼務は [[prj-0001:pm-members|メンバー定義]] で管理し、本書へ個人名や agent 名を記載しない。
- 同じ実行主体が `A` と `R` を兼ねる場合も、判断と作業の証跡を分ける。
- 生成される登録簿ビューや Schedule は直接編集せず、正本の登録簿または戦略・設定を更新する。

## 5. 見直し条件

採用 Role code、成果物区分、Schedule の owner、主要判断、参加者、兼務の継続可能性が変わった場合に見直す。特に、実装・体験・公開運用が増えた場合は `DEV`、`UX`、`OPS` の専任化と責任分離を確認する。
