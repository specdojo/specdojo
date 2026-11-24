---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opd-index-sample-040-20261123t055611z-9201e71d
  type: exec-result
  task_id: T-KATA-WAVE-5-opd-index-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opd-index-sample-040/T-KATA-WAVE-5-opd-index-sample-040-20261123T055611Z-9201e71d/plan.md
  started_at: "2026-11-23T05:56:26.439Z"
  completed_at: "2026-11-23T06:14:54.872Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:opd-index-sample
    - specdojo:opd-index-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook を簡潔に改訂し、rulebook 側で修正可能な 8 件の finding (`F001`〜`F007`, `F011`) を解消しました。
- `F008`、`F009`、`F010` については、sample 側の不備（章の欠落や ID 不整合）に関する指摘ですが、本タスクの範囲外であるため、申し送り事項として記録しています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/opd-index-rulebook.md`: grade の指摘に基づき、以下の修正を行いました。\n- `F001`: 禁止事項に「個人名・個人の連絡先を記載しない」旨を追記。\n- `F002` & `F006`: 見出し「位置づけと用語定義」に対し、用語の定義と対象外の境界を追記。\n- `F003`: 各章における最低限書く項目（棚卸し頻度、監査ログ保管、点検周期、窓口・分類・応答 SLA 等）を追記。\n- `F004`: 検証対象として Markdown lint や Frontmatter スキーマ検証を明記。\n- `F005`: 禁止事項「コマンド列・逐次チェックリストを大量記載しない」の理由を「手順は `opr-*` へ委譲するため」と具体化。\n- `F007`: 禁止事項に理由を追記。\n- `F011`: 「SLO・SLA・KPI」の表記および標準列の定義をサンプルと統一。

## 3. 申し送り

- F008/F009: sample `docs/ja/specdojo/samples/opd-index-sample.md` は本文構成 12 章のうち 4 章（概要、SLO・SLA・KPI、体制、関連導線）しか書いておらず、運用の範囲・前提、監視、障害、変更管理、バックアップ、権限、定期運用、問い合わせの章がない。12 章必須は運用方針として妥当なので rulebook は維持し、sample へ不足章を足す（該当しない章は対象外と理由を書く）次の段の sample タスクが要る。
- F010: sample の frontmatter の `rulebook` が `specdojo:opd-rulebook`、本文の参照が `../rulebooks/opd-rulebook.md` になっている。`specdojo:opd-index-rulebook` へ直し、本文の参照行は削除する必要がある（sample タスクで対応）。
- 直さなかった箇所: 「ファイル命名・ID規則」と「推奨 Frontmatter 項目」の章は、grade の指摘がなく冗長でもないため変更していない。
- 根拠とした規範: `docs/ja/specdojo/standards/rulebook-authoring-standard.md`（章立て、用語定義の扱い、役割記述の方針）、比較対象とした兄弟の rulebook `specdojo:opr-index-rulebook`（全章必須で対象外を許す書き方）、sample `specdojo:opd-index-sample`（列名「目標値」の統一）。

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と成果物の `done_criteria` に沿って簡潔に整えました。`docs/ja/specdojo/standards/rulebook-authoring-standard.md` の章立てに従い、記述ガイドとして「判断の基準」や「禁止事項とその理由」を整理し、実装・スキーマ・リファレンスとの重複を避ける方針を維持しました。また、PJR-76N9 に基づき、文書の役割を「個人の判断」ではなく「文書の利用場面」として記述するよう修正しました。
