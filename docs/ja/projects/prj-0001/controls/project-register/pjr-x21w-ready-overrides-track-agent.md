---
specdojo:
  id: prj-0001:pjr-x21w-ready-overrides-track-agent
  type: project
  status: deprecated
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: rejected
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-18T22:10:09Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-18T22:17:34Z"
  conclusion: strategy を正本とし track を直接編集しない規則（sch-rulebook）に照らすと、runner が strategy の段の指定で claim したのは設計どおりの動きだった。原因は track を直接編集したことで、残る問題（直接の編集を検出しないこと、経路ごとの解決の順の違い、設計ガイドの抜け）は PJR-YGZF へ引き継ぐ
  commit_type: fix
  commit_scope: exec
---

# PJR-X21W schedule のタスクに指定した executor が、ready の作り直しで strategy の段の指定に上書きされる

## 1. 課題内容

track のタスクに書いた agent.executor が、ready の作り直しで strategy の段の指定に無条件で上書きされ、振り分けが効かない

## 2. 入力

- kata-slim-2 の残りのタスクを commit b210e5b5a で sch-track-kata-slim-2.yaml の agent.executor に argon-executor（15 件）と agy-opus-executor（14 件）として振り分けたが、2026-11-18 の夜間ループでは 29 件すべてが strategy の段の指定（040 は sol-executor、060 は opus-executor）で claim された。
- src/exec/schedule/schedule.ts の ready を作る処理（386 行付近）は resolveAgentAssignment の結果で task.agent を無条件に上書きする。src/exec/task-view.ts と src/exec/run/schedule-mode.ts は task.agent が未指定のときだけ同じ解決を使う。
- resolveAgentAssignment は taskIdToAgent・localIdSuffixToAgent・phaseSetSuffixToAgent の順に見るが、track のタスク節点の agent（src/shared/schedule-index.ts で読む）は見ない。
- sol-executor は上限で止まっていたため、040 の段は毎回上限を検知して opus-executor へ切り替わって進んだ。

## 3. 影響範囲

| 観点         | 影響                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| スコープ     | schedule のタスクの executor の解決（ready の作り直し）。register の実行と `--executor-by` の指定は対象外 |
| スケジュール | track で振り分けても効かず、上限に当たった agent の切り替えに頼って進むため、並列の分散が効かない         |
| コスト       | 振り分けたはずの agent が使われず、特定の agent の割り当てだけを消費する                                  |
| 品質         | 成果物の品質への直接の影響はない。指定した agent と実際に動いた agent が黙って食い違う                    |
| 関係者       | DEV（runner の修正）、オーケストレーター（track での agent の振り分け）                                   |

## 4. 対応方針

| 項目     | 内容                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------- |
| 原因     | ready を作る処理が、track のタスクの agent を見ずに strategy の解決結果で `task.agent` を無条件に上書きする |
| 対応策   | track のタスクに agent の指定があれば、strategy の段・上書きの指定より優先する。解決の順を 1 か所にそろえる |
| 依存事項 | なし                                                                                                        |
| 完了条件 | 下の「完了条件」を満たす                                                                                    |

完了条件:

- track のタスクに `agent.executor`（と `agent.reporter`）がある場合、ready の作り直し（`src/exec/schedule/schedule.ts`）・タスクの表示（`src/exec/task-view.ts`）・実行（`src/exec/run/schedule-mode.ts`）のどれでも、strategy の段・上書きの指定よりそちらが使われる。
- track のタスクに指定がない場合は、今までどおり strategy の段・上書きの指定が使われる。
- 上の 2 つの順を確かめる単体テストがある（track の指定あり・なしの両方）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証（test-integration）を通す。
- CHANGELOG の書き方は、プロジェクトの運用メモの決まりに従う。公開済みの版の節は変えない。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- `docs/ja/projects/prj-0001/schedule/sch-track-kata-slim-2.yaml`（振り分けた track）
- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-slim-2.yaml`（段の指定）
