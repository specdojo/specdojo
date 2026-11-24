---
specdojo:
  id: prj-0001:pjr-m120-register-branch-push
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: hard
  registered_at: "2026-11-24T23:14:51Z"
---

# PJR-M120 登録簿の専用ブランチへの push を受け持つ register branch-push を足す

## 1. 概要

登録簿の同期（`register_sync`）では、`register ... --commit` と `exec run` が専用ブランチへ自動で push する。一方、初回の専用ブランチの作成と push、同期に失敗したときの復旧は、ガイドで素の `git branch`・`git pull --rebase`・`git push` を手で打つ手順になっている。素の `git push` はどのブランチへも push できるため、オーケストレーターには許していない。push を、設定の remote と branch だけに絞った専用のコマンドで受け持ち、オーケストレーターが素の `git push` を打たずに同期を始め・直せるようにする。

## 2. 入力

- 利用者の要望（2026-11-25）: 起票を専用ブランチへ push する運用を、prj-0001 と prj-0002 の間で始めたい
- 利用者の提案と判断（2026-11-25）: register の git の push は specdojo の専用コマンドを作った方がよい。コマンドを作ってから同期を始める（案 B）。全件レビュー（PJR-0BGE）は止めずに並行して進める
- 同期の設定（2 つの project の specdojo.config.json・CLAUDE.md・オーケストレーターの本文・check-register-push.yml・lefthook.yml）の差分は、オーケストレーターが ../worktrees/feature-prj-0001-register-sync と ../worktrees/feature-prj-0002-register-sync に用意してある（未 commit）。この項目では変えない
- 担当と期限は利用者の確認待ち

## 3. 完了条件

- `specdojo register branch-push --project <project-id>` を足す。push の先は、その project の `register_sync` の `remote` と `branch` だけとし、ほかの ref を引数で指せないようにする。`register_sync.enabled` が `true` でない project では、何もせずに理由を出して終了コード 1 で止まる。
- 初回: 専用ブランチが手元にもリモートにも無ければ、その project の統合のブランチ（`integration_branch`、省略時は `project/<project-id>/develop`）から作って push する。リモートにだけあれば、手元のブランチを作るだけにする。専用の worktree が無ければ、今の同期と同じ置き場に用意する。
- 復旧: 同期が止まった専用の worktree（未 push の commit がある、rebase の途中など）を、`pull --rebase` から push の順で流し直す。衝突が残っていれば、ファイルと直し方を出して終了コード 1 で止まる。記帳済みのファイルとローカルの commit は消さない。
- push の前に、`register branch-check` と同じ検査（register の範囲の外のファイル、個票とイベントの形）を流し、違反があれば push しない。
- 今の同期と同じロックの中で動き、同期中の別の記帳と取り合わない。`--dry-run` では、作るブランチ、push する commit の範囲、検査の結果だけを示して何も変えない。
- 単体テストと統合テストを足す（初回の作成と push、リモートにだけあるとき、復旧、衝突で止まること、検査の違反で止まること、無効の project で止まること、`--dry-run`、ほかの ref を指せないこと）。git を使うテストは `vitest.instructions.md` の決まり（一時ディレクトリ、`gitEnvironment()`）に従う。
- 登録簿運用ガイドの「専用ブランチへの同期」と設定リファレンス、コマンドリファレンスを、手で打つ `git branch`・`git push`・`git pull --rebase` の手順をこのコマンドに替える形に直す。
- 破壊的な変更をしない（PJR-T2X5）。今の同期の動き、`branch-merge`・`branch-guard`・`branch-check` の引数と出力は変えない。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`CLAUDE.md`・`lefthook.yml`・`.github/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。統合の後に、オーケストレーターが試しのリポジトリ（裸のリモートを持つ一時のリポジトリ）で初回・復旧・`--dry-run` を確かめてから close する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 2 回目の実行（2026-11-25）: オーケストレーターが、同期を有効にした prj-0001 の設定で `register branch-push --project prj-0001 --dry-run` を流したところ、手元の develop に origin へまだ上げていない commit が 65 件あり、初回の検査が「register の範囲の外のファイルを含む commit」として 210 件を挙げて止まった。次の 2 点を直す。
  - 初回に専用ブランチを作るときは、統合のブランチのリモートの先端（`<remote>/<integration_branch>`。fetch して読む）があればそこから作り、手元にしかない統合のブランチの commit を専用ブランチに含めない。リモートに統合のブランチが無いときだけ、今の手元の先端から作って案内を出す。決めた動きと理由を個票の対応結果と報告の `handoff` に書く。
  - `--dry-run` でも、本番の実行と同じ案内（初回の検査で止まるときの `INITIAL_CHECK_HINT` など）を出す。
- 2 回目の単体テストと結合テストを足す（手元の統合のブランチがリモートより進んでいても、初回の作成がリモートの先端から作って検査を通ること、`--dry-run` に案内が出ること）。

## 4. 作業内容

| No  | 作業                                                                                              | 担当         | 状態 | メモ                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------- | ------------ | ---- | ---------------------------------------------------------------------------------------------------------- |
| 1   | `register branch-push` を足す（`src/register/branch-push.ts`・`src/register/branch-commands.ts`） | executor     | done | 初回の作成と push・リモートにだけあるとき・手元にだけあるとき・復旧・`--dry-run` を受け持つ                |
| 2   | 同期のロックと worktree の場所を `src/shared/register-branch.ts` から export する                 | executor     | done | 既存の同期の動きは変えない。復旧の案内文を `branch-push` を指す文へ直した                                  |
| 3   | 単体テストと統合テストを足す                                                                      | executor     | done | `tests/src/register/branch-push.test.ts`・`tests/src/register/register-branch-push.integration.test.ts`    |
| 4   | 登録簿運用ガイド・設定リファレンス・コマンドリファレンスを直す                                    | executor     | done | 手で打つ `git branch`・`git pull --rebase`・`git push` の手順を `branch-push` に替えた                     |
| 5   | 試しのリポジトリ（裸のリモート）で初回・復旧・`--dry-run` を確かめる                              | orchestrator | open | 完了条件で統合の後にオーケストレーターが行う作業のため、executor では行わない                              |
| 6   | 2 回目: 初回の作成を統合のブランチのリモートの先端から始め、`--dry-run` にも同じ案内を出す        | executor     | done | `src/register/branch-push.ts` を直し、単体テストと統合テストを足した。ガイドとコマンドリファレンスも直した |

## 5. 対応結果

### 5.1. 実施内容

- `specdojo register branch-push --project <project-id> [--dry-run]` を足した。push の先は `register_sync` の `remote` と `branch` だけ。ほかのオプションと位置引数は commander が拒否する（`allowExcessArguments(false)`。未知のオプションは既定で拒否される）。
- `register_sync.enabled` が `true` でない project では、理由（`register_sync is not enabled for <project-id>; nothing to push.`）を出して終了コード 1 で止まる。
- 状態ごとの動き:
  - 手元にもリモートにも無い: 統合のブランチ（`integration_branch`、省略時は `project/<project-id>/develop`）の先端から作る。専用 worktree を同期と同じ置き場に作って push する。
  - リモートにだけある: fetch して手元のブランチと worktree を作るだけで、push しない。
  - 手元にだけある: 検査のうえ、そのまま新しいリモートのブランチへ push する。
  - 両方にある（復旧）: 止まった rebase を `rebase --continue` で続ける。範囲の検査、`pull --rebase`、検査、push（non-fast-forward のときは既存の `pushRegisterBranch` で最大 3 回）の順に流し、成功したら同期の復旧の印を消す。
- 衝突が残っていれば、ファイルの一覧と直し方（worktree で直して `git add`、取り消すなら `git rebase --abort`）を出して終了コード 1 で止まる。記帳済みのファイルとローカルの commit は消さない。
- push の前に `checkRegisterPush`（`register branch-check` と同じ検査）を流す。違反があれば `formatRegisterPushReport` の報告を出して push しない。
- 同期と同じロック（`inRegisterBranchLock`。`CrossProcessMutex` の置き場も同じ）の中で動き、ロックを取ったあとに状態を読み直す。
- rebase が止まっている間は HEAD が detached になり、ブランチ名では worktree を見つけられない。そのため `registerBranchWorktree` は rebase の `head-name` からも worktree を探す。
- 同期が失敗したときの案内文（`recoveryError`）を、素の `git pull --rebase`・`git push` から `register branch-push` を指す文へ直した。既存のテストが見る語句（`create it from the project develop branch`・`git rebase --continue`・`Do not repeat add`）は残した。
- 登録簿運用ガイドの「専用ブランチへの同期（v0.10.0）」、設定リファレンスの `register_sync` のキー、コマンドリファレンスの register の表と説明を直した。
- `branch-merge`・`branch-guard`・`branch-check` の引数と出力は変えていない。保護された設定と `CHANGELOG.md` も変えていない。

### 5.2. executor が決めたこと

- `--dry-run` ではロックを取らず、fetch もしない（リモートの先端は `git ls-remote` で読む）。ロックのファイルを作ることや、FETCH_HEAD・リモート追跡の ref を更新することも「変える」に当たると判断した。リモートにまだ取得していない commit があれば、その旨と rebase 前の範囲を示す。
- `--dry-run` で、実際の実行が止まる場合（検査の違反・衝突・未 commit）は終了コード 1 を返す。`register branch-check` と同じく、スクリプトから違反を判定できるようにするため。
- 復旧のときに専用 worktree に未 commit の変更（rebase の途中のものを除く）があれば、自動では commit せず、一覧を出して終了コード 1 で止まる。並行 claim のように採用するかを利用者が決める記帳を、勝手に公開しないため。
- 初回の検査の範囲は、2 回目の実行で「2 回目の実行（2026-11-25）で直したこと」のとおりに改めた。リモートの統合のブランチの先端より後だけを見る。
- ブランチが手元にだけある場合（完了条件にない状態）は、検査のうえ push する。
- 統合のブランチは手元の `refs/heads/<integration_branch>` を使い、無ければ止まる。設定リファレンスの「指定した project の統合ブランチはローカルに存在していなければなりません」に合わせた。

### 5.3. 2 回目の実行（2026-11-25）で直したこと

- 初回の作成の起点: `git ls-remote` でリモートの統合のブランチ（`<remote>/<integration_branch>`）の先端を確かめる。あれば、本番の実行では fetch して `FETCH_HEAD` から専用ブランチを作る。手元にしかない統合のブランチの commit は含めない。初回の検査は、その先端を `base` として、それより後の commit だけを見る。起点は push 済みのため、範囲は 0 件になる。先端の個票とイベントの形の検査は流す。
  - 理由: 手元の develop に未 push の commit が 65 件あると、`--remotes` を除外する範囲ではそれらが範囲の外として 210 件挙がり、初回が始められなかった。リモートの先端を起点にすれば、専用ブランチには origin 上の commit と記帳の commit だけが入る。
- リモートに統合のブランチが無いときだけ、従来どおり手元の先端から作る。その旨の案内（`<remote>/<integration_branch> does not exist; creating ... from the local ...`）を出す。検査で止まるときは `INITIAL_CHECK_HINT` も添える。
- `--dry-run` でも、本番と同じ案内を出す。リモートに統合のブランチが無い旨と、検査で止まるときの `INITIAL_CHECK_HINT` が対象で、手元にだけある専用ブランチを push する場合も含む。`--dry-run` は従来どおり fetch しない。リモートの先端の commit が手元にまだ無いときは、fetch してから作ることと、検査は fetch 後に流すことを示し、終了コード 0 で返す。
- テスト: 単体テスト（`checkLines` が、止まるときに案内を添え、通るときは添えないこと）を足した。統合テストも足した（手元の統合のブランチが進んでいても、リモートの先端から作って検査を通ること。リモートに統合のブランチが無いときの案内。`--dry-run` がリモートの先端から始まること。`--dry-run` に案内が出ること）。従来の「未 push の統合のブランチの commit で止まる」テストは、新しい動きに合わせて置き換えた。

### 5.4. CHANGELOG に書く事項

- 区分 Added: `specdojo register branch-push --project <project-id>` を追加。`register_sync` の remote と branch だけへ push し、初回の専用ブランチの作成と push、止まった同期の復旧（`pull --rebase` から push まで）を受け持つ。push の前に `register branch-check` と同じ検査を流す。`--dry-run` は、作るブランチ・push する範囲・検査の結果を示す（PJR-M120）。
- 区分 Changed: 登録簿の同期に失敗したときの案内を、手で打つ `git pull --rebase`・`git push` から `specdojo register branch-push` へ替えた（PJR-M120）。

### 5.5. 残課題

- 統合の後に、オーケストレーターが試しのリポジトリ（裸のリモートを持つ一時のリポジトリ）で初回・復旧・`--dry-run` を確かめる（作業内容の No 5）。
- 同期の設定の差分（`../worktrees/feature-prj-0001-register-sync`・`../worktrees/feature-prj-0002-register-sync`）にある CLAUDE.md やオーケストレーターの本文に手で打つ git の手順があり、`register branch-push` に替える必要があれば、その差分の側で直す（この項目では変えない）。

## 6. 関連ドキュメント

- [[specdojo:register-operation-guide|登録簿運用ガイド]]
- [[specdojo:specdojo-config-reference|設定リファレンス]]
- [[specdojo:command-reference|コマンドリファレンス]]
