---
specdojo:
  id: prj-0001:pjr-ykma-catalog-brief
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  registered_at: "2026-10-28T22:22:41Z"
  completed_at: "2026-10-29T15:09:44Z"
  conclusion: dct.schema.yaml の成果物に brief を追加し、schedule と register の両経路の plan に前提として載せた。dct-rulebook・sample・ryu-guide に overview・done_criteria との使い分けと YAML アンカーでの共有を書いた
  derived_from:
    - PJR-65DS
  depends_on:
    - PJR-3MY5
---

# PJR-YKMA カタログの成果物に brief を設ける

## 1. 概要

成果物の外から継続して渡す前提を dct の brief に書けるようにし、schedule と register の両経路の plan に入れる

## 2. 完了条件

- `dct.schema.yaml` の成果物に `brief` を追加し、`catalog validate` が受け付ける。複数の成果物で共有する場合は YAML のアンカーを使えることを示す。
- schedule の task の plan と、register 経由で成果物を対象にする plan の両方に、`brief` を「前提」として載せる。3MY5 で設けた差し込み口を使う。`brief` が無い場合は載せない。
- dct の rulebook（カタログの記述規則）と関連ガイドに、`brief`・`overview`・`done_criteria` の使い分けを書く。
- 単体テストで、schema の検証と、両経路の plan への反映を確かめる。
- `CHANGELOG.md` の `## [Unreleased]` 節（無ければ `## [0.5.0]` の上に作る）に追記する。`0.5.0` と公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と `handoff` に書く。

## 3. 作業内容

| No  | 作業                                        | 担当     | 状態 | メモ                                                                                               |
| --- | ------------------------------------------- | -------- | ---- | -------------------------------------------------------------------------------------------------- |
| 1   | schema と catalog の検証に `brief` を加える | executor | done | `dct.schema.yaml` と `DctDeliverableItem` に `brief` を追加し、sample で YAML アンカー共有例を記載 |
| 2   | 両経路の plan に反映する                    | executor | done | schedule / register 両経路で `_DELIVERABLE_BRIEF_` 差し込み口へ反映し、未指定時は行を非表示化      |
| 3   | rulebook・ガイド・テストを更新する          | executor | done | `dct-rulebook.md`・`ryu-guide.md`・plan 雛形・単体テスト（schema/plan 生成）・CHANGELOG を更新     |

## 4. 対応結果

- `dct.schema.yaml` の成果物エントリ（`DeliverableItem`）に `brief`（型: `string`、`minLength: 1`）を追加した。`catalog validate` で検証され、`dct-sample.yaml` に YAML アンカー（`&anchor` / `*anchor`）を用いた複数成果物間での共有例を記載した。
- `src/shared/catalog-render.ts` の `DctDeliverableItem` に `brief?: string;` を追加した。
- plan 生成処理（`src/exec/plans-core.ts`, `src/exec/plans-generation.ts`）において、3MY5 で設けた差し込み口 `_DELIVERABLE_BRIEF_` へ `deliverableBrief(deliverable)` の展開を接続した。成果物に `brief` が定義されている場合は改行インデントを施して差し込み口へ渡し、未定義・空の場合はテンプレートから該当行を除外して plan に載せないようにした。schedule 起点（`generateSinglePlan`）および register 経由（`generateRegisterApproachPlan`）の両経路、および review plan の双方で動作する。
- plan 雛形（`xep-draft-template.md`, `xep-fully-guided-template.md`, `xrp-fully-guided-template.md`）およびガイド（`ryu-guide.md`）の説明文を「値が無いときは載せない」方針へ更新した。
- `docs/ja/specdojo/rulebooks/dct-rulebook.md` の成果物エントリ表に `brief` を追加し、第 6.14 節として `overview`（成果物の目的を 1 文で表す概要）・`brief`（成果物の外から継続して渡す前提）・`done_criteria`（検証可能な完了条件）の使い分けと YAML アンカーによる記述方法を明記した。あわせて `ryu-guide.md` にも使い分けの原則を追記した。
- `CHANGELOG.md` の `## [Unreleased]` の追加機能節に本機能の追記を行った。公開済みの 0.5.0 以下の節は変更していない。
- 設計判断: `brief` の plan 反映において、3MY5 で設けた差し込み口 `_DELIVERABLE_BRIEF_` を直接使用し、単一行・複数行（箇条書き等）のいずれでも Markdown のリスト構造が壊れないようインデント整形して展開する方式を採用した。`brief` 未指定時は行そのものを省くことで、plan の対象成果物セクションの不要な行ノイズを排除した。
- 設計判断: YAML アンカーによる `brief` 共有は、カタログのルートレベルにカスタムプロパティを置かず（`additionalProperties: false` に反するため）、先行する成果物エントリの `brief: &anchor |` で定義し、後続成果物で `brief: *anchor` として参照する標準 YAML 記法を正本とし、サンプルおよび rulebook で明示した。
- 単体テスト: `tests/docs/specdojo/schemas/dct-schema.test.ts` を新設し、`dct.schema.yaml` による `brief`（単一行、複数行、YAML アンカー、空文字・型不正の拒否）の検証を網羅した。また `tests/src/exec/draft-plan.test.ts` を拡張し、register / schedule 両経路での `brief` の plan への反映、YAML アンカー共有の反映、review plan への反映、未指定時に載らないことの検証を追加した。
- 保護された設定（`.specdojo/` や `package.json` など）の変更は不要であり、変更案もない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:ryu-guide]]
