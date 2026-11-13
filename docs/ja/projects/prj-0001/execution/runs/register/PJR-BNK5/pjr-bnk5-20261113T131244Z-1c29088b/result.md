---
specdojo:
  id: prj-0001:xer-pjr-bnk5-20261113t131244z-1c29088b
  type: exec-result
  task_id: PJR-BNK5
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BNK5/pjr-bnk5-20261113T131244Z-1c29088b/plan.md
  started_at: "2026-11-13T13:12:57.310Z"
  completed_at: "2026-11-13T13:48:35.664Z"
  agent: sol-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:gl-rulebook
---

# Edit Result

## 1. 実施内容

- 確定した用語集 6 件の実績と確定レビューの決定事項を基に、`docs/ja/specdojo/rulebooks/gl-rulebook.md` と `docs/ja/specdojo/samples/gl-sample.yaml` を改訂しました。
- Finding F001 に対処し、用語集 ID 形式を `^([a-z0-9-]+:)?gl-[a-z0-9-]+$` に是正してコロンを含む形式との矛盾を解消しました。
- 執筆標準に準拠した章立て・番号付けを行い、英語表記（小文字原則・例外規定）、用語見出し（`term`）、注記（`notes` の読み手向け補足への限定）、領域別分割ルール（`-common` の配置と領域接頭辞）、分類（`category`）定義、確定後 ID 不変ルールを規定しました。
- `docs/ja/specdojo/samples/gl-sample.yaml` を駄菓子屋の共通サンプル文脈に合わせて 10 語へ拡充し、分類用語・英語名・注記の手本となるよう完成度を高めました。
- `recipe` および `template` を不要（not-needed）と判断し、frontmatter に宣言しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/gl-rulebook.md`: 執筆標準に準拠した章立て・見出し連番への整理、F001 の用語集 ID 形式の是正（`^([a-z0-9-]+:)?gl-[a-z0-9-]+$`）、英語表記・用語見出し・注記・領域分割・ID 維持・参照範囲（`category` および `relatedTerms` は同一ファイル内に限定）に関する詳細規則と良い例・悪い例の追加、frontmatter における `recipe`・`template` 不要宣言の追記。
- `docs/ja/specdojo/samples/gl-sample.yaml`: 改訂した rulebook に沿って駄菓子屋の共通サンプル文脈の用語集を 10 語に拡充。分類用語の追加、英語名・注記の記述モデルの実装、未参照だった `tm-grandma` から役割名 `tm-shop-owner` への見直しを実施。

## 3. 申し送り

- 親プロセスの検証（`lint-ts`, `lint-fm`, `lint-md`, `lint-mermaid`, `lint-d2`, `test-integration`, `validate-schema`, `typecheck`, `test-unit`）はすべて passed であり、executor 担当の整形・検証も完了しています。
- 型の grade 評価は、統合後にオーケストレーターによって実施される想定です。
- reporter は個票の「対応結果」を参照し、result の実施内容・変更ファイル・進め方と実践の型の適用へ転記してください。編集対象は gl-rulebook.md、gl-sample.yaml、PJR-BNK5 個票の3ファイルです。確定済み用語集6件、CHANGELOG.md、result、grade サイドカーは編集していません。
- 判断根拠: 確定済み6件・179語、最新 grade、共通・登録簿の retrofit review result、PJR-2RHB、執筆標準と schema を照合しました。F001 は用語集 ID を ^([a-z0-9-]+:)?gl-[a-z0-9-]+$ に訂正して解消しました。ファイル名の locale は翻訳版併置時に付けます。新規用語 ID に領域接頭辞を必須とし、確定・参照済み ID は維持します。
- 参照の判断: 179語すべての category・relatedTerms は同一ファイル内を参照し、横断の ID 重複もありませんでした。同一ファイル内という制約を維持し、領域間は notes・source の文書リンクで案内します。用語の status は任意を維持しました。recipe・template は schema・本文要件・完成例で記述を判断できるため not-needed としました。sample は10語に拡充し、未参照の tm-grandma を役割名の tm-shop-owner に変更しました。
- CHANGELOG 申し送り: 区分「変更」、文案「用語集の型（gl）を確定済みの実績に合わせ、英語表記・注記・領域分割・ID 維持・参照範囲の規則を明確にし、駄菓子屋の完成例を拡充した。」。指定された親検証は runner が実行し、型の grade は統合後に orchestrator が実施してください。

## 4. 進め方と実践の型の適用

rulebook-maintenance の手順に沿って、確定済み用語集 6 件の実績、確定レビュー結果、執筆標準、および grade result の finding（F001）を根拠として `gl-rulebook.md` の構成と記述要件を見直しました。サンプルの章を分離しつつ `gl-sample.yaml` を駄菓子屋の共通文脈に基づく実践的な手本として再構成し、各種静的検査とスキーマ検証を通過させました。
