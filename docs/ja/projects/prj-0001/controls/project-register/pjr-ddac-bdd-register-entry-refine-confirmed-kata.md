---
specdojo:
  id: prj-0001:pjr-ddac-bdd-register-entry-refine-confirmed-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T13:13:54Z"
  derived_from:
    - PJR-2GD6
    - PJR-T88P
  autopilot: approved
  approach: fully-guided
  targets:
    - prj-0001:bdd-register-entry
---

# PJR-DDAC 代表の bdd-register-entry を、確定した型で磨き込む

## 1. 概要

business-specs-kata で確定した型（specdojo:bdd-rulebook と sample）に合わせて、代表の bdd-register-entry を磨き込み、冗長さを整理する。review は schedule の review の段で流す

## 2. 入力

- 型一式の確定（2026-11-10、indie が決定）の後に、代表を磨き込みから流し直す。schedule の磨き込み・condense の段はゲートで bes・br・clis の段まで巻き戻すことになるため、register の todo で行う（orchestrator の判断、indie に報告）。
- 夜間の register の routine で流す（indie が承認）。review は T-BUSINESS-SPECS-REPS-bdd-register-entry-090 を reopen 済みで、6:00 の exec cycle で流す。

## 3. 完了条件

- 代表の [[prj-0001:bdd-register-entry]] を、確定した型 [[specdojo:bdd-rulebook]] と [[specdojo:bdd-sample]] に合わせて磨き込んでいる。型の本文要件の章立て・必須の項目・記述ガイドの判断の基準に沿い、型が禁止することを書いていない。
- 冗長さを整理している（判断に要る背景・制約・例外と意味は保ち、新しい内容を足さない）。
- 実装・schema・リファレンスと同じことを書かず、正本を参照する方針（PJR-2GD6）を保っている。
- 決められない点は `_UNDECIDED_` か `_ASSUMPTION_` のまま、理由（どの成果物がない、誰の判断が要る）を書いて残してよい。依存の成果物がないことを理由に未完了としない。
- これまでの review の指摘のうち、確定した型の範囲で直せるものを直し、直さないものは理由を個票の対応結果に書いている。
- 型と、ほかの成果物とカタログを変えていない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`specdojo catalog validate --project prj-0001` が通っている。

## 4. 作業内容

| No  | 作業                               | 担当     | 状態 | メモ                                        |
| --- | ---------------------------------- | -------- | ---- | ------------------------------------------- |
| 1   | 確定した型と代表の文書を読み比べる | executor | done | rulebook・sample・既存 BDD を確認           |
| 2   | 磨き込みと冗長さの整理を行う       | executor | done | 正本への参照と業務注釈を整理                |
| 3   | 検査を流し、対応結果に書く         | executor | done | executor 検査を記録、親検証は runner が追記 |

## 5. 対応結果

### 5.1. 実施内容と変更ファイル

- [[prj-0001:bdd-register-entry|業務データ辞書（登録項目個票）]] のエンティティ説明と `item_type`・`item_status`・`registered_at`・`completed_at` の注釈を整理した。
- 本個票に変更根拠、検査、判断と申し送りを記録した。

### 5.2. 進め方と実践の型の適用

- [[specdojo:bdd-rulebook|業務データ辞書 作成ルール]] の本文要件と記述ガイドを構造・責務の基準にし、[[specdojo:bdd-sample|業務データ辞書（駄菓子屋の販売管理）]] は参照型エンティティの説明と詳細列挙の形式に限って参照した。既存の単一エンティティと `schema_ref` による構成を採用した。recipe と template は型で `not-needed` とされている。
- [[prj-0001:prj-overview|プロジェクト概要]] の判断・知識の共有と引き継ぎの方針に照らし、管理境界、担当、未設定の意味、承認範囲などの業務判断に使う注釈を残した。既存の `owners: [BA]` と rulebook の主作成者の責務を記述の視点とした。
- executor の判断で、状態遷移と承認条件の参照をエンティティ説明へ集約した。`item_type` の分類別終端と `completed_at` の延期・再開時の更新規則は、その参照に委ねた。`item_status` に重複していた正本参照を削除し、状態値と業務ラベルの対応を保持した。これは rulebook 6.2・6.4・7 と共通規約の `vp-arc-conciseness` に従う整理である。
- `registered_at`・`completed_at` の UTC・RFC 3339・秒精度の指定は物理形式の正本に委ねた。一覧の登録日・完了日へのタイムゾーン変換はエンティティ説明の導出値の説明へ統合した。登録時点と着手時点の区別、完了日時の業務的意味を保持した。
- `docs/specdojo/schemas/v1/bdd.schema.yaml` を構造検証の正本として読み、`src/register/register.ts` を読み取り専用で参照した。後者では `RegisterAddFields` の日時と期限の区別、`planRegisterItem` の ID 競合検出、派生ビューの再生成入口を確認した。実装から新しい業務判断は追加していない。
- 共通の実行規約 2 文書、運用メモ、`package.json`、`.specdojo/specdojo.config.json`、`lefthook.yml`、Prettier 設定と除外設定、共通観点の `vp-arc-conciseness` を手順・検査のために確認した。対象本文に `_CONTEXT_:` はない。
- plan に展開された finding は「なし」である。過去 review の本文と参照先の登録項目スキーマ・状態定義・登録簿ルール・用語集・CCD は、plan の参照範囲に宣言されていないため追加参照を見送った。既存の参照・物理名・キー・許容値・用語 ID を保持し、根拠のない値の追加や置換を見送った。

### 5.3. 照合結果と申し送り

- 参照型のため、スタンドアロン用の型・単位・制約の照合は非適用。フィールドに `type`・`constraints` の再掲がないこと、キーが `id` の注釈に対応することを確認した。既存の詳細列挙 6 項目（`status`・`item_type`・`item_status`・`priority`・`difficulty`・`autopilot`）は一方式で空値と値の重複がなく、各値に業務ラベルがある。編集前後の YAML を Node.js で比較し、26 フィールドと説明文以外の全データの一致も確認した。
- `_UNDECIDED_` として、参照先スキーマの実在項目・キー・全 enum と注釈の対応、用語 ID と用語集・CCD の整合、状態定義に委ねた規則の正本との照合を残す。これらの正本本文は本 plan の参照範囲外であり、`src/register/register.ts` も多くの定義を別モジュールから取り込む入口である。後続 review で参照元を宣言したうえで BA・ARC・DEV・QE が照合する必要がある。
- 過去 review の個別指摘の解消判定も、指摘本文が本 plan に展開されていないため後続の T-BUSINESS-SPECS-REPS-bdd-register-entry-090 で照合する。今回の対応範囲は確定した型に基づく上記の整理である。

### 5.4. 検査

- 以下の executor 検査は終了コード 0。対象は本個票と BDD、全体を検証するコマンドは prj-0001 またはリポジトリ全体である。
  - `npx --no-install prettier --write docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml docs/ja/projects/prj-0001/controls/project-register/pjr-ddac-bdd-register-entry-refine-confirmed-kata.md`
  - `npx --no-install prettier --check docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml docs/ja/projects/prj-0001/controls/project-register/pjr-ddac-bdd-register-entry-refine-confirmed-kata.md`
  - `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/bdd.schema.yaml --data docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml`
  - `node packages/docs-lint/bin/specdojo-docs-lint.js yaml-schema --modeline docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml`
  - `node --import tsx src/specdojo.ts catalog validate --project prj-0001`
  - `npm run validate:history-links`
  - `node --import tsx src/specdojo.ts register build --project prj-0001`
  - `git diff --check`
- カタログ検証は再エクスポートだけの実装エビデンスと未作成文書に関する警告を出して成功した。警告の対象は後続の orchestrator への申し送りとする。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を含む指定の親検証は runner が実行し、結果を evidence へ追記する。

### 5.5. CHANGELOG に書く事項

なし

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]、[[prj-0001:pjr-t88p-business-specs-kata]]
- 対象: [[prj-0001:bdd-register-entry]]
- 型: [[specdojo:bdd-rulebook]]
