---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dct-index-sample-150-20261126t145910z-7e6a18b8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dct-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dct-index-sample-150/T-KATA-REVIEW-ALL-dct-index-sample-150-20261126T145910Z-7e6a18b8/plan.md
  started_at: "2026-11-26T14:59:21.863Z"
  completed_at: "2026-11-26T15:09:05.940Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:dct-index-sample
    - specdojo:dct-index-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として dct-index-sample.yaml を、同じ接頭辞の dct-sample、用語集、共通サンプル文脈と突き合わせた。
- 先頭コメントの dct-sample への wikilink の表示名を、参照先 `specdojo:dct-sample` の title「成果物カタログ（プロジェクト定義）」に合わせて 1 か所直した。
- 用語、役割名、対象範囲、`domain`、`project_id`、`base_path` に食い違いはなかった。相手側 dct-sample の表示名の修正案を 1 件、要判断として残した。
- スキーマ検査と prettier 検査は通った。runner の検査も、実行したものはすべて通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | dct-index-sample.yaml の先頭コメント（同梱カタログの説明の行） | dct-sample への wikilink の表示名「成果物カタログ（ドメイン別）」が、参照先 `specdojo:dct-sample` の title「成果物カタログ（プロジェクト定義）」と食い違っていた。 | 表示名を「成果物カタログ（プロジェクト定義）」に直した。 | vp-qe-kata-conformance（kata 相互）。markdown.instructions の wikilink は `[[id\|title]]` 形式。 | - |
| R5-2 | R5 | docs/ja/specdojo/samples/dct-sample.yaml の先頭の `_ASSUMPTION_` コメント（相手側） | dct-sample から index への wikilink の表示名「成果物カタログ索引」が、`specdojo:dct-index-sample` の title「成果物カタログ」と食い違っている。 | 相手側の案: dct-sample.yaml の表示名を「成果物カタログ」に直す。本タスクでは変更していない。迷った理由: 「索引」は rulebook の H1「成果物カタログ（インデックス）」と同じく種別を補う説明とも読め、今のまま残す案も選べるため。 | vp-qe-kata-conformance（kata 相互） | 要判断 |
| R5-3 | R5 | 全体（用語集・共通サンプル文脈・ドキュメント構成ガイド・dct-sample との対応） | 指摘なし。用語集の「成果物カタログ」と「成果物ドメイン」（別名「ドメイン」）、共通サンプル文脈の役割名（店主代表・開発担当）・タブレット 1 台・初期の対象範囲（店頭販売・在庫・つけ管理）、dct-sample の `domain`（project-definition）・`project_id`・`base_path` と食い違わない。 | - | vp-qe-kata-conformance、vp-dev-change-impact | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dct-index-sample.yaml`: 先頭コメントにある dct-sample への wikilink の表示名を「成果物カタログ（ドメイン別）」から「成果物カタログ（プロジェクト定義）」に変更した。参照先の title と一致させるための 1 行の修正。

## 3. 申し送り

- R5-1: R5 / 先頭コメント（同梱カタログの説明の行） / dct-sample への wikilink の表示名「成果物カタログ（ドメイン別）」が、参照先 specdojo:dct-sample の title「成果物カタログ（プロジェクト定義）」と食い違っている / 表示名を「成果物カタログ（プロジェクト定義）」に直した / vp-qe-kata-conformance（kata 相互）、markdown.instructions の wikilink は [[id|title]] 形式 / -
- R5-2: R5 / 相手側 docs/ja/specdojo/samples/dct-sample.yaml の先頭の `_ASSUMPTION_` コメント / dct-sample から index への wikilink の表示名「成果物カタログ索引」が、specdojo:dct-index-sample の title「成果物カタログ」と食い違っている / - / 相手側の案: dct-sample.yaml の表示名を「成果物カタログ」に直す。迷った理由: 「索引」は rulebook の H1「成果物カタログ（インデックス）」と同じく種別を補う説明とも読め、今のまま残す案も選べるため / 要判断
- R5-3: R5 / 全体（用語集・共通サンプル文脈・ドキュメント構成ガイド・dct-sample との対応） / 指摘なし。用語集の「成果物カタログ」と「成果物ドメイン」（別名「ドメイン」）、共通サンプル文脈の役割名（店主代表・開発担当）・タブレット 1 台・初期の対象範囲（店頭販売・在庫・つけ管理）、dct-sample の `domain`（project-definition）・`project_id`・`base_path` と食い違わない。グループの分け方は R2 で確かめ済みのため繰り返さない / - / vp-qe-kata-conformance、vp-dev-change-impact / -
- 適用外の検証: `npm run validate:history-links`（変更したのは sample の YAML だけで、plan・result・個票などの履歴ファイルを変更していないため）

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample に切り替え、dct-index-sample を見直した。突き合わせ先は dct-sample、用語集（成果物カタログ、成果物ドメイン）、共通サンプル文脈、ドキュメント構成ガイドである。食い違いは wikilink の表示名 1 件だけで、sample 側を直した。相手側の dct-sample.yaml は変更せず、直す案を findings に記した。グループの分け方は R2 で確認済みのため繰り返さなかった。plan に展開された grade の finding と成果物由来の Kata の finding はなかった。
