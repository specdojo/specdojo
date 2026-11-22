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

## 4. 作業内容

| No  | 作業                                                | 担当         | 状態 | メモ                                  |
| --- | --------------------------------------------------- | ------------ | ---- | ------------------------------------- |
| 1   | 配布する opencode の executor の定義に許可を足す    | executor     | open | 検証のコマンドと範囲を限った `git rm` |
| 2   | `allow_commands` を opencode にも効かせる           | executor     | open | schema とテストを含む                 |
| 3   | `git diff <file>` が拒まれた原因を調べる            | executor     | open | -                                     |
| 4   | prj-0001 の保護された設定の変更案を書く             | executor     | open | `.opencode/agents/` と routing        |
| 5   | 保護された設定を反映し、qwen の executor で確かめる | orchestrator | open | 利用者の承認のもとで行う              |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
