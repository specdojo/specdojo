---
specdojo:
  id: prj-0001:pjr-a61w-fallback-same-as-pinned-aborts-after-start
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-10-31T21:59:04Z"
  commit_type: fix
  commit_scope: exec
---

# PJR-A61W 代わりの executor が振り分けと重なると start の後に止まり、終了コード 0 で終わる

## 1. 課題内容

exec run --register で --executor-by に振り分けの代わりと同じ agent を指定すると、start の記帳の後に止まり、記帳を commit しないまま終了コード 0 で終わる

## 2. 入力

- prj-0002:PJR-7MB3 の実行で見つけた。prj-0001 の設定は prj-0002 を持たないため、由来は --from ではなくここに書く
- 2026-11-01、prj-0002 の作業ツリーで specdojo 0.6.0 の exec run --project prj-0002 --register PJR-7MB3 --worktree --executor-by sol-executor --reporter-by gemma-reporter を流した。PJR-7MB3 は difficulty medium で、routing.medium の `fallback_executor_by` は sol-executor
- 出力は worktree の setup の後に「Fallback executor must differ from the pinned agent: sol-executor」で止まり、executor は起動しなかった。終了コードは 0 だった
- 止まった後、PJR-7MB3 は start の記帳で in-progress になり、作業ツリーに start のイベント・個票の状態・plan と result の雛形が commit されずに残った。worktree（exec/prj-0002-PJR-7MB3）も残った
- その後 --force-restart で flash-executor を使って流し直すと review まで通ったが、新しい start は記帳されず、イベントの start の actor は実際には動かなかった sol-executor のまま残った（review の actor は flash-executor）。止まった run の plan は commit されずに残り、result は superseded として commit された
- 検査は src/exec/run/shared.ts の代わりの agent の解決（resolution.actor === primary.actor で throw）にある
- 直し方（検査を start の前に移す、振り分けの代わりが指定の agent と同じときは代わりなしとして扱う、など）は executor が決めて、理由を個票の対応結果に書いてよい

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
