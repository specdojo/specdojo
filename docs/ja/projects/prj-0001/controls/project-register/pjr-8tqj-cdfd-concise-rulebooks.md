---
specdojo:
  id: prj-0001:pjr-8tqj-cdfd-concise-rulebooks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-10-31T14:15:36Z"
  due_on: "2026-11-30"
---

# PJR-8TQJ CDFD の rulebook を要点に絞った形に直し、全体概要で試す

## 1. 概要

CDFD の文書が長く、要点がつかみにくい。主な原因は rulebook の要求で、受け渡しを箇条書き・図・注記の 3 か所に書かせ、図を文章でなぞらせ、定型の文を文書ごとに繰り返させている。cdfd-overview・cdfd・cdfd-uc の 3 つの rulebook を要点に絞った形に直し、試しに cdfd-overview.md を書き直す

## 2. 入力

- 利用者は CDFD の文章が長すぎて返って分かりにくいと感じており、要点だけに絞りたい（2026-10-31）
- CDFD の 9 文書は計約 225KB、cdfd-overview.md は約 32KB。3 つの rulebook は計約 78KB
- 短くした形の方向（2026-10-31 の対話で利用者が案 A を選択）: 目的は 1〜2 文、適用範囲は対象と対象外を 1 行ずつで共通の原則は 1 か所を参照、プロセス領域は表だけで主要入力・主要出力の箇条書きをやめ受け渡しは図を正本にする、図の説明は 1〜2 文、凡例は全体概要に 1 回だけ
- rulebook と文書を同時に揃えないと、grade や review で元の長さに戻されるため、rulebook から直す

## 3. 完了条件

1. `cdfd-overview`・`cdfd`・`cdfd-uc` の 3 つの rulebook を、次の形に直す。
   - 目的は 1〜2 文にする。
   - 適用範囲は、対象と対象外を 1 行ずつにする。
   - プロセス領域は表だけにし、主要入力・主要出力の箇条書きはやめる。受け渡しは図を正本にする。
   - 図の説明は 1〜2 文にする。
   - 凡例は全体概要にだけ書く。
   - 共通の原則（人と AI の責任分担など）は 1 か所に置いて参照する。
2. 上の変更と食い違う、rulebook の中の確認の観点・禁止事項・相互対応の要求を直す。
3. `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md` を、直した rulebook に合わせて書き直す。中身の事実（領域・データストア・図の受け渡し）は変えない。分量は今の半分以下を目安にする。
4. 書き直す前と後の分量を、個票の対応結果に書く。
5. `npm run lint:md` と `npm run lint:mermaid` を通す。あわせて親の検証も通す。
6. 残りの 8 つの CDFD の文書（PJR-T1D1）と `cdfd-mermaid-rulebook` は変えない。
7. 未決の点は executor が決め、理由を個票の対応結果に書く。

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ |
| --- | ---------------------------------------------- | ---- | ---- | ---- |
| 1   | 完了条件に沿って rulebook と全体概要を書き直す | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:cdfd-rulebook]]
- [[specdojo:cdfd-uc-rulebook]]
- [[prj-0001:cdfd-overview]]
