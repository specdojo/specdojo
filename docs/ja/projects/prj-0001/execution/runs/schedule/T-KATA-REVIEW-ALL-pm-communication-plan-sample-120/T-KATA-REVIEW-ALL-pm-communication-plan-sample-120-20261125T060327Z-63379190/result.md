---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-communication-plan-sample-120-20261125t060327z-63379190
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-communication-plan-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-communication-plan-sample-120/T-KATA-REVIEW-ALL-pm-communication-plan-sample-120-20261125T060327Z-63379190/plan.md
  started_at: "2026-11-25T06:03:36.683Z"
  completed_at: "2026-11-25T06:17:32.145Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-communication-plan-sample
    - specdojo:pm-communication-plan-sample
---

# Edit Result

## 1. 実施内容

- kata のレビューの段 R2（構成）を実施した。章の順・数・必須と任意の別、各章の「表の前の 1 文、表、未決事項の箇条書き」の配置は、rulebook の本文構成と template に沿っており、章の移動・分割・統合は不要と確認した。
- 表の行の順を 2 か所並べ替え、前提から結論の順（時系列、判断条件の順）に読めるようにした。
- grade の F001（`vp-ux-language-consistency`、RACI の参照先が不明）は R3 の観点のため、この段では直していない。R3 で扱う。
- 検証では、executor の `npx prettier --check` と runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。その他の検査は変更種別により `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-communication-plan-sample.md`: 表の行を 2 か所並べ替えた（2 行追加・2 行削除）。コミュニケーション機会の表では、`STH-TECH-MENTOR` との設計相談の行を実装結果の報告の行の前へ移し、時系列の流れが逆転しないようにした。エスカレーションの表では、範囲・上限・試用日の基準を変える要求の行を先頭へ移し、rulebook の記述ガイドが挙げる判断条件の順に近づけた。章構成と文言は変えていない。

## 3. 申し送り

- R2-3 は要判断。エスカレーションの表で範囲変更の行を先頭へ移した。rulebook の記述ガイドの列挙は「など」付きの例示で、順を決めた規定ではない。選ばなかった案は、元の順（個別の判定不能、費用、品質、公開、包括的な基準変更）のまま残すこと。
- F001（「エスカレーションの判断者」の行の RACI の参照先が不明）は未解消。R3 で RACI の参照先（管理計画の RACI など）を示すか、「エスカレーションの判断者」だけにそろえる。
- No: R2-1 / 段: R2 / 箇所: 全体（方針と適用範囲〜見直し条件と未決事項） / 指摘: 章の順・数・必須と任意の別が rulebook の本文構成（標準テンプレ）と一致し、各章の「表の前の 1 文、表、未決事項の箇条書き」の配置も template と同じ。章の移動・分割・統合は要らない / 直した案: - / 根拠: `vp-arc-document-structure`、specdojo:pm-communication-plan-rulebook の本文構成（標準テンプレ）、specdojo:pm-communication-plan-template / 印: -
- No: R2-2 / 段: R2 / 箇所: コミュニケーション機会 / 指摘: 「設計方針の確定まで週1回」の `STH-TECH-MENTOR` との設計相談が、その後に来る「Pull Request の作成時」の実装結果の報告より後ろにあり、時系列（準備 → 設計 → 実装 → 試用 → 試用後）の流れが途中で逆になる / 直した案: 設計相談の行を、実装結果の報告の行の前へ移した / 根拠: `vp-arc-document-structure`（前提から結論の順） / 印: -
- No: R2-3 / 段: R2 / 箇所: エスカレーション / 指摘: 「範囲・上限・試用日の基準を変える要求」（目的・スコープ）が最後の行にあり、rulebook の記述ガイドが判断条件を挙げる順（目的・スコープ、当事者価値、費用・負荷、品質・安全、公開・権利）と合わない / 直した案: 範囲変更の行を表の先頭へ移した / 根拠: `vp-arc-document-structure`、specdojo:pm-communication-plan-rulebook の記述ガイドの「エスカレーション」。迷った理由: 記述ガイドの列挙は「など」付きの例示で、順を決めた規定ではない。選ばなかった案は、元の順（個別の判定不能 → 費用 → 品質 → 公開 → 包括的な基準変更）のまま残すこと / 印: 要判断
- No: R2-4 / 段: R2 / 箇所: 見直し条件と未決事項の表「エスカレーションの判断者」の行 / 指摘: grade の F001（`vp-ux-language-consistency`。RACI が本書内で定義・参照されず、何を指すか読めない）は R3 の観点のため、この段では直さず R3 に回す。R1 の扱いと同じ / 直した案: - / 根拠: kata-guide の kata の観点の組（R3 に `vp-ux-language-consistency`）。R3 で RACI の参照先を示すか、「エスカレーションの判断者」だけにそろえる / 印: -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/pm-communication-plan-sample.md のみで、plan・result・個票などの履歴蓄積ファイルを変更していないため）

## 4. 進め方と実践の型の適用

根拠としたのは kata-guide の R2（構成）の定義、`vp-arc-document-structure` の観点、specdojo:pm-communication-plan-rulebook の本文構成（標準テンプレ）と記述ガイド、specdojo:pm-communication-plan-template である。 維持した記述: 章の順・数・必須と任意の別、各章の配置は rulebook と template に一致していたため、そのまま維持した（R2-1）。 改訂した記述: コミュニケーション機会の設計相談の行を前へ移した（R2-2）。エスカレーションの範囲変更の行を先頭へ移した（R2-3）。R2-3 は規定ではなく例示に基づく判断のため「要判断」とした。 F001 は `vp-ux-language-consistency` の指摘で、kata-guide の組では R3 の観点に当たる。この段では直さず、理由と次のアクション（R3 で参照先を示すか表現をそろえる）を残した。R1 の扱いと同じである。grade result サイドカーは直接編集していない。 rulebook など sample 以外は変更していない。frontmatter の `status` も変更していない。
