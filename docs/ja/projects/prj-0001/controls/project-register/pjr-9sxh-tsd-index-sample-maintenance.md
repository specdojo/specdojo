---
specdojo:
  id: prj-0001:pjr-9sxh-tsd-index-sample-maintenance
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-10-27T12:39:20Z"
  approach: sample-maintenance
  targets:
    - specdojo:tsd-index-sample
---

# PJR-9SXH tsd-index-sample を新しい tsd-index-rulebook に合わせて見直す

## 1. 概要

tsd-index-sample を、見直した tsd-index-rulebook の技術スタック一覧の列（区分、採用技術、担当責務、版・正本、適用範囲）と参照の要件に合わせて見直す。

## 2. 完了条件

1. `docs/ja/specdojo/samples/tsd-index-sample.md` が [[specdojo:tsd-index-rulebook]] の本文要件（冒頭の概要、技術スタック一覧、補足・詳細への導線）と、技術スタック一覧の列の要件（区分・採用技術・担当責務は必須、版・正本と適用範囲は条件付き）を満たす。
2. 実行基盤だけでなく、開発・検証・文書化・運用の技術を対象範囲に応じて含め、採用済みの必須構成と任意利用の構成を区別する。依存パッケージを網羅的に列挙しない。
3. 版の粒度を揃え、正確な版を管理する正本（lockfile など）を示す。
4. 技術構成が [[specdojo:sample-authoring-standard]] の `共通サンプル文脈`（駄菓子屋きぬやの販売管理）の規模に合うかを見直す。構成を変えた場合は、理由を本個票の対応結果に書く。
5. 補足から参照する詳細 TSD のうち 1 つを、`specdojo:tsd-sample`（PJR-EVAE）の題材として決める。題材とした詳細 TSD の名前と選んだ理由を本個票の対応結果に書く。
6. H1 を rulebook の名称に合わせ、「技術スタック一覧（TSD Index）サンプル」とする。
7. [[specdojo:sample-authoring-standard]] に従う。`tsd-sample.md` は変更しない。
8. `npm run lint:md`・`npm run lint:fm` と、親の検証が通る。
9. `CHANGELOG.md` の未公開の版の節に変更を書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ                                                                                   |
| --- | ----------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------- |
| 1   | rulebook の要件と現行 sample の差分を洗い出す   | ARC  | done | 区分・採用技術・担当責務・版・正本・適用範囲の列と概要・補足要件を確認                 |
| 2   | 一覧と補足を書き直し、tsd-sample の題材を決める | ARC  | done | 題材を「データベース詳細定義（PostgreSQL）」に決定し、実在する sample へのリンクを整備 |
| 3   | 検査を流し、対応結果を記録する                  | ARC  | done | lint:md, lint:fm 等の静的検査の通過を確認                                              |

## 4. 対応結果

`docs/ja/specdojo/samples/tsd-index-sample.md` を見直した `tsd-index-rulebook.md` および `sample-authoring-standard.md` に適合するよう改訂した。

- **構成と本文要件の整備**:
  - H1 を「技術スタック一覧（TSD Index）サンプル」に修正し、冒頭に駄菓子屋きぬや販売管理システムの構築・運用における対象範囲と目的を示す概要（2文）を追加した。
  - 主一覧表を「区分」「採用技術」「担当責務」「版・正本」「適用範囲」の5列構成へ刷新した。
  - 実行基盤（TypeScript, Node.js, Next.js, PostgreSQL, Prisma, Fly.io）に加え、開発・検証（GitHub, GitHub Actions, Vitest, Prettier, ESLint）、文書化（Mermaid）、運用監視（Sentry）を対象範囲として追加し、必須構成と任意利用の構成を明示した。
  - 版の粒度をメジャーバージョン（`x.x`）に統一し、正確な版を管理する正本（`package.json`、`package-lock.json`、`Dockerfile`、`fly.toml` など）を記載した。
- **技術構成の文脈適合と構成変更の理由（完了条件 4）**:
  - 駄菓子屋きぬやの文脈（店頭タブレット1台での店頭販売・在庫・つけ管理）に照らし、端末の故障・紛失時のデータ保全のためクラウド上の PostgreSQL による永続化と Next.js + Fly.io の基本構成を維持しつつ、小規模店舗の個人開発に適した最小限のツール群に絞り込んだ。
  - rulebook の網羅範囲要件に従い、コード品質を保つ ESLint（任意）、設計図解の Mermaid（任意）、店頭端末障害検知用の Sentry（任意）を追記した。
- **tsd-sample の題材決定と選定理由（完了条件 5）**:
  - `specdojo:tsd-sample`（PJR-EVAE）の題材を「データベース詳細定義（PostgreSQL）」と決定した。
  - 選定理由: 駄菓子屋きぬや販売管理システムにおいて販売履歴・在庫データ・つけ残高を確実に保全する最重要基盤であり、環境設定、接続認証、Prisma 連携、バックアップ手順、バージョン固定など TSD 詳細定義ルールブックの要求項目を過不足なく実演する題材として最も適しているため。
- **補足・詳細への導線と finding の解消（F001, F002, F003）**:
  - 実在する詳細 TSD サンプルへのリンク `[[specdojo:tsd-sample|データベース詳細定義（TSD）サンプル]]` を整備し、未作成の詳細文書はバッククォートで仮置きした。これにより、リンク欠落およびデッドリンクの finding を解消した。

## 5. 関連ドキュメント

- [[specdojo:tsd-index-rulebook]]
- [[specdojo:sample-authoring-standard]]
- [[prj-0001:pjr-evae-tsd-sample-maintenance]]
- [[prj-0001:pjr-xsm8-sample-maintenance-target-kind]]
