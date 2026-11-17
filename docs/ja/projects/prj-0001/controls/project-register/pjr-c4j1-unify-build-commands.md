---
specdojo:
  id: prj-0001:pjr-c4j1-unify-build-commands
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-16T11:00:20Z"
  due_on: null
  derived_from:
    - PJR-C5AF
  commit_type: refactor
  commit_scope: cli
---

# PJR-C4J1 区分ごとの build を build --only にまとめる

## 1. 概要

区分ごとの 6 つの build を、利用者には build と build --only で見せる形にまとめる。同じ種類の操作が系統ごとに分かれているため（PJR-C5AF）。

## 2. 入力

- PJR-C5AF のまとめる候補: index・catalog・schedule・register・dashboard・yaml-pages の build を、利用者には build と build --only `<区分>` で見せる。個別のコマンドは内部用か非推奨の別名にする。hook や job が呼ぶ個別の build の入口を確かめてから進める

## 3. 完了条件

- 利用者は `build` と `build --only <区分>` で、区分ごとの生成を流せる。
- hook・job・runner が呼ぶ個別の build の入口が壊れない。
- 個別の build コマンドは内部用か非推奨の別名になり、リファレンスに書かれている。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | 個別の build の呼び出し元を洗い出す             | DEV  | open | -    |
| 2   | build --only を実装し、個別のコマンドを整理する | DEV  | open | -    |
| 3   | 文書を更新する                                  | DEV  | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-c5af-command-inventory]]
