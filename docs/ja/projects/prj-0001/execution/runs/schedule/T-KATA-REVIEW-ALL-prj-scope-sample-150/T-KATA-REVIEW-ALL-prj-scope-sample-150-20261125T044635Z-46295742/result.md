---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-scope-sample-150-20261125t044635z-46295742
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-scope-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-scope-sample-150/T-KATA-REVIEW-ALL-prj-scope-sample-150-20261125T044635Z-46295742/plan.md
  started_at: "2026-11-25T04:46:43.654Z"
  completed_at: "2026-11-25T04:59:25.059Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-scope-sample
    - specdojo:prj-scope-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、prj-scope-sample を同じ接頭辞の sample と照合した。「4. スコープ外」末尾のオフライン時の扱いを、前提・制約・依存関係（ACD-D03）と成功基準と受入条件の決定済みの扱いにそろえた。
- 相手側を直すべき点は変更せず、案として handoff に残した（3件）。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-scope-sample.md`: 「4. スコープ外」末尾の段落を修正した。オフライン時の運用を未決としていた記述を、通信断の日の記録を初期リリースの受入の対象外とし、受入後に足す受入条件で判定する記述に改めた。条件と時期は成功基準と受入条件の「例外条件と未解決事項」を参照させ、記録方法は `_UNDECIDED_` のまま、初期運用の開始前に店主代表（`PO`）が決めるとした。変更は 1 行の置き換えのみ。

## 3. 申し送り

- 迷った指摘は R5-1 と R5-4 の 2 件で、いずれも「要判断」の印が付いている。R5-1 は、選ばなかった案（スコープを未決のまま残し、ACD と成功基準の側を未決に戻す案）の採否を PO が判断する。R5-4 は、共通サンプル文脈では Role code に `BA` を使えるため誤りとは言い切れず、関係者を足すか `DEV` に置き換えるかを PO が判断する。
- R5-1: 段 R5 / 箇所 4. スコープ外（末尾の段落） / 指摘 オフライン時の運用を初期スコープに含めるかを未決としていた。前提・制約・依存関係の ACD-D03 は「初期受入の対象外とする扱いは決定済み」とし、成功基準と受入条件の「例外条件と未解決事項」は、受入条件を初期受入の後に足して単独で判定するとしており、食い違っていた / 直した案 通信断の日の記録を初期リリースの受入の対象外とし、受入後に足す受入条件で判定すると書いた。条件と時期は成功基準と受入条件の「例外条件と未解決事項」を参照させた。記録方法は `_UNDECIDED_` のままとし、初期運用の開始前に店主代表（`PO`）が決めるとした / 根拠 vp-qe-kata-conformance、vp-dev-change-impact / 印 要判断（スコープの未決を、ほかの2つの sample の決定済みの扱いにそろえた。選ばなかった案は、スコープを未決のまま残し、ACD と成功基準の側を未決に戻すこと）
- R5-2: 段 R5 / 箇所 全体（用語） / 指摘 プロジェクト概要とステークホルダー登録簿は「初期公開」と書いている。共通サンプル文脈（Sample 記述標準）、憲章、成功基準と受入条件、課題と解決アプローチ、本書は「初期リリース」である / 直した案 - / 根拠 vp-qe-kata-conformance。相手側の案: prj-overview-sample と prj-stakeholder-register-sample の「初期公開」を「初期リリース」にそろえる（概要の「基本的な考え方」の定義の括弧書きも含める） / 印 -
- R5-3: 段 R5 / 箇所 4. スコープ外（末尾の段落） / 指摘 プロジェクト憲章の「未決事項」は、オフライン時の扱いを「詳細計画の承認前に、スコープで対象か対象外かを決める」としている。R5-1 で決めた扱いと合わない / 直した案 - / 根拠 vp-dev-change-impact。相手側の案: prj-charter-sample の「未決事項」と「ハイレベルスコープ」の「未確定」の行を、初期受入の対象外は決定済みとし、記録方法を初期運用の開始前に決める形に書き換える / 印 -
- R5-4: 段 R5 / 箇所 6. スコープ変更方針（承認者の行） / 指摘 業務分析（`BA`）を判断材料の整理役にしているが、ステークホルダー登録簿と憲章には `BA` に当たる関係者がいない（成功基準と受入条件も `BA` を使っている） / 直した案 - / 根拠 vp-qe-kata-conformance。相手側の案: prj-stakeholder-register-sample に `BA` を担う関係者を足すか、本書と成功基準と受入条件の両方で `BA` を開発担当（`DEV`）に置き換える / 印 要判断（共通サンプル文脈では Role code に `BA` を使えるため、誤りとは言い切れない）
- 適用外の検証: `npm run validate:history-links`（変更したのは sample の1件だけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

根拠は、同じ接頭辞の sample（概要、憲章、ステークホルダー登録簿、成功基準と受入条件、課題と解決アプローチ）と、Sample 記述標準の共通サンプル文脈である。観点は vp-qe-kata-conformance と vp-dev-change-impact を使った。plan に展開された grade の finding と condense の記録はなかった。食い違いのうち sample 側で直せる 1 件（R5-1）だけを直した。用語の揺れ（R5-2）、憲章の未決事項（R5-3）、`BA` の関係者の欠落（R5-4）は相手側を直す案件なので、変更せず handoff の案に残した。検証は、executor が実行した prettier の確認が通り、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。`validate:history-links` は履歴蓄積ファイルを変更していないため非適用とした。runner の他の検査は変更種別により非適用だった。
