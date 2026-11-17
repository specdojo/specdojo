---
specdojo:
  id: prj-0001:xer-t-kata-slim-prj-assumptions-constraints-dependencies-050-20261117t183728z-8914345c
  type: exec-result
  task_id: T-KATA-SLIM-prj-assumptions-constraints-dependencies-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-prj-assumptions-constraints-dependencies-050/T-KATA-SLIM-prj-assumptions-constraints-dependencies-050-20261117T183728Z-8914345c/plan.md
  started_at: "2026-11-17T18:37:34.730Z"
  completed_at: "2026-11-17T19:04:38.236Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:prj-assumptions-constraints-dependencies
    - specdojo:prj-assumptions-constraints-dependencies-sample
---

# Edit Result

## 1. 実施内容

- `prj-assumptions-constraints-dependencies-sample.md` から、文書の運用の記述と同じ判断の言い直しを外した。
- 判断の結論（ACD の ID、内容、担当 `PM`/`DEV`、トリガー、対応方針、`_ASSUMPTION_/_UNDECIDED_` の論点、初回受入からオフライン対応を除外する決定、影響評価の 3 種の変更）は変えていない。
- 大きさは、空白と表の区切り行を除いた文字数で 5,740 から 3,891 になり、67.8% で目安の 7 割以下に収まった。区切り行を含めると 8,241 から 5,825 である。
- recipe・template・rulebook は変更していない。template への変更案は申し送りに記載した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-assumptions-constraints-dependencies-sample.md`: 運用の記述と言い直しを削り、表のセルを要点に短縮した。削除した記述は次のとおり。役割・承認・agent の章（5.3）、5.1 の登録簿への登録と架空の個票の説明の段落（依存関係の表の後の 1 文に縮約）、5.2 の表にあった台帳への二重記載を避ける文言、第 4 章の後の `kinuya-schedule` 割当の段落（第 5 章の 1 文に集約）、重複していた ACD-C01 の廃止の注記（制約の章の導入に 1 か所だけ残した）、追跡可能性の導入文。判断の結論は維持した。

## 3. 申し送り

- sample には、検証の表の文書品質の行と、未決事項の表の管理台帳の区分・担当・追跡先の列は元からなく、その分の削除は発生していない。
- recipe は確認していない。
- Size before/after (non-whitespace chars, excluding table separator rows): 5,740 -&gt; 3,891 (67.8%). Including separator rows: 8,241 -&gt; 5,825.
- Removed from the sample: section 5.3 (roles PM/ARC/QE, PO final judgment, AI Agent approval ban, document-metadata-standard revision/retirement procedure); the 5.1 paragraph registering `PJR-KN01` in `kinuya-project-register` and explaining the fictional records (reduced to one sentence after the dependencies table); the 'do not double-post to a decision ledger' wording in the 5.2 table; the paragraph after section 4 about `kinuya-schedule` assignment (folded into one sentence in section 5); the duplicated ACD-C01 retirement note (kept once in the constraints chapter intro); the intro sentence about traceability. The sample had no verification table with document-quality rows and no unresolved-items table with ledger columns.
- Conclusions unchanged: all ACD IDs, contents, owners (`PM`/`DEV`), triggers, response policies, `_ASSUMPTION_/_UNDECIDED_` issues, the decided exclusion of offline handling from initial acceptance, and the three impact-assessment change types.
- Template change proposal (not applied; out of commit scope): in docs/ja/specdojo/templates/prj-assumptions-constraints-dependencies-template.md, the third bullet of the monitoring and change management chapter ('PM の計画・Schedule・登録簿の追従管理、ARC の参照・技術制約確認、QE の受入・検証確認と、人間の最終判断の分担を記載する') asks for a common operational role split. Proposal: remove it or reduce it to 'state who follows up updates and reports, per item ID', relying on the rulebook's common-operations reference. The recipe was not checked.
- 適用外の検証: `npm run validate:history-links`（Only a sample under docs/ja/specdojo/samples was changed; no plan/result/pjr history file was edited.）

## 4. 進め方と実践の型の適用

手本は sld の試行と改訂済みの `sld-sample.md` で、これに沿って、rulebook が担う共通の運用の記述（役割、承認、agent、登録簿への登録）を sample から外した。同じ判断は 1 か所の表を正とし、ほかの章からは章タイトルで参照する形にした。結論は変えていない。整形と静的検査は、`npx prettier --write` と `npx markdownlint-cli2` を executor が実行して通過し、runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` も通過した。`lint:ts` と `typecheck` は対象外の変更種別のため非適用で、`validate:history-links` も履歴ファイルを変更していないため非適用である。grade と condense から届いた finding はなく、根拠不足による見送りもない。
