---
specdojo:
  id: prj-0001:pjr-26k4-grade-plan-embed-documents
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T01:48:14Z"
  due_on: null
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

| No  | 作業                                     | 担当 | 状態 | メモ                           |
| --- | ---------------------------------------- | ---- | ---- | ------------------------------ |
| 1   | オプションの設計（選び方、上限、行番号） | DEV  | open | 計測で使った plan を参考にする |
| 2   | `grade plan` と grade pipeline への実装  | DEV  | open | -                              |
| 3   | 文書とテストの更新                       | DEV  | open | -                              |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 2026-10-04 の ornith の計測結果。
- [[prj-0001:pjr-9xvg-grade-plan-link-style]]: 全文埋め込みからパス参照へ移した経緯。
- [[prj-0001:pjr-e9h3-grade-deterministic-reporter]]: reporter の機械変換。埋め込みと組み合わせると ornith の executor を grade に使える見込み。
