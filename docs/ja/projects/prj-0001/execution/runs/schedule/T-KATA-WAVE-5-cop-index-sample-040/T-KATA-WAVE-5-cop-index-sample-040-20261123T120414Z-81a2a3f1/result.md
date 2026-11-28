---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-cop-index-sample-040-20261123t120414z-81a2a3f1
  type: exec-result
  task_id: T-KATA-WAVE-5-cop-index-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-cop-index-sample-040/T-KATA-WAVE-5-cop-index-sample-040-20261123T120414Z-81a2a3f1/plan.md
  started_at: "2026-11-23T12:04:22.677Z"
  completed_at: "2026-11-23T12:15:47.999Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:cop-index-sample
    - specdojo:cop-index-rulebook
---

# Edit Result

## 1. 実施内容

- cop-index-rulebook を grade の指摘（F001, F002, F003, F005）に基づき更新しました。
- 「全体方針」に記載レベルと、当日の決定・課題を転記するための具体的な接続先（`pm-decision-log` および `pm-issue-log`）を追記しました。
- Frontmatter の検証手順（`npm run lint:fm` の実行、終了コードの確認、エラー時の対応）を記述しました。
- 「連絡先」の記述について、個人の電話番号等を避け、ロールの窓口に限定するか内部の連絡網を参照するようルールを修正しました。
- 「記述ガイド」に、不足していた「担当者、連絡系統」「ロールバック手順」「障害時判断、エスカレーション」の節を追加しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cop-index-rulebook.md`: grade の指摘に基づき、全体方針への転記先明示、Frontmatter の検証手順の追加、連絡先の記述制限、および記述ガイドへの「担当者・連絡系統」「ロールバック」「障害時判断」の節の追加を行いました。

## 3. 申し送り

- F004 （major/vp-qe-kata-conformance）は未対応です。`specdojo:cop-index-sample` が、rulebook で定義されている 10 章の構成（概要、適用範囲、入力情報など）を保持しておらず、旧形式のままとなっているため、sample 自体を書き直す次のステップが必要です。
- 「ファイル命名・ID規則」については、grade の指摘対象外であったため、既存の記述を維持しています。
- `specdojo:cop-rulebook` 内の「共通の運用」の記述についても、今回の `cop-index-rulebook` の修正内容と整合させるための見直しを推奨します。
- F004（major/vp-qe-kata-conformance）は未対応。specdojo:cop-index-sample が rulebook の 10 章（概要（index）〜関連ドキュメント）を持たず、目的と適用範囲・入力情報など旧形式のままになっている。sample を書き直す段で、駄菓子屋の販売管理システムの切替を題材に 10 章を具体化する必要がある（この段は rulebook だけが対象のため見送った）。
- 直さなかった箇所: 「ファイル命名・ID規則」は具体項目が 2 つのまま。grade の指摘対象ではなく、`cop-&lt;term&gt;` の命名は specdojo:cop-rulebook 側の扱いなので、理由のない書き換えはしなかった。
- specdojo:cop-rulebook の「共通の運用」にも「未決事項と当日の課題の登録簿への引き継ぎは document-metadata-standard に従う」という同じ文言が残っている。F002 と同じ指摘を受けうるため、cop-rulebook を見直すときに cop-index の「当日の決定と課題の引き継ぎ」を参照する形にそろえることを検討する。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/rulebooks/cop-index-rulebook.md だけで、plan・result・個票は変更していないため）

## 4. 進め方と実践の型の適用

rulebook-maintenance
