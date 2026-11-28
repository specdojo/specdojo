---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-scope-sample-110-20261125t032502z-ab58b018
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-scope-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-scope-sample-110/T-KATA-REVIEW-ALL-prj-scope-sample-110-20261125T032502Z-ab58b018/plan.md
  started_at: "2026-11-25T03:25:11.834Z"
  completed_at: "2026-11-25T03:38:00.234Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-scope-sample
    - specdojo:prj-scope-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として `prj-scope-sample` を見直した。「1. 対象業務」の表の前にあった 2 文を削り、表の前の 1 文だけを残した。
- 削った 2 文は、スコープの合意者と Role code の書き方の説明、および `BA` による受入観点の整理と操作確認の取りまとめだった。前者は文書の役割の割り当てで、最終判断者は「6. スコープ変更方針」の承認者の行と重なる。後者は受入条件の文書に任せる内容である。
- 不足する内容はなかった。必須の 4 章と任意の 2 章は rulebook の本文構成を満たしている。rulebook など sample 以外は変更していない。
- runner の検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が成功した。そのほかの検査は変更種別により対象外と判定された。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-scope-sample.md`: 「1. 対象業務」の表の前から 2 文（合意と最終判断を店主代表が担い Role code の `PO` と書く説明、`BA` による受入観点の整理と操作確認の取りまとめ）を削除した。文書の役割の割り当てと受入条件の詳細にあたり、スコープの sample には要らないため。差分は 1 行の追加と 1 行の削除。

## 3. 申し送り

- R1 の指摘は 3 件で、直したのは No.1 の 1 件。No.2（不足なし）は変更なし。No.3 は R1 では直さず R3 へ回した。
- 要判断（No.3）: No.1 の削除で、Role code の `BA` が説明なしで「6. スコープ変更方針」の承認者の行に初めて出る。Role code の初出に説明を添えるかは R3（用語の表記、W8）で確かめる。
- No: 1 / 段: R1 目的の過不足 / 箇所: docs/ja/specdojo/samples/prj-scope-sample.md「1. 対象業務」の表の前の段落 / 指摘: 「スコープの合意と変更の最終判断は店主代表が担い、責務を表す箇所では Role code の `PO` と書く。」と「利用者影響と受入観点の整理は業務分析の Role `BA` が担い、家族利用者代表の操作確認の結果を取りまとめる。」の 2 文が要らない。1 文目は文書の合意（承認）の役割の割り当てと記法の説明で、最終判断者は「6. スコープ変更方針」の承認者の行と重なる。2 文目の受入観点の整理と操作確認の取りまとめは、rulebook が成功基準と受入条件の文書に任せる内容である / 直した案: 2 文を削り、表の前の 1 文（何を示す表か）だけを残した（sample に反映済み） / 根拠: [[specdojo:sample-authoring-standard|Sample 記述標準]]の記述ガイドと禁止事項（文書の役割の割り当てや承認の進み具合を書かない）、[[specdojo:prj-scope-rulebook|プロジェクトスコープ 作成ルール]]の全体方針（受入条件は `prj-success-criteria-and-acceptance-criteria` へ委譲）、`vp-arc-single-responsibility` / 印: なし
- No: 2 / 段: R1 目的の過不足 / 箇所: docs/ja/specdojo/samples/prj-scope-sample.md 全体（必須の 4 章と任意の 2 章） / 指摘: 不足なし。対象業務・対象システム・対象期間・スコープ外は rulebook の本文構成が求める項目（利用者影響、境界、判断イベント、継続改善との切り分け、理由と後続で扱う条件）を満たす。対象システムの各行はどれかの対象業務を支えており、禁止事項にも当たらない / 直した案: 変更なし / 根拠: [[specdojo:prj-scope-rulebook|プロジェクトスコープ 作成ルール]]の本文構成（標準テンプレ）と記述ガイド、成果物カタログ dct-kata.yaml の prj-scope-sample の `done_criteria`、`vp-po-purpose-alignment`・`vp-qe-kata-conformance` / 印: なし
- No: 3 / 段: R1 目的の過不足 / 箇所: docs/ja/specdojo/samples/prj-scope-sample.md「6. スコープ変更方針」の承認者の行 / 指摘: No.1 の削除で、Role code の `BA` が説明なしでこの行に初めて出る。Role code の初出に説明を添えるかは R3（用語の表記、W8）で確かめる / 直した案: R1 では変更しない。R3 へ申し送る / 根拠: kata-guide の「文章のチェック項目」W8 / 印: 要判断

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に沿い、R1（目的の過不足）の確かめとして sample の構成を rulebook の本文構成と Sample 記述標準に照らして見直した。plan に展開された grade の finding と、成果物から届いた Kata が原因の finding はどちらもなかった。根拠にした規範は、Sample 記述標準の記述ガイドと禁止事項（文書の役割の割り当てや承認の進み具合を書かない）、`prj-scope-rulebook` の全体方針と本文構成（受入条件は `prj-success-criteria-and-acceptance-criteria` へ委譲）、`vp-arc-single-responsibility`、`vp-po-purpose-alignment`、`vp-qe-kata-conformance`。対象業務・対象システム・対象期間・スコープ外は rulebook の要求項目を満たすため維持した。根拠不足で見送った箇所はない。frontmatter の `status` は変更していない。
