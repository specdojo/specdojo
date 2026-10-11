---
specdojo:
  id: prj-0002:pjr-g4qn-lp-tech-stack-evaluation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: ARC
  registered_at: "2026-10-11T08:27:47Z"
  block_reason: "checkpoint failed: Worktree preparation failed: specdojo build exited with 1 in /workspaces/specdojo-workspace/worktrees/prj-0002-PJR-G4QN/project. Generated docs are gitignored and must be rebuilt pe…"
---

# PJR-G4QN ランディングページの技術スタックの候補を比較評価する

## 1. 概要

PJR-FV3W の判断材料として、ランディングページの技術スタックの候補を比較評価し、推奨案をまとめる。前提・候補・観点は PJR-FV3W の「背景」と「検討した選択肢」に従う。

- 候補: A は Next.js（静的書き出し）+ Tailwind CSS、B は Astro + Tailwind CSS、C は Nuxt（静的書き出し）+ Tailwind CSS。
- 観点: 標準的であること（利用者の多さ、公式の案内の有無）、Cloudflare への配置のしやすさ、マテリアルデザインの指針を Tailwind CSS で表現しやすいか、学ぶ手間、表示の速さ、保守の続けやすさ。
- 公開先は Cloudflare 上の静的サイトとする。利用者は Next.js の経験があるが、こだわりはない。
- 決定は利用者が PJR-FV3W で行う。本項目は判断材料をまとめるところまでとする。

## 2. 完了条件

- 本個票の「対応結果」に、3 候補を 6 観点で評価した表がある。各評価に根拠（公式ドキュメントなどの URL）が付いている。
- 「対応結果」に、推奨案とその理由がある。PJR-FV3W に書いた利点と懸念の見立てと異なる点があれば、それも記載している。
- 変更は本個票だけである。PJR-FV3W の個票、リポジトリ `specdojo-lp`、実装には変更を加えていない。

## 3. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | 3 候補を 6 観点で調査し、根拠付きの評価表を作る | ARC  | open | -    |
| 2   | 推奨案と理由をまとめる                          | ARC  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 本項目の評価を判断材料とする decision。
