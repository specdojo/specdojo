---
specdojo:
  id: prj-0001:xep-t-business-specs-kata-bes-task-ready-selected-080-20261110t043653z-c73b028d
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-KATA-bes-task-ready-selected-080
  name: "冗長さの整理"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: condense
  targets:
    - bes-task-ready-selected
---

# Condense Plan: T-BUSINESS-SPECS-KATA-bes-task-ready-selected-080

## 1. このフェーズで行うこと

bes・br の代表成果物について、判断に要る背景・制約・例外・完了条件と意味を保って重複を整理する。型と代表の説明を二重に持たず、参照でつなぐ。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

既存の 1 文書の中の冗長さを直す。内容を書き足す最後の edit（標準では磨き込み）の後、review の前に実行する。文書をまたぐ重複の整理は `cross-deliverable-dedup` に委ねる。

## 2. 対象と参照

- `name`: 業務イベント仕様（実行可能タスクの選択）
- `path`: `docs/ja/product/010-business-specs/030-business-model/bes-task-ready-selected.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/bes-rulebook.md`
- `recipe`: `docs/ja/specdojo/recipes/bes-recipe.md`
- `sample`: `docs/ja/specdojo/samples/bes-sample.md`
- `template`: `docs/ja/specdojo/templates/bes-template.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-KATA-bes-task-ready-selected-080/T-BUSINESS-SPECS-KATA-bes-task-ready-selected-080-20261110T043653Z-c73b028d/result.md`

判定の正本は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-arc-conciseness`。対象の rulebook と完了条件、原因の根拠に必要な宣言済み Kata だけを読む。ほかの文書は変更しない。

owner として達成する狙い:

- イベント処理実装・メッセージ設計の基礎として参照できること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [BA] イベント内容・発生条件・タイミングが業務観点で正確に記述されていること
- [PO] イベント仕様の業務的妥当性を承認できること
- [QE] イベントテスト設計への活用が確認できること
- [DEV] イベントハンドラ・パブリッシャー実装の参照として使えること

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

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
