---
specdojo:
  id: prj-0001:xep-pjr-xw9m-20260928t103945z-9968
  type: exec-plan
  rulebook: none
  task_id: PJR-XW9M
  name: "オーケストレーター定義の種別表で note を終端しない記録に直す"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: DEV
---

# Edit Plan: PJR-XW9M オーケストレーター定義の種別表で note を終端しない記録に直す

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-XW9M「オーケストレーター定義の種別表で note を終端しない記録に直す」に対応する。

オーケストレーター定義の「登録簿（register）の使い方」にある type の表は、`note` の終端状態を `done` としている。一方、`pjr-rulebook.md` の type 別の扱い（157〜166 行）は、`note` を終端させず `open` のまま新しい事実・知見を追記し、`done` / `decided` / `rejected` / `deferred` へ遷移させないと定めている。`register-operation-guide.md` も「`note` は終端させない」としている。

## 2. 対象項目

- `id`: PJR-XW9M
- `type`: todo
- `priority`: medium
- `owner`: DEV
- `due`: _TODO_
- `登録簿`: `docs/ja/projects/prj-0001/controls/project-register/pjr-index.md`
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-xw9m-orchestrator-note-type-non-terminal.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/pjr-xw9m-20260928T103945Z-9968-result.md`

## 3. 進め方

1. 登録簿の該当行と個票（存在する場合）を読み、目的・完了条件・制約を把握する。
2. 個票に完了条件がある場合はそれを作業の基準にする。無い場合はタイトルと説明から完了条件の仮説を立て、その仮説を result に明記する。
3. 関連する成果物・設計書・実装を確認し、対象ファイルを特定して変更する。
4. 個票が存在する場合は、個票の作業内容・対応結果セクションを実施内容で更新する。
5. 判断に迷う箇所は _TODO_ / _ASSUMPTION_ で残し、根拠と次のアクションを result に書く。

### grade result から展開された finding

- [[specdojo:pjr-rulebook]] (サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pjr-rulebook.yaml`):
  - [major/vp-qe-verifiability; line=91; anchor="- type 固有の構成は `todo` の概要・完了条件・作業内容・対応結果など、各 type 用テンプレートに従う。"]: `ready` 昇格と終端可否は「type 固有の必須節」を満たすことに依存する一方、各 `item_type` の必須節・必須記入欄を本文で列挙せず参照 ID のない「各 type 用テンプレート」に委ねているため、必須条件の pass / fail を決定できる定義または解決可能な参照を追加する必要がある。
  - [major/vp-qe-omissions-consistency; line=1; anchor="# プロジェクト登録簿 作成ルール"]: 本文と schema は未定の owner / due を省略し、`deferred` では `completed_at` を持たない規則だが、`register-operation-guide.md` は Frontmatter に `_TODO_` を残し、`defer` 時にも完了日時を記録すると説明しているため、関連ガイドを正本と同じ保存規則へ修正しないと schema 違反または誤った履歴を生成する。
  - [minor/vp-qe-omissions-consistency; line=68; anchor="- 起票と終端は瞬間として記録し、`registered_at` / `completed_at` に UTC の RFC 3339・秒精度（`YYYY-MM-DDTHH:MM:SSZ`）で保存する。"]: 「起票と終端」を `registered_at` / `completed_at` に保存するとする記述は、`deferred` は終端だが `completed_at` を持たないとする後段の例外規則と整合しないため、`completed_at` の対象を完了・決定・却下に限定して記述する必要がある。
  - [major/vp-qe-kata-conformance; line=16; anchor="- type 別テンプレートの選択と初期生成は `register add` が担うため、本 rulebook は単一の template を参照しない。"]: Frontmatter の `template: not-needed` は template が不要であることを表す一方、本文は `register add` が type 別 template を選択すると定め、実在する `pjr-*-template` 群もこの rulebook を参照しているため, 複数 template を表せるメタデータまたは解決可能なディスパッチ定義で対応関係を宣言する必要がある。
  - [minor/vp-ux-readability; line=1; anchor="# プロジェクト登録簿 作成ルール"]: `register-item-frontmatter.schema.yaml` と `register-events.schema.yaml` がファイル名だけで参照先パスまたはリンクを持たず、コマンドの選択基準を扱う register operation guide への案内もないため, 初見の読者が次に確認すべき正本へ直接移動できる導線を追加する必要がある。
  - [minor/vp-ux-language-consistency; line=193; anchor="- `type` / `item_status` / `priority` に schema 未定義の値を使用しない。"]: `type` は文書種別 `project`、`item_type` は登録項目分類として区別しているのに、禁止事項を含む複数箇所で登録項目分類を裸の「type」と表記しており両者を混同し得るため、`item_type` または「CLI の type は `item_type` を指す」という定義へ統一する必要がある。
- [[specdojo:register-operation-guide]]: finding なし

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result に記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

## 4. 完了手順

1. 「進め方」に従って対応を完了する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result に実施内容・変更ファイル・申し送りを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。
4. 登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない。状態遷移（review / close など）は runner と人間が行う。

## 5. 異常終了の条件

- 前提不足・対象ファイル不明・静的検査未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は登録簿の状態を変更せず、終了コードと標準エラー出力で runner に結果を返す。

## 共通: 記法・成果物規約

この規約は、生成される全 exec plan に共通で適用される。result の完了条件、他文書を参照する際のリンク記法、成果物の状態（status）の扱いを統一する。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 成果物に変更が不要と判断した場合でも、result の記入は省略しない。変更不要と判断した理由と根拠を result に記入してから完了する。
- result が未記入・プレースホルダのまま終了コード 0 で終了すると、runner は成果物未完了（block）として扱い、タスクはやり直しになる。完了前に result の記入漏れがないことを必ず確認する。
- result の frontmatter は scaffold 済みの構造を正本とする。`id` / `task_id` / `mode` / `project_id` / `plan_ref` / `agent` / `execution` / `approach` / `targets` はキーの追加・削除・改名をせず、scaffold された値のまま維持する。見出し構成（`# Edit Result` などの H1、`## 1.` 以降の章立て）も独自の構成に置き換えない。埋めるのは本文セクションの `_TODO_` プレースホルダの中身だけである。`status` と `completed_at` は完了処理（runner 側）が更新するため、自分で書き換えない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- Markdown の自由記述では、`_` を含む識別子・フィールド名（例: `depends_on`）を必ずインラインコードで囲む。result に描画される executor evidence や reporter の自由記述も同じ記法にする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- plan に「プロジェクトコンテキスト」章がある場合、そこに挙がる文書はプロジェクト共通の前提を読むための参照であり、成果物 frontmatter の `based_on` へ転記しない。参照して得た前提は本文の記述内容へ反映する。
- 成果物 frontmatter の `based_on` に書けるのは、その成果物の `depends_on` の推移閉包に含まれる先行成果物だけである。閉包外の ID を書くと `catalog validate` が「`based_on` が `depends_on` の推移閉包に含まれていません」としてエラーになり、コミットがブロックされる。`based_on` を増やす必要が生じた場合は、自分で転記せず、根拠不足として result に記録する。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 編集・書き込みが作業ディレクトリ外（`external_directory`）として拒否された場合、原因はパス指定の誤り（誤った絶対パス・ディレクトリ名の取り違え）である。bash の heredoc などへ回避的に切り替えず、相対パスに直したうえで同じ編集ツールで再実行する。
- 作業用のファイル（編集用スクリプト、検証用の一時データなど）はリポジトリの外（一時ディレクトリ）に置き、終了前に削除する。リポジトリ内、とくにリポジトリ直下に作業用のファイルを作らない。成果物ではない新規ファイルは commit されず、`commit-scope:` の警告として記録される。
- 整形・静的検査は、この plan の完了手順または本共通規約で明示されたコマンドを実行する。変更対象に必要な test、build、schema 検証は、plan に個別記載がなくても実行してよい。同じ test script では対象限定と全件を同一 executor run 内で連続実行せず、どちらか一方に絞る。下表、plan、またはプロジェクト標準が全件 test を求める場合は、全件を1回だけ実行して対象限定の実行を省く。この制約は executor が sandbox 内で実行する test script の回数に対するものであり、親検証に設定された ID のコマンドは対象外である（親 runner が別途実行する）。実行したコマンド・対象・結果は result に記録する。
- executor / reporter pipeline で親 runner の検証が設定されている場合、executor は設定済み ID に対応するコマンドを sandbox 内で実行せず、executor 終了後に親 runner が固定許可リストから実行して evidence へ追記する。`validate-schema` は `npm run validate:schema`、`test-unit` は `npm run test:unit`、`test-integration` は `npm run test:integration` に対応する。executor は親検証と同じコマンドの対象限定版も追加せず、二重実行しない。
- Markdown 成果物を編集した後は、`npx prettier --write <対象ファイル>` で整形し、`npx markdownlint <対象ファイル>` で静的検査を実施する。検査でエラーが出た場合は修正してから完了とする。
- 終了する前に、コミット時に実行される検査（pre-commit 相当）を先回りで実行し、失敗をすべて修正してから完了する。コミット時に初めて失敗が判明すると commit がブロックされ、成果物の内容が完成していてもタスクは block になる。
- 実行対象は、変更したファイルの種別で判断する。下表のうち、変更したファイルが該当する行の検査をすべて実行する。該当行がない場合は追加の検査は不要である。ただし親検証に設定された ID のコマンドは下表よりも優先し、executor は実行しない。下表に同じコマンドが挙がっていても、親 runner の実行に委ねる。
- 検査コマンドの正本はリポジトリの hook 設定（`lefthook.yml` など）である。下表と設定が食い違う場合は設定側に合わせ、実行したコマンドと結果を result に記録する。`specdojo` コマンドは、リポジトリで定められた起動方法（`npx tsx src/specdojo.ts <subcommand>` など）で実行する。

| 変更したファイル                                                                                       | 実行する検査                                                                                                                          |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `*.md`                                                                                                 | `npx prettier --write <対象ファイル>`、`npx markdownlint <対象ファイル>`                                                              |
| `*.ts` / `*.js` / `*.json` / `*.yaml` / `*.yml`                                                        | `npx prettier --write <対象ファイル>`                                                                                                 |
| `src/`、`tests/`、`scripts/`、`tools/`、`tsconfig*.json`                                               | `npm run typecheck`                                                                                                                   |
| `src/`、`tests/`、`docs/ja/specdojo/templates/`、`docs/ja/specdojo/exec-templates/`、`vitest.config.*` | pipeline executor は `npm run test:unit`、それ以外は `npm test`（`test-unit` が親検証に設定されている場合は executor では実行しない） |
| `docs/ja/projects/` 配下                                                                               | `specdojo catalog validate`                                                                                                           |
| `dct-*.yaml`                                                                                           | `specdojo catalog build`                                                                                                              |
| `pjr-index.md`                                                                                         | `specdojo register build`                                                                                                             |
| `sch-*.yaml`                                                                                           | `specdojo exec refresh`                                                                                                               |
| `docs/` 配下                                                                                           | `specdojo index build`                                                                                                                |
