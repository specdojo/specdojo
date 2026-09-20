---
specdojo:
  id: prj-0001:pjr-xkks-grade-sidecar
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-09-20T05:08:04Z"
  due_on: "2026-09-30"
---

# PJR-XKKS grade の結果と finding を成果物から切り離しサイドカーへ移す

## 1. 概要

grade は成果物の frontmatter（`specdojo.grade`: verdict / score / viewpoints / content_hash / findings 件数）と本文（`<!-- specdojo:finding … -->`）に評価を書き込む。この設計が次の問題を生んでいる。

- 成果物の `git log` / `blame` に評価だけの commit が並ぶ（夜間 routine 1 回で 10〜18 ファイルが変更扱い）。
- finding コメントの挿入が `prettier-ignore` や表を分断し、`content_hash` がずれた（PJR-3KBG、PJR-5KPC）。ハッシュ計算から grade と finding を除外する特別扱いをコードに持ち込んで回避した。
- 本文に前回の finding が同居するため、評価者（gemma）がそれを読んで再掲する。
- frontmatter の件数と本文コメント数の二重管理が `grade validate` の不一致（`comments=0`）を生む。
- Detached Unit では `docs/ja/product` はプロダクト実装リポジトリ（`app1/`）側に置く（PJR-QHKA 2.4.3）。成果物へ書き込む限り、grade routine の commit がプロダクト実装の履歴に流れ込む。
- Kata（rulebook / template / sample）は利用プロジェクトでは npm パッケージから読むため、書き込み先として成立しない。

### 1.1. 決定事項

- grade の結果は成果物に書かず、サイドカー `execution/grade/results/<doc-id>.yaml`（doc-id ごと 1 ファイル、最新のみ）に置く。履歴は Job Run と evidence に残す。既存の `execution/grade/criteria/` と `pipeline/` と同じ置き場に揃える。
- finding はサイドカーの `findings[]` に `id` / `severity` / `rule` / `line` / `anchor`（該当行の引用）/ `message` で持ち、本文コメントは廃止する。`anchor` により行ずれに耐える。
- Kata の grade は SpecDojo 本体（prj-0001）の `execution/grade/results/` に置く。利用プロジェクトは Kata を評価しない。
- `content_hash` は成果物の内容そのもの（frontmatter 全体 + 本文）から計算し、grade と finding の除外という特別扱いをなくす。
- agent への finding 提示は plan 生成時にサイドカーから plan 本文へ展開する（本文コメントを読ませない）。refine / rulebook-maintenance / recipe-maintenance / bootstrap の各テンプレートを改める。
- 読み手への提示は dashboard（成果物ごとの verdict / score / finding 件数）と docs-site の表示時合成で行う。成果物ページの frontmatter 表示に依存しない。
- 既存の成果物・Kata から `specdojo.grade` と `specdojo:finding` を一括で剥がし、サイドカーへ移行する（1 回限りの migrate コマンド）。

## 2. 完了条件

- `grade apply` がサイドカーだけを書き、成果物と Kata のファイルを変更しない。
- `grade list --changed-only` / `--ungraded` / `--incomplete`、`grade validate`、`grade state`、`schedule-approach` の grade 参照がサイドカーを読む。
- `content_hash` の計算から grade / finding の除外がなくなり、`stableContentHash` と `pipelineContentHash` が単純化されている。
- exec plan テンプレート（refine-2 の finding 解消、rulebook / recipe maintenance、bootstrap）が、サイドカーの finding を plan 本文に展開する形になっている。
- dashboard に成果物ごとの grade 概要が出る。docs-site で成果物ページに grade が表示時合成される。
- `grade migrate` で既存の frontmatter `specdojo.grade` と本文 finding コメントがサイドカーへ移り、成果物側から消えている。`grade validate` のエラーが 0 件になる。
- deliverable-frontmatter / rulebook-frontmatter の schema から `grade` が外れ、サイドカーの schema が `docs/specdojo/schemas/v1/` に追加されている。
- `npm run check` が通過し、単体テストにサイドカーの読み書き・移行・plan 展開が含まれている。

## 3. 作業内容

| No  | 作業                                                                                                                     | 担当 | 状態 | メモ                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------ | ---- | ---- | ------------------------------------------------- |
| 1   | サイドカーの schema と読み書き（`grade apply` / `list` / `validate` / `state`）を実装し、`content_hash` の特別扱いを除く | DEV  | open | codex-expert-executor / gemma-reporter / worktree |
| 2   | `grade migrate` を実装し、既存の成果物・Kata からの一括移行と `grade validate` 0 件を確認する                            | DEV  | open | 作業 1 と同一タスク                               |
| 3   | exec plan テンプレート 4 本と plan 生成を、サイドカーの finding を本文へ展開する形に改める                               | DEV  | open | 同上                                              |
| 4   | dashboard と docs-site の表示時合成、frontmatter schema の更新、guide の更新                                             | DEV  | open | 同上                                              |
| 5   | prj-0001 で migrate を実行し、成果物と Kata から grade が消えたことと夜間 routine の commit 範囲を確認する               | ARC  | open | オーケストレーターが直接対応                      |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qhka-docs-structure-detached-unit]]
- [[prj-0001:pjr-tbhh-detached-unit-default]]
- [[prj-0001:pjr-3kbg-grade-finding-insertion-prettier-ignore]]
- [[prj-0001:pjr-5kpc-grade-pipeline-hash-blank-lines]]
- `src/grade.ts`
- `src/schedule-approach.ts`
- `docs/ja/specdojo/exec-templates/`
- `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`
