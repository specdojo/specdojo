---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dct-index-sample-140-20261126t140957z-7cc47cd0
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dct-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dct-index-sample-140/T-KATA-REVIEW-ALL-dct-index-sample-140-20261126T140957Z-7cc47cd0/plan.md
  started_at: "2026-11-26T14:10:08.477Z"
  completed_at: "2026-11-26T14:17:36.518Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:dct-index-sample
    - specdojo:dct-index-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`docs/ja/specdojo/samples/dct-index-sample.yaml` の事実の主張 14 件を、schema、`src/catalog`、rulebook、ドキュメント構成ガイド、テンプレート、doc-index と突き合わせた。
- 14 件すべてが正本と一致し、確かめられなかった主張はなかった。誤りがないため sample は直しておらず、変更ファイルはない。
- schema 検査（`npm run validate:schema:file`）は valid だった。runner の検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`validate:schema` が passed で、ほかは変更の種類により `not_applicable` だった。
- 確かめの表は executor の handoff に C1〜C14 として記録されている。指摘は 0 件のため findings は省略する。

## 2. 変更ファイル

- なし

## 3. 申し送り

- 確かめの表（R4）。列は No / 主張（本文の箇所） / 正本 / 確かめ方 / 結果 / 根拠。指摘は 0 件のため、指摘の表の行はない。
- C1 / 先頭行 `$schema=../../../specdojo/schemas/v1/dct-index.schema.yaml` / `docs/specdojo/schemas/v1/dct-index.schema.yaml` / sample からの相対パスを解決し、`npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/dct-index.schema.yaml --data docs/ja/specdojo/samples/dct-index-sample.yaml` を実行 / 一致 / パスは実在し、出力は `valid`
- C2 / `id: specdojo:dct-index-sample` / schema の `id.pattern` / 読み取り / 一致 / pattern `^(?:prj-[0-9]{4,}:dct-index\|specdojo:dct-index-sample)$` に当たる
- C3 / `type: project`、`rulebook: specdojo:dct-index-rulebook` / schema の `const` と rulebook の frontmatter（`id: specdojo:dct-index-rulebook`、`sample: specdojo:dct-index-sample`） / 読み取り / 一致 / const の値と相互の宣言が合う
- C4 / `status: ready` / schema の `status.enum` / 読み取り / 一致 / enum `[draft, ready, deprecated]` の値。このタスクでは status に手を付けていない
- C5 / `project_id: prj-0001` と、そのコメント「dct-sample と同じ例示値」 / `docs/ja/specdojo/samples/dct-sample.yaml` の 16 行目 / grep / 一致 / dct-sample の `project_id: prj-0001`
- C6 / `size: small` と、そのコメント「ドメインを含めても scaffold の規模は small のまま」 / schema の `size.enum`、rulebook の「メタ情報と規模の決め方」、`src/catalog/catalog.ts` の 440 行目と 478 行目 / 読み取り / 一致 / `--size` を省くと dct-index.yaml の `size` を読む。規模は `min_size` で決まり、ドメイン数では決まらない
- C7 / ドメイン項目のキーの順（`domain` を `name` より前に置く）と `domain` の書式 / rulebook の「禁止事項」、schema の `Domain` / 読み取り / 一致 / 全 17 ドメインで `domain` が先にあり、pattern `^[a-z0-9][a-z0-9-]{0,62}$` に当たる
- C8 / 全ドメインの `domain` 値（project-definition ほか 16 件） / `docs/ja/specdojo/templates/dct-*-template.yaml` の `domain:`、`docs/ja/projects/prj-0001/010-deliverables-catalog/dct-current-state.yaml` / grep / 一致 / current-state 以外はテンプレートにある。current-state は prj-0001 に実在するドメイン
- C9 / business-model のコメント「分割ファイルの `domain` が同じなら索引では1件にまとめる」 / rulebook の「位置づけ」、`src/catalog/build.ts` の 237〜255 行目と 911 行目 / 読み取り / 一致 / 同じ `domain` の部分ファイルを 1 つのドメインカタログへ統合する
- C10 / 分割ファイル名 `dct-business-sales.yaml` と `dct-business-credit.yaml` / `src/catalog/catalog.ts` の 318 行目と 326 行目（`dct-*.yaml` を読む）、rulebook の「位置づけ」（物理ファイル名でなく `domain` 値で識別する） / 読み取り / 一致 / どちらの名前も `dct-*.yaml` に当たり、索引へ入れる条件を満たす
- C11 / 「グループの配列順は探索順であり、着手順は Schedule で管理する」 / rulebook の「グループとサブグループ」 / 読み取り / 一致 / 配列順は表示順で、Schedule の実行順を表さない
- C12 / 分類の正本は docs-structure-guide というコメントと、グループ構成（業務仕様群、アーキテクチャ・システム設計、品質保証、運用） / docs-structure-guide の文書構成図（150〜190 行目）と product/ の構成（361〜373 行目） / 読み取り / 一致 / 非機能要件・業務受入条件・テストは図の「プロダクトの品質保証」にあり、運用は `product/090-operations/` にある
- C13 / wikilink `[[specdojo:sample-authoring-standard]]`、`[[specdojo:docs-structure-guide]]`、`[[specdojo:dct-sample]]` / `.specdojo/doc-index.json`、各文書の frontmatter の id / grep / 一致 / 3 件とも doc-index で実在のパスへ解決する
- C14 / 「同梱の dct-sample は project-definition の記述例」 / `docs/ja/specdojo/samples/dct-sample.yaml` の 17 行目 / grep / 一致 / `domain: project-definition`

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）の段として、sample の事実の主張（パス、`id`、`type`、`status`、`size`、`domain` 値、ファイル名、グループの順、wikilink）を正本と 1 件ずつ照合した。正本には schema、`src/catalog/catalog.ts` と `src/catalog/build.ts`、rulebook、docs-structure-guide、`dct-*-template.yaml`、`.specdojo/doc-index.json` を使った。結果は全件一致で、誤りの直しは不要だった。そのため sample は維持し、`status` にも手を付けていない。根拠不足で見送った主張はない。
