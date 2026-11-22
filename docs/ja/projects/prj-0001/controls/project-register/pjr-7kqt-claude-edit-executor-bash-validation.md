---
specdojo:
  id: prj-0001:pjr-7kqt-claude-edit-executor-bash-validation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-21T09:00:54Z"
  completed_at: "2026-11-22T03:28:17Z"
  conclusion: 配布する settings.edit.json と exec-defaults の allow_commands で、claude の edit executor が検証のコマンドを流せるようにした。prj-0001 の設定も雛形にそろえた。
---

# PJR-7KQT Claude の edit executor の権限設定がコマンドを許可せず、plan が求める検証を流せない

## 1. 課題内容

templates/claude/settings.edit.json の allow は Edit(**) だけでコマンドを1つも許可しない。claude -p は承認を求められないため、executor が Prettier・markdownlint・Slidev build などの検証を流すと拒まれ incomplete で止まる。claude-executor.md は役割を「編集と検証」とし tools に Bash を挙げており食い違う。利用者のリポジトリごとに異なる検証コマンドをどの範囲で許すかを決める

## 2. 入力

- 発端は利用者のプロジェクト coderdojo-lessons-specdojo の prj-0001:PJR-AF5N（SpecDojo 0.9.2、2026-11-21）。
- sonnet-executor（claude、mode: edit）で register 項目を実行したところ、教材2ファイルの編集はできたが、npx prettier・npx markdownlint・npx slidev build がすべて拒まれ、`completion_status:` incomplete で止まった。モデルを opus に替えても同じ設定を使うため変わらない。
- 利用者のリポジトリで settings.edit.json の allow に Bash(npx prettier `*)`・Bash(npx markdownlint-cli2 `*)`・Bash(npx markdownlint `*)`・Bash(npx slidev `*)` を足すと、opus-executor は Prettier と Slidev build を流せた。ただし雛形を config scaffold --force で当て直すと元に戻る。
- exec-config-guide の provider 設定の節は Edit の allow と deny の範囲だけを説明し、コマンドの許可には触れていない。関連：[[prj-0001:pjr-tm1b-claude-edit-allowlist-too-narrow]]（Edit の範囲を広げた項目。Bash は扱っていない）。

## 3. 影響範囲

| 観点         | 影響                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------- |
| スコープ     | claude の edit の executor の権限設定（`templates/claude/settings.edit.json`）と exec-defaults |
| スケジュール | なし（回避策: 利用者が設定を手で直す。`scaffold --force` で戻る）                              |
| コスト       | 小さい（runner と CLI の一部の修正）                                                           |
| 品質         | plan が求める検証を executor が流せず、incomplete で止まる                                     |
| 関係者       | 利用者のプロジェクト（coderdojo-lessons-specdojo など）と prj-0001 のオーケストレーター        |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 配布する `settings.edit.json` の allow が `Edit` だけで、コマンドを 1 つも許していない。`claude -p` は承認を求めないため、Bash は拒まれる                                                                                                                                                                                                                                           |
| 対応策   | 利用者の決定（2026-11-21、indie）で A+B とする。A: 配布する設定の allow に、よく使う検証のコマンド（`npm run`・prettier・markdownlint-cli2・eslint・tsc・vitest など）を足す。B: `exec-defaults.yaml` の claude の provider の設定に、許すコマンドを足すキーを用意し、起動時に設定へ足す。`scaffold --force` で当て直しても B は残る。deny（`git push` など）は今までどおり優先する |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                                                                                                                                                                                                                                                                                        |

- 配布する `settings.edit.json` で、上の検証のコマンドが許される。危ないコマンド（`git push`・`rm -rf` など）は許されない（テストで確かめる）。
- `exec-defaults.yaml` のキーに書いたコマンドが、起動時の設定の allow に足される（テストで確かめる）。schema を直す。
- `exec-config-guide` の provider の設定の節に、コマンドの許可と B のキーの書き方を書く。
- prj-0001 の `.specdojo` の保護された設定は変えない。変える案があれば個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分（追加・変更・不具合修正など）と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

A+B を実装した。

- A: `templates/claude/settings.edit.json` の allow に `npm run`・`npm test`・`npx prettier`・`npx markdownlint-cli2`・`npx markdownlint`・`npx eslint`・`npx tsc`・`npx vitest`・`npx slidev`・`specdojo` を足した。`git push`・`gh` の deny は変えず優先される。
- B: `exec-defaults.yaml` の `providers.<name>.allow_commands`（`Bash(...)` の配列、claude の edit mode のみ）を追加した。起動コマンドへ `--allowedTools` として足すため、`scaffold --force` 後も残る。引用符・バックスラッシュ・改行を含む規則は起動前にエラーにする。schema（`exec-defaults.schema.yaml`）と `src/exec/agent-config.ts` を更新した。
- `exec-config-guide` に「claude の edit executor に許すコマンド」の節を追加した。
- テスト: `tests/src/exec/agent-config-allow-commands.test.ts` を追加し、許可と非許可（`git`・`rm`・`gh` が allow に無いこと、deny が残ること）と `--allowedTools` の付与を確かめた。`provider-scaffold.test.ts` の allow 期待値を `toContain` に直した。
- 確認: 関連 vitest・`npm run typecheck`・`npm run lint:ts`（error 0）・Prettier を通した。親の検証は runner が実行する。
- 未確認: `--allowedTools` が実際の `claude -p` で deny に負けず効くことは、実機（クォータ消費）では確かめていない。人が 1 回確認する。
- `.specdojo` の保護された設定は変えていない。変える案: `.specdojo/exec-defaults.yaml` の `providers.claude` に `allow_commands` を必要に応じて足す。

### 5.1. CHANGELOG に書く事項

- 区分: 追加
- 文案: claude の edit executor が検証コマンド（`npm run`・prettier・markdownlint-cli2・eslint・tsc・vitest・slidev）を実行できるよう、配布する `settings.edit.json` の allow を拡張し、`exec-defaults.yaml` に `providers.claude.allow_commands` を追加した。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tm1b-claude-edit-allowlist-too-narrow]]
