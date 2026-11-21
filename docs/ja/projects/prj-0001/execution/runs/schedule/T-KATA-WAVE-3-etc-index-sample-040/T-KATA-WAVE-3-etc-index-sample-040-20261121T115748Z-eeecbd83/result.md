---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-etc-index-sample-040-20261121t115748z-eeecbd83
  type: exec-result
  task_id: T-KATA-WAVE-3-etc-index-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-etc-index-sample-040/T-KATA-WAVE-3-etc-index-sample-040-20261121T115748Z-eeecbd83/plan.md
  started_at: "2026-11-21T11:58:04.067Z"
  completed_at: "2026-11-21T12:08:07.351Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:etc-index-sample
    - specdojo:etc-index-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook を簡潔化し、grade による指摘事項（F001, F002, F003, F004, F007, F008）を解消しました。
- 具体的には、完成例の章を削除し、代わりに記述ガイドとして判断基準や良い例・悪い例を追加することで、成果物カタログの rulebook としての責務を明確にしました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/etc-index-rulebook.md`: 完成例の章を削除し、`itc-index` で扱う範囲の追記、`case_id` の `perspective_key` に関する規則の明記、ファイル名と `dct` の `path` の整合性向上、`id` と `local_id` の区別、TSP（`tsp-index`）の正式名称と `id` の記述、および mermaid 図のラベルの修正を行いました。

## 3. 申し送り

- F005（major）: `etc-index-sample` が rulebook の本文構成（1〜8章）に従っていない。後続の `sample-maintenance` で本文構成どおりに厚くする。指摘の「type に `project` を指定」は、確認した `sample` の frontmatter が `type: test` だったため事実と一致しない。再評価で確認する。
- F006: rulebook の `recipe` / `template` は `undecided` のまま（plan で宣言の変更を禁止）。`template` は `PJR-WYTX` で扱う。`target_format` を省略すると markdown とみなされるため、宣言を補うかどうかを後続で判断する。
- F005（major）: etc-index-sample が rulebook の本文構成（1〜8章）に従っていない。後続の sample-maintenance で本文構成どおりに厚くする。指摘の「type に project を指定」は、確認した sample の frontmatter が `type: test` だったため事実と一致しない。再評価で確認する。
- F006: rulebook の `recipe` / `template` は `undecided` のまま（plan で宣言の変更を禁止）。template は PJR-WYTX で扱う。`target_format` を省略すると markdown とみなされるため、宣言を補うかどうかを後続で判断する。

## 4. 進め方と実践の型の適用

rulebook-maintenance
