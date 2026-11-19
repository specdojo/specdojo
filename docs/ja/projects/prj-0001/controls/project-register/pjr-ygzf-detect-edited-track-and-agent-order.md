---
specdojo:
  id: prj-0001:pjr-ygzf-detect-edited-track-and-agent-order
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-18T22:17:07Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-X21W
  commit_type: fix
  commit_scope: exec
---

# PJR-YGZF 手で直した schedule の track に気づけず、経路ごとに agent の解決の順が違う

## 1. 課題内容

strategy を正本とする規則に反して track を直接編集しても検出されず、ready の作り直しとタスクの表示・実行で agent の解決の順が食い違う

## 2. 入力

- sch-rulebook は strategy と成果物カタログを SSOT とし、生成後の `sch-track-<track>.yaml` を直接編集しないと定め、禁止事項にも挙げている。schedule-design-guide は agent を --executor-by、strategy の phase の agent（`owner_rules[].phase_overrides[].agent` で成果物ごとに上書き）、自動選択の順で解決すると書く。
- 2026-11-18 にオーケストレーターが sch-track-kata-slim-2.yaml の agent.executor を直接編集した（commit b210e5b5a）が、エラーにも警告にもならず、runner は strategy の段の指定で claim した。track の鮮度は strategy とのファイル更新時刻だけで判定している（src/exec/run/schedule-mode.ts の findStaleGeneratedTracks）。
- src/exec/schedule/schedule.ts の ready を作る処理は resolveAgentAssignment（strategy 由来）で task.agent を無条件に上書きする。src/exec/task-view.ts と src/exec/run/schedule-mode.ts は track の task.agent を先に使い、未指定のときだけ strategy から解決する。
- schedule-design-guide の「トラックへ展開する情報」の表に agent がないが、src/schedule/build.ts は phase の agent と `phase_overrides` の agent を track へ展開している。
- PJR-X21W は track の指定を優先させる方向で起票したが、strategy を正本とする規則に照らして reject し、本項目へ引き継いだ。

## 3. 影響範囲

| 観点         | 影響                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------- |
| スコープ     | schedule の track の鮮度の判定、schedule のタスクの agent の解決、schedule-design-guide の展開の表 |
| スケジュール | track を直接直した指定が黙って無視され、agent の振り分けが計画どおりに効かない                     |
| コスト       | 意図しない agent の割り当てを消費する                                                              |
| 品質         | 成果物への直接の影響はない。指定と実際に動いた agent が食い違っても気づけない                      |
| 関係者       | DEV（runner と schedule の修正）、オーケストレーター（strategy での agent の振り分け）             |

## 4. 対応方針

| 項目     | 内容                                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | track の鮮度を更新時刻だけで判定し、内容が strategy から作った結果と違っても検出しない。agent の解決の順が経路ごとに違う                       |
| 対応策   | strategy から作り直した結果と track の内容が違えば検出する。agent の解決を strategy を正とする 1 つの順にそろえ、設計ガイドの表に agent を足す |
| 依存事項 | なし                                                                                                                                           |
| 完了条件 | 下の「完了条件」を満たす                                                                                                                       |

完了条件:

- strategy を持つ track で、`sch-track-<track>.yaml` の内容が strategy から作り直した結果と違う場合（直接の編集）、`exec validate` と `exec run --auto` の前の検査がそれを検出し、track 名と違う項目を示して `schedule build --track <track> --force` を案内する。止めるか警告にとどめるかは executor が決め、理由を個票の対応結果に書く。
- schedule のタスクの agent は、ready の作り直し（`src/exec/schedule/schedule.ts`）・タスクの表示（`src/exec/task-view.ts`）・実行（`src/exec/run/schedule-mode.ts`）のどれでも、`--executor-by` / `--reporter-by`、strategy の `owner_rules[].phase_overrides[].agent`、phase の `agent`、自動選択の同じ順で決まる。
- 上の 2 つを確かめる単体テストがある（track を直接直した場合と直していない場合、phase_overrides がある場合とない場合）。
- `docs/ja/specdojo/guides/schedule-design-guide.md` の「トラックへ展開する情報」の表に `agent` を足し、展開する理由（plan だけで実行できるようにするため）と、指名を変えるときは strategy を直すことを書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証（test-integration）を通す。
- `CHANGELOG.md` は変えず、個票の対応結果の `### <n>.<m>. CHANGELOG に書く事項`（Markdown の連番ルールに従う）に区分（追加・変更・不具合修正など）と行の文案を書く。影響がなければ「なし」と書く。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:sch-rulebook]]（strategy を SSOT とし、track を直接編集しない規則）
- `docs/ja/specdojo/guides/schedule-design-guide.md`（agent の解決の順と、トラックへ展開する情報）
- `docs/ja/projects/prj-0001/schedule/sch-track-kata-slim-2.yaml`（直接編集した track）
