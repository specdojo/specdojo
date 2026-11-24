---
specdojo:
  id: prj-0001:xer-t-kata-review-calibration-stsd-sample-150-20261124t044602z-42cda1c3
  type: exec-result
  task_id: T-KATA-REVIEW-CALIBRATION-stsd-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-CALIBRATION-stsd-sample-150/T-KATA-REVIEW-CALIBRATION-stsd-sample-150-20261124T044602Z-42cda1c3/plan.md
  started_at: "2026-11-24T04:46:10.247Z"
  completed_at: "2026-11-24T04:50:11.496Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stsd-sample
    - specdojo:stsd-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）の確認を行い、`stsd-sample` の frontmatter `based_on` を空配列に修正した。
- Sample 記述標準を指す `based_on` は、先行成果物だけを指定する stsd-rulebook の規定、およびカタログの `depends_on` が空であることと整合しないため、rulebook を正として外した。
- plan 展開の F001（品質不良・合格基準の未定義）は R4 の追記で、F002（家族利用者代表からの引継ぎの明示）は R3 の対応で解消済みだった。再指摘や追加修正は行っていない。
- 整形検査（prettier）と `git diff --check` は成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stsd-sample.md`: frontmatter の `based_on`（2行）を `based_on: []`（1行）に置換した。本文、状態値、状態名、遷移 ID、図表は変更していない。

## 3. 申し送り

- 指摘の表（R5） | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R5-1 | R5 | frontmatter | `based_on` に Sample 記述標準を指定しているが、カタログの `depends_on` は空であり、先行成果物だけを指定する STSD rulebook の規定と整合しない。 | rulebook を優先し、`based_on: []` にした。 | `vp-qe-kata-conformance`。stsd-rulebook 4章、共通編集規約、dct-kata.yaml の stsd-sample 行。`src/catalog/build-references.ts` は外部名前空間を閉包検査から除外するため、標準への参照を残す解釈もある。その案は採らず、明示された rulebook を優先した。機械検査の失敗としての指摘ではない。 | 要判断 |
- reporter は次の指摘表を result の実施内容へ、改行を保った Markdown 表として記載すること。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R5-1 | R5 | frontmatter | `based_on` に Sample 記述標準を指定しているが、カタログの `depends_on` は空であり、先行成果物だけを指定する STSD rulebook の規定と整合しない。 | rulebook を優先し、`based_on: []` にした。 | `vp-qe-kata-conformance`。stsd-rulebook 4章、共通編集規約、dct-kata.yaml の stsd-sample 行。実装の src/catalog/build-references.ts は外部名前空間を閉包検査から除外するため、標準への参照を残す解釈もある。その案は採らず、明示された rulebook を優先した。機械検査の失敗としての指摘ではない。 | 要判断 |
- 変更ファイルは docs/ja/specdojo/samples/stsd-sample.md のみ。`based_on` の2行を空配列1行へ置換した。本文・状態値・状態名・遷移 ID・図表は変更していない。result と grade サイドカーは直接編集していない。
- 進め方と実践の型の適用へ記載する根拠: kata-guide 6.1・6.3・6.5、stsd-rulebook、stsd-mermaid-rulebook、stsd-recipe、stsd-template、Sample 記述標準の共通サンプル文脈、document-metadata-standard、共通レビュー観点、dct-kata.yaml を確認した。同じ接頭辞の sample は対象1件で、index・個別 sample は存在しない。対象本文に wikilink はなく、メタ情報の参照先を確認した。指定の product 用語集6件には駄菓子屋の状態・検品用語の定義がない。関連する gl-sample、cdfd-sample、cdfd-overview-sample、sld-sample、bdd-sample、非推奨 cstd-sample も照合した。共通の役割名、受入・配置・返品の記録と保管場所は維持した。標準への `based_on` を外しても Sample 記述標準の適用は継続する。
- 前段 R1〜R4 の result と grade 結果 docs/ja/projects/prj-0001/execution/grade/results/specdojo.stsd-sample.yaml を読み、anchor と現状を照合した。F001 は R4 の品質不良・合格基準の追記、F002 は R3 の家族利用者代表からの引継ぎの明示により対応済みで、再指摘していない。condense 起因の記録はない。今回の変更に伴う他文書の修正は不要。標準への参照を維持する方針を採る場合は、stsd-rulebook 4章に外部標準参照の例外を明記する案があるが、本タスクでは変更していない。
- 指定された親検証は runner に委ね、sandbox で重複実行していない。npx による playbook の所在確認は npm キャッシュ制約で失敗したが、node --import tsx src/specdojo.ts where playbook --project prj-0001 は成功し、運用メモを読んだ。
- 適用外の検証: `npm run validate:schema:file`（変更した成果物は Markdown のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿個票、既存 plan・result などの履歴蓄積ファイルを変更していない。）

## 4. 進め方と実践の型の適用

根拠として kata-guide 6.1・6.3・6.5、stsd-rulebook、stsd-mermaid-rulebook、stsd-recipe、stsd-template、Sample 記述標準の共通サンプル文脈、document-metadata-standard、共通レビュー観点、dct-kata.yaml を確認した。前段 R1〜R4 の result と grade 結果 `docs/ja/projects/prj-0001/execution/grade/results/specdojo.stsd-sample.yaml` も読み、anchor と現状を照合した。同じ接頭辞の sample は対象1件のみで、index・個別 sample は存在しない。対象本文に wikilink はなく、メタ情報の参照先を確認した。指定の product 用語集6件には駄菓子屋の状態・検品用語の定義がない。gl-sample、cdfd-sample、cdfd-overview-sample、sld-sample、bdd-sample、非推奨 cstd-sample も照合し、共通の役割名と、受入・配置・返品の記録と保管場所は維持した。矛盾した箇所では rulebook を正とし、`based_on` を空にした。標準への `based_on` を外しても Sample 記述標準の適用は継続する。F001・F002 は前段で解消済みのため追加修正はしていない。condense 起因の記録はない。標準への参照を維持する方針を採る場合は、stsd-rulebook 4章に外部標準参照の例外を明記する案がある。この案は本タスクでは変更していない。
