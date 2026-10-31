---
specdojo:
  id: prj-0001:pjr-6a2b-context-draft-guides
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-10-28T22:23:23Z"
  derived_from:
    - PJR-65DS
  depends_on:
    - PJR-JRSY
    - PJR-6DD7
    - PJR-YKMA
    - PJR-E45K
    - PJR-S23T
    - PJR-YKYK
---

# PJR-6A2B 文脈を渡して成果物を作る流れをガイドにまとめる

## 1. 概要

scaffold・文脈の記入・draft・fully-guided・finalize の流れと、_CONTEXT_・--input・brief の使い分けを関連ガイドと tsd-recipe に書く

## 2. 完了条件

- exec-operation-guide に、register 経由で雛形・文脈の記入・`draft`・`fully-guided`・`finalize` を個票に分け、`depends_on` でつないで流す手順を書く。
- ryu-guide に、`draft` と `fully-guided` の使い分けと、文脈の置き場所（成果物内の `_CONTEXT_`、個票の `入力`、カタログの `brief`）の使い分けを書く。
- `tsd-recipe` の「作成前に集める情報」を、集めた答えを `_CONTEXT_`・`--input`・`brief` のどこに書くかが分かる形に直す。
- tsd を「静的サイトで主流の技術スタックで書く」と指示して作る例を、いずれかのガイドに載せる。
- exec-operation-guide の「文脈を渡して段階的に作成する手順」の例を、今の CLI で動く形に直す。雛形の作成は `deliverable scaffold --target <doc-id>` とし、カタログにない成果物では `--target-path` と `--target-rulebook` を添える形も示す（PJR-S23T）。template のない rulebook の雛形の `type` が rulebook の `deliverable_type` になることも書く（PJR-YKYK）。
- 例の成果物の ID は、`specdojo:` ではなく project で修飾した ID（例: `prj-0001:tsd-frontend-site`）にする。
- 例の finalize の個票の `--owner` は、人の nickname ではなく pm-roles の役割（例: `PO`）にする。
- ryu-guide と tsd-recipe に雛形の作成の手順がある場合も、同じ形にそろえる。
- 変更した文書で `npm run lint:md` と `npm run lint:fm` が通る。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と `handoff` に書く。

## 3. 作業内容

| No  | 作業                                         | 担当     | 状態 | メモ                                        |
| --- | -------------------------------------------- | -------- | ---- | ------------------------------------------- |
| 1   | exec-operation-guide と ryu-guide を更新する | executor | done | 段階的手順、使い分け、文脈の置き場所を明記  |
| 2   | tsd-recipe を更新し、例を載せる              | executor | done | 集める情報の置き場所と静的サイトTSD例を掲載 |

## 4. 対応結果

- [[specdojo:exec-operation-guide|exec運用ガイド]] に第 4.7 節「文脈を渡して段階的に作成する手順」を追加した。`deliverable scaffold`（雛形作成）→ 文脈記入 → `draft`（下書き）→ `fully-guided`（磨き込み）→ `finalize`（確定）の 5 段階の役割分担を整理し、各段階を個票（`todo`）に分けて `depends_on` で依存関係をつないで順に実行・統合する手順を記載した。
- `exec-operation-guide` の雛形作成コマンドを現在の CLI 仕様に合わせ、`deliverable scaffold --target <doc-id>`（カタログ外成果物は `--target-path` と `--target-rulebook` を併用、PJR-S23T）に更新した。また、template のない rulebook であっても最小構成の雛形が生成され、frontmatter の `type` が rulebook の `deliverable_type` になる仕様（PJR-YKYK）を明記した。
- ガイド内の成果物 ID の例をすべて project 修飾 ID（`prj-0001:tsd-frontend-site`）に統一し、確定（finalize）の個票の `--owner` を個人のニックネームではなく pm-roles の役割（`PO`）に修正した。
- [[specdojo:ryu-guide|実践の進め方ガイド]] に、`draft`（任された範囲の外部調査・選定・下書き、根拠のない具体化の禁止の例外、提案表示、`_CONTEXT_:` 反映・削除・result転記）と `fully-guided`（既存草案の磨き込み専用、外部探索・独自選定なし、未反映 `_CONTEXT_:` の論点化、template 不参照）の使い分け対比表を追加した。あわせて文脈の置き場所 3 種（成果物内の `_CONTEXT_:`, 個票の `入力` / `--input`, カタログの `brief`）の特徴・適した用途・ライフサイクルの使い分けを明記した。また、雛形作成の手順とコマンド例（カタログ外の `--target-path` / `--target-rulebook` 含む）を同じ形にそろえた。
- [[specdojo:tsd-recipe|TSD作成レシピ]] の「2. 作成前に集める情報」の表に「主な文脈の置き場所」列を追加し、集めた答えを `brief`・`--input`・`_CONTEXT_:` のどこに書くかの対応を明示した。あわせて文脈の置き場所の使い分け目安を追記し、雛形作成の手順（`specdojo deliverable scaffold --project <project-id> --target <project-id>:tsd-<term>`）もそろえた。
- tsd を「静的サイトで主流の技術スタックで書く」と指示して作る例を、`exec-operation-guide`（register 経由で個票を分けて流す一連の手順・コマンド例）および `ryu-guide`（カタログの `brief`、個票の `--input`、成果物内の `_CONTEXT_:` で渡す各パターンの記述例）に掲載した。
- 設計判断: `draft` は文脈で任された範囲の技術調査・選定と初期下書きを担い、選定値は「提案」として出典・理由とともに result に記録する。`fully-guided` は磨き込み専用とし、外部調査や根拠のない具体化を行わず、型（rulebook / recipe / sample）への適合・構造整理に専念させることで、PJR-65DS および PJR-3MY5 で合意された責務分離をガイド上で明確にした。
- 設計判断: 文脈の置き場所について、プロジェクト・成果物群全体で継続する前提はカタログの `brief`、対話で得た単発の前提や調査委任は個票の `入力`（`--input`）、成果物の各章の具体的な記述に対する局所的な指示は `_CONTEXT_:` とし、粒度と持続性に応じた選択基準を各ガイド・レシピで統一した。
- 保護された設定（`.specdojo/` や `package.json` など）の変更は不要であり、変更案もない。
- `CHANGELOG.md` の `## [Unreleased]` の追加機能節に本機能の追記を行った。公開済みの 0.5.0 以下の節は変更していない。
- 検証: 変更した Markdown ファイルの Prettier 整形および `git diff --check` を確認した。親 runner が実行する 7 件の検証（`lint-ts`, `lint-fm`, `lint-md`, `test-integration`, `validate-schema`, `typecheck`, `test-unit`）は executor 内では重複実行せず、終了後の親 runner へ委ねる。

## 5. 関連ドキュメント

- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:ryu-guide]]
