---
specdojo:
  id: prj-0001:pjr-98p8-docs-site-exclude-exec-records
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-21T22:08:36Z"
  derived_from:
    - PJR-G85C
---

# PJR-98P8 ドキュメントサイトから exec の plan と result を外し、リンクを GitHub の表示に置き換える

## 1. 概要

PJR-G85C の調査で、plan と result がサイトの約 6 割を占め、手元の docs:build がメモリ不足で落ちることが分かった。推奨の案（サイトから外し、実行の記録の一覧などからのリンクを GitHub のファイル表示へ置き換える）を実装する

## 2. 完了条件

- 0.4.2 の範囲とする（2026-10-22、利用者が承認）。PJR-G85C の調査（個票の対応結果）の案 3 を実装する。
- `packages/docs-site/.vitepress/config.mts` の `srcExclude` に、全 project の `execution/exec/plans/` と `execution/exec/results/` を加え、ドキュメントサイトのページにしない。リポジトリの中の plan・result と、実行の記録の一覧（`execution/generated/exec-records.md`）などの生成物の内容は変えない。
- サイトのビルドのときだけ、外した plan・result を指す Markdown のリンクと wikilink（`[[id]]`）を、GitHub のファイル表示の URL（`https://github.com/specdojo/specdojo/blob/main/<リポジトリからのパス>`）に置き換える。置き換えは docs-site の Markdown の処理で行い、元の文書は書き換えない。URL の組み立ての元（リポジトリと branch）は config の 1 か所に定数でまとめる。
- dead link の検査は今のまま有効にし、`ignoreDeadLinks` で plan・result を丸ごと無視しない。置き換えた後に dead link が 0 件になる。
- `NODE_OPTIONS` を広げずに `npm run docs:build` が手元で通り、かかった時間を result に書く。`.github/workflows/deploy.yml` の `NODE_OPTIONS` は変えない。
- 置き換えの処理の単体テスト（相対リンク・wikilink・表示名付きの wikilink・plan と result 以外は変えないこと）を足す。
- `npm run lint:md` と `npm run docs:build` が通る。

- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（ドキュメントサイトの変更として）。

## 3. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ         |
| --- | -------------------------------------------------------------------- | ---- | ---- | ------------ |
| 1   | サイトから plan と result を外し、リンクを GitHub の表示に置き換える | DEV  | done | 0.4.2 の範囲 |

## 4. 対応結果

- `packages/docs-site/.vitepress/config.mts` の `srcExclude` で全 project の exec plan / result をページ生成から除外した。
- サイトの Markdown 処理で、除外対象への相対 Markdown リンクと wikilink を GitHub の `main` branch 上のファイル表示へ置き換えるようにした。リポジトリ URL と branch は config の定数へ集約し、元の Markdown と生成物は変更しない。
- 変換処理を純粋関数へ分離し、相対リンク、wikilink、表示名付き wikilink、および plan / result 以外を変更しないことの単体テストを追加した。
- docs-site の README と CHANGELOG の `Unreleased` を更新した。
- 残課題: なし。

## 5. 関連ドキュメント

- PJR-G85C（調査）
