---
specdojo:
  id: prj-0001:pjr-kyg4-based-on-product-bare-id
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T23:13:32Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-PHY7
  commit_type: fix
  commit_scope: catalog
---

# PJR-KYG4 雛形の based_on でプロダクト文書への依存に名前空間を付けない

## 1. 概要

catalog から雛形を作るとき、based_on の依存先がプロダクト文書でも prj-0001: を付けている。標準どおり、プロダクト文書は名前空間なしの id を入れるように直す

## 2. 入力

- プロダクト文書の id は名前空間なしを正とする（PJR-PHY7 の案 A、利用者の決定、2026-11-23）
- deliverableDocId は 10-26 から product の下で名前空間なしを返すが、src/catalog/generate.ts の `_BASED_ON_` の置き換えは依存先を常に projectId: で修飾する

## 3. 完了条件

- catalog から雛形を作るとき（`_BASED_ON_` の置き換え）、依存先がプロダクト文書（`docs/<lang>/product/` の下）なら名前空間なしの id を、プロジェクト文書なら `<project-id>:` で修飾した id を入れる。依存先の id の決め方は、既存の `deliverableDocId`（既存の文書の frontmatter を正とし、ない場合は置き場所で決める）にそろえる。
- 同じように、プロダクト文書に名前空間を付けてしまう生成の経路がほかにないかを `src` で探し、あれば同じく直す。探した方法と結果を個票の対応結果に書く。
- プロダクト文書とプロジェクト文書の両方の依存先について、単体テストを足す。
- 既存の成果物の id と `based_on` は、この項目では変えない（PJR-PHY7 の後続の todo で直す）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                                             | 担当 | 状態 | メモ                                                 |
| --- | ------------------------------------------------------------------------------------------------ | ---- | ---- | ---------------------------------------------------- |
| 1   | `src/catalog/generate.ts` の `_BASED_ON_` と最小雛形の依存先 id を `deliverableDocId` にそろえる | DEV  | done | プロダクト文書は名前空間なし、プロジェクト文書は修飾 |
| 2   | 同種の生成経路を `src` で探して直す                                                              | DEV  | done | 対応結果に探索方法と結果を記載                       |
| 3   | プロダクト文書・プロジェクト文書の両依存先の単体テストを足す                                     | DEV  | done | `tests/src/catalog/generate.test.ts`                 |

## 5. 対応結果

### 5.1. 実施内容

- `src/catalog/generate.ts`: 依存先 id を `deliverableDocId`（既存文書の frontmatter を正とし、ない場合は置き場所で決める）で解決する。`runGenerate` は同じ dct 内の解決済みパス、単一対象の生成（scaffold）は catalog から引いたパスを使う。解決できない依存先は従来どおり `<project-id>:` で修飾する。
- 同じ経路の自 id: 最小雛形（Markdown・YAML）の `id` と、雛形の `_PROJECT_ID_:_LOCAL_ID_` を `deliverableDocId` の結果に置き換え、単一対象生成で `ensureFrontmatterProperties` へ渡す `id` も同じ決め方にした。プロダクト文書を先に生成すると、その自 id が修飾付きになり、依存元の `based_on` を引くときに修飾付きで読まれてしまうため。
- テスト: `tests/src/catalog/generate.test.ts` に、`based_on` へ product 文書（名前空間なし）と project 文書（`prjx:` 修飾）の両方が入るケースを追加した。

### 5.2. 同種の生成経路の探索

- 方法: `src` で `${projectId}:${...}` 形式の id 組み立てを grep し、結果を確認した。
- 直したもの: `src/catalog/generate.ts` の `_BASED_ON_`、最小雛形の `based_on` と自 id、単一対象生成の `id`。
- 直していないもの: `src/exec/` の exec plan・result の doc id、`src/job/job.ts`、`src/register/*` はプロダクト文書の id ではない。`src/catalog/build-references.ts` の依存グラフ（`fullId`・`dependsOn`）と `src/catalog/scaffold.ts` の dct 自身の id は検証用の内部キー・catalog 文書の id で、成果物の frontmatter へ出ない。

### 5.3. CHANGELOG に書く事項

- 区分: Fixed
- 行の文案: `catalog generate` が雛形の `based_on` と自 id にプロダクト文書の名前空間（`<project-id>:`）を付けていたのを、名前空間なしの id にした。

### 5.4. 判断・申し送り

- 既存の成果物の id と `based_on` は変えていない（PJR-PHY7 の後続の todo）。
- 自 id も合わせて直したのは、依存先 id の解決が既存文書の frontmatter を正とするため（5.1 参照）。
- 検証: `npm run typecheck`・`npm run lint:ts`（error 0）・`npm run test:unit` が通った。

## 6. 関連ドキュメント

- PJR-PHY7（プロダクト文書の id は名前空間なしとする案 A）
