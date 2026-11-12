---
specdojo:
  id: prj-0001:pjr-ebn6-glossary-everyday-terms
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-12T13:29:28Z"
  derived_from:
    - PJR-6XQ4
  commit_type: docs
  commit_scope: glossary
---

# PJR-EBN6 用語集の見出しを利用者が目にする言い方に寄せ、登録簿の操作の語をまとめる

## 1. 概要

6 件の用語集の見出しを、ガイドと CLI で実際に使う言い方に合わせ、gl-register の操作の語を 1 語にまとめる

## 2. 入力

- 用語集の確定の段の前の確認で、claim を「着手宣言」、release を「着手解放」、reporter を「実行報告者」のように硬く言い換えていること、gl-register が登録簿の操作を 1 語ずつ立てて語数が多いことを orchestrator が挙げ、indie が直すことを承認した（2026-11-12）

## 3. 完了条件

- 対象は `docs/ja/product/010-business-specs/060-glossary/` の 6 件（`gl-common`・`gl-register`・`gl-planning`・`gl-execution`・`gl-quality`・`gl-setup`）。
- 用語の見出し（`term`）を、利用者がガイド・CLI の表示・コマンド名で実際に目にする言い方に合わせている。
  - ガイドや CLI が英語のまま使う語（claim・release・worktree・executor・reporter・epic・grade など）は、その語を見出しにし、日本語の言い換えは `aliases` に置く。
  - 日本語で通じている語（登録簿・成果物・完了条件など）は今のままにする。文書で使われていない硬い造語（「着手宣言」「着手解放」「実行報告者」など）を見出しに残さない。
  - [[specdojo:gl-rulebook]] の「用語は業務用語（日本語）で記述する」との関係を、SpecDojo の利用者が業務で使う言葉に合わせる、という解釈で個票の対応結果に書く。
- `gl-register` の登録簿の操作（着手・待機・審査提出・終了・却下・延期・再開・更新など）を、1 語（登録簿の操作）にまとめ、各操作と対応するコマンド（`register start` など）を `notes` に一覧で示している。処理状態（起票済み〜延期）は、ほかの文書が状態の名前として使うため 1 語ずつ残す。
- 用語 ID（`tm-...`）は変えない。まとめて消す用語の ID が、用語集の外（`bdd-register-entry.yaml`・`bdd-sample.yaml`・rulebook・standard など）から参照されていないことを確かめ、参照されているものは消さずに残す。
- 用語の定義の意味と、schema の条件付きの決まりを用語の関係として書く方針（カタログの完了条件）は保つ。用語集どうしで同じ用語を定義しない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run validate:schema`・`npm run lint:md` と親の検証が通っている。grade は統合の後に orchestrator が流す。grade を流せないことを理由に未完了としない。

## 4. 作業内容

| No  | 作業                                     | 担当         | 状態 | メモ                                   |
| --- | ---------------------------------------- | ------------ | ---- | -------------------------------------- |
| 1   | 見出しを直し、登録簿の操作の語をまとめる | executor     | done | 6 件の見出しを整理し、操作の一覧を集約 |
| 2   | 統合の後に 6 件の grade を流す           | orchestrator | open | -                                      |
| 3   | 確定の段（`T-GLOSSARY-*-140`）           | indie        | open | -                                      |

## 5. 対応結果

### 5.1. 実施内容

- 6 件の用語集で 60 語の `term` を、ガイド・CLI の呼び名へ変更した。既存 ID と定義の意味を保ち、旧見出しは `aliases` に残した。登録簿・成果物・完了条件・起票・記帳、登録項目の処理状態など、日本語で使われる見出しは維持した。
- 共通は rulebook・recipe・sample・template、routine・Job、plan・result・event・evidence・trial・grade・finding、計画は track・scope・intent・approach・ゲート、実行は claim・release・worktree・runner・executor・reporter・pipeline など、品質は review、導入と設定は init・provider・nickname・effort・capabilities・proficiency などに揃えた。
- [[gl-register|用語集（登録簿）]] に「登録簿の操作」（`tm-register-operation`）を追加し、着手・待機・審査提出・終了・却下・延期・再開・更新のコマンドと要点を `notes` に集約した。外部参照のない 6 操作の個別定義を削除し、内部の `relatedTerms` は集約先へ接続した。起票済みから延期までの 8 状態は ID・見出し・定義を維持した。

### 5.2. 判断と根拠

- [[specdojo:gl-rulebook|用語集 作成ルール]] の「用語は業務用語（日本語）で記述する」は、SpecDojo の利用者が業務で使う言葉に合わせる趣旨と解釈した。日本語の定義を保ち、英語で定着している呼び名を無理に訳さない。根拠は [[specdojo:kata-guide|実践の型活用ガイド]]、[[specdojo:register-operation-guide|登録簿運用ガイド]]、[[specdojo:exec-operation-guide|exec運用ガイド]]、[[specdojo:schedule-design-guide|Schedule設計ガイド]]、[[specdojo:review-guide|レビューガイド]]、[[specdojo:exec-config-guide|exec設定ガイド]] と CLI のコマンド宣言である。
- 登録項目の分類は、登録簿運用ガイドの type 一覧と `--type` の値に揃えて todo・epic・question・risk・issue・change-request・decision・note とした。日本語名は別名に残し、分類と処理状態を区別した。
- 用語集外の ID を検索したところ、`tm-register-wait` は `T-GLOSSARY-gl-register-080`、`tm-register-update` は `T-GLOSSARY-gl-register-070`・`090` の過去の result・証跡から参照されていた。完了条件の「参照されているものは消さずに残す」を履歴にも適用し、この 2 ID は集約先の分類に属する個別操作として保持した。したがって総称 1 語と参照維持用の 2 語が残る。
- 削除した ID は `tm-register-start`・`tm-register-submit-review`・`tm-register-close`・`tm-register-reject`・`tm-register-defer`・`tm-register-reopen`。BDD（`bdd-register-entry.yaml`・`bdd-sample.yaml`）、rulebook・standard、ソース・テスト・配布テンプレート・実行履歴を含む検索で、用語集外の参照がないことを確認した。既存 ID を別の意味に使い回さず、総称には新しい ID を採番した。
- 定義を重複させず、領域別の正本を維持した。状態・種類による条件の説明、人間の承認、schema を正本として参照する方針は維持した。`register update` の分類変更引数に関する既知の差異は今回判断せず、既存の定義を保持した。PO・ARC が意図と承認根拠を確認し、文書または CLI の対応を別途判断する。

### 5.3. 検証と後続作業

- 対象 7 ファイルの Prettier 整形、6 用語集の個別 schema 検査、カタログ検査、履歴リンク検査、hook で指定された登録簿の派生ビュー再生成、差分検査は通過した。カタログ検査には対象外の実装参照・未作成文書に関する既存の警告がある。用語の整合性確認では、60 見出しの変更、172 既存 ID の保持、旧称・別名の保持、定義の意味・メタデータ・8 状態の維持、内部参照と用語集間の見出し重複がないことを確認した。検証の詳細は executor evidence に記録する。
- `npm run validate:schema`・`npm run lint:md` を含む指定済みの検証は、executor 終了後に親 runner が実行する。
- 統合後の 6 件の grade は orchestrator、確定の段（`T-GLOSSARY-*-140`）は indie が実施する。成果物の `status`、個票の `item_status` と登録簿一覧は変更しない。result への記入は reporter・runner へ引き継ぐ。

### 5.4. CHANGELOG に書く事項

- 区分: 変更
- 文案: 用語集の見出しをガイド・CLI で使う呼び名に揃え、日本語の旧称を別名として保持。登録簿の操作と対応コマンドを「登録簿の操作」に集約し、外部参照のある操作 ID と処理状態の個別定義は維持した。

## 6. 関連ドキュメント

- [[prj-0001:pjr-6xq4-glossary]]
- [[specdojo:gl-rulebook]]
