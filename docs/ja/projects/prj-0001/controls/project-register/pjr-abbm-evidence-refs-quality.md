---
specdojo:
  id: prj-0001:pjr-abbm-evidence-refs-quality
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-05T22:52:17Z"
  derived_from:
    - PJR-PSXJ
---

# PJR-ABBM 根拠にならない `evidence_refs` を警告し、見直しの段で本体のファイルを確かめる

## 1. 概要

`catalog validate` が根拠にならない `evidence_refs` を検出し、`catalog-planning` の手順に本体のファイルの確認を足す。存在しないパスは既存のエラーを維持し、re-export だけのファイルは警告する。

## 2. 入力

- 由来: PJR-PSXJ の決定（A 案）。候補 (2) の置き換えと (3)〜(5) は対象外（2026-11-06）
- orchestrator の調査: 成果物 203 件のうち 93 件に `evidence_refs` があり参照は 181 件。src/exec/exec.ts は 2 行の re-export で 56 回引かれている（2026-11-06）

## 3. 完了条件

- `catalog validate`（`src/catalog/build.ts` の `evidence_refs` の検査）が、中身が re-export（`export … from` と型の re-export）だけのファイルを指す参照を警告する。警告で終了コードを変えない。存在しないパス・広すぎるパス・重複の既存のエラーは変えない。
- 警告に、カタログのファイル、成果物の `local_id`、参照のパス、理由（re-export だけ）を含める。
- prj-0001 で `catalog validate` を実行し、警告の件数と、`src/exec/exec.ts` を指す参照が警告に出ることを個票の対応結果に書く。参照の置き換えは行わない。
- catalog-planning の plan の手順（`src/exec/plans-planning.ts`）に、状態遷移・判定・検証の本体を含むファイルが `evidence_refs` にあるかを確かめ、re-export だけのファイルを根拠にしない手順を足す。対応する recipe・ガイドがあれば同じ確認を書く。
- 単体テストを足す（re-export だけのファイルで警告が出る、通常のファイルで出ない、re-export と本体が混ざるファイルで出ない）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証が通る。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。
- 保護された設定（`package.json`・agent の定義・`exec-defaults.yaml` など）は変えない。変更が要る場合は、案を個票の対応結果に書き、pipeline では報告の `handoff` にも書く。

## 4. 作業内容

| No  | 作業                                           | 担当     | 状態 | メモ                                            |
| --- | ---------------------------------------------- | -------- | ---- | ----------------------------------------------- |
| 1   | re-export だけのファイルの判定と警告を足す     | executor | done | JavaScript / TypeScript を対象に警告を追加      |
| 2   | catalog-planning の手順と recipe・ガイドを直す | executor | done | plan・ルールブック・ガイドを更新。recipe はない |
| 3   | テストと CHANGELOG を足す                      | executor | done | 判定と plan 展開のテスト、Unreleased への追記   |

## 5. 対応結果

- `src/catalog/build.ts` に re-export だけのファイルを検出する警告を追加した。コメント・複数行・名前付き / 一括 / 型の re-export を扱い、本体の宣言や import が混在するファイル、空ファイル、ディレクトリには警告しない。警告にはカタログのファイル、`local_id`、参照パス、理由を含める。存在しないパス・広すぎる範囲・重複の既存エラーは維持した。
- `src/exec/plans-planning.ts` に、状態遷移・判定・検証の本体の参照確認、転送先の追跡、不足する参照の補完、再検証と記録の手順を追加した。[[specdojo:dct-rulebook|成果物カタログ作成ルール]] と [[specdojo:timeline-design-guide|タイムライン設計ガイド]] にも反映し、旧規定の「内部ヘルパーは参照しない」を本体の参照を確認する規定へ改めた。対応する DCT recipe は存在しない。
- `tests/src/catalog/build.test.ts` に警告の有無・文脈・ファイル種別のテスト、`tests/src/register/planning.test.ts` に手順の展開確認を追加した。`CHANGELOG.md` の Unreleased に記載した。
- `node --import tsx src/specdojo.ts catalog validate --project prj-0001` は終了コード 0、エラー 0 件、警告計 227 件。そのうち今回追加した re-export の警告は 64 件で、全件が `src/exec/exec.ts` を指す参照だった（入力の 56 件は事前調査時点の値）。既存の `evidence_refs` は置き換えていない。
- Prettier 整形と `npm run validate:history-links` は成功した。単体・統合テスト、型検査、TypeScript / Markdown / frontmatter / 図の lint、schema 検査は pipeline の親 runner が実施する。
- 残課題・保護された設定の変更案・追加の申し送りはない。result は pipeline の reporter / runner が記入する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-psxj-code-doc-traceability|PJR-PSXJ: 由来の decision]]
