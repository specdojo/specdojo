---
specdojo:
  id: prj-0001:pjr-00qv-cdfd-rulebook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: ARC
  registered_at: "2026-09-26T02:25:42Z"
  block_reason: "checkpoint failed: Root index has staged changes; commit or unstage them first: docs/ja/projects/prj-0001/controls/project-register/events/pjr-t3nn.yaml docs/ja/projects/prj-0001/controls/project-regi…"
---

# PJR-00QV データストア名へ概念の英語名を併記し cdfd-rulebook の禁止事項に注記を加える

## 1. 概要

CDFD のデータストア名が日本語のみのため、実装を知る読み手が対応する語を特定できない。`実行計画` と `plan` は同じ概念の日本語名と英語名であり、併記できる。`cdfd-rulebook` の禁止事項が実装名を禁じているが、概念の英語名はこれに当たらないため、誤解を避ける注記を加える。

## 2. 事実

### 2.1. 概念の英語名は実装名ではない

`cdfd-rulebook` の禁止事項は次を対象とする。

```text
物理テーブル名、物理カラム名、SQL、実装クラス、詳細 API を概念フローへ記載しない
```

`plan`、`register`、`deliverable` は概念そのものの英語名であり、上記のいずれでもない。`Schedule（track）` は既に英語名で表記されており、同じ扱いである。

### 2.2. 表と図の一致は保てる

記述ガイドは「表の各行と図のデータストアノードを一対一に対応させ、名称を一致させます」と定める。表と図の**両方**を `実行計画 / plan` 形式へ揃えれば、この規則を満たす。片方だけ変更してはならない。

### 2.3. 現状の表記は不揃い

`cdfd-overview.md` の `主な内容` 列に英語名が混在している。

| データストア | `主な内容` の冒頭                   | 英語名 |
| ------------ | ----------------------------------- | ------ |
| 実行計画     | plan。タスクごとの実施手順…         | あり   |
| 実行記録     | result、状態遷移イベント、evidence… | あり   |
| 評価結果     | 完了条件の判定、grade、finding      | あり   |
| 登録簿       | 登録項目の個票、登録簿索引…         | なし   |
| 成果物       | プロジェクトで作成・更新する…       | なし   |
| 進捗報告     | ダッシュボード、クリティカルパス…   | なし   |

説明文に紛れており、対応を探しにくい。

### 2.4. 単一の英語名が決まらないものがある

| データストア      | 英語名                                    | 状態       |
| ----------------- | ----------------------------------------- | ---------- |
| Kata              | `kata`                                    | 1 対 1     |
| 成果物カタログ    | `catalog`                                 | 1 対 1     |
| 定期実行定義      | `routine`                                 | 1 対 1     |
| ジョブ定義        | `job`                                     | 1 対 1     |
| 登録簿            | `register`                                | 1 対 1     |
| 実行計画          | `plan`                                    | 1 対 1     |
| 成果物            | `deliverable`                             | 1 対 1     |
| 保管庫（trash）   | `trash`                                   | 名称に含む |
| Schedule（track） | —                                         | 既に英語   |
| 実行記録          | `result` / `event` / `evidence` / `trial` | **4 語**   |
| 評価結果          | `grade` / `finding`                       | **2 語**   |
| 稼働構成          | —                                         | **なし**   |
| 進捗報告          | —                                         | **未確定** |
| 派生ビュー・索引  | —                                         | **未確定** |

5 件で単一名が決まらない。`実行記録 / result` と書くと event や evidence を含まないように読め、誤解を生む。

### 2.5. 用語集が未作成である

カタログ `dct-glossary.yaml` は `gl-common`（用語集・共通）を定義するが、`docs/ja/product/010-business-specs/060-glossary/` は存在しない。概念名と英語名の対応は本来ここが正本であり、6 本の CDFD へ分散させると乖離する。

## 3. 完了条件

- 1 対 1 が確定している 8 件について、`cdfd-overview.md` のデータストア表と概念データフロー図の両方が `実行計画 / plan` 形式で併記されている。
- 他の CDFD（`cdfd-plan`、`cdfd-do`、`cdfd-check`、`cdfd-action`、`cdfd-orchestrator`、`cdfd-onboarding`、`cdfd-uc-*`）のデータストア名が同じ表記に揃っている。
- 表の行名と図のノード名が一致している。片方だけの変更になっていない。
- `cdfd-rulebook` の禁止事項に、概念の英語名は実装名に当たらない旨の注記がある。
- `cdfd-rulebook` の記述ガイドに、データストア名の併記規則がある。
- 単一名が決まらない 5 件は併記せず、用語集の確定を待つ旨が記録されている。
- `npm run -s lint:md` と `npm run docs:build` が通過している。
- grade を再実行し、`vp-arc-cross-document-consistency` の finding が増えていない。

## 4. 段階

| 段  | 内容                                                                     | 前提         |
| --- | ------------------------------------------------------------------------ | ------------ |
| 1   | 1 対 1 の 8 件を併記する。rulebook へ注記と記述ガイドを加える            | なし         |
| 2   | 単一名が決まらない 5 件の英語名を用語集（`gl-common`）で確定し、併記する | 用語集の作成 |

段 1 だけで大半が読みやすくなる。段 2 は別項目として起票する。

## 5. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                       |
| --- | ------------------------------------------- | ---- | ---- | -------------------------- |
| 1   | `cdfd-rulebook` へ注記と記述ガイドを加える  | ARC  | done | 禁止事項の変更ではなく注記 |
| 2   | `cdfd-overview.md` の表と図を併記形式へ     | ARC  | done | 表と図を同時に変更する     |
| 3   | 他の CDFD のデータストア名を揃える          | ARC  | done | 8 本を更新                 |
| 4   | 単一名が決まらない 5 件の扱いを記録する     | ARC  | done | 用語集での確定待ち         |
| 5   | grade を再実行し整合性の finding を確認する | QE   | open | 変更前との比較             |

## 6. 対応結果

- 1 対 1 の対応が確定している 8 件を `日本語名 / 英語名` 形式とし、全体概要、プロセスグループ別 CDFD 6 本、ユースケース別 CDFD 2 本のデータストア表・箇条書き・図・個別プロセス主要入出力で名称を一致させた。
- `cdfd-rulebook` の記述ガイドに併記規則を追加し、概念の英語名は物理テーブル名や実装クラスなどの実装名に該当しないことを禁止事項へ注記した。
- 実行記録、評価結果、稼働構成、進捗報告、派生ビュー・索引は単一の英語名が確定していないため併記せず、用語集での確定を待つ。
- grade の再実行と finding の比較は QE の確認作業として残している。

## 7. 関連ドキュメント

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`
- `docs/ja/specdojo/rulebooks/cdfd-rulebook.md`
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-glossary.yaml`
