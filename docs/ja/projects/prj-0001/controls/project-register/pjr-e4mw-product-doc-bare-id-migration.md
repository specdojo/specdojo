---
specdojo:
  id: prj-0001:pjr-e4mw-product-doc-bare-id-migration
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
  registered_at: "2026-11-22T23:13:46Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-PHY7
  depends_on:
    - PJR-PHY7
  commit_type: docs
  commit_scope: product
---

# PJR-E4MW プロダクト文書の名前空間ありの id を名前空間なしに直し、参照を付け替える

## 1. 概要

docs/ja/product の下で prj-0001: の付いた id を持つ 7 件と、名前空間ありの based_on の 8 件を名前空間なしに直す。履歴のファイルを含めて参照をすべて付け替える

## 2. 入力

- プロダクト文書の id は名前空間なしを正とする（PJR-PHY7 の案 A、利用者の決定、2026-11-23）
- 参照の付け替えは履歴のファイルも含めてすべて行う（利用者の決定、2026-11-23）
- 2026-11-23 時点の対象: stsd-task-execution・stsd-deliverable・cdt-register-type・ccd-project-planning（Markdown）、bdd-register-entry・ifx-index・ifx-file-agent-evidence（YAML）。参照は延べ約 250 ファイル

## 3. 完了条件

- `docs/ja/product/` の下で名前空間ありの id を持つ 7 件を、名前空間なしの id に直す。Markdown は `stsd-task-execution`・`stsd-deliverable`・`cdt-register-type`・`ccd-project-planning`。YAML は `bdd-register-entry`・`ifx-index`・`ifx-file-agent-evidence`（`x-spec-meta.id` などの正本の側を直し、表示のページは yaml-pages で作り直す）。直す前に `rg` で数え直し、増減があれば個票の対応結果に書く。
- `docs/ja/product/` の下の成果物の `based_on` で、プロダクト文書を名前空間ありで指している 8 件を、名前空間なしに直す。
- 7 件の id への参照は、履歴のファイル（過去の個票・plan・result）を含めてすべて付け替える（利用者の決定、2026-11-23、indie）。書き換えるのは id の部分だけとし、記録の中身は変えない。対象は wikilink・`based_on`・`depends_on`・`spec_ref`・`targets` など、id を値に持つ箇所とする。
- 成果物カタログ（`dct-*.yaml`）の `local_id` は変えない。ファイル名も変えない。
- 付け替えの後、`rg` で旧 id（`prj-0001:<7 件の id>`）が残っていないことを確かめ、使ったコマンドと結果を個票の対応結果に書く。
- `npx specdojo index build` を流し、7 件が名前空間なしの id で引けることを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:history-links` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
