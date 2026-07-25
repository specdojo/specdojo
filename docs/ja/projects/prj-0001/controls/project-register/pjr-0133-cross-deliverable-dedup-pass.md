---
specdojo:
  id: prj-0001:pjr-0133-cross-deliverable-dedup-pass
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0133 bootstrap後に成果物間の重複を整理する横断passを追加

## 1. 概要

launch track では、一成果物単位で生成した文書に同じ説明や判断理由が散在し、最終段階で多数の重複削除が必要になった。全成果物の初稿がそろう `bootstrap-pass` 完了後、個別の `refine-pass` を始める前に、意味的に近い成果物群を横断して正本を選択し、重複を必要最小限の要約と参照へ置き換える直列 pass を追加する。

## 2. 完了条件

- 横断 pass が `bootstrap-pass` 完了ゲートに依存し、対象成果物の `refine-pass` 開始をブロックする順序で生成される。
- 通常の成果物別 phase を流用して同じ横断タスクを複製せず、成果物群につき一つの直列タスクとして表現できる。
- プロジェクト定義、プロジェクト管理など、意味的に近い成果物群を明示的に scope として指定できる。
- 対象となる複数成果物を plan と commit scope に列挙し、対象外ファイルを変更しない。
- 重複候補の抽出、正本の選択、正本への詳細集約、他文書の要約・参照化、結果確認の手順が定義されている。
- 単独可読性に必要な短い要約、成果物固有の観点、rulebook / schema の必須情報を重複として機械的に削除しない。
- `done_criteria`、トレーサビリティ、文書の責務、既存の `based_on` / `depends_on` 関係が維持される。
- 変更した正本、置換した重複、残した重複と理由を result に記録できる。
- schedule build、exec build、schema validation、関連テストが成功する。

## 3. 作業内容

<!-- prettier-ignore -->
| No | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1 | 横断 pass の対象成果物群、実行順序、owner、所要時間を設計する | PM | open | bootstrap gate 後、refine 前 |
| 2 | 成果物群単位の直列タスクを strategy / schedule で表現する方式を追加する | ARC | open | 成果物別 phase の複製を避ける |
| 3 | 複数成果物を plan targets と commit scope へ安全に展開する | ARC | open | 対象外変更を禁止 |
| 4 | 重複候補の判定、正本選択、要約・参照化、保持条件を指示テンプレートに定義する | ARC | open | 短さ自体を目的化しない |
| 5 | 代表的な成果物群で重複削減と done_criteria・追跡性の維持を検証する | QE | open | project-definition を候補とする |
| 6 | review viewpointによる重複の再発検知との役割分担を整理する | UX | open | 横断 pass は修正、review は検出 |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]] — 起票元
- [[prj-0001:sch-strategy-launch|スケジュール戦略（launch）]] — 横断 pass とゲートの変更対象
- [[specdojo-schedule-design-guide]] — schedule 生成設計の基準
- [[specdojo-documentation-policy-guide]] — 正本と参照の共通原則
- [[prj-0001:pjr-0131-concise-documentation-policy|簡潔な文書作成の共通原則をdocumentation policyへ追加]] — 作成・修正時の共通原則
- [[prj-0001:pjr-0132-detect-document-redundancy|既存review viewpointで文書の冗長性を検出]] — review での再発検知
