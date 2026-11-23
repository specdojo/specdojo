---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-index-sample-040-20261123t113947z-5036b163
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-index-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-index-sample-040/T-KATA-WAVE-4-nfr-index-sample-040-20261123T113947Z-5036b163/plan.md
  started_at: "2026-11-23T11:39:54.056Z"
  completed_at: "2026-11-23T11:48:13.595Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-index-sample
    - specdojo:nfr-index-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook `docs/ja/specdojo/rulebooks/nfr-index-rulebook.md` を簡潔化しました。
- 完成例として含まれていた章を削除し、`recipe` および `template` が `undecided` であることを明記する記述を追加しました。
- 文書 ID (`nfr-index`) のルールと、配置先の指定に関する記述を追加しました。
- 分冊の追加・削除・統合・分割における完了条件、および改定時の完了条件を明文化しました。
- 分冊一覧のテーブルから `Owner` 列を削除し、列名の揺れを解消しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-index-rulebook.md`: 完成例の章を削除し、`recipe`・`template` の未決事項（`undecided`）に関する記述、文書 ID および配置に関するルール、分冊の更新（追加・削除・統合・分割・改定）における完了条件を追加しました。また、分冊一覧から `Owner` 列を削除しました。

## 3. 申し送り

- F004・F006（major）: `specdojo:nfr-index-sample` が rulebook の本文要件（1.概要〜5.関連ドキュメント導線、8カテゴリ、ID/参照先の分冊一覧）に従っていない。この段は sample を編集しないため未解決。次の sample 改訂の段で、見出し構成を揃えること、H1 の Markdown リンクを削除すること、分冊一覧に Owner 列を置かないことを反映する必要がある。
- F001・F002・F008: `recipe`・`template` の要否は、全体方針の `_UNDECIDED_` 行に論点として記載した。決定そのものは登録簿の個票で追う。
- F007: PJR-76N9 に従い、分冊一覧から担当列（`Owner`・更新責任）を削除して列名の揺れを解消した。
- 直さなかった箇所: 禁止事項、6.1・6.2・6.5 の記述ガイドは、指摘も冗長さもないため維持した。
- F004・F006（major）: specdojo:nfr-index-sample が rulebook の本文要件（1.概要〜5.関連ドキュメント導線、8カテゴリ、ID/参照先の分冊一覧）に従っていない。この段は sample を編集しないため未解決。次の sample 改訂の段で、見出し構成を揃えること、H1 の Markdown リンクを削除すること、分冊一覧に Owner 列を置かないことを反映する必要がある。
- F001・F002・F008: recipe・template の要否は、全体方針の `_UNDECIDED_` 行に論点として記載した。決定そのものは登録簿の個票で追う。
- F007: PJR-76N9 に従い、分冊一覧から担当列（Owner・更新責任）を削除して列名の揺れを解消した。
- 適用外の検証: `npm run validate:history-links`（変更ファイルは docs/ja/specdojo/rulebooks/nfr-index-rulebook.md だけで、plan・result・個票を含まない）

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と `done_criteria` に沿って簡潔に整えました。rulebook 内部に完成例の章を置かず、記述ガイドを整理し、指摘された未決事項（`recipe`・`template` の扱い）や識別子・配置規則、完了条件を明文化しました。また、分冊一覧の `Owner` 列を削除し、役割の記述を簡潔にしました。
