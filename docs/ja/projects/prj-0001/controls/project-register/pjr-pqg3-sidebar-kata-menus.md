---
specdojo:
  id: prj-0001:pjr-pqg3-sidebar-kata-menus
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-03T03:24:41Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BC45
  commit_type: docs
  commit_scope: docs-site
---

# PJR-PQG3 VitePress のサイドメニューに Kata の sample・template・recipe を載せる

## 1. 概要

specdojo 配下のサイドメニューに sample と template を載せ、recipe と rulebook の抜けを補い、成果物ごとに rulebook・recipe・sample・template を辿れるようにする

## 2. 入力

- specdojo 配下のサイドメニューは packages/docs-site/.vitepress/sidebar-config.ts に手で並べている。sample（110）と template は 1 つも載っておらず、recipe はプロジェクト定義とプロジェクトマネジメントの分だけ。概念データフロー図の rulebook は cdfd と cdfd-mermaid だけで、cdfd-overview・cdfd-uc・cdfd-d2 が載っていない（2026-11-03）
- 利用者は cdfd-overview-sample をサイドメニューから開けなかった。直し方は、概念データフロー図だけを補う案ではなく、sample と template を全部載せる案 B を選んだ（2026-11-03）

## 3. 完了条件

- サイドメニューの並べ方を決め、案と選んだ理由を個票の対応結果に記録している。案の例は、「ルール」と同じ分類で「サンプル」「テンプレート」のメニューを作る形と、成果物ごとに rulebook・recipe・sample・template をまとめる形
- `docs/ja/specdojo/samples/` と `docs/ja/specdojo/templates/` の status が deprecated でない文書が、すべてサイドメニューから開ける
- `docs/ja/specdojo/rulebooks/` と `docs/ja/specdojo/recipes/` の status が deprecated でない文書のうち、サイドメニューに載っていなかったものを補っている。概念データフロー図の cdfd-overview・cdfd-uc・cdfd-d2 の rulebook を含む
- メニューの表示名は、既存の方針（`sidebar-config.ts` の注記）に従い、各ページの H1 にそろえている
- 載っていない Kata を検査できるようにするか（テストやスクリプトの追加）は executor が決め、理由を個票の対応結果に記録している
- 変えるのは `packages/docs-site/.vitepress/` 配下と、検査を足す場合はそのテストだけ。Kata の文書は変えない
- 変更前と後で、メニューに載る Kata の数を種類ごとに個票の対応結果に記録している
- `npm run docs:build`・`npm run typecheck`・`npm run lint:ts` と親の検証が通る

## 4. 作業内容

| No  | 作業                                                        | 担当 | 状態 | メモ |
| --- | ----------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 並べ方を決めて記録する                                      | ARC  | open | -    |
| 2   | sample・template・recipe・rulebook をサイドメニューに載せる | ARC  | open | -    |
| 3   | 数を記録し、文書サイトのビルドを確かめる                    | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- `packages/docs-site/.vitepress/sidebar-config.ts`
