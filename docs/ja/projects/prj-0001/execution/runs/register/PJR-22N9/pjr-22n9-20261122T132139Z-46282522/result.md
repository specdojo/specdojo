---
specdojo:
  id: prj-0001:xer-pjr-22n9-20261122t132139z-46282522
  type: exec-result
  task_id: PJR-22N9
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-22N9/pjr-22n9-20261122T132139Z-46282522/plan.md
  started_at: "2026-11-22T13:22:20.520Z"
  completed_at: "2026-11-22T13:27:53.260Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- grade run の --kata と --kind の併用で、指定した種類だけを評価するよう修正した。--kind 省略時は従来どおり rulebook と sample、指定した種類が型に無いときは評価せず標準エラーに出す。実装・テスト・ヘルプ・command-reference・個票の対応結果を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/references/command-reference.md`: 変更、+1 / -1 行
- `src/grade/command-shared.ts`: 変更、+1 / -1 行
- `src/grade/run.ts`: 変更、+8 / -1 行
- `src/grade/targets.ts`: 変更、+81 / -6 行
- `tests/src/grade/kata-documents.test.ts`: 変更、+48 / -1 行

## 3. 申し送り

- 判断: recipe と template は rulebook の frontmatter 宣言を優先し、宣言がなければ `&lt;名前&gt;-recipe` などのファイル名で探す。宣言されたファイルが無ければエラーにする（sample と同じ）。`not-needed` / `none` / `undecided` は評価しない。
- 判断: `--kind` 未指定は rulebook と sample のみ。`--kind all` は rulebook・recipe・sample・template の 4 種類すべて。
- CHANGELOG に書く事項: 区分 Fixed。`grade run --target kata` で `--kata` と `--kind` を併用すると `--kind` が無視され、常に rulebook と sample を評価していた問題を修正した。`--kind recipe` や `--kind template` を指定できる。
- 実際の grade の起動での再確認は、agent を起動できないため未実施（個票の作業内容で `open`）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
