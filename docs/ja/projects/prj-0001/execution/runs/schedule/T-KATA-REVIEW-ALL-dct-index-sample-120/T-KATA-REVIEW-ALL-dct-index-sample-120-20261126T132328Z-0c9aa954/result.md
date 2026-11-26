---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dct-index-sample-120-20261126t132328z-0c9aa954
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dct-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dct-index-sample-120/T-KATA-REVIEW-ALL-dct-index-sample-120-20261126T132328Z-0c9aa954/plan.md
  started_at: "2026-11-26T13:23:39.029Z"
  completed_at: "2026-11-26T13:33:09.830Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:dct-index-sample
    - specdojo:dct-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を `dct-index-sample.yaml` に対して実施した。章の移動・分割・統合は不要と判定した。
- `project_id` を説明するコメントを、ファイル先頭の前提コメントから `project_id` キー直前へ移した。隣の `size` と配置をそろえるためである。
- プロジェクト成果物グループの `domains` の並びは、構成ガイドの記述順とディレクトリ番号順が食い違う。sample は変更せず、要判断として残した。
- ルート項目の順とプロダクト側サブグループの構成は、schema と構成ガイドに沿っているため維持した。
- executor が実行した schema 検査と Prettier は passed。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R2 | `docs/ja/specdojo/samples/dct-index-sample.yaml` の先頭コメントにある、`project_id` は dct-sample と同じ例示値であることを説明する行 | `project_id` の値を説明するコメントが、ファイル先頭の索引全体の前提の中にあり、キーから離れている。隣の `size` はキー直前にコメントを置いており、配置がそろっていない。 | このコメントを `project_id: prj-0001` の直前へ移した（sample に反映済み）。 | `vp-arc-document-structure`（値の判断をそのキーの隣で読めるようにする） | 反映済み |
| 2 | R2 | `docs/ja/specdojo/samples/dct-index-sample.yaml` の `groups[0]`「プロジェクト成果物」の `domains` の並び（`project-definition`、`project-management`、`current-state` の順） | docs-structure-guide の「プロジェクトドキュメント」の節は「業務要求（目的・スコープ）→ 現状 → プロジェクトマネジメント」の順に書かれている。一方、ディレクトリ番号は `030-project-management`、`040-current-state` の順で、正本の中で 2 通りに読める。sample はディレクトリ番号の順に従っている。 | 前提から結論の順を優先する場合は、`current-state` を `project-management` の前へ移す。ディレクトリ番号を正とする場合は、現状のまま維持する。sample は変更していない。 | `vp-arc-document-structure`、rulebook「グループ分類の決め方」（分類の正本は構成ガイド） | 要判断 |
| 3 | R2 | `docs/ja/specdojo/samples/dct-index-sample.yaml` のルート項目とプロダクト側サブグループの構成 | 指摘なし。ルート項目は schema の `required` の順、サブグループは構成ガイドの文書構成図（業務仕様群・アーキテクチャ・品質保証・運用）の枠と順に沿う。1 ドメインのサブグループと 2 分類にまたがるドメインにも理由のコメントがあり、rulebook「グループ分類の決め方」を満たす。 | 維持 | `vp-arc-document-structure`、`vp-qe-omissions-consistency`、`docs/specdojo/schemas/v1/dct-index.schema.yaml` | 維持 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dct-index-sample.yaml`: `project_id` の説明コメントを先頭コメントから `project_id: prj-0001` の直前へ移動した（1 行追加・1 行削除）。値の説明をキーの隣に置き、`size` のコメント配置とそろえた。

## 3. 申し送り

- No: 1 / 段: R2 / 箇所: docs/ja/specdojo/samples/dct-index-sample.yaml の先頭コメントの「`project_id` は dct-sample と同じ例示値…」の行 / 指摘: `project_id` の値を説明するコメントがファイル先頭の索引全体の前提の中にあり、キーから離れている。隣の `size` はキー直前にコメントを置いており、配置がそろっていない / 直した案: このコメントを `project_id: prj-0001` の直前へ移した（sample に反映済み） / 根拠: `vp-arc-document-structure`（値の判断をそのキーの隣で読めるようにする） / 印: 反映済み
- No: 2 / 段: R2 / 箇所: docs/ja/specdojo/samples/dct-index-sample.yaml の groups[0]「プロジェクト成果物」の domains の並び（project-definition → project-management → current-state） / 指摘: docs-structure-guide の「プロジェクトドキュメント」の節は「業務要求（目的・スコープ）→ 現状 → プロジェクトマネジメント」の順だが、ディレクトリ番号は `030-project-management` → `040-current-state` の順で、正本の中で 2 通りに読める。sample はディレクトリ番号の順に従っている / 直した案: 前提から結論の順を優先する場合は `current-state` を `project-management` の前へ移す。ディレクトリ番号を正とする場合は現状のまま維持する。sample は変更していない / 根拠: `vp-arc-document-structure`、rulebook「グループ分類の決め方」（分類の正本は構成ガイド） / 印: 要判断
- No: 3 / 段: R2 / 箇所: docs/ja/specdojo/samples/dct-index-sample.yaml のルート項目とプロダクト側サブグループの構成 / 指摘: なし。ルート項目は schema の `required` の順、サブグループは構成ガイドの文書構成図（業務仕様群・アーキテクチャ・品質保証・運用）の枠と順に沿う。1 ドメインのサブグループと 2 分類にまたがるドメインにも理由のコメントがあり、rulebook「グループ分類の決め方」を満たす / 直した案: 維持 / 根拠: `vp-arc-document-structure`、`vp-qe-omissions-consistency`、docs/specdojo/schemas/v1/dct-index.schema.yaml / 印: 維持

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample に切り替え、`dct-index-sample.yaml` を R2（構成）の観点で読んだ。判断の根拠は `vp-arc-document-structure` と `vp-qe-omissions-consistency`、rulebook の「グループ分類の決め方」、`docs/specdojo/schemas/v1/dct-index.schema.yaml` である。コメント配置のずれだけを直し、schema に沿った構成は維持した。rulebook など sample 以外は変更していない。grade と成果物由来の finding は plan に展開されていなかった。
