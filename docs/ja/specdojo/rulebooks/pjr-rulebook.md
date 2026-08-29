---
specdojo:
  id: specdojo:pjr-rulebook
  type: rulebook
  status: ready
  target_format: markdown
  recipe: not-needed
  sample: not-needed
  template: not-needed
  based_on:
    - specdojo:rulebook-authoring-standard
  supersedes:
    - pjr-index-rulebook
---

# プロジェクト登録簿 作成ルール

Project Register Documentation Rules

本ドキュメントは、プロジェクト登録簿の個別登録項目（`pjr-XXXX-<topic>.md`）と、そこから生成する一覧・派生ビューの記述ルールです。構造化フィールドの正本は必ず個票の Frontmatter とし、一覧は表示専用の生成物として扱います。

## 1. 全体方針

- TODO、要確認事項、リスク、課題、変更要求、決定事項、備忘の全登録項目は、それぞれ 1 件の個票を持つ。
- 個票 Frontmatter の現在値は、分類、処理状態、優先度、担当、日付、結論の唯一の正本である。
- 同じ個票 Frontmatter の `register_events` は、起票・状態遷移・更新を追う監査履歴の正本である。現在値の再計算には使わず、現在値との整合を検証する。
- 個票の H1 と本文は、それぞれタイトルと説明・根拠・経緯・対応内容の正本である。
- `generated/pjr-index.md` とすべての派生ビューは個票から `register build` で生成し、直接編集しない。
- `<project-id>:pjr-index` は `generated/pjr-index.md` の文書 ID とする。`controls/**/generated/` はdoc-indexの限定走査対象とし、`register build` の後に `index build` を実行する。
- 一覧と個票で同じ構造化フィールドを保持・同期する規則は設けない。
- type 別テンプレートの選択と初期生成は `register add` が担うため、本 rulebook は単一の template を参照しない。

## 2. ファイル命名・ID規則

### 2.1. ID規約

- 個別登録項目の表示 ID は `PJR-XXXX` 形式とする。例: `PJR-AB12`。
- 個別登録項目の文書 ID は `<project-id>:pjr-XXXX-<topic>` 形式とする。例: `prj-0001:pjr-ab12-auth-boundary`。
- 個別登録項目のファイル名は `pjr-XXXX-<topic>.md` 形式とし、文書 ID のローカル部分と拡張子を除くファイル名を一致させる。
- `<topic>` は英小文字・数字・ハイフンのみとし、対象領域や論点が分かる短い名称にする。

### 2.2. 配置規約

- 個票は `docs/ja/projects/<project-id>/controls/project-register/` 直下に置く。
- 登録項目一覧は `docs/ja/projects/<project-id>/controls/project-register/generated/pjr-index.md` に生成する。
- 状態別・優先度別・担当者別の補助一覧は同じ `generated/` 配下に生成する。
- controls 全体の type 別管理ビューは `controls/generated/` に生成する。生成物の別名コピーは作らない。

## 3. 推奨 Frontmatter 項目

個票には `register-item-frontmatter.schema.yaml` が定義する次の項目を置く。未定の担当、期限、完了日時、結論は表用のプレースホルダを保存せず、該当キーを省略する（期限なしだけは `due_on: null`）。

| 項目              | 説明                                         | 必須 |
| ----------------- | -------------------------------------------- | ---- |
| `id`              | `<project-id>:pjr-XXXX-<topic>`              | ○    |
| `type`            | `project`                                    | ○    |
| `status`          | 文書成熟度。`draft` / `ready` / `deprecated` | ○    |
| `rulebook`        | `specdojo:pjr-rulebook`                      | ○    |
| `part_of`         | `<project-id>:pjr-index` を要素に持つ配列    | ○    |
| `item_type`       | 登録項目の分類                               | ○    |
| `item_status`     | 登録項目の処理状態                           | ○    |
| `priority`        | 対応優先度                                   | ○    |
| `owner`           | 主担当者または役割                           | 任意 |
| `registered_at`   | 起票日時                                     | 任意 |
| `due_on`          | 対応期限または判断期限                       | 任意 |
| `completed_at`    | 完了・却下・決定日時                         | 条件 |
| `block_reason`    | `waiting` へ遷移した直近の理由               | 任意 |
| `conclusion`      | 終端時の結論要約                             | 任意 |
| `register_events` | 起票・状態遷移・更新の追記型イベント配列     | 任意 |

- `status` は文書成熟度、`item_status` は処理状態であり、同じ状態軸として扱わない。
- `item_type`、`item_status`、`priority` の値は schema の enum だけを使用する。
- `block_reason` は途中の待機・失敗理由、`conclusion` は終端時の結論として用途を分ける。`register wait --reason` は前者だけを更新する。
- Frontmatter の構造化フィールドを本文や生成一覧へ手作業で複製しない。

### 3.1. 日時と日付の使い分け

- 起票と終端は瞬間として記録し、`registered_at` / `completed_at` に UTC の RFC 3339・秒精度（`YYYY-MM-DDTHH:MM:SSZ`）で保存する。
- 期限は瞬間ではなくプロジェクトタイムゾーン上の暦日であるため、`due_on` は `YYYY-MM-DD` のまま保持する。
- 一覧・派生ビューの「登録日」「完了日」は、保存した日時をプロジェクトの登録日タイムゾーンへ変換して導出する表示値であり、個票へ日付として重複保存しない。
- 日時は register コマンドが記録する。手書きで日時を入力する場合も、タイムゾーンを含む値から UTC へ変換した値だけを保存する。

### 3.2. Register event と責務境界

- 個票の現在値は `item_status` などの通常フィールド、変更履歴は `register_events`、保存・配布・差分レビューは Git が担う。Git コミットはイベントの発生単位ではなく、履歴再構成の正本にしない。
- イベントは個票ごとの配列へ古い順に追記する。項目ごとの配置により、イベントごとの追加ファイルを作らず、異なる項目を並行更新したときの共有ログ競合を避ける。
- 各イベントは version、イベント ID、UTC 発生日時、action、actor、遷移前後の `item_status`、reason、変更フィールド、直前イベント ID を保持する。Git から移行したイベントだけは移行元 commit も保持できる。
- action は `add` / `start` / `wait` / `review` / `close` / `reject` / `defer` / `reopen` / `update` / `renumber` / `migrate` のいずれかとする。詳細な型と enum は `register-item-frontmatter.schema.yaml` を正本とする。
- `register build` はイベント ID の一意性、時刻順、直前イベント参照、遷移前後状態の連鎖、最新イベントと現在値の一致を検証する。不正なイベントを無視して一覧を生成しない。

## 4. 本文構成（標準テンプレ）

### 4.1. 個別登録項目

| 順序 | 内容             | 必須 | 説明                                   |
| ---- | ---------------- | ---- | -------------------------------------- |
| 1    | type 固有の記録  | ○    | 対象、背景、評価、対応・判断、結果など |
| 末尾 | 関連ドキュメント | ○    | 根拠、影響先、追跡先を文書 ID で示す   |

- H1 は `PJR-XXXX <タイトル>` 形式とする。
- type 固有の構成は `todo` の概要・完了条件・作業内容・対応結果など、各 type 用テンプレートに従う。
- ID、分類、処理状態、優先度、担当、期限、完了日時は本文へ重複記載せず、Frontmatter を参照する。
- 終端前に未確定の結果・結論がある場合は、`-` または共通ラベルを用い、確定済みの記述と混在させない。

### 4.2. 生成一覧と派生ビュー

| 生成物                               | 内容                | 編集可否 |
| ------------------------------------ | ------------------- | -------- |
| `generated/pjr-index.md`             | 全個票の一覧        | 不可     |
| `generated/pjr-views-by-status.md`   | 状態別の補助一覧    | 不可     |
| `generated/pjr-views-by-priority.md` | 優先度別の補助一覧  | 不可     |
| `generated/pjr-views-by-owner.md`    | 担当者別の補助一覧  | 不可     |
| `controls/generated/pm-*.md`         | type 別の管理ビュー | 不可     |

- 一覧の標準列は ID、ステータス、タイトル、説明、分類、優先度、担当、登録日、期限、完了日、結論、個票とする。
- タイトルは個票の H1、説明は個票本文、その他の列は個票 Frontmatter から生成する。
- 登録日と完了日の列は、`registered_at` / `completed_at` をプロジェクトの登録日タイムゾーンへ変換した暦日として生成する。
- 生成ビューに独自の詳細情報や手作業の修正を追加しない。修正は個票に行い、`register build` を再実行する。

## 5. 記述ガイド

### 5.1. 個票の記述

- 背景には、登録が必要になった事実、制約、判断または対応の期限を記載する。
- 評価や選択肢には、比較可能な観点と根拠を記載し、結論だけを先に固定しない。
- 対応・判断内容には、実施または採択した範囲と、明示的に対象外とした範囲を記載する。
- 結果・結論には、完了を判定した根拠と後続対応を記載する。
- 関連ドキュメントには、判断根拠、変更対象、影響先、追跡先のうち該当する文書を記載する。

### 5.2. 構造化フィールドと生成

- 新しい項目は `register add` で作成し、個票の Frontmatter に初期値を書き込む。全 type で個票を省略しない。
- 担当・期限・結論・topic などを変更するときは `register update`、処理状態を変えるときは状態遷移コマンドを使用する。待機理由は `register wait --reason` で記録する。
- `register build` は個票を読み取り、一覧・派生ビューを再生成する。一覧を編集して個票へ反映する経路はない。
- `register add`、状態遷移、`register update`、`register renumber` は現在値とイベントを同じ個票更新で記録する。`--by` で actor、`--reason` で理由を明示でき、省略時もコマンドが既定値を記録する。
- 同じ現在値へ同じ操作を再実行した場合は、新しいイベントを追加しない。イベント ID と直前イベント参照を保ったまま再実行し、既存イベントの置換や削除で重複を解消しない。
- ID の変更は `register renumber` で行い、個票のファイル名・Frontmatter・参照と生成ビューを整合させる。
- 主題の変化に伴う `<topic>` の変更は `register update --topic` で行う。個票のファイル名と Frontmatter の文書 ID、他文書中の旧文書 ID 参照を同時に更新し、生成ビューを再生成する。

### 5.3. 個票 status の遷移基準

| `status`     | 意味                                              | 遷移させる時点                                    |
| ------------ | ------------------------------------------------- | ------------------------------------------------- |
| `draft`      | 作成直後。type 固有の必須節が未確定               | `register add` で個票を生成した時点               |
| `ready`      | type 固有の必須節が固まり `_TODO_` が残っていない | `register close` 時に必須節を満たすと判定した時点 |
| `deprecated` | 却下・破棄され成熟度を追う必要がない              | `register reject` 時点                            |

- 遷移は register コマンドが担い、個票 Frontmatter を直接手書きで書き換えない。
- `ready` への昇格には、type 固有の必須節に `_TODO_` が残っていないことを要する。
- `reopen` は過去の結果を消さず、再開理由と新しい対応状況を個票本文へ追記する。

## 6. 禁止事項

- 生成された `pjr-index.md`、補助一覧、controls 全体の派生ビューを直接編集しない。
- 一覧と個票の同期、一覧から個票への書き戻し、または個票を作るかどうかの分離基準を設けない。
- 構造化フィールドを個票本文や別の正本へ重複管理しない。
- `type` / `item_status` / `priority` に schema 未定義の値を使用しない。
- `registered_at` / `completed_at` に、UTC 以外のオフセットやタイムゾーンを伴わない値、暦日だけの値を保存しない。
- 個票の文書 ID から `<topic>` を省略したり、ファイル名と異なるローカル ID を使用したりしない。
- type 固有の必須内容を、見出しだけ残した空欄のまま終端状態にしない。
- `register_events` を手書きで追加・修正・並べ替え・削除しない。履歴補正が必要な場合も register コマンドを使い、監査イベントを破壊しない。
