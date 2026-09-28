---
specdojo:
  id: prj-0001:pjr-f346-docs-sync-recent-changes
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T11:22:25Z"
---

# PJR-F346 2026-09-26〜28 の変更を利用者向けドキュメントへ反映する

## 1. 概要

2026-09-26〜28 に多くの項目を close した。各項目の executor は関係するガイドを部分的に更新したが、項目をまたいだ整合や、概要・入門のガイドへの反映は確認していない。利用者向けのドキュメントが実装と食い違っていないかを横断的に確認し、古い記述を直す。

反映の対象とする変更は次のとおり（括弧内は登録簿の ID）。

| 領域                   | 変更                                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| exec の並行実行        | runner の検証を 1 回の run の中で直列化（3HHW）。実行中の run へ後から別の run を並行して始められる同時実行枠（4HBG、本項目の着手時に完了していれば）                |
| exec の再開と統合      | waiting 時の同期 merge を通常 merge に変更（R0XA）。統合時の記帳ファイル競合の解決と abort 前の index 更新（CTV4）。イベントの和集合での解決（36CN、完了していれば） |
| exec の commit 範囲    | register 由来タスクの新規ファイルの commit 範囲の絞り込み、ready 昇格検査の対象、一時ファイルの規約（FFPK）                                                          |
| exec の plan と review | plan から reporter 付きで review を実行する経路（E2Q3、完了していれば）                                                                                              |
| review                 | review は観点ごとに評価せず grade の結果を事実として受け取る（N22N）。review 前の grade の鮮度確認と plan への提示（KCMH）。判定語彙の 6 値への統一（XTAN）          |
| grade                  | `evaluation` の改名（WPWB）、`continuous` の廃止と 28 観点・rubric v2（K351）、観点の適用範囲と判断漏れの検証（AG7B、VJP8）、未完了時の exit 1（QJAD）               |
| grade の契機           | 定期実行の契機（N03W）、`--unreviewed` の絞り込み（2F3Y）、突き合わせ先の変化の検出と `--dependency-changed` の内容ハッシュ化（Z47X）、`--rubric-outdated`（BVPS）   |
| 登録簿                 | `config init` による `.gitignore` の追記（HG98）。`note` は終端させない（XW9M でオーケストレーター定義を修正済み）                                                   |
| schedule               | `schedule build` が schema modeline を残す（7ZNH）。kata 保守タスクの review フェーズ（06RE）                                                                        |
| docs サイト            | サイドバーの分割と実行記録の除外（E8FY）、検索対象の絞り込み（QQXP）、package 同梱 kata のステージング（SJ3X）                                                       |

## 2. 完了条件

- 次のドキュメントについて、上表の変更と食い違う記述がないかを確認し、食い違いを直している。
  - `docs/ja/specdojo/guides/` 配下のガイド（とくに `specdojo-overview-guide.md`、`quick-start-guide.md`、`exec-operation-guide.md`、`exec-worktree-guide.md`、`exec-config-guide.md`、`register-operation-guide.md`、`review-guide.md`、`routine-operation-guide.md`、`orchestrator-operation-guide.md`、`plan-result-lifecycle-guide.md`）
  - `docs/ja/specdojo/references/` 配下のリファレンス（`command-reference.md`、`specdojo-config-reference.md`、`directory-layout-reference.md`）
  - リポジトリの `README.md`
- 古い用語・値が残っていない。少なくとも次を検索し、残っている場合は現在の用語へ直すか、旧値であることを明記している。
  - `evaluation` の旧値 `agent` / `human`、`continuous`
  - review の旧語彙 `approve` / `revise` / `reject`、`conditional_pass` / `changes_requested`、観点ごとの `pass` / `fail` / `unclear` 判定
  - 観点別詳細テンプレート（`*-viewpoint-detail-*`）への参照
  - `note` を close / `done` にする記述
  - waiting の項目の再開に `--force-restart` を勧める記述（R0XA・CTV4 の後は `--resume` で再開できる）
- 上表のうち、どのドキュメントにも説明がない変更は、利用者が操作や結果の読み方に影響を受けるものに限り、適切なガイドへ追記している。
- 各項目の個票に書かれた仕様を正とし、ドキュメントに合わせて実装を変えない。実装とドキュメントのどちらが正しいか判断できない食い違いは、変更せずに対応結果へ列挙する。
- 章の参照は章番号ではなく章タイトルで書き、`.github/instructions/markdown.instructions.md` に従う。
- `npm run -s lint:md` が成功する。`npm run docs:build` が成功する（`NODE_OPTIONS` の指定なし）。
- 変更したドキュメントと、確認したが変更不要だったドキュメントを、対応結果に一覧で記録する。

## 3. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ                       |
| --- | ----------------------------------------------------- | ---- | ---- | -------------------------- |
| 1   | 旧用語・旧値を検索し、残っている箇所を一覧にする      | DEV  | open | -                          |
| 2   | 変更ごとに関係するガイドとリファレンスを確認して直す  | DEV  | open | 個票の仕様を正とする       |
| 3   | 説明がない変更を適切なガイドへ追記する                | DEV  | open | 利用者に影響するものに限る |
| 4   | lint と docs のビルドを通し、対応結果に一覧を記録する | DEV  | open | -                          |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:specdojo-overview-guide]]、[[specdojo:exec-operation-guide]]、[[specdojo:exec-worktree-guide]]、[[specdojo:review-guide]]、[[specdojo:routine-operation-guide]]
- 上表の各項目の個票
