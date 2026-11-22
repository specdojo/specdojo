---
specdojo:
  id: prj-0001:pjr-kyg4-based-on-product-bare-id
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
