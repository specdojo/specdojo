---
specdojo:
  id: prj-0001:pjr-ga2k-routine-sequential-actions
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-31T12:41:15Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-31T13:45:20Z"
  conclusion: routine の action を oneOf で単一オブジェクトと配列の双方を受け付ける形へ拡張した。配列の場合は先頭から順に全段を実行し、段ごとに異なる kind と引数をそのまま委譲する。途中で失敗や skip が生じても後続を続行し、全体結果と段別結果を記録する。単一 action の実行経路と state 形式は維持したため、既存 routine 6 件の移行は不要である。キー名は単数形のままとし、単一を基本として配列も許容する rulebook frontmatter の sample と同じ形に揃えた。
---

# PJR-GA2K routine の action で複数段の順次実行を可能にする

## 1. 概要

`routine` の `action` は単一オブジェクトのみを受け付けるため、複数の処理を順に実行できない。

grade を段階的に回す運用では、リファレンスありで評価し、続いてリファレンスなしで失敗分を拾い、最後に条件を満たしたものだけを高性能 agent で確認する流れが要る。

`action` を `oneOf` で配列も受け付ける形へ拡張し、配列の場合は先頭から順に実行する。

## 2. 完了条件

- `action` に配列を指定でき、先頭から順に実行される。
- 既存の単一オブジェクト形式がそのまま動作する。
- 途中の段が失敗した場合の扱いが定義されている。
- 段ごとに異なる引数を指定できる。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業               | 担当 | 状態 | メモ                                       |
| --- | ------------------ | ---- | ---- | ------------------------------------------ |
| 1   | 失敗時の扱いの決定 | ARC  | done | 後続続行、全体結果の優先順位を定義         |
| 2   | schema の拡張      | ARC  | done | 単一または1件以上の配列を `oneOf` で許容   |
| 3   | 実行処理の実装     | ARC  | done | 順次実行、全体集約、段別結果の state 記録  |
| 4   | 規範文書の更新     | ARC  | done | routine 運用ガイドと概念データフローを更新 |

### 3.1. cron による代替が成立しない理由

時刻をずらして複数の routine を定義する方法では、順序を保証できない。

grade の実測では1件あたり 5 分から 11 分かかり、失敗時の再試行でさらに延びる。kata 285 件を対象にすると1段階で 24 時間から 52 時間を要する計算になる。`--changed-only` で絞っても、初回や rubric の更新後は全件が対象になる。

`policy.overlap: skip` により重複実行は防げるが、2段目が1段目の未完了分を無視して走るため、順序の意味が失われる。

### 3.2. 単数形を保つ理由

`action` は単一を基本とし、必要な場合に配列も受け付ける形とする。キー名は単数形のままとする。

既存の routine 6 件はすべて単一であり、複数段が要るのは grade の運用に限られる。rulebook の Frontmatter における `sample` も、単一を基本としつつ `oneOf` で配列を許容し、キー名は単数形である。同じ形にすることで既存 routine の移行が不要になる。

常に複数となる `categories` や `findings` とは性質が異なる。

### 3.3. 決定した方針

- 途中の段が失敗または skip でも後続を実行する。grade の後段が前段の失敗分を拾う用途を優先し、失敗時中断の切り替えは設けない。
- 全体結果は `failure`、`skipped`、`success` の優先順で集約する。複数 action の各段は、1始まりの index、kind、結果を `routine-state.json` の `last_action_results` に記録する。
- 段の間の待機は設けない。各 action は同期実行されるため同時には動かず、追加の負荷制御は各 action の `parallel` など既存引数で行う。

## 4. 対応結果

- `routine.schema.yaml` と CLI 検証を、従来の単一 action または1件以上の action 配列を受け付ける形へ拡張した。
- 配列 action を先頭から同期的に全段実行し、段ごとに異なる kind・引数をそのまま委譲する処理を実装した。途中の failure / skip 後も続行し、全体結果と段別結果を記録する。
- 単一 action の実行経路と state 形式を維持し、既存 routine の移行を不要とした。
- schema、単一・配列の CLI 検証、結果集約をテストへ追加し、routine 運用ガイド、コマンドリファレンス、概念データフローへ運用規則を反映した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-25f4-grade-two-stage-filter]]: 段階的な grade 運用。本項目を前提とする。
- [[prj-0001:pjr-3d7q-grade-target-filter]]: 判定結果による対象選択。段ごとに対象を変えるために要る。
- [[specdojo:routine-operation-guide]]: routine の運用手順。
