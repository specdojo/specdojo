---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-imp-interface-sample-040-20261123t123446z-c15e957d
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-imp-interface-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-imp-interface-sample-040/T-KATA-WAVE-6-DESIGN-imp-interface-sample-040-20261123T123446Z-c15e957d/plan.md
  started_at: "2026-11-23T12:34:56.345Z"
  completed_at: "2026-11-23T12:49:52.106Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:imp-interface-sample
    - specdojo:imp-interface-rulebook
---

# Edit Result

## 1. 実施内容

- imp-interface-rulebook を兄弟 rulebook (`imp-data`, `imp-test`) の構成に合わせて簡潔化しました。
- grade の指摘に基づき、F001〜F008、F011〜F013 の事項を rulebook 側で解消しました。
- F009, F010, F011 に関連する sample 側の不整合については、次回の sample 改訂タスクへ申し送りました。
- F014 に関する `recipe` および `template` の扱いについては、有人判断事項として申し送りました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/imp-interface-rulebook.md`: grade の指摘（F001, F002, F003, F006, F013）に基づき、未解決事項や対応方針の記述を整理・簡潔化しました。また、F007 に基づき、Frontmatter の検証方法に関する記述を追加しました。

## 3. 申し送り

- sample 側の不整合（F009, F010, F011）は、この段では sample を変更しないため未解消です。次の sample 改訂で以下を実施する必要があります: 影響分析サマリの前に高・中・低の尺度と最大値規則を定義する。目的と適用範囲に対象外の I/F とその理由、対象期間を明記する。対応方針の列を「影響度、対応項目、期限、担当、調整先、前提条件、完了条件」とし、担当を Role code で記載する。未解決事項に「判断・対応への影響」「当面の扱い」「転記先の登録項目」の列を追加し、担当を Role code にする。`based_on` に個票 ID (`PJR-XXXX`) と `imp-business` を記載する。
- F014 に関して、`recipe` および `template` は兄弟の影響調査 rulebook (`imp-business`, `imp-data`, `imp-test`, `imp-operations`) と同様に `undecided` のまま据え置いています。要否については人間が判断し、`ready` にする前に `not-needed` または完全な ID を指定する必要があります。Markdown が既定のため `target_format` の宣言は追加していません。
- F007 については、`npm run lint:fm` による検証手順を Frontmatter の章に記述することで対応しました。なお、schema ファイルのパス自体は、正本の再掲を避けるため rulebook 内には記述していません。
- sample 側の不整合（F009・F010・F011）は、この段では sample を変更しないため未解消。次の sample 改訂で直す: 影響分析サマリの前に高・中・低の尺度と最大値規則を書く。目的と適用範囲に対象外の I/F とその理由、対象期間を書く。対応方針の列を「影響度、対応項目、期限、担当、調整先、前提条件、完了条件」にし、担当を Role code にして個人名を外す。未解決事項に「判断・対応への影響」「当面の扱い」「転記先の登録項目」の列を足し、担当を Role code にする。`based_on` に個票 ID（`PJR-XXXX`）と `imp-business` を書く。
- F014: `recipe`・`template` は兄弟の影響調査 rulebook（`imp-business`・`imp-data`・`imp-test`・`imp-operations`）と同じく `undecided` のまま据え置いた。要否は人が判断し、ready にする前に `not-needed` か完全 ID へ決める。markdown が既定のため `target_format` は追加していない。
- F007 は `npm run lint:fm` による検証を Frontmatter の章に書いて対応した。schema ファイルのパスを rulebook に再掲しない（正本の再掲を避けるため）。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/rulebooks 配下の rulebook だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と `done_criteria` に沿って簡潔に整えるアプローチを取りました。rulebook 内の完成例は排除し、記述ガイドの整備と、指摘された不整合（主に記述の不足や責任の明確化）の解消に注力しました。
