---
specdojo:
  id: prj-0001:pjr-n0p1-review-product-worktree-read-only
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: low
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-21T02:09:29Z"
  derived_from:
    - PJR-08EK
---

# PJR-N0P1 review の段でもプロダクトの worktree への書き込みを許している

## 1. 課題内容

exec の review の段の agent に、プロダクトの worktree への edit の許可（opencode の注入、claude の Edit など）が edit の段と同じく渡る。review は読み取りだけで足りるため、読み取りに絞るかを調べる

## 2. 入力

- 2026-11-21、OpenFisca-Japan-specdojo（0.7.0）の回避策との照合で見つけた。回避策では review-executor に読むための `external_directory` だけを足し、edit は許していない
- src/exec/task-repos.ts の withAgentExtraRoots は mode を見ず、src/exec/run/agent.ts・src/exec/worktree-command.ts・src/exec/run/in-place.ts から、review の段でもプロダクトの worktree を書き込みの root として渡している
- review の段が書き込むのは project の worktree（個票・review の result・evidence）で、これは agent の定義の edit の規則で許されており、この件の対象ではない
- 調べること: review の段でプロダクトの worktree を読み取りだけにできるか（provider ごと）。review の段でプロダクトに変更が出たときに runner がすでに止めているなら、それを確かめて閉じる

## 3. 影響範囲

| 観点         | 影響                                                                                    |
| ------------ | --------------------------------------------------------------------------------------- |
| スコープ     | exec の review の段で agent に渡す、プロダクトの worktree への権限                      |
| スケジュール | なし                                                                                    |
| コスト       | 小さい（runner と CLI の一部の修正）                                                    |
| 品質         | review の agent がプロダクトを書き換えても止まらないおそれがある                        |
| 関係者       | 利用者のプロジェクト（coderdojo-lessons-specdojo など）と prj-0001 のオーケストレーター |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/exec/task-repos.ts` の `withAgentExtraRoots` が mode を見ず、review の段でもプロダクトの worktree を書き込みの root として渡している。統合時の検査は schedule の review を result と記録に限るが、register の review でプロダクトに変更が出たときの扱いは確かめていない |
| 対応策   | provider（claude・codex・opencode・copilot）ごとに、review の段ではプロダクトの worktree を読み取りだけで渡す。読み取りだけにできない provider は、review の段でプロダクトの worktree に変更が出たら、runner が項目を waiting にして `block_reason` に理由を残す             |
| 依存事項 | なし                                                                                                                                                                                                                                                                         |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                                                                                                                                                                                 |

- provider ごとに、review の段で渡す権限（読み取りだけにできたか、できなかったか）を個票の対応結果に表で書く。
- review の段の agent の起動の引数・設定に、プロダクトの worktree の書き込みの許可が含まれないことをテストで確かめる。
- review の段でプロダクトの worktree に変更が出たとき、項目が waiting になり理由が残ることをテストで確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分（追加・変更・不具合修正など）と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

review の段（`mode: review`）ではプロダクトの worktree を読み取りだけで渡すようにした。`agentEnvironment` が mode から `SPECDOJO_REPO_ACCESS=read` を環境に載せ、`runWithRetry` がそれを読んで `withAgentExtraRoots` に `access: "read"` を渡す。`exec worktree agent` も task の mode から同じ access を渡す。

### 5.1. CHANGELOG に書く事項

- 区分: 変更
- 行の文案: exec の review の段で、agent に渡すプロダクトの worktree を読み取りだけにした。読み取りだけにできない provider は、review の後にプロダクトの worktree へ変更が出ていたら runner が止める。

### 5.2. provider ごとの権限

| provider | review の段で渡す権限                                 | 読み取りだけにできたか | 補足                                                              |
| -------- | ----------------------------------------------------- | ---------------------- | ----------------------------------------------------------------- |
| claude   | `--add-dir` だけ。`Edit(/<abs>/**)` の許可を渡さない  | できた                 | mode の設定が許す project 側の edit は変わらない                  |
| opencode | `external_directory` の allow だけ。`edit` を足さない | できた                 | 既存の `edit` の規則はそのまま                                    |
| codex    | `--add-dir`                                           | できなかった           | 読み取り専用の追加ディレクトリの引数がない。runner の検出で止める |
| copilot  | `--add-dir`                                           | できなかった           | 同上                                                              |

読み取りだけにできるかどうかに関わらず、review の段の後でプロダクトの worktree に新しい未コミットの変更が出ていれば、`runWithRetry` が `blocked: review stage changed product repositories that are read-only: <repo>:<path>` で失敗にする（保護の block と同じ扱い）。Git 状態の変化（HEAD の移動など）は既存の検査が止める。

### 5.3. 確認結果

- `tests/src/exec/task-repos.test.ts` に、claude の引数に `Edit(` と `--allowedTools` が含まれないこと、opencode の注入に `edit` が無いこと、codex・copilot の引数、mode と環境の対応、review 中の変更の検出を追加し、通った。
- `npm run typecheck` と `npm run lint:ts`（エラー 0）を通した。

### 5.4. 申し送り

- 項目が `waiting` になる点: schedule の review の段では `protectionBlock` で失敗し、既存の block の経路で止まる。register の run は mode が常に `edit` で、review の段を持たないため、register の `waiting` 遷移はこの件では足していない。
- 「変更が出たら止まる」検査は関数（`changedProductStatuses`）の単体テストまでで、`runWithRetry` を通した block の統合テストは書いていない。必要なら別の項目にする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
