---
specdojo:
  id: prj-0001:pjr-wsnd-stsd-pilot-strategy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                                | 担当 | 状態 | メモ                                              |
| --- | ----------------------------------- | ---- | ---- | ------------------------------------------------- |
| 1   | strategy を生成し、phase set を直す | PM   | done | stsd 5 件に限定し、実施済みの段を除外した         |
| 2   | schedule を作り、検査を通す         | PM   | done | 18 タスクを生成し、依存・担当・実行種別を確認した |

## 5. 対応結果

- `sch-strategy-stsd-pilot.yaml` と `sch-track-stsd-pilot.yaml` を作成した。`scope` は `dct-data-model-stsd` の 5 件だけとし、主担当 BA は親 epic と先行個票の担当を引き継いだ。`timeline build --dry-run` で register 由来の `catalog_status: primary` と `data-flow-uc-rewrite` の後に着手する順序を確認した。
- `schedule strategy generate` の差分を確認して `--force` で生成し、標準の 21 タスクから、段 8 の完了した 4 件の `retrofit-pass` を除き、代表の `stsd-task-execution` に実装照合 review を追加した。4 件は磨き込み → condense → review → human 確定、代表は review → human 確定の計 18 タスクである。各段の説明に [[prj-0001:pjr-pt5n-stsd-kata-confirm|PJR-PT5N の Kata 確定]] と図の分割条件を記載した。
- 手動調整の理由は strategy のコメントに残した。生成された共通ゲートとドメイン完了 milestone は除き、成果物ごとの前段への依存で順序を保証する。既存の `sch-milestones.yaml`、カタログ、`tml-index.yaml` は差分なし。個票は本節と作業内容だけを更新し、ステータスは変更していない。
- 保存済み grade は rulebook・図の rulebook・sample・template が `pass`、recipe が `needs-work`（92 点）だった。今回指定された `reflect-implementation` と `confirm-deliverable` は grade から作成方式を選ぶ intent ではなく、実装エビデンスと人の確定を使うため、grade を補完せず生成できた。磨き込みは標準 profile の `fully-guided` を維持し、PJR-PT5N で確定した Kata を参照させた。
- 検証: strategy 生成、schedule build、両 YAML の個別 schema 検査、カタログ検証、`exec refresh` が成功した。18 タスクの対象・順序・依存・BA 主担当・実行種別・説明の展開と初回 ready の 5 件を機械的に照合した。カタログには既存の未作成文書、refresh には旧 planning タスクの履歴について警告がある。`npx specdojo` は起動できないため、規約に従い `node --import tsx src/specdojo.ts` を使った。全体の schema・lint・テストは親 runner の検証に委ねる。
- 残課題: 本個票の生成作業にはなし。実施済みの工程で記録された業務上の未決事項は各成果物の後続 review・人の確定で確認する。

## 6. 関連ドキュメント

- `docs/ja/projects/prj-0001/timeline/tml-index.yaml`: track `stsd-pilot` の定義
- [[specdojo:sch-rulebook]]: strategy の書き方の規範
