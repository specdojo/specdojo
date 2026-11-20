---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-etc-provider-cli-040-20261118t101934z-d8f14de7
  type: exec-result
  task_id: T-KATA-SLIM-2-etc-provider-cli-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-etc-provider-cli-040/T-KATA-SLIM-2-etc-provider-cli-040-20261118T101934Z-d8f14de7/plan.md
  started_at: "2026-11-18T10:19:42.496Z"
  completed_at: "2026-11-18T10:55:07.415Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - etc-provider-cli
    - specdojo:etc-rulebook
---

# Edit Result

## 1. 実施内容

- `etc-rulebook.md` から、どの成果物にも共通する文書運用の記述を外し、共通の正本への参照に置き換えた。全体方針に「共通の運用」を 1 項目だけ置いた。役割は適用先のメンバー定義、状態・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard` を参照する。
- 空白を除いた文字数は 8,102 字から 6,329 字になり、78.12% まで削減した。目安の 8 割以下を満たす。
- grade finding のうち F001 と F003 を修正した。F002 は対象が sample で本タスクの範囲外のため未解消である。
- executor の検証（prettier、`git diff --check`、独自スクリプトによる構造確認）は通った。runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` も passed だった。`lint:ts` と `typecheck` は変更種別により `not_applicable` である。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/etc-rulebook.md`: 共通運用の記述を整理し、正本参照に置き換えた。全体方針に「共通の運用」を 1 項目追加した。Frontmatter の共通項目表、見出し対応の反復、秘密情報の共通禁止行を削った。F001 に対し、最小例の Frontmatter を `specdojo:` 名前空間で包み、`rulebook: specdojo:etc-rulebook` を追加し、`title` を除いた。最小例の見出しは成果物形式の 1〜6 章に変え、与信再送の 1 ケースに絞った。F003 に対し、観点見出しのコロンを半角に統一した。章名と必須・任意の区分、型固有の判断基準、ケース ID、トレース、環境・証跡の要件と禁止事項は維持した。

## 3. 申し送り

- F002 は未解消である。対応 sample `docs/ja/specdojo/samples/etc-sample.md` が、rulebook 必須の 1〜6 章、`trace_key`、条件・ケース表を欠く。独自の「責任者」必須指定も残っている。次の段で sample を rulebook に同期する。矛盾時は rulebook を正とし、sample に合わせて本文要件は緩和していない。
- 根拠成果物 `etc-provider-cli.md` は未作成のため、既存成果物への適合確認はできていない。推測で成果物は作成も変更もしていない。
- recipe と template は undecided、`includes` 宣言もないため、追加編集は不要と判断した。共通正本への追記案はない。
- 参考として、PJR-8S4T と同じく表区切り行も除いて数えると 7,455 字から 5,816 字（78.01%）になる。
- 変更ファイルは docs/ja/specdojo/rulebooks/etc-rulebook.md のみ。全体方針に「共通の運用」を1項目追加し、役割は適用先のメンバー定義、状態・承認・改訂廃止・未決事項の引き継ぎは document-metadata-standard を参照した。Frontmatter の共通項目表、見出し対応の反復、秘密情報の共通禁止行を整理した。秘密情報の扱いは「境界/依存/環境」に維持した。
- 判断根拠: docs/ja/specdojo/standards/rulebook-authoring-standard.md、document-metadata-standard.md、docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml と参照スキーマ、共通レビュー観点の vp-arc-conciseness・vp-qe-omissions-consistency・vp-qe-kata-conformance・vp-ux-language-consistency、sld-rulebook、PJR-8S4T の展開一覧、etc-index-rulebook、etc-sample、etc-rulebook の grade result、dct-test-specs の宣言を確認した。根拠成果物 etc-provider-cli.md は未作成のため、既存成果物への適合確認はできない。推測で成果物を作成・変更せず、規範と finding で確定できる範囲を改訂した。
- F001 はメタ情報の specdojo 名前空間、rulebook 指定、文書名の H1 記載へ修正し、最小例の Frontmatter が成果物スキーマに適合することを確認した。F003 は観点見出しのコロンを半角に統一した。F002 は対象外の docs/ja/specdojo/samples/etc-sample.md に残るため未解消。次段で sample を rulebook の必須1〜6章・`trace_key`・条件とケースの表へ同期し、独自の「責任者」必須指定を除くこと。矛盾時は rulebook を正とし、sample に合わせて本文要件を緩和しなかった。
- 章名と必須6章・任意1章の区分は維持した。最小例の見出しのみ、ルール本文の8.xから成果物形式の1〜6へ変更し、自己完結したコードブロックに収めた。例を与信再送の1ケースへ絞り、型固有の判断基準、ケースID、トレース、環境・証跡の要件と禁止事項は維持した。
- 文字数は空白・改行だけを除いて8,102字→6,329字、78.12%。PJR-8S4T と同じく表区切り行も除く場合は7,455字→5,816字、78.01%。共通正本への追記案はなし。recipe・template は undecided、includes 宣言はなく、追加編集は不要。成果物本体・sample・result・grade sidecar・設定は変更していない。result の記録は reporter に委ねる。
- 親 runner が担当する lint・schema・型検査・単体／結合テストは実行していない。CHANGELOG 文案（変更）: 外部結合テスト対象別の rulebook を共通運用の正本参照へ整理し、Frontmatter と観点見出しの最小例を修正しました。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown rulebook のみで、変更した YAML ファイルがない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan・result を変更していない。）

## 4. 進め方と実践の型の適用

`rulebook-authoring-standard`、`document-metadata-standard`、成果物 frontmatter スキーマ、共通レビュー観点（`vp-arc-conciseness`、`vp-qe-omissions-consistency`、`vp-qe-kata-conformance`、`vp-ux-language-consistency`）を読み、sld の試行（PJR-8S4T）の展開一覧と改訂済み `sld-rulebook` を手本にした。`etc-index-rulebook`、`etc-sample`、grade result、`dct-test-specs` の宣言も確認した。F001 と F003 は規範に照らして修正し、解消を確認した。F002 は対象外の sample に原因があるため申し送りにした。矛盾時は rulebook を正とした。章名と必須・任意の区分は既存成果物との対応を保つため変えていない。根拠が不足する範囲は推測で改訂していない。
