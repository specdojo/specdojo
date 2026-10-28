---
specdojo:
  id: prj-0001:pjr-65ds-deliverable-context-draft-approach
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  registered_at: "2026-10-28T22:17:19Z"
  derived_from:
    - PJR-166T
---

# PJR-65DS 成果物の文脈の渡し方と draft approach を定める

## 1. 背景

PJR-166T の調査で、成果物を作るときの前提（技術スタックなど）を agent に渡す場所が無く、fully-guided の plan 雛形が草案作成と磨き込みを兼ねて説明と食い違っていることが分かった。tsd-*.md を「静的サイトで主流の技術スタックで書く」といった指示で作れるようにしたい。

## 2. 検討した選択肢

流れについて:

| 選択肢 | 内容                                                                              | 利点                                                      | 懸念                                         |
| ------ | --------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------- |
| 1-A    | 今ある道具で、人が先に書いてから fully-guided で磨く手順を文書化する              | 実装が要らない                                            | 調べて下書きする段が無く、選定を任せられない |
| 1-B    | 個票の入力欄だけを足す                                                            | 起票の時点で前提を渡せる                                  | schedule 起点では使えない                    |
| 1-C    | 雛形 → 人が文脈を記入 → `draft`（調べて下書き）→ `fully-guided`（整理）→ finalize | register と schedule の両方で同じ段になり、役割が分かれる | approach が 1 つ増える                       |

文脈の目印について:

| 選択肢 | 内容                                      | 利点                                       | 懸念                                |
| ------ | ----------------------------------------- | ------------------------------------------ | ----------------------------------- |
| 2-A    | HTML コメント `<!-- specdojo:context -->` | 書きかけの指示がサイトに出ない             | レビューする人が気づきにくい        |
| 2-B    | 目印 `_CONTEXT_:`                         | 既存の `_TODO_` などと同じ流儀で検出できる | 書きかけの指示がサイトに出る        |
| 2-C    | 専用の章                                  | 1 か所にまとまる                           | rulebook の章構成と番号の規則を破る |
| 2-D    | frontmatter の `specdojo.context`         | 機械的に扱いやすい                         | 長文と章ごとの指示を書きにくい      |

## 3. 決定内容

1-C と 2-B を採り、文脈は次の 3 つの置き場所から渡す。

- 流れ: `deliverable scaffold`（CLI、機械的）→ 人が文脈を記入 → `draft`（agent）→ `fully-guided`（agent、磨き込み）→ `finalize`（人）。
- 新しい approach `draft` を設ける。文脈で任された範囲に限り根拠のない具体化の禁止を外し、Web などで調べて値を決めてよい。選んだ値は成果物で「提案」として示し、出典と選定理由を result に残す。rulebook・recipe・template・sample と文脈を参照する。
- `fully-guided` は磨き込み専用と定め、plan 雛形と ryu-guide の説明をそろえる。
- 文脈の置き場所:
  - 成果物の中: 目印 `_CONTEXT_:` を、指示が当てはまる場所（文書全体なら先頭の章）に書く。`draft` は本文へ反映したら目印を消し、元の指示を result に写す。finalize で残っていれば止める。
  - 個票: 節 `入力` と `register add` / `update` の `--input` を設け、register 経由の plan の参照範囲に入れる。オーケストレーターとの対話で得た前提を、そのまま起票に埋め込めるようにする。
  - カタログ: 成果物に `brief` を設け、schedule と register の両経路の plan に入れる。成果物の外から継続して渡したい前提に使う。
- schedule には、雛形・人による文脈の記入・`draft`・refine（`fully-guided`）・review・finalize を並べる profile を追加する。今の guided-pass は、型がそろい文脈が要らない成果物のために残す。

## 4. 採択理由

- 段ごとに担い手（CLI・人・agent）と決まりが分かれ、register と schedule の両方で同じ流れを使える。
- `scaffold` は CLI の機械的な雛形作りの名前として使っているため、agent の段は `draft` とする。
- 指示は置いた場所に意味があることが多く、`_CONTEXT_` なら場所ごとに書け、既存の目印の規約と残りの検出に乗れる。
- 対話から起票する register 経由では、個票の `入力` に前提を書く方が自然で、成果物を先に開かなくても渡せる（利用者の指摘）。

## 5. 承認

| 項目     | 内容                     |
| -------- | ------------------------ |
| 決定者   | indie                    |
| 決定日   | 2026-10-29               |
| 承認方式 | commit                   |
| 証跡     | 本個票の close の commit |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | approach の定義と plan 雛形、個票テンプレートと register の CLI、カタログの schema、schedule の strategy profile、ガイドと記述規約 |
| 必要な対応 | 本項目から `--from` でつなぐ todo（分け方は別途合意する）                                                                          |
| 追跡先     | PJR-166T                                                                                                                           |

## 7. 関連ドキュメント

- [[prj-0001:pjr-166t-deliverable-input-brief]]
- [[specdojo:ryu-guide]]
- [[specdojo:exec-operation-guide]]
