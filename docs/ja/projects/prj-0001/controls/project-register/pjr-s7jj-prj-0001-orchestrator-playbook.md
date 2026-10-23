---
specdojo:
  id: prj-0001:pjr-s7jj-prj-0001-orchestrator-playbook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-20T12:03:38Z"
  completed_at: "2026-10-22T11:11:04Z"
  conclusion: prj-0001 のオーケストレーターの運用メモ（pm-orchestrator-playbook）を書き、CLAUDE.md と AGENTS.md から参照するようにした。実行の列、agent の癖、再開の使い分け、JSEY、落とし穴、別の project との分担、リリースの手順を、0.4.1 と 0.4.2 の運用に基づいて書いた
---

# PJR-S7JJ prj-0001 のオーケストレーターの運用メモを書く

## 1. 概要

配布する本文に入れないこの環境ならではの事情（runner を変えたら JSEY で確かめる、opencode の executor は docs・src・tests だけ編集できる、gemma は確かめずに完了と報告しがち、agy の opus の割り当ては数日単位、夜間の列の分け方など）を prj-0001 の文書にまとめ、本文から参照させる。orchestrator（claude-orchestrator）が書く（2026-10-20、利用者が承認）

## 2. 完了条件

- オーケストレーター（specdojo-orchestrator）が書く（2026-10-20、利用者が実装者に指定。2026-10-22 に単独で進めることを承認）。
- `docs/ja/projects/prj-0001/030-project-management/pm-orchestrator-playbook.md` に、prj-0001 を扱うオーケストレーターの運用メモを書く。この種類の rulebook はないため、frontmatter の `rulebook` は `none` とする。
- 少なくとも次を、この数日の実際の出来事に基づいて書く。推測で書かない。
  - 実行の列の組み方（列の数、同じファイルを触る項目を順に流すこと、親の検証が 1 件ずつ流れること）
  - agent の使い分けと、それぞれの癖（opencode の executor の編集範囲、gemma の完了の報告、agy の opus の割り当て、codex と claude の上限）
  - 止まったときの再開の使い分け（`--resume`・`--resume-from executor`・`--force-restart`、CHANGELOG の衝突、古い dist）
  - 統合後の確認（JSEY の手順と、流すべき変更の範囲）と、executor の報告に頼らずに自分で確かめること
  - 落とし穴（待機が自分自身を数える、commit メッセージの行の長さ、個票の Markdown の規則、prj-0002 の作業ツリーで古い CLI が動くこと）
  - 別の project との分担と、リリースの手順
- 配布するオーケストレーターの本文は変えない。本リポジトリの `CLAUDE.md` と `AGENTS.md` に、prj-0001 を扱うときにこの文書を読むことを 1 行で書き、参照させる（保護された設定のため、利用者の承認を得て feature ブランチで行う）。
- `npm run lint:md` と `npm run lint:fm` が通る。

## 3. 作業内容

| No  | 作業                                          | 担当                  | 状態 | メモ |
| --- | --------------------------------------------- | --------------------- | ---- | ---- |
| 1   | prj-0001 のオーケストレーターの運用メモを書く | specdojo-orchestrator | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- PJR-C50G（配布するオーケストレーターの本文の見直し）
