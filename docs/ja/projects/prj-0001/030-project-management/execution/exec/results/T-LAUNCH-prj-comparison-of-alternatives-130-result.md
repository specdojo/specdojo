---
specdojo:
  id: prj-0001:xer-t-launch-prj-comparison-of-alternatives-130
  type: exec-result
  task_id: T-LAUNCH-prj-comparison-of-alternatives-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-prj-comparison-of-alternatives-130-plan.md
  started_at: "2026-07-01T15:47:56.978Z"
  completed_at: "2026-07-01T15:59:09.051Z"
  agent: opencode-edit-agent
  approach: template-maintenance
---

# Edit Result

## 1. 実施内容

`docs/ja/specdojo/templates/prj-comparison-of-alternatives-template.md` を、完成版成果物 `docs/ja/projects/prj-0001/020-project-definition/prj-comparison-of-alternatives.md` および `prj-comparison-of-alternatives-rulebook` に基づいて最終調整した。

- 比較目的と前提条件: 根拠資料との整合性確保を促す記述を追加。
- 比較対象案: 案の抽出元（`prj-issues-and-approach` 等）を明記するプレースホルダを追加。
- 評価軸と評価基準: 評価軸がプロジェクト課題やスコープに対応していることを記述させる項目を追加。
- 比較結果と採択理由: 「一部採択」の扱いを明確化し、非採択/一部採択理由の表に「扱い」列を追加。
- リスクとトレードオフ: 案ごとのリスク/トレードオフを整理する表を追加。
- 決定と見直し: 再評価条件や方針変更時の記録先の記述を具体化。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/prj-comparison-of-alternatives-template.md`

## 3. 申し送り

なし。

## 4. 参考資料の活用

以下の資料を根拠に template の改善を実施した。

- 成果物: `[[prj-0001:prj-comparison-of-alternatives]]`
  - 実際に記述された「案の抽出元」の明記、詳細な「評価軸と課題の対応関係」の記述、および「案ごとのリスク/トレードオフ」の整理方法を template に反映し、後続者が同様の品質で作成できるように改善した。
- Rulebook: `[[prj-comparison-of-alternatives-rulebook]]`
  - 必須項目（比較結果、採択理由、非採択理由、リスクとトレードオフ）が網羅されていることを確認し、記述ガイドの内容をプレースホルダの指示として取り込んだ。
  - 「一部採択」の扱いを明確化し、Rulebook の推奨表形式に整合させた。
