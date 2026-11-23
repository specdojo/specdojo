---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-imp-business-sample-040-20261123t122808z-99bbaad6
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-imp-business-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-imp-business-sample-040/T-KATA-WAVE-6-DESIGN-imp-business-sample-040-20261123T122808Z-99bbaad6/plan.md
  started_at: "2026-11-23T12:28:22.825Z"
  completed_at: "2026-11-23T12:46:39.120Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:imp-business-sample
    - specdojo:imp-business-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook である `docs/ja/specdojo/rulebooks/imp-business-rulebook.md` を簡潔に整えました。
- grade の指摘事項（F001〜F006, F008, F009）に基づき、記述ガイドの更新を行いました。
- 具体的には、未解決事項の転記と報告先に関する記述の追加、対応方針の列挙値の限定、および判断・対応への影響に関する良い例・悪い例の追加を行いました。
- sample（F007, F002, F008, F009 に関わる修正）および Frontmatter の `recipe` / `template` の要否判断（F010）については、このフェーズの制約により、次回のタスクへ申し送りにしています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/imp-business-rulebook.md`: rulebook の章立てを `rulebook-authoring-standard` に合わせ、記述ガイドを整備しました。未解決事項の転記ルール（`question`, `risk`, `issue`, `decision` への分類）の追加や、対応方針の記述における「影響」の記載に関するガイドライン、および禁止事項（個人名の記載禁止など）を追記しました。

## 3. 申し送り

- F007・F002・F008・F009 は sample の修正が要る。この段では sample を変更しないため、次の段で直す: 3章に影響度の尺度と集約規則を定義する、5章の『優先度』列を『影響度』にし、担当の個人名を Role code にし、『完了条件』列を足す、6章に『判断・対応への影響』『当面の扱い』『転記先の登録項目』列を足す。
- F010: Frontmatter の `recipe` と `template` は `undecided` のまま。ready にする前に、型の schedule の recipe・template の段で `not-needed` か整備対象かを人が決める。
- F001 は PJR-76N9 に合わせて一部だけ反映した。決定期限と担当（Role code）は本文に求めるが、承認・保留・差し戻しの進み具合は登録簿の個票で追う。
- 章立てを `rulebook-authoring-standard` に合わせ、『本文構成（標準テンプレ）』を『本文要件』に改めた。書き方は改訂済みの `imp-test-rulebook` に揃えた。全体方針にあった『業務担当者とプロジェクト管理者が合意できる粒度』は PJR-76N9 の方針に合わないため削った。
- 章立てを rulebook-authoring-standard に合わせ、『本文構成（標準テンプレ）』を『本文要件』に改めた。書き方は改訂済みの imp-test-rulebook に揃えた。全体方針にあった『業務担当者とプロジェクト管理者が合意できる粒度』は PJR-76N9 の方針に合わないため削った。

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と `done_criteria` に沿って簡潔に整える方針で実施しました。rulebook の章立てを `rulebook-authoring-standard` に準拠させ、記述ガイドとしての精度を高めるために、指示された findings を反映しました。一方で, sample 自体の変更は本タスクの範囲外として扱っています。
