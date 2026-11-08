---
specdojo:
  id: prj-0001:pjr-0ynq-uis-kata-reference-to-command-reference
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T04:00:16Z"
  derived_from:
    - PJR-2GD6
  approach: rulebook-maintenance
  targets:
    - specdojo:uis-rulebook
---

# PJR-0YNQ 画面仕様（uis）の型を、コマンドリファレンスと同じことを書かない形に手入れする

## 1. 概要

画面仕様の型を手入れする。CLI のコマンド群を画面に見立てる uis で、引数・オプションの表は持たずコマンドリファレンスを参照し、利用目的・操作の流れ・表示・エラー表示の要点に絞る

## 2. 入力

- uis も実装と同じことを書かない対象に加える（indie が推奨どおりと決定、2026-11-08）。
- rulebook にあわせて uis-sample も揃える。

## 3. 完了条件

- [[specdojo:uis-rulebook]] に、次の規則を書いている。
  - CLI のコマンド群を画面に見立てる uis では、引数・オプションの表や使い方の詳細は書かず、コマンドリファレンスを参照する。
  - 文書には、利用目的・操作の流れ（どのコマンドからどのコマンドへ進むか）・表示される項目の要点・エラー表示と利用者の次の手を書く。
- `uis-sample` を新しい規則に合わせている。
- 型の変更に合わせて schema を変える必要があれば変え、今の形の文書も検査を通る（後方互換）。変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている（PJR-RMMM で人が判断する材料にする）。
- 成果物の文書とカタログ、ほかの種類の型を変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の `### CHANGELOG に書く事項` の節に、区分（追加・変更・不具合修正など）と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                                           | 担当     | 状態 | メモ                                                                |
| --- | ------------------------------------------------------------------------------ | -------- | ---- | ------------------------------------------------------------------- |
| 1   | 今の rulebook と uis-sample を読み、コマンドリファレンスと重なる記述を洗い出す | executor | done | 引数・オプション表の再掲や finding（F001〜F005）の課題を整理        |
| 2   | rulebook に参照の規則を書き、uis-sample を揃える                               | executor | done | コマンドリファレンス参照の規則策定と販売業務 CLI 完成サンプルの整備 |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                                     | executor | done | 全検査通過、schema 要否・決定事項・CHANGELOG 文案・残課題を記録完了 |

## 5. 対応結果

### 5.1. 実施内容

1. **rulebook の手入れ（`specdojo:uis-rulebook`）**:
   - CLI のコマンド群を画面に見立てる uis（CUI/CLI）において、引数・オプションの表や使い方の詳細は持たず、正本であるコマンドリファレンスを参照する規則を明記した。
   - 仕様書には「利用目的」「操作の流れ（どのコマンドからどのコマンドへ進むか）」「表示される項目の要点」「エラー表示と利用者の次の手」に絞って記述する本文要件・記述ガイド・禁止事項を整備した。
   - `rulebook-authoring-standard` に準拠した標準構成（全9章）に再編し、plan に展開された 5 件の finding（F001〜F005）をすべて解消した（`type` の `ui` 固定、Frontmatter への `part_of` 定義表追加、タイトル H1 への配置、完成例 sample 外出しの運用ルール等）。
2. **sample の整備（`specdojo:uis-sample`）**:
   - 新しい規則に従い、駄菓子屋きぬやの販売管理システムにおける販売業務 CLI コマンド群を題材とした完成サンプルを作成した。
   - 正本リファレンス参照、標準操作フロー（販売開始〜明細追加〜合計確認〜会計完了）、出力表示要点、状態遷移、バリデーション、およびエラー発生時の「利用者の次の手（回復アクション）」を網羅した構成とした。
3. **CHANGELOG 文案の作成**:
   - 追加完了条件に従い `CHANGELOG.md` 自体は編集せず、利用者に影響する変更内容を「5.5. CHANGELOG に書く事項」に区分と文案で記録した。

### 5.2. 成果物

- [[specdojo:uis-rulebook]]: `docs/ja/specdojo/rulebooks/uis-rulebook.md`
- [[specdojo:uis-sample]]: `docs/ja/specdojo/samples/uis-sample.md`
- 個票: `docs/ja/projects/prj-0001/controls/project-register/pjr-0ynq-uis-kata-reference-to-command-reference.md`

### 5.3. スキーマ（schema）変更の要否と理由

- **スキーマ変更なし**: 画面仕様（uis）は Markdown 文書（`target_format: markdown`）形式であり、`docs/specdojo/schemas/v1/` に専用の YAML/JSON スキーマや本文スキーマは存在しない。Frontmatter は共通の `deliverable-frontmatter.schema.yaml`（`type: ui`）および `rulebook-frontmatter.schema.yaml` で検証され、後方互換性にも影響はない。

### 5.4. 規則と sample の書き方で executor が決めた内容と理由（PJR-RMMM への判断材料）

1. **`recipe` と `template` の要否**:
   - 決定: Frontmatter で `recipe: not-needed`、`template: not-needed` と決定した。
   - 理由: 画面仕様（uis）は Markdown 形式であり、rulebook の本文要件・記述ガイドおよび sample（`uis-sample.md`）によって必要な構成・記述ルールが十分に網羅されているため。独立した recipe やテンプレートを別途維持するよりも rulebook と sample の 2 点で統制する方が保守性と一貫性が高いため。
2. **CLI コマンド群画面仕様における章構成**:
   - 決定: GUI 画面仕様と CLI コマンド群画面仕様で別文書種別（または別 rulebook）に分割せず、同一の `uis` 型の中で「操作の流れ」および「エラー表示と利用者の次の手」を必須見出しとして共通化し、操作の表内でコマンドリファレンスを参照する形式とした。
   - 理由: GUI 画面におけるボタン操作や画面遷移と、CLI におけるコマンド実行と操作フロー・状態遷移は概念的に同等であり、共通の章立て（全9節）を適用することで学習コストとレビュー観点を統一できるため。
3. **エラー表示における「利用者の次の手」の必須化**:
   - 決定: 単なるエラーメッセージ文字列の例示にとどまらず、状況打開・業務継続のために「利用者が次に取るべき具体的な回復アクション」を表の必須列として規定した。
   - 理由: CLI や UI においてユーザーが遭遇するエラーからの復帰手順が定義されていなければ、業務の継続性が担保できず、QE の例外系テスト設計や DEV のハンドリング実装の根拠としても不十分となるため。

### 5.5. CHANGELOG に書く事項

- **区分**: 変更
- **行の文案**:
  - 画面仕様（uis）の型を見直し、CLI コマンド群を画面に見立てる場合に引数・オプションの表を持たずコマンドリファレンスを参照する規則と、操作の流れ・表示要点・利用者の次の手を書く構成に改定（`specdojo:uis-rulebook`, `specdojo:uis-sample`）

### 5.6. 残課題

- 本タスクではプロダクト成果物（`docs/ja/product/` 配下）の作成・変更は行わない制約に従い、`docs/ja/product/010-business-specs/040-user-interface-model/uis-exec-commands.md` などの実成果物は作成していない。後続の確認・型確定タスク（[[prj-0001:pjr-rmmm-uis-kata-confirm]]）およびプロダクト側のタスクで、新規則に基づいた画面仕様成果物の整備を行う。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[specdojo:uis-rulebook]]
- 後続: [[prj-0001:pjr-rmmm-uis-kata-confirm]]
