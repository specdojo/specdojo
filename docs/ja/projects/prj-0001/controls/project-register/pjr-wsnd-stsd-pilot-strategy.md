---
specdojo:
  id: prj-0001:pjr-wsnd-stsd-pilot-strategy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: PM
  registered_at: "2026-11-05T11:47:44Z"
  derived_from:
    - PJR-3APD
  approach: strategy-planning
  targets:
    - track:stsd-pilot
---

# PJR-WSND stsd-pilot の strategy と schedule を作り、段 9〜12 を schedule で流せるようにする

## 1. 概要

3APD の段 9〜12（磨き込み・condense・review・確定）を schedule で流すため、track stsd-pilot の strategy を作り、schedule build で展開する

## 2. 入力

- 利用者は、段 9 以降を register の個票ではなく schedule で流す案を選んだ。本番の業務仕様の epic と同じ流し方を、この試行で確かめるため（2026-11-05）
- 段 8 の retrofit は register の個票（PJR-41B4・PJR-YQF1・PJR-RAPC・PJR-PYCY）で流しているため、schedule には retrofit-pass を入れない。stsd-task-execution は段 2〜4 を register で済ませた（PJR-1799・PJR-Q9AW・PJR-MC63）
- 標準の retrofit の profile は retrofit-pass → refine-pass → condense-pass → retrofit-review-pass → finalize-pass で、段 8〜12 と同じ順になる（src/schedule/strategy-profiles.ts）

## 3. 完了条件

- `docs/ja/projects/prj-0001/schedule/sch-strategy-stsd-pilot.yaml` があり、scope は `dct-data-model-stsd` の 5 件（`local_ids` で指定）である。`approach_rules` は、retrofit の 4 件（`stsd-register-entry`・`stsd-routine-run`・`stsd-deliverable`・`stsd-job-run`）を `reflect-implementation`、`stsd-task-execution` を `confirm-deliverable` とする。`schedule strategy generate` で作り、手で直した箇所は理由を YAML のコメントに書く。
- 4 件の phase set は `refine-pass` → `condense-pass` → `retrofit-review-pass` → `finalize-pass` の順で、`retrofit-pass` を含まない（段 8 は register で済ませるため）。`stsd-task-execution` は `retrofit-review-pass` → `finalize-pass` だけとする。
- 各 phase の `description` に、確定した Kata（PJR-PT5N）に従うことと、図は図の rulebook の閾値を超える場合だけ分けることを書いている。
- `npx specdojo schedule build --track stsd-pilot` が成功し、生成された `sch-track-stsd-pilot.yaml` に 4 件 × 4 段と 1 件 × 2 段の 18 タスクがある。
- `npx specdojo catalog validate` と `npm run -s validate:schema` が通っている。
- `tml-index.yaml` など、strategy と schedule のほかのファイルは変えていない。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ |
| --- | ----------------------------------- | ---- | ---- | ---- |
| 1   | strategy を生成し、phase set を直す | PM   | open | -    |
| 2   | schedule を作り、検査を通す         | PM   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- `docs/ja/projects/prj-0001/timeline/tml-index.yaml`: track `stsd-pilot` の定義
- [[specdojo:sch-rulebook]]: strategy の書き方の規範
