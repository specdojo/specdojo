---
specdojo:
  id: prj-0001:pjr-6pd7-cdfd-overview
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: BA
  registered_at: "2026-09-13T01:30:32Z"
  due_on: "2026-09-30"
---

# PJR-6PD7 詳細 CDFD をプロセスグループ別・ユースケース別へ再作成する

## 1. 概要

[[cdfd-overview]] を見直し、詳細化先を「領域別 CDFD（1 領域 1 文書）」から「プロセスグループ別 CDFD（Onboarding／Plan／Do／Check／Action／Orchestrator の 6 文書）＋横断ユースケース別 CDFD」へ改めた。これに伴い、プロセスグループ別 CDFD 6 件とユースケース別 CDFD 2 件（`cdfd-uc-register`: 登録簿起票から完了まで、`cdfd-uc-deliverable`: 成果物の作成から完了まで）を新規に作成し、現行の領域別 CDFD 10 件は非推奨化して `trash` へ退避する。

新 CDFD は旧文書を統合するのではなく、[[cdfd-overview]] の領域定義と現行実装から新規に作成する。旧文書は 10 領域時代の境界で書かれた現状分析であり、参照すると古い境界を引き継ぐため、作成前に退避して参照しない。置き換えの対応は次のとおり。

| プロセスグループ | 新 CDFD             | 置き換える旧 CDFD（参照しない）                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------ |
| Onboarding       | `cdfd-onboarding`   | `cdfd-init`                                                                    |
| Plan             | `cdfd-plan`         | `cdfd-register-lifecycle`、`cdfd-catalog-planning`、`cdfd-routine`（定義部分） |
| Do               | `cdfd-do`           | `cdfd-task-execution`、`cdfd-multi-project`                                    |
| Check            | `cdfd-check`        | `cdfd-reporting`、`cdfd-derived-content`                                       |
| Action           | `cdfd-action`       | `cdfd-agent-config-operation`、`cdfd-deprecation`                              |
| Orchestrator     | `cdfd-orchestrator` | `cdfd-routine`（起動部分）                                                     |

作成にあたっての前提は次のとおり。

- プロセスグループ別 CDFD は、グループに属する領域の内部プロセス、起点イベント、例外・復旧、データストアの読み書きを定める正本とする。領域単位の入出力は [[cdfd-overview]] に置かず、グループ別 CDFD の「プロセス領域」章で示す。状態の定義は STSD、状態遷移は CSTD を正本とし、CDFD は状態を変えるプロセスの参照に留める。
- データストア名は [[cdfd-overview]] の「データストア」（稼働構成、Kata、成果物カタログ、スケジュール戦略、定期実行定義、ジョブ定義、登録簿、Schedule（track）、実行計画、実行記録、成果物、保管庫、評価結果、進捗報告、派生ビュー・索引）に統一する。
- 凡例は [[cdfd-overview]] の「凡例（本プロダクト共通）」を参照し、各文書で再掲しない。
- product 文書の `id` は `prj-0001:` などのプロジェクト修飾を付けない（例: `cdfd-plan`）。
- 根拠は `based_on: [cdfd-overview]` と、成果物カタログの `evidence_refs` に書く現行実装（`src/`）とする。旧 CDFD を `based_on` や参考資料にしない。
- タイムライン（`<project-id>/timeline/`）の位置付けは [[cdfd-overview]] で Schedule（track）に含めている。`cdfd-plan` または `cdfd-check` の作成時に、生成物としての扱いと閲覧提供との関係を確定する。
- ユースケース別 CDFD は、複数のプロセスグループをまたぐ順序と引き渡し条件だけを定め、グループ内部のプロセスは再掲せずプロセスグループ別 CDFD を参照する。
- 本件は [[prj-0001:sch-track-data-flow]] の作り直しにあたる。`data-flow` track の既存タスクは全件 done のため、新 track は作らず [[prj-0001:dct-data-flow]] に新 8 件を追加して同じ track を `schedule build --force` で再生成する。旧 10 件は `deliverable trash` でエントリと task ID を維持したまま `trash/` へ退避するため、done タスクの整合は保たれる。timeline の変更は不要。

### 1.1. 実行方式の変更（2026-09-13）

作業 3〜10 の CDFD 作成は登録簿から個別に実行せず、`data-flow` track の Schedule タスクとして実行する。個票の作業表は人手で行う準備・確認に絞り、CDFD ごとの進捗は生成済み track と `exec status` で追う。`schedule strategy generate` は kata の grade verdict から approach を導くため、改訂直後の `cdfd-rulebook` / `cdfd-uc-rulebook` が未評価または needs-work の間は `freeform` に落ちる。grade が pass になるのを待つか、phase に `approach` を明示する。

## 2. 完了条件

- 旧 10 件が `deliverable trash` で `docs/ja/product/trash/` へ退避され、[[prj-0001:dct-data-flow]] のエントリと task ID が維持されている。
- [[prj-0001:dct-data-flow]] に新規成果物 8 件が登録され、`data-flow` track が再生成されて 8 件分のタスクを含む。
- 六つのプロセスグループ別 CDFD（`cdfd-onboarding`、`cdfd-plan`、`cdfd-do`、`cdfd-check`、`cdfd-action`、`cdfd-orchestrator`）と二つのユースケース別 CDFD（`cdfd-uc-register`、`cdfd-uc-deliverable`）が `docs/ja/product/010-business-specs/010-data-flow/` に存在し、それぞれの rulebook に準拠している。
- [[cdfd-overview]] の各領域の主要入力・主要出力・データストアが、対応するプロセスグループ別 CDFD の「プロセス領域」章で矛盾なく詳細化されている。
- `data-flow` track の全タスクが done で、Ready / doing が残っていない。
- 旧 CDFD を参照していた wikilink が新 CDFD へ付け替えられ、[[cdfd-overview]] の「詳細 CDFD 一覧」の ID が実際の文書 ID と一致している。
- `npm run -s lint:md` と `npm run docs:build` がエラーなしで通る。

## 3. 作業内容

| No  | 作業                                                                                                                                                     | 担当 | 状態 | メモ                                                                                               |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------------- |
| 1   | 旧 10 件を `deliverable trash` で退避する                                                                                                                | PM   | open | エントリと task ID は維持。wikilink の付け替えは作業 6                                             |
| 2   | プロセスグループ別・ユースケース別 CDFD の rulebook・template を整備する（`cdfd-overview-rulebook` の改訂含む）                                          | BA   | done | overview 側は本項目、グループ別は PJR-4NXR、ユースケース別は PJR-ZKNA、章構成の統一は PJR-V8FV     |
| 3   | [[prj-0001:dct-data-flow]] に新グループ「プロセスグループ別 CDFD」「ユースケース別 CDFD」を追加し 8 件を登録する                                         | PM   | open | `rulebook` はグループ別 `specdojo:cdfd-rulebook`、uc は `specdojo:cdfd-uc-rulebook`。根拠は `src/` |
| 4   | [[prj-0001:sch-strategy-data-flow]] の `approach_rules` に 8 件を `author-deliverable` で追加し、`schedule build --track data-flow --force` で再生成する | PM   | open | 旧 10 件のルールは done タスクの整合のため残す。`tml-index.yaml` は note のみ更新                  |
| 5   | 8 件のタスク群を Schedule で実行し、全タスクの done を確認する                                                                                           | BA   | open | `exec run --auto` または `rtn-exec-cycle`。進捗は `exec status`                                    |
| 6   | 旧 CDFD を参照していた wikilink を新 CDFD へ付け替え、[[cdfd-overview]] の「詳細 CDFD 一覧」と実際の ID の一致を確認する                                 | BA   | open | -                                                                                                  |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[cdfd-overview]]
- [[prj-0001:dct-data-flow]]
- [[prj-0001:sch-strategy-data-flow]]
- [[prj-0001:sch-track-data-flow]]
- [[prj-0001:cdfd-init]]
- [[prj-0001:cdfd-register-lifecycle]]
- [[prj-0001:cdfd-catalog-planning]]
- [[prj-0001:cdfd-routine]]
- [[prj-0001:cdfd-task-execution]]
- [[prj-0001:cdfd-multi-project]]
- [[prj-0001:cdfd-reporting]]
- [[prj-0001:cdfd-derived-content]]
- [[prj-0001:cdfd-agent-config-operation]]
- [[prj-0001:cdfd-deprecation]]
- `specdojo:cdfd-overview-rulebook`
