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

| No  | 作業                                                        | 担当 | 状態 | メモ                                            |
| --- | ----------------------------------------------------------- | ---- | ---- | ----------------------------------------------- |
| 1   | 並べ方を決めて記録する                                      | ARC  | done | 案A（種別別メニュー・共通分類体系）を採用       |
| 2   | sample・template・recipe・rulebook をサイドメニューに載せる | ARC  | done | 306件すべてを掲載、抜け漏れ補正・deprecated整理 |
| 3   | 数を記録し、文書サイトのビルドを確かめる                    | ARC  | done | 自動検査テスト追加、ビルド・型検査確認          |

## 5. 対応結果

### 実施内容

1. **サイドメニューの並べ方と選定理由**:
   - 案の検討:
     - 案A（種別別メニュー・共通分類体系案）: トップレベルに「レシピ」「サンプル」「テンプレート」「ルール」を並べ、内部の分類（「プロジェクト」「業務仕様」「外部I/F仕様」「アーキテクチャ」「システム設計」「非機能要件」「テスト」「移行」「運用」等）を統一する。
     - 案B（成果物別集約案）: 成果物（プロジェクト概要、概念データフロー図等）ごとに rulebook・recipe・sample・template を子アイテムとしてまとめる。
   - 選定理由:
     - 案Aを採用した。現在 recipe（23件）や template（68件）はすべての成果物に対して存在するわけではなく（rulebook は107件、sample は108件）、成果物ごとにサブ階層を作ると展開クリック数が増大して一覧性が著しく低下する。また、既存の「ルール」「レシピ」の構造やガイド「型で作る」の体系に合致し、「テンプレートを探す」「サンプルの書き方を参照する」といった目的別の利用動線が明快になるため。
2. **メニューに載る Kata の数の比較（変更前後の変化）**:
   - rulebook: 102件（有効99件、存在しない2件・非推奨1件） → **107件**（実在する非推奨以外の107件すべてを掲載。未掲載だった `cdfd-overview`, `cdfd-uc`, `cdfd-d2`, `ifx-cmd`, `ntp`, `stsd-mermaid`, `sysd`, `tml` の8件を補正し、非推奨の `cstd` および存在しない `cstd-mermaid`, `ifx` へのリンクを整理）
   - recipe: 16件 → **23件**（実在する23件すべてを掲載。未掲載だった `cdfd-overview`, `cdfd`, `cdfd-uc`, `stsd`, `bps`, `ifx-cmd`, `tsd` の7件を補正）
   - sample: 0件 → **108件**（実在する非推奨以外の108件すべてを掲載。非推奨の `cstd-sample` を除外）
   - template: 0件 → **68件**（実在する68件すべてを掲載）
   - 合計: 118件 → **306件**
3. **メニュー表示名の一貫性確保**:
   - `sidebar-config.ts` の注記方針に従い、各ページの H1 をベースとしつつ、親グループで種別が自明なため接尾辞（「作成ルール」「作成レシピ」「サンプル」「テンプレート」）や具体名・プレースホルダー（「: 駄菓子屋きぬや...」「: `_PROJECT_NAME_`」など）を落とした対象成果物の名称に統一した。これにより、成果物ごとに rulebook / recipe / sample / template を直感的に対で辿れるようにした。
4. **抜け漏れ検査テストの追加**:
   - `tests/packages/docs-site/sidebar-kata.test.ts` を追加し、Kata の抜け漏れ検査、非推奨混入防止、実在ファイル解決を自動検証できるようにした。
   - 理由: 今後 Kata の新規追加や非推奨化が発生した際に、サイドメニューへの登録漏れやリンク切れを自動検知して再発を防止するため。

### 成果物・変更ファイル

- `packages/docs-site/.vitepress/sidebar-config.ts`
- `tests/packages/docs-site/sidebar-kata.test.ts`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-pqg3-sidebar-kata-menus.md`

### 残課題

- なし。全 306 件の非推奨でない Kata がサイドメニューから正常に閲覧可能となった。

## 6. 関連ドキュメント

- `packages/docs-site/.vitepress/sidebar-config.ts`
