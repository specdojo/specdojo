---
specdojo:
  id: prj-0001:xer-pjr-bnk5-20261113t131244z-1c29088b
  type: exec-result
  task_id: PJR-BNK5
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BNK5/pjr-bnk5-20261113T131244Z-1c29088b/plan.md
  started_at: "2026-11-13T13:12:57.310Z"
  completed_at: "2026-11-13T13:35:28.780Z"
  agent: sol-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:gl-rulebook
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- 確定した用語集 6 件の実績に基づき、`gl-rulebook.md` を更新しました。
- 用語 ID の形式に関する矛盾（`F001`）を解消するため、ID 形式の定義を `^([a-z0-9-]+:)?gl-[a-z0-9-]+$` へ修正しました。
- 英語名と英語の用語を小文字で記載するルール、用語の見出し（`term`）に関する規定、注記（`notes`）の書き方、領域別用語集における ID 形式と参照範囲の制限などを反映しました。
- 用語集のサンプルとして `gl-sample.yaml` を更新し、駄菓子屋の文脈を用いた完成例（10語）へと拡充しました。
- rulebook の `recipe` と `template` の要否を判断し、frontmatter に反映しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/gl-rulebook.md`: 用語集の ID 形式の定義を修正し、英語表記、注記の書き方、領域分割時の命名規則や参照範囲に関する規定を追加して、確定した用語集の実態に合わせました。
- `docs/ja/specdojo/samples/gl-sample.yaml`: rulebook の新しい規定（分類の用語、英語名、注記の書き方）の手本となるよう、駄菓子屋の文脈を用いたサンプルデータを拡充しました。

## 3. 申し送り

- reporter は個票の「対応結果」を参照し、result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` へ転記してください。編集対象は `gl-rulebook.md`、`gl-sample.yaml`、および `PJR-BNK5` 個票の3ファイルです。確定済み用語集6件、`CHANGELOG.md`、`result`、grade サイドカーは編集していません。
- 判断根拠: 確定済み6件・179語、最新 grade、共通・登録簿の retrofit review result、`PJR-2RHB`、執筆標準と schema を照合しました。`F001` は用語集 ID を `^([a-z0-9-]+:)?gl-[a-z0-9-]+$` に訂正して解消しました。ファイル名の locale は翻訳版併置時に付けます。新規用語 ID に領域接頭辞を必須とし、確定・参照済み ID は維持します。
- 参照の判断: 179語すべての `category`・`relatedTerms` は同一ファイル内を参照し、横断の ID 重複もありませんでした。同一ファイル内という制約を維持し、領域間は `notes`・`source` の文書リンクで案内します。用語の `status` は任意を維持しました。`recipe`・`template` は schema・本文要件・完成例で記述を判断できるため `not-needed` としました。sample は10語に拡充し、未参照の `tm-grandma` を役割名の `tm-shop-owner` に変更しました。
- CHANGELOG 申し送り: 区分「変更」、文案「用語集の型（gl）を確定済みの実績に合わせ、英語表記・注記・領域分割・ID 維持・参照範囲の規則を明確にし、駄菓子屋の完成例を拡充した。」。指定された親検証は runner が実行し、型の grade は統合後に orchestrator が実施してください。
- reporter は個票の「対応結果」を参照し、result の実施内容・変更ファイル・進め方と実践の型の適用へ転記してください。編集対象は gl-rulebook.md、gl-sample.yaml、PJR-BNK5 個票の3ファイルです。確定済み用語集6件、CHANGELOG.md、result、grade サイドカーは編集していません。
- 判断根拠: 確定済み6件・179語、最新 grade、共通・登録簿の retrofit review result、PJR-2RHB、執筆標準と schema を照合しました。F001 は用語集 ID を ^([a-z0-9-]+:)?gl-[a-z0-9-]+$ に訂正して解消しました。ファイル名の locale は翻訳版併置時に付けます。新規用語 ID に領域接頭辞を必須とし、確定・参照済み ID は維持します。
- 参照の判断: 179語すべての category・relatedTerms は同一ファイル内を参照し、横断の ID 重複もありませんでした。同一ファイル内という制約を維持し、領域間は notes・source の文書リンクで案内します。用語の status は任意を維持しました。recipe・template は schema・本文要件・完成例で記述を判断できるため not-needed としました。sample は10語に拡充し、未参照の tm-grandma を役割名の tm-shop-owner に変更しました。

## 4. 進め方と実践の型の適用

確定した用語集の実績と `F001` の指摘に基づき、`gl-rulebook.md` の用語 ID 形式の定義を修正し、その他の執筆規定（英語表記、注記、領域分割ルール）を整理しました。また、`gl-sample.yaml` を rulebook の新しい規定に沿った完成例へと拡充しました。
