---
specdojo:
  id: prj-0001:pjr-vm2s-register-branch-migration-trial
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T00:21:57Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2TX0
  depends_on:
    - PJR-4VD6
    - PJR-1JF6
    - PJR-FBP0
  commit_type: docs
  commit_scope: register
---

# PJR-VM2S register のブランチへ移る手順を書いて試す

## 1. 概要

prj-0001 と external_projects で起票している別のプロジェクトで、register のブランチへ移る手順を試し、既定に切り替える判断の条件を決める

## 2. 入力

- PJR-2TX0 の決定（D、1b・2a・3a・4a）を展開する。個人の運用でも、別のプロジェクトから specdojo へ起票することが多いため、早めに着手する（利用者の依頼、2026-11-23）
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- prj-0001 で register のブランチへ移る手順を書く。ブランチの作成、今の記録（個票・イベント・schedule の実行のイベント）の移し方、設定の切り替え、戻し方を含める。
- 手順に沿って、prj-0001 と別のプロジェクト（`external_projects` で specdojo へ起票しているもの）で試す。試しの期間と、問題がなければ既定に切り替える判断の条件を個票の対応結果に書く。
- 試しで見つかった問題は、元の項目を `--from` にして起票する案として個票の対応結果に書く。
- 保護された設定や `specdojo.config.json` の切り替えは、利用者の承認のもとで orchestrator が行う。executor は案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`.github/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
