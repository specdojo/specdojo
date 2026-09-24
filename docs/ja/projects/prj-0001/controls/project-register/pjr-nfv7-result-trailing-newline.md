---
specdojo:
  id: prj-0001:pjr-nfv7-result-trailing-newline
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  owner: DEV
  registered_at: "2026-09-23T21:26:24Z"
  due_on: "2026-10-24"
  block_reason: "integrate failed: git status failed: fatal: detected dubious ownership in repository at '/workspaces/specdojo-workspace/worktrees/prj-0001-PJR-NFV7' (args: --porcelain=v1 -z --untracked-files=all)"
---

# PJR-NFV7 result の末尾改行を runner 側で正規化する

## 1. 概要

2026-09-23 夜間の grade routine が生成した result のうち 2 件に末尾改行が無く、`npm run lint:md` が MD047（`Files should end with a single newline character`）で失敗した。

```text
docs/ja/projects/prj-0001/execution/exec/results/JBR-grade-deliverable-ceb925289809-result.md
docs/ja/projects/prj-0001/execution/exec/results/JBR-grade-kata-f8b11861e500-result.md
```

32 件中 2 件であり、書き出し処理が常に改行を落としているわけではない。reporter が生成した本文がそのまま書かれ、agent の出力にばらつきがあることに由来する。

`lint:md` は pre-commit で走るため、この状態のまま commit しようとすると止まる。routine は自動実行される前提なので、**自動実行の成果物が人手の介入を呼ぶ**形になっている。

## 2. 完了条件

- runner が result を書き出す際、末尾に改行が 1 つあることを保証する。既に改行がある場合は増やさない。
- plan など、同じ経路で書き出す他の Markdown 成果物にも同じ正規化が適用されている。
- 末尾改行の有無が異なる入力に対して、出力が同一になることを検証する単体テストがある。
- 既存の result を再生成せずとも `npm run lint:md` が通過する状態を保つ。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ                           |
| --- | ------------------------------------------ | ---- | ---- | ------------------------------ |
| 1   | result の書き出し経路を特定する            | DEV  | done | `formatMarkdownFile` に集約    |
| 2   | 末尾改行の正規化を入れる                   | DEV  | done | 冪等に 1 改行へ正規化          |
| 3   | plan など同じ経路の成果物へも適用する      | DEV  | done | plan / result の共通経路へ適用 |
| 4   | 入力のばらつきに対する単体テストを追加する | DEV  | done | 改行あり／なし／複数を検証     |

## 4. 対応結果

- `formatMarkdownFile` で Markdown の末尾を 1 改行へ正規化するようにした。
- Prettier 対象外の exec plan / result も本文は整形せず、末尾改行だけを正規化する。
- plan / result の両方について、末尾改行なし・1つ・複数の入力が同一出力になる単体テストを追加した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-mwwp-dashboard-cell-sanitize]]
- `src/exec-results.ts`
