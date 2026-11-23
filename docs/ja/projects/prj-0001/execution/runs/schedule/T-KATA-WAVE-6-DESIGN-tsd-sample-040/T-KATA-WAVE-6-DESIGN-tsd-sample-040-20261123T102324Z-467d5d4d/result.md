---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-tsd-sample-040-20261123t102324z-467d5d4d
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-tsd-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-tsd-sample-040/T-KATA-WAVE-6-DESIGN-tsd-sample-040-20261123T102324Z-467d5d4d/plan.md
  started_at: "2026-11-23T10:23:33.899Z"
  completed_at: "2026-11-23T10:31:04.295Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:tsd-sample
    - specdojo:tsd-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook である `docs/ja/specdojo/rulebooks/tsd-rulebook.md` を、grade の指摘（F001〜F005）および `PJR-76N9` に基づいて簡潔に整理しました。
- 具体的な修正内容は以下の通りです：
- 分冊の前提・完了条件に関する記述を集約し、冗長性を排除しました（F001）。
- TSD の改訂・廃止時に追従すべき自系統の対象（`tsd-index` 等）を明記しました（F002）。
- 章名を `recipe` の「接続設定と秘密情報の扱い」に統一しました（F003）。
- バックアップ方針において、運用設計に委ねる範囲と TSD に残すべき技術固有の操作の境界を明確にしました（F004）。
- 用語を「分冊」に統一しました（F005）。
- 利用場面の定義を「誰が」ではなく「どの利用場面で何を判断するための文書か」という記述に改めました。
- 記述ガイドに、判断の基準となる「良い例」と「悪い例」を追加しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/tsd-rulebook.md`: grade の指摘および `PJR-76N9` に基づき、文書の簡潔化と整合性の向上を行いました。具体的には、分冊に関する前提・完了条件の記述を集約し、改訂時の追従対象を明記、章名の統一、バックアップ方針における責任境界の明確化、および用語の統一（「分冊」）を実施しました。また、記述ガイドに判断基準となる良い例・悪い例を追記しました。

## 3. 申し送り

- sample の 1.4「役割と責任」は `PJR-76N9`（成果物の本文に役割の割り当てを求めない）に合わない。sample を直す段で削除または見直しを検討する。
- rulebook で直さなかった箇所: 全体方針の「共通の運用」にある役割の記述は、メンバー定義を見るよう促すだけで本文に役割の割り当てを求めていないため、そのまま残した。
- sample の 1.4「役割と責任」は PJR-76N9（成果物の本文に役割の割り当てを求めない）に合わない。sample を直す段で削除または見直しを検討する。

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と `done_criteria` に沿って簡潔に整える方針で実施しました。rulebook の章立てを `docs/ja/specdojo/standards/rulebook-authoring-standard.md` に合わせ、記述ガイドに判断基準（良い例・悪い例）を盛り込み、冗長な記述の削減と構成の整合化を行いました。
