---
specdojo:
  id: prj-0001:pjr-szcr-ys9m-opencode-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-22T12:41:46Z"
  due_on: "2026-11-23"
  derived_from:
    - PJR-YS9M
---

# PJR-SZCR opencode の executor で検証のコマンドと git rm を流せるかを確かめる

## 1. 概要

PJR-YS9M で prj-0001 の opencode の executor に許したコマンドが、qwen の executor の実際の run で拒まれないことを確かめる確認用の todo。

## 2. 入力

- YS9M の反映（070630934）の後に、オーケストレーターが qwen-executor で流す（indie の承認、2026-11-22）。
- 消す対象のファイルは 55e17ba32 で置いた。

## 3. 完了条件

- `docs/ja/projects/prj-0001/tmp/ys9m-delete-check.txt` を `git rm docs/ja/projects/prj-0001/tmp/ys9m-delete-check.txt` で消す。`rm` や編集の道具では消さない。
- `npx vitest run tests/src/exec/agent-config-allow-commands.test.ts` と `npx tsc --version` と `npx eslint --version` を流し、出力を個票の対応結果に書く。
- 上の各コマンドが拒まれずに流れたか、拒まれたならそのコマンドと拒否の文を、個票の対応結果の表に 1 行ずつ書く。拒まれても成功を装わない。
- ほかのファイルは変えない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、「なし」と書く。
- `npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                       | 担当     | 状態 | メモ |
| --- | ------------------------------------------ | -------- | ---- | ---- |
| 1   | `git rm` で確かめ用のファイルを消す        | executor | open | -    |
| 2   | 検証のコマンドを流し、結果を対応結果に書く | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
