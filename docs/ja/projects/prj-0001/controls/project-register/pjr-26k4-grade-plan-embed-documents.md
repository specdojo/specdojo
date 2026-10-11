---
specdojo:
  id: prj-0001:pjr-26k4-grade-plan-embed-documents
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T01:48:14Z"
  due_on: null
  completed_at: "2026-10-04T05:59:41Z"
  conclusion: grade plan --embed-documents を追加し、評価対象と参考資料を行番号付きで埋め込めるようにした。既定はパス参照のまま。実際の grade と npm run check で確認した
---

# PJR-26K4 grade plan に評価対象と参考資料の本文を埋め込むオプションを追加する

## 1. 概要

grade plan は評価対象と参考資料をパスで渡すため、executor が自分で読みに行き、対象外のファイルまで読んで遅くなり、読む範囲の違いで判定がばらつく。2026-10-04 の ornith の計測で、本文を行番号付きで埋め込みファイルを読ませない plan にしたところ、tool call が 2〜10 回から 0〜1 回になり、2 回実行した score の差が 5 点から 1〜3 点に縮まった。[[prj-0001:pjr-9xvg-grade-plan-link-style]] で全文埋め込みからパス参照へ移した経緯（plan が対象の分量に依存して 6 万字を超える、対象の更新で plan の再生成が必要になる）があるため、既定は変えずにオプションとして追加する

## 2. 完了条件

- `grade plan` に、評価対象と参考資料の本文を埋め込むオプションを追加する。既定は現在のパス参照のままとし、[[prj-0001:pjr-9xvg-grade-plan-link-style]] の判断を変えない。
- 埋め込む本文には、finding の `line` と同じ基準（Frontmatter を除き H1 を 1 行目）の行番号を付け、Frontmatter は本文と分けて示す。
- 埋め込みを使う plan では、ファイル読み取りツールと検索ツールを使わず埋め込み資料だけで判定するよう指示する。
- 埋め込み後の plan が大きくなりすぎる場合（上限の文字数を決める）は、パス参照へ戻すか警告する。上限と振る舞いを記録する。
- member、job、`tools/grade/run-per-document.sh` のいずれで埋め込みを選ぶかを決め、実装する。
- unit test で、行番号の基準、Frontmatter の分離、上限の超過時の振る舞いを検証する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ                                                    |
| --- | ---------------------------------------- | ---- | ---- | ------------------------------------------------------- |
| 1   | オプションの設計（選び方、上限、行番号） | DEV  | done | `--embed-documents`、100,000文字上限、本文1始まりを採用 |
| 2   | `grade plan` と grade pipeline への実装  | DEV  | done | CLI と文書単位 pipeline の明示オプションとして実装      |
| 3   | 文書とテストの更新                       | DEV  | done | コマンドリファレンスと unit test を更新                 |

## 4. 対応結果

- `grade plan --embed-documents` を追加し、評価対象・参考資料・良い実例を executor plan へ埋め込めるようにした。既定はパス参照のままとした。
- Frontmatter を行番号の対象外として本文と分離し、本文へ1始まりの行番号を付けた。通常は H1 が1行目となり、finding の `line` と一致する。
- 埋め込み部分を100,000文字までとし、超過時は CLI と plan 内で警告してパス参照へフォールバックするようにした。上限内の plan はファイル読み取りツールと検索ツールを使わず、埋め込み資料だけで判定するよう指示する。
- `tools/grade/run-per-document.sh --embed-documents` から全段の plan 生成へ選択を引き渡し、Run state に選択値を固定するようにした。
- 既定動作、Frontmatter と本文の分離、行番号、上限超過時のフォールバック、pipeline への引き渡しを unit test で固定した。
- 残課題はない。

確認（2026-10-04）: `tools/grade/run-per-document.sh --stages 1 --stage-1-executor agy-expert-executor --embed-documents` で `stsd-mermaid-rulebook` を実際に評価した。生成された executor plan に「埋め込み資料」と行番号付きの本文が含まれ、72 秒で `pass` 100（finding 0）が記録された。`npm run check`（1,991 件のテストを含む）も通過した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 2026-10-04 の ornith の計測結果。
- [[prj-0001:pjr-9xvg-grade-plan-link-style]]: 全文埋め込みからパス参照へ移した経緯。
- [[prj-0001:pjr-e9h3-grade-deterministic-reporter]]: reporter の機械変換。埋め込みと組み合わせると ornith の executor を grade に使える見込み。
