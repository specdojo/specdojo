---
specdojo:
  id: prj-0001:pjr-a45t-ryu-guide-md-kata-guide-md-approach
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_on: "2026-08-08"
  completed_on: "2026-08-08"
---

# PJR-A45T ryu-guide.md新設(kata-guide.mdからapproachの説明を分離)とサイドバー・相互参照リンク更新

## 1. 概要

kata-guide.mdの進め方(approach)に関する章をryu-guide.mdへ分離し、id・frontmatter・H1(実践の進め方ガイド/Ryu Guide)を新設する。kata-guide.mdは型(rulebook/recipe/sample/template)の使い分けに焦点を絞る。サイドバー表示名(実践の進め方)と相互参照リンクを追従修正する。

SpecDojo の道場メタファーで、進め方（`approach`）は「Ryu」に対応する。現行の [[specdojo:kata-guide]] は、実質的な内容の大半（進め方の選び方・一覧、参照の共通原則、型メンテナンスの進め方、reviewへの適用）が `approach` の説明であり、型（rulebook/recipe/sample/template）そのものの使い分けを示す内容は冒頭の一部にとどまる。`approach` に関する章を `ryu-guide.md` として新設分離し、[[specdojo:kata-guide]] は型の役割・使い分けに焦点を絞り直す。

## 2. 完了条件

- `docs/ja/specdojo/guides/ryu-guide.md` が新設され、frontmatter の `id` が `specdojo:ryu-guide`、H1が「実践の進め方ガイド」、直下の英語名行が「Ryu Guide」になっている。
- [[specdojo:kata-guide]] の現行「整備状況に応じた進め方（approach）」「実践の型メンテナンスの進め方」「reviewへの適用」に相当する内容が `ryu-guide.md` へ移設されている。
- [[specdojo:kata-guide]] は型（rulebook/recipe/sample/template）の役割・使い分けに焦点を絞った構成に再編され、`ryu-guide.md` との相互参照（型の使い分けは kata-guide、進め方の選択は ryu-guide という参照分担）が明記されている。
- `ryu-guide.md` の冒頭付近に、「Ryu」が説明用の愛称・分類であり、`approach` フィールドの名称や値そのものを変更するものではない旨の注記がある。
- `.vitepress/sidebar-config.ts` に `guide("実践の進め方", "ryu-guide")` が「実践体系で作る」グループ内、`practice-system-composition-guide` の次・`kata-guide` の前に追加されている。
- `approach` の説明先として `kata-guide.md` を参照している既存ファイル（`docs-structure-guide.md`、`practice-system-composition-guide.md`、`schedule-design-guide.md`、`review-guide.md`、`use-case-guide.md`、`orchestrator-operation-guide.md`、関連 template・standard 等）の相互参照が `ryu-guide.md` への参照に追従修正されている。
- `npm run lint:md` がエラーなく通る。
- `npm run docs:build` がエラーなく通る。

## 3. 作業内容

| No  | 作業                                                                                       | 担当 | 状態 | メモ                                                                           |
| --- | ------------------------------------------------------------------------------------------ | ---- | ---- | ------------------------------------------------------------------------------ |
| 1   | [[specdojo:guide-authoring-standard]] に沿って `ryu-guide.md` の章構成を設計する           | ARC  | done | 英語名行・導入ブロック・Ryu注記を規約準拠で新設                                |
| 2   | [[specdojo:kata-guide]] の該当章を `ryu-guide.md` へ移設する                               | ARC  | done | approach 章・型メンテナンス章・review 適用章を移設                             |
| 3   | [[specdojo:kata-guide]] を型の役割・使い分けに焦点を絞った構成へ再編し、相互参照を追加する | ARC  | done | 参照分担表を追加                                                               |
| 4   | `.vitepress/sidebar-config.ts` へ `ryu-guide.md` のエントリを追加する                      | ARC  | done | `practice-system-composition-guide` の次・`kata-guide` の前に配置              |
| 5   | `kata-guide.md` を approach の説明先として参照している既存ファイルの相互参照を追従修正する | ARC  | done | guide/template 計 32 箇所を ryu-guide へ更新（型役割の参照は kata に据え置き） |
| 6   | `npm run lint:md` / `npm run docs:build` を実行し、エラーがないことを確認する              | ARC  | done | いずれもエラーなし                                                             |

## 4. 対応結果

- `docs/ja/specdojo/guides/ryu-guide.md`（`id: specdojo:ryu-guide`、H1「実践の進め方ガイド」／英語名「Ryu Guide」）を新設し、[[specdojo:kata-guide]] の approach 章・実践の型メンテナンスの進め方・review への適用を移設した。冒頭に「Ryu は説明用の愛称・分類であり `approach` の名称・値を変更しない」旨の注記を置いた。
- [[specdojo:kata-guide]] は型（rulebook/recipe/sample/template）の役割・使い分けに焦点を絞り、`進め方（approach）との参照分担` 章で `ryu-guide.md` との参照分担（型の使い分けは kata、進め方の選択は ryu）を明記した。
- `.vitepress/sidebar-config.ts` の「実践体系で作る」グループに `guide("実践の進め方", "ryu-guide")` を追加した。
- approach 参照を kata に向けていた guide・template の相互参照を `ryu-guide.md` へ追従修正した。型そのものの役割・使い分けを指す参照（`index.md`・`deliverables-reference.md`・`specdojo-overview-guide.md` の使い分け表・`recipe-authoring-standard.md`・`specdojo-philosophy.md` の Kata 概念参照）は kata に据え置いた。
- `npm run lint:md` と `npm run docs:build`（doc-index 再生成で `specdojo:ryu-guide` を採番、mermaid SVG 生成含む）がエラーなく完了した。

## 5. 関連ドキュメント

- 変更対象: [[specdojo:kata-guide]]
- 上位構成の根拠: [[specdojo:practice-system-composition-guide]]
- 影響先: [[specdojo:docs-structure-guide]]
- 影響先: [[specdojo:schedule-design-guide]]
- 影響先: [[specdojo:review-guide]]
- 章構成規約: [[specdojo:guide-authoring-standard]]
- サイドバー設定（`docs/` 外ファイル）: `.vitepress/sidebar-config.ts`
- 対になる登録項目: [[prj-0001:pjr-8qa1-waza-guide-md-cli-overview-guide-md-waza]]（waza-guide.md 新設）
