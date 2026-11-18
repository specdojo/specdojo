---
specdojo:
  id: prj-0001:pjr-1565-orchestration-queue
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-17T22:58:15Z"
  due_on: "2026-11-30"
  depends_on:
    - PJR-8KXJ
---

# PJR-1565 grade・register の実行・build を混ぜた順番の予約を、specdojo の機能で流す

## 1. 概要

orchestrator が scratchpad のシェルスクリプトで grade・exec run・build の順番を予約しており、セッションが終わると消え、利用者から見えないため、specdojo の機能で予約して流せるようにする。

## 2. 入力

- 利用者の問い（2026-11-18）: 実行の予約は specdojo の機能か、orchestrator が script を書いているのか
- orchestrator の調べ（2026-11-18）: 予約は orchestrator が書いたシェルスクリプト（前の出力に終わりの行が出るまで 30 秒ごとに確かめ、次の npx specdojo を実行する）。specdojo にあるのは exec run --register A B C（--on-failure）、register の --depends-on、--if-busy wait（同じ種類のロックだけ）。grade・exec run・npm run build を混ぜた順番と、別の種類の作業の終わりを待つ機能はない。job は validate と list だけで、routine から起動される
- 利用者の決定（2026-11-18）: 方式（job の定義に段を並べる、exec run に予約を持たせる など）は executor が比べて決め、理由を書く。予約の中身と進み具合が登録簿か exec status から見えること。dist の作り直しは統合の後の処理の項目に任せる

## 3. 完了条件

- grade・`exec run`（register・schedule）・統合の後の処理を混ぜた順番の予約を、specdojo のコマンドで作って流せるようにする。方式（job の定義に段を並べる、`exec run` に予約を持たせる など）を 2 案以上比べて決め、比べた結果と理由を個票の対応結果に書く。
- 予約は git の管理下か登録簿の横に残り、orchestrator のセッションが終わっても消えない。予約の中身・進み具合・止まった段と理由が、登録簿か `exec status` から見える。
- 各段は前の段の終わり（成功・失敗）を待って始まる。段が失敗したときに止めるか続けるかを指定できる。待つ処理は、プロセス名の検索（`pgrep -f` など）に頼らない。
- 段の中身は今のコマンドを呼ぶだけとし、任意のシェルを受け付けない。dist の作り直しは [[prj-0001:pjr-8kxj-post-integration-build-dist|PJR-8KXJ]] の統合の後の処理に任せる。
- 予約の作成・順番どおりの実行・失敗時の停止と継続を、単体テストか統合テストで確かめる。
- orchestrator の定義（`.agents/specdojo-orchestrator.agent.md`）とプロジェクトの運用メモで、スクリプトの代わりにこの機能を使うように書き換える案を個票の対応結果に書く。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。
- 設計の変更を関係する文書（`docs/ja/specdojo/references/command-reference.md`・exec の設計書など）へ反映する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ |
| --- | ----------------------------------------------------- | ---- | ---- | ---- |
| 1   | 予約の方式を比べて決める                              | ARC  | open | -    |
| 2   | 予約の作成・実行・進み具合の表示を実装する            | ARC  | open | -    |
| 3   | テストと文書を足し、orchestrator の定義の変更案を書く | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-8kxj-post-integration-build-dist]]
