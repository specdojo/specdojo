---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-bps-sample-040-20261123t102601z-275fc4a2
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-bps-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-bps-sample-040/T-KATA-WAVE-6-DESIGN-bps-sample-040-20261123T102601Z-275fc4a2/plan.md
  started_at: "2026-11-23T10:26:09.373Z"
  completed_at: "2026-11-23T10:45:22.868Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:bps-sample
    - specdojo:bps-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook である `docs/ja/specdojo/rulebooks/bps-rulebook.md` を更新し、`grade` による 4 つの指摘（F001〜F004）に対応しました。
- F001 に基づき、推奨列の再掲を廃止して、記述ガイドには列の判断基準のみを記載するよう変更しました。
- F002 に基づき、完成判定の項目に Markdown lint や Frontmatter スキーマ検証などの形式適合を確認するためのコマンドを追加しました。
- F003 に基づき、未決事項に関する rulebook の要件（「当面の扱い」を求めること）を明確化しました。
- F004 に基づき、位置づけの説明において、略語（CDFD, BES, BR, STSD）の正式名称と各 rulebook への参照を追加しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/bps-rulebook.md`: `grade` の指摘に基づき、列定義の再掲を判断基準への置き換え（F001）、形式検査コマンドの追加（F002）、未決事項の要件明確化（F003）、および略語の正式名称と参照先の追記（F004）を行いました。

## 3. 申し送り

- F003 の残り: `bps-template` の未決事項表には「当面の扱い」の列がなく、rulebook にない「区分」「決定者」「決定時期」の列がある。rulebook は「当面の扱い」を要件とし、決定の担当と期限は登録簿の個票で追うと定めた。template を直す段で「区分」「決定者」「決定時期」を消し、「当の扱い」の列を足す必要がある。
- 直さなかった箇所: 全体方針、ファイル命名・ID規則、推奨 Frontmatter 項目、本文要件の表、記述ガイドの導入文と概要・入力・出力・検証・受入観点、禁止事項。grade の指摘や冗長な記述にあたらないため、そのまま残した。
- 全体方針にあった「文書の整形・lint・Frontmatter 検証はリポジトリの検証で扱い、業務の受入確認に含めない」の文は、完成判定に移した記述と重なるため消した。
- F003 の残り: `bps-template` の未決事項表には「当面の扱い」の列がなく、rulebook にない「区分」「決定者」「決定時期」の列がある。rulebook は「当面の扱い」を要件とし、決定の担当と期限は登録簿の個票で追うと定めた。template を直す段で「区分」「決定者」「決定時期」を消し、「当面の扱い」の列を足す必要がある。

## 4. 進め方と実践の型の適用

rulebook-maintenance
