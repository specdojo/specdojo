---
specdojo:
  id: prj-0001:xer-pjr-jb6s-20261110t231324z-a9700f09
  type: exec-result
  task_id: PJR-JB6S
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-JB6S/pjr-jb6s-20261110T231324Z-a9700f09/plan.md
  started_at: "2026-11-10T23:13:26.766Z"
  completed_at: "2026-11-10T23:35:33.746Z"
  agent: sol-executor
  block_reason: "integrate failed: git merge failed: CONFLICT (content): Merge conflict in docs/ja/specdojo/rulebooks/uis-rulebook.md"
---

# Edit Result

## 1. 実施内容

- GUI のデザインのルールを定義するデザインシステム（DSS）の `rulebook` と `sample` を新設しました。
- 新しい設計の型として `dss-rulebook.md` と `dss-sample.md` を追加し、既存の設計体系（`uis-rulebook.md` や `sysd-index-rulebook.md`）と統合しました。
- 設計のリファレンス、命名標準、およびサイドバーの設定を更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`: 共通レビュー観点の更新。
- `docs/ja/specdojo/references/deliverables-reference.md`: 成果物リファレンスの更新。
- `docs/ja/specdojo/references/directory-layout-reference.md`: ディレクトリ配置リファレンスの更新。
- `docs/ja/specdojo/rulebooks/sysd-index-rulebook.md`: システム設計インデックスの更新。
- `docs/ja/specdojo/rulebooks/uis-rulebook.md`: UI 仕様（uis）の rulebook の更新。
- `docs/ja/specdojo/standards/id-and-file-naming-standard.md`: ID およびファイル命名標準の更新。
- `packages/docs-site/.vitepress/sidebar-config.ts`: ドキュメントサイトのサイドバー構成の更新。
- `docs/ja/specdojo/rulebooks/dss-rulebook.md`: 新設されたデザインシステム（DSS）の `rulebook`。
- `docs/ja/specdojo/samples/dss-sample.md`: 新設されたデザインシステム（DSS）の `sample`。

## 3. 申し送り

- CHANGELOG に書く事項（区分: 追加）: GUI の共通デザインを設計するデザインシステム（DSS）の rulebook と、駄菓子屋の販売管理 GUI の完成例を追加。デザイントークン、部品、レイアウトの型、状態表示、アクセシビリティを定義し、画面仕様・操作性要件・実装横断ルールとの分担と正本への参照方法を明確化。
- 個票の完了条件にある lint・単体テスト等は親 runner の検証へ、index の再生成も runner へ委ねる。result は reporter が記入する。保護設定の変更案、未決定事項はない。

## 4. 進め方

設計の新しい種類として、デザインのルール（色、文字、余白、部品、レイアウトの型、アクセシビリティ等）を扱うデザインシステム（DSS）の `rulebook` を定義しました。また、その適用例として `sample` を作成し、既存の `uis`（ワイヤーフレーム等）や `sysd`（システム設計）との関係性を明確にするために、各リファレンスやインデックス、サイドバー設定を更新して統合を行いました。
