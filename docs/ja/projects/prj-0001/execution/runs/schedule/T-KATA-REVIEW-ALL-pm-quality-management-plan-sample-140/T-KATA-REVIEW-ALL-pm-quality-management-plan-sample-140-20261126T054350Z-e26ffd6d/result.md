---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-quality-management-plan-sample-140-20261126t054350z-e26ffd6d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-quality-management-plan-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-quality-management-plan-sample-140/T-KATA-REVIEW-ALL-pm-quality-management-plan-sample-140-20261126T054350Z-e26ffd6d/plan.md
  started_at: "2026-11-26T05:44:03.578Z"
  completed_at: "2026-11-26T05:53:37.722Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-quality-management-plan-sample
    - specdojo:pm-quality-management-plan-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）を実施した。sample の主張を、`based_on` の成功条件 sample、schema、`src/exec/core.ts` の `KNOWN_OWNER_LABELS` と突き合わせた。
- 成功条件の sample と食い違っていた条件 ID を直した。対象は初期受入（SC-07・SC-09・AC-05 の追加）、短期利用（SC-08 の追加）、初期受入に含めない条件と後続観測への引き継ぎ対象（SC-10 の追加）である。
- 未決事項表の `_UNDECIDED_:` をインラインコードから斜体の目印に直した（3 か所）。
- grade の F001〜F003 は前の段で未決事項の表が template と同じ 4 列になっており、解消済みである。この段では追加の改訂をしていない。
- 整形と静的検査は通った。実行した検査は prettier、markdownlint、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` である。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 正しさ | 品質ゲートの表・レビューの表・ゲートの注記・後続観測への引き継ぎ（初期受入・短期利用の条件 ID） | 初期受入の「SC-01・AC-01〜AC-04」と短期利用の「SC-02・SC-03」が、成功条件の sample と食い違っていた。成功条件の sample では、初期受入が SC-01・SC-07・SC-09・AC-01〜AC-05、運用開始後2週間が SC-08、6か月が SC-10 である。 | 初期受入に SC-07・SC-09・AC-05 を加え、短期利用に SC-08 を加えた。初期受入に含めない条件と後続観測への引き継ぎ対象に SC-10 を加えた。 | `based_on` の成功条件の sample（`specdojo:prj-success-criteria-and-acceptance-criteria-sample`） | 修正済み |
| 2 | R4 正しさ | 未決事項の表（`_UNDECIDED_:` の目印、3 か所） | `_UNDECIDED_:` がインラインコードで書かれていた。 | 斜体の目印に直した。 | ドキュメントメタ情報標準、Sample 記述標準、template | 修正済み |
| 3 | R4 正しさ | 管理計画の sample（`specdojo:pm-plan-sample`）の「M-07 品質」と判断ゲートの「初期リリース・店頭試用開始」 | 古い条件 ID の SC-01・AC-01〜AC-04 が残っている。 | - | 成功条件の sample の条件 ID（初期受入は SC-01・SC-07・SC-09・AC-01〜AC-05） | 申し送り |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-quality-management-plan-sample.md`: 品質ゲートの表、レビューの表、ゲートの注記、後続観測への引き継ぎの条件 ID を、成功条件の sample に合わせて直した。未決事項表の `_UNDECIDED_:` を、インラインコードから斜体の目印に直した（3 か所）。

## 3. 申し送り

- 管理計画の sample（`specdojo:pm-plan-sample`）の「M-07 品質」と、判断ゲートの「初期リリース・店頭試用開始」には、古い条件 ID の SC-01・AC-01〜AC-04 が残っている。これは R5 または別の kata で、成功条件の sample に合わせる案を相手側に出す。
- R4 の確かめの表: (1) frontmatter の `type`/`status`/`based_on` は `deliverable-frontmatter.schema.yaml`・`common-frontmatter.schema.yaml` と一致。(2) `rulebook`・`based_on`・wikilink の参照先 id は全件存在。(3) Role code の `PO`/`PM`/`BA`/`DEV`/`QE` は `src/exec/core.ts` の `KNOWN_OWNER_LABELS` と `pm-roles.schema.yaml` の enum と一致。(4) 初期受入の「SC-01・AC-01〜AC-04」は成功条件の正本（SC-01・SC-07・SC-09・AC-01〜AC-05）と不一致→直した。(5) 短期利用の「SC-02・SC-03」は、判定時期が運用開始後2週間の SC-08 が漏れていた→直した。(6) レビュー表の対象段階の必須条件も同じく不一致→直した。(7) 初期受入に含めない条件と後続観測への引き継ぎ対象から SC-10 が漏れていた→直した。(8) 管理計画の M-03・M-04・M-06、U-01〜U-03、「運用前の準備」、免除の例外を設けないことは一致。(9) オフライン時・人気商品の未決の担当・決定時期・判断者は成功条件の「例外条件と未解決事項」と一致。(10) `_UNDECIDED_:` をインラインコードで書いていたのは、ドキュメントメタ情報標準・Sample 記述標準・template（斜体の目印）と不一致→直した。(11) `kinuya-` で始まる参照名と `execution/` 配下のパスは本文で架空と明記した仮定のため確かめの対象外。
- 指摘: 初期受入・短期利用の条件 ID が、`based_on` の成功条件の sample（初期受入は SC-01・SC-07・SC-09・AC-01〜AC-05、運用開始後2週間に SC-08、6か月に SC-10）と食い違っていた。品質ゲートの表、レビューの表、ゲートの注記、後続観測への引き継ぎを直した。
- 指摘: 未決事項の表で `_UNDECIDED_:` がインラインコードで書かれていた。ドキュメントメタ情報標準・Sample 記述標準・template に合わせて、斜体の目印に直した（3 か所）。
- 次のアクション（R5・別の kata）: 管理計画の sample（`specdojo:pm-plan-sample`）の「M-07 品質」と、判断ゲートの「初期リリース・店頭試用開始」にも、古い条件 ID の SC-01・AC-01〜AC-04 が残っている。成功条件の sample に合わせて SC-07・SC-09・AC-05（試用継続は SC-08）を加える案を相手側に出す。
- grade の finding F001〜F003 は、前の段で未決事項の表が template と同じ 4 列（担当・決定時期・判断者）になっていて解消済み。F001・F002 の観点は kata ガイドで kata の段のレビューでは使わない観点でもある。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

根拠とした規範は、`based_on` の成功条件 sample、`deliverable-frontmatter.schema.yaml`、`common-frontmatter.schema.yaml`、`pm-roles.schema.yaml`、`src/exec/core.ts` の `KNOWN_OWNER_LABELS`、ドキュメントメタ情報標準、Sample 記述標準、template である。確かめた結果、条件 ID の不一致と目印の書き方を直した。frontmatter、参照先 id、Role code、管理計画の M-03・M-04・M-06 と U-01〜U-03、未決事項の担当・決定時期・判断者は一致していたので維持した。`kinuya-` で始まる参照名と `execution/` 配下のパスは、本文で架空と明記した仮定のため確かめの対象外とした。F001〜F003 は前の段で解消済みで、F001・F002 の観点は kata の段のレビューでは使わない観点でもある。
