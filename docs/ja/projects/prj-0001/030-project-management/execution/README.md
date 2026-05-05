# prj-0001 Execution Layout

このディレクトリは `docs/ja/projects/prj-0001/030-project-management/040-schedule` で定義した schedule を実行するための実行領域である。

## 1. ディレクトリ責務

```text
060-execution/
├─ exec/
│  ├─ events/
│  ├─ agent-briefs/
│  │  └─ claims/
│  │     ├─ index.md
│  │     └─ T-.../
│  └─ .locks/
└─ generated/
```

- `exec/events/`: append-only の実行イベント JSON
- `exec/agent-briefs/claims/`: claim 時点で固定保存する Agent ブリーフのスナップショット
- `exec/agent-briefs/claims/index.md`: task ごとの snapshot 件数と最新ファイルへのリンク
- `exec/.locks/`: scheduler の排他ロック
- `generated/`: `specdojo exec build` が生成する派生ファイル

## 2. 主な generated ファイル

`specdojo exec build --project shj-0001` 実行後、`generated/` に以下が出力される。

- `state.json`: task state snapshot（全 task の現在状態: todo/doing/blocked/done/cancelled）
- `ready.md`: 人間向け ready 一覧（strategy 別に整形済み）
- `ready.json`: strategy ごとの順序付き ready キュー
- `claim-next.json`: strategy ごとの次の claim 対象
- `cpm.json` / `cpm.md`: CPM 計算結果
- `critical-path.md`: クリティカルパスと slack 分析
- `agent-briefs/*.md`: ready になった task ごとの Agent 向け実行ブリーフ（進捗は持たず、primary_paths / secondary_paths と block テンプレートを含む）
- `timeline.md` / `timeline.svg`: プロジェクトタイムライン（Gantt-like 表示）
- `task-catalog.md`: task/milestone の人間向けカタログ（目的・依存・状態・CPM 指標）
- `schedule-diff.md`: スケジュールスキーマ差分（前回ビルドからの追加/削除/変更）
- `metadata.json`: 生成メタデータ（タイムスタンプ、schedule ファイル数、派生ファイル一覧）

## 3. Ready と Claim の見方

- 既定戦略は `critical-first`
- `ready.md` は人が読むための一覧
- `ready.json` は自動化が読むための順序付きキュー
- `claim-next.json` はその時点の claim 候補を strategy 別に固定して出す
- `generated/agent-briefs/*.md` は ready task の着手ガイド、`exec/agent-briefs/claims/index.md` は claim 済み snapshot の索引

`critical-first` は以下の順に選ぶ。

1. slack が小さい task
2. ES が小さい task
3. ID が昇順の task

## 4. CPM 指標の見方

`cpm.json` / `cpm.md` / `critical-path.md` に出てくる主な指標は以下。

- `ES`（Early Start）: 依存関係を満たした上で、最も早く開始できる時刻
- `EF`（Early Finish）: 最も早く完了できる時刻（`EF = ES + duration`）
- `LS`（Late Start）: プロジェクト完了時刻を遅らせずに開始できる最も遅い時刻
- `LF`（Late Finish）: プロジェクト完了時刻を遅らせずに完了できる最も遅い時刻
- `slack`（total float）: 遅延許容量（`slack = LS - ES = LF - EF`）

解釈の目安:

- `slack = 0` の task はクリティカルパス上にあり、遅れると完了日が遅れる
- `slack > 0` の task は、その値の範囲で開始/完了を後ろ倒しできる
- `critical-first` 戦略は slack が小さい task を優先して claim する

## 5. 基本コマンド

```bash
specdojo exec validate --project shj-0001
specdojo exec build --project shj-0001
specdojo exec scheduler --project shj-0001 --by agent-1
```

`specdojo exec where --project shj-0001` を使うと、schedule と execution の実パスを確認できる。
