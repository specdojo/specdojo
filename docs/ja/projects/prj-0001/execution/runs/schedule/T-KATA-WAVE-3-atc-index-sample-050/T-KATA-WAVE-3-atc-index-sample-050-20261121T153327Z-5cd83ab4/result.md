---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-atc-index-sample-050-20261121t153327z-5cd83ab4
  type: exec-result
  task_id: T-KATA-WAVE-3-atc-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-atc-index-sample-050/T-KATA-WAVE-3-atc-index-sample-050-20261121T153327Z-5cd83ab4/plan.md
  started_at: "2026-11-21T15:33:33.438Z"
  completed_at: "2026-11-21T15:43:48.377Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:atc-index-sample
    - specdojo:atc-index-sample
---

# Edit Result

## 1. 実施内容

- atc-index-sample を rulebook の第 5 章で定義された標準的な構成に基づき、駄菓子屋「きぬや」の完成例として大幅に拡充しました。
- 具体的には、`based_on` による `tsp-index-sample.md` との整合、H1 を「受入テストカタログ 概要」へ変更、合格基準の定義、テストデータの準備・後始末、ケース表の共通カラムおよび形式例、将来の課題管理方法などを追加しました。
- これにより、`done_criteria` で要求されていた「実践の型としての適合性」と、`grade` で指摘された複数の欠落事項（`F001` から `F025` までの主要な指摘）を解消しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/atc-index-sample.md`: rulebook の構成に従い、駄菓子屋の販売管理システムにおける受入テストの完成例として内容を拡充しました。`based_on` の追加、H1 の修正、合格基準・判定フローの定義、環境・データ・証跡要件の明文化、ケース表の共通カラムと実例の提示、および将来課題の担当・期限に関する記述を追加しました。

## 3. 申し送り

- F018 のうち `title` は入れていません。Markdown 規約で frontmatter に `title` を書くことが禁止されているためです。`supersedes` は置き換える前の版がないため入れていません。
- F003・F013・F014（公開・承認者、変更影響、lint コマンド）は本文に足していません。rulebook の「全体方針」が、承認・改訂と形式の確認をメタ情報標準と `npm run lint:fm`・`npm run lint:md` に任せ、業務の受入確認に含めないと決めているためです。この扱いでよいかは再評価で確かめる必要があります。
- rulebook の変更案: 記述ガイド（本ドキュメントの目的と適用対象）の合格基準の例「P1/P2 の fail は…条件付き受入の可否を判断」は、TSP sample の「受入テストの出口条件には例外を設けない」とぶつかって読めるため、rulebook の例でも P0 に例外がないことを明記する案があります。
- rulebook の変更案: frontmatter の `recipe`・`template` が `undecided` のままです。
- 関連 sample の申し送り: `etc-index-sample` と `stc-index-sample` は本 sample へのリンクの表示名を「受入テスト」としています。H1 に合わせて「受入テストカタログ 概要」へそろえる候補があります。`atc-sample`（対象別）はまだ旧形式の薄い sample で、本書の `atc-cash-sale` などの `term` と合わせて厚くする必要があります。
- F018 のうち `title` は入れていない。Markdown 規約で frontmatter に `title` を書くことが禁止されているため。`supersedes` は置き換える前の版がないため入れていない。
- F003・F013・F014（公開・承認者、変更影響、lint コマンド）は本文に足していない。rulebook の「全体方針」が、承認・改訂と形式の確認をメタ情報標準と `npm run lint:fm`・`npm run lint:md` に任せ、業務の受入確認に含めないと決めているため。この扱いでよいかは再評価で確かめる。
- rulebook の変更案: 記述ガイド（本ドキュメントの目的と適用対象）の合格基準の例「P1/P2 の fail は…条件付き受入の可否を判断」は、TSP sample の「受入テストの出口条件には例外を設けない」とぶつかって読める。sample では P0 は例外なしで全件 Pass とし、条件付き受入は P1 だけに限った。rulebook の例でも P0 に例外がないことを明記する案。
- rulebook の変更案: frontmatter の `recipe`・`template` が `undecided` のまま。
- 関連 sample の申し送り: etc-index-sample と stc-index-sample は本 sample へのリンクの表示名を「受入テスト」としている。H1 に合わせて「受入テストカタログ 概要」へそろえる候補。atc-sample（対象別）はまだ旧形式の薄い sample で、本書の `atc-cash-sale` などの term と合わせて厚くする必要がある。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:catalog`（変更が docs/ja/projects/ に届いておらず、docs/ja/specdojo/samples/ 配下だけのため）

## 4. 進め方と実践の型の適用

rulebook の第 5 章で定義された標準的な構成に基づき、対象成果物を「完成例（sample）」として厚くすることを目的としています。`based_on` に指定された `tsp-index-sample.md` を参照し、構成の整合性を担保しつつ、業務上の受入判断に必要な具体的な情報（合格基準、環境・データ条件、ケース表の仕様、将来課題の管理方法など）を値として埋めています。
