---
specdojo:
  id: prj-0001:pjr-mh9e-bps-29-cdfd-14
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: BA
  registered_at: "2026-09-26T05:44:30Z"
---

# PJR-MH9E 成果物カタログの BPS 29 件を現行 CDFD の 14 領域へ追従させる

## 1. 概要

`dct-business-model-bps.yaml` の BPS 29 件は、`cdfd-overview.md` を 14 領域へ書き換える前の**旧 10 領域体系**の P 番号を `overview` に記載している。同じ P 番号が現行では別の領域を指すため、カタログの記述から対象プロセスを特定できない。29 件の分割と `overview` を現行 CDFD へ追従させる。

## 2. 事実

### 2.1. 同じ P 番号が別の領域を指す

| カタログの記述                                     | 旧体系での意味         | 現行 CDFD での意味                       |
| -------------------------------------------------- | ---------------------- | ---------------------------------------- |
| `bps-task-review-finalize` = P-04-05・06           | review 実行と finalize | **P-04 = スケジュール計画展開**          |
| `bps-task-edit` = P-04-04                          | edit 実行              | 同上                                     |
| `bps-derived-project-scoped` = P-08-02〜04         | 派生生成               | **P-08 = 成果物評価**                    |
| `bps-reporting-monitoring-detection` = P-09-01・02 | 監視入力確認・滞留検知 | **P-09-01/02 = 報告対象確定 / 進捗集計** |
| `bps-config-change-evaluation` = P-07-01           | 構成変更評価           | **P-07 = タスク実行**                    |

**ずれは 29 件全体に及ぶ。** `overview` の文言だけを読むと対応が取れているように見えるため、P 番号を突き合わせないと誤りに気づかない。

### 2.2. 現行 CDFD の 14 領域

| ID     | 領域                         | 対応する BPS        |
| ------ | ---------------------------- | ------------------- |
| `P-01` | プロジェクト初期セットアップ | `bps-init-*`        |
| `P-02` | 登録簿定義                   | `bps-register-*`    |
| `P-03` | 成果物カタログ定義           | 要確認              |
| `P-04` | スケジュール計画展開         | `bps-planning-*`    |
| `P-05` | 定期実行定義                 | `bps-routine-*`     |
| `P-06` | ジョブ定義                   | 要確認              |
| `P-07` | タスク実行                   | `bps-task-*`        |
| `P-08` | **成果物評価**               | **なし**            |
| `P-09` | 進捗可視化報告               | `bps-reporting-*`   |
| `P-10` | 派生生成閲覧提供             | `bps-derived-*`     |
| `P-11` | **タスク完了**               | **なし**            |
| `P-12` | 稼働構成管理                 | `bps-config-*`      |
| `P-13` | 非推奨化保管                 | `bps-deprecation-*` |
| `P-14` | オーケストレーター           | 要確認              |

### 2.3. 2 領域に対応する BPS がない

`P-08 成果物評価` と `P-11 タスク完了` に対応する BPS がカタログに存在しない。`bps-reporting-*` は進捗報告（P-09）であり成果物評価ではない。

この 2 件は [[prj-0001:pjr-h4h7-bps-grade-review]] で先行作成する。**カタログは本項目で後追いする。**

### 2.4. 並び順は現行と近い

旧体系と現行で領域の並び自体は大きく変わっていない。ずれの主因は、現行で `P-08 成果物評価` と `P-11 タスク完了` が挿入され、以降の番号が繰り下がったことである。単純な番号の付け替えで済む部分と、分割の見直しが要る部分が混在する。

## 3. 完了条件

- 29 件すべての `overview` が現行 CDFD の P 番号を指している。
- 14 領域それぞれについて、対応する BPS があるか、不要である理由が分かる。
- `P-08` と `P-11` の BPS がカタログへ登録されている。[[prj-0001:pjr-h4h7-bps-grade-review]] で先行作成した文書と `local_id`、`path`、`rulebook` が一致する。
- 各 BPS の `done_criteria` が定義されている。先行作成した 2 件も含む。
- 分割の見直しが必要な箇所は、変更内容と理由が記録されている。単純な番号付け替えと区別する。
- `depends_on` が現行の領域間関係と整合している。
- `npx specdojo catalog validate --project prj-0001` が通過している。
- grade を再実行し、`vp-arc-cross-document-consistency` の finding が増えていない。

## 4. 検討事項

### 4.1. 番号の付け替えか分割の見直しか

旧体系の 1 領域が現行で複数に分かれている場合、BPS の分割自体を見直す必要がある。逆に統合された場合は BPS をまとめる。**作業の前に、旧 10 領域と現行 14 領域の対応表を作る。**

### 4.2. 再発防止

CDFD を変更したときにカタログが追従しない状態が再発しうる。`overview` に P 番号を書く運用を続けるか、別の対応付け方法へ変えるかを検討する。カタログの `deliverables` に CDFD プロセス ID を持つ項目を設ける案もある。

## 5. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                        |
| --- | ------------------------------------------- | ---- | ---- | --------------------------- |
| 1   | 旧 10 領域と現行 14 領域の対応表を作る      | BA   | open | 作業の前提                  |
| 2   | 29 件の `overview` を現行 P 番号へ更新する  | BA   | open |                             |
| 3   | 分割の見直しが要る箇所を特定し変更する      | BA   | open | 理由を記録する              |
| 4   | `P-08` / `P-11` の BPS をカタログへ登録する | BA   | open | PJR-H4H7 の成果と一致させる |
| 5   | `done_criteria` を定義する                  | QE   | open | 先行作成した 2 件も含む     |
| 6   | 再発防止の方法を検討する                    | ARC  | open | 対応付け方法の見直し        |
| 7   | `catalog validate` と grade を実行する      | QE   | open |                             |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-h4h7-bps-grade-review]]
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-model-bps.yaml`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`
- `docs/ja/specdojo/rulebooks/bps-rulebook.md`
