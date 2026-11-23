---
specdojo:
  id: prj-0001:pjr-3m4m-watch-automatic-remedies
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T00:13:19Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-52EE
  depends_on:
    - PJR-40EE
  commit_type: feat
  commit_scope: exec
---

# PJR-3M4M 見張りが分けた種類ごとに決まった手当てを打つ

## 1. 概要

使用量の上限・負荷の時間切れ・統合先の同期に、exec-defaults で選べる手当てを打つ。判断が要るものには手を打たない（PJR-52EE の子の 2）

## 2. 入力

- PJR-52EE を 4 件に分ける。決まった手当ては規則で行い、判断が要るものは agent に診断の案だけを書かせ（案 C）、立ち上げたままのオーケストレーターのために待つコマンドを足す（案 A）。MCP を使う案は採らない（利用者の決定、2026-11-23）

## 3. 完了条件

- 見張り（子の 1）が分けた種類のうち、次の 3 つに手を打てるようにする。どの手を打つかは exec-defaults の設定で選べ、既定は手を打たない。
  - 使用量の上限: 解除の時刻まで待つか、代わりの agent で流し直す。指名した agent の上限が長い（例: 数日）ときは、claim を取り消して別の agent で流し直せる。
  - 負荷による時間切れと分かる親の検証の失敗: 同じ検査を流し直してから再開する。
  - 統合先の新しい commit が要る失敗: worktree を統合先に同期してから再開する（PJR-50CF と合わせる）。ぶつかったら止めて知らせる。
- 「判断が要るもの」には手を打たない。
- 自動で手を打つ回数に上限を設け、同じタスクで繰り返し失敗したら止める。
- 手を打ったら、見張りを actor にした event として必ず残し、朝の報告と登録簿にまとめる。
- worktree と branch を消す操作は既定ではしない。
- cron と routine だけで動く。agent の種類に頼らない。
- 2026-11-13〜14 の夜の実例のうち、上限と負荷の時間切れを、統合テストの場面として再現する。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。設定の例や変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- runner と routine の動きを変えるため、統合の後に orchestrator が `exec smoke` と実際の routine の 1 回の実行で確かめてから close する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
