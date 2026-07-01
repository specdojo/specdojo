---
id: prj-0001:xer-t-launch-prj-comparison-of-alternatives-120
type: exec-result
task_id: T-LAUNCH-prj-comparison-of-alternatives-120
mode: edit
status: complete
project_id: prj-0001
plan_ref: exec/plans/T-LAUNCH-prj-comparison-of-alternatives-120-plan.md
started_at: "2026-07-01T15:06:23.868Z"
completed_at: "2026-07-01T15:11:39.304Z"
agent: claude-edit-agent
approach: sample-maintenance
---

# Edit Result

## 1. 実施内容

`prj-comparison-of-alternatives-sample` を完成版成果物・review result・recipe-maintenance result を根拠に最終調整した。

現状のサンプルと完成版成果物（`[[prj-0001:prj-comparison-of-alternatives|代替案比較]]`）を照合した結果、3 点の差分を特定し修正した。

- **§3 評価軸と評価基準**: 評価テーブルの後に「評価は機械的な加重合計ではなく根拠資料との整合で判断する」旨と「評価軸を根拠資料の主要課題に対応させる」説明を追加した。recipe-maintenance（100）で評価軸と課題 ID の対応付けが追加されたことに対応する。
- **§4 非採択または一部採択の理由**: 表に `扱い` 列を追加し、`一部採択` の扱いを明示した。完成版成果物で採用された形式に揃え、採択・一部採択・非採択の区別を読み取りやすくした。
- **§5 リスクとトレードオフ**: 一般表の後に「案ごとのリスクとトレードオフ」表（`案ID` / `主なリスク・トレードオフ` / `軽減策・扱い`）を追加した。rulebook §6.4 が「案ごとのリスクとトレードオフを記載します」と要求しており、review RVP-004 が完成版成果物の同表を evidence として引用していたが、サンプルには存在しなかった。

整形は `npx prettier --write`、検査は `npx markdownlint` で実施し、いずれもエラーなし。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-comparison-of-alternatives-sample.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-comparison-of-alternatives-120-result.md`

## 3. 申し送り

なし。

## 4. 参考資料の活用

`approach: sample-maintenance` に従い、参照の向きを「成果物 → sample」に切り替え、sample を見直す対象として編集した。

- 見直しの根拠とした成果物・review result:
  - `[[prj-0001:prj-comparison-of-alternatives|代替案比較]]`（完成版、review approve 済み）: サンプルとの差分特定の一次根拠。
  - `prj-0001:xrr-t-launch-prj-comparison-of-alternatives-090`（review result、findings なし・全 RVP pass・approve）: RVP-003 が「技術的実現性と影響」表の存在を evidence として引用、RVP-004 が「案ごとのリスク・トレードオフ表」の存在を evidence として引用。サンプルに欠けていた表の追加根拠。
  - `prj-0001:xer-t-launch-prj-comparison-of-alternatives-100`（recipe-maintenance result）: 評価軸と課題 ID の対応付けを recipe に追加した経緯を確認。sample の §3 追記の根拠。
  - `docs/ja/specdojo/rulebooks/prj-comparison-of-alternatives-rulebook.md`（完成版との整合確認）: §6.4 に「案ごとのリスクとトレードオフを...記載します」と明記されており、sample の追加表は rulebook の要求に沿った最小記述例として正当。
  - `docs/ja/specdojo/standards/sample-authoring-standard.md`: 「完成例として成立させる」「必須要件を満たす最小記述例」「規則の丸写しを避けて完成した記述例として書き下す」を確認し、追記箇所を適切な粒度で抑えた。
- 改訂した記述とその根拠:
  - §3 評価解釈の追記: recipe-100 結果および完成版成果物の §3 末尾段落に対応。一般化された駄菓子屋文脈で課題リストを具体化した。rulebook 本文の丸写しにならないよう業務文脈に落とし込んだ。
  - §4 `扱い` 列の追加: 完成版成果物の表形式に倣い、一部採択の扱いを明示した。rulebook の推奨表（案ID / 理由 / 再評価条件）は最低限の列定義であり、追加列はその範囲を超えないと判断した。
  - §5 案ごとのリスク表の追加: rulebook §6.4 の「案ごとのリスクとトレードオフ」要件と、review RVP-004 の evidence が根拠。既存の一般表との内容重複を避け、案固有のリスクに絞って記述した。
- 維持した記述:
  - §1〜§2: 前提条件・比較対象案の構成は prj-scope-sample・prj-issues-and-approach-sample と整合しており変更不要と判断した。
  - §4 比較結果・採択理由・技術的実現性と影響: 完成版成果物と構造・粒度が整合しており変更不要。
  - §6 決定と見直し: PO 最終判断・再評価条件・方針変更記録先の記述は rulebook §6.5 に準拠しており変更不要。
- 矛盾の有無: 検出しなかった。rulebook・recipe・sample・完成版成果物の記述は整合していることを確認した。
- 根拠不足の有無: なし。成果物・review result・recipe-maintenance result が揃っており、改訂判断に必要な確証は得られた。
