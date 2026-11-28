---
specdojo:
  id: prj-0001:pjr-gdmb-guarded-push-entry
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-11-28T04:25:36Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-D4RJ
  depends_on:
    - PJR-HPAW
---

# PJR-GDMB 範囲を守る push の入口を作り、オーケストレーターにだけ承認つきで許す

## 1. 概要

PJR-D4RJ の決定（選択肢 B）に従い、範囲を守る push の入口を specdojo のコマンドとして作る。オーケストレーターにだけ毎回の承認で許し、各環境の `git push` の deny と executor の守りは残す。PJR-HPAW で `specdojo git` の `push` を拒んだ後に、この入口だけを push の経路にする。

## 2. 入力

- PJR-D4RJ で選択肢 B を採った（indie、2026-11-28）。claude・codex・copilot・opencode は道具の側で git push を拒んでおり、本文の文言だけでは許せない
- PJR-HPAW で specdojo git の push を拒む。この入口はその後に作り、push の唯一の経路にする
- v0.10.0 に入れる。担当 DEV・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 完了条件

- push の入口を足す。名前とコマンドの形（例: `specdojo git push --project <id> [--branch <branch>]`）は executor が決め、理由を個票の対応結果に書く。
- 次のものは拒む。
  - `project/<id>/develop` と `feature/<project-id>/*` 以外のブランチへの push
  - `main` への push
  - `--force`・`--force-with-lease`・`+refspec` など、履歴を書き換える push
  - タグの push、`--all`・`--mirror`・`--delete`
  - 上流の先端の子孫でない（fast-forward にならない）push
- 送る前に、送るブランチ・remote・commit の範囲と件数を表示する。
- `--dry-run` で、送らずに表示だけを行える。
- exec の executor・reporter の実行中（runner が agent に渡す環境など、executor が判定の仕方を決める）に呼ばれたときは、git を起動する前に拒む。
- 判定の仕方と、すり抜けが残る場合はその内容を、個票の対応結果に書く。
- 書き込みの git 操作と同じロックに並べる。
- オーケストレーターの各環境の設定の案を、個票の対応結果と報告の `handoff` に書く。案の中身は次のとおり。
  - 環境は claude の `settings.orchestrator.json`、codex の rules、copilot、opencode、agy のラッパー（PJR-D5RS）
  - この入口だけを毎回の承認（ask など）で許す
  - `git push` の deny は残す
  - executor の設定は、この入口も拒む
- 文言の案も、個票の対応結果と報告の `handoff` に書く。
  - 対象は、`CLAUDE.md`・`AGENTS.md`・`.opencode/AGENTS.md`・`.github/copilot-instructions.md`・オーケストレーターの本文
  - 中身は、push はこの入口で、範囲の中だけ、毎回の承認を得て行うこと
  - feature ブランチ `feature/prj-0001/orchestrator-git-push`（b36caa3900）の案を元にしてよい
- 単体テストまたは統合テストで、次の場合を確かめている。
  - 範囲の中の push が通る
  - 範囲の外のブランチ・`main`・force・タグ・fast-forward にならない push を拒む
  - executor の実行中の呼び出しを拒む
  - `--dry-run`
- コマンドリファレンスとオーケストレーターの運用の説明に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`CLAUDE.md`・`AGENTS.md` など）は変えない。案は上のとおり個票の対応結果と報告の `handoff` に書き、反映は利用者の承認のもとオーケストレーターが行う。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
