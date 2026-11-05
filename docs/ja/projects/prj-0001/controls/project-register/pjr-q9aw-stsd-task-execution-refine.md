---
specdojo:
  id: prj-0001:pjr-q9aw-stsd-task-execution-refine
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-04T23:38:12Z"
  completed_at: "2026-11-05T10:18:02Z"
  conclusion: 実装の根拠と stsd の Kata に沿って磨き込んだ。Kata の判断材料 3 点を対応結果に残した
  derived_from:
    - PJR-3APD
  depends_on:
    - PJR-1799
    - PJR-H2V8
  approach: fully-guided
  targets:
    - prj-0001:stsd-task-execution
---

# PJR-Q9AW stsd-task-execution を磨き込む

## 1. 概要

stsd の試行（3APD）の段 3。draft した stsd-task-execution を fully-guided で磨き込み、Kata の出来を測る材料にする

## 2. 入力

- 磨き込みは stsd の Kata（rulebook・図の rulebook・recipe・sample・template）に沿って行う。Kata の出来は、この 1 件を材料に人が判断する（3APD の段 5）
- draft（PJR-1799）の T-12（完了から終了、「成果物受入」）と T-13（中止から終了、「中止確定」）は実装にないイベントで、推測で埋められている。実装で確かめて直すか、終了点を置かない理由を「概要」に書く（stsd の rulebook の状態遷移図の規則）（2026-11-05 orchestrator の確認）

## 3. 完了条件

- [[stsd-task-execution]] を、[[specdojo:stsd-rulebook]] と stsd の recipe・sample に沿って磨き込んでいる。カタログの `done_criteria`（BA・PO・ARC・QE・DEV の観点）を満たすよう、足りない記述を補っている。
- draft で `_UNDECIDED_` として残した点を、実装で確かめて埋めるか、残す理由を書いている。
- Kata（rulebook・recipe・sample・template）に従うと実物に合わない点、書けない点を、Kata の種類と場所を添えて個票の対応結果に書いている。3APD の段 5（手入れか作り直しかの判断）の材料にする。
- `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md` 以外の成果物と Kata は変えていない。Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書く。
- `npm run -s lint:md` と `npm run -s lint:fm` が通っている。

## 4. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------- | ---- | ---- | ---- |
| 1   | Kata と done_criteria に照らして足りない点を洗い出す | BA   | open | -    |
| 2   | 磨き込み、検査を通す                                 | BA   | open | -    |
| 3   | Kata の合わない点を対応結果に書く                    | BA   | open | -    |

## 5. 対応結果

- 実施内容: executor（sol）が [[stsd-task-execution]] を、stsd の rulebook・図の rulebook・recipe・sample と、実装の根拠（`src/exec/events.ts`・`src/exec/types.ts`）に沿って磨き込んだ（ae6cc5c2c）。H2V8 の後に `--force-restart` で流し直した。
  - 実装にない終了の遷移 T-12・T-13 を除き、終了点を置かない理由（完了は差し戻せる、中止の後も記録は残る）を「概要」に書いた。
  - draft の未決 3 件を実装で確かめた。`note`・`link`・`estimate` は状態を変えないため概要へ、依存の未充足への戻り（T-15）、依存のない初期の着手可能（T-14）、解放・差し戻しの後の分岐（T-16〜T-18）を足した。レガシーの `cancel` は互換の扱いとして概要へ移した。
  - 図の rulebook の分割条件に従い、16 遷移を通常系と例外系の 2 図に分けた。
  - 業務の承認の根拠を確かめられない 3 点（着手時のロールの照合の例外、再開時のアクターの照合、完了時の成果物の検証）は、実装との差と決定時期を検討メモに残した。未作成の bdd の 2 件は推測で補っていない。
- Kata の判断材料（3APD の段 5 で使う。Kata は変えていない）:
  - `stsd-rulebook` の「状態遷移図」と `stsd-mermaid-rulebook` は、終了点を省くときに「継続状態」で説明するが、差し戻せる完了や記録が残る中止のような境界の書き方がない。
  - `stsd-mermaid-rulebook` の図の分割で、初期点を分割した各図に置くかが明示されていない。sample に分割の例がない。
  - `stsd-rulebook` は frontmatter の `id` をプロジェクト修飾なしと説明するが、カタログから作る成果物は `prj-0001:stsd-task-execution` になる。
- orchestrator の確認: 変わった成果物は対象の 1 件だけで、Kata は変わっていない。親の検証はすべて通った。executor の報告によれば、宣言された資料のほかに `AGENTS.md`・運用の playbook・`prj-overview` も読んでいるが、本文の根拠にはしていない。
- 残課題: なし（condense は PJR-MC63）。

## 6. 関連ドキュメント

- [[stsd-task-execution]]: 対象の成果物
- [[specdojo:stsd-rulebook]]: stsd の書き方の規範
