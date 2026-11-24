---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-integrity-sample-040-20261123t114034z-ba64348b
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-integrity-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-integrity-sample-040/T-KATA-WAVE-4-nfr-integrity-sample-040-20261123T114034Z-ba64348b/plan.md
  started_at: "2026-11-23T11:40:41.788Z"
  completed_at: "2026-11-23T11:53:36.287Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-integrity-sample
    - specdojo:nfr-integrity-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook である `docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md` を簡潔化しました。
- 「サンプル」の章を削除し、完成例の詳細は `specdojo:nfr-integrity-sample` に委ねる構成に変更しました。
- 「位置づけ」の表において、`nfr-security-safety` との境界（監査・機密性要件との重複回避）を明記しました。
- 各章（概要、適用範囲、要件一覧、測定・検証方法）の記述ガイドに、判断基準や良い例・悪い例を追記しました。
- `recipe` および `template` が `undecided` であること、および `sample` の構成（章立て）が現状の標準に適合していないことなどの未解決事項を、`_UNDECIDED_` 文言を用いて明記しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md`: 「サンプル」の章および完成例を削除し、`specdojo:nfr-integrity-sample` への委ねを明示しました。また、`nfr-security-safety` との境界を明記し、各章の記述ガイドに判断基準と具体例を追加しました。さらに、`ready` に至るための前提条件として、`recipe` / `template` の未決定事項を `_UNDECIDED_` として記述しました。

## 3. 申し送り

- F005（生成文書 ID の project 修飾）は不採用。`nfr-reliability-rulebook` が「プロダクト文書のため名前空間を付けない」としており、NFR 分冊の慣行に合わせて `nfr-integrity` を維持した。方針を変える場合は NFR 分冊全体で揃える必要がある。
- F010（sample の構成が rulebook の 5 章に不一致）は、この段で sample を変更しない指示のため未解消。rulebook 側に `_UNDECIDED_` として ready 前提条件を明記した。次の sample 改訂タスクで `specdojo:nfr-integrity-sample` を本文構成（標準テンプレ）の 5 章に揃える必要がある（駄菓子屋文脈、要件 ID の欠番なし、判定者は Role code）。
- F012/F014（`recipe`/`template` が `undecided`）は要否判断が未了のため値は変えず、`_UNDECIDED_` で論点と ready 前提条件を明記した。
- 判定者の扱いが NFR 分冊間で揺れている: 本書と `nfr-reliability-rulebook` は測定・検証方法に判定者の Role code を求め、`nfr-security-safety-rulebook` は「検証の作業を担う役割は検証先の計画で割り当て、本書では書かない」としている。PJR-76N9 との関係を含め統一方針の判断が必要。
- 直さなかった箇所: 本文構成（5 章・順序固定）と禁止事項の既存 3 項目の趣旨は根拠と整合するため維持した。
- F010（sample の構成が rulebook の 5 章に不一致）は、この段で sample を変更しない指示のため未解消。rulebook 側に `_UNDECIDED_` として ready 前提条件を明記した。次の sample 改訂タスクで `specdojo:nfr-integrity-sample` を本文構成（標準テンプレ）の 5 章に揃える必要がある（駄菓子屋文脈、要件 ID の欠番なし、判定者は Role code）。
- F012/F014（`recipe`/`template` が `undecided`）は要否判断が未了のため値は変えず、`_UNDECIDED_` で論点と ready 前提条件を明記した。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/rulebooks/ の rulebook のみで、plan/result/個票などの履歴蓄積ファイルを変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがなく、rulebook は `target_format` 未指定（markdown））

## 4. 進め方と実践の型の適用

rulebook-maintenance
