---
specdojo:
  id: prj-0001:xer-pjr-rapc-20261105t115425z-ac6e97c0
  type: exec-result
  task_id: PJR-RAPC
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-rapc-20261105T115425Z-ac6e97c0-plan.md
  started_at: "2026-11-05T11:54:33.313Z"
  completed_at: "2026-11-05T12:05:26.807Z"
  agent: sol-executor
  approach: retrofit
  targets:
    - prj-0001:stsd-deliverable
---

# Edit Result

## 1. 実施内容

- stsd-deliverable を `draft` として新設しました。
- 3 つの状態（draft / ready / deprecated）と、それらの遷移について、単一の Mermaid 図と対応表を用いて定義しました。
- 状態値に関する意図は、カタログ、ドキュメントメタ情報標準、および ID・ファイル命名標準に基づいています。
- 実装（`src/deliverable/deliverable.ts` および `src/deliverable/trash.ts`）は参照しましたが、状態遷移の具体的な条件や権限については検証できなかったため、図表の内容は確定した動作とは扱わず、検討メモとして記載しています。
- 廃止（deprecated）については、終了点を置かない理由と、廃止を継続状態として扱う旨を概要に記述しています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-deliverable.md`: 状態定義（draft / ready / deprecated）と、その状態遷移、および実装に基づいた検討事項（未確認の遷移条件や権限、欠落値の扱い等）を記述した成果物を新設しました。

## 3. 申し送り

- 判断は新設。対象ファイルは存在せず、カタログに `path` と `done_criteria` が定義されていた。変更ファイルは `docs/ja/product/010-business-specs/020-data-model/stsd-deliverable.md` のみ。3 状態・4 遷移を単一図と対応表に記載し、既存遷移 ID の振り直しはない。終了点を置かない理由と、廃止を継続状態とする扱いを概要に記載した。
- 実際に `src/deliverable/deliverable.ts` と `src/deliverable/trash.ts` を全文参照した。前者は生成処理への委譲と廃棄操作を定義し、廃止以外では警告するが状態を変更しない。後者は移動元・移動先・配置範囲・カタログ書換えを検証し、文書移動と `path` 更新を行い `local_id` を維持する。この動作は ID・ファイル命名標準と一致する。確認できた実装・業務規約の乖離はない。
- 状態値と遷移の意図はカタログ、ドキュメントメタ情報標準、ID・ファイル命名標準を根拠にした。指定された実装だけでは許容値・初期値・状態遷移条件・権限を検証できないため、図表を機械的に保証された動作とは扱わず、検討メモに明示した。カタログの `evidence_refs` の説明と実際の参照範囲に不足があるため、別タスクで根拠の追加・説明修正を検討する。列挙外の実装は調査・変更していない。
- 依存先 `bdd-deliverable` は未作成。業務状態名、承認者、受入条件、証跡、降格・復帰・後継を伴わない廃止、欠落値・規約外値の扱いは未決として、決定者・確認時期を記載した。実装から推測して補完していない。
- result と登録簿は編集していない。reporter は本報告を result に転記すること。`lint:md`・`lint:fm`・`lint:mermaid` を含む指定の親検証は runner に委ね、sandbox 内では重複実行していない。
- 判断は新設。対象ファイルは存在せず、カタログに path と `done_criteria` が定義されていた。変更ファイルは docs/ja/product/010-business-specs/020-data-model/stsd-deliverable.md のみ。3 状態・4 遷移を単一図と対応表に記載し、既存遷移 ID の振り直しはない。終了点を置かない理由と、廃止を継続状態とする扱いを概要に記載した。
- 実際に src/deliverable/deliverable.ts と src/deliverable/trash.ts を全文参照した。前者は生成処理への委譲と廃棄操作を定義し、廃止以外では警告するが状態を変更しない。後者は移動元・移動先・配置範囲・カタログ書換えを検証し、文書移動と path 更新を行い `local_id` を維持する。この動作は ID・ファイル命名標準と一致する。確認できた実装・業務規約の乖離はない。
- 状態値と遷移の意図はカタログ、ドキュメントメタ情報標準、ID・ファイル命名標準を根拠にした。指定された実装だけでは許容値・初期値・状態遷移条件・権限を検証できないため、図表を機械的に保証された動作とは扱わず、検討メモに明示した。カタログの `evidence_refs` の説明と実際の参照範囲に不足があるため、別タスクで根拠の追加・説明修正を検討する。列挙外の実装は調査・変更していない。
- 依存先 bdd-deliverable は未作成。業務状態名、承認者、受入条件、証跡、降格・復帰・後継を伴わない廃止、欠落値・規約外値の扱いは未決として、決定者・確認時期を記載した。実装から推測して補完していない。
- result と登録簿は編集していない。reporter は本報告を result に転記すること。lint:md・lint:fm・lint:mermaid を含む指定の親検証は runner に委ね、sandbox 内では重複実行していない。
- 適用外の検証: `npm run validate:catalog`（変更対象は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存の exec plan・result を変更していない。）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルは Markdown のみで、YAML ファイルを変更していない。）

## 4. 進め方と実践の型の適用

3APD の段 8。ステータス定義（成果物）を、確定した stsd の Kata と現行の実装（カタログの `evidence_refs`）に合わせて retrofit する。
