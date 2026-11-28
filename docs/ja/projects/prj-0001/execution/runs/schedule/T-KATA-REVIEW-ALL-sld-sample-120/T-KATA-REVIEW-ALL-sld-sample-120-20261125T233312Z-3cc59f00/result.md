---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sld-sample-120-20261125t233312z-3cc59f00
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sld-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sld-sample-120/T-KATA-REVIEW-ALL-sld-sample-120-20261125T233312Z-3cc59f00/plan.md
  started_at: "2026-11-25T23:33:22.184Z"
  completed_at: "2026-11-25T23:39:37.000Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sld-sample
    - specdojo:sld-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `docs/ja/specdojo/samples/sld-sample.md` の表の並びを2か所入れ替えた。章構成は rulebook の5章と一致しており、章の移動・分割・統合は不要と判断した。文言は変えず、sample 以外のファイルは変更していない。
- 確定前の確認の表を、rulebook の受入確認の観点の順（配置と技術制約、記録・状態の網羅、削除・復旧判断の実効性）に揃えた。
- 場面別の対処の表を、保管場所一覧の行の順に揃えた。
- 検証では `npx prettier --check` と runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。変更種別による非適用は `lint:ts`、`lint:md`、`lint:fm`、`test:integration`、`typecheck`、`test:unit` である。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 関連仕様・実装配置との対応と検証（本書を確定する前の確認） | 確認の行の順が rulebook の受入確認の観点の順（配置と技術制約、記録・状態の網羅、削除・復旧判断の実効性）と合わず、網羅の確認が削除・復旧の確認2行の間にあった。 | 「どの記録・状態にも置き場所がある」の行を2行目へ移し、観点を配置、網羅、削除・復旧の順にした。 | `vp-arc-document-structure`、sld-rulebook の「関連仕様・実装配置との対応と検証要件」 | - |
| R2-2 | R2 | 削除・退避・復旧の判断基準（場面別の対処と復旧手順） | 場面の順が保管場所一覧の行の順とずれていた。物理の場面（売場の期限切れ品）がタブレットの場面の間にあり、タブレットの場面も一覧と別の順だった。 | 一覧の順（売場、`config/store-config.yaml`、取引セッションの2場面、`data/sales/`、`data/summary/`、空き容量不足の `receipts/` と `tmp/`）に並べ替えた。文言は変えていない。 | `vp-arc-document-structure`、`vp-qe-omissions-consistency` | 要判断（時系列の順で会計中の再起動を先に置く案もあり好みの差がある。一覧から場面を引きやすい順を選んだ。採らない場合はこの行の順の変更を戻す） |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sld-sample.md`: 「関連仕様・実装配置との対応と検証」の確認の表で、「どの記録・状態にも置き場所がある」の行を2行目へ移し、観点を配置、網羅、削除・復旧の順にした。「削除・退避・復旧の判断基準」の場面別の対処の表は、保管場所一覧の順（売場、`config/store-config.yaml`、取引セッションの2場面、`data/sales/`、`data/summary/`、空き容量不足）に並べ替えた。文言は変えていない。差分は4行追加・4行削除。

## 3. 申し送り

- grade の F001（`vp-arc-conciseness`）と F004（`vp-ux-language-consistency`）は R3 の観点なので、R3 で扱う。F002 と F003 は R1 で解消済みで、F005（`vp-ops-operability`）は R1 の判断どおり対象外とした。いずれも executor の handoff の R2-3 に基づく。
- R2-1: R2 / 関連仕様・実装配置との対応と検証（本書を確定する前の確認） / 確認の行の順が rulebook の受入確認の観点の順（配置と技術制約 → 記録・状態の網羅 → 削除・復旧判断の実効性）と合わず、網羅の確認が削除・復旧の確認 2 行の間にあった / 「どの記録・状態にも置き場所がある」の行を 2 行目へ移し、観点 1・2・3・3 の順にした / `vp-arc-document-structure`、sld-rulebook の「関連仕様・実装配置との対応と検証要件」 / -
- R2-2: R2 / 削除・退避・復旧の判断基準（場面別の対処と復旧手順） / 場面の順が保管場所一覧の行の順とずれていた。物理の場面（売場の期限切れ品）がタブレットの場面の間にあり、タブレットの場面も一覧と別の順だった / 一覧の順（売場 → `config/store-config.yaml` → 取引セッションの 2 場面 → `data/sales/` → `data/summary/` → 空き容量不足（`receipts/`・`tmp/`））に並べ替えた。文言は変えていない / `vp-arc-document-structure`、`vp-qe-omissions-consistency` / 要判断（時系列の順で会計中の再起動を先に置く案もあり好みの差があるが、一覧から場面を引きやすい順を選んだ。採らない場合はこの行の順の変更を戻す）
- R2-3: R2 / 全体（grade の指摘の扱い） / grade F002・F003 は R1 で直っているため繰り返さない。F001（`vp-arc-conciseness`）と F004（`vp-ux-language-consistency`）は R3 の観点なので R3 に任せる。F005（`vp-ops-operability`）は型の段のレビューで使わない観点のため R1 の判断どおり直さない / - / kata-guide の「kata の観点の組」 / -

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」の R2 に従い、R1 が直した版を読んだ。rulebook の本文構成と章の順を照合し、章構成は一致していた。差分は表の行の並べ替えに限り、`vp-arc-document-structure` と `vp-qe-omissions-consistency` を根拠にした。rulebook など sample 以外は変更していない。
