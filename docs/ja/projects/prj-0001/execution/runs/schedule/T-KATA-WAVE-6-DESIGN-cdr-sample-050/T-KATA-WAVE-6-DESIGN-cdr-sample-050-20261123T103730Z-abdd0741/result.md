---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-cdr-sample-050-20261123t103730z-abdd0741
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-cdr-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-cdr-sample-050/T-KATA-WAVE-6-DESIGN-cdr-sample-050-20261123T103730Z-abdd0741/plan.md
  started_at: "2026-11-23T10:37:36.877Z"
  completed_at: "2026-11-23T10:54:33.695Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdr-sample
    - specdojo:cdr-sample
---

# Edit Result

## 1. 実施内容

- sample の内容を厚くし、`grade` からの指摘事項（`F001`〜`F004`）を解消しました。
- 禁止事項の表と本文における記述の重複を解消し、表に禁止事項を集約しました。
- 境界値テストの対象となる「上限額」の定義元として、`dmd-sample` を参照するように修正しました。
- サーバー専用処理の配置および Sentry への通知方針について、設計の正本である `kinuya-web-cpd` や `kinuya-web-sysd-cross-cutting-policy` への参照を追加しました。
- Next.js の仕様に合わせた「サーバーとクライアントの境界」に関する章を新設しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdr-sample.md`: `grade` による指摘に基づき、禁止事項の重複排除、境界値の参照先追加、設計の正本（`kinuya-web-cpd` 等）への参照追加、および Next.js のサーバー・クライアント境界に関する章の追加を行いました。

## 3. 申し送り

- 決めていただく値: つけ上限を超える申し出を店主代表の承認で受け付けるか（`_UNDECIDED_`。決まるとテストと検証の章のテストが変わる）。
- 決めていただく値: 店頭タブレットの OS と対応ブラウザ（`_UNDECIDED_`。tsd-index-sample と同じ未決事項。決まると Next.js の境界の章のブラウザ API の扱いが変わる）。
- 設計の正本 `kinuya-web-cpd`・`kinuya-web-sysd-cross-cutting-policy` は存在しない架空の文書としてバッククォートで仮置きした。既存の cpd-sample・sysd-cross-cutting-policy-sample は CLI 版の設計のため、Next.js 版の根拠にしていない。このため `based_on` は `specdojo:tsd-index-sample` だけで、rulebook が勧める `sysd-cross-cutting-policy` は入っていない。
- rulebook の変更案: 禁止事項を表だけに置く規則と、型の章の「型の強制の制限」・エラー処理の章の「握りつぶしの禁止」が重なる。表と本文のどちらにどれを置くかを rulebook に明記する。
- 本文の `npm run lint`・`npm run build` は架空リポジトリのコマンドとして書いたもので、tsd-index-sample には書かれていない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/cdr-sample.md のみで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

`grade` からの指摘事項（`F001`〜`F004`）を解消し、`docs/ja/specdojo/standards/sample-authoring-standard.md` に従いつつ、`cdr-sample.md` を完成例として厚くしました。具体的には、禁止事項の重複排除、設計の正本（`kinuya-web-cpd` 等）への参照、および Next.js の境界に関する知識の追加を行っています。
