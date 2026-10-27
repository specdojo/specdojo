---
specdojo:
  id: prj-0001:pjr-xsm8-sample-maintenance-target-kind
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-27T11:31:27Z"
  derived_from:
    - PJR-05GN
---

# PJR-XSM8 sample-maintenance の起票が sample の type 判定で止まる

## 1. 課題内容

`register add` / `update` の `sample-maintenance` は、対象の frontmatter の `type` が `sample` であることを求める。同梱の Markdown の sample 98 件のうち 93 件と YAML の sample 11 件は見本にする成果物の type（`project` など）を使うため、起票できない。sample の判定を命名（`*-sample`）に揃え、sample の `type` の原則を規約に定める。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/register/approach.ts` の保守の対象検証、sample の `type` を扱う standard・guide・reference・schema、`type: sample` の sample 5 件 |
| スケジュール | TSD の sample 2 件（`specdojo:tsd-sample`・`specdojo:tsd-index-sample`）の見直しの起票が本項目を待っている                             |
| コスト       | 判定の修正とテスト、文書 5〜6 件の追記、sample 5 件の frontmatter の修正                                                               |
| 品質         | ほぼすべての sample で `sample-maintenance` が使えない。sample の `type` の値がばらつき、規約で決まっていない                          |
| 関係者       | kata の保守を登録簿から流す利用者、sample を作成・保守する書き手                                                                       |

## 3. 対応方針

| 項目     | 内容                                                                                          |
| -------- | --------------------------------------------------------------------------------------------- |
| 原因     | `原因と経緯` を参照                                                                           |
| 対応策   | `原則` に従い、sample の判定を命名で行い、sample の `type` を見本にする成果物の type に揃える |
| 依存事項 | なし                                                                                          |
| 完了条件 | `完了条件` を参照                                                                             |

### 3.1. 原因と経緯

- `src/register/approach.ts` は、`*-maintenance` の対象の種類を frontmatter の `type` で判定する。recipe・template・rulebook は `type` が種類と一致するが、sample は一致しない。`src/register/deliverable-target.ts` は sample だけを `type` の判定から外しており、判定が揃っていない。
- 2026 年 4〜5 月の初期の sample は実際の成果物を写して作られ、成果物の `id` と `type` を持っていた（例: `pm-raci-sample` の初版は `id: prj-0001:pm-raci`、`type: project`）。
- 2026-07-09 に、文書索引で実物の成果物を隠さないよう sample の `id` を `*-sample` に揃えたが、`type` は直さなかった。2026 年 9 月以降に新設した 5 件だけが `type: sample` を使う。
- YAML の sample は成果物のスキーマで検証されるため、成果物の type が必須である。

### 3.2. 原則

- 成果物として成り立つ文書は中身の種類を表す `type`（`project`・`flow`・`data` など）を持ち、成果物として成り立たない実践の型（rulebook・recipe・template など）は役割を表す `type` を持つ。
- sample は完成した成果物の最小例であり、前者に当たる。sample の `type` には、見本にする成果物の type を書く。
- 文書が sample であることは、`id` とファイル名の `-sample`、`samples/` の置き場所、rulebook の `sample` の宣言で表す。`type` では表さない。
- sample と成果物の違いは `id` だけであり、これは文書索引で実物の成果物と衝突させないための区別である。

### 3.3. 見送った案

| 案                                                                                                                                      | 見送った理由                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Markdown の sample を `type: sample` に揃える                                                                                           | YAML の sample は成果物の type が必須で、Markdown と規則が分かれる。sample が成果物として成り立つ形から離れる                   |
| template の `frontmatter_template` にならい、`type: sample` とし成果物の frontmatter を `frontmatter_sample` / `metadata_sample` に包む | sample が「成果物の frontmatter を抱えた別種の文書」になり、そのまま成果物として使える形から離れる。YAML の検証に変換処理が要る |

### 3.4. 完了条件

1. `register add` / `update` の `sample-maintenance` は、対象が sample かどうかを `id` の末尾 `-sample` で判定し、`type` を見ない。`specdojo:tsd-sample` と `specdojo:tsd-index-sample` を対象にした `register add --dry-run` が通る。
2. sample でない文書（rulebook・成果物など）を `sample-maintenance` の対象にすると、これまでどおり記帳の前にエラーで止まる。recipe・template・rulebook の maintenance の判定は変えない。利用者の authority の sample（`docs/ja/kata/` 配下）も同じ規則で判定する。
3. `sample-maintenance` の個票から `exec plan --register` で plan を生成できる。
4. `type: sample` の Markdown の sample 5 件（`cdfd-sample`・`cdfd-uc-sample`・`cstd-sample`・`prj-stakeholder-register-sample`・`stsd-sample`）の `type` を、対応 rulebook の推奨 Frontmatter 項目が定める成果物の type に直す。`cstd-sample` は `deprecated` のまま扱う。ほかの frontmatter と本文は変えない。
5. `原則` を次の文書へ反映する。同じ内容を複数の文書で正本にせず、正本は [[specdojo:document-metadata-standard]] とし、ほかは参照と要点にとどめる。
   - [[specdojo:document-metadata-standard]]: `type` の原則（中身の種類と役割の区別、sample は成果物の type）を追記する。`適用範囲` の成果物向け詳細規約の列挙から `sample` を外す。
   - [[specdojo:sample-authoring-standard]]: `出力フォーマットと命名` に、`type` は見本にする成果物の type とし、sample であることは命名で表すことを追記する。
   - [[specdojo:id-and-file-naming-standard]]: `型の文書のlocal-id` に、sample の種類の判定は `-sample` のサフィックスで行うことを追記する。
   - [[specdojo:practice-system-composition-guide]]: sample は成果物として成り立つ完成例であり、template と異なり成果物の type を持つことを、template との役割分担の段落に追記する。
   - [[specdojo:command-reference]]: kata maintenance の対象検証の説明に、sample は `-sample` の命名で判定することを追記する。
6. `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` の `type` の `sample` は削除せず、非推奨である旨と理由をコメントに書く。利用者の `type: sample` の sample は引き続き検証を通る。
7. 単体テストに、`type: project` の sample を受け付けるケース、`type: sample` の sample を受け付けるケース、sample でない文書を拒否するケースを追加する。
8. `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` と、親の検証が通る。
9. `CHANGELOG.md` の未公開の版の節に、不具合の修正（`sample-maintenance` の判定）と、sample の `type` の原則を書く。節がなければ `## [Unreleased]` を作る。公開済みの版の節は変えない。
10. 上記の文書以外で sample の `type` に依存する記述や処理を見つけた場合は変更せず、個票の対応結果と pipeline の報告の `handoff` に場所と内容を書く。

## 4. 対応結果

### 4.1. 実施内容

- `src/register/approach.ts` の `sample-maintenance` だけを、文書索引での存在確認と `id` の末尾 `-sample` による種類の検証へ変更した。recipe・template・rulebook の `type` による検証は維持した。
- `tests/src/register/approach.test.ts` に成果物の `type`・旧 `type: sample`・YAML・利用者 authority の旧配置と新配置・誤対象・未解決 ID の回帰ケースを追加した。`tests/src/register/commands.test.ts` で add / update の成功と誤対象による個票・イベントの書き込み前拒否を、`tests/src/exec/register-plan-escape.test.ts` で sample の個票からの plan 生成をカバーした。
- [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] を正本として `type` の原則と sample の命名による識別を記載し、sample 記述標準・ID 命名標準・実践体系構成ガイド・コマンドリファレンスから参照した。
- sample 5 件の `type` だけを変更した。CDFD 2 件は `flow`、ステークホルダー登録簿は `project`、STSD と非推奨 CSTD は `data` とした。`cstd-sample` の `deprecated` を含む他の Frontmatter と本文は維持した。
- `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` の `sample` 列挙値は残し、非推奨の理由と互換性のため保持する旨をコメントに記載した。`CHANGELOG.md` に未公開の節を新設し、判定修正と `type` の原則を記載した。

### 4.2. 確認結果

- 実リポジトリの `specdojo:tsd-sample` と `specdojo:tsd-index-sample` を対象とする `register add --dry-run` は、どちらも終了コード 0 で成功した。
- 一時プロジェクトで同じ CLI のコマンド登録と引数解析を使用し、TSD 2 件と利用者 authority の旧 `type: sample` について dry-run・add・update・`exec plan --register` の経路を確認した。成果物を誤って指定した add / update は拒否され、update 前後の個票とイベントが同一であることも確認した。一時データは削除した。
- schema をコンパイルし、変更した sample 5 件の新しい `type` と、それぞれを旧 `type: sample` としたメタ情報が検証を通ることを確認した。`npm run validate:schema:file` による利用者 authority の旧 `type: sample` の検証も成功した。
- カタログ検証は成功した。未作成の成果物に対する既存の `based_on` 検証警告は残るが、エラーはない。
- Prettier による変更ファイルの整形と、`register build` による登録簿の派生ビュー生成が成功した。typecheck・TypeScript lint・単体テスト・結合テスト・Markdown lint・Frontmatter lint・全体 schema 検証は、指定された親 runner の検証に委ねる。

### 4.3. 判断と申し送り

- _ASSUMPTION_: 現行の [[specdojo:cstd-rulebook|非推奨 CSTD rulebook]] は移行方針だけを持ち、推奨 Frontmatter 表はない。非推奨化前（`7b28add7d` の親）の指定は現在の成果物スキーマに存在しない `domain` だったため、現行 rulebook が移行先とする [[specdojo:stsd-rulebook|STSD rulebook]] の `data` を採用した。レビューではこの根拠で `cstd-sample` の `type` を確認する。
- 完了条件 10 に従い、範囲外の `src/docs/yaml-pages.ts:32,90`（YAML の表示用 Markdown の型と、`samples/` 配下から `type: sample` を導出する処理）、`tests/src/docs/yaml-pages.test.ts:28,81`（同じ型を期待するテスト）は変更していない。生成済みの `docs/ja/specdojo/samples/generated/*.md` も同処理で `type: sample` を持つ。次の保守項目で表示用メタ情報の扱いを検討する。`src/register/deliverable-target.ts:153,166` は sample の `type` 検証を除外しており、今回の原則と整合するため変更不要とした。`tests/src/kata/command.test.ts:113` と `tests/src/kata/kata.test.ts:582,608` の旧 `type: sample` fixture も互換性確認として保持した。
- sample 作業手順の `npm run docs:build` は内部で書き込み禁止の文書索引生成を実行し、子プロセスの起動も sandbox で制限されるため、ホスト側での確認を申し送る。指定された親検証は runner が実行し、結果を result に記載する。
- register の実装変更を含むため、統合後は [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用手順]] の 5.1 に従い PJR-JSEY で動作確認する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-05gn-tsd-recipe-authoring]]
- [[prj-0001:pjr-za91-stsd-cstd-merge]]
- [[specdojo:document-metadata-standard]]
- [[specdojo:sample-authoring-standard]]
- `src/register/approach.ts`
- `src/register/deliverable-target.ts`
