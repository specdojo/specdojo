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

### 5.1. 解決内容

- track の内容の検出: `src/exec/schedule/schedule.ts` に `findEditedGeneratedTracks` と `findEditedGeneratedTrackWarnings` を足した。strategy を持つ track ごとに `buildScheduleTrack`（`schedule build` と同じ生成）で作り直し、track の `tasks` と `settings` を比べる。違いは `<タスク>: <項目>`（`agent` などの変更）、`<タスク>: missing`、`<タスク>: not generated` で示す。タスクは `id`、`id` がなければ `local_id`・`phase_suffix`・`phase_set`・`cycle`・`iteration` で照合する。警告には track 名・違う項目（10 件まで、残りは件数）・`specdojo schedule build --track <track> --force` を出す。`exec validate`（`validateAll`）と、`exec run --auto` の前（`runBatchMode` の開始時）で出す。track がない・strategy より古い場合は既存の鮮度の警告に任せ、strategy を作り直せない場合は `schedule build` のエラーに任せる。
- 止めずに警告にとどめた理由: agent は下のとおり実行時に strategy から解決するので、直接直した `agent` が実行に効くことはない。比較では直接の編集と、作り直していないカタログの変更を区別できない。止めると、カタログを変えるたびに `exec refresh` と `exec cycle` の validate が全 track で止まる。
- agent の解決の順: `src/exec/strategy.ts` に `resolveScheduledTaskAgent` を足した。strategy を持つ track のタスクは、pass の `agent`、`owner_rules[].phase_overrides[].agent`、phase の `agent` の順で解決し、track や ready.json に写った `agent` は使わない。strategy のない track のタスクだけはタスク自身の `agent` を使う。ready の作り直し（`src/exec/schedule/schedule.ts`）・タスクの表示（`src/exec/task-view.ts`）・実行（`src/exec/run/schedule-mode.ts`）の 3 経路をこの関数にそろえた。`--executor-by` / `--reporter-by` が先に効き、指名がなければ自動選択になる順は `src/exec/run/schedule-prepare.ts` のまま変えていない。
- 設計ガイド: `docs/ja/specdojo/guides/schedule-design-guide.md` の「トラックへ展開する情報」の表に `agent` を足し、展開する理由（plan だけで実行者を確かめられる）と、指名を変えるときは strategy を直して作り直すこと、直接直すと警告することを書いた。agent の解決の順の記述を、`phase_overrides` を含む 1 つの順と 3 経路で同じことに直した。

### 5.2. 確認結果

- 単体テスト: `tests/src/exec/schedule/validation.test.ts`（track を直した場合と直していない場合、`phase_overrides` がある場合とない場合、strategy より古い track）、`tests/src/exec/strategy.test.ts`（`resolveScheduledTaskAgent`：phase の `agent`、`phase_overrides`、strategy に指名がない場合、strategy のない track）、`tests/src/exec/task-view.test.ts`（タスクの表示で track を直した場合と直していない場合、`phase_overrides`）を足し、関連するテストとあわせて通った。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run test:integration` は親 runner が実行する。
- 実プロジェクトで `exec validate --schedule-only` を実行すると、`sch-track-planning.yaml` が strategy から作り直した結果と違うと警告した（`sch-defaults-020` の `depends_on`、`tml-index` の 4 タスクが生成されない）。`sch-track-kata-slim-2.yaml` は警告されなかった。

### 5.3. 再発防止策

- track を直接直すと、`exec validate` と `exec run --auto` の前に警告が出る。直した `agent` は実行に使われない。

### 5.4. 迷った点と次のアクション

- `sch-track-planning.yaml` の違いは、本項目の範囲外として作り直していない。`schedule build --track planning --force` で作り直すか、別の項目で扱うかをオーケストレーターが決める。
- ready の作り直し（`writeGeneratedCore`）と実行（`runManualMode`）の経路は、共通の `resolveScheduledTaskAgent` の単体テストで確かめた。経路ごとの単体テストはタスクの表示だけにした。

### 5.5. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: schedule のタスクの agent を、ready の作り直し・タスクの表示・実行のどれでも strategy の `phase_overrides`・phase の `agent` の順で解決するようにし、track を直接編集したときに `exec validate` と `exec run --auto` が作り直した結果との違いを警告するようにした。

## 6. 関連ドキュメント

- [[specdojo:sch-rulebook]]（strategy を SSOT とし、track を直接編集しない規則）
- `docs/ja/specdojo/guides/schedule-design-guide.md`（agent の解決の順と、トラックへ展開する情報）
- `docs/ja/projects/prj-0001/schedule/sch-track-kata-slim-2.yaml`（直接編集した track）
