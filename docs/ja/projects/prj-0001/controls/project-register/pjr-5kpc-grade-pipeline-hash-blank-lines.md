---
specdojo:
  id: prj-0001:pjr-5kpc-grade-pipeline-hash-blank-lines
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-16T09:31:33Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-19T05:36:20Z"
---

# PJR-5KPC grade pipeline 状態の同一性判定が grade 自身の finding 挿入で崩れる

## 1. 概要

PJR-0W8S の pipeline 状態は content_hash（stableContentHash）の一致で有効性を判定するが、grade apply は段ごとに finding コメントを除去して挿入し直し、ブロック直前に空行を補うため、finding を除いた本文でも空行の位置と数が段の間で変わる。手動起動した成果物評価で cdfd-action の 2 段目が「stage 2 must immediately follow completed stage 0」で失敗し Job Run 全体が失敗した。pipeline 状態のハッシュを空行を無視する正規化に変えて解消する。

## 2. 完了条件

- pipeline 状態の同一性判定が、finding コメントと空行の差を無視するハッシュ（`pipelineContentHash`）で行われ、本文の非空行が変わった場合だけ状態が無効になる。
- 単体テストに、finding 挿入と空行の追加だけではハッシュが変わらないケースと、本文の変更で変わるケースがある。
- 成果物評価の 3 段が同じ run で連続して apply でき、`stage 2 must immediately follow completed stage 0` が再発しない。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit` が成功する。

## 3. 作業内容

| No  | 作業                                                     | 担当 | 状態 | メモ                               |
| --- | -------------------------------------------------------- | ---- | ---- | ---------------------------------- |
| 1   | pipeline 状態のハッシュを空行を無視する正規化にする      | ARC  | done | `pipelineContentHash` を追加       |
| 2   | 単体テストを追加し、既存テストを新しいハッシュに合わせる | ARC  | done | `tests/src/grade.test.ts`          |
| 3   | 成果物評価を再実行して 3 段の連続 apply を確認する       | ARC  | done | 9/17〜18 の成果物評価 3 run で確認 |

## 4. 対応結果

- `src/grade.ts` に `pipelineContentHash` を追加し、pipeline 状態の書き込みと有効性判定の両方で使うようにした。frontmatter（grade を除く）と、finding コメントと空行を除いた本文からハッシュを計算する。`--changed-only` の判定に使う `stableContentHash` は変更していない。
- `tests/src/grade.test.ts` に、finding 挿入と空行の追加でハッシュが変わらないケースと、本文の変更で変わるケースを追加し、既存の `--incomplete` 選択テストを新しいハッシュに合わせた。
- 作業 3 は 2026-09-17〜18 の成果物評価（`JBR-grade-deliverable-0dc34560cbfd`、`5f596938a6de`、`0f3d658814b3`）で確認した。cdfd 10 文書で 1〜3 段が同じ run で連続して apply され、`stage 2 must immediately follow completed stage 0` は再発していない。`0dc34560cbfd` はメモリ不足で中断した後に同一 run で再開し、finding 挿入後の文書でも `resume skip … status=complete` / `document resume … start_stage=3` と同一性判定が保たれた。
- PJR-W5JT で grade を codex 単段に変更したため、以後は「3 段の連続 apply」という確認項目自体がなくなる。`pipelineContentHash` は単段でも pipeline 状態の再開判定に使われる。

## 5. 関連ドキュメント

- 元の実装: [[prj-0001:pjr-0w8s-grade-retry-failed-stage]]
- 失敗した run: `JBR-grade-deliverable-f07157bb99d7`
