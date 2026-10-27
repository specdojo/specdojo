---
specdojo:
  id: prj-0001:pjr-xsm8-sample-maintenance-target-kind
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-05gn-tsd-recipe-authoring]]
- [[prj-0001:pjr-za91-stsd-cstd-merge]]
- [[specdojo:document-metadata-standard]]
- [[specdojo:sample-authoring-standard]]
- `src/register/approach.ts`
- `src/register/deliverable-target.ts`
