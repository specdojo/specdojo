---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opr-sample-060-20261123t104424z-82c8ccaa
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-sample-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-sample-060/T-KATA-WAVE-5-opr-sample-060-20261123T104424Z-82c8ccaa/plan.md
  started_at: "2026-11-23T10:44:41.614Z"
  completed_at: "2026-11-23T16:36:15.917Z"
  agent: opus-executor
  execution: agent
  approach: template-maintenance
  targets:
    - specdojo:opr-sample
    - specdojo:opr-template
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/templates/opr-template.md` を更新し、grade finding F001〜F008 に対応しました。rulebook と sample は変更していません。
- condense finding（`_DELIVERABLE_OVERVIEW_` の二重配置）は、現行 template では H1 直下に導入文がなく、`_DELIVERABLE_OVERVIEW_` が概要の章にしか出ないため、対応済みとして構造を維持しました。
- executor は整形と markdownlint を実行し、どちらも通過しました。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過しました。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/opr-template.md`: 次の指示や項目を追加しました（evidence の `final_message` に基づく）。 - インシデント表: エスカレーション条件と意思決定者、停止またはロールバックの基準と承認者。 - アラートの段階: 誤検知の扱いを含む段階の指示。 - バックアップとリストア: 演習の頻度。 - 変更手順: 実行手順と事前通知の要否・方法。 - 関連文書表: `opd-index` の必須行と、別の巻がない場合の `（本書のみ）` / `（なし）` の記載。 - 概要の章: 該当しない章を `なし`、`opr-index 参照`、`本書の範囲外` のいずれかで理由付きで残す指示。

## 3. 申し送り

- F001〜F008 が判定根拠に照らして解消したかは、grade の再評価で確認してください。evidence にあるのは executor の自己申告と検査結果だけです。
- condense finding (cause=kata:template, location opr-template.md:18-23): the current template has no intro text under H1 and `_DELIVERABLE_OVERVIEW_` appears only in the overview chapter, so this was treated as already resolved and no change was made.
- 適用外の検証: `npm run validate:history-links`（Only docs/ja/specdojo/templates/opr-template.md changed; no plan/result/pjr history files were edited）
- 適用外の検証: `npm run validate:schema:file`（Only a Markdown file changed）

## 4. 進め方と実践の型の適用

template-maintenance として、grade finding F001〜F008 を rulebook の該当節に沿って template へ反映しました。rulebook と sample は変更していません。condense finding は現行 template で解消済みと判断し、構造を維持しました。evidence に変更前の内容や根拠とした規範の読み込み記録はありません。そのため、維持・改訂した個別の記述とその根拠の詳細は、evidence から確認できた範囲に限っています。
