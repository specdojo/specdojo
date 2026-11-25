---
specdojo:
  id: prj-0001:xer-pjr-66er-20261125t103609z-71c973db
  type: exec-result
  task_id: PJR-66ER
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-66ER/pjr-66er-20261125T103609Z-71c973db/plan.md
  started_at: "2026-11-25T10:36:10.206Z"
  completed_at: "2026-11-25T10:43:39.263Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- PJR-66ER の 2 回目の修正を終えた。手元にも `external_projects` にも解決先のない修飾付き wikilink を、ビルドを止めずに id と文書のパス付きで警告する。判定を `external-links.ts` へ切り出し、相手の project が未宣言の場合と手元の id が優先される場合の単体テストを足した。`docs-editing-guide` と設定リファレンスにリポジトリをまたぐ wikilink の書き方と警告の説明を足した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/docs-editing-guide.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+1 / -1 行
- `packages/docs-site/.vitepress/config.mts`: 変更、+18 / -9 行
- `packages/docs-site/.vitepress/external-links.ts`: 変更、+46 / -0 行
- `tests/packages/docs-site/external-links.test.ts`: 変更、+78 / -0 行

## 3. 申し送り

- `.specdojo/specdojo.config.json` に prj-0002 の `external_projects` が無いため、このリポジトリの `[[prj-0002:...]]`（17 か所）は文書サイトのビルドで unresolved wikilink の警告になる見込み。設定は agent の保護対象のため変えていない。宣言するかどうかは人が決める。
- 警告の対象は `&lt;namespace&gt;:&lt;id&gt;` の形の id すべてで、`specdojo:` や取り込んだリポジトリ名の接頭辞が付いた id の解決漏れも警告に出る。
- `npm run docs:build` での表示と警告の出方は確認していない。オーケストレーターがまとめて流す時に確かめる。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
