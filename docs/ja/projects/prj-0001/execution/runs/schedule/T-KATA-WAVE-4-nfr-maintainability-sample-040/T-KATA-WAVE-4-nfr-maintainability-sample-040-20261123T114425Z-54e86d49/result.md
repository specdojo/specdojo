---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-maintainability-sample-040-20261123t114425z-54e86d49
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-maintainability-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-maintainability-sample-040/T-KATA-WAVE-4-nfr-maintainability-sample-040-20261123T114425Z-54e86d49/plan.md
  started_at: "2026-11-23T11:44:33.804Z"
  completed_at: "2026-11-23T12:00:34.608Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-maintainability-sample
    - specdojo:nfr-maintainability-rulebook
---

# Edit Result

## 1. 実施内容

- nfr-maintainability-rulebook を簡潔に整えた。
- grade の指摘 21 件のうち 18 件を rulebook 内で解消した（F001-F007, F009-F011, F013, F014, F016-F018, F020, F021）。
- F002 および F019 については、`recipe`・`template` の要否判断と sample の書き直しについて未解決事項として PJR（登録簿の個票）で追う必要があることを明記した。
- F008 については、保守作業を担う役割（Role code）の記載のみを取り入れ、閾値の合意者を記載する要件は PJR-76N9 に基づき見送った。
- F012 については、リポジトリの検証（`lint`）に委ねる方針と重複するため、見送った。
- F015 については、sample 側の構成不備として、この段の対象外として申し送った。
- サンプル章を削除し、章名を本文の要件に合わせ、記述ガイドに判断の基準と「良い例・悪い例」を追加した。
- sample・recipe・template は変更していない。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-maintainability-rulebook.md`: rulebook の章構成を整理し、サンプル章を削除した。導入文に保守性要件を定める目的と利用先を追記し、記述ガイドに「適用範囲・前提条件」や「測定・検証方法」の具体的な指示を追加した。また、測定・検証における判定者の表記を Role code に統一し、記述ガイドに判断基準となる「良い例・悪い例」を添えた。あわせて、`recipe` および `template` が未決定（`undecided`）であること、および sample の改訂が必要であることを未解決事項として記載した。

## 3. 申し送り

- F015/F019: sample `docs/ja/specdojo/samples/nfr-maintainability-sample.md` が旧構成のままで、rulebook の本文要件（5 章、保守性要件一覧の 5 列、測定・検証方法の列 `要件ID` / `測定方法` / `判定タイミング` / `判定者`）に沿っていない。sample の段で書き直す。判定者は Role code にし、基準に集計方法と集計期間を付け、利用者が決める値は `_UNDECIDED_` で残し、概要に店主不在時の運用などプロジェクトの目的との対応を書く。
- F002/F019: `recipe`・`template` の要否判断と sample の書き直しを登録簿の個票で追う必要がある（この段では登録簿を編集していないため個票は未作成）。解消条件の案: sample が本文要件に沿い、NFR 分冊共通の template にできるかを判断した時点で `recipe`・`template` の宣言を更新する。
- F008 は保守作業を担う役割（Role code）の記載だけを取り入れた。閾値の合意者を書かせる部分は PJR-76N9 により見送った。
- F012 は見送った。整形・lint の扱いは全体方針の「共通の運用」でリポジトリの検証に任せており、検証コマンドを書き足すと正本の繰り返しになるため。
- 記述ガイドの良い例で判定者に使った `OPS` は `pm-review-viewpoints.yaml` にある Role code。プロジェクトのメンバー定義との整合は確かめていない。
- F008 は保守作業を担う役割（Role code）の記載だけを取り入れた。閾値の合意者を書かせる部分は PJR-76N9（成果物の本文に承認の役割を求めない）により見送った。

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と成果物の `done_criteria` に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。docs/ja/specdojo/standards/rulebook-authoring-standard.md の章立てに従い、記述ガイドには章ごとの判断基準と良い例・悪い例を記述する。PJR-76N9 に従い、承認や留保の役割の割り当ては成果物の本文には求めず、個票で管理する。
