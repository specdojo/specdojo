---
specdojo:
  id: prj-0001:xer-t-kata-slim-bes-task-ready-selected-040-20261117t171856z-07591526
  type: exec-result
  task_id: T-KATA-SLIM-bes-task-ready-selected-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-bes-task-ready-selected-040/T-KATA-SLIM-bes-task-ready-selected-040-20261117T171856Z-07591526/plan.md
  started_at: "2026-11-17T17:19:02.158Z"
  completed_at: "2026-11-17T17:46:51.000Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - bes-task-ready-selected
    - specdojo:bes-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/bes-rulebook.md` から、どの成果物にも共通する文書運用の記述を外し、共通の正本への参照に置き換えた。
- 全体方針に「共通の運用」を1項目だけ置いた。役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎはメタ情報標準を参照する。
- 空白を除いた文字数は5,899字から3,887字になった（65.89%、約34%減）。目安の8割以下を満たす。
- 変更したのは rulebook だけで、成果物本体・recipe・template・sample は変更していない。
- executor の `prettier --check` と `git diff --check` は通過した。runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` も通過した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/bes-rulebook.md`: 役割の段落、status の draft 維持・ready 昇格・承認・改訂廃止の手順、共通の禁止事項と記法規約を削除した。全体方針に「共通の運用」を1項目追加し、共通の正本を参照させた。未決事項は論点・利用への影響・当面の扱いに絞った。用語の表は位置づけの箇条書きにまとめ、相関情報と個別イベント・実行の識別子の違いは残した。章名、本文要件8行の記述対象と必須・条件付き区分、Frontmatter、型固有の判断基準、禁止事項、受入確認は維持した。

## 3. 申し送り

- recipe・template・sample に、文書承認・担当・期限・記録先といった管理記述が残っている。これらは今回の範囲外で未変更。後続で次のように整理することを提案する。`bes-recipe` は「このレシピの使い方」「作成前に集める情報」「全体の作成手順」「良い例 / 悪い例」「レビュー観点」「仕上げチェック」を整理する。`bes-template` は「何が起きたか」の公開承認指示と「発生条件」の未決事項指示から管理項目を外す。`bes-sample` は「何が起きたか」の文書承認・照合担当・記録先の段落を整理する。構造・必須項目・禁止事項は改訂した rulebook を正とする。
- Rulebook 記述標準の「記述ガイド」には、各 rulebook で役割分担を定義する指示が残っている。共通運用をメンバー定義とメタ情報標準へ委ねる方針に合わせた修正案として、ここに残す。今回はタスクの指示どおり、対象 rulebook だけを改訂した。
- result の実施内容・変更ファイルへ記録する事項: `docs/ja/specdojo/rulebooks/bes-rulebook.md` の役割段落、status・承認・改訂廃止の手順、共通の禁止事項と記法規約を削除し、全体方針に「共通の運用」を1項目追加した。未決事項は論点・利用への影響・当面の扱いに絞った。成果物本体・recipe・template・sample・result は編集していない。
- 判断根拠: [[prj-0001:pjr-8s4t-sld-kata-slim-pilot|SLD凝縮試行]] の「他の型へ広げるときの一覧」、[[specdojo:sld-rulebook|SLD作成ルール]]、[[specdojo:rulebook-authoring-standard|Rulebook記述標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-arc-conciseness` を実読した。役割は適用先のメンバー定義へ、承認・ライフサイクル・未決事項の引き継ぎはメタ情報標準へ委ねた。
- 成果物との照合根拠: [[prj-0001:bes-task-ready-selected|実行可能タスクの選択]]、[[prj-0001:bes-index|業務イベント一覧]]、[[prj-0001:cdfd-overview|概念データフロー図]]、[[stsd-task-execution|タスク実行の状態定義]]、[[specdojo:bes-sample|BES完成例]]、[[prj-0001:xrr-t-business-specs-kata-bes-task-ready-selected-090-20261110t070500z-bca8376d|先行レビュー結果]] を確認した。対象範囲と適用未判定の区別、要求・確定・後処理の境界、相関の単位、発生時点で観測可能なデータ、確認例の判定基準を維持した。先行レビューの業務上の未解決事項を、本タスクで解消したとは扱わない。
- 大きさ: ファイル全体から空白・改行を除外して5,899字→3,887字（65.89%、34.11%削減）。SLD試行に合わせ表の区切り行も除く場合は5,427字→3,563字（65.65%）。章名、本文要件8行の記述対象と必須・条件付き区分、Frontmatter は変更なし。用語の表は位置づけの箇条書きへまとめ、相関情報と個別イベント・実行の識別子の違いは残した。
- 後続の変更案: [[specdojo:bes-recipe|BES作成レシピ]] の「このレシピの使い方」「作成前に集める情報」「全体の作成手順」「良い例 / 悪い例」「レビュー観点」「仕上げチェック」に残る文書承認・担当・期限・記録先の管理記述を整理する。[[specdojo:bes-template|BESテンプレート]] の「何が起きたか」の公開承認指示と「発生条件」の未決事項指示から管理項目を外す。[[specdojo:bes-sample|BES完成例]] の「何が起きたか」の文書承認・照合担当・記録先の段落を整理し、利用判断の基準と業務主体の表は維持する。今回の範囲では未変更とし、構造・必須項目・禁止事項は改訂した rulebook を正とする。
- 共通正本の追記は不要と判断した。メタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」「成果物の値制約」で削除対象を賄える。ただし Rulebook 記述標準の「記述ガイド」には各 rulebook で役割分担を定義する指示が残るため、共通運用をメンバー定義・メタ情報標準へ委ねる方針に合わせる変更案を result に残す。今回はタスクの明示指示を優先して対象 rulebook だけを改訂した。
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿個票・既存 plan・result を変更していない。）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルはMarkdown rulebookのみで、YAMLファイルを変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として、sld の試行（`pjr-8s4t`）の「他の型へ広げるときの一覧」と改訂済みの `sld-rulebook` を手本にした。あわせて `rulebook-authoring-standard`、`document-metadata-standard`、`pm-review-viewpoints` の `vp-arc-conciseness` を読んだ。対象の成果物 `bes-task-ready-selected` と、`bes-index`、`cdfd-overview`、`stsd-task-execution`、`bes-sample`、先行レビュー結果とも照合した。役割は適用先のメンバー定義へ、承認・ライフサイクル・未決事項の引き継ぎはメタ情報標準へ委ね、重複を削った。対象範囲と適用未判定の区別、要求・確定・後処理の境界、相関の単位、発生時点で観測可能なデータ、確認例の判定基準は維持した。先行レビューで残った業務上の未解決事項は、本タスクで解消したとは扱わない。共通の正本への追記は不要と判断した。メタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」と「成果物の値制約」で、削除した内容を賄えるためである。
