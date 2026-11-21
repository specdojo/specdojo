---
specdojo:
  id: specdojo:pjr-rulebook
  type: rulebook
  deliverable_type: project
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

本ドキュメントは、プロジェクト登録簿の個別登録項目（`pjr-XXXX-<topic>.md`）、項目別イベントログ、そこから生成する一覧・派生ビューの記述ルールです。

## 1. 全体方針

- epic、TODO、要確認事項、リスク、課題、変更要求、決定事項、備忘の全登録項目は、それぞれ 1 件の個票を持つ。
- 個票 Frontmatter の現在値は、分類、処理状態、優先度、担当、日付、結論、起票元の唯一の正本である。
- `events/pjr-XXXX.yaml` は、起票・状態遷移・更新を追う監査履歴の正本である。現在値の再計算には使わず、個票の現在値との整合を検証する。
- 個票の H1 と本文は、それぞれタイトルと説明・根拠・経緯・対応内容の正本である。
- `generated/pjr-index.md` とすべての派生ビューは個票から `register build` で生成し、直接編集しない。
- `<project-id>:pjr-index` は `generated/pjr-index.md` の文書 ID とする。`controls/**/generated/` はdoc-indexの限定走査対象とし、`register build` の後に `index build` を実行する。
- 本書で登録項目の分類を指すときは `item_type` と書き、文書種別の `type`（`project`）と区別する。CLI の `--type` は `item_type` を指定する。
- 個票の template は `item_type` ごとに異なり、`register add` が `本文構成（標準テンプレ）` の表に従って選ぶ。Frontmatter の `template` は 1 件しか宣言できないため `not-needed` とし、対応は同表を正とする。
- 値の型と enum は `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`（個票）と `docs/specdojo/schemas/v1/register-events.schema.yaml`（イベント）、コマンドの選び方と例は [[specdojo:register-operation-guide|登録簿運用ガイド]] を正本とし、本書で言い直さない。
- **共通の運用**: 役割の割り当ては適用先のメンバー定義に、承認、改訂と廃止、未決事項の登録簿への引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従う。個票の `status` は register コマンドが `個票 status の遷移基準` に従って更新する。文書の整形・lint はリポジトリの検証で扱い、個票の完了条件に含めない。

## 2. ファイル命名・ID規則

### 2.1. ID規約

- 個別登録項目の表示 ID は `PJR-XXXX` 形式とする。`XXXX` には数字と英字から
  `I` / `L` / `O` / `U` を除いた4文字を使う。例: `PJR-AB12`。
- 個別登録項目の文書 ID は `<project-id>:pjr-XXXX-<topic>` 形式とする。例: `prj-0001:pjr-ab12-auth-boundary`。
- 個別登録項目のファイル名は `pjr-XXXX-<topic>.md` 形式とし、文書 ID のローカル部分と拡張子を除くファイル名を一致させる。
- 文書 ID とファイル名では `XXXX` を小文字にする。
- `<topic>` は英小文字または数字で始まり、英小文字・数字・単一ハイフンだけで構成し、
  ハイフンで終えたり連続ハイフンを含めたりしない。対象領域や論点が分かる短い名称にする。
- イベントファイル名は `pjr-XXXX.yaml` とし、topic を含めない。ID の小文字表記を用いる。

### 2.2. 配置規約

- 個票は `docs/ja/projects/<project-id>/controls/project-register/` 直下に置く。
- 項目別イベントログは同ディレクトリの `events/` 配下に置き、個票 1 件につき 1 ファイルとする。
- 登録項目一覧は `docs/ja/projects/<project-id>/controls/project-register/generated/pjr-index.md` に生成する。
- 状態別・優先度別・担当者別の補助一覧と、元の項目から派生先を辿る一覧は同じ `generated/` 配下に生成する。
- controls 全体の `item_type` 別管理ビューは `controls/generated/` に生成する。生成物の別名コピーは作らない。

## 3. 推奨 Frontmatter 項目

個票には schema が定義する次の項目を置く。未定の担当、期限、完了日時、結論はプレースホルダ（`_TODO_` など）を保存せず、該当キーを省略する（期限なしだけは `due_on: null`）。

| 項目              | 説明                                                                     | 必須        |
| ----------------- | ------------------------------------------------------------------------ | ----------- |
| `id`              | `<project-id>:pjr-XXXX-<topic>`                                          | ○           |
| `type`            | `project`                                                                | ○           |
| `status`          | 文書成熟度。`draft` / `ready` / `deprecated`                             | ○           |
| `rulebook`        | `specdojo:pjr-rulebook`                                                  | ○           |
| `part_of`         | `<project-id>:pjr-index` を要素に持つ配列                                | ○           |
| `item_type`       | 登録項目の分類                                                           | ○           |
| `track`           | epic が担う track。ほかの `item_type` では指定しない                     | epic で必須 |
| `domains`         | epic が対象とする domain の文字列配列。ほかの `item_type` では指定しない | 任意        |
| `item_status`     | 登録項目の処理状態                                                       | ○           |
| `priority`        | 対応優先度                                                               | ○           |
| `difficulty`      | agent 振り分け用の作業難易度                                             | 任意        |
| `owner`           | 主担当者または役割                                                       | 任意        |
| `registered_at`   | 起票日時                                                                 | 任意        |
| `due_on`          | 対応期限または判断期限                                                   | 任意        |
| `start_on`        | epic の予定開始日。ほかの `item_type` では指定しない                     | 任意        |
| `completed_at`    | 完了・却下・決定日時                                                     | 条件        |
| `block_reason`    | `waiting` へ遷移した直近の理由                                           | 任意        |
| `conclusion`      | 終端時の結論要約                                                         | 任意        |
| `derived_from`    | 起票の元になった登録項目 ID の配列                                       | 任意        |
| `depends_on`      | 実行前に完了しているべき先行の登録項目 ID の配列                         | 任意        |
| `approach`        | 対象を作成・修正するときの進め方                                         | 任意        |
| `target_path`     | カタログなしで作成する成果物のリポジトリ相対パス                         | 任意        |
| `target_rulebook` | 対象成果物の rulebook ID                                                 | 任意        |
| `targets`         | 変更対象文書の doc id リスト                                             | 任意        |

- `status` は文書成熟度、`item_status` は処理状態であり、同じ状態軸として扱わない。
- `difficulty` を省略した場合は agent を自動で選ぶ。
- `epic` は track ごとの全体計画の正本であり、自身は実行しない。`track` は英小文字・数字・ハイフンの識別子とし、先頭は英小文字または数字にする。同じ project 内の epic どうしで track を重複させず、epic の `track` は削除できない。`domains` を省略した場合だけ互換用 timeline へ範囲の解決を委ね、空配列は対象なしの明示指定とする。
- 全体計画の順序は epic 間の `depends_on`、範囲は `domains`、期間は `start_on`・着手・完了の記録と `due_on` から導く。epic 間の依存は循環させない。開始日・終了日の決め方は登録簿運用ガイドの `全体計画を確認する` に従う。
- `block_reason` は `waiting` 中の直近の待機・失敗理由、`conclusion` は終端時の結論として用途を分ける。`block_reason` は `waiting` 以外へ遷移すると現在値から削除され、削除前の理由はイベントログに残る。
- `derived_from` は同じ project の元項目を `PJR-XXXX`、別 project の元項目を `<project-id>:PJR-XXXX` で記録する。自己参照や存在しない項目、未設定の project は使用しない。別 project の存在確認は、その project のローカル統合ブランチを正とする。
- `depends_on` は実行順序、`derived_from` は起票の由来を表す。両者を相互に推測・転記しない。参照書式と存在確認は `derived_from` と同じとし、存在しない ID、自己参照、project をまたぐ循環を記帳前と `register build` で拒否する。
- すべての先行項目が `done` / `decided` のときだけ実行を許可する。`rejected` / `deferred` は依存を満たさない。依存を理由に状態を自動で `waiting` へ変更しない。

### 3.1. 日時と日付の使い分け

- 起票と、完了・決定・却下による終端は瞬間として記録し、`registered_at` / `completed_at` に UTC の RFC 3339・秒精度（`YYYY-MM-DDTHH:MM:SSZ`）で保存する。`deferred` は `completed_at` を持たない。
- 予定開始日と期限は瞬間ではなくプロジェクトタイムゾーン上の暦日であるため、`start_on` と `due_on` は `YYYY-MM-DD` のまま保持する。未定の `start_on` は省略する。
- 一覧・派生ビューの「登録日」「完了日」は、保存した日時をプロジェクトの登録日タイムゾーンへ変換して導出する表示値であり、個票へ日付として重複保存しない。
- 日時は register コマンドが記録し、後追いの入力もタイムゾーン付きの値から UTC へ変換して保存する。

### 3.2. Register event と責務境界

- 保存・配布・差分レビューは Git が担うが、Git コミットを履歴再構成の正本にしない。
- イベントファイルのルートは YAML 配列とし、イベントを古い順に追記する。項目ごとに配置し、異なる項目の並行更新で共有ログが競合しないようにする。
- イベントの項目と action は register-events schema に従い、各イベントは遷移前後の `item_status` と直前イベント ID で前のイベントにつなぐ。
- actor には、決定・承認した人の nickname、実行した agent、または予約 actor を記録する。`PO` などの Role code を actor にせず、`specdojo-orchestrator` で人の判断主体を代替しない。受け付ける名前は登録簿運用ガイドに従う。
- 同じ現在値へ同じ操作を再実行した場合は、新しいイベントを追加しない。既存イベントの置換や削除で重複を解消しない。
- `register build` は個票とイベントファイルの 1 対 1 対応、イベント ID の一意性、時刻順、直前イベント参照、遷移前後状態の連鎖、最新イベントの状態と個票の `item_status` の一致を検証する。不正なイベントを無視して一覧を生成しない。

## 4. 本文構成（標準テンプレ）

### 4.1. 個別登録項目

- H1 は `PJR-XXXX <タイトル>` 形式とする。
- 本文は `item_type` ごとの template の節（必須節）をこの順ですべて持つ。該当する内容がない節は削らず `-` を書く。
- 必須節を満たす判定は、本文のコード（インラインコード・コードブロック）の外に `_TODO_` が残っていないことである。`register close` はこの判定で `ready` へ昇格させるかを決める。

| `item_type`      | template                               | 必須節                                                                                     |
| ---------------- | -------------------------------------- | ------------------------------------------------------------------------------------------ |
| `epic`           | `specdojo:pjr-epic-template`           | 概要、範囲（track と domain）、完了の判断の基準、子項目、対応結果、関連ドキュメント        |
| `todo`           | `specdojo:pjr-todo-template`           | 概要、入力、完了条件、作業内容、対応結果、関連ドキュメント                                 |
| `question`       | `specdojo:pjr-question-template`       | 確認事項、入力、背景、回答候補、回答・結論、承認、関連ドキュメント                         |
| `decision`       | `specdojo:pjr-decision-template`       | 背景、検討した選択肢、決定内容、採択理由、承認、影響範囲とフォローアップ、関連ドキュメント |
| `note`           | `specdojo:pjr-note-template`           | メモ、背景・文脈、フォローアップ、関連ドキュメント                                         |
| `risk`           | `specdojo:pjr-risk-template`           | リスク内容、入力、影響評価、対応方針、モニタリング、関連ドキュメント                       |
| `issue`          | `specdojo:pjr-issue-template`          | 課題内容、入力、影響範囲、対応方針、対応結果、関連ドキュメント                             |
| `change-request` | `specdojo:pjr-change-request-template` | 変更要求、入力、影響評価、審査・決定、実施追跡、関連ドキュメント                           |

- `入力` 節には対話で得た前提・制約・委任範囲を箇条書きで残し、入力がない場合は `-` とする。完了条件・回答の確定条件とは分け、完了条件へ転記しない。既存個票に節がなくても読み込め、初回の入力更新時に節を追加する。
- 承認の節には承認者・承認方式・証跡を記録する。承認方式の選び方は登録簿運用ガイドに従う。
- `epic` の範囲には domain と境界、完了の判断の基準には子項目と schedule を確認する判断条件、対応結果には人が完了を判断した根拠を記録する。
- 子 todo は epic から起票し、`derived_from` に epic を記録する。epic 別ビューは直接の子だけを表示し、状態の自動集約や自動 close は行わない。
- 関連ドキュメントには、根拠、影響先、追跡先を文書 ID で示す。
- 終端前に未確定の結果・結論がある場合は、`-` または共通ラベルを用い、確定済みの記述と混在させない。

### 4.2. 生成一覧と派生ビュー

| 生成物                               | 内容                                 | 編集可否 |
| ------------------------------------ | ------------------------------------ | -------- |
| `generated/pjr-index.md`             | `depends_on` を含む全個票の一覧      | 不可     |
| `generated/pjr-views-by-status.md`   | 状態別の補助一覧                     | 不可     |
| `generated/pjr-views-by-priority.md` | 優先度別の補助一覧                   | 不可     |
| `generated/pjr-views-by-owner.md`    | 担当者別の補助一覧                   | 不可     |
| `generated/pjr-derived-items.md`     | 元項目と派生先の一覧                 | 不可     |
| `generated/pjr-epic-items.md`        | epic ごとの直接の子項目と状態        | 不可     |
| `generated/pjr-dependent-items.md`   | 先行項目から後続項目を逆引きする一覧 | 不可     |
| `controls/generated/pm-*.md`         | `item_type` 別の管理ビュー           | 不可     |

- 一覧の標準列は ID、ステータス、タイトル、説明、分類、優先度、担当、登録日、期限、完了日、結論、個票、`depends_on` とする。
- タイトルは個票の H1、説明は個票本文、その他の列は個票 Frontmatter から生成する。登録日と完了日は `日時と日付の使い分け` に従って導出する。
- 生成ビューに独自の詳細情報や手作業の修正を追加しない。修正は個票に行い、`register build` を再実行する。

## 5. 記述ガイド

### 5.1. 個票の記述

- 背景には、登録が必要になった事実、制約、判断または対応の期限を記載する。
- 評価や選択肢には、比較可能な観点と根拠を記載し、結論だけを先に固定しない。
- 対応・判断内容には、実施または採択した範囲と、明示的に対象外とした範囲を記載する。
- 結果・結論には、完了を判定した根拠と後続対応を記載する。
- 実行中に問題や後続作業を見つけて別の登録項目を起票するときは、起票元を `derived_from` に必ず記録する。decision から todo を起票する場合も同じ関係を使い、decision 本文へ追跡先を重複記載しない。既存本文の追跡先は移行のために書き換えない。
- 確実に変更する対象文書が分かっている場合は、その文書 ID を `targets` へ宣言する。`targets` は agent 実行時の変更網羅検証（target coverage）に使う。未知の場合や対象を固定しない場合は省略する。
- `approach` を宣言する場合、`targets` は 1 件だけ必須とする。成果物の対象はカタログを優先して解決し、カタログにない新規文書は `target_path` と `target_rulebook` を両方記録する。`*-maintenance` の対象は名前に対応する種別の kata の doc id とする。解決できない ID や、`approach` と種別が合わない対象は使用しない。approach ごとのカタログなしでの解決と拒否の条件は [[specdojo:ryu-guide|実践の進め方ガイド]] の `成果物カタログなしで進める` と [[specdojo:command-reference|CLIコマンドリファレンス]] に従う。

### 5.2. 構造化フィールドと生成

- 新しい項目は `register add` で作成し、全 `item_type` で個票を省略しない。
- 構造化フィールドは `register update`、処理状態は状態遷移コマンドで変更する。
- `register add`、状態遷移、`register update`、`register renumber` は現在値を個票へ、イベントを項目別ログへ記録する。一覧を編集して個票へ反映する経路はない。
- ID の変更は `register renumber`、主題の変化に伴う `<topic>` の変更は `register update --topic` で行い、個票のファイル名・文書 ID・他文書の参照と生成ビューを整合させる。

### 5.3. 登録項目の item_status 遷移基準

#### 5.3.1. item_type 別の item_status 終端基準

`item_status` の通常終端は、登録した目的を達成したときに使用する。

| `item_type`      | 通常終端  | 遷移条件                                                               | `conclusion` に残す内容      |
| ---------------- | --------- | ---------------------------------------------------------------------- | ---------------------------- |
| `epic`           | `done`    | 子項目と schedule を材料に、track の完了基準を満たすと人が判断した     | 判断の根拠と残課題           |
| `todo`           | `done`    | 個票に記載した完了条件をすべて満たした                                 | 実施内容と完了を確認した根拠 |
| `question`       | `decided` | 問いへの回答を確認し、後続作業の要否を判断できる                       | 確定した回答                 |
| `decision`       | `decided` | 選択肢、採択理由、影響を記録し、必要な承認を得た                       | 決定内容                     |
| `note`           | なし      | 終端させず、`open` のまま新しい事実・知見を追記する                    | 終端しないため使用しない     |
| `risk`           | `done`    | リスクが顕在化しないまま消滅した、または対応を終えて追跡が不要になった | 消滅・対応完了の根拠         |
| `issue`          | `done`    | 問題を解消し、必要な確認を終えた                                       | 解決内容と確認結果           |
| `change-request` | `done`    | 採択した変更を対象へ反映し、必要な確認を終えた                         | 反映内容と確認結果           |

- `epic` は todo と同じ処理状態と例外終端を使用する。`exec run --register` の実行対象にはせず、filter と夜間 queue も飛ばす。具体的な作業は子 todo で実行する。
- `note` の `open` は未対応を意味せず、継続して更新できる記録であることを示す。対応・回答・判断が必要になった場合は目的に合う別項目を起票し、陳腐化・置換された場合はその事実と参照先を追記する。note 自体は終端させない。

#### 5.3.2. 例外的な追跡終了

`note` 以外では、通常終端に達していなくても、次の条件で追跡を終了できる。

| `item_status` | 使用条件                                                                   | 記録要件                                         |
| ------------- | -------------------------------------------------------------------------- | ------------------------------------------------ |
| `rejected`    | 対応・回答・判断の対象外、前提不成立、または変更を採択しないことが確定した | 採択しない理由と、必要なら代替の追跡先を記録する |
| `deferred`    | 現時点の追跡を停止し、再開条件または再評価時期を定めた                     | 再開条件または再評価時期を記録する               |

- `rejected` は完了・決定の代用にせず、実施または採択しない判断が確定した場合だけ使う。`question` / `decision` で回答・決定を得た場合は `decided` とし、問い・判断自体が不要になった場合だけ `rejected` を使う。
- `deferred` は状態遷移上の終端だが、完了を意味しない。再開するときは `register reopen` を使う。
- `risk` を受容して監視を終える場合は、受容判断と残存影響を `conclusion` に記録したうえで `done` とする。リスクの前提が誤りだった場合は `rejected` とする。

#### 5.3.3. 中間状態を経ない終端

終端への遷移は、`in-progress` / `waiting` / `review` を経ていることを前提としない。`open` から直接終端させてよい。

- 人または対話型 orchestrator が着手を記録する前に完了した項目で、`start` を遡って記録しない。`exec run` の項目は runner が `start` を記録する。
- 中間状態を経ない場合は、誰がどの経路で対応したかを終端イベントの `reason` へ記録し、実施内容と検証結果を個票の対応結果へ残す（exec の plan / result / evidence がないため）。

### 5.4. 個票 status の遷移基準

| `status`     | 意味                                   | 遷移させる時点                                    |
| ------------ | -------------------------------------- | ------------------------------------------------- |
| `draft`      | 作成直後。必須節が未確定               | `register add` で個票を生成した時点               |
| `ready`      | 必須節が固まり `_TODO_` が残っていない | `register close` 時に必須節を満たすと判定した時点 |
| `deprecated` | 却下・破棄され成熟度を追う必要がない   | `register reject` 時点                            |

- 必須節とその判定は `個別登録項目` に従う。
- `reopen` は過去の結果を消さず、再開理由と新しい対応状況を個票本文へ追記する。

## 6. 禁止事項

- 生成された `pjr-index.md`、補助一覧、controls 全体の派生ビューを直接編集しない。
- 一覧と個票の同期、一覧から個票への書き戻し、または個票を作るかどうかの分離基準を設けない。
- 構造化フィールドを個票本文や別の正本へ重複管理しない。
- `item_type` / `item_status` / `priority` / `difficulty` に schema 未定義の値を使用しない。
- `registered_at` / `completed_at` に、UTC 以外のオフセットやタイムゾーンを伴わない値、暦日だけの値を保存しない。
- 個票の文書 ID から `<topic>` を省略したり、ファイル名と異なるローカル ID を使用したりしない。
- 必須節を、見出しだけ残した空欄のまま終端状態にしない。
- 実行していない主体を actor とする状態遷移を、記録の体裁を揃える目的で追加しない。
- `events/pjr-XXXX.yaml` を手書きで追加・修正・並べ替え・削除しない。履歴補正が必要な場合も register コマンドを使い、監査イベントを破壊しない。
