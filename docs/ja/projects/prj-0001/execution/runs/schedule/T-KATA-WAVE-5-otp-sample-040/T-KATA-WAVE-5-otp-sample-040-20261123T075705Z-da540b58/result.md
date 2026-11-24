---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-otp-sample-040-20261123t075705z-da540b58
  type: exec-result
  task_id: T-KATA-WAVE-5-otp-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-otp-sample-040/T-KATA-WAVE-5-otp-sample-040-20261123T075705Z-da540b58/plan.md
  started_at: "2026-11-23T07:57:12.988Z"
  completed_at: "2026-11-23T16:43:12.107Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:otp-sample
    - specdojo:otp-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/otp-rulebook.md` を簡潔に書き直した。差分は 55 行追加、117 行削除。grade の指摘 F001〜F006・F008・F009 は rulebook 側で解消した。
- F007 は `otp-sample` の項目不足が原因のため、sample を変更しないこの段では直さず申し送った。
- 整形と markdownlint は通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。`validate:history-links` は履歴ファイルを変更していないため `not_applicable` とした。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/otp-rulebook.md`: rulebook を簡潔に整理した。冗長な記述を削り、本文構成の表を目的列つきに整えた。executor の記録による解消内容は次のとおり。F001（個人名・連絡先等の公開不適切情報の扱い）、F002（対象外の明記）、F003（確認手順）、F004（クローズ条件の判定値と測定方法）、F005（命名パターンの確定）、F006（`otp-index` との重複の整理）、F008（章ごとの目的列）、F009（「問合せ」への表記統一）。位置づけと Frontmatter の方針は、grade の指摘がなく `otp-index-rulebook` とも整合しているため、表の形への整理以外は変えていない。

## 3. 申し送り

- F007 は executor の申し送りどおり、sample の段で `otp-sample` を rulebook の本文要件に合わせて補う必要がある。
- F007（major）: `otp-sample` に rulebook が求める項目が欠けている。足りないのは、9 章の停止時期とデータ保持・アーカイブ方針、3 章の保管先とリストアの完了基準、6 章のエスカレーション条件、7 章の判断基準、10 章の判定値・測定方法・クローズ判断者・最終報告物、1 章の対象範囲・対象外。11 章の見出し「関連ドキュメント（必須）」も rulebook の「関連ドキュメント」と異なる。この段は sample を変更しないため直していない。次のアクション: sample の段で rulebook の本文要件に合わせて補う。
- F009 の表記の統一は、`otp-index-rulebook` と sample の見出し「問合せ窓口/一次対応」に合わせて「問合せ」にそろえた。「問い合わせ」へ統一する場合は、`otp-index` 系統とあわせて判断する。
- 直さなかった箇所: 位置づけと Frontmatter の方針は grade の指摘がなく、`otp-index-rulebook` とも整合しているため、表の形への整理以外は変えていない。
- 適用外の検証: `npm run validate:history-links`（変更は rulebook だけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

rulebook-maintenance の手順で、grade の指摘 F001〜F009 を根拠に `docs/ja/specdojo/rulebooks/otp-rulebook.md` だけを見直した。F007 は sample 側の不足が原因だった。plan に sample・recipe・template をこの段で変更しないとあるため、rulebook は直さず申し送った。位置づけと Frontmatter の方針は指摘がなく整合していたため維持した。表記は `otp-index-rulebook` と sample の見出しに合わせて「問合せ」にそろえた。
