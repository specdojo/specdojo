---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-bes-routine-due-060-20261118t005135z-54646741
  type: exec-result
  task_id: T-KATA-SLIM-2-bes-routine-due-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-bes-routine-due-060/T-KATA-SLIM-2-bes-routine-due-060-20261118T005135Z-54646741/plan.md
  started_at: "2026-11-18T00:51:42.067Z"
  completed_at: "2026-11-18T01:23:37.873Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - bes-routine-due
    - specdojo:bes-recipe
---

# Edit Result

## 1. 実施内容

- `bes-recipe.md` から、文書の運用の記述、rulebook と同じ判断の言い直し、重複する確認を外した。書く順番、入力の取り出し元、書き手への問いとコツ、深掘りの順序に絞った。
- 大きさは、空白と表の区切り行を除いて 2,796 字から 1,955 字（69.9%）になり、目安の 7 割以下を満たした。区切り行を含めると 3,108 字から 2,198 字、8,874 B から 6,137 B。
- F002 は、4 章の先頭に「4.1. 導入」を追加して対応した。承認する人と判断時期は、2 章の表の聞く項目と 4.2 のコツで扱った。
- F001 は、仕上げチェックに 2 項目を追加して対応した。1 つは上位一覧の対応イベントが分かるか、未照合と書いているかの確認。もう 1 つは、まだない文書を ID で仮置きし、確認する人と時期を添えているかの確認。
- rulebook、sample、template、result は変更していない。
- 検査では、executor の `prettier --check` と `markdownlint-cli2` が通過した。runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` も通過した。`lint:ts` と `typecheck` は変更種別により非適用。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/bes-recipe.md`: 運用の記述、rulebook と同じ判断の言い直し、仕上げチェックの構造検査、重複する確認を外し、書く順番、入力の取り出し元、問いとコツ、深掘りの順序、良い例と悪い例に絞った。F002 対応として 4 章に「4.1. 導入」の問いとコツを追加した。F001 対応として仕上げチェックに、上位一覧との対応または未照合の明記と、仮置き参照の確認の 2 項目を追加した。

## 3. 申し送り

- 迷った点が 1 つある。仕上げチェックの「確認する人と時期を添える」は F001 の文言に合わせて入れた。rulebook は仮置きの扱いを直接定めていないため、型の grade で過剰と判断された場合は外してよい。
- 変更案（bes-template、この段では未変更）: 「何が起きたか」にある業務承認者・判断時期・承認条件・記録先の記入指示は、rulebook では「未決事項と承認条件」の範囲であり、共通の運用にも当たる。そのため、移すか外す。未決事項の記入指示の列（決定者・確認担当・判断時期・記録先）は台帳の列なので、rulebook の「論点・利用への影響・当面の扱い」に合わせる。
- 変更案（bes-rulebook / bes-sample）: 変更が要る点は見つからなかったと executor は報告している。
- 根拠とした成果物 `bes-routine-due` は product 側のパスにあり、この worktree には存在しない。そのため本文は読めず、見直しの根拠は rulebook、template、Recipe 記述標準、PJR-7M9J の一覧とした。
- 大きさ（result 用）: 空白と表の区切り行を除いて 2,796 字 → 1,955 字（69.9%）。区切り行を含めると 3,108 字 → 2,198 字、8,874 B → 6,137 B。
- finding 対応（result の「進め方と実践の型の適用」用）: F002 は 4章の先頭に「4.1. 導入」を追加（問いは混同と利用できる基準、コツは上位一覧を写さず参照することと未照合の扱い）。承認する人と判断時期は 2章の表の聞く項目と 4.2 のコツで扱った。F001 は仕上げチェックに、上位一覧の対応イベントが分かるか未照合と書いているかの項目と、まだない文書を ID で仮置きし確認する人と時期を添えるかの項目を追加した。根拠は bes-rulebook の「本文要件」と「ファイル命名・ID規則」、bes-template の導入の記入指示、Recipe 記述標準。
- 迷った点: 仕上げチェックの『確認する人と時期を添える』は F001 の文言に合わせた。rulebook は仮置きの扱いを直接は定めていないため、型の grade で過剰と判断されれば外してよい。
- 変更案（bes-template、この段では変えない）: 「何が起きたか」にある業務承認者・判断時期・承認条件・記録先の記入指示は、rulebook では「未決事項と承認条件」の範囲であり共通の運用にも当たるため、移すか外す。未決事項の記入指示の列（決定者・確認担当・判断時期・記録先）は台帳の列なので、rulebook の『論点・利用への影響・当面の扱い』に合わせる。
- 変更案（bes-rulebook / bes-sample）: 変更が要る点は見つからなかった。
- 根拠とした成果物 bes-routine-due は product 側のパスにあり、この worktree には存在しないため、本文は読めなかった。見直しの根拠は rulebook・template・Recipe 記述標準・PJR-7M9J の一覧とした。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/recipes/bes-recipe.md だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

grade の finding F001・F002 を、対応する rulebook の本文要件と Recipe 記述標準に照らして修正した。recipe-maintenance の方針に沿い、成果物本体は変更せず recipe だけを直した。共通の運用と rulebook の言い直しは外し、型固有の問い・コツ・深掘りの順序・良い例と悪い例は残した。矛盾する場合は rulebook を正とした。根拠は bes-rulebook の「本文要件」と「ファイル命名・ID規則」、bes-template の導入の記入指示、Recipe 記述標準、PJR-7M9J の一覧。両 finding とも解消済みとして扱い、未解消のものはない。
