---
specdojo:
  id: prj-0001:pjr-34f2-terminology-kata-waza-docs
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: BA
  registered_at: "2026-10-12T06:10:44Z"
  due_on: "2026-10-31"
  completed_at: "2026-10-12T07:20:24Z"
  conclusion: 体系の名前を成果物・型・技に改め、標語・PDCA マトリクス・仕様書の語・app1-workspace/ を文書へ反映した
---

# PJR-34F2 体系の名前を成果物・型・技に改め、標語と PDCA マトリクスを文書へ反映する

## 1. 概要

PJR-9G9Y の決定（C、名前は成果物・型・技）に従い、全体概要ガイドの 3 つの体系を成果物・型（Kata）・技（Waza）に改め、流（Ryu）をそれらをつなぐ属性として説明する。標語・遂行の PDCA マトリクス・「仕様書」の語・app1-workspace/ を文書へ反映する

## 2. 完了条件

[[prj-0001:pjr-9g9y-practice-execution-terminology]] の決定内容に従い、次が反映されている。

- [[specdojo:specdojo-overview-guide]] の `SpecDojoとは` の 3 つの体系の表が、成果物・型（Kata）・技（Waza）の表になっている。流（Ryu、`approach`）は、成果物・型・技をつなぐ属性（タスクごとに型をどこまで基準にして技を使うか）として説明され、技の使い方の種類としては書かれていない。「遂行体系」の語は使わず、技を PDCA × register・schedule・routine + Job のマトリクス（9G9Y の 1.3. の案）で説明している。
- 「実践体系」の語が、次の 14 ファイルで型（Kata）に改められている。文の意味が変わる箇所は、文脈に合わせて言い換える。文書の id は変えない（[[specdojo:practice-system-composition-guide]] は題名を「型の構成ガイド」などに改め、id はそのまま）。
  - `README.md`、`docs/ja/specdojo/index.md`
  - guides: docs-structure-guide、kata-guide、practice-system-composition-guide、quick-start-guide、ryu-guide、specdojo-overview-guide
  - references: command-reference、directory-layout-reference
  - standards: document-metadata-standard、id-and-file-naming-standard、philosophy-authoring-standard
  - philosophy: specdojo-philosophy
- 標語「決めて、書いて、鍛え続ける。」が「記して、形にして、磨き続ける。」に改められている（`README.md`、`docs/ja/index.md` など、登録簿の個票以外の文書）。
- プロダクト文書を指す「設計書」が「仕様書」に改められている（`README.md`、[[specdojo:quick-start-guide]] など）。「設計書」が設計工程の成果物そのものを指す箇所は改めない。
- 別リポジトリ構成の親ディレクトリが `app1-workspace/` になっている（`README.md`、[[specdojo:quick-start-guide]]、[[specdojo:directory-layout-reference]]）。worktree 用ディレクトリなど、関連する例の名前も揃っている。
- 登録簿の個票・plan・result などの履歴の文書は改めない。
- `npm run lint:md`、`npm run lint:fm`、`npm run docs:build` が通る。

## 3. 作業内容

| No  | 作業                                                           | 担当 | 状態 | メモ |
| --- | -------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 全体概要ガイドの体系の表・流の位置づけ・技のマトリクスを改める | BA   | done | -    |
| 2   | 「実践体系」を使う 14 ファイルの語を改める                     | BA   | done | -    |
| 3   | 標語・「仕様書」・`app1-workspace/` を反映する                 | BA   | done | -    |

## 4. 対応結果

- [[specdojo:specdojo-overview-guide]] の `SpecDojoとは` の表を成果物・型（Kata）・技（Waza）に改め、流（Ryu、`approach`）を成果物・型・技をつなぐ属性として説明した。`成果物から実行管理への展開` で、技を PDCA × register・schedule・routine + Job のマトリクスで説明し、「遂行体系」の語をなくした。章題 `実践体系の役割` は `型の役割` に改めた。
- 「実践体系」を、完了条件に挙がる 14 ファイルで型（Kata）に改めた。[[specdojo:practice-system-composition-guide]] の題名は「型の構成ガイド」とし、id は変えていない。章題の変更（`成果物と型の関係`、`型の文書`、`型の文書のID`、`型の文書のlocal-id`）に合わせて、章題を参照する箇所も改めた。
- ドキュメントサイトのサイドバー（`packages/docs-site/.vitepress/sidebar-config.ts`）の表示名を H1 に揃え、グループ名を「型で作る」「技で回す」に改めた。
- 標語を `README.md`、`docs/ja/index.md`、[[specdojo:quick-start-guide]]、[[specdojo:specdojo-overview-guide]] で「記して、形にして、磨き続ける。」に改めた。
- プロダクト文書を指す「設計書」を `README.md` と [[specdojo:quick-start-guide]] で「仕様書」に改めた。エージェント指示ファイルの「関連する設計書を確認する」など、設計の文書そのものを指す箇所は改めていない。
- 別リポジトリ構成の親ディレクトリを `README.md`、[[specdojo:quick-start-guide]]、[[specdojo:directory-layout-reference]]、[[specdojo:docs-structure-guide]] で `app1-workspace/` に改めた。worktree 用ディレクトリ `app1-specdojo-worktrees/` はプロジェクトリポジトリ名から導かれる既存の名前と一致しているため、そのままとした。
- 残課題: なし。

## 5. 関連ドキュメント

- [[prj-0001:pjr-9g9y-practice-execution-terminology]]: 決定内容の正本
- [[prj-0002:pjr-hepk-lp-content]]: 新しい標語と語を先に使っている LP の原稿
