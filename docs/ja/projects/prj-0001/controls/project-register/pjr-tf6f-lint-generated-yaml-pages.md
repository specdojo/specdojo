---
specdojo:
  id: prj-0001:pjr-tf6f-lint-generated-yaml-pages
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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

| No  | 作業                                         | 担当                  | 状態 | メモ                                                                                                                      |
| --- | -------------------------------------------- | --------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | YAML を変えた run で表示のページを作り直す   | DEV                   | done | `src/exec/worktree-yaml-pages.ts`。親検証の前に、ページより新しい YAML を時刻で見つけるため、再開で取り込んだ YAML も対象 |
| 2   | `lint-md-changed` の対象に表示のページを足す | DEV                   | done | `tools/lint-changed.mjs` の `withYamlPages`。ページは .gitignore のままで commit の対象に入らない                         |
| 3   | テストと文書、CHANGELOG の文案               | DEV                   | done | 単体テスト・統合テストで `# #` の壊れ方を `lint-md-changed` で止める。`exec-operation-guide` に追記                       |
| 4   | JSEY と、YAML を壊した run での確かめ        | specdojo-orchestrator | open | 統合の後にオーケストレーターが行うため、executor では実施しない                                                           |

## 5. 対応結果

実施内容:

- 親検証の前の作り直し: `src/exec/worktree-yaml-pages.ts` を追加し、`runConfiguredParentValidationBatch`（`src/exec/run/agent.ts`）が親検証の gate の中で、検証を流す前に呼ぶ。対象は `docs/ja`・`docs/en` の YAML のうち、表示のページ（マーカー付き）より更新時刻が新しいもの、または変更・未追跡でページがまだ無いもの。executor の変更も、`--resume` で統合先から取り込んだ変更も、時刻で見つける。該当があるときだけ worktree の CLI で `specdojo build --only yaml-pages` を流す。該当がなければ作り直さない。
- 作り直しの失敗: runner の検証 `yaml-pages`（コマンド `specdojo build --only yaml-pages`）を `failed` として記録し、生成の出力を失敗の出力のログに残す。`failedParentValidationReason` が `yaml-pages` を挙げ、親検証の失敗になる。どの YAML の生成で止まったかを示すため、`buildYamlPages` はページの描画の例外に YAML のパスを付ける（`Failed to render YAML page: <path>`）。成功のときは記録を足さず、記録済みの親検証の並びは変わらない。worktree に SpecDojo の CLI が無い場合は、準備のときと同じく作り直しを飛ばす。
- `lint-md-changed`・`lint-fm-changed`: `tools/lint-changed.mjs` が、変えた YAML の表示のページが作業ツリーにあれば検査の対象に足す。ページは .gitignore のままで、commit の対象に入らない。
- テスト: 単体テスト（`tests/src/exec/worktree-yaml-pages.test.ts`、`tests/tools/lint-changed.test.ts`）で対象の選び方と失敗の記録を、統合テスト（`tests/src/exec/worktree-yaml-pages.integration.test.ts`）で、YAML のコメントを `# #` にした run が作り直しの後の `lint-md-changed` で MD025 の失敗になること、YAML を変えない run では作り直さないこと、commit 済みの取り込みの変更も見つけることを確かめる。
- 文書: `exec-operation-guide` の executor / reporter pipeline の節に、親検証の前に表示のページを作り直して検査することを書いた。

制約と残課題:

- 統合先から取り込んだ新しい YAML（ページがまだ無いもの）は、ほかの YAML が変わっていなければ作り直しの対象にならない。変更していないページは作り直しで書き換わらないため、内容が同じまま更新時刻だけが古いページは、以後の親検証で作り直しが重ねて走ることがある（YAML を変えた run に限る）。
- 保護された設定（`exec-defaults.yaml`・`package.json`）の変更は要らない。
- 作業内容の No 4（PJR-JSEY での runner の確かめと、YAML を壊した実際の `exec run --register` での確かめ）は、統合の後にオーケストレーターが行う。

### 5.1. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: `exec run` の親検証の前に、executor が変えた YAML や再開で取り込んだ YAML の表示のページを作り直し、`lint:md:changed`・`lint:fm:changed` の対象に含めるようにした。古い表示のページのまま検査して、壊れたページを統合の後まで見逃すことがなくなる（PJR-TF6F）。

## 6. 関連ドキュメント

- [[specdojo:exec-operation-guide|exec運用ガイド]]: 親検証の前の表示のページの作り直しを追記した。
