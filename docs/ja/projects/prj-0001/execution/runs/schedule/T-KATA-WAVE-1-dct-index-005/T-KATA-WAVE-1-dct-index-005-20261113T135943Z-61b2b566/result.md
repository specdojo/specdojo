---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-dct-index-005-20261113t135943z-61b2b566
  type: exec-result
  task_id: T-KATA-WAVE-1-dct-index-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-dct-index-005/T-KATA-WAVE-1-dct-index-005-20261113T135943Z-61b2b566/plan.md
  started_at: "2026-11-13T13:59:45.876Z"
  completed_at: "2026-11-13T14:13:42.971Z"
  agent: opus-executor
  execution: agent
  approach: bootstrap
  targets:
    - prj-0001:dct-index
    - specdojo:dct-index-rulebook
    - specdojo:dct-index-sample
    - specdojo:dct-index-template
---

# Edit Result

## 1. 実施内容

- 成果物カタログ索引 `dct-index.yaml` の代表成果物として、対応する実践の型（rulebook, sample, template）を整備した。
- rulebook は標準的な章立て（本文要件・記述ガイド・禁止事項）へ移行し、判断基準やサイドバー表示名・並び順の制約を追加した。
- sample を 1 段および 2 段構成の両方を示す完成例として充実させ、記述レベルを向上させた。
- recipe は `not-needed` と判断し、template は現状を維持した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/dct-index-rulebook.md`: 章構成を標準の「本文要件／記述ガイド／禁止事項」に変更し、判断基準およびサイドバーのキー順に関する規約を追加した。
- `docs/ja/specdojo/samples/dct-index-sample.yaml`: 1 段・2 段構成の両方を示す完成例として内容を充実させ、分類の判断基準が伝わる形式に修正した。

## 3. 申し送り

- rulebook の章構成を「4. 本文要件／5. 記述ガイド／6. 禁止事項」へ変更した。旧章タイトル（「YAML 構成」「記述・生成・検証ガイド」）への外部参照は docs 配下（execution を除く）に見つからなかった。
- サイドバーの表示名と並び順の制約（`domain` の直後の `name` を読む）は、plan の根拠範囲外である `packages/docs-site/.vitepress/config.mts` の実装から確認した。完了条件の QE 項目（索引ビューとサイドバーからの到達）に対応するため rulebook へ記載した。妥当性は review で確認してほしい。
- 型の要否: recipe は `not-needed` のまま（規約と schema でほぼ内容が決まり、判断点は rulebook の記述ガイドで足りる）。sample は分類の判断が schema だけでは伝わらないため維持して充実させた。template は生成ビューの骨組みとして必要なため維持した。
- 手本: 同種の ready 文書として `docs/ja/specdojo/standards/rulebook-authoring-standard.md`（章立て）と `docs/ja/specdojo/samples/clis-sample.md`（sample の厚さ）を参照した。
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/ 配下だけで、成果物の変更が docs/ja/projects/ に及ばない）
- 適用外の検証: `npm run validate:history-links`（pjr 個票・plan・result を変更していない）

## 4. 進め方と実践の型の適用

既存の成果物 `dct-index.yaml` および template を維持し、不足していた判断基準や具体例を rulebook と sample に反映させて実践の型を完結させた。recipe については不要と判断し `not-needed` とした。
