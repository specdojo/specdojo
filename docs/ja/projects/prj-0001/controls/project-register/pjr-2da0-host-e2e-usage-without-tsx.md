---
specdojo:
  id: prj-0001:pjr-2da0-host-e2e-usage-without-tsx
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  owner: DEV
  registered_at: "2026-10-20T12:26:01Z"
  derived_from:
    - PJR-3RXY
---

# PJR-2DA0 ホストの devcontainer の E2E を tsx なしで動かす案内に直す

## 1. 概要

tools/e2e/devcontainer-host-e2e.ts の使い方の表示とガイドは node --import tsx で動かすよう案内しているが、ホストの Mac ではコンテナと共有する node_modules の esbuild が Linux 用のため tsx が動かない。スクリプトは Node の標準ライブラリしか使わず、Node 24 なら node で直接動くため、案内を node tools/e2e/devcontainer-host-e2e.ts に直す（2026-10-20、利用者がホストで流して確かめた）

## 2. 完了条件

- `tools/e2e/devcontainer-host-e2e.ts` の冒頭のコメントと使い方の表示を、`node tools/e2e/devcontainer-host-e2e.ts`（`--keep` も同じ）に改める。
- [[specdojo:remote-host-development-guide]] の実行の方法を同じく改め、ホストとコンテナで `node_modules` を共有しているため `tsx` は使えないこと、Node 22.18 以上（型を外して直接動かせる版）が要ることを書く。
- スクリプトが Node の標準ライブラリだけを import していることを保つ（型だけの import は `import type` にする）。
- `node tools/e2e/devcontainer-host-e2e.ts --help` が、コンテナの中でも使い方を表示して終わることを確かめる。
- `npx prettier --check` と `npm run lint:md` が通る。親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG には記載しない（開発用のスクリプトと、その使い方の記述のため）。

## 3. 作業内容

| No  | 作業                        | 担当 | 状態 | メモ |
| --- | --------------------------- | ---- | ---- | ---- |
| 1   | E2E の案内を tsx なしに直す | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-3rxy-host-devcontainer-e2e-script]]（元の項目）
