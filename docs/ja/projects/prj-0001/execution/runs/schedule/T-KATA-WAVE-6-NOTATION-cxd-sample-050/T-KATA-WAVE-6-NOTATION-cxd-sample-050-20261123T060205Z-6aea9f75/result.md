---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-notation-cxd-sample-050-20261123t060205z-6aea9f75
  type: exec-result
  task_id: T-KATA-WAVE-6-NOTATION-cxd-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-NOTATION-cxd-sample-050/T-KATA-WAVE-6-NOTATION-cxd-sample-050-20261123T060205Z-6aea9f75/plan.md
  started_at: "2026-11-23T06:02:13.955Z"
  completed_at: "2026-11-23T06:20:16.800Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cxd-sample
    - specdojo:cxd-sample
---

# Edit Result

## 1. 実施内容

- C4コンテキスト図の完成例である `docs/ja/specdojo/samples/cxd-sample.md` を、共通サンプルとしての厚みを持たせる形で更新しました。
- 指摘事項 `F001` 〜 `F004` に基づき、以下の修正を行いました：
- 概要に `[[specdojo:prj-overview-sample|プロジェクト概要]]` へのリンクと位置づけを追記し、プロジェクト目的との整合性を確保しました。
- 表の列見出しを `cxd-template` の骨組みと一致するよう修正しました。
- Frontmatter に `supersedes` フィールドを追加し、テンプレートの生成結果と整合させました。
- 「主確認ロール」や「担当ロール」といった、テンプレートの骨組みに含まれない役割の記述を削除し、PJR-76N9 に従って役割の割り当てを本文から排除しました。
- 表の前に、将来課題の内容を説明する一文を追加しました。
- `prettier` および `markdownlint` による整形と検査を完了しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cxd-sample.md`: sample の厚みを増やすため、プロジェクト概要への参照の追加、`cxd-template` に合わせた表の列見出しの修正、Frontmatter への `supersedes` の追加、および不要な役割記述の削除を行いました。

## 3. 申し送り

- rulebook と template の食い違いについて: `cxd-rulebook` の「Person（人・ロール）」は推奨列を「境界上の接点・確認責務」としていますが、`cxd-template` では「境界上の接点」となっています。本 sample では `rulebook` を正として「境界上の接点・確認責務」のまま維持しています。`template` の列名を `rulebook` に合わせて修正することを提案します。
- F004 に対応するため、検証観点の「主確認ロール」列と将来課題の「担当ロール」列を削除しました。これらは `template` の骨組みにない列であり、PJR-76N9 の「役割の割り当てを本文に書かない」という規約にも合致させるためです。また、解消条件の記述から役割の主導的な振る舞いを想起させる表現も削除しました。
- 決める必要のある値（性能や日程など）については、この sample の範囲内では `_UNDECIDED_` にあたる値は存在しません。
- rulebook と template の食い違い: cxd-rulebook の「Person（人・ロール）」は推奨列を「境界上の接点・確認責務」としているが、cxd-template では「境界上の接点」になっている。sample は rulebook を正として「境界上の接点・確認責務」のまま残した。template の列名を rulebook に合わせる直しを提案する（この段では template を変えていない）。
- F004 は、検証観点の「主確認ロール」列と将来課題の「担当ロール」列を消して対応した。どちらも template の骨組みにない列で、PJR-76N9（役割の割り当てを本文に書かない）にもあたる。解消条件の文から、役割が受入を保留すると読める書き方も外した。
- 決める必要のある値はなし（性能・日程などの `_UNDECIDED_` にあたる値は、この sample には出てこない）。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/cxd-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（`*.yaml` / `*.yml` を変更していない）

## 4. 進め方と実践の型の適用

指示に従い、`docs/ja/specdojo/samples/cxd-sample.md` を `docs/ja/specdojo/standards/sample-authoring-standard.md` の基準を満たす完成例として厚くしました。`grade` からの指摘事項 `F001` 〜 `F004` を全て解消し、成果物としての独立性と、テンプレートや rulebook との整合性を確保しました。
