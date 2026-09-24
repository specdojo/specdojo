---
specdojo:
  id: prj-0001:pjr-mwwp-dashboard-cell-sanitize
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-23T07:06:08Z"
  due_on: "2026-10-10"
  completed_at: "2026-09-24T12:24:09Z"
  conclusion: dashboard の表セルへ埋める値を sanitizeDashboardCell で整形するようにした。制御文字の除去、パイプのエスケープ、200 文字での打ち切りを行い、event 由来の値が入る全セルへ適用した。
---

# PJR-MWWP dashboard の表セルへ埋める理由を整形し、表が壊れないようにする

## 1. 概要

dashboard の `要対応（解除待ち）` は、register の `block_reason` や exec の block 理由をそのまま表セルへ埋める。理由は agent や git の出力から作られるため、制御文字・パイプ・長文が混ざりうる。

PJR-G8M9 の worktree 作成失敗では、復帰文字（`\r`）と `Updating files: 50% (2325/4638)` の進捗が理由へ入り、生成された `dashboard.md` の表が壊れて `npm run lint:md` が MD055 / MD056 で失敗した。

```text
| register | `PJR-G8M9` | checkpoint failed: git worktree failed: Preparing worktree
  (new branch '...') Updating files:  50% (2325/4638)^MUpdating files: ... |
```

[[prj-0001:pjr-tr8g-git-failure-reason-progress]] で理由を作る側は整形したが、理由は exec の block、register の wait、agent の応答など複数経路から来る。表示側でも防ぐ必要がある。

## 2. 完了条件

- dashboard が表セルへ値を埋める前に、制御文字（`\r`、`\n`、ANSI を含む）を除去する。
- セル内の `|` をエスケープする。
- 長い理由を打ち切り、打ち切ったことが分かる表記にする。
- 理由を埋める箇所が複数あれば、同じ整形関数を通す。
- 制御文字・パイプ・長文を含む理由から、表として妥当な行が生成されることを検証する単体テストがある。
- `npm run lint:md` が通過する。生成物の `dashboard.md` を含む。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                     | 担当 | 状態 | メモ                                     |
| --- | -------------------------------------------------------- | ---- | ---- | ---------------------------------------- |
| 1   | セル整形の共通関数を作る                                 | DEV  | done | `stripTerminalControlSequences` を再利用 |
| 2   | dashboard の理由を埋める箇所をすべて通す                 | DEV  | done | block 理由と wait 理由の両方             |
| 3   | 制御文字・パイプ・長文の入力に対する単体テストを追加する | DEV  | done | 実際に壊れた入力を fixture にする        |

## 4. 対応結果

- `sanitizeDashboardCell` を追加し、ANSI と制御文字を除去して改行類を空白へ正規化し、パイプをエスケープするようにした。
- セルの値は 200 文字を上限にし、超過時は末尾へ省略記号を付ける。register の wait 理由と exec の block 理由を含む dashboard の動的な表セルは、同じ関数で整形する。
- worktree 作成失敗を模した復帰文字、改行、ANSI、パイプ、長文を含む入力について単体テストを追加した。

### 4.1. オーケストレーターによる確認

`sanitizeDashboardCell` が完了条件の 3 点（制御文字の除去、パイプのエスケープ、長さの打ち切り）を満たしていることを確認した。既存の `stripTerminalControlSequences` を再利用しており、新しい実装を増やしていない。

適用範囲は完了条件より広い。理由欄（`reason` / `nextAction`）だけでなく、routine の `name` / `schedule` / `lastRun`、grade の `document`、おすすめ register の `title`、wave / track の `parallel_group` / `depends_on` にも通している。event 由来の値が入る全セルを対象にした判断は妥当である。

実際、本項目の起票時点で登録簿には `` `[[id|alt]]` と別名を併記できるようにする `` というタイトルの項目があり、パイプを含むため一覧の解析で列がずれていた。理由欄だけを直していたら残っていた。

## 5. 関連ドキュメント

- [[prj-0001:pjr-tr8g-git-failure-reason-progress]]
- [[prj-0001:pjr-g8m9-kata-wikilink-resolution]]
- `src/dashboard.ts`
