---
specdojo:
  id: prj-0001:pjr-wpwb-viewpoint-evaluation-criteria
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-24T22:41:24Z"
  due_on: "2026-10-31"
---

# PJR-WPWB 観点の evaluation の区分基準を定義し、名前と割り当てを揃える

## 1. 概要

viewpoint の `evaluation`（`deterministic` / `agent` / `human`）は、**軸が混在し、値の名前が実態と合っていない**。区分の基準そのものが文書化されていないため、基準の定義・命名・現在の割り当ての再確認を一体で行う。

### 1.1. 名前が実態と合っていない

`agent` と `human` は実行主体の名前だが、**実行主体を区別していない**。review フェーズは agent が実行する（`claude-review-executor`、`codex-review-executor`、`agy-expert-review-executor`、`opencode-review-executor`）。`xrp-*` は agent へ渡す review plan であり、`evaluation: human` の観点も agent が判定している。

さらに値が他フィールドと衝突する。

| 値      | 他フィールドでの意味                                                               |
| ------- | ---------------------------------------------------------------------------------- |
| `agent` | `member.type: agent`（AI のメンバー）、`task.execution: agent`（agent が実行する） |
| `human` | `task.execution: human`（**実際に人が実行する**）                                  |

`task.execution` の `human` は正しい用法である。同じ語が別の意味を持つため、読み手は必ず誤解する。実際に [[prj-0001:pjr-2zvs-grade-review-integration]] の決定 3.1 は「`human` 観点は review のレビュア（人）が判定する」と誤って書かれ、grade の対象選択の基準も `continuous` ではなく `evaluation` と誤って据えられた。

`deterministic` は問題ない。他フィールドの enum 値と衝突せず、job の説明で使われる「決定論的コマンド」と意味も一致する。

### 1.2. 当初案の contextual は実態と合わない

当初は「`human` = 文書外の文脈を要する」と解釈し `contextual` を候補とした。しかし 16 観点の `evidence` を確認したところ、**すべて文書内の記述を指していた**。

| 観点                              | evidence                                                           |
| --------------------------------- | ------------------------------------------------------------------ |
| `vp-po-purpose-alignment`         | プロジェクト概要の目的・必要性、成果物固有の目的、上位根拠との対応 |
| `vp-dev-implementation-readiness` | 設定項目、schema、入力、出力、制約、作業対象ファイル               |
| `vp-dev-testability`              | 検証コマンド、期待結果、対象ファイル、エラー時対応                 |
| `vp-ops-agent-boundary`           | owner、reviewer、approver、agent_mode、manual gate                 |

文書外の文脈を要求する evidence は 1 つもない。`vp-dev-testability`（検証コマンドと期待結果が書かれているか）や `vp-po-publication-accountability`（status、承認責任の記述）は、記述の有無の確認であり機械的に照合できそうである。にもかかわらず `human` になっている。

**区分の基準が定義されていない**ため、現在の割り当てが正しいかを判定できない。

### 1.3. 観測されるパターン

role と category の分布には規則性がある。

| `evaluation`    | 件数 | role                                  | category                                                                                     |
| --------------- | ---- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `deterministic` | 2    | ARC 1、QE 1                           | architecture、quality                                                                        |
| `agent`         | 10   | ARC 3、QE 4、UX 3                     | consistency 2、usability 4、architecture 1、quality 3                                        |
| `human`         | 16   | PO 3、PM 3、BA 3、ARC 1、DEV 3、OPS 3 | purpose 2、operations 4、planning 3、business 3、architecture 1、implementation 2、quality 1 |

`agent` は ARC / QE / UX、つまり**文書そのものの品質**を見る観点に集まる。`human` は PO / PM / BA / DEV / OPS、つまり**約束や責任を伴う判断**（承認、計画、要件、実装の見通し、リリース可否）に集まる。

## 2. 完了条件

- `evaluation` の区分基準が文書化され、新しい観点を追加する人が自分で判定できる。基準は 1 つの軸で表現されている。
- 基準に沿った 3 値の名前が決まっている。他フィールドの enum 値（`member.type`、`task.execution`）と衝突しない。
- 現在の 28 観点の割り当てを基準に照らして確認し、変更が必要な 9 件を再分類している。変更する場合は理由を記録する。
- `evaluation` と `continuous` の役割が分離され、grade の対象範囲は `continuous` だけで決まる。
- `src/grade.ts` の `continuousViewpoints()` から `evaluation !== "human"` の条件が外れている。
- 矛盾する組み合わせ（grade で実行経路がない `evaluation` と `continuous: true`）を schema または検証で弾く。
- `continuous` の基準が文書化され、`evaluation` から独立して判定できる。
- `continuous` は本項目では変更しない。変更は実測を経て別項目で決める。
- `pm-review-viewpoints.schema.yaml` の enum と description が更新されている。
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` の 28 観点が追従している。
- `src/grade.ts` の `continuousViewpoints()` / `agentViewpoints()` / `deterministicResults()` が追従している。
- `task.execution` の `human` は変更しない。
- 旧値を読み込んだ場合、新値を示すエラーで失敗する。黙って無視しない。
- 関連する rulebook・standard・guide の記述が追従している。
- `npm run check` が通過している。

## 3. 区分の基準

基準は **判定基準の所在** である。「判定に必要な根拠がどこにあるか」ではなく、「**何が正しいかを決める規準がどこにあるか**」で区分する。

| 区分            | 判定基準の所在                     | `check` の文型                                                           |
| --------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| `deterministic` | 機械可読な規則（schema、lint）     | 「schema と整合しているか」「文書体系と整合しているか」                  |
| （照合）        | 文書または宣言された定義           | 「…と矛盾していないか」「`done_criteria` を満たしているか」              |
| （裁量）        | 判定者が持ち込む。文書に規準がない | 「**必要な範囲で**明示されているか」「**使える粒度**か」「**分かる**か」 |

### 3.1. 基準の識別方法

`check` の文言に、**何と比べるか**が書かれているかで判定する。

| `check` の例                                      | 比較先         | 区分 |
| ------------------------------------------------- | -------------- | ---- |
| 成果物カタログ、Schedule、RACI と矛盾していないか | 他の成果物     | 照合 |
| `done_criteria` を満たしているか                  | 宣言された定義 | 照合 |
| pass / fail を判定できる表現になっているか        | 表現の性質     | 照合 |
| 利用者視点で確認できる**粒度**になっているか      | なし           | 裁量 |
| **必要な範囲で**明示されているか                  | なし           | 裁量 |
| 確認すべきコマンドが**分かる**か                  | なし           | 裁量 |

裁量群 16 観点のすべてに「十分性の判断」（必要十分、適切な粒度、分かる、読み取れる）が含まれる。何が十分かは文書に書かれておらず、判定者が持ち込む。

### 3.2. 当初の候補との関係

| 候補 | 軸                     | 判定                                                                                      |
| ---- | ---------------------- | ----------------------------------------------------------------------------------------- |
| A    | 判定に必要な根拠の所在 | **否定**。裁量群の evidence もすべて文書内にある。根拠（evidence）と規準（criterion）は別 |
| B    | 判断の性質             | **採用**。照合か裁量かは、規準の所在の言い換えである                                      |
| C    | 判断が伴う責任         | **不採用**。責任は区分の結果であって原因ではない                                          |
| D    | 自動判定の信頼度       | **別の軸**。`evaluation` ではなく `continuous` の基準である（`grade 対象の基準` を参照）  |

## 4. continuous の基準

`evaluation` は grade 対象の基準ではない。**2 つは独立した軸**である。

| 項目         | 問い                                   | 決めるもの             |
| ------------ | -------------------------------------- | ---------------------- |
| `evaluation` | 何が正しさの規準を決めるか             | 判定の実行経路と読み方 |
| `continuous` | 同じ観点を繰り返し評価する価値があるか | grade の対象範囲       |

### 4.1. 現在は 2 つが混同されている

`continuous` は現データで `evaluation` から 100% 導出できる。**独立した情報を持っていない。**

| `evaluation`              | 件数 | `continuous`   |
| ------------------------- | ---- | -------------- |
| `deterministic` / `agent` | 12   | すべて `true`  |
| `human`                   | 16   | すべて `false` |

さらに `src/grade.ts` は `continuous` を正本として扱っていない。

```typescript
viewpoint.continuous === true && viewpoint.evaluation !== "human";
```

`evaluation` が `continuous` に対する拒否権を持つため、`continuous: true` と `evaluation: human` を同時に書くと**黙って対象から落ちる**。schema は両方を必須にしており、矛盾した組み合わせを検出しない。

### 4.2. 分離した場合の実行経路

grade 対象は `continuous` のみで決める。`evaluation` は実行経路の選択にだけ使う。

| `evaluation`    | grade での実行経路                     |
| --------------- | -------------------------------------- |
| `deterministic` | コードで判定する                       |
| `referential`   | agent へ渡す。突き合わせ先を指示する   |
| `discretionary` | agent へ渡す。判定の安定性は保証しない |

裁量の観点を agent が実行できないわけではない。review フェーズでは実際に agent が 28 観点すべてを判定している。grade から外す理由は**実行可否ではなく、繰り返し評価に値する結果が出るか**である。

### 4.3. continuous の基準は 3 条件

grade は「成果物の現在の状態」を「人の介在なしに」「繰り返し」評価する。3 条件すべてを満たす観点だけを `continuous: true` にする。

| 条件 | 内容                                                     | 判定方法                                 |
| ---- | -------------------------------------------------------- | ---------------------------------------- |
| 1    | 判定対象が成果物の現在の状態である。変更そのものではない | `check` が変更・差分を対象にしていないか |
| 2    | 判定に必要な情報が grade の読み取り範囲にある            | 突き合わせ先が `docs/` 配下にあるか      |
| 3    | 繰り返し評価に値する finding が出る                      | **実測が必要**。机上では決められない     |

条件 1 と 2 は `check` の文言から机上で判定できる。**条件 3 は実測が必要**であり、現在 `continuous: false` の 16 観点には実測データがない。したがって**対象範囲の拡大は試行を経て決める**。

### 4.4. 条件 1 に反する観点が 1 件ある

`vp-dev-change-impact` の `check` は「**変更が**既存成果物、schema、生成処理、コマンド、運用手順へ与える影響が識別されているか」である。grade は成果物のスナップショットを評価するため、何が変更されたかを知らない。**この観点は恒久的に `continuous: false` とする。**

review は変更を対象とするため、review では判定できる。grade と review の役割分担が `check` の文言から導ける唯一の例である。

### 4.5. changed_only との整合に既存の問題がある

実運用の routine は `changed_only: "true"` で動く。

```yaml
# rtn-grade-recheck.yaml
inputs:
  changed_only: "true"
```

`content_hash` は**対象成果物の内容だけ**から計算する。照合型の観点は他の成果物と突き合わせるため、突き合わせ先が変わっても対象成果物の hash は変わらず、**古い評価結果が残る**。`vp-arc-cross-document-consistency`（実測 198 件）が該当する。

全件再評価を行う `rtn-grade-kata` は `enabled: false` である。この問題は本項目の対象外とし、別項目として起票する。

## 5. 命名候補

| 案  | 3 値                                              | 意味                                     |
| --- | ------------------------------------------------- | ---------------------------------------- |
| A'  | `deterministic` / `referential` / `discretionary` | 規則が判定 / 参照との照合 / 判定者の裁量 |
| B'  | `deterministic` / `collated` / `judged`           | 同じ軸。語が平易だが `judged` が広すぎる |
| C'  | `deterministic` / `specified` / `unspecified`     | 規準が明示されているか。欠陥に読める     |

A' を採る。`referential` と `discretionary` が規準の所在を正確に表し、`member.type` / `task.execution` の enum 値と衝突しない。`deterministic` は維持する。

## 6. 28 観点の判定結果

基準を全 28 観点へ適用した。`finding` は grade 結果 303 件から集計した実測値である。

| 観点                                | 現 `evaluation` | 新 `evaluation`     | `continuous` | finding |
| ----------------------------------- | --------------- | ------------------- | ------------ | ------- |
| `vp-arc-document-structure`         | `deterministic` | `deterministic`     | `true`       | 0       |
| `vp-qe-config-validity`             | `deterministic` | `deterministic`     | `true`       | 3       |
| `vp-arc-cross-document-consistency` | `agent`         | `referential`       | `true`       | 198     |
| `vp-arc-single-responsibility`      | `agent`         | `referential`       | `true`       | 9       |
| `vp-qe-done-criteria`               | `agent`         | `referential`       | `true`       | 42      |
| `vp-qe-verifiability`               | `agent`         | `referential`       | `true`       | 136     |
| `vp-qe-omissions-consistency`       | `agent`         | `referential`       | `true`       | 310     |
| `vp-qe-kata-conformance`            | `agent`         | `referential`       | `true`       | 256     |
| `vp-ux-readability`                 | `agent`         | `referential`       | `true`       | 154     |
| `vp-ux-language-consistency`        | `agent`         | `referential`       | `true`       | 91      |
| `vp-arc-conciseness`                | `agent`         | **`discretionary`** | `true`       | 46      |
| `vp-ux-user-flow`                   | `agent`         | **`discretionary`** | `true`       | 22      |
| `vp-po-purpose-alignment`           | `human`         | **`referential`**   | `false`      | 未実測  |
| `vp-po-publication-accountability`  | `human`         | **`referential`**   | `false`      | 未実測  |
| `vp-pm-dependency-risk`             | `human`         | **`referential`**   | `false`      | 未実測  |
| `vp-pm-control-reporting`           | `human`         | **`referential`**   | `false`      | 未実測  |
| `vp-dev-change-impact`              | `human`         | **`referential`**   | `false`      | 対象外  |
| `vp-dev-testability`                | `human`         | **`referential`**   | `false`      | 未実測  |
| `vp-ops-agent-boundary`             | `human`         | **`referential`**   | `false`      | 未実測  |
| `vp-po-decision-readiness`          | `human`         | `discretionary`     | `false`      | 未実測  |
| `vp-pm-plan-feasibility`            | `human`         | `discretionary`     | `false`      | 未実測  |
| `vp-ba-business-value`              | `human`         | `discretionary`     | `false`      | 未実測  |
| `vp-ba-requirements-completeness`   | `human`         | `discretionary`     | `false`      | 未実測  |
| `vp-ba-stakeholder-clarity`         | `human`         | `discretionary`     | `false`      | 未実測  |
| `vp-arc-technical-constraints`      | `human`         | `discretionary`     | `false`      | 未実測  |
| `vp-dev-implementation-readiness`   | `human`         | `discretionary`     | `false`      | 未実測  |
| `vp-ops-release-readiness`          | `human`         | `discretionary`     | `false`      | 未実測  |
| `vp-ops-operability`                | `human`         | `discretionary`     | `false`      | 未実測  |

### 6.1. 内訳

| `evaluation`    | 件数 | うち再分類 |
| --------------- | ---- | ---------- |
| `deterministic` | 2    | 0          |
| `referential`   | 15   | 7          |
| `discretionary` | 11   | 2          |

**再分類は 9 件**である。当初は 4 件と見込んだが、全 28 観点へ基準を適用すると 9 件になった。`human` の 16 観点のうち 7 件が照合型である。

### 6.2. check が規準を供給する場合は照合型になる

`vp-arc-single-responsibility` と `vp-ux-readability` は「必要十分」「責務が一つに定まる」という裁量の語を含むが、`check` 自身が規準を書き込んでいる。

| 観点                           | `check` が供給する規準                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| `vp-arc-single-responsibility` | 分量や型の数だけでは不備としない。index・catalog・overview は分割対象から除外する      |
| `vp-ux-readability`            | 長さだけでは fail にしない。冗長箇所を特定できれば minor、主旨が読み取れなければ major |

**裁量の観点は、`check` に規準を書き込めば照合型へ移せる。** 区分は観点の性質ではなく `check` の書き方で決まる。これは `vp-arc-conciseness` と `vp-ux-user-flow` にも適用できる改善方針である。

### 6.3. continuous は変更しない

再分類 9 件に対し、`continuous` は 28 件すべて現状を維持する。理由は条件 3（繰り返し評価に値する finding が出るか）の実測データがないためである。

`evaluation` と `continuous` を分離したため、**再分類しても grade の対象範囲は変わらない**。`vp-arc-conciseness`（46 件）と `vp-ux-user-flow`（22 件）は `discretionary` になっても `continuous: true` を保つ。

対象拡大の最優先候補は `vp-ops-agent-boundary` である。「agent に最終承認、公開可否判断、説明責任を委ねる記述になっていないか」は記述の有無の照合であり、条件 1 と 2 を満たし、**agent の境界違反の継続検出は SpecDojo の設計方針に直結する**。試行して finding の質を確認してから `continuous: true` にする。

## 7. 進め方

| 段  | 内容                                                                                 | 版     |
| --- | ------------------------------------------------------------------------------------ | ------ |
| 1   | `evaluation` の改名と再分類 9 件。`continuous` は据え置き                            | 0.3.0  |
| 2   | `evaluation` と `continuous` の分離。`grade.ts` から `evaluation !== "human"` を外す | 0.3.0  |
| 3   | `vp-arc-conciseness` / `vp-ux-user-flow` の `check` へ規準を書き込む                 | 別項目 |
| 4   | `vp-ops-agent-boundary` を試行し、`continuous: true` の可否を決める                  | 別項目 |

段 1 と段 2 は同時に行う。分離しないまま再分類すると、`discretionary` にした 2 観点が grade から落ちて 68 件の finding を失う。

[[prj-0001:pjr-xtan-unify-verdict-vocabulary]] と同じファイルと schema の enum を変えるため、**0.3.0 にまとめて移行を 1 回で済ませる**。

## 8. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-xtan-unify-verdict-vocabulary]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml`
- `docs/ja/specdojo/guides/review-guide.md`
- `docs/ja/projects/prj-0001/routines/rtn-grade-recheck.yaml`
- `src/grade.ts`
