---
specdojo:
  id: prj-0001:pjr-hgvm-business-specs-kata-strategy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-11-09T22:17:20Z"
  derived_from:
    - PJR-T88P
  approach: strategy-planning
  targets:
    - track:business-specs-kata
---

# PJR-HGVM 業務仕様の型の schedule（business-specs-kata）を作る

## 1. 概要

sf・cdt・ccd・bdd・ifx-cmd の型の手入れと、bes・br の型の作り直し、人による型の確定の段を持つ sch-strategy-business-specs-kata.yaml を作り、schedule build する

## 2. 入力

- 対象の型と扱い（indie が承認、2026-11-10）: 手入れ = sf-rulebook・cdt-rulebook・ccd-mermaid-rulebook・bdd-rulebook・ifx-cmd-rulebook と各 sample（ifx-cmd は recipe・template も）。作り直し = bes-rulebook・br-rulebook と各 sample。
- 各段の説明に書く指示: rulebook-authoring-standard の章立て、サンプルの章の外出し、##〜#### の見出しの連番、記述ガイドに章ごとの判断の基準と良い例・悪い例、clis-sample 程度の厚さの sample、recipe と template の要否の判断。実装と同じことを書かない方針（PJR-2GD6）は保つ。

## 3. 完了条件

- `docs/ja/projects/prj-0001/schedule/sch-strategy-business-specs-kata.yaml` を、`schedule strategy generate --project prj-0001 --track business-specs-kata` で作っている（書き込む前に `--dry-run` で差分を確かめる）。
- 手入れの 5 種類（sf・cdt・ccd・bdd・ifx-cmd）は、`intent: improve-kata` などで、rulebook と sample（ifx-cmd は recipe と template も）の maintenance の段を作っている。
- 作り直しの 2 種類（bes・br）は、今の代表の文書（`bes-task-ready-selected`・`br-task-selection-strategy`）を手本に、型を起こし直す段を作っている。今の仕組み（`bootstrap` は全部の型が使える状態を対象にできない、など）で作れない場合は、作れない理由と、代わりに register の todo にする案を個票の対応結果に書き、その 2 種類は strategy に含めない。
- 最後に、人が型を確定する段（`confirm-with-kata-set` など）を作っている。
- 各段の `description` に、次の指示を書いている。
  - [[specdojo:rulebook-authoring-standard]] の章立てに合わせる。rulebook にサンプルの章を置かず、完成例は sample に外出しする。
  - `##` から `####` の見出しに連番を付ける。
  - 記述ガイドに、章ごとの判断の基準と、良い例・悪い例を書く。
  - sample は、[[specdojo:clis-sample]] 程度の厚さの完成例にする。
  - recipe と template の要否を決め、frontmatter に書く。
  - 実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保つ。
- `schedule build --project prj-0001 --track business-specs-kata` で track を作り、ほかの track の strategy・track と、`sch-milestones.yaml` のうち business-specs-kata と関係のない項目を変えていない。
- 段の並びと intent を選んだ理由を、個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `specdojo exec validate --project prj-0001 --schedule-only`・`npm run validate:schema`・`npm run lint:md` が通っている。
- schedule のタスクの実行（`exec run --auto`）はこの項目では行わない。

## 4. 作業内容

| No  | 作業                                                                            | 担当   | 状態 | メモ |
| --- | ------------------------------------------------------------------------------- | ------ | ---- | ---- |
| 1   | 対象の型の grade と、使える intent を確かめ、`--dry-run` で strategy を生成する | _TODO_ | open | -    |
| 2   | 各段の説明に指示を書き、strategy と track を作る                                | _TODO_ | open | -    |
| 3   | 検査を流し、段の並びと intent の理由を対応結果に書く                            | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-t88p-business-specs-kata]]
- 規範: [[specdojo:schedule-design-guide]]、[[specdojo:rulebook-authoring-standard]]
- 前例: [[prj-0001:pjr-stm9-business-specs-reps-strategy]]
