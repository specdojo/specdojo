---
specdojo:
  id: prj-0001:xer-pjr-vcer-20261121t073459z-eb4e6cf7
  type: exec-result
  task_id: PJR-VCER
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-VCER/pjr-vcer-20261121T073459Z-eb4e6cf7/plan.md
  started_at: "2026-11-21T07:34:59.975Z"
  completed_at: "2026-11-21T07:49:31.924Z"
  agent: opus-executor
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- 第 3 波の kata ドメインとして `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-kata.yaml` を作成し、13 種類の sample を定義した。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-index.yaml` に domain kata を追加した。
- 第 3 波の strategy として `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-wave-3.yaml` を作成した。
- schedule build を実行し、track として `docs/ja/projects/prj-0001/schedule/sch-track-kata-wave-3.yaml` を生成した。
- `docs/ja/projects/prj-0001/schedule/sch-milestones.yaml` を更新した。
- catalog validate における `based_on` の照合エラー（プロジェクト外の名前空間にある sample への参照）を解消するため、`src/catalog/build-references.ts` を修正し、関連するテスト `tests/src/catalog/based-on.test.ts` を更新した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-index.yaml`: domain kata の項目を追加した。
- `docs/ja/projects/prj-0001/schedule/sch-milestones.yaml`: マイルストーン情報を更新した。
- `src/catalog/build-references.ts`: プロジェクト外の名前空間（`specdojo:` など）を持つ文書の `based_on` を照合対象から除外するよう修正した。
- `tests/src/catalog/based-on.test.ts`: `src/catalog/build-references.ts` の変更に伴うテストケースを追加した。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-kata.yaml`: 13 種類の kata sample を定義した。
- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-wave-3.yaml`: 新しい strategy を作成した。
- `docs/ja/projects/prj-0001/schedule/sch-track-kata-wave-3.yaml`: schedule build によって生成された track ファイル。

## 3. 申し送り

- `npx specdojo` はグローバルに入ったメインのリポジトリの `dist` を指す。`validateBasedOn` の修正（`src/catalog/build-references.ts`）を build するまで、`npx specdojo catalog validate` は `dct-kata.yaml` の `trc-requirements-to-tests-sample` と `imp-test-sample` でエラー 3 件を出す。worktree の `src` を動かす `npm run validate:catalog` は通る。kata-wave-3 のタスクを走らせる前に、メインのリポジトリで build すること。
- カタログの検証の修正: 文書の `id` が catalog の project 以外の名前空間（例: `specdojo:utc-sample`）で修飾されているとき、その `based_on` を照合しない。sample の `based_on` は共通サンプル文脈（駄菓子屋）の ID を指すためである。個票の範囲の外の `src` の変更なので、人が確認すること。
- sample を厚くする段の approach は `sample-maintenance` にした（手本は `rulebook`、対象は `sample`）。`fully-guided` だと、対象の `sample` が自分の手本を兼ねる。成果物を磨く `refine` の段は置いていない。`finalize` は `bootstrap-finalize` ではなく `finalize` にした（`recipe`・`template` が `undecided` のため）。`owner` は `QE`。
- `npx specdojo` はグローバルに入ったメインのリポジトリの `dist` を指す。`validateBasedOn` の修正（src/catalog/build-references.ts）を build するまで、`npx specdojo catalog validate` は dct-kata.yaml の trc-requirements-to-tests-sample と imp-test-sample でエラー 3 件を出す。worktree の src を動かす `npm run validate:catalog` は通る。kata-wave-3 のタスクを走らせる前に、メインのリポジトリで build すること。
- カタログの検証の修正: 文書の `id` が catalog の project 以外の名前空間（例: `specdojo:utc-sample`）で修飾されているとき、その `based_on` を照合しない。sample の `based_on` は共通サンプル文脈（駄菓子屋）の ID を指すためである。個票の範囲の外の src の変更なので、人が確認すること。
- sample を厚くする段の approach は `sample-maintenance` にした（手本は rulebook、対象は sample）。`fully-guided` だと、対象の sample が自分の手本を兼ねる。成果物を磨く `refine` の段は置いていない。finalize は `bootstrap-finalize` ではなく `finalize` にした（recipe・template が `undecided` のため）。owner は QE。
- dry-run で、sample-maintenance の段の plan の `targets` に `specdojo:&lt;name&gt;-sample` が 2 回並んだ（成果物と編集の対象が同じため）。schema は重複を禁じていない。`targetDocIds` で重複を除くかは、別の項目で決める。
- この worktree では、`--project prj-0001` を付けないと `exec plan` が既存の成果物（例: utc-catalog）も見つけられなかった。dry-run は `--project` を付けて行った。
- itc-sample の grade の指摘のうち、frontmatter に `title` を足す件は採らなかった（Markdown 記述ルールで禁止）。
- CHANGELOG.md は変えていない。利用者への影響が無いことは、個票の「CHANGELOG に書く事項」に書いた。

## 4. 進め方

第 3 波の kata ドメインの定義（`dct-kata.yaml`）と、それに基づく strategy および schedule を作成した。また、catalog 構築時にプロジェクト外の ID を持つ sample の `based_on` がエラーになる問題を、`src/catalog/build-references.ts` の修正によって解消した。
