---
specdojo:
  id: prj-0001:pjr-40ee-watch-detect-classify-report
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T00:13:15Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-52EE
  commit_type: feat
  commit_scope: exec
---

# PJR-40EE 見張りで止まった理由を分類し、イベントの記録と朝の報告に残す

## 1. 概要

routine の間隔で止まったタスク・register 項目・列を見つけ、理由の種類に分けてイベントの記録と朝の報告に残す。手は打たない（PJR-52EE の子の 1）

## 2. 入力

- PJR-52EE を 4 件に分ける。決まった手当ては規則で行い、判断が要るものは agent に診断の案だけを書かせ（案 C）、立ち上げたままのオーケストレーターのために待つコマンドを足す（案 A）。MCP を使う案は採らない（利用者の決定、2026-11-23）
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- routine の間隔で、実行中・延期・中断の schedule のタスク、register 項目（`doing`・`waiting`・`review` で止まったもの）、列（queue）の状態を見て、止まったものを見つける。見る間隔は routine の設定で決める。
- 止まった理由を種類に分ける。少なくとも、使用量の上限・負荷による時間切れ・統合先の新しい commit が要る失敗・判断が要るもの（型の決まりを変えないと直らない指摘、保護された設定の変更、commit の対象外の変更など）を扱う。分け方の根拠（どの記録のどの文言から分けたか）も残す。
- 見つけたことを、決まった置き場所（例: `execution/watch/` の下）に 1 件 1 行で足していく（イベントの記録）。同じ止まりを毎回足し直さない。置き場所と 1 行の項目を設計し、ガイドに書く。
- 手は打たない（claim・再開・release・commit をしない）。
- 朝の報告（夜間の routine の朝報告と同じ置き場所）に、止まったもの・理由の種類・次にすべきことをまとめる。人やオーケストレーターが朝に読むだけで続きを判断できる形にする。
- cron と routine だけで動く。agent の種類に頼らない。
- 2026-11-13〜14 の夜の実例（上限・型のメニューの足し忘れ・commit の対象外・branch の食い違い・負荷の時間切れ）を、分類の単体テストの場面として再現する。
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
