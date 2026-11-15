---
specdojo:
  id: prj-0001:pjr-q9df-cnd-specdojo-rework-grade-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T11:12:33Z"
  commit_type: docs
  commit_scope: cnd
  approach: fully-guided
  targets:
    - cnd-specdojo
---

# PJR-Q9DF cnd-specdojo を grade の指摘で手直しする（コンテナ構成と配備の方針の基準）

## 1. 概要

最新の grade の指摘を取り込み、承認の基準となるコンテナ構成と配備の方針を本文で定める

## 2. 入力

- kata-wave-1 の確定（T-KATA-WAVE-1-cnd-specdojo-140）で差し戻した（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 82 点で完了条件 4/5
- 主な指摘: コンテナ構成と配備の方針の基準が本文で定まっておらず、PO が承認できない（DC-002）。留保した範囲（文書サイトの閲覧の認証と配信、REL-10 は PJR-CJMN）と、今承認する範囲を区別する

## 3. 完了条件

- PO が承認の基準にできる、コンテナ構成と配備の方針（何をどこで動かし、何を配備しないか）を本文で定めている。
- 今の時点で承認する範囲と、留保した範囲（文書サイトの閲覧の認証と配信は運用設計まで、REL-10 は PJR-CJMN）を区別し、留保の範囲で許される後続の作業と保留する作業が分かる。
- 本文に書いた人間の PO の判断と、期限付きの留保（追跡先の PJR）を消さずに保っている。
- 成果物の `status` は `draft` のまま変えない（確定は人が T-KATA-WAVE-1 の 140 で行う）。
- 直した後に `grade run --target deliverable` で grade し直し、成果物カタログの完了条件をすべて満たす（留保の範囲だけが未充足として残る場合は、その理由を対応結果に書く）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込み、配備の方針の基準を定める | ARC  | open | -    |
| 2   | 承認する範囲と留保の範囲を書き分ける                    | ARC  | open | -    |
| 3   | grade し直して結果を書く                                | ARC  | open | -    |

## 5. 対応結果

- 実施内容: [[cnd-specdojo]] に「配備の基準と承認範囲」を新設し、単位ごとに動かす場所・時点と配備しないものを定めた。承認を求める範囲、留保 A（文書サイトの閲覧の認証と配信。運用設計・非機能要件の整備まで）、留保 B（`REL-10`。PJR-CJMN）を分け、留保の間も進めてよい作業と保留する作業を書いた。grade の指摘 F001〜F012 を本文に反映した。
- PO の判断の保持: 2026-11-15 の留保の承認と配信先への公開対象限定の承認は消さず、関係表とコンテナ表で 3 か所に重複していた留保の記述を承認範囲の表 1 か所へ統合した（F005）。
- 迷って決めた点 1: 文書サイトの留保（留保 A）の追跡先 PJR は宣言された資料で確認できないため、「PJR は未登録」と書いた。ARC から PM へ報告して登録する経路を本文に書いた。
- 迷って決めた点 2: 完了条件 DC-002 は、本文に基準を定めただけでは満たせないとした。人間の PO が T-KATA-WAVE-1 の 140 で判断するまで未充足と明記した（F007）。
- 迷って決めた点 3: サイトの構築主体は実装エビデンス（VitePress の構築を CLI のコマンドからは起動しない）に合わせて現在動作として書き、構築環境と配信先の選定は留保 A に残した。
- 迷って決めた点 4: 正本（リポジトリ）の障害時の回復は根拠がないため期待値を定めず、検証対象には区別すべき状態だけを書き、回復の期待値はリスクとして将来課題に残した（F009）。
- 残課題: `grade run --target deliverable` による grade のやり直しは executor の範囲外のため実施していない。留保 A の PJR の登録、`ifx-cmd-git-cli`・`ifx-cmd-github-cli` の作成（PJR-CJMN）、T-KATA-WAVE-1 の 140 での PO の判断が残る。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
