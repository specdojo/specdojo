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
- 現在の 28 観点の割り当てを基準に照らして確認し、変更が必要なものを特定している。変更する場合は理由を記録する。
- `evaluation` と `continuous` の役割が分離され、grade の対象範囲は `continuous` だけで決まる。
- `src/grade.ts` の `continuousViewpoints()` から `evaluation !== "human"` の条件が外れている。
- 矛盾する組み合わせ（grade で実行経路がない `evaluation` と `continuous: true`）を schema または検証で弾く。
- 割り当ての変更が `continuous` に及ぶ場合、grade の対象範囲と夜間実行のコストへの影響を見積もっている。
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

## 4. grade 対象の基準

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

### 4.2. 分離した場合の設計

grade 対象は `continuous` のみで決める。`evaluation` は実行経路の選択にだけ使う。

| `evaluation` | grade での実行経路                     |
| ------------ | -------------------------------------- |
| 決定論的     | コードで判定する                       |
| 照合         | agent へ渡す。突き合わせ先を指示する   |
| 裁量         | agent へ渡す。判定の安定性は保証しない |

裁量の観点を agent が実行できないわけではない。review フェーズでは実際に agent が 28 観点すべてを判定している。grade から外す理由は**実行可否ではなく、毎回異なる規準で判定されて finding が安定しない**ことである。これは観点ごとに実データで判断する。

### 4.3. 分離による効果

裁量へ再分類しても `continuous: true` を保てるため、**再分類と grade 対象の縮小が連動しない**。

| 観点                 | 実測 finding 数 | 分離しない場合   | 分離する場合              |
| -------------------- | --------------- | ---------------- | ------------------------- |
| `vp-arc-conciseness` | 46              | grade から外れる | 裁量として grade に残せる |
| `vp-ux-user-flow`    | 22              | grade から外れる | 裁量として grade に残せる |

全 1267 件中 68 件（5.4%）に相当する。分離すれば、命名の是正と grade 対象の変更を独立に決められる。

## 5. 命名候補

| 案  | 3 値                                              | 意味                                     |
| --- | ------------------------------------------------- | ---------------------------------------- |
| A'  | `deterministic` / `referential` / `discretionary` | 規則が判定 / 参照との照合 / 判定者の裁量 |
| B'  | `deterministic` / `collated` / `judged`           | 同じ軸。語が平易だが `judged` が広すぎる |
| C'  | `deterministic` / `specified` / `unspecified`     | 規準が明示されているか。欠陥に読める     |

A' を採る。`referential` と `discretionary` が規準の所在を正確に表し、`member.type` / `task.execution` の enum 値と衝突しない。`deterministic` は維持する。

## 6. 再分類の候補

基準に照らすと現在の割り当てに 4 件の不一致がある。基準の確定後に 1 件ずつ判定する。一括で変更しない。

| 観点                               | 現在    | 基準による判定  | 理由                                                         |
| ---------------------------------- | ------- | --------------- | ------------------------------------------------------------ |
| `vp-arc-conciseness`               | `agent` | `discretionary` | 「必要十分な記述か」は十分性の判断。突き合わせ先がない       |
| `vp-ux-user-flow`                  | `agent` | `discretionary` | 「迷わず到達できる構成か」は判定者が規準を持ち込む           |
| `vp-ops-agent-boundary`            | `human` | `referential`   | 「agent に最終承認を委ねる記述になっていないか」は記述の照合 |
| `vp-po-publication-accountability` | `human` | `referential`   | 「人間の PO が担う前提になっているか」も記述の照合           |

`vp-ux-readability`（実測 154 件）は判断が分かれる。`check` に十分性の語を含むが、finding 数が最大であり実務上の有用性が高い。`check` の文言を照合可能な形へ書き換えて `referential` に留める選択もある。

`vp-ops-agent-boundary` を `referential` かつ `continuous: true` にすると、**agent の境界違反を継続的に検出できる**ようになる。現在は grade の対象外である。

## 7. 進め方

1. 基準（`区分の基準`）と命名（`命名候補`）を確定する。
2. `evaluation` と `continuous` の分離を決める。`src/grade.ts` から `evaluation !== "human"` を外し、矛盾する組み合わせを schema か検証で弾く。
3. 再分類 4 件を 1 件ずつ判定する。`vp-ux-readability` は実データを見て決める。
4. 実装と移行を行う。

[[prj-0001:pjr-xtan-unify-verdict-vocabulary]] と同じファイルと schema の enum を変えるため、**0.3.0 にまとめて移行を 1 回で済ませる**。

## 8. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-xtan-unify-verdict-vocabulary]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml`
- `docs/ja/specdojo/guides/review-guide.md`
- `src/grade.ts`
