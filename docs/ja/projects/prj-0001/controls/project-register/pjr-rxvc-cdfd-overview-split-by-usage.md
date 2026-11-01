---
specdojo:
  id: prj-0001:pjr-rxvc-cdfd-overview-split-by-usage
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-10-31T23:32:43Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-8TQJ
  depends_on:
    - PJR-TE2N
---

# PJR-RXVC 全体概要の CDFD を使い方の流れで 4 つに分け、D2 で描き直す

## 1. 概要

cdfd-overview.md の図は今、トランザクションデータとマスタ・構成データで分けている。LP の Roadmap の register・schedule・routine + Job の 3 行に合わせ、register 系・schedule 系・routine 系と、どれにも属さない Onboarding・稼働構成管理・非推奨化をまとめた共通・基盤の 4 つの図に分け、D2 で描き直す。rulebook は使い方の流れで分ける方式も選べるようにする

## 2. 入力

- 利用者は、全体概要の図を LP の分割に合わせて register 系・schedule 系・routine 系に分けたい（2026-11-01）
- どれにも属さない Onboarding（P-01）・稼働構成管理（P-12）・非推奨化（P-13）・Kata・稼働構成は共通・基盤の図にまとめる（2026-11-01 の対話で推奨を採用）
- データストアの表のマスタ・構成データとトランザクションデータの分類と色分けは残し、変えるのは図の分け方だけとする
- cdfd-overview-rulebook は全体概要をトランザクションデータとマスタ・構成データの図に分けると定めている。rulebook は他のプロダクトでも使うため、使い方の流れで分ける方式も選べる形にする
- 図は D2 に移行する。Mermaid で分け直してから D2 に移すと二度手間になるため、CDFD の D2 版の rulebook（PJR-TE2N）の後に行う
- LP の Roadmap の行は specdojo-lp の src/components/sections/Roadmap.astro にある

## 3. 完了条件

- [[specdojo:cdfd-overview-rulebook]] で、全体概要の図を「データストアの区分で分ける」か「使い方の流れで分ける」かを選べる。宣言しない場合は今の分け方（データストアの区分）として扱う
- [[prj-0001:cdfd-overview]] の図が register 系・schedule 系・routine 系・共通の 4 つに分かれ、[[specdojo:cdfd-d2-rulebook]] に従って D2 で描かれている。凡例で記法を D2、分け方を使い方の流れと宣言している
- 共通の図に Onboarding（P-01）・稼働構成管理（P-12）・非推奨化（P-13）が入っている
- 変更前の図にある受け渡し（エッジ）が、4 つの図のどれかに必ず残っている。対応を個票の対応結果に記録する
- データストアの表の分類（マスタ・構成データとトランザクションデータ）と、PJR-8TQJ で決めた文章の密度（表中心で、流れは図を正とする）を保っている
- ノードの ID を日本語にするか英語にするかを executor が決め、理由を個票の対応結果に記録している
- `npm run lint:md`・`npm run lint:d2`・`npm run lint:mermaid` と親の検証が通る
- rulebook と文書の status を上げていない。詳細の CDFD 8 文書（PJR-T1D1 の対象）は変えていない

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | cdfd-overview-rulebook に使い方の流れで分ける方式を足す | BA   | open | -    |
| 2   | cdfd-overview の図を 4 つに分け、D2 で描き直す          | BA   | open | -    |
| 3   | エッジの対応と ID の判断を対応結果に記録し、lint を通す | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:cdfd-d2-rulebook]]
- [[prj-0001:cdfd-overview]]
