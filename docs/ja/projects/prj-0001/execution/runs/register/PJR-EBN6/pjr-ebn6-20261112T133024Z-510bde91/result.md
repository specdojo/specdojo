---
specdojo:
  id: prj-0001:xer-pjr-ebn6-20261112t133024z-510bde91
  type: exec-result
  task_id: PJR-EBN6
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-EBN6/pjr-ebn6-20261112T133024Z-510bde91/plan.md
  started_at: "2026-11-12T13:30:24.993Z"
  completed_at: "2026-11-12T13:48:42.560Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 6 件の用語集の見出しを利用者が実際に使用する呼び名（ガイドや CLI の表現）に変更し、日本語の名称は `aliases` として保持しました。
- 用語集の分類をガイドの `type` 一覧および CLI の値に合わせました。
- 登録簿の操作に関する定義を `tm-register-operation` に集約し、外部参照のある操作や状態の定義は維持しつつ、その他の操作とコマンド情報を `notes` に集約しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml`: 用語集の見出しと分類の更新。
- `docs/ja/product/010-business-specs/060-glossary/gl-execution.yaml`: 用語集の見出しと分類の更新。
- `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml`: 用語集の見出しと分類の更新。
- `docs/ja/product/010-business-specs/060-glossary/gl-quality.yaml`: 用語集の見出しと分類の更新。
- `docs/ja/product/010-business-specs/060-glossary/gl-register.yaml`: 用語集の見出しと分類の更新、および登録簿の操作の集約。
- `docs/ja/product/010-business-specs/060-glossary/gl-setup.yaml`: 用語集の見出しと分類の更新。

## 3. 申し送り

- 変更ファイル: docs/ja/product/010-business-specs/060-glossary/gl-common.yaml、gl-register.yaml、gl-planning.yaml、gl-execution.yaml、gl-quality.yaml、gl-setup.yaml、および docs/ja/projects/prj-0001/controls/project-register/pjr-ebn6-glossary-everyday-terms.md。result は pipeline 指示に従い編集していない。
- 判断: gl-rulebook の業務用語の方針を、SpecDojo 利用者が業務で使う言葉に合わせる趣旨と解釈した。ガイド・CLI で使う英語の呼び名を見出しにし、日本語の旧称を aliases に保持した。登録項目の分類もガイドの type 一覧と CLI の値に揃えた。詳細は個票5.2節に記録済み。
- 登録簿の操作には新しい tm-register-operation を追加した。外部参照のない6操作を統合し、8操作のコマンドと要点を notes に掲載した。過去の result・証跡から参照される tm-register-wait と tm-register-update は、完了条件の参照維持規定を履歴にも適用して保持した。既存172 ID、8状態、定義の意味と schema を正本とする方針を維持した。
- 既知の差異: register update の定義は分類変更を含むが、CLI に分類変更引数がない。今回の見出し整理では既存定義を保持した。PO・ARC が意図と承認根拠を確認し、文書または CLI の対応を別途判断する。
- CHANGELOG に書く事項（変更）: 用語集の見出しをガイド・CLI で使う呼び名に揃え、日本語の旧称を別名として保持。登録簿の操作と対応コマンドを「登録簿の操作」に集約し、外部参照のある操作 ID と処理状態の個別定義は維持した。個票5.4節にも記録済み。
- 指定済みの親検証は runner が実行する。統合後に orchestrator が6件の grade を流し、indie が確定の段を実施する。reporter・runner は本報告を result へ反映する。

## 4. 進め方

用語集の「見出し」が実態（ガイドや CLI）と乖離している問題を解消するため、まず各 `gl-*.yaml` ファイルの内容を調査しました。次に、各用語の見出しを利用者が直感的に理解できる英語表記へ、日本語の名称は `aliases` フィールドへ移行しました。また、`gl-register.yaml` において、細分化されていた登録簿操作の定義を一つの操作 `tm-register-operation` に集約し、コマンドの要約を `notes` に記述する構造変更を行いました。この際、既存の ID や状態定義、外部参照との整合性が崩れないよう、慎重に定義を維持しています。
