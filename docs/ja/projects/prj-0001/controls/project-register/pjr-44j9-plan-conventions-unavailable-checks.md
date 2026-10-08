---
specdojo:
  id: prj-0001:pjr-44j9-plan-conventions-unavailable-checks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-08T14:21:59Z"
  due_on: null
---

# PJR-44J9 exec plan の共通規約が、新しい利用者の環境で実行できない検査を求める

## 1. 課題内容

公開物での実地の確認（2026-10-08）で、init で作った新しいリポジトリで exec run を流すと、作業は済んだのに executor の検証の失敗で waiting になった。共通規約（xep-common-conventions-template.md）が、Markdown の変更に npx markdownlint（SpecDojo の依存ではない）を、docs/ja/projects/ 配下の変更に specdojo catalog validate（catalog_path がないと実行できない）を一律に求めるため。

## 2. 影響範囲

| 観点         | 影響                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | 全 exec plan に入る共通規約（`docs/ja/specdojo/exec-templates/xep-common-conventions-template.md`）の検査の表と、その生成 |
| スケジュール | v0.3.0 の公開を止める（判定基準 3）                                                                                       |
| コスト       | 新しい利用者の最初の exec が必ず waiting になる                                                                           |
| 品質         | 作業が済んでいても、実行できない検査の失敗で止まる                                                                        |
| 関係者       | カタログや markdownlint を導入していない利用者                                                                            |

## 3. 対応方針

| 項目     | 内容                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| 原因     | 共通規約の検査の表が、SpecDojo 本体の開発環境（markdownlint の導入、成果物カタログの設定）を前提にしている |
| 対応策   | 下記の「完了条件の詳細」のとおり、検査を実行できる場合に限る                                               |
| 依存事項 | PJR-BK4K（`requires_human`）、PJR-6QDA（選択式の init）                                                    |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                           |

### 3.1. 完了条件の詳細

- 共通規約の検査の表で、利用者の環境によって実行できない検査に適用の条件を付ける。少なくとも次を扱う。
  - `npx markdownlint`: リポジトリに markdownlint（または `markdownlint-cli2`）が導入されている場合だけ実行する。導入されていない場合は実行せず、validations にも書かない。
  - `specdojo catalog validate`: project に `catalog_path` が設定されている場合だけ実行する。
  - そのほか、表の中で SpecDojo 本体の開発環境を前提にしている検査があれば、同じく条件を付ける。
- 条件に当たらず実行しない検査は、validations に `not_run` として書かない（書くと runner が block するため）。条件の判断に迷う場合の扱いも規約に書く。
- SpecDojo 本体のリポジトリでは、これまでどおりすべての検査が実行される（markdownlint もカタログもあるため）。
- plan の生成が共通規約を埋め込む箇所に条件の判断の材料（例: `catalog_path` の有無）が要る場合は、plan の生成で渡す。
- unit test で、カタログのない project の plan に `catalog validate` の指示が入らないこと（または条件付きで入ること）を確かめる。
- `npm run check` が通る。

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]（公開の判定基準）
- [[prj-0001:pjr-6qda-interactive-init]]（選択式の init）
