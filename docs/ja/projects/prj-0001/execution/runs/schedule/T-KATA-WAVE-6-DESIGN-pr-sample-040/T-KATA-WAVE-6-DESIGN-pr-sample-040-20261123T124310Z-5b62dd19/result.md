---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-pr-sample-040-20261123t124310z-5b62dd19
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-pr-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-pr-sample-040/T-KATA-WAVE-6-DESIGN-pr-sample-040-20261123T124310Z-5b62dd19/plan.md
  started_at: "2026-11-23T12:43:19.163Z"
  completed_at: "2026-11-23T12:58:52.752Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:pr-sample
    - specdojo:pr-rulebook
---

# Edit Result

## 1. 実施内容

- 進捗報告の `rulebook` である `docs/ja/specdojo/rulebooks/pr-rulebook.md` を更新しました。
- grade の指摘事項（F001〜F029）に基づき、内容の具体化、表の列定義、および `PJR-76N9` に基づく役割の扱いの適正化を行いました。
- 「誰が判断するか」という役割の割り当てに関する記述を削り、判断事項を `question` や `decision` の個票 ID で追跡する形式に改めました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pr-rulebook.md`: grade の指摘に対応するため、報告の目的、想定読者、報告周期（週次または期間終了から 2 営業日以内）、および表の具体的な列定義（リスク・課題における 区分・影響度・対応方針、次期予定における 担当・期日）を追記しました。また、担当を Role code で記述するルールや、判断事項を個票の ID で管理する運用を定め、`status: ready` の条件を明確にしました。

## 3. 申し送り

- pr-sample は新しい rulebook と食い違う: 根拠 ID が独自の `task-042` / `doc-018` 、進み具合が「進捗60%」の割合だけ（F022）、担当が「店主」「業務担当」で Role code でない、リスク・課題の表に `個票 ID` 列がない、次期予定の列名「担当者」は rulebook では「担当」。後続の段で sample を合わせる。
- 報告周期を「適用先のコミュニケーション計画に従い、定めがなければ週次」、`ready` の期限を「期間終了から 2 営業日以内」と既定値で定めた（F005・F028）。既定値が妥当か確認が必要。
- F002・F011・F029（承認者・読み手・作成責任者の明示）は PJR-76N9 に従い、役割の割り当てを本文で求めない形で対応した。判断待ちは `question` / `decision` の個票 ID で示し、役割はメンバー定義の Role code に委ねる。F004 は公開範囲の規定を設けず、個人名・顧客情報・認証情報の記載禁止で対応した。
- F015（`npm run lint:md` など検証コマンドの記載）は、リポジトリの検証を共通の運用として扱う方針のため rulebook 本文には加えていない。
- pr-sample は新しい rulebook と食い違う: 根拠 ID が独自の `task-042` / `doc-018`、進み具合が「進捗60%」の割合だけ（F022）、担当が「店主」「業務担当」で Role code でない、リスク・課題の表に `個票 ID` 列がない、次期予定の列名「担当者」は rulebook では「担当」。後続の段で sample を合わせる。
- F015（npm run lint:md など検証コマンドの記載）は、リポジトリの検証を共通の運用として扱う方針のため rulebook 本文には加えていない。

## 4. 進め方と実践の型の適用

grade の指摘事項を `rulebook` に反映させ、成果物（`pr-sample.md`）の記述基準を整えました。特に役割の割り当てに関する記述を `PJR-76N9` に沿って整理し、判断の追跡方法を個票の ID 参照に集約しました。
