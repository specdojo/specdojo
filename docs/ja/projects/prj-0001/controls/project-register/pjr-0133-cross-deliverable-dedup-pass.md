---
specdojo:
  id: prj-0001:pjr-0133-cross-deliverable-dedup-pass
  type: project
  status: ready
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
| 1 | 横断 pass の対象成果物群、実行順序、owner、所要時間を設計する | PM | done | project-definition / project-management を bootstrap gate 後、refine 前に各 0.5 日・ARC owner で配置 |
| 2 | 成果物群単位の直列タスクを strategy / schedule で表現する方式を追加する | ARC | done | `cross_deliverable_passes` の各 entry を成果物数にかかわらず 1 タスクへ展開 |
| 3 | 複数成果物を plan targets と commit scope へ安全に展開する | ARC | done | `target_local_ids` を track / ready / plan targets へ伝播し、既存 targets allowlist を利用 |
| 4 | 重複候補の判定、正本選択、要約・参照化、保持条件を指示テンプレートに定義する | ARC | done | 専用 plan / result template に抽出・集約・置換・保持・記録手順を定義 |
| 5 | 代表的な成果物群で重複削減と done_criteria・追跡性の維持を検証する | QE | done | project-definition / project-management の生成結果と関連テストで scope・依存・targets・記録欄を確認 |
| 6 | review viewpointによる重複の再発検知との役割分担を整理する | UX | done | 横断 pass は重複の修正、[[prj-0001:pjr-0132-detect-document-redundancy\|PJR-0132]] の review viewpoint は再発検出と整理 |

## 4. 対応結果

- `sch-strategy` schema に `cross_deliverable_passes` を追加した。各 entry は `after_gate`、`before_phase_set`、明示 scope、owner、所要時間、実行要件を持ち、`schedule build` で成果物群につき一つの横断タスクへ展開される。
- launch strategy に project-definition 8 文書と project-management 7 文書の横断 pass を追加した。どちらも `G-LAUNCH-bootstrap-pass` に依存し、scope 内の最初の `refine-pass` タスクが対応する横断タスクに依存する。
- 横断タスクの `target_local_ids` を schedule index、ready task、plan frontmatter の複数 `targets` へ伝播した。commit scope は既存の targets allowlist から対象ファイルだけを許可し、参考資料や対象外文書を含めない。
- `cross-deliverable-dedup` approach と専用 plan / result template を追加した。重複候補の意味的判定、正本選択、詳細集約、要約・参照化、保持条件、変更した正本・置換・保持理由・追跡性確認の記録を一つの実行契約にした。
- `schedule build` / `exec build` の実データ生成後、横断タスク 2 件だけが Ready になり、project-definition / project-management の各 refine task が対応する横断タスクでブロックされることを確認した。strategy / track schema validation と関連テスト 68 件も成功した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]] — 起票元
- [[prj-0001:sch-strategy-launch|スケジュール戦略（launch）]] — 横断 pass とゲートの変更対象
- [[schedule-design-guide]] — schedule 生成設計の基準
- [[documentation-philosophy]] — 正本と参照の共通原則
- [[prj-0001:pjr-0131-concise-documentation-policy|簡潔な文書作成の共通原則をdocumentation policyへ追加]] — 作成・修正時の共通原則
- [[prj-0001:pjr-0132-detect-document-redundancy|既存review viewpointで文書の冗長性を検出]] — review での再発検知
