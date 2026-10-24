---
specdojo:
  id: prj-0002:pjr-3tj2-lp-plan-mode-comparison-wording
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: easy
  owner: UX
  registered_at: "2026-10-23T23:38:52Z"
  derived_from:
    - PJR-0WFV
---

# PJR-3TJ2 LP の plan モードとの対比の文面を直す

## 1. 概要

PJR-0WFV で LP の「register の考え方」に加えた plan モードとの対比のうち、状態の遷移の行の「会話終了や時間経過とともに消去」を事実に合わせ、主語のない冒頭の一文を読みやすく直す

## 2. 完了条件

- `specdojo-lp` の `src/components/sections/RegisterTypes.astro` の `planModeComparisonRows` で、`aspect: "状態の遷移"` の行の `planMode` を `状態管理なし` にする。括弧書きの「会話終了や時間経過とともに消去」は削る。plan のファイルは会話が終わっても残るため、事実と違う。消え方は「残り方」の行の「既定では一定期間で消えうる」に任せる。
- 同じファイルの「plan モードと register の使い分け」の見出しの直後の段落を、次の 2 文にする。
  - 1 文目: `register は、1 件を早く仕上げる道具ではなく、プロジェクトの判断と作業を検証できる形で残し、複数の agent に安全に実行させる台帳です。`
  - 2 文目: `AI ツールの plan モードは段取りの下書きとして、register と補い合います。`
- ほかの行・見出し・表示の構造・`ToolFit.astro` は変えない。変えるのは `RegisterTypes.astro` だけとする。
- 作業を終える前に、`specdojo-lp` で `npm run typecheck`・`npm run lint:ts`・`npm run format:check`・`npm run build` を実行して通す。
- 親の検証が通る。

## 3. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ                       |
| --- | -------------------------------------- | ---- | ---- | -------------------------- |
| 1   | 対比の状態の遷移の行と冒頭の段落を直す | UX   | done | `RegisterTypes.astro` だけ |

## 4. 対応結果

- 実施内容:
  - `specdojo-lp` の `src/components/sections/RegisterTypes.astro` の `planModeComparisonRows` で、`aspect: "状態の遷移"` の行の `planMode` を `状態管理なし` に修正し、括弧書きの「会話終了や時間経過とともに消去」を削除した。
  - 同ファイルの「plan モードと register の使い分け」見出し直後の段落について、主語を補い「`register` は、1 件を早く仕上げる道具ではなく、プロジェクトの判断と作業を検証できる形で残し、複数の `agent` に安全に実行させる台帳です。AI ツールの `plan` モードは段取りの下書きとして、`register` と補い合います。」の 2 文へ修正した。
- 成果物:
  - `specdojo-lp:src/components/sections/RegisterTypes.astro`
- 残課題:
  - なし

## 5. 関連ドキュメント

- [[prj-0002:pjr-0wfv-lp-why-register]]: 対比を加えた元の項目。
