---
specdojo:
  id: prj-0001:pjr-a7cr-night-register-integrate-and-report-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-11T13:31:51Z"
  derived_from:
    - PJR-MJEH
  commit_type: fix
  commit_scope: exec
---

# PJR-A7CR 夜間の register の統合と朝報告を、job の worktree の検査に通す

## 1. 概要

merge のときの commit-msg の hook と、朝報告の frontmatter・見出しを直し、夜間の routine を最後まで通す

## 2. 入力

- PJR-MJEH の修正。0.8.0 に含める（indie が 2026-11-11 に承認）

## 3. 完了条件

- PJR-MJEH の 2 つの原因を確かめ、個票の対応結果に書いている。
  - job の worktree への `git merge --no-ff -m` が、commit-msg の hook（`lefthook.yml` の `npx commitlint --edit $1`）で `.git/worktrees/<job>/COMMIT_EDITMSG` が見つからないと失敗する理由。主の作業ツリーで通るのは古い `COMMIT_EDITMSG` が残っているためか、merge のメッセージを正しく検査しているかも確かめる。
  - `orchestrator night` の朝報告（`execution/reports/night-orchestrator/`）が lint-fm（`type: report` が値の一覧にない・`rulebook` がない）で落ちる理由。見出しの連番など lint-md の決まりにも合っているかを確かめる。
- merge の commit が、主の作業ツリーでも linked worktree でも、その merge のメッセージを commitlint で検査して通る。hook の設定（`lefthook.yml`・`tools/` の hook の入口）など保護された設定の変更が要る場合は executor が変えず、変更案を個票の対応結果と報告の `handoff` に書いている。
- 朝報告が frontmatter の schema と Markdown の決まりに合い、`npm run lint:fm`・`npm run lint:md` に通る。schema や型の一覧を変える場合は、既存の文書への影響を確かめている。
- 回帰テストを足している（linked worktree での merge のメッセージの検査、朝報告の frontmatter の検査など）。
- 関連する設計・ガイドを、振る舞いの変化に合わせて直している。
- 修正の後に夜間の register の routine を実際に 1 回流し（PJR-JSEY を使う）、統合と job の review の段まで通ることを確かめ、`rtn-night-approved-register` を有効に戻すのは orchestrator が行う（executor の作業ではない）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md`・`npm run lint:fm` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                           | 担当         | 状態 | メモ                                                                |
| --- | ---------------------------------------------- | ------------ | ---- | ------------------------------------------------------------------- |
| 1   | 2 つの原因を確かめる                           | executor     | done | 5.1 に記録                                                          |
| 2   | 直して回帰テストを足す                         | executor     | done | 朝報告を修正。hook の提案を一時リポジトリで検査する回帰テストを追加 |
| 3   | 保護された設定の変更案を反映する（要る場合）   | orchestrator | open | 5.3 の差分を承認後に反映                                            |
| 4   | 夜間の routine を 1 回流して確かめ、有効に戻す | orchestrator | open | 設定反映・統合後に PJR-JSEY で確認                                  |

## 5. 対応結果

### 5.1. 原因と再現結果

- commit-msg: Lefthook 2.1.15 で `$1` は shell の位置引数として空になり、`npx commitlint --edit` が起動する。導入済み commitlint の `get-edit-value` 相当の処理（`@commitlint/cli/lib/cli.js`）と `@commitlint/read/lib/get-edit-file-path.js` は、引数のない `--edit` を当該 worktree の `COMMIT_EDITMSG` へ解決する。Git が merge 時に渡す `MERGE_MSG` を読まないのが原因であり、linked worktree のパス解決そのものの不具合ではない。
- 一時リポジトリを Git plumbing で作り、実際の `git merge --no-ff -m` と Lefthook で再現した。主の作業ツリーでは古い `fix: stale` を `COMMIT_EDITMSG` に残すと、`invalid merge message` が終了コード 0 で commit された。新しい linked worktree では有効な `fix(exec): merge approved register` でも `COMMIT_EDITMSG` の ENOENT で終了コード 1 となった。hook へ渡されたパスはそれぞれ `.git/MERGE_MSG` と `.git/worktrees/<job>/MERGE_MSG` だった。
- 引数を捕捉する診断では `$1` は空配列、`"{1}"` は指定したメッセージファイル 1 個を渡した。空白を含むパスも維持された。主の作業ツリーでの従来の成功は、その merge のメッセージを正しく検査した証拠にならない。
- 朝報告: `renderNightReport` が `type: report` を出力していたが、`execution/reports/` には通常の `deliverable-frontmatter.schema.yaml` が適用され、その型の列挙に `report` はない。必須の `rulebook` も欠けていた。見出しも番号がなかった。

### 5.2. 実施内容と判断

- `src/commands/night-orchestrator.ts`: 朝報告を `type: project`・`status: draft`・`rulebook: none` にし、「1. 集計」「2. 実行結果」の見出しへ変更した。プロジェクト管理の実行報告なので既存の `project` を採用し、専用の rulebook がないため `none` とした。schema・型の列挙を広げず、既存文書の検査条件も変えない。
- `tests/src/commands/night-orchestrator.test.ts`: 空 queue と失敗を含む朝報告を、実際の成果物 schema・リポジトリの Markdown 規約で検査する回帰テストを追加した。見出し番号と frontmatter の値も確認する。
- `tests/tools/commit-msg-merge.integration.test.ts`: 旧 hook の主の作業ツリーでの誤受理と、新しい linked worktree での ENOENT を再現する。提案する hook は両方の作業ツリーで正しい merge を受理し、不正な merge を拒否することを確認する。古い `COMMIT_EDITMSG` の内容を反転させ、今回のメッセージを読んでいることを検証する。fixture 以外の Git 設定を変更しない。
- [[prj-0001:sysd-job-execution|Job実行設計]] と [[specdojo:register-operation-guide|プロジェクト登録簿の運用ガイド]] に朝報告の形式を反映し、ガイドに merge のメッセージファイルの渡し方を記載した。
- result・登録簿一覧・個票の状態項目は編集せず、親 runner と reporter に引き継ぐ。全件の型・lint・単体・統合・schema 検査は親 runner が実行する。
- executor の検証: 変更ファイルの Prettier 整形、`git diff --check`、`npm run validate:history-links`、hook と同じ `node --import tsx tools/catalog-validate-if-configured.mjs`、`node --import tsx src/specdojo.ts register build` は成功した。catalog には既存の再 export 参照・未作成文書の警告があるがエラーはない。`node tools/check-evidence-secrets.mjs --staged` も成功した（対象 0 ファイル）。executor 自身の YAML 変更はないため、ファイル単位の YAML schema 検査は非適用。

### 5.3. 保護された設定の変更案と次の確認

`lefthook.yml` は executor の編集対象外のため、orchestrator が承認を得て次の 1 行を変更する。hook の入口を追加する必要はない。

```diff
 commit-msg:
   commands:
     commitlint:
-      run: npx commitlint --edit $1
+      run: npx commitlint --edit "{1}"
```

設定反映後に親検証を通し、PJR-JSEY を使って夜間の register routine を実際に 1 回流す。子 register の Job worktree への統合、朝報告の frontmatter・Markdown 検査、Job の review・統合まで確認してから、orchestrator が `rtn-night-approved-register` を有効に戻す。実 agent の起動・利用枠消費と保護設定の反映を伴うため、executor では実行しない。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正。文案: 夜間の承認済み登録項目の朝報告を、既存の frontmatter schema と番号付き見出しの規約に合わせ、Job の review 前の文書検査で停止する問題を修正。
- 保護設定の反映後に含める文案: merge の commit-msg hook で Git が渡すメッセージファイルを検査し、linked worktree のファイル不在による失敗と、古いメッセージによる誤受理を修正。
- `CHANGELOG.md` は変更していない。0.8.0 の取り込み時に設定反映と実 routine の確認結果を照合する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-mjeh-night-register-integrate-and-report-checks]]
- [[prj-0001:pjr-0x0s-night-register-child-run-env-isolation]]
