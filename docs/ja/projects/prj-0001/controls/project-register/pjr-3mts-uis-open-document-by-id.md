---
specdojo:
  id: prj-0001:pjr-3mts-uis-open-document-by-id
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: BA
  registered_at: "2026-11-17T14:21:19Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-MNM5
  commit_type: docs
  commit_scope: kata
---

# PJR-3MTS uis の代表の画面仕様を書き、uis の rulebook と sample から運用の記述を外す

## 1. 概要

カタログに足した uis-open-document-by-id（VS Code の ID で文書を開く入力）を書き、kata-slim と同じ一覧で uis-rulebook と uis-sample を簡潔にする

## 2. 入力

- uis はカタログに代表の成果物がなかったため kata-slim の track に入らなかった。利用者が 2026-11-17 に、VS Code 拡張の「SpecDojo: Open Document by ID」を代表の画面にする案（A）を選び、orchestrator が dct-user-interface-model に uis-open-document-by-id を足した
- 実装は packages/vscode-specdojo/src/extension.ts の specdojo.openById。入力欄（prompt「Enter a SpecDojo document ID」）、索引がないときの警告「SpecDojo index not found. Run: specdojo index build」、ID が見つからないときの警告「ID not found: `<id>`」、索引の行番号つきの文書を開く処理がある

## 3. 完了条件

- カタログの `uis-open-document-by-id` を、[[specdojo:uis-rulebook|uis-rulebook]] に沿って `docs/ja/product/010-business-specs/040-user-interface-model/uis-open-document-by-id.md` に書く。表示項目・操作・遷移・入力の検証・警告の表示と利用者の次の手を、実装（`specdojo.openById`）の文言と分岐に合わせる。実装にない振る舞いは書かず、決まっていない点は `_UNDECIDED_` で残す。
- uis-rulebook から、どの成果物にも共通する文書の運用の記述を外し、共通の正本への参照にする。手本は [[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]] の対応結果の「他の型へ広げるときの一覧」と、改訂済みの sld-rulebook である。大きさは、空白を除いた文字数で今の 8 割以下を目安にする。
- uis-sample から、文書の運用の記述と同じ判断の言い直しを外す。結論（表示・操作・検証・エラーの判断）は変えない。大きさは、空白を除いた文字数で今の 7 割以下を目安にする。
- 前後の文字数を個票の対応結果に書く。
- 型の grade と成果物の grade は、統合の後に orchestrator が流す。executor は grade を実行せず、作業内容の該当の行を open のまま残す。完了条件の外の指摘は記録だけにする。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                            | 担当         | 状態 | メモ |
| --- | ----------------------------------------------- | ------------ | ---- | ---- |
| 1   | 代表の画面仕様（uis-open-document-by-id）を書く | BA           | open | -    |
| 2   | uis-rulebook から運用の記述を外す               | BA           | open | -    |
| 3   | uis-sample から運用の記述と言い直しを外す       | BA           | open | -    |
| 4   | 統合の後に型と成果物を grade し、結果を書く     | orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-mnm5-kata-slim]]
- [[prj-0001:pjr-8s4t-sld-kata-slim-pilot]]
