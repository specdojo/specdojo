---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-msg-sample-120-20261125t210202z-6b306a30
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-msg-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-msg-sample-120/T-KATA-REVIEW-ALL-ifx-msg-sample-120-20261125T210202Z-6b306a30/plan.md
  started_at: "2026-11-25T21:02:12.266Z"
  completed_at: "2026-11-25T21:04:15.811Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-msg-sample
    - specdojo:ifx-msg-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `docs/ja/specdojo/samples/ifx-msg-sample.yaml` を見直した。ファイル先頭にあった「ifx-index-sample に未掲載の連携で、採用するときは一覧に行を足してから `spec_ref` を付ける」というコメントを、説明対象の `x-spec-meta.based_on` の直下へ移した。
- トップレベルのキーの順（`asyncapi`、`info`、`x-spec-meta`、`defaultContentType`、`servers`、`channels`、`components`）と CloudEvents 属性の順は rulebook の本文要件の表と一致していたため、変更していない。
- grade F003 は R1 がチャネルの `description` に発生の契機を足しており解消済みである。F001・F002・F004 は R2 の観点ではないため、扱う段に任せた。
- runner の検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通過した。executor の `prettier --check` も通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | x-spec-meta（`based_on`） | 「一覧 ifx-index-sample には未掲載の連携で、採用するときは一覧に行を足してから `spec_ref` を付ける」というコメントがファイル先頭にあった。説明対象の `based_on` から離れており、参照先に行がない理由を参照のそばで読めなかった。 | コメントを先頭から `based_on` の直下へ移した。先頭にはファイル全体にかかる検証器の注記、`_ASSUMPTION_`、`_UNDECIDED_` だけを残した。 | vp-arc-document-structure | - |
| R2-2 | R2 | 全体（トップレベルのキーの順） | `asyncapi`、`info`、`x-spec-meta`、`defaultContentType`、`servers`、`channels`、`components` の順は rulebook の本文要件の表の順と同じだった。CloudEvents の属性の順（`subject` を含む）も属性表と同じだった。template は `not-needed` である。 | - | vp-arc-document-structure | - |
| R2-3 | R2 | channels.inventory.stock.changed.description | grade F003（チャネルの `description` に発生の契機がない）は、R1 が発生の契機を足しており解消済みである。F001・F002・F004 は R2 の観点ではないため、扱う段（R4・R5）に任せた。 | - | vp-qe-omissions-consistency | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-msg-sample.yaml`: ifx-index-sample に未掲載であることを説明するコメントを、ファイル先頭から `based_on` の直下へ移した。先頭にはファイル全体にかかる検証器の注記、`_ASSUMPTION_`、`_UNDECIDED_` だけを残した。差分は 1 行の追加と 1 行の削除である。

## 3. 申し送り

- F001（`subject` の書式固定）、F002（古いイベントを捨てる判定の比較単位）、F004（ifx-index-sample への行追加と連携名）は、R2 の観点ではなく扱う段（R4・R5）に任せた。rulebook など sample 以外の文書は変更していない。
- R2-1: R2 / x-spec-meta（`based_on`） / 「一覧 ifx-index-sample には未掲載の連携で、採用するときは一覧に行を足してから `spec_ref` を付ける」のコメントがファイル先頭にあり、説明している `based_on` から離れているので、参照先に行がない理由を参照のそばで読めない / コメントを先頭から `based_on` の直下へ移した。先頭にはファイル全体にかかる検証器の注記・`_ASSUMPTION_`・`_UNDECIDED_` だけを残した / vp-arc-document-structure / -
- R2-2: R2 / 全体（トップレベルのキーの順） / `asyncapi`→`info`→`x-spec-meta`→`defaultContentType`→`servers`→`channels`→`components` の順が rulebook の「本文要件」の表の順と同じで、CloudEvents の属性の順（`subject` を含む）も属性表と同じであることを確かめた。template は `not-needed` / - / vp-arc-document-structure / -
- R2-3: R2 / channels.inventory.stock.changed.description / grade F003（チャネルの `description` に発生の契機がない）は、R1 が発生の契機を足しており解消済み。F001・F002・F004 は R2 の観点ではないため、扱う段（R4・R5）に任せた / - / vp-qe-omissions-consistency / -
- 適用外の検証: `npm run validate:schema:file`（対象の sample は先頭行で SpecDojo の schema 検証から外されている（AsyncAPI の外部形式））

## 4. 進め方と実践の型の適用

sample-maintenance の R2（構成）として、R1 が直した版を読んだ。章の順と粒度は rulebook の本文構成に沿っていた。移動したのは `based_on` に関するコメント 1 件だけである。template は `not-needed` と判断した。rulebook と sample の記述に矛盾はなく、rulebook を正とした修正箇所はない。sample の frontmatter 相当の `status` は変更していない。
