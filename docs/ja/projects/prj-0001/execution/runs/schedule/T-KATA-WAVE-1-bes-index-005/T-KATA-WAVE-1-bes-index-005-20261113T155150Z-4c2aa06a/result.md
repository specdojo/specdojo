---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-bes-index-005-20261113t155150z-4c2aa06a
  type: exec-result
  task_id: T-KATA-WAVE-1-bes-index-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-bes-index-005/T-KATA-WAVE-1-bes-index-005-20261113T155150Z-4c2aa06a/plan.md
  started_at: "2026-11-13T15:51:53.111Z"
  completed_at: "2026-11-13T17:22:39.303Z"
  agent: opus-executor
  execution: agent
  approach: bootstrap
  targets:
    - bes-index
    - specdojo:bes-index-rulebook
    - specdojo:bes-index-sample
---

# Edit Result

## 1. 実施内容

- 代表成果物である業務イベント仕様（全体構成） `bes-index.md` を新規作成し、`cdfd-overview` の14領域・16起点イベントに基づいた一覧を定義しました。
- 実践の型として `bes-index-rulebook.md` を記述標準の章立てに従って作り直し、あわせて `bes-index-sample.md` を「駄菓子屋きぬや」の完成例を用いて刷新しました。
- recipe および template については、作成手順を別途設ける必要がないことおよび雛形としての利用頻度が低いことから、それぞれ `not-needed` と判断し rulebook の frontmatter に宣言しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/bes-index-rulebook.md`: 記述標準の章立てに合わせて作り直し、recipe および template を `not-needed` と宣言しました。
- `docs/ja/specdojo/samples/bes-index-sample.md`: 「駄菓子屋きぬや」を例とした完成例として内容を刷新し、個別の BES サンプルの ID と整合させました。
- `docs/ja/product/010-business-specs/030-business-model/bes-index.md`: 代表成果物として新規作成。`cdfd-overview` の14領域・16起点イベントを網羅した一覧を定義しました。

## 3. 申し送り

- 成果物カタログ `dct-business-model-bes.yaml` の `bes-index` の `overview` は「10プロセス領域」と記載されていますが、`cdfd-overview` の現状（14領域）に合わせて作成したため、カタログ側の更新要否を BA/PO が判断する必要があります。
- recipe: `not-needed` の理由: 一覧の行は上位 CDFD の起点イベントからほぼ一意に決まり、個別 BES への詳細化の判断は `specdojo:bes-rulebook` が正本のため、別の作成手順を要しません。
- template: `not-needed` の理由: 一覧はシステムごとに1つで主な表も1つのため、本文要件の章で列と本文構成を示せば足り、雛形を毎回起点にする系統ではありません。
- 手本にした ready 文書: `specdojo:bes-rulebook`、`specdojo:tsd-index-rulebook`、`specdojo:bes-sample`、`specdojo:tsd-index-sample`、`specdojo:cdfd-overview-sample`（構造・記法のみ）。
- 成果物の未決事項: `P-01` の立ち上げと `P-14` の開始が同じ出来事か（`_UNDECIDED_`）、`P-09`/`P-10`/`P-14` の主体の推定、事実データとデータモデルの未照合、一覧の範囲承認について PO/BA/ARC の判断を待ちます。
- 仕上げの品質チェック: 個別 BES の詳細化基準・変更管理・frontmatter 構文は再掲せず `bes-rulebook`・ドキュメントメタ情報標準への参照に置き換えました。成果物のイベント名は CDFD の文言に揃え、sample の現金会計の行は `bes-sample` の ID（`bes-cash-sale-confirmed`）と一致させました。
- 成果物カタログ `dct-business-model-bes.yaml` の `bes-index` の `overview` は「10プロセス領域」だが、`cdfd-overview` の現状は14領域。成果物は14領域で作成した。カタログの `overview` の更新要否を BA/PO が判断する。
- recipe: not-needed の理由: 一覧の行は上位 CDFD の起点イベントからほぼ一意に決まり、個別 BES への詳細化の判断は `specdojo:bes-rulebook` が正本のため、別の作成手順を要しない。
- template: not-needed の理由: 一覧はシステムごとに1つで主な表も1つのため、本文要件の章で列と本文構成を示せば足り、雛形を毎回起点にする系統ではない。
- 成果物の未決事項: `P-01` の立ち上げと `P-14` の開始が同じ出来事か（`_UNDECIDED_`）、`P-09`/`P-10`/`P-14` の主体の推定、事実データとデータモデルの未照合、一覧の範囲承認。PO/BA/ARC の判断を待つ。
- 仕上げの品質チェック: 個別 BES の詳細化基準・変更管理・frontmatter 構文は再掲せず `bes-rulebook`・ドキュメントメタ情報標準への参照に置き換えた。成果物のイベント名は CDFD の文言に揃え、sample の現金会計の行は `bes-sample` の ID（`bes-cash-sale-confirmed`）と一致させた。
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/product/ と docs/ja/specdojo/ のみで、docs/ja/projects/ に及ばない）
- 適用外の検証: `npm run validate:history-links`（pjr 個票・plan.md・result.md を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

bootstrap
