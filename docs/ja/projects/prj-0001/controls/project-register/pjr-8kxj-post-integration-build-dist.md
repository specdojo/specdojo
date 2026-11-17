---
specdojo:
  id: prj-0001:pjr-8kxj-post-integration-build-dist
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-17T22:57:37Z"
  due_on: "2026-11-30"
---

# PJR-8KXJ exec run の統合の後に、src が変わったら dist を自動で作り直す

## 1. 概要

src を変える項目の統合の後に dist が古くなり次の run が止まるため、exec-defaults の pipeline に統合後の処理（post_integration）を許可リストの ID で指定できるようにし、build-dist を流す

## 2. 入力

- 利用者の提案（2026-11-18）: dist を自動で作り直す処理は postprocess 等で指定する
- orchestrator の調べ（2026-11-18）: `parent_validations` は固定 ID の許可リストと paths で、executor の後・統合の前に親が流す。dist が src より古いことは src/shared/dist-freshness.ts が検出して run を止めるだけで、orchestrator が統合のたびに npm run build を手で挟んでいる
- 利用者の決定（2026-11-18）: `pipeline.post_integration` に ID（最初は build-dist = npm run build）と paths を書き、統合した変更が paths に当たるときだけ、親が exec のロックを持ったまま流す。失敗しても統合は戻さず、失敗を記録して次の run は dist-freshness の判定で止める。exec-defaults.yaml と package.json は保護された設定のため、反映は変更案として個票に書き、利用者の承認のもと feature ブランチで行う

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
