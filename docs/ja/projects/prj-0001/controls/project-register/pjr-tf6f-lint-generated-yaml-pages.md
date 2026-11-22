---
specdojo:
  id: prj-0001:pjr-tf6f-lint-generated-yaml-pages
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-22T03:12:37Z"
  derived_from:
    - PJR-RS2P
---

# PJR-TF6F YAML の成果物から作る表示のページが、統合の前の lint で古いまま検査される

## 1. 概要

表示のページは git の管理外で worktree の準備のときに作られ、executor が YAML を変えても親の検証の lint-md は古いページを見る。RS2P の誤りは統合の後の別の run で見つかった。

## 2. 入力

- 2026-11-22、RS2P が ifx-index.yaml のコメントを「# #」にし、以後の HCHH・BNAV の lint-md が止まった。
- 利用者の承認（2026-11-22、indie）で起票した。
- orchestrator の調べ（2026-11-22）: 表示のページは src/exec/worktree.ts の generateWorktreeArtifacts が worktree の準備のとき（依存の install の直後）に 1 回だけ作り、executor が YAML を変えた後も、--resume で統合先を取り込んだ後も作り直されない。
- orchestrator の調べ（2026-11-22）: lint-md-changed（tools/lint-changed.mjs）は HEAD からの差分と追跡していない `*.md`（--exclude-standard）だけを見るため、.gitignore にある表示のページは作り直しても検査されない。ページは YAML と同じ階層の generated/`<名前>.md`（src/docs/yaml-pages.ts）。
- 決定（2026-11-22、indie）: 作り直しは YAML を変えた run だけにする。難しさは hard、executor は opus-executor、代わりは sonnet-executor。PJR-MS7X の後に流す。

## 3. 完了条件

- 親の検証の前に、executor が YAML（表示のページを作る対象）を変えた run では、worktree で表示のページを作り直す（`specdojo build --only yaml-pages` と同じ生成）。`--resume` で統合先を取り込んだ後も、YAML が変わっていれば同じく作り直す。作り直しが失敗したときは、どの YAML の生成で止まったかを示して、親の検証の失敗として扱う。
- YAML を変えない run では作り直さず、親の検証の時間を増やさない（indie の判断、2026-11-22）。
- `lint-md-changed`（`tools/lint-changed.mjs`）の対象に、変えた YAML の表示のページ（同じ階層の `generated/<名前>.md`）を足す。ページは git の管理外のままとし、commit の対象に入れない。
- RS2P と同じ壊れ方（YAML のコメントを `# #` にする）を、統合の前の親の検証で止めることをテストで確かめる。対象のページを選ぶ処理は単体テスト、runner の流れ（作り直しと検証の失敗）は統合テストで確かめる。
- `exec-operation-guide` の親の検証の節に、表示のページを作り直して検査することを書く。
- `exec-defaults.yaml`・`package.json` などの保護された設定の変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとでオーケストレーターが行う。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分「不具合修正」と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- runner のコードを変えるため、統合の後にオーケストレーターが PJR-JSEY で runner の動作を確かめる。加えて、YAML を壊した run が統合の前の親の検証で止まることを、実際の `exec run --register` で 1 回確かめる。

## 4. 作業内容

| No  | 作業                                         | 担当                  | 状態 | メモ                      |
| --- | -------------------------------------------- | --------------------- | ---- | ------------------------- |
| 1   | YAML を変えた run で表示のページを作り直す   | DEV                   | open | 再開で取り込んだ後も      |
| 2   | `lint-md-changed` の対象に表示のページを足す | DEV                   | open | commit の対象には入れない |
| 3   | テストと文書、CHANGELOG の文案               | DEV                   | open | RS2P と同じ壊れ方を止める |
| 4   | JSEY と、YAML を壊した run での確かめ        | specdojo-orchestrator | open | 統合の後                  |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
