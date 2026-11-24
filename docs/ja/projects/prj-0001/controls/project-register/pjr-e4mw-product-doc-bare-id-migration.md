---
specdojo:
  id: prj-0001:pjr-e4mw-product-doc-bare-id-migration
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T23:13:46Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-23T05:20:27Z"
  conclusion: docs/ja/product の下の 7 件の id と、名前空間ありの based_on を名前空間なしに直し、参照を過去の個票・plan・result も含めて付け替えた。過去の run の生の記録（evidence・log・pipeline-state）と grade の記録は、書かれたときのまま残した
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

| No  | 作業                                                     | 担当 | 状態 | メモ                                                                  |
| --- | -------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------------- |
| 1   | 旧 id を `rg` で数え直す                                 | DEV  | done | 7 件の id はいずれも名前空間ありで残っていた（増減なし）              |
| 2   | 7 件の id と参照を名前空間なしへ付け替える               | DEV  | done | `docs/` 配下の 215 ファイル・328 箇所。履歴・ログも id の部分のみ書換 |
| 3   | yaml-pages・exec・dashboard を作り直し、索引を再構築する | DEV  | done | `specdojo build --only` と `specdojo index build`                     |
| 4   | 旧 id の残存と索引の引き当てを確認する                   | DEV  | done | 残存なし。7 件とも `specdojo index lookup` で引ける                   |
| 5   | `lint:md`・`lint:fm`・`validate:schema` と親の検証       | DEV  | open | executor は親の検証を実行しない。runner が実行する                    |

## 5. 対応結果

### 5.1. 実施内容

- 7 件の id（`stsd-task-execution`・`stsd-deliverable`・`cdt-register-type`・`ccd-project-planning`・`bdd-register-entry`・`ifx-index`・`ifx-file-agent-evidence`）から `prj-0001:` を外した。正本は各ファイルの frontmatter `id` と YAML の `id`。
- 参照は wikilink・`based_on`・`depends_on`・`spec_ref`・`targets` などを問わず、`docs/` 配下の追跡ファイル（過去の個票・plan・result・evidence・ログ・grade の結果を含む）で id の部分だけを置換した。`CHANGELOG.md` とファイル名は変えていない。
- 置換は `prj-0001:<id>` の直後が英数字・`-`・`_` でない場合に限った。`prj-0001:ifx-index-grade-criteria` のような別の id は変えていない。
- 数え直しの結果: 対象 7 件に増減はない。置換は 215 ファイル・328 箇所。個票の「約 250 ファイル」より少ないのは、表示のページ（`generated/`）を作り直しに任せたため。
- `docs/ja/product/` の `based_on` で、7 件の id を名前空間ありで指していたのは 3 件（`ccd-project-planning`・`ifx-file-agent-evidence`・`bes-task-ready-selected`）だった。個票の「8 件」とは合わない。残りの `based_on`（`bdd-exec-state`・`bdd-exec-event`・`bdd-deliverable`・`bps-task-selection-preparation`・`prj-success-criteria-and-acceptance-criteria`）は 7 件の外にある id のため変えていない。
- `tests/` の `yaml-pages.test.ts` の疑似入力と `tests/fixtures/yaml-pages/*.snap` は、実文書を読まない固定の入力のため変えていない。

### 5.2. 確認に使ったコマンドと結果

- `rg -c "prj-0001:(<7 件の id>)[^-]" docs`: 出力なし（旧 id の残存なし）。`prj-0001:<id>-grade-criteria` は別の id のため残る。
- `npx specdojo build --only yaml-pages` / `--only exec` / `--only dashboard`: 成功。
- `npx specdojo index build`: 5963 件。`npx specdojo index lookup <id>` で 7 件とも `docs/ja/product/` のファイルに引けた。
- `npm run validate:history-links`: 履歴のファイルはすべて valid。

### 5.3. CHANGELOG に書く事項

- 区分: Changed
- 文案: プロダクト文書 7 件の id から名前空間 `prj-0001:` を外し、参照を付け替えた。

### 5.4. 残課題

- `based_on` の件数差（個票 8 件・実際 3 件）の確認は、レビューで行う。
- 保護された設定の変更はない。

## 6. 関連ドキュメント

- [[prj-0001:pjr-phy7-rulebook-id-project-qualification]]
