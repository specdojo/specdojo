---
specdojo:
  id: prj-0001:pjr-f1fd-stsd-rulebook-opening
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-05T13:02:31Z"
  completed_at: "2026-11-05T16:07:01Z"
  conclusion: 本文構成を頭書き・目的・適用範囲・状態一覧・状態遷移図・遷移の説明・今後の検討メモにし、概要の規則を目的と適用範囲へ移した
  derived_from:
    - PJR-3APD
    - PJR-VNT1
  depends_on:
    - PJR-VNT1
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-rulebook
---

# PJR-F1FD stsd-rulebook の冒頭を頭書きと目的・適用範囲に分け、図の表示名を状態名と値にする

## 1. 概要

stsd-rulebook の本文構成を、頭書き・目的・適用範囲・状態一覧・状態遷移図・遷移の説明・今後の検討メモにする。図の表示名の規則も状態名と値の 2 行に合わせる

## 2. 入力

- 業務仕様の冒頭は、H1 直下の 1〜2 行の頭書き、「1. 目的」（状態を管理する目的と利用者）、「2. 適用範囲」（対象・スコープ、正本の管理場所、状態変更を起こす業務範囲、終了点を置かない理由）に分け、3 章以降は状態一覧・状態遷移図・遷移の説明・今後の検討メモの順とする（PJR-VNT1、cdfd の形に合わせる）
- 状態遷移図の表示名は、状態一覧に値がある場合は「状態名`<br>`値」、値が - の場合は状態名だけとする。`state_id` は英小文字・数字・アンダースコアのため、表示には状態一覧の値を使う。Mermaid の lint で通ることを確かめた（2026-11-05 利用者が決定）

## 3. 完了条件

- [[specdojo:stsd-rulebook]] の本文構成の表が、頭書き（H1 直下の 1〜2 行。章にしない）・1. 目的・2. 適用範囲・3. 状態一覧・4. 状態遷移図・5. 遷移の説明・6. 今後の検討メモになっている。
- 「目的」には状態を管理する目的と利用者、「適用範囲」には対象・スコープ（AS-IS / TO-BE）、正本の管理場所、状態変更を起こす業務範囲、終了点を置かない場合の到達点と理由を書く、と記述ガイドにある。これまで「概要」に書くとしていた規則（状態が一つの対象の根拠、終了点の省略の理由など）は、すべて目的か適用範囲へ移り、「概要」への参照が残っていない。
- 状態遷移図の表示名の規則（値がある場合は`状態名<br>値`、値が `-` の場合は状態名だけ）を、図の rulebook への参照で示し、同じ説明を 2 か所に書いていない。
- 変えるのは対象の Kata だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ |
| --- | ---------------------------------------------- | ---- | ---- | ---- |
| 1   | 本文構成と記述ガイドを新しい冒頭に直す         | BA   | open | -    |
| 2   | 概要への参照を目的・適用範囲へ移し、検査を通す | BA   | open | -    |

## 5. 対応結果

- [[specdojo:stsd-rulebook|ステータス定義作成ルール]] の本文要件を頭書き・目的・適用範囲・状態一覧・状態遷移図・遷移の説明・今後の検討メモに更新した。状態が一つの場合の根拠と終了点の省略理由は適用範囲へ集約し、表示名・内部 ID・分割の記法は [[specdojo:stsd-mermaid-rulebook|STSD の状態遷移図を Mermaid で記述するルール]] への参照にした。
- 判断根拠は [[prj-0001:pjr-vnt1-business-spec-opening-structure|業務仕様の冒頭構成の決定]]、[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、[[specdojo:cdfd-uc-rulebook|概念データフロー図（ユースケース別）作成ルール]]、[[specdojo:ryu-guide|実践の進め方ガイド]]、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-qe-omissions-consistency` と `vp-arc-conciseness`。grade の F001 は既存の ID 不変・欠番・再利用禁止を維持して充足、F002 は管理場所と状態変更の業務範囲を本文要件・記述ガイドの適用範囲へそろえて充足した。grade サイドカーは変更していない。
- [[prj-0001:xer-t-stsd-pilot-stsd-job-run-080|Job Run の簡潔化結果]]、[[prj-0001:xer-t-stsd-pilot-stsd-register-entry-080|登録項目個票の簡潔化結果]]、[[prj-0001:xer-t-stsd-pilot-stsd-routine-run-080|定期処理の実行結果の簡潔化結果]] の `source=condense` に該当する保持記録を、各 STSD と原因箇所へ照合した。図と遷移表の全遷移対応は俯瞰と詳細の照合に、分割図の共有状態は接続と到達性の確認に必要なため維持し、同じ説明を繰り返す規定とは判断しなかった。
- 関連 recipe・sample・template と図の rulebook は読み込んで照合した。旧構成との不一致は利用者が決定した新要件を正とし、今回の編集対象を広げず、[[prj-0001:pjr-nepd-stsd-mermaid-display-name|PJR-NEPD]] で表示名を `状態名<br>値`（値が `-` なら状態名のみ）へ更新し、適用範囲への参照を直す。[[prj-0001:pjr-ysst-stsd-template-opening|PJR-YSST]]、[[prj-0001:pjr-swre-stsd-sample-opening|PJR-SWRE]]、[[prj-0001:pjr-p9sw-stsd-recipe-opening|PJR-P9SW]] で各 Kata の冒頭構成を追従させる。result の実施内容・変更ファイル・進め方と実践の型の適用への転記は後続 reporter が行う。

## 6. 関連ドキュメント

- [[specdojo:stsd-rulebook]]: 手入れの対象
- [[specdojo:cdfd-uc-rulebook]]: 合わせる冒頭の形
