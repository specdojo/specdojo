---
specdojo:
  id: prj-0001:pjr-20dv-grade-content-hash-normalization
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-07T13:45:31Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-07T21:43:36Z"
---

# PJR-20DV grade の content_hash を整形に依存しない正規化で計算する

## 1. 概要

`grade apply` が保存する `content_hash` が、commit 済みの文書内容と一致しない。`--changed-only`
による再評価対象の判定が機能しない。

`grade apply` は自身が書いた内容でハッシュを計算するが、その後 lefthook の prettier が出力を
書き換える。finding コメントの挿入が周囲の整形を乱すためである。prettier は HTML コメントの
直後に空行を挿入するが、`withoutFindingComments` はコメント行しか除去しないため、この空行が
残って別内容になる。

## 2. 調査結果

kata 全体で `--changed-only` が 197 件を「変更あり」と報告する。内訳は次のとおりである。

| 区分                                 | 件数 |
| ------------------------------------ | ---: |
| コメント直後の空行だけで説明できる   |   87 |
| prettier がさらに整形を変えた        |  108 |
| 評価時点の版と一致（実変更の可能性） |    2 |

`cstd-rulebook.md` で分解した。この文書は grade 記録コミット以降、作業ツリーとの差分がない。

| 比較対象             | ハッシュ先頭 |
| -------------------- | ------------ |
| 保存値               | `57a968ca`   |
| 現行ロジックで再計算 | `af0aa2f3`   |
| 空行も除去して再計算 | `e156a29a`   |
| 評価直前の版         | `e156a29a`   |

空行を除去すると評価直前の版と完全に一致する（本文・frontmatter とも一致を確認）。にも
かかわらず保存値はどちらとも異なる。保存されたハッシュは commit されたどの版にも対応して
いない。

再現ロジックの正しさは、検証を通過した48文書すべてで保存値と一致することを確認して担保した。

prettier の挙動は単独で再現した。コメント行の直後に本文が続く入力を整形すると、両者の間に
空行が挿入される。

## 3. 完了条件

- `stableContentHash` が、空行の連続と行末空白を畳んだ正規化後の内容でハッシュを計算する。
- `grade apply` の直後と、pre-commit の整形を通した後とで、同じ文書の `content_hash` が一致する。
- 既存の kata 文書を再評価したうえで `grade validate --changed-only` を実行し、内容を変更して
  いない文書が「変更あり」と報告されない。
- 正規化の前後で判定が変わることを検証する単体テストを追加する。

## 4. 作業内容

| No  | 作業                                         | メモ                                   |
| --- | -------------------------------------------- | -------------------------------------- |
| 1   | `stableContentHash` へ空白の正規化を導入     | 完了: 改行・行末空白・連続空行を正規化 |
| 2   | 整形往復で不変であることの単体テストを追加   | 完了: Prettier 整形後の検証を追加      |
| 3   | 既存文書の保存値がすべて無効になることを確認 | 完了: 調査済み197件は再評価対象        |
| 4   | 再評価後に真の再評価対象件数を数え直す       | 運用時: kata 再評価完了後に実施        |

## 5. 対応結果

- `stableContentHash` の本文入力を正規化し、CRLF / CR を LF へ統一したうえで行末空白を除去し、連続する空行を1行へ畳むようにした。単一空行は維持するため、Markdown の段落境界は区別する。
- finding を含む `grade apply` 出力を Prettier で整形しても、`grade validate` と `--changed-only` の比較結果が変わらない回帰テストを追加した。行末空白・連続空行だけの差を無視し、本文の変更は引き続き検出することも確認対象にした。
- 正規化契約を [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] と [[specdojo:command-reference|コマンドリファレンス]] に反映した。
- 既存 grade は旧方式のハッシュであり再評価が必要である。kata 全件の再評価と、その後の真の再評価対象件数の再集計は、agent 判定を伴う運用作業として本実装の導入後に行う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-mbvm-grade-exclude-generated]]: 同じ走査で判明した対象選択の問題。
- [[prj-0001:pjr-49d2-quality-assessment]]: 品質評価の全体方針。
