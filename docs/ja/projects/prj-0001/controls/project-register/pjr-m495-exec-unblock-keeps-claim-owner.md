---
specdojo:
  id: prj-0001:pjr-m495-exec-unblock-keeps-claim-owner
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T10:47:37Z"
  derived_from:
    - PJR-T4G3
  commit_type: fix
  commit_scope: exec
---

# PJR-M495 人が unblock しても、agent の run が完了の確認で止まらないようにする

## 1. 概要

unblock を人が行っても、claim の持ち主（agent）を保つか、runner が引き継げるようにする

## 2. 入力

- 2026-11-15、bds-progress-report-005 を人（indie）が exec unblock したところ claim の持ち主が人に替わり、runner の再開が completion preflight の「task is being worked on by another actor: indie」で止まった（PJR-TN43 の E）

## 3. 完了条件

- 人が `exec unblock` しても、claim の持ち主（agent）を保つ。または、runner が再開するときに claim を agent へ引き継ぎ、completion preflight が「task is being worked on by another actor」で止めない。
- 人が別の作業として引き取る場合（人が自分で直して完了する）と、agent の run を続ける場合を区別できる。区別の仕方をガイドに書いている。
- 人が unblock した後の再開と完了を、回帰テストで確かめている。PJR-T4G3（別の agent の段で失敗したときの block）と食い違わない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | unblock の後の claim の持ち主の扱いを決めて直す | DEV  | done | -    |
| 2   | ガイドに引き取りと続行の区別を書く              | DEV  | done | -    |
| 3   | 回帰テストを足す                                | DEV  | done | -    |

## 5. 対応結果

### 5.1. 実施内容

- event の畳み込みで、`last_by` とは別に claim の持ち主 `claimed_by` を持つようにした。`claim` で設定し、`note`・`block`・ほかの actor の `unblock` では元の持ち主を保つ。`todo`・`done`・`cancelled` に移ると消す。
- `exec unblock` に `--take-over`（roster の human のみ）を足した。`--take-over` の `unblock` イベントは `take_over=true` を持ち、unblock した人が claim の持ち主になる。
- `complete`・`block`・`release` の持ち主の確かめ、completion preflight、`exec resume` の actor の解決（`resolveClaimingActor`・pipeline の再開・executor の切り替え）、limit の再開、busy actor の集計、`exec status` の `by` 列と `--by` の絞り込みを claim の持ち主で判定するようにした。持ち主の解決は `claimOwnerOf`（`claimed_by` が無ければ `last_by`）にまとめた。
- `exec-operation-guide.md` の「人が unblock するときの続行と引き取り」に、続行（`--take-over` なし）と引き取り（`--take-over`）の区別を書いた。
- 回帰テスト `tests/src/exec/unblock-claim-owner.test.ts` を足した。人の unblock の後に、agent での再開・completion preflight・再度の block が通ること、`--take-over` で人が完了できること、agent の `--take-over` を拒むことを確かめる。

### 5.2. 決めたこと

- 完了条件の 2 案のうち、「claim の持ち主を保つ」を採った。runner の再開のたびに claim を引き継ぐ案は、人が引き取ったのか続行させたいのかを runner が区別できず、人の claim を agent が奪う危険がある。持ち主を状態として保てば、区別を人の明示的な操作（`--take-over`）に寄せられる。
- 既定（`--take-over` なし）を続行にした。2026-11-15 の事象は続行の意図であり、`unblock` の既存の意味（同じ試行を続ける）とも合う。人が引き取って完了する従来の手順は `--take-over` を付けるか、`exec complete --force` を使う。
- 過去の event も同じ規則で畳み込む。過去に人が unblock したタスクは、claim の持ち主が agent に戻る。人がすでに完了させたタスクは `done` のため影響しない。
- `--take-over` は claim を持ち主から移すため、`--force` と同じく human に限った。
- PJR-T4G3 との整合: claim の持ち主を `claimed_by` で判定するため、人の unblock の後に失敗した agent の段の block も通る。T4G3 の「runner 自身が claim・再開した run に限って claim した actor に依らず block する」とは食い違わず、T4G3 の実装も `claimOwnerOf` を使って claim した actor を記録できる。
- 同じ秒の event の並べ替え（`orderSameTimestampEventsByState`）は `last_by` のまま残した。並べ替えの補助に限られ、変えると既存の順序づけに影響するため。

### 5.3. CHANGELOG に書く事項

- 人が `exec unblock` しても claim の持ち主は変わらず、agent の run を `exec resume` で再開して完了できるようになった（以前は completion preflight が「task is being worked on by another actor」で止めた）。
- `exec unblock --take-over` を追加した。human だけが使え、unblock した人が claim の持ち主になる。人が引き取って自分で `exec complete` する場合は、この指定が必要になる（または `exec complete --force`）。
- `exec status` の `by` 列と `--by` の絞り込みは、最後に event を書いた actor ではなく claim の持ち主を表すようになった。

### 5.4. 残課題

- なし

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
