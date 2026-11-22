---
specdojo:
  id: prj-0001:xer-pjr-c7wd-20261122t132838z-c5a48c05
  type: exec-result
  task_id: PJR-C7WD
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-C7WD/pjr-c7wd-20261122T132838Z-c5a48c05/plan.md
  started_at: "2026-11-22T13:28:39.300Z"
  completed_at: "2026-11-22T13:33:38.244Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- sample-authoring-standard に表の前の 1 文と列名の決まり、良い例・悪い例を足し、個票の対応結果（CHANGELOG 事項を含む）を更新した。lint:md・lint:fm は最終状態では実行できておらず、親 runner の検証で確認が必要。

## 2. 変更ファイル

- `docs/ja/specdojo/standards/sample-authoring-standard.md`: 変更、+8 / -0 行

## 3. 申し送り

- 決めた点: 決まりは新しい章を作らず、記述ガイドの箇条書き 2 件と小節 6.1 にした。章番号を変えて他文書の参照を乱さないため。
- CHANGELOG に書く事項: 区分は変更。文案は「sample の作成標準に、表の前に何を示す表かを 1 文で書く決まりと、列名を中身の分かる言葉にする決まりを足しました（PJR-C7WD）。」
- 決まりに合わない既存 sample の型名は見つけていない。ただし全 sample の走査はしていない。
- 個票の見出し番号を直した後の lint:md・lint:fm は、承認が出ず実行できていない。親 runner の検証で確認が必要。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
