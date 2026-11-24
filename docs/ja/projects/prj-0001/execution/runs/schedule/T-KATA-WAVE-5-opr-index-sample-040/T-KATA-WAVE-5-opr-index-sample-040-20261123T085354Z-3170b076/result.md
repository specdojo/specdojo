---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opr-index-sample-040-20261123t085354z-3170b076
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-index-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-index-sample-040/T-KATA-WAVE-5-opr-index-sample-040-20261123T085354Z-3170b076/plan.md
  started_at: "2026-11-23T08:54:08.682Z"
  completed_at: "2026-11-23T09:13:23.690Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:opr-index-sample
    - specdojo:opr-index-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook である `docs/ja/specdojo/rulebooks/opr-index-rulebook.md` を、grade の指摘事項に基づき更新しました。
- F001 に基づき、禁止事項として個人名・個人の連絡先・個人のアカウント識別子の記載を禁止する規定を追加しました。
- F002 に基づき、配置先ディレクトリに関する記述を追加しました。
- F004 に基づき、ID の修飾形式に関する規定を追加しました。
- F008 に基づき、`opr-` プレフィックスの意味や分冊の判断基準に関する説明を拡充しました。
- F009 に基づき、`opd-*` との整合性に関する記述を整理しました。
- PJR-76N9 の方針に従い、役割の割り当てに関する記述を、文書の役割の定義へと修正しました。
- 既存の 12 章構成および手順表の標準列に関する規定は、成果物との整合性を保つため維持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/opr-index-rulebook.md`: grade の指摘（F001, F002, F004, F008, F009）および PJR-76N9 に基づき、公開不適切情報の混入防止、配置規則、ID 修飾形式、および `opr-` プレフィックスの定義に関する記述を追加・修正しました。

## 3. 申し送り

- F005 (major): the sample's frontmatter says `rulebook: specdojo:opd-rulebook`, and the text body refers to `../rulebooks/opr-rulebook.md`. Both should point to `specdojo:opr-index-rulebook`. The sample is fixed in the sample-update stage.
- F006 (major): the rulebook requires all 12 chapters, but the sample has only 4. The sibling `opd-index` also requires all 12 chapters, and a chapter that was split out can be satisfied by a reference, so the rulebook keeps the rule. The sample should get the missing chapters, either as references to `opr-&lt;term&gt;` or as not applicable with a reason.
- F007 (minor): the sample's inspection-procedure table lacks the input-condition and operation columns of the standard columns (performer, input condition, operation, completion condition, evidence). Its chapter 12 heading (`opd` reference, `mip` / `otp` / `cop` links) also differs from the rulebook. The sample should match the rulebook.
- Points to record in the result's methods-and-kata-application section: the rulebook wording for F001 (prohibition table, personal information) and F002 (placement under `docs/ja/product/090-operations/`) follows `opd-index-rulebook`; for F004 (ID qualification) it follows atc-index / cop-index; the chapter list in the body structure and the standard columns were kept.

## 4. 進め方と実践の型の適用

rulebook を修正し、grade の指摘事項を解消しました。ただし、F005, F006, F007 に関する修正は成果物（sample）側の変更が必要であるため、このフェーズでは rulebook の記述を維持・整理するに留めています。
