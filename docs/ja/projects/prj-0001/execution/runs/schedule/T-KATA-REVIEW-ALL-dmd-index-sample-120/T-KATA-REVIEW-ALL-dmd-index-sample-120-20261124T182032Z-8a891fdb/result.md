---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dmd-index-sample-120-20261124t182032z-8a891fdb
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dmd-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dmd-index-sample-120/T-KATA-REVIEW-ALL-dmd-index-sample-120-20261124T182032Z-8a891fdb/plan.md
  started_at: "2026-11-24T18:20:40.229Z"
  completed_at: "2026-11-24T18:32:19.000Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dmd-index-sample
    - specdojo:dmd-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `dmd-index-sample` を見直し、章の順・粒度・表と本文の配置を確認した。必須6章の順序・粒度・必須項目・対象別設計への導線は rulebook に適合しており維持した。
- 指摘2件（R2-1・R2-2）を sample の差分に反映した。R2-1 は許容差の説明を照合基準表より前へ移した。R2-2 は証跡保管の未決事項を第4章の証跡保管の説明直後へ集約した。
- rulebook など sample 以外は変更していない。規範側の修正案はない。Prettier 整形と `git diff --check` は成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。
- | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 4. 検証の共通方針（種別/基準/証跡/保管） | 照合基準表が許容差の説明を後方参照しており、判定の前提が表の後にある | 許容差の範囲・理由・許容しない値を表より前へ移し、表中の「下記」を削除した。許容差の内容と合格基準は維持した | `vp-arc-document-structure`。[[specdojo:kata-guide\|実践の型ガイド]] 第6.1節の「前提から結論の順」、[[specdojo:dmd-index-rulebook\|データ移行設計 作成ルール]] 第5章・第6.2節 | - | | R2-2 | R2 | 3. `run_id` 規約、4. 検証の共通方針 | 移行作業フォルダの控えの要否・置き場所という保管の未決事項が識別子規約の章に分散している | 第4章の証跡保管の説明直後へ移し、保管期間の未決事項とまとめた。判断者・個人情報を含む理由・未決の状態は維持した | `vp-arc-document-structure`。[[specdojo:dmd-index-rulebook\|データ移行設計 作成ルール]] 第5章が識別子規約と証跡保管を分ける構成 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dmd-index-sample.md`: 第4章で許容差の範囲・理由・許容しない値を照合基準表の前へ移し、表中の後方参照「下記」を削除した（R2-1）。第3章の `run_id` 規約にあった移行作業フォルダの控えの要否・置き場所の未決事項を、第4章の証跡保管の説明直後へ移して保管期間の未決事項とまとめた（R2-2）。許容差の内容、合格基準、判断者、未決の状態は変えていない。

## 3. 申し送り

- F001（source=grade、`vp-ba-stakeholder-clarity`）は、R2 の構成観点には当たらないため今回は扱わず、第4章の判定者の記述を維持した。R1 result が R5 へ引き継いだ指摘で、kata-guide 第6.3節は同観点を独立評価から外している。R5 で `mip-index` との整合と Role code 併記の必要性を確認する。
- `source=condense` の finding はない。grade result サイドカーと result は編集していない。
- R2-1: R2 / 4. 検証の共通方針（種別/基準/証跡/保管） / 照合基準表が許容差の説明を後方参照しており、判定の前提が表の後にある / 許容差の範囲・理由・許容しない値を表より前へ移し、表中の「下記」を削除した / `vp-arc-document-structure`。[[specdojo:kata-guide|実践の型ガイド]] 第6.1節の「前提から結論の順」、[[specdojo:dmd-index-rulebook|データ移行設計 作成ルール]] 第5章・第6.2節に基づく。許容差の内容と合格基準は維持 / -
- R2-2: R2 / 3. `run_id` 規約、4. 検証の共通方針 / 移行作業フォルダの控えの要否・置き場所という保管の未決事項が識別子規約の章に分散している / 第4章の証跡保管の説明直後へ移し、保管期間の未決事項とまとめた / `vp-arc-document-structure`。[[specdojo:dmd-index-rulebook|データ移行設計 作成ルール]] 第5章が識別子規約と証跡保管を分ける構成に基づく。判断者・個人情報を含む理由・未決の状態は維持 / -
- 進め方と実践の型の適用への記録: [[specdojo:kata-guide|実践の型ガイド]] 第6章、[[specdojo:sample-authoring-standard|Sample 記述標準]]、[[specdojo:dmd-index-rulebook|データ移行設計 作成ルール]]、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の構造・抜け漏れ・簡潔性・関係者明確性の判定根拠、[[specdojo:mip-index-sample|移行計画の完成例]]、[[specdojo:dmd-sample|データ移行設計の完成例]]、対象の grade 結果、直前の R1 result を確認した。recipe・template は rulebook で undecided のため、本文要件を構成の正本とした。必須6章の順序・粒度、必須項目、対象別設計への導線は適合しており維持した。R1 が修正した残高のある顧客を除外しない条件も維持した。rulebook との構成矛盾はなく、規範側の修正案はない。判定に必要な条件を削らず、重複も追加していない。
- F001（source=grade）の扱い: message、`vp-ba-stakeholder-clarity` の判定根拠、sample 第4章の該当箇所、参照先の移行計画の判定者を確認した。R1 result が R5 へ引き継いだ指摘であり、kata-guide 第6.3節では同観点を独立評価から外している。R2 の構成観点には当たらないため判定者の記述は維持した。R5 で参照先との整合と Role code 併記の必要性を確認する。今回の新規指摘として表に重ねない。source=condense の finding はない。
- 変更ファイル: `docs/ja/specdojo/samples/dmd-index-sample.md` のみ。result と grade サイドカーは編集していない。reporter は R2-1・R2-2 を実施内容の指摘表に各1行で1回だけ掲載し、申し送りに表を重ねない。Prettier 整形と `git diff --check` は成功した。Markdown lint・frontmatter・文書テスト等の指定された親検証は runner に委ねる。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票や既存の plan・result を変更していない。）

## 4. 進め方と実践の型の適用

根拠とした規範は、[[specdojo:kata-guide|実践の型ガイド]] 第6章、[[specdojo:sample-authoring-standard|Sample 記述標準]]、[[specdojo:dmd-index-rulebook|データ移行設計 作成ルール]]、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]]（構造・抜け漏れ・簡潔性・関係者明確性の判定根拠）である。成果物は [[specdojo:mip-index-sample|移行計画の完成例]] と [[specdojo:dmd-sample|データ移行設計の完成例]]、対象の grade 結果、直前の R1 result を確認した。recipe と template は rulebook で undecided のため、本文要件を構成の正本とした。改訂したのは許容差の説明順（R2-1）と証跡保管事項の配置（R2-2）で、いずれも前提から結論の順と章の責務分離に基づく。維持したのは、必須6章の順序・粒度、必須項目、対象別設計への導線、R1 が修正した「残高のある顧客を除外しない」条件である。rulebook との構成矛盾はなく、規範側の修正案もない。判定に必要な条件は削らず、重複も追加していない。F001 は R2 の観点外として見送り、R5 へ送る。理由と次のアクションは handoff に記した。
