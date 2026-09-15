---
specdojo:
  id: prj-0001:pjr-19hx-result-prettier-emphasis-mangling
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-15T14:15:35Z"
  due_on: "2026-09-30"
---

# PJR-19HX reporter の result が commit 時の prettier で壊れて統合段で block する問題を防ぐ

## 1. 概要

`data-flow-pdca` の `cdfd-check-010` で、executor・reporter・親検証がすべて成功したのに統合段の commit が失敗して block した。reporter が result に書いた文に、インラインコードで囲まれていない `depends_on`（`_` を含む識別子）と `_TODO_/_ASSUMPTION_` が同居し、commit 時の prettier が `_on` から `_TODO` までを強調と解釈して `\_TODO*/_ASSUMPTION_` に書き換え、markdownlint の MD049 で pre-commit が失敗した。prettier には強調の正規化を止めるオプションが無い。履歴ファイル（exec の result・plan）を `.prettierignore` で整形対象から外し、markdownlint は残す。あわせて reporter・executor の指示に「`_` を含む識別子はインラインコードで囲む」を加え、runner が commit の前に markdownlint を実行して明確な理由で止めるようにする。

### 1.1. 再現

reporter（qwen-reporter）が result の「進め方と実践の型の適用」に書いた文（抜粋）。

```text
- 対象、depends_on の cdfd-overview を根拠とし、判断不能箇所があれば _TODO_/_ASSUMPTION_ を残す方針。
```

commit 時の lefthook `markdown` hook（`prettier --write`）を通すと次になり、markdownlint の MD049（強調記法の不統一）で
commit が失敗する。

```text
- 対象、depends_on の cdfd-overview を根拠とし、判断不能箇所があれば \_TODO*/_ASSUMPTION_ を残す方針。
```

`depends_on` をインラインコードで囲むと壊れない。原因は、囲まれていない `depends_on` の `_` を remark が強調の開始と
解釈し、後方の `_TODO_` と対にすることである。`_TODO_/_ASSUMPTION_` 単体では壊れない。

### 1.2. 影響

- executor・reporter・親検証がすべて成功した run が統合段で block し、worktree が残る。回復には
  [[prj-0001:pjr-j3g0-exec-resume-integrate-schedule-task]] の手順が要る。
- reporter は自由文を書くため、識別子を囲み忘れる確率は下がらない。同じ失敗が繰り返される。

### 1.3. 対処

- prettier には強調記法の正規化を止めるオプションが無い。`.prettierignore` に exec の result と plan
  （`docs/ja/projects/**/execution/exec/results/**`、`.../plans/**`）を加え、履歴ファイルを整形対象から外す。
  markdownlint の検査は残す。
- executor・reporter の指示（exec-templates、agent 定義）に「`_` を含む識別子・フィールド名はインラインコードで囲む」を加える。
  Markdown 記述ルールでは既に規定されているが、result の自由記述には徹底されていない。
- runner が worktree の commit 前に result へ markdownlint を実行し、失敗時は hook のエラーではなく
  「result の記法違反」として理由を残して block する。

## 2. 完了条件

- `.prettierignore` により exec の result と plan が prettier の整形対象外になり、上記の再現文を含む result を commit しても
  内容が書き換えられない。
- reporter・executor の指示に識別子のインラインコード化が明記され、result の自由記述で `depends_on` のような識別子が
  囲まれる。
- runner が commit 前に result の markdownlint を実行し、違反時に result の記法違反である旨の理由で block する。
- 単体テストに、`.prettierignore` の対象パスと、markdownlint 違反で block する経路がある。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

## 3. 作業内容

| No  | 作業                                                          | 担当 | 状態 | メモ                         |
| --- | ------------------------------------------------------------- | ---- | ---- | ---------------------------- |
| 1   | `.prettierignore` に exec の result・plan を加える            | ARC  | open | 履歴ファイルは整形しない     |
| 2   | executor・reporter の指示に識別子のインラインコード化を加える | ARC  | open | exec-templates と agent 定義 |
| 3   | runner の commit 前に result の markdownlint を実行する       | ARC  | open | 理由を残して block           |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 発生した run: `T-DATA-FLOW-PDCA-cdfd-check-010`（[[prj-0001:pjr-6pd7-cdfd-overview]] の作業 5）
- 統合段の再開: [[prj-0001:pjr-j3g0-exec-resume-integrate-schedule-task]]
- 記述ルール: `.github/instructions/markdown.instructions.md`
