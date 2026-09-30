---
specdojo:
  id: specdojo:release-v0-3-0-migration-guide
  type: guide
  status: draft
---

# v0.3.0 移行ガイド

Migration Guide for v0.3.0

SpecDojo v0.2.1 から v0.3.0 へ更新するときに、利用者側の設定、overlay、コピー済みの実行
テンプレート、既存の grade 結果を移行する手順を示します。既定値をそのまま参照している
プロジェクトでは、依存 package の更新と検証だけで移行できます。

**対象読者**

- v0.2.1 のレビュー観点を overlay しているプロジェクトの管理者
- SpecDojo の kata または実行テンプレートをリポジトリへコピーして保守している利用者
- v0.2.1 以前の grade 結果を保持している利用者

**この文書で分かること**

- レビュー観点、rubric、review verdict とテンプレートの旧値・新値の対応
- overlay、コピー済みテンプレート、既存 grade 結果の移行手順
- 移行後の検証方法と、人が行う公開作業の境界

**次に読む文書**

- 変更の一覧は、リポジトリ直下（npm package にも同梱）の `CHANGELOG.md` を参照してください。
- 現行の grade と review の分担は [[specdojo:review-guide|レビューガイド]] を参照してください。
- overlay の規則は同ガイド、kata の参照状態は
  [[specdojo:command-reference|CLIコマンドリファレンス]]を参照してください。

## 1. 更新前に確認する

**実行環境の更新:**
SpecDojo 本体、docs-site、docs-lint の実行には Node 22.13 以上が必要になりました。
Node のバージョンが要件を満たしているか確認し、必要に応じて更新してください。

作業中の plan / result がない状態で更新し、利用リポジトリの変更を commit してから始めます。
次のファイルや記録を変更している場合は、移行対象です。

| 対象                       | 確認箇所                           | 必要な対応                                                                                        |
| -------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| レビュー観点の overlay     | project の `viewpoints_path`       | `evaluation`、`continuous`、rubric、verdict を更新する                                            |
| コピー済み kata            | `npx specdojo kata status`         | v0.3.0 の package 原本との差分を確認する                                                          |
| コピー済み実行テンプレート | `docs/ja/specdojo/exec-templates/` | review テンプレートを同期し、削除済みファイルを除く                                               |
| 既存 review plan           | `execution/exec/plans/`            | 未着手の review plan を更新後に再生成する                                                         |
| 既存 grade 結果            | grade result サイドカー            | rubric v2 で再評価する                                                                            |
| 登録簿の `note` の扱い     | `note` を close する運用や script  | `register close` / `reject` / `defer` が `note` を拒否するため、`open` のまま追記する運用へ改める |

依存 package を更新します。`@specdojo/docs-lint` は v0.3.0 の変更対象ではないため、利用中の
版をそのまま使えます。docs サイトを直接利用している場合は `@specdojo/docs-site@0.2.0` へ
更新します。

```bash
npm install --save-dev specdojo@0.3.0
npm install --save-dev @specdojo/docs-site@0.2.0
```

2 行目は `@specdojo/docs-site` を導入している場合だけ実行します。

## 2. `evaluation` を移行する

`evaluation` は判定主体ではなく、正しさを決める規準の所在を表す値になりました。旧値は
自動変換されず、移行先を示すエラーで停止します。

| v0.2.1          | v0.3.0                               | 移行規則                                                                                         |
| --------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `deterministic` | `deterministic`                      | 変更不要。schema や lint など機械可読な規則で判定する                                            |
| `agent`         | `referential` または `discretionary` | 原則は `referential`。明示された比較先がなく、十分性や粒度を判定者が決める場合は `discretionary` |
| `human`         | `referential` または `discretionary` | 実行主体では決めない。`check` に比較先があれば `referential`、なければ `discretionary`           |

共通 28 観点を overlay している場合の対応は次のとおりです。表にない旧 `agent` は
`referential`、表にない旧 `human` は `discretionary` へ変更します。

| v0.3.0 の値     | 旧値から再分類する観点                                                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `discretionary` | `vp-arc-conciseness`、`vp-ux-user-flow`（旧 `agent`）                                                                                                                                                  |
| `referential`   | `vp-po-purpose-alignment`、`vp-po-publication-accountability`、`vp-pm-dependency-risk`、`vp-pm-control-reporting`、`vp-dev-change-impact`、`vp-dev-testability`、`vp-ops-agent-boundary`（旧 `human`） |

独自観点は、その `check` が「何と比較するか」を明示していれば `referential`、判定者が
「必要な範囲」「使える粒度」などの規準を持ち込むなら `discretionary` とします。値だけを
一括置換せず、観点ごとに判定してください。

## 3. `continuous` と rubric を移行する

`continuous` は schema と共通 28 観点から削除されました。overlay 内に残っている
`continuous: true` / `continuous: false` をすべて削除してください。残した場合は、未知の
property として schema 検証に失敗します。grade の対象は `grade_targets` と
`document_kinds` で決まり、適用される 28 観点をすべて評価します。

rubric を overlay している場合は、package 同梱の
`docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` を正として次を反映します。

| 項目         | v0.2.1              | v0.3.0                                                                                 |
| ------------ | ------------------- | -------------------------------------------------------------------------------------- |
| rubric ID    | `grade-rubric-v1`   | `grade-rubric-v2`                                                                      |
| category     | 4 category          | 9 category（`purpose`、`planning`、`business`、`implementation`、`operations` を追加） |
| weight       | 共通の重み          | `kata` と `deliverable` ごとの重み                                                     |
| `pass_score` | 70                  | 75                                                                                     |
| grade 対象   | `continuous` で選択 | 文書種別に適用される全観点                                                             |

rubric v1 と v2 は評価する category が異なるため、score を時系列比較しません。旧 rubric の
結果は次のコマンドで抽出し、通常の grade 実行経路で再評価します。結果の `rubric` が現在の
ID と異なるもの、および ID の記録がないものが対象です。

```bash
npx specdojo grade list --target kata --rubric-outdated --project <project-id>
npx specdojo grade list --target deliverable --rubric-outdated --project <project-id>
```

`--rubric-outdated` と `--ungraded` は併用できません。結果がない文書は `--ungraded`、旧 rubric
の結果がある文書は `--rubric-outdated` で別々に選びます。

## 4. review の verdict を移行する

review が表すのは成果物の品質ではなく、タスクの完了可否です。grade の文書 verdict
（`pass` / `needs-work` / `fail`）は別の語彙であり、変更しません。

| v0.2.1 の review 値 | v0.3.0 の verdict                                             | 補足                                          |
| ------------------- | ------------------------------------------------------------- | --------------------------------------------- |
| `pass`              | `complete`                                                    | 完了条件を満たし、完了を妨げる finding がない |
| `conditional_pass`  | `complete-with-findings`                                      | finding はあるがタスクは完了できる            |
| `changes_requested` | `incomplete`                                                  | plan または完了条件に未充足がある             |
| `blocked`           | `grade-stale` / `grade-unavailable` / `changed-during-review` | 保留理由に応じて選ぶ                          |
| `approve`           | `complete` または `complete-with-findings`                    | finding が完了を妨げるかで選ぶ                |
| `revise` / `reject` | `incomplete`                                                  | 未充足事項と改善指示を記録する                |

`blocked` は一括置換できません。grade が古い場合は `grade-stale`、評価不能なら
`grade-unavailable`、review 中に対象が変わった場合は `changed-during-review` とします。
`verdict_definitions`、rubric の `review_verdict`、独自 reporter の出力に旧値が残ると、移行先を
示すエラーで停止します。

## 5. review テンプレートと既存 plan を移行する

v0.3.0 の review は grade の結果を確定済みの入力として使い、観点ごとの
`pass` / `fail` / `unclear` を付け直しません。次の変更をローカルコピーへ反映します。

- `xrp-*` は「評価結果」と `done_criteria` を入力に、タスクの完了可否を判断する構成へ
  更新する。
- `xrr-template.md` は `grade_check`、`rationale`、`improvements`、`approach`、`verdict` を
  記録する構成へ更新する。
- 共通の判断手順は `xep-common-conventions-template.md` の review 専用節と同期する。
- `xrp-viewpoint-detail-template.md` と `xrr-viewpoint-detail-template.md` を削除し、参照も除く。

実行テンプレートと schema は CLI と同じ版で使う必要があるため、現在は個別 eject の対象では
ありません。過去にソース一式をコピーした、または独自に上書きした場合は、次の表示内容と
ローカルファイルを比較し、上記の変更を手動で同期するかローカルコピーを除いて package 原本を
参照します。

```bash
npx specdojo kata show xrp-template
npx specdojo kata show xrr-template
npx specdojo kata status --kind exec-template
```

改訂前に生成した未着手の review plan は観点別評価を指示したままなので、v0.3.0 への更新後に
再生成します。進行中の review は新旧の指示を混在させず、いったん中止して grade の鮮度を確認し、
新しい plan から再開してください。

## 6. 移行を検証する

overlay を含む設定と、生成される plan / result を検証します。

```bash
npm run check
npm run docs:build
```

エラーが出た場合は、最初のエラーに含まれる旧値と移行先を確認します。代表的な原因は次の
とおりです。

| エラーの対象                                | 修正                                                |
| ------------------------------------------- | --------------------------------------------------- |
| `evaluation: agent` / `evaluation: human`   | 2 章の規準で `referential` / `discretionary` を選ぶ |
| `continuous`                                | 観点からフィールドを削除する                        |
| 旧 `verdict_definitions` / `recommendation` | 4 章の対応表で新 verdict へ移す                     |
| 旧 review plan の観点別結果                 | plan を再生成し、最新 grade を入力にする            |
| rubric v1 の score                          | `--rubric-outdated` で抽出して再評価する            |

検証後は、overlay と独自テンプレートの差分、再評価を後回しにした grade 結果の件数を移行記録へ
残してください。

## 7. リリース作業の境界

このリポジトリで v0.3.0 を公開する場合、agent の作業は版、リリース文書、移行ガイド、検証まで
です。次は maintainer が行います。

1. develop から main への Pull Request で変更内容と検証結果を確認し、承認後に merge する。
2. main の publish workflow が作成した staged release を `npm stage list specdojo` で確認する。
3. `npm stage download <stage-id>` で tarball を取得し、`CHANGELOG.md` と必要な package 内容を
   含むことを確認する。
4. 2FA を使って `npm stage approve <stage-id>` を実行し、公開を確定する。
5. `v0.3.0` tag と GitHub Release を作成し、公開された package の版と一致することを確認する。

main への merge、npm の staged release の承認、tag と GitHub Release の作成は自動実行しません。
