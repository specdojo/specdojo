---
specdojo:
  id: prj-0001:xep-t-stsd-pilot-stsd-deliverable-080
  type: exec-plan
  rulebook: none
  task_id: T-STSD-PILOT-stsd-deliverable-080
  name: "冗長さの整理"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  on_critical_path: true
  approach: condense
  targets:
    - prj-0001:stsd-deliverable
---

# Condense Plan: T-STSD-PILOT-stsd-deliverable-080

## 1. このフェーズで行うこと

PJR-PT5N（[[prj-0001:pjr-pt5n-stsd-kata-confirm]]）で確定した stsd の Kata に従う。
図は [[specdojo:stsd-mermaid-rulebook]] の閾値を超える場合だけ分け、小さな図は分けない。
1 文書の冗長さを削る・まとめる・参照に置き換える。判断に要る背景・制約・例外・完了条件と意味を保ち、新しい内容を足さず、修正・保持した箇所と原因を result に記録する。

既存の 1 文書の中の冗長さを直す。内容を書き足す最後の edit（標準では磨き込み）の後、review の前に実行する。文書をまたぐ重複の整理は `cross-deliverable-dedup` に委ねる。

## 2. 対象と参照

- `name`: ステータス定義（成果物）
- `path`: `docs/ja/product/010-business-specs/020-data-model/stsd-deliverable.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/stsd-rulebook.md`
- `recipe`: `docs/ja/specdojo/recipes/stsd-recipe.md`
- `sample`: `docs/ja/specdojo/samples/stsd-sample.md`
- `template`: `docs/ja/specdojo/templates/stsd-template.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/T-STSD-PILOT-stsd-deliverable-080-result.md`

判定の正本は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-arc-conciseness`。対象の rulebook と完了条件、原因の根拠に必要な宣言済み Kata だけを読む。ほかの文書は変更しない。

owner として達成する狙い:

- ステータス名・意味・成立条件と、遷移・イベント・条件が業務観点で正確に定義されていること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [PO] 状態遷移の業務的妥当性を承認できること
- [ARC] 状態遷移実装の基礎として参照できること
- [QE] 状態ベースのテスト設計に活用できること
- [DEV] 状態管理実装の参照として使えること

## 3. 進め方

1. 対象文書を読み、繰り返し（`repetition`）、表と本文の二重の説明（`table-prose`）、図をなぞる文（`figure-prose`）、目的に要らない背景（`unneeded-background`）、正本の再掲（`canonical-restatement`）の候補を場所ごとに洗い出す。判定は上記の観点の正本で確かめる。
2. 判断に要る背景・制約・例外・完了条件は残す。長さだけで削らず、内容・決定・完了条件の意味を変えない。新しい内容を足さない。
3. 候補ごとに削る（`delete`）・まとめる（`merge`）・既存の正本への参照に置き換える（`reference`）のどれかで直す。残す必要がある候補は `retain` として理由を記録する。
4. 原因は `FindingCause` の `document` または `kata` とする。`kata` は宣言済み Kata の種類（`kind`）と根拠の箇所（`location`）を示せる場合だけ使い、示せない場合は `document` とする。Kata 自身は編集しない。
5. 修正前の場所・種類・直し方・意味を保った根拠または残した理由・原因を 1 件ずつ記録し、必須情報が維持されたことを確認する。候補がなければ変更不要の理由を報告する。

## 4. result への記録

[[specdojo:plan-result-lifecycle-guide]] の condense の記録形式に従い、result の frontmatter の `condense_records` と本文の表を対応させる。リストが空の場合も `[]` を明示する。

pipeline executor は result を編集せず、最終報告の `<specdojo_executor_evidence>` 内に `condense_records` を追加する。各要素は `location`、`category`、`action`、`reason`、`cause` の 5 項目とし、原因は `{"type":"document"}` または `{"type":"kata","kind":"recipe","location":"見出し・行・引用"}` の形で書く。runner が検証し、frontmatter と表へ同じ記録を転記する。

## 5. 完了手順

1. 対象文書だけを修正し、意味と必須情報が維持されたことを確認する。
2. 共通規約に従って整形・静的検査を行う。
3. 修正・保持の記録と検証結果を報告する。単独実行では result の必須セクションを埋める。

## 6. 異常終了の条件

- 対象が未作成・対象が複数・意味の維持を判断できない・静的検査未解消の場合は終了コード 1 とし、理由・根拠・次の行動を報告する。
- 標準エラー出力には `blocked: <reason>; need=<next action>; ref=<path>` を記録する。状態遷移は runner が行う。

## 共通: 記法・成果物規約

作業を始める前に、共通の規約の詳細 `docs/ja/specdojo/exec-templates/xp-common-conventions-template.md`、`docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` を読み、その内容に従う。次の箇条書きは、そのうち守らないと失敗に直結する要点である。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- Markdown の自由記述では、`_` を含む識別子・フィールド名（例: `depends_on`）を必ずインラインコードで囲む。result に描画される executor evidence や reporter の自由記述も同じ記法にする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 検査を実行する前に、リポジトリの `package.json`、`.specdojo/specdojo.config.json`、hook 設定（`lefthook.yml` など）を読み、本共通規約の詳細にある検査表の適用条件で、実行する検査を決める。
- 適用条件を満たさない検査は実行せず、executor evidence の validations に `not_applicable` と非適用の理由を `reason` へ記録する。適用される検査が 1 つもない場合も同じく、該当する検査ごとに `not_applicable` と理由を記録する。
- `not_run` は、適用される検査を実行できたのに実行しなかった場合だけに使う。runner は `not_run` を検証失敗として扱い、タスクを先へ進めない。
- `pipeline.parent_validations` に設定された検査は executor evidence の validations に含めなくてよい。executor が同じ検査を `not_run` または `not_applicable` として含めても、同じリポジトリで実行した親 runner の結果を正とする。
- 冗長さの判定は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-arc-conciseness` を正本とする。
- 同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲は書かず、既存の記述は削る・まとめる・参照に置き換える。
- 判断に要る背景・制約・例外・完了条件は残し、長さだけでは削らない。
