---
specdojo:
  id: prj-0001:pjr-3xnm-grade-fidelity-normalization
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-01T14:58:31Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-01T21:42:04Z"
  conclusion: finding message の忠実性照合に句読点・空白・NFC の正規化を追加し、表記の揺れと内容の改変を区別できるようにした。
---

# PJR-3XNM grade の忠実性検証で表記の揺れと内容の改変を区別する

## 1. 概要

`grade apply --analysis-from` は、reporter の GradeSubmission と executor の marker 出力を
機械照合し、finding の追加・欠落・改変を拒否する。判定主体は executor であり、reporter が
判定を書き換えないことを保証するための検証である。

現在の照合は finding の message を文字列の完全一致で比較する。そのため reporter が内容を
変えずに表記だけ整えた場合も不一致となり、評価全体が拒否される。

PJR-EXCV の実 agent 検証で実際に発生した。gemma-reporter が executor の finding 本文にある
読点「、」を1文字だけ半角カンマへ書き換えたため、同一の指摘が別の finding として扱われ、
3段目が failed で終わった。

```text
reporter finding count 0 differs from executor count 1: ...「一方、」...
reporter finding count 1 differs from executor count 0: ...「一方,」...
```

判定内容は完全に同一であり、拒否すべき改変ではない。表記の揺れと内容の改変を区別できて
いないため、reporter にローカルモデルを使う限り再発する。

## 2. 完了条件

- 内容が同一で表記だけが異なる finding を、改変として拒否しない。
- 判定内容を変える改変（severity、line、指摘の対象や結論の変更）は従来どおり拒否する。
- 拒否した場合は、どの差分を改変と判断したかが分かる形で報告する。
- 正規化の対象と範囲が文書化され、何が許容されるか読み手に分かる。

## 3. 検討事項

- 正規化の範囲をどこまで広げるかは、緩めるほど改変の見逃しにつながる。句読点や空白の揺れ
  に限るのか、表記ゆれ全般まで許すのかを決める必要がある。
- 完全一致の代わりに類似度で判定する案は、閾値の設定次第で改変を通すため慎重に扱う。
- reporter 側の plan で「executor の文言を1文字も変えない」ことをより強く指示する案も
  あるが、モデルの遵守に依存するため検証の緩和とは別に扱う。

## 4. 作業内容

| No  | 作業                               | 担当 | 状態 | メモ                       |
| --- | ---------------------------------- | ---- | ---- | -------------------------- |
| 1   | 実際に起きた表記の揺れを収集する   | ARC  | done | 句読点・空白・記号の実例   |
| 2   | 正規化の範囲を決めて文書化する     | ARC  | done | 許容と拒否の境界を明示した |
| 3   | 照合処理へ正規化を実装する         | ARC  | done | 限定した表記差だけを許容   |
| 4   | 拒否時の差分報告を分かりやすくする | ARC  | done | 変更フィールドと原文を表示 |
| 5   | 単体テストを追加する               | ARC  | done | 揺れの許容と改変拒否を検証 |

## 5. 対応結果

- finding message の忠実性照合へ限定的な正規化を追加した。Unicode の正準等価、空白、句読点周辺の空白、和文・全角と ASCII の句読点差を許容する。
- 正規化しない英字大小、英数字の全角・半角、括弧・ダッシュ、語句の変更と、完全一致を維持する severity・line を拒否境界として定めた。詳細は [[specdojo:command-reference|コマンドリファレンス]] に記載した。
- 不一致時は finding の単純な件数差ではなく、変更された severity、line、message の executor 値と reporter 値を報告するようにした。欠落と追加も個別に報告する。
- 実際に発生した `、` と `,` の差、空白・句点の差を受理するテストと、severity・line・指摘内容の変更を拒否して差分を報告するテストを追加した。
- 受け入れ時に orchestrator が、本項目の発端となった `bac-rulebook.md` の実失敗ケース
  （読点「、」と半角カンマの1文字差）が正規化後に一致することと、同じ message の語尾を
  否定へ変えた場合は一致しないことを確認した。単体テスト1322件の通過も確認した。
- 実 agent を通した3段目の成功は未確認である。閾値96を超える文書がないと3段目へ到達
  しないため、全件走査の初期に確認する。正規化は `grade apply` 内の処理であり agent の
  種類に依存しないため、受け入れの条件とはしなかった。

## 6. 関連ドキュメント

- [[prj-0001:pjr-excv-grade-per-document-pipeline]]: 本問題が発生した実行経路。
- [[prj-0001:pjr-49d2-quality-assessment]]: grade コマンドの起点。
