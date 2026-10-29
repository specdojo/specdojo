---
specdojo:
  id: prj-0001:pjr-njj7-register-epic-track-governance
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  registered_at: "2026-10-27T22:48:37Z"
  completed_at: "2026-10-27T22:54:16Z"
  conclusion: 案 C を採用。register を業務の起点とし、track ごとに新しい type の epic を起票して子 todo でカタログ・sch-strategy・sch-track を作り schedule で流す
---

# PJR-NJJ7 register を業務の起点とし、track の仕事を epic 型で管理する

## 1. 背景

register を業務の起点・着手承認・完了判断の層とし、track ごとの epic（新しい type）から子 todo で catalog・sch-strategy・sch-track を作成し、schedule で流す構成へ変える

- 現行のガイドは、register と schedule を同格の別の実行経路とし、schedule へ移った作業を register で二重管理しないと定めている（[[specdojo:register-operation-guide]] の `登録簿の位置づけ`、[[specdojo:exec-operation-guide]] の `実行経路の使い分け`）。
- 実際の業務は register の todo で進めることが多く、まとまった仕事を成果物の単位へ分解して schedule で流す運用の方が扱いやすい。
- 現行の構成には、track の着手と完了を判断・記録する場所がない。カタログ作成の todo を close した時点で、register の記録が途切れる。

## 2. 検討した選択肢

| 選択肢 | 内容                                  | 利点                           | 懸念                                                     |
| ------ | ------------------------------------- | ------------------------------ | -------------------------------------------------------- |
| A      | todo のまま `targets` で track を指す | 新しい概念が要らない           | 実行からの除外や、完了を子から導く特例が todo に入り込む |
| B      | todo に区分のフィールドを足す         | type は増えない                | 実質は別の type なのに、区分の値を見ないと分からない     |
| C      | 新しい type `epic` を作る             | ふるまいの違いを type で表せる | type が 1 つ増え、覚える概念が増える                     |

名前は `epic`・`workstream`・`initiative`・`milestone`・`phase`・`track` を比べた。`workstream` と `track` は schedule の track と区別しにくく、`milestone` と `phase` は `sch-milestones.yaml` や phase gate と衝突し、`initiative` は戦略の色が強い。

## 3. 決定内容

案 C を採り、register を業務の起点・着手承認・完了判断の層とする。

- 新しい type `epic` を設け、track ごとに起票する。
- カタログ作成、sch-strategy 作成、sch-track 作成は、`epic` から `--from` でつないだ子 todo とする。
- 途中の進み具合は schedule が持ち、`epic` は着手と close だけを持つ。
- `epic` 自体は `exec run --register` で実行しない。
- `catalog_status` は、カタログ作成の todo の close から導く。
- timeline は当面残し、着手の順序と依存の検証を担わせる。
- `epic` の close は人が判断する。判断の材料として、dashboard に track の進み具合を表示する。

## 4. 採択理由

- `epic` は todo と、実行（自身は実行しない）・期間・完了の判断（子と schedule から判断する）・中身（作業のまとまり）が異なる。変える手間ではなく本質的な意味で判断し、type を分ける。
- `epic` は schedule の既存の用語（track・milestone・phase）とぶつからず、分解して進める大きな仕事として広く通じる。schedule を使わずに子 todo だけで分解する使い方にも当てはまる。
- track ごとにすると、カタログ・strategy・sch-track の単位と一致する。wave ごとにすると、遅い track に引きずられて close できない。
- `catalog_status` の手での更新漏れは、[[specdojo:timeline-design-guide]] でもアンチパターンに挙がっている。

## 5. 承認

| 項目     | 内容                     |
| -------- | ------------------------ |
| 決定者   | indie                    |
| 決定日   | 2026-10-28               |
| 承認方式 | commit                   |
| 証跡     | 本個票の close の commit |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | register の type と schema、exec run --register の対象の判定、timeline の catalog_status、dashboard、関連ガイド |
| 必要な対応 | 下記 3 件の todo                                                                                                |
| 追跡先     | 本項目から `--from` でつないだ todo                                                                             |

1. ガイド 3 本の書き換え（register-operation、exec-operation の `実行経路の使い分け`、timeline-design）。
2. `epic` の type の実装（schema、register、exec の除外）と、`catalog_status` を導く処理、dashboard への表示。
3. カタログと strategy を作るための approach の追加。

## 7. 関連ドキュメント

- [[specdojo:register-operation-guide]]
- [[specdojo:exec-operation-guide]]
- [[specdojo:timeline-design-guide]]
