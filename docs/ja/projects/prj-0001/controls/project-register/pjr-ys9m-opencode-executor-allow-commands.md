---
specdojo:
  id: prj-0001:pjr-ys9m-opencode-executor-allow-commands
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  registered_at: "2026-11-22T03:13:50Z"
  derived_from:
    - PJR-7KQT
---

# PJR-YS9M opencode の executor が sandbox で検証のコマンドとファイルの削除を流せない

## 1. 概要

qwen（opencode）の executor は npx・rm・git rm を拒まれ、検証を流せないまま報告する。PJR-7KQT は claude の分だけを直した。opencode の executor にも検証のコマンドを許す設定を足し、easy に振る基準も見直す。

## 2. 入力

- 2026-11-22、F6MC は検証を流せず 2 回止まり、HCHH は 2 ファイルを消せず止まった。
- 利用者の承認（2026-11-22、indie）で起票した。

## 3. 完了条件

- 配布する opencode の executor の定義（`templates/opencode/agents/` の下）の bash の許可に、claude の `settings.edit.json`（PJR-7KQT）と同じ検証のコマンド（`npx tsc`・`npx vitest`・`npx eslint`・`npx markdownlint-cli2` など）を足す。あわせて、`docs/`・`src/`・`tests/` の下に限った `git rm` を許す（利用者の決定、2026-11-22、indie）。危ないコマンド（`git push`・`rm -rf`・`gh` など）は許さない（テストで確かめる）。
- `exec-defaults.yaml` の `providers.<name>.allow_commands`（今は claude の edit mode だけ）を、opencode の起動時の設定にも足す（テストで確かめる）。schema を直す。
- F6MC で `git diff*` が許されているのに `git diff <file>` が拒まれた原因を調べ、個票の対応結果に書く。配布する定義の範囲で直せるものは直す。
- prj-0001 の `.opencode/agents/` と、easy に振る基準（`.specdojo/exec-defaults.yaml` の routing）は保護された設定のため変えない。変える案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとで行う。
- `exec-config-guide` に、opencode の executor に許すコマンドと `allow_commands` の書き方を書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- 保護された設定の反映の後に、オーケストレーターが qwen の executor で 1 件流し、検証のコマンドと `git rm` が拒まれないことを確かめてから close する。
- 2 回目の実行（2026-11-22）: 1 回目の `OPENCODE_PERMISSION` は global の `permission` に足され、エージェントの定義の `"*": deny` より前に並ぶため効かない。オーケストレーターが opencode 1.19.6 の `opencode debug agent opencode-executor --tool bash` で、注入した `echo` の許可が拒まれることを確かめた。`OPENCODE_CONFIG_CONTENT` でエージェントの `permission.bash` に入れると定義の規則の後ろに並び、足したコマンドだけが通ることも確かめた（`whoami` は拒まれたまま）。次を直す。
  - `allow_commands` を `OPENCODE_PERMISSION` ではなく `OPENCODE_CONFIG_CONTENT` で、起動するエージェントの `permission.bash` に入れる。既存の値（`opencode-permissions.ts` の extra roots の注入など）と混ぜて保つ。
  - 足した規則が定義の `"*": deny` より後ろに並び、足したコマンドだけが許され、ほかは拒まれ続けることを単体テストで確かめる。
  - 個票の対応結果の `OPENCODE_PERMISSION` の `_ASSUMPTION_` を、この確かめの結果に置き換え、`exec-config-guide` の説明を直す。

## 4. 作業内容

| No  | 作業                                                | 担当         | 状態 | メモ                                    |
| --- | --------------------------------------------------- | ------------ | ---- | --------------------------------------- |
| 1   | 配布する opencode の executor の定義に許可を足す    | executor     | done | 検証のコマンドと範囲を限った `git rm`   |
| 2   | `allow_commands` を opencode にも効かせる           | executor     | done | schema とテストを含む                   |
| 3   | `git diff <file>` が拒まれた原因を調べる            | executor     | done | ログが無く仮説。対応結果 5.2 に記載     |
| 4   | prj-0001 の保護された設定の変更案を書く             | executor     | done | 対応結果 5.3 に記載                     |
| 5   | 保護された設定を反映し、qwen の executor で確かめる | orchestrator | open | 利用者の承認のもとで行う。executor 不可 |

## 5. 対応結果

### 5.1. 実施内容

- `templates/opencode/agents/opencode-executor.md` の bash に `npx tsc`・`npx vitest`・`npx eslint`・`npx markdownlint-cli2`・`npx specdojo`・`git diff *` と、`docs/`・`src/`・`tests/` の下に限った `git rm` を許可した。`git rm -r`・`-f`・`--force`、`rm -rf` は deny を足した。`git push`・`gh` は従来どおり deny。
- `providers.opencode.allow_commands` を `src/exec/agent-config.ts` と `exec-defaults.schema.yaml` に足した。edit mode の起動コマンドの前に、bash の allow 規則を入れた `OPENCODE_PERMISSION` 環境変数を置く。review・report mode には足さない。
- `exec-config-guide` に「opencode の edit executor に許すコマンド」を足した。
- `tests/src/exec/agent-config-allow-commands.test.ts` に、起動コマンドの生成と、配布する定義の許可・拒否を確かめるテストを足した。

### 5.2. `git diff <file>` が拒まれた原因

- 配布する定義の `"git diff*": allow` は `git diff <file>` に一致するため、パターン自体は原因ではない。F6MC の executor のログは今回の worktree に無く、実際のコマンドは確かめられていない。
- _ASSUMPTION_: opencode は `|`・`&&`・`;` で区切った各部分を別々に照合する。`git diff <file> | head` のような複合コマンドは、`head` などが許可に無く、全体が拒まれる可能性が高い。次のアクション: F6MC の実際の拒否時のコマンドをオーケストレーターが確かめる。
- 配布する定義の範囲では、`"git diff *": allow` を足して引数付きを明示した。複合コマンドの回避は、定義の `bash` の注意書きで足りる範囲に留めた。

### 5.3. 保護された設定の変更案（反映は利用者の承認のもとで行う）

- `.opencode/agents/opencode-executor.md` は、`config scaffold --provider opencode --force` で新しい配布定義を当て直す（手を加えた箇所は差分を確認する）。
- `.specdojo/exec-defaults.yaml` の `providers.opencode.allow_commands` は、リポジトリ固有の検証コマンドがある場合だけ足す。今は不要。
- easy の routing（`qwen-executor`）は、検証と削除を伴う項目では外す案を出す。基準は「検証のコマンドを流す、またはファイルを削除する項目は medium 以上」とし、反映後の qwen の確認（作業 5）が通るまで easy は検査・削除を伴わない文書に限る。
- _ASSUMPTION_: opencode の `OPENCODE_PERMISSION` が agent 定義の `"*": deny` より後に評価され allow が勝つかは、実機で未確認。作業 5 の qwen の 1 件で確かめ、勝たない場合は定義側に許可を足す方式へ切り替える。

### 5.4. CHANGELOG に書く事項

- 区分: Added
- 文案: opencode の executor に検証のコマンド（`npx tsc`・`npx vitest`・`npx eslint`・`npx markdownlint-cli2`）と、`docs/`・`src/`・`tests/` の下に限った `git rm` を許した。`providers.opencode.allow_commands` で、リポジトリごとの検証コマンドを足せる。

### 5.5. 残課題

- 作業 5（保護された設定の反映と qwen の executor での確認）はオーケストレーターが行うため `open` のまま残す。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
