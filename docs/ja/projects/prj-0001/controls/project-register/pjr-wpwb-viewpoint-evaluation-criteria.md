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
- grade の実行経路が `deterministic` はコード、`referential` と `discretionary` は agent で判定する形になっている。改名後に `evaluation === "agent"` だけを agent へ渡す判定が残っていない。
- `continuous` の値は本項目では変更しない。`continuous` の廃止は [[prj-0001:pjr-k351-continuous-abolition-all-viewpoints]] で行う。
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

**2026-09-26 に撤回した。** 条件 1 と条件 3 はどちらも成り立たなかった（`continuous は廃止する` を参照）。以下は検討の経緯として残す。

grade は「成果物の現在の状態」を「人の介在なしに」「繰り返し」評価する。3 条件すべてを満たす観点だけを `continuous: true` にする。

| 条件 | 内容                                                     | 判定方法                                 |
| ---- | -------------------------------------------------------- | ---------------------------------------- |
| 1    | 判定対象が成果物の現在の状態である。変更そのものではない | `check` が変更・差分を対象にしていないか |
| 2    | 判定に必要な情報が grade の読み取り範囲にある            | 突き合わせ先が `docs/` 配下にあるか      |
| 3    | 繰り返し評価に値する finding が出る                      | **実測が必要**。机上では決められない     |

条件 1 と 2 は `check` の文言から机上で判定できる。**条件 3 は実測が必要**であり、現在 `continuous: false` の 16 観点には実測データがない。したがって**対象範囲の拡大は試行を経て決める**。

### 4.4. 条件 1 に反する観点が 1 件ある

**2026-09-26 に撤回した。** `vp-dev-change-impact` の `evidence` は「影響範囲、関連コード、schema、生成物、コマンド、互換性」であり、問うているのは**影響の記述が文書にあるか**である。差分を知る必要はなく、スナップショットで判定できる。以下は検討の経緯として残す。

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

### 6.3. 適用できない突き合わせ先を宣言すると agent が差し替える

`check` が規準を供給すれば照合型になる（`check が規準を供給する場合は照合型になる` を参照）ことの裏返しとして、**適用できない突き合わせ先を宣言した場合、agent は判定を放棄せず自分で別の対象に差し替える**。

`vp-arc-cross-document-consistency` が実例である。成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物の 6 つを突き合わせ先として宣言しているが、grade 対象 303 件のうち 260 件は kata であり、kata はカタログに 1 件も登録されていない。結果として 198 件の finding のうち 153 件（77%）は宣言したどの突き合わせ先にも言及せず、kata 内部の整合を判定している。

| 観測                                                   | 値         |
| ------------------------------------------------------ | ---------- |
| 宣言した突き合わせ先に言及した finding                 | 45         |
| いずれにも言及しない finding                           | 153（77%） |
| `vp-qe-kata-conformance` と同時に finding が出た成果物 | 98         |

**基準の運用上の含意は 2 つある。**

第 1 に、`evaluation` の区分は `check` の宣言に基づくが、宣言が適用できなければ区分は実態を表さない。照合型と分類した観点が、実際には別の対象を裁量で判定している場合がある。

第 2 に、宣言と実際の判定が一致しているかを確認する手段が必要である。finding の内容が宣言した突き合わせ先に対応しているかは、現在どこでも検査されていない。

詳細は [[prj-0001:pjr-ebtz-vp-arc-cross-document-consistency-target-kata-conformance]] で扱う。

### 6.4. continuous は廃止する

**2026-09-26 に結論を改めた。** 当初は「条件 3 の実測データがないため 28 件すべて据え置く」としたが、除外する根拠そのものが成り立たなかった。

| 当初の除外理由                                | 検証の結果                                                                           |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| 主観的な判断を毎回繰り返しても意味がない      | grade は `changed_only` で変化したときだけ動く。無変化での再評価は 19 回中 0 回      |
| 主観的な判断は繰り返すと不安定になる          | 逆だった。裁量型の `vp-arc-conciseness` の level 変動は 19 回中 1 回（5%）で最も安定 |
| `vp-dev-change-impact` は変更を対象にしている | 対象は影響の記述の有無であり、スナップショットで判定できる                           |

**28 観点すべてが grade の対象になる。** `continuous` は全件 `true` となり、情報を持たなくなるため削除する。これは [[prj-0001:pjr-49d2-quality-assessment]] の概要に書かれた当初の意図（「grade と review は同じ観点集合を、違う時間軸と深さで評価する」）へ戻す変更でもある。

`continuous` の廃止は rubric の重みを 9 category へ広げる必要があり、既存 303 件の score がすべて変わる。**本項目（0.3.0）とは切り分け、[[prj-0001:pjr-k351-continuous-abolition-all-viewpoints]] で扱う。** 本項目では `continuous` の値を変えない。

## 7. 進め方

| 段  | 内容                                                                     | 項目     | 版    |
| --- | ------------------------------------------------------------------------ | -------- | ----- |
| 1   | 観点の適用範囲を文書の種類で宣言する                                     | PJR-AG7B | —     |
| 2   | `vp-arc-conciseness` / `vp-ux-user-flow` の `check` へ判定規準を書き込む | PJR-DKX8 | —     |
| 3   | `evaluation` の改名と再分類、grade の実行経路の変更                      | 本項目   | 0.3.0 |
| 4   | `continuous` の廃止、28 観点化、rubric の 9 category 化、閾値の再設定    | PJR-K351 | 0.4.0 |

段 2 を段 3 の前に置くのは、`check` に規準を書き込むと 2 観点が `discretionary` から `referential` へ移り、**再分類が 9 件から 7 件に変わる**ためである。順序を逆にすると移行が 2 回になる。

段 3 では `continuous` の値を変えないが、`evaluation !== "human"` の拒否権は外す。改名後は `human` という値がなくなり、この条件は意味を失うためである。`continuous: false` の 16 観点はそのまま grade の対象外に残る。

[[prj-0001:pjr-xtan-unify-verdict-vocabulary]] は、判定語彙を統一するかどうかから問い直すことになった。統一する結論になった場合だけ、本項目と同じ 0.3.0 にまとめる。

## 8. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-xtan-unify-verdict-vocabulary]]
- [[prj-0001:pjr-k351-continuous-abolition-all-viewpoints]]
- [[prj-0001:pjr-dkx8-vp-arc-conciseness-vp-ux-user-flow-check]]
- [[prj-0001:pjr-ebtz-vp-arc-cross-document-consistency-target-kata-conformance]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml`
- `docs/ja/specdojo/guides/review-guide.md`
- `docs/ja/projects/prj-0001/routines/rtn-grade-recheck.yaml`
- `src/grade.ts`
