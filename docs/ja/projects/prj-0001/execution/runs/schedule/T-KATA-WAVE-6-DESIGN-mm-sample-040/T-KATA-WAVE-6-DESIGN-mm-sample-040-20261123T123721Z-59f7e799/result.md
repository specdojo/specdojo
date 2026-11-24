---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-mm-sample-040-20261123t123721z-59f7e799
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-mm-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-mm-sample-040/T-KATA-WAVE-6-DESIGN-mm-sample-040-20261123T123721Z-59f7e799/plan.md
  started_at: "2026-11-23T12:37:30.854Z"
  completed_at: "2026-11-23T16:46:24.548Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:mm-sample
    - specdojo:mm-rulebook
---

# Edit Result

## 1. 実施内容

- 議事録の rulebook `mm-rulebook.md` を、grade の指摘（F001〜F021）と plan の方針に沿って簡潔に整えた。本文要件を表にまとめ、記述ガイドに判断の基準と良い例・悪い例を加え、禁止事項を判定できる形にし、個票と進捗報告への引き継ぎとファイル名の必須化を明記した。
- sample・recipe・template は変更していない。executor の検査では prettier と markdownlint が成功し、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/mm-rulebook.md`: 議事録の rulebook を簡潔に書き直した（38 行追加、21 行削除）。本文構成を、章ごとの目的を示す本文要件の表にした。記述ガイドには章ごとの判断の基準と良い例・悪い例を加えた。禁止事項は客観的に判定できる書き方にした。ファイル名の規則は必須とし、議事録から個票と進捗報告へ引き継ぐ事項も明記した。完成例の章は置かず、完成例は sample に任せている。

## 3. 申し送り

- 再評価の grade で、F001〜F021 が解消したか確認してほしい。executor が見送った指摘の理由は、上記の executor の申し送りにある。
- F009: 文書の承認者を書かせる要件は PJR-76N9 の決まりで追加していない（決定者は記載必須のまま）。承認と留保は登録簿の個票で追う。
- F004 の一部: アクションの状態の列は必須にしていない。現在の mm-sample に状態の列がないため。進み具合は進捗報告で追う。
- F011, F013: 議事録はツールで生成する対象ではない。lint の手順は共通の手順書が正本なので rulebook には書いていない。
- F002, F005, F021: 未決事項・リスク・改訂の担当は rulebook 本文には書かず、frontmatter と登録簿で扱う。改訂時の追従は、ファイル名と ID を変えない規定（F012 への対応）で一部カバーした。
- 適用外の検証: `npm run validate:history-links`（changed file is a rulebook, not a plan/result/pjr history file）

## 4. 進め方と実践の型の適用

rulebook-maintenance の進め方に従い、grade の finding を根拠に `mm-rulebook.md` だけを見直した。実装・schema・リファレンスと同じことを書かない方針を保ち、値や構文の詳細は正本を参照する形にした。PJR-76N9 の決まりに従い、文書の承認者や役割の割り当てを求める記述は追加していない。承認と留保は登録簿の個票で追う。F004 の状態列は、現在の sample に状態の列がないため必須にしなかった。F011 と F013 は、議事録がツールで生成する対象ではなく、lint の手順は共通の手順書が正本であるため、rulebook に書いていない。
