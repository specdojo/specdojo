---
specdojo:
  id: prj-0001:pjr-ynqg-watch-headless-diagnosis
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
  registered_at: "2026-11-23T00:13:23Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-52EE
  depends_on:
    - PJR-3M4M
  commit_type: feat
  commit_scope: exec
---

# PJR-YNQG 判断が要る止まりの診断の案をヘッドレスの agent に書かせる

## 1. 概要

判断が要るものに分けた止まりについて agent を起こし、診断と次の手の案を朝の報告に書かせる。agent には手を打たせない（PJR-52EE の子の 3）

## 2. 入力

- PJR-52EE を 4 件に分ける。決まった手当ては規則で行い、判断が要るものは agent に診断の案だけを書かせ（案 C）、立ち上げたままのオーケストレーターのために待つコマンドを足す（案 A）。MCP を使う案は採らない（利用者の決定、2026-11-23）

## 3. 完了条件

- 見張り（子の 1）が「判断が要るもの」に分けた止まりについて、`specdojo orchestrator launch` などでヘッドレスの agent を起こし、playbook と止まった理由の記録を渡して、診断と次の手の案を朝の報告に書かせる。
- 起こす agent と起動のコマンドは exec-defaults（`command_template`・名簿）で決まり、agent の種類に頼らない。どの agent を使うかは設定で選べ、既定は起こさない。
- agent に許すのは、読み取りと朝の報告への書き込みだけとする。claim・再開・release・commit・設定の変更・登録簿の記帳はさせない。許す範囲を、provider ごとの権限の設定の案として個票の対応結果に書く（保護された設定は変えない）。
- 1 晩に起こす回数と 1 回の時間に上限を設ける。同じ止まりで二度起こさない。
- agent が失敗したり上限に達したりしても、見張りと朝の報告は止まらない。
- cron と routine だけで動く。
- 偽の agent（決まった診断を返すスクリプト）で、起こし方・渡す中身・書き込みの範囲を確かめる統合テストを足す。
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
