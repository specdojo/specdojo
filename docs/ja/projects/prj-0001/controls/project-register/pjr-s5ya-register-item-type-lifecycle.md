---
specdojo:
  id: prj-0001:pjr-s5ya-register-item-type-lifecycle
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-31T22:45:16Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-01T00:25:14Z"
  block_reason: "agent exited with non-zero code: executorによる `node --import tsx src/specdojo.ts register build` の実行結果が `failed` となっており、「既存不整合: PJR-9RWGはevent=in-progress/item=review、PJR-S5YAはevent=open/item=in-progre…"
  conclusion: pjr-rulebook へ type 別の通常終端と判定基準、例外的な rejected と deferred の使用条件を追加した。note は終端せず open が生きている記録を意味すること、対応や回答や判断が必要になった場合は別項目を起票して note 自体は参照元として保持することを明記した。question と decision は decided、todo と risk と issue と change-request は done を通常終端とする。register-operation-guide の状態遷移表にも note の例外を反映した。既存個票のうち終端済みだった note 3 件を内容に応じて todo または decision へ分類訂正している。
---

# PJR-S5YA 登録簿の type 別に状態遷移の指針を定める

## 1. 概要

`pjr-rulebook` は文書成熟度を示す `status` の遷移基準を定めているが、`item_type` ごとに `item_status` の終端をどう扱うかを定めていない。

`note` は記録であり事実を蓄積し続けるため終端しない。PJR-VQB5 は 10 回以上の追記を重ねており、`done` にすると追記しにくくなる。一方 `question` は問いであり、答えが出たら `decided` で閉じて `conclusion` へ結論を残す。

運用として合意していても規約に無ければ、人や agent によって解釈が分かれる。agent が register を操作する場面では判断基準が要る。

## 2. 完了条件

- `item_type` ごとの終端の扱いが `pjr-rulebook` へ記載されている。
- `note` が終端しないこと、その `open` が未対応ではなく生きている記録を意味することが明記されている。
- `question` と `decision` が `decided` で終端することが明記されている。
- 既存の登録項目が新しい指針と矛盾しない。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                 | 担当 | 状態 | メモ                                                             |
| --- | -------------------- | ---- | ---- | ---------------------------------------------------------------- |
| 1   | type 別の指針の決定  | ARC  | done | 通常終端、例外的な追跡終了、note の継続記録を定義                |
| 2   | 既存項目との整合確認 | ARC  | done | 終端済み note 3件を、内容に合う todo 2件・decision 1件へ分類訂正 |
| 3   | 規範文書への記載     | ARC  | done | `pjr-rulebook` と `register-operation-guide` へ反映              |

### 3.1. 現状の曖昧さ

次の点が定まっていない。

- `note` を `done` にしてよいか。
- `question` は `decided` と `done` のどちらで閉じるか。
- `note` の `open` が「未対応」を意味するのか「生きている記録」を意味するのか。

schema の `ClosedItemStatus` は `decided` / `done` / `rejected` を終端として定義し、完了日時を必須とする。`decided` が用意されているのは `question` と `decision` のためと読めるが、対応関係が明文化されていない。

### 3.2. 採用した指針

| type             | 終端       | 備考                                           |
| ---------------- | ---------- | ---------------------------------------------- |
| `todo`           | `done`     | 完了条件を満たしたとき                         |
| `question`       | `decided`  | 結論を `conclusion` へ記載する                 |
| `decision`       | `decided`  | 決定内容を記録する                             |
| `note`           | 終端しない | `open` のまま内容を更新し続ける                |
| `risk`           | `done`     | 消滅したか、対応を終えて追跡が不要になったとき |
| `issue`          | `done`     | 解決と必要な確認を終えたとき                   |
| `change-request` | `done`     | 採択した変更の反映と確認を終えたとき           |

`rejected` は実施・回答・判断の対象外または不採択が確定した場合、`deferred` は再開条件または再評価時期を定めて追跡を停止する場合に、`note` 以外で使用する例外的な終端とした。

### 3.3. note を終端させない理由

記録は完結しない。新しい事実が得られれば追記する性質を持つ。PJR-VQB5 は agent 比較の実測記録であり、評価のたびに知見が加わっている。

`done` にすると「もう更新しない」という意味になり、追記の妨げになる。一覧では `分類` 列で `todo` と区別できるため、`open` のまま残しても対応漏れとは読まれない。

### 3.4. 論点への対応

- `note` の内容が陳腐化または置換された場合は、本文へその事実と参照先を追記し、`open` のまま保持する。対応や判断が必要なら目的に合う別項目を起票する。
- `question` 自体が不要になった場合は `rejected`、回答を先送りして再開条件または再評価時期を定める場合は `deferred` とする。
- `note` の `open` は未対応ではなく生きている記録を表す。対応要否は `item_type` と組み合わせて判断し、既存の type 別派生ビューを利用する。

## 4. 対応結果

- `pjr-rulebook` に type 別の通常終端と判定基準、例外的な `rejected` / `deferred` の使用条件を追加した。
- `note` は終端せず、`open` が生きている記録を意味すること、対応・回答・判断は別項目で追跡することを明記した。
- `register-operation-guide` の状態遷移表と `open` 項目の整理方針へ `note` の例外を反映した。
- 既存個票を確認し、終端済みだった `note` 3件を内容に応じて分類訂正した。`PJR-0122` と `PJR-T0VQ` は完了済み作業として `todo`、`PJR-1F46` は確定済み判断として `decision` とした。`item_status` は変更していない。

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook]]: 個票の状態と遷移の規約。記載先。
- [[specdojo:register-operation-guide]]: 登録簿の状態遷移とコマンドの運用手順。
- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 終端しない note の実例。
