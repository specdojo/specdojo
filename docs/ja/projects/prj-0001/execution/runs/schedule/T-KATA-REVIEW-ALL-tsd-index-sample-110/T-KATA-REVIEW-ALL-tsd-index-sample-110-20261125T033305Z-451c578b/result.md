---
specdojo:
  id: prj-0001:xer-t-kata-review-all-tsd-index-sample-110-20261125t033305z-451c578b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-tsd-index-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-tsd-index-sample-110/T-KATA-REVIEW-ALL-tsd-index-sample-110-20261125T033305Z-451c578b/plan.md
  started_at: "2026-11-25T03:33:14.906Z"
  completed_at: "2026-11-25T03:46:43.745Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:tsd-index-sample
    - specdojo:tsd-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビュー段 R1（目的の過不足）を実施し、`docs/ja/specdojo/samples/tsd-index-sample.md` を修正した。rulebook の本文要件にないサンプル独自の節「未作成の詳細文書」を削除した。
- 同じ `_TODO_` が一覧の備考・参照先の表・「未作成の詳細文書」節の三か所に重なっていた件（grade の F001、`vp-arc-conciseness`）は、参照先の表へ一本化して解消した。
- lint:md:changed、lint:fm:changed、validate:schema、test:docs など runner 検証は通過した。rulebook など sample 以外は変更していない。
- 実施内容の指摘一覧（handoff の 2 件を表にまとめた）: | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R1 目的の過不足 | sample の「補足・詳細への導線」配下の「未作成の詳細文書」節、一覧表の Docker・Fly.io・GitHub Actions 行の「詳細・備考」列、「参照先の役割と適用条件」表の `tsd-hosting.md`・`tsd-ci.md` 行 | rulebook の本文要件が補足に求めるのは共通条件と各参照先の役割・適用条件だけで、「未作成の詳細文書」節はサンプル独自の節だった。同じ `_TODO_` が三か所に重なっていた（F001） | 節を削除し、暫定の正本（`fly.toml`・`Dockerfile`、`.github/workflows/`）を参照先の表のセルへ移した。一覧の備考は詳細 TSD 未作成と参照先の表への案内にし、`_TODO_` は参照先の表の 2 行だけに残した | tsd-index-rulebook の「本文要件」「詳細文書と更新」、Sample 記述標準の「構成の原則」 | 要判断（`vp-arc-conciseness` は本来 R3 の受け持ちだが、rulebook の構成にない節の削除として R1 で扱った） | | 2 | R1 目的の過不足 | sample 全体 | 冒頭の概要、一覧の列、補足の共通条件と参照先は rulebook の求めを満たしている。未採択の候補は一覧になく、未決は `_UNDECIDED_` で示している。欠けている内容・要らない内容はほかにない | なし（維持） | tsd-index-rulebook の「本文要件」「技術スタック一覧の列」「版と採用状態」、Sample 記述標準の「サンプル群の目的」 | なし |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsd-index-sample.md`: 「未作成の詳細文書」節を削除した。作成までの暫定の正本（`fly.toml`・`Dockerfile`、`.github/workflows/`）は参照先の表の `tsd-hosting.md`・`tsd-ci.md` 行へ移し、一覧の備考列は参照先の表への案内に短縮した。これで `_TODO_` の重複を解消し、約 22 行追加・27 行削除となった。

## 3. 申し送り

- 指摘 No.1 は `vp-arc-conciseness`（本来 R3 の観点）に当たる削除を R1 の判断として行ったため「要判断」とした。R3 側で重複判定が起きないか確認してほしい。
- rulebook など sample 以外は変更していない。
- No: 1 / 段: R1 目的の過不足 / 箇所: docs/ja/specdojo/samples/tsd-index-sample.md の「補足・詳細への導線」配下の「未作成の詳細文書」節、一覧表の Docker・Fly.io・GitHub Actions 行の「詳細・備考」列、「参照先の役割と適用条件」表の `tsd-hosting.md`・`tsd-ci.md` 行 / 指摘: rulebook の「本文要件」が補足に求めるのは全体の共通条件と各参照先の役割・適用条件だけで、「未作成の詳細文書」節はサンプル独自の節だった。しかも同じ `_TODO_` が一覧の備考・参照先の表と合わせて三か所に重なっていた（grade の F001、`vp-arc-conciseness` と同じ箇所） / 直した案: 「未作成の詳細文書」節を削り、作成までの暫定の正本（`fly.toml`・`Dockerfile`、`.github/workflows/`）を参照先の表の参照先セルへ移した。一覧の備考は「詳細 TSD は未作成（「参照先の役割と適用条件」参照）」とし、`_TODO_` は参照先の表の 2 行だけに残した / 根拠: tsd-index-rulebook の「本文要件」と「詳細文書と更新」（未作成の詳細は共通ラベルで示し、仮の参照先を確定情報にしない）、Sample 記述標準の「構成の原則」（sample 独自の章立てを作らない） / 印: 要判断（観点 `vp-arc-conciseness` は本来 R3 の受け持ちだが、rulebook の構成にない節を削る R1 の判断として扱ったため）
- No: 2 / 段: R1 目的の過不足 / 箇所: docs/ja/specdojo/samples/tsd-index-sample.md 全体 / 指摘: 冒頭の概要（3 文）、技術スタック一覧の列（区分・採用技術・担当責務・版・正本・適用範囲・詳細・備考）、補足の共通条件と参照先は rulebook の求めを満たしている。未採択の候補は一覧に載せず、未決は `_UNDECIDED_` で示している。ほかに欠けている内容・要らない内容はない / 直した案: なし（維持） / 根拠: tsd-index-rulebook の「本文要件」「技術スタック一覧の列」「版と採用状態」、Sample 記述標準の「サンプル群の目的」 / 印: なし
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample のみで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従った。根拠は tsd-index-rulebook の「本文要件」「詳細文書と更新」と Sample 記述標準の「構成の原則」「サンプル群の目的」、および grade の F001 である。rulebook の構成にない独自節は削り、F001 の重複は参照先の表へ一本化して解消した。冒頭概要・一覧の列・補足の共通条件は rulebook の求めと整合するため維持した。根拠不足で見送った finding はない。
