---
specdojo:
  id: prj-0001:pjr-1rjp-grade-stale-yaml-sample-pages
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T04:56:18Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-AEKE
  commit_type: fix
  commit_scope: grade
---

# PJR-1RJP rulebook の grade が YAML の sample の古い表示のページを読む

## 1. 課題内容

rulebook の grade が samples/generated の古いページを読み、sample に入っている項目を「ない」と誤って評価した

## 2. 入力

- 利用者の決定（2026-11-23）: オーケストレーターの推奨どおり起票する
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------- |
| 原因     | rulebook の grade が YAML の sample を git 管理外の表示のページで読み、そのページが正本より古いまま使われる |
| 対応策   | 古い表示のページを使わないようにする（作り直すか、正本の YAML を渡す）                                      |
| 依存事項 | なし                                                                                                        |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                |

- `grade run --target kata` が rulebook を grade するとき、YAML の sample を git 管理外の表示のページ（`samples/generated/<name>.md`）で読み、そのページが古いまま使われる。2026-11-23 の PJR-AEKE の grade で、sample に入っている `info.version`・`based_on`・`info.description` が「ない」と 2 回誤って評価された。
- grade の前に、参照する表示のページが正本の YAML より古ければ作り直すか、YAML の正本を直接渡す。どちらにするかを executor が決め、理由を個票の対応結果に書く。
- 単体テストを足す（正本の YAML より古い表示のページを使わないこと）。
- 関連する設計・ガイド・CLI リファレンスを直す。
- runner の動きを変える場合は、統合の後に orchestrator が `exec smoke` を流して確かめてから close する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
