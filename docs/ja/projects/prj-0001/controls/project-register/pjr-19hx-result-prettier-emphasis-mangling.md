---
specdojo:
  id: prj-0001:pjr-19hx-result-prettier-emphasis-mangling
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-09-15T14:15:35Z"
  due_on: "2026-09-30"
  block_reason: rate limit reached
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
- 対象、depends*on の cdfd-overview を根拠とし、判断不能箇所があれば \_TODO*/_ASSUMPTION_ を残す方針。
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
| 1   | `.prettierignore` に exec の result・plan を加える            | ARC  | done | 履歴ファイルは整形しない     |
| 2   | executor・reporter の指示に識別子のインラインコード化を加える | ARC  | done | exec-templates と agent 定義 |
| 3   | runner の commit 前に result の markdownlint を実行する       | ARC  | done | 理由を残して block           |

## 4. 対応結果

- `.prettierignore` に `docs/ja/projects/**/execution/exec/plans/**` と
  `docs/ja/projects/**/execution/exec/results/**` を追加し、exec 履歴の Markdown を commit hook の
  Prettier 書き換え対象から外した。通常の Markdown 成果物は従来どおり整形対象である。
- runner 自身も result の描画（`renderReporterResult` / `updateResultStatus` など）と plan 生成の後に
  Prettier API（`format`）で整形しており、API は `.prettierignore` を参照しないため hook を除外しても
  reporter 本文が同じように壊れる。`formatMarkdownFile` が対象ファイルから上位へ最も近い
  `.prettierignore` を探し、除外対象なら整形を省略するようにした。`.prettierignore` を持たない
  利用プロジェクトでは従来どおり整形する。除外後の生成 plan（`exec plan --register`）が Prettier
  差分なし・markdownlint 違反なしであることを実測で確認した。
- exec plan の共通規約、executor / reporter の動的 prompt、Claude / OpenCode のプロジェクト定義、
  Codex / OpenCode の配布用 agent 定義に、`_` を含む識別子・フィールド名をインラインコードで
  囲む指示を追加した。
- `commitWorktreeChanges` が stage / commit より前に対象 result へ markdownlint を実行するようにした。
  markdownlint の終了コード 1（記法違反）のときは `Result Markdown notation violation before commit` と
  lint 詳細を理由にして統合を block する。それ以外の失敗（spawn 失敗・想定外の終了コード）は
  `Failed to run markdownlint on ... before commit` として区別する。`markdownlint-cli` は devDependency
  のため、worktree と SpecDojo package のどちらの `node_modules` にも無い環境では検査を省略し、
  標準出力に省略した旨を残して hook 側の検査に委ねる。
- `.prettierignore` の plan / result パスと非履歴 Markdown の非除外、commit 前 lint の成功・失敗
  （MD049 の単純例と、`depends_on` 未囲みの文を prettier に通した実出力）を固定する単体テストを追加した。
- 残課題: `.codex/agents/codex-executor.toml` と `.codex/agents/codex-expert-executor.toml`（このリポジトリ
  自身の Codex subagent 定義）は、executor の sandbox が `.codex/` への書き込みを許可しないため未更新。
  `templates/codex/agents/` の同名ファイルは更新済みで、内容をコピーすれば同期できる。人間または
  runner 側で反映する。unit / integration / schema 検証は pipeline の親 runner が実行する。

## 5. 関連ドキュメント

- 発生した run: `T-DATA-FLOW-PDCA-cdfd-check-010`（[[prj-0001:pjr-6pd7-cdfd-overview]] の作業 5）
- 統合段の再開: [[prj-0001:pjr-j3g0-exec-resume-integrate-schedule-task]]
- 記述ルール: `.github/instructions/markdown.instructions.md`
