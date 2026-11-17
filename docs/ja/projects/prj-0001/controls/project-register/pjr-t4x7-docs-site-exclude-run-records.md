---
specdojo:
  id: prj-0001:pjr-t4x7-docs-site-exclude-run-records
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  registered_at: "2026-11-17T05:12:32Z"
  derived_from:
    - PJR-9BY9
    - PJR-G85C
  commit_type: fix
  commit_scope: docs-site
---

# PJR-T4X7 run 単位の plan と result を文書サイトの対象から外し、docs:build のメモリ不足を直す

## 1. 概要

PJR-9BY9 で execution/runs/ へ移した plan・result が srcExclude とリンクの付け替えから外れ、docs:build が 8GB のヒープで止まる

## 2. 入力

- 2026-11-17 に orchestrator が npm run docs:build を流すと、約 19 分後にページの描画（rendering pages）で JavaScript heap out of memory になり SIGABRT で止まった。PJR-G85C の close 時は約 113 秒で通っていた
- packages/docs-site/.vitepress/config.mts の srcExclude は `docs/**/execution/exec/plans/**` と `docs/**/execution/exec/results/**` だけを外す。exec-record-links.ts の `EXEC_RECORD_PATH` も execution/exec/(plans|results)/ だけに一致する
- docs 配下の execution/runs/ には plan.md・result.md が 3,323 件あり、途中までの dist には execution/runs/ の HTML が 1,826 件出ていた

## 3. 完了条件

- 文書サイトの `srcExclude` が、run 単位の `execution/runs/<origin>/<item>/<run>/` 配下の `plan.md`・`result.md` を外す。旧の `execution/exec/plans/`・`execution/exec/results/` の除外も残す。
- `exec-record-links.ts` の付け替えが、run 単位の `plan.md`・`result.md` への Markdown リンクも GitHub のファイル表示へ付け替える。`config.mts` の `isExecPlanLink`・`isExecResultLink` など、旧の場所だけを見ている判定も run 単位の場所に合わせる。
- 実行記録の入口（`exec-records.md` などの生成物）から run 単位の plan・result へのリンクが、dead link にならない。
- 付け替えと除外の判定に、run 単位の場所と旧の場所の両方の単体テストがある（`tests/packages/docs-site/exec-record-links.test.ts` など）。
- `npm run docs:build` が、`package.json` の既定のヒープ（8GB）で通る。executor の sandbox では build を起動できないため、orchestrator が統合の後に手元で流し、時間と dead link の件数を確かめる。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------ | ---- | ---- | ---- |
| 1   | 除外とリンクの付け替えを run 単位の場所に合わせる      | 未定 | open | -    |
| 2   | 単体テストを足す                                       | 未定 | open | -    |
| 3   | 統合の後に docs:build を流して確かめる（orchestrator） | 未定 | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-9by9-exec-run-record-migration]]
- [[prj-0001:pjr-g85c-vitepress-exclude-exec-records]]
