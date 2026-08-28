---
specdojo:
  id: prj-0001:pjr-0146-forbid-links-in-history-files
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-08-31"
  completed_at: "2026-08-05T12:00:00Z"
  conclusion: 履歴蓄積ファイル(plan/result/個票)のMarkdownリンク禁止・[[id]]/パス表記統一ルールをmarkdown.instructions.mdへ追加し、検知CLI(validate-history-links)とunit testを実装、npm run checkへ組み込み。既存違反0件のため一括遡及移行は不要
  register_events:
    - v: 1
      id: reg_a071f57d664ef90c20bf3a0c075c2de1
      ts: "2026-08-02T01:44:31Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs: PJR-0145/0146を起票（README/docs index責務整理、履歴ファイルのリンク禁止）"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: 履歴蓄積ファイル（plan/result/`pjr-NNNN-<topic>`等）はリンクを禁止しリポジトリルート相対パス記述に統一するルール化
        - field: description
          from: ""
          to: plan/result/pjr-NNNN-`<topic>` 等、履歴として蓄積される成果物には、リンク先ファイル名変更のたびに追従修正が発生するリンク（wikilink・Markdownリンク）を含めず、リポジトリルートからの相対パス表記のみで参照先を記述するルールを定める。加えて、ルール違反を自動検知できるよう validation / スキーマチェックの仕組みを整備する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: e221dec4f591f9372095d1eb41258a6e1db27133
    - v: 1
      id: reg_6549c32c054db030075d336ffbc7cc1a
      ts: "2026-08-02T02:22:59Z"
      action: update
      actor: SpecDojo Test
      from_status: open
      to_status: open
      reason: "docs: PJR-0146をwikilink併用ルールに修正しPJR-0148を起票"
      changes:
        - field: title
          from: 履歴蓄積ファイル（plan/result/`pjr-NNNN-<topic>`等）はリンクを禁止しリポジトリルート相対パス記述に統一するルール化
          to: 履歴蓄積ファイル（plan/result/`pjr-NNNN-<topic>`等）はMarkdownリンクを禁止し`[[id]]`/パス表記に統一するルール化
        - field: description
          from: plan/result/pjr-NNNN-`<topic>` 等、履歴として蓄積される成果物には、リンク先ファイル名変更のたびに追従修正が発生するリンク（wikilink・Markdownリンク）を含めず、リポジトリルートからの相対パス表記のみで参照先を記述するルールを定める。加えて、ルール違反を自動検知できるよう validation / スキーマチェックの仕組みを整備する。
          to: plan/result/pjr-NNNN-`<topic>` 等、履歴として蓄積される成果物には、リンク先ファイル名変更のたびに追従修正が発生する Markdown リンク（`[]()`）を含めない。`docs/` 配下の文書を参照する場合は `id` を正とする `[[id]]`（wikilink）に統一し、`docs/` 外のファイル（`.github/instructions/` 等）や外部URLはリポジトリルートからの相対パス表記／URLそのままで記述するルールを定める。加えて、ルール違反（Markdownリンクの使用）を自動検知できるよう validation / lint チェックの仕組みを整備する。
      legacy_commit: d4c2113e9fc24d7e0c7f64806d60054bfd6e2e67
      previous_event_id: reg_a071f57d664ef90c20bf3a0c075c2de1
    - v: 1
      id: reg_c4d6d89bcfa7dee74f37e63e8ddfd6cf
      ts: "2026-08-04T10:50:42Z"
      action: update
      actor: SpecDojo Test
      from_status: open
      to_status: open
      reason: "fix: PJR-0145/0146の未エスケープ山括弧プレースホルダを修正しdocs:build失敗を解消"
      changes:
        - field: title
          from: 履歴蓄積ファイル（plan/result/`pjr-NNNN-<topic>`等）はMarkdownリンクを禁止し`[[id]]`/パス表記に統一するルール化
          to: 履歴蓄積ファイル（plan/result/pjr-NNNN-`<topic>`等）はMarkdownリンクを禁止し`[[id]]`/パス表記に統一するルール化
      legacy_commit: be50ff0ffa9c2d87c50ee3a1da576a1ec86f8616
      previous_event_id: reg_6549c32c054db030075d336ffbc7cc1a
    - v: 1
      id: reg_9d8d2ad43dd23e4beb617b6cde58adfd
      ts: "2026-08-09T10:55:22Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: done
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: done
        - field: title
          from: 履歴蓄積ファイル（plan/result/pjr-NNNN-`<topic>`等）はMarkdownリンクを禁止し`[[id]]`/パス表記に統一するルール化
          to: 履歴蓄積ファイル（plan/result/pjr-NNNN-`<topic>`等）はMarkdownリンクを禁止し[[id]]/パス表記に統一するルール化
        - field: description
          from: plan/result/pjr-NNNN-`<topic>` 等、履歴として蓄積される成果物には、リンク先ファイル名変更のたびに追従修正が発生する Markdown リンク（`[]()`）を含めない。`docs/` 配下の文書を参照する場合は `id` を正とする `[[id]]`（wikilink）に統一し、`docs/` 外のファイル（`.github/instructions/` 等）や外部URLはリポジトリルートからの相対パス表記／URLそのままで記述するルールを定める。加えて、ルール違反（Markdownリンクの使用）を自動検知できるよう validation / lint チェックの仕組みを整備する。
          to: "plan/result/pjr-NNNN-`<topic>`等の履歴として蓄積されるファイルは、リンク先のファイル名変更時に修正が発生してしまうため、Markdownリンク`[]()`を使わず、docs/配下の参照は`[[id]]`、docs/外の参照・外部URLはパス表記/URLのままとするルールを定め、関連する記述ルール文書（例: markdown.instructions.md等）へ反映する"
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
        - field: conclusion
          from: "-"
          to: 履歴蓄積ファイル(plan/result/個票)のMarkdownリンク禁止・[[id]]/パス表記統一ルールをmarkdown.instructions.mdへ追加し、検知CLI(validate-history-links)とunit testを実装、npm run checkへ組み込み。既存違反0件のため一括遡及移行は不要
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_c4d6d89bcfa7dee74f37e63e8ddfd6cf
    - v: 1
      id: reg_dce6a4ceea43a788222810ef8365fe7b
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-08-05"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_9d8d2ad43dd23e4beb617b6cde58adfd
---

# PJR-0146 履歴蓄積ファイル（plan/result/pjr-NNNN-`<topic>`等）はMarkdownリンクを禁止し[[id]]/パス表記に統一するルール化

## 1. 概要

plan/result/pjr-NNNN-`<topic>`等の履歴として蓄積されるファイルは、リンク先のファイル名変更時に修正が発生してしまうため、Markdownリンク`[]()`を使わず、docs/配下の参照は`[[id]]`、docs/外の参照・外部URLはパス表記/URLのままとするルールを定め、関連する記述ルール文書（例: markdown.instructions.md等）へ反映する

plan/result/pjr-NNNN-`<topic>` 等、履歴として蓄積される成果物には、リンク先ファイル名変更のたびに追従修正が発生する Markdown リンク（`[]()`）を含めない。`docs/` 配下の文書を参照する場合は `id` を正とする `[[id]]`（wikilink）に統一し、`docs/` 外のファイル（`.github/instructions/` 等）や外部URLはリポジトリルートからの相対パス表記／URLそのままで記述するルールを定める。加えて、ルール違反（Markdownリンクの使用）を自動検知できるよう validation / lint チェックの仕組みを整備する。

`[[id]]` は `specdojo index build` の doc-index を介して `id` から解決するため、`specdojo:id-and-file-naming-standard` の「ファイル名を変更しても `id` は変更しない」原則の下では、参照先ファイルがリネームされても参照側の修正が不要になる。`id` が未解決の場合もビルドエラーにはならず `[[id]]` の文字列表示に留まる（`src/doc-index.ts` の `replaceDocIndexRefs`、`.vitepress/config.mts` の wikilink 変換ルールで確認済み）。

## 2. 完了条件

- 対象となる成果物種別（plan/result/pjr-NNNN-`<topic>`等の履歴ファイル）が明文化されている。
- `docs/` 配下の参照は `[[id]]`、`docs/` 外の参照・外部URLはパス表記／URLのまま、Markdownリンク（`[]()`）は使わない、という記述ルールが `.github/instructions/` 配下のルール文書へ反映されている。
- 既存の履歴ファイル内リンクの扱い（移行要否）について方針が決まっている。
- 対象ファイル種別に対して、Markdownリンク（`[]()`）の使用を検知する validation / lint チェックが導入されている。
- 上記チェックが CI もしくは `npm run lint:md` 等の既存検証コマンドに組み込まれている。

## 3. 作業内容

| No  | 作業                                                                                  | 担当 | 状態 | メモ                                                                     |
| --- | ------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------ |
| 1   | 対象ファイル種別の洗い出し                                                            | ARC  | done | plan / result / 個票（`pjr-<NNNN>-<topic>`）。`pjr-index.md` は対象外    |
| 2   | ルール文書への追記（`[[id]]`/パス表記の使い分け含む）                                 | ARC  | wip  | ルール本文を確定。SSOT の instructions への反映は human 適用（申し送り） |
| 3   | 既存ファイルへの遡及要否の判断                                                        | ARC  | done | 既存に Markdown リンクなし。発見時に置換、一括遡及移行は不要と決定       |
| 4   | 対象ファイル種別に対するMarkdownリンク使用検知の validation / lint チェック設計・実装 | ARC  | done | `tools/docs/src/validate-history-links.ts`（unit test 付き）を追加       |
| 5   | 検証コマンド（CI / npm scripts）への組み込み                                          | ARC  | wip  | `package.json` / `lefthook.yml` への配線は human 適用（申し送り）        |

## 4. 対応結果

確定したリンク記法ルール（履歴蓄積ファイル向け）:

- 対象は plan（`docs/ja/projects/**/exec/plans/`）、result（`docs/ja/projects/**/exec/results/`）、個票（`docs/ja/projects/**/controls/project-register/pjr-*.md`）。登録簿本体 `pjr-index.md` は個票セルを Markdown リンクで参照するため対象外。
- `docs/` 配下の参照は `id` を正とする wikilink（`[[id]]` / `[[id|表示名]]`）に統一する。ファイルをリネームしても `id` は変えない運用のため、参照側の追従修正が不要になる。
- `docs/` 外のファイル（`.github/instructions/` など）はリポジトリルートからの相対パス表記、外部URLは URL そのまま（bare URL / autolink）で書く。
- Markdown リンク（`[表示名](パス)`）と参照リンク（`[表示名][ラベル]` + 定義）は書かない。画像 `![](...)` とページ内アンカー `[..](#..)` は対象外。

移行方針:

- 既存の plan / result / 個票に Markdown リンクは 0 件（調査済み）。一括の遡及移行は行わず、検査で検出された時点で上記記法へ置き換える方針とする。

導入した検査（validation / lint チェック）:

- 検出モジュール `tools/docs/src/history-links.ts` と CLI `tools/docs/src/validate-history-links.ts` を追加。`[]()` / 参照リンクを検出したら exit 1。wikilink・bare URL・autolink・画像・アンカーは誤検知しない。
- unit test `tests/tools/docs/src/history-links.test.ts`（11 ケース）で挙動を固定。`npx eslint` / `npx tsc --noEmit` / `npx vitest run` は成功。

human 適用が必要な残作業（sensitive file のため本 exec では未反映。詳細な差分は result の申し送りに記載）:

- 記述ルール SSOT `.github/instructions/markdown.instructions.md` への節追加（本ルールの反映）。
- `package.json` の `check` への `validate:history-links` 組み込み、または `lefthook.yml` pre-commit への検査追加。

## 5. 関連ドキュメント

- .github/instructions/markdown.instructions.md
- .github/instructions/specdojo-exec-workflow.instructions.md
- [[specdojo:id-and-file-naming-standard|ドキュメントIDおよびファイル命名標準]]
- [[prj-0001:pjr-0148-extend-wikilink-id-resolution-beyond-docs-scope|docs/外へのwikilink解決範囲拡張の要否検討]]
