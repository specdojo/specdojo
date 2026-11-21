---
specdojo:
  id: prj-0001:xer-pjr-vcer-20261121t073459z-eb4e6cf7
  type: exec-result
  task_id: PJR-VCER
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-VCER/pjr-vcer-20261121T073459Z-eb4e6cf7/plan.md
  started_at: "2026-11-21T07:34:59.975Z"
  completed_at: "2026-11-21T08:06:12.567Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 親の検証の test-unit で落ちた原因の sch-milestones のフィクスチャを、renderYamlPage の出力で作り直した。テストは toBe でファイルと比べるため vitest -u では更新されない。作り直した後、yaml-tables のテストは 38 件すべて通った。src/catalog/build-references.ts の変更は要ると確かめた。HEAD に戻すと catalog validate が dct-kata.yaml のエラー 3 件で失敗し、直した版では 0 件だった。理由は個票の対応結果に追記した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-index.yaml`: 変更、+7 / -0 行
- `docs/ja/projects/prj-0001/schedule/sch-milestones.yaml`: 変更、+44 / -0 行
- `src/catalog/build-references.ts`: 変更、+18 / -7 行
- `tests/fixtures/yaml-pages/prj-0001--sch-milestones.md.snap`: 変更、+47 / -0 行
- `tests/src/catalog/based-on.test.ts`: 変更、+20 / -1 行
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-kata.yaml`: 追加、+368 / -0 行
- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-wave-3.yaml`: 追加、+203 / -0 行
- `docs/ja/projects/prj-0001/schedule/sch-track-kata-wave-3.yaml`: 追加、+1052 / -0 行

## 3. 申し送り

- `src/catalog/build-references.ts` と `tests/src/catalog/based-on.test.ts` は完了条件に挙がっていないが、残した。HEAD の内容に戻して `catalog validate --project prj-0001` を実行すると、`dct-kata.yaml` についてエラー 3 件で失敗するからである。trc-requirements-to-tests-sample の `based_on` の `utc-index`・`itc-index` が `depends_on` の推移閉包に無く、imp-test-sample の `based_on` の `cr-2026-004` を解決できない。sample の `based_on` は駄菓子屋の世界の ID なので、project 外の名前空間（`specdojo:` など）の文書では照合しないように直した。直した版ではエラーは 0 件だった。
- `tests/fixtures/yaml-pages/prj-0001--sch-milestones.md.snap` を作り直した（第 3 波のゲートとマイルストーンの 47 行の追加だけ）。`yaml-tables.test.ts` は `toBe` でファイルと比べるので、`vitest -u` では更新されない。そのため `renderYamlPage` の出力をファイルへ書き戻した。
- schedule のタスクを走らせる前に、グローバルの `specdojo` が指すメインのリポジトリの `dist` へ、カタログ検証の修正を build しておく必要がある。
- 050 の段の plan で `targets` に同じ ID が 2 回並ぶ。`targetDocIds` で重複を除くかは別の項目で決める。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
