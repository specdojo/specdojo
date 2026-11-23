---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-operations-sample-040-20261123t115622z-9c570a24
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-operations-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-operations-sample-040/T-KATA-WAVE-4-nfr-operations-sample-040-20261123T115622Z-9c570a24/plan.md
  started_at: "2026-11-23T11:56:29.923Z"
  completed_at: "2026-11-23T12:09:17.851Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-operations-sample
    - specdojo:nfr-operations-rulebook
---

# Edit Result

## 1. 実施内容

- nfr-operations-rulebook を書き直した。サンプル章を削除し、位置づけを関係表に、本文構成（標準テンプレ）を本文要件に改め、記述ガイドに判断基準と良い例・悪い例を加えた。grade の finding F001〜F022 のうち、sample の章構成の是正（F016）を除いて rulebook 側で対処した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-operations-rulebook.md`: rulebook の簡潔化と構造変更を実施。具体的には、完成例として含まれていた「8. サンプル」章を削除し、代わりに「2. 位置づけ」を文書間の入出力関係を示す表へと変更。また、「5. 本文構成（標準テンプレ）」を、各章の目的を含めた「5. 本文要件」へと改め、記述の際の判断基準や「良い例・悪い例」をガイドとして追記した。これにより、grade の指摘事項 F001〜F015, F017〜F022 を解消した。

## 3. 申し送り

- F016（major/vp-qe-kata-conformance）は未解消。sample (`docs/ja/specdojo/samples/nfr-operations-sample.md`) が rulebook の「本文要件」の 5 章（概要（対象・目的）／適用範囲・体制前提／運用要件一覧／測定・検証方法／関連ドキュメント導線）に揃っていない。この段は sample を変更しないため, sample の段で駄菓子屋の題材のまま 5 章構成へ直す必要がある（要件 ID は `nfr-ops-001` からの連番、領域列で 4 領域を網羅、判定者は Role code、製品名を書かない）。
- recipe・template の要否は rulebook の全体方針に `_UNDECIDED_` として残した。sample の是正と, NFR 分冊で共通の template にできるかの判断が ready の前提条件である。
- 維持した記述: ID 規則 `nfr-ops-&lt;連番&gt;`、配置先、既存の禁止事項 3 行。同系統の `nfr-availability-rulebook`・`nfr-integrity-rulebook` の簡潔化と構成を揃えた。役割の割り当てや承認の進み具合は成果物に求めていない（PJR-76N9）。オンコール体制と判定者は運用の中身として Role code で書く要件として残した。
- F016（major/vp-qe-kata-conformance）は未解消。sample（docs/ja/specdojo/samples/nfr-operations-sample.md）が rulebook の「本文要件」の 5 章（概要（対象・目的）／適用範囲・体制前提／運用要件一覧／測定・検証方法／関連ドキュメント導線）に揃っていない。この段は sample を変更しないため、sample の段で駄菓子屋の題材のまま 5 章構成へ直す必要がある（要件 ID は nfr-ops-001 からの連番、領域列で 4 領域を網羅、判定者は Role code、製品名を書かない）。
- recipe・template の要否は rulebook の全体方針に `_UNDECIDED_` として残した。sample の是正と、NFR 分冊で共通の template にできるかの判断が ready の前提条件。
- 維持した記述: ID 規則 nfr-ops-&lt;連番&gt;、配置先、既存の禁止事項 3 行。同系統の nfr-availability-rulebook・nfr-integrity-rulebook の簡潔化と構成を揃えた。役割の割り当てや承認の進み具合は成果物に求めていない（PJR-76N9）。オンコール体制と判定者は運用の中身として Role code で書く要件として残した。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/rulebooks 配下の rulebook だけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を, grade の指摘と成果物の `done_criteria` に沿って簡潔に整える。rulebook に完成例の章を置かず, 完成例は sample に任せる。docs/ja/specdojo/standards/rulebook-authoring-standard.md の章立てに合わせ, 記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。authoring standard の「各必須章に最低3つ以上の具体項目」を満たすよう本文構成を整備する。
