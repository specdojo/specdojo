---
specdojo:
  id: prj-0001:pjr-2q0g-grade-conciseness-metrics
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-17T12:53:26Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0T83
  depends_on:
    - PJR-8S4T
  commit_type: feat
  commit_scope: grade
---

# PJR-2Q0G grade で文書の冗長さと膨らみを点数に反映する

## 1. 概要

手直しで文書が膨らんでも grade の点数が下がらないため、機械で測る大きさの指標と冗長性の観点の強化を組み合わせて、冗長さを verdict と点数に反映する

## 2. 入力

- PJR-0T83 の対応策 (3) にあたる。利用者が 2026-11-17 に、機械で測る指標と観点の強化を組み合わせる案（c）を選んだ
- orchestrator の調査（2026-11-17）: 冗長さを見る観点 vp-arc-conciseness は既定の重大度が minor で「長さだけでは fail にしない」とあり、verdict を needs-work にしない。点数は区分ごとの平均を重み付けしたもので、28 の観点のうち 1 つとして usability の区分の中で平均されるため、1 段下がっても点数は 1〜2 点しか動かない。sld-sample（運用・検証の章が約 28%）はこの観点で 4（満点）だった
- 手直しで膨らんだ例: PJR-CPZH の代替案比較は 27KB から 75KB（sample は 20KB）、PJR-Y5AC の品質管理計画は 5.4KB から 18.8KB（sample は 15.8KB）。どちらも grade の点数は上がっていた
- 上限の数値は、PJR-8S4T で sld を見直した結果（前後の大きさと grade の結果）を見てから決める

## 3. 完了条件

- grade が、LLM を使わずに機械で測る大きさの指標を記録する。少なくとも次の 3 つを含める。
  - 宣言された sample に対する、空白を除いた文字数の比
  - 前回の grade の時点からの増え方
  - 文書の運用・検証の章が全体に占める割合
- 指標が上限を超えたら finding を出し、程度に応じて minor か major にする。上限の数値は PJR-8S4T の結果（sld の前後の大きさと grade の結果）を根拠に決め、根拠を個票の対応結果に書く。上限は rubric などの設定で変えられる。
- `vp-arc-conciseness` の check と evidence を見直す。共通の正本（ドキュメントメタ情報標準など）にある運用の記述の再掲と、同じ判断の複数の章での言い直しを冗長として扱い、判断情報を失わずに削れる量が多い場合は major にできるようにする。機械の指標が出た文書では、どこを削れるかを finding に示す。
- 必要な記述まで削らせないため、上限を超えても判断に要る背景・制約・例外・完了条件が残っていれば減点しないことを、観点と指標の説明に書く。
- 既存の grade の結果の形式と、指標を持たない古い結果の読み込みは保つ。指標の追加で rubric の版が変わる場合は、`--rubric-outdated` で選べるようにする。
- 手直しで膨らんだ文書（PJR-CPZH の作り直し前の版、PJR-Y5AC の今の版）と sld-sample の今の版で、新しい指標と観点が膨らみを捕まえることを、単体テストか実際の grade で確かめて個票に書く。
- 関連する設計・ガイド・grade のリファレンスを直す。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                              | 担当 | 状態 | メモ                                                                    |
| --- | ----------------------------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------- |
| 1   | 機械の指標の定義と上限の決め方を設計する（PJR-8S4T の結果を使う） | DEV  | done | 「指標と上限」に記載                                                    |
| 2   | 指標の計測と finding を grade に実装し、テストを足す              | DEV  | done | `src/grade/size-metrics.ts`・`tests/src/grade/size-metrics.test.ts`     |
| 3   | `vp-arc-conciseness` の check と evidence を見直す                | DEV  | done | 既定の観点定義を更新                                                    |
| 4   | 膨らんだ文書で捕まえられることを確かめる                          | DEV  | done | 実測と単体テストで確認（「確かめた結果」）。実際の grade は流していない |
| 5   | 設計・ガイド・リファレンスを直す                                  | DEV  | done | review-guide・command-reference                                         |

## 5. 対応結果

### 5.1. 実施内容

- `src/grade/size-metrics.ts` を足した。本文の文字数（空白・表の区切り行・finding コメントを除く）、成果物が宣言した sample との比、前回の grade の時点からの増え方、文書の運用・検証の章の割合を LLM を使わずに測る。sample は成果物の `rulebook` が宣言する `sample` を id から解決する（利用リポジトリの kata を優先し、なければ package 同梱）。
- `grade apply`（サイドカー方式）が指標を grade result の `size_metrics` に記録する。上限を超えた指標は `vp-arc-conciseness` に「大きさの指標:」で始まる finding として付け、程度に応じて minor か major にする。
- 減点の条件: executor が `vp-arc-conciseness` で削れる箇所を minor 以上の finding で示した場合だけ、指標の重大度で level を下げる。示さなかった場合は指標の finding を note に下げ、減点しない（上限を超えても、超えた分が判断に要る背景・制約・例外・完了条件なら減点しないため）。
- `grade plan` に「大きさの指標」の小節を足し、指標と上限の超過を executor に示して、削れる箇所を行番号つきの finding で示させる。指標の finding は前回の指摘から外し、executor に再掲させない。
- 上限は観点定義の `grade_rubric.size_limits` に置き、プロジェクトの観点定義で変えられる。`assertRubric` で値の形を検査する。schema（`pm-review-viewpoints.schema.yaml`・`grade-result.schema.yaml`）に `size_limits` と `size_metrics` を足した。
- rubric の id を `grade-rubric-v3` に改めた。重みと `pass_score` は v2 と同じ。v2 の結果は `grade list --rubric-outdated` で選べる。`size_metrics` を持たない旧い結果はそのまま読み込める（単体テストで確認）。
- `vp-arc-conciseness` の check と evidence: 共通の正本にある運用の記述の再掲と、同じ判断の複数の章での言い直しを冗長として扱い、削れる量が本文の約 2 割以上なら major にできるようにした。指標の超過が示された文書では削れる箇所を finding で示すこと、超えた分が判断に要る記述なら finding を付けないことを書いた。
- review-guide と command-reference に指標・上限・減点の条件・rubric の版を書いた。

### 5.2. 指標と上限

既定の上限（`docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`）:

| 指標                  | minor | major | 最小の量                     |
| --------------------- | ----- | ----- | ---------------------------- |
| sample との比         | 1.5   | 2.5   | sample より 1,000 字以上多い |
| 前回の grade からの比 | 1.3   | 1.8   | 前回より 1,000 字以上増えた  |
| 運用・検証の章の割合  | 20%   | 30%   | 運用・検証の章が 500 字以上  |

運用・検証の章は、行を含む最も深い見出しが「検証・受入・承認・公開・変更管理・変更影響・確認事項・未決事項・見直し・改訂・廃止」のいずれかを含む節とした。親の章名に「検証」を含んでも、隣接仕様との対応のような別の主題の小節は数えない。

根拠（本書の数え方による実測。PJR-8S4T の数え方より frontmatter と表の外の差で 2% ほど少ない）:

| 文書                                    | 文字数 | sample との比 | 前回からの比 | 運用・検証の章 |
| --------------------------------------- | ------ | ------------- | ------------ | -------------- |
| sld-sample（PJR-8S4T の前）             | 9,648  | -             | -            | 29%            |
| sld-sample（PJR-8S4T の 1 回目の後）    | 5,691  | -             | 0.59         | 22%            |
| sld-sample（今、pass 96）               | 5,642  | -             | 0.99         | 10%            |
| 代替案比較（PJR-CPZH の前）             | 8,991  | 1.48          | -            | 5%             |
| 代替案比較（PJR-CPZH の後・作り直し前） | 19,906 | 3.28          | 2.21         | 4%             |
| 品質管理計画（PJR-Y5AC の前）           | 1,513  | 0.31          | -            | 8%             |
| 品質管理計画（今）                      | 5,514  | 1.72          | 3.64         | 17%            |

- 運用・検証の章: 見直し前の sld-sample（29%）を minor、今の sld-sample（10%）を対象外にする位置に minor 20% を置いた。major は見直し前より重い 30% とした。
- sample との比: 手直し前の代替案比較（1.48 倍、grade で問題にならなかった版）を対象外にし、膨らんだ版（3.28 倍）を major にする位置に置いた。
- 前回からの比: PJR-8S4T の 3 回目の手直しのような説明の追加（約 5% 増）を対象外にし、膨らんだ 2 例（2.21 倍・3.64 倍）を major にする位置に置いた。小さい文書の増減で騒がないよう、最小の量を設けた。

### 5.3. 確かめた結果

- 上の実測値を既定の上限で判定する単体テストを足した（`tests/src/grade/size-metrics.test.ts`）。PJR-CPZH の作り直し前の版は sample との比と前回からの比の 2 つが major、PJR-Y5AC の今の版は sample との比が minor・前回からの比が major、PJR-8S4T の前の sld-sample は運用・検証の章が minor になり、今の sld-sample は上限を超えない。
- 一時ディレクトリで `grade apply` を 2 回流すテストで、`size_metrics` の記録、前回の文字数からの増え方、executor が削れる箇所を示したときに verdict が `needs-work` になること、示さないときは note になること、grade plan に指標が出て前回の指摘に指標の finding が出ないことを確かめた。
- 実際の grade（agent の起動）は executor から流せないため流していない。今の sld-sample は見直し後の版のため、膨らみを捕まえる対象ではなく、捕まえないこと（対照）を確かめた。

### 5.4. 迷った点と決めた内容

- 減点の条件: 指標だけで level を下げると、判断に要る記述まで削らせる。executor が削れる箇所を示した場合だけ指標の重大度を効かせ、示さなかった場合は note にした。指標は note でも結果に残る。
- 指標の finding を新しい観点にせず `vp-arc-conciseness` に付けた。観点を足すと全文書の category の平均が変わり、上限を超えない文書の点数まで動くため。
- sample との比は成果物だけで求める。kata の rulebook も `sample` を宣言するが、rulebook と sample は役割が違い、大きさを比べても冗長さを示さないため。YAML の文書は章の構造と sample の対応がないため測らない。
- 前回からの増え方は、前回の結果に `size_metrics` がある場合だけ求める。旧い結果から文字数を復元しない（git の履歴を辿ると grade が重くなるため）。v3 で 1 回 grade した後から効く。
- 旧い方式（成果物本文に grade を書き込むインライン方式）には指標を足していない。現行はサイドカー方式であり、インライン方式の書式を保つため。
- rubric の id を v3 に改めた。上限を超えた文書は v2 と level・verdict が変わりうるため、`--rubric-outdated` で選べるようにした。定期 routine の `rubric_outdated: true` により、v2 の結果は既存の件数上限の範囲で順に評価し直される。
- 運用・検証の章は見出しの語で判定した。「運用」は sld の「運用判断」のように業務の内容にも使うため語に入れなかった。
- `src/grade/apply.ts` の `applyGradeSubmission` と `src/grade/plan.ts` の `renderGradePlanWithEmbedding` は、変更前から ESLint の `max-lines-per-function` の warn（212 行・241 行）があり、今回 1〜2 行増えた。分割は本件の範囲外とした。

### 5.5. 保護された設定

変更は不要だった。`package.json`・`lefthook.yml`・`.specdojo/` などは変えていない。

### 5.6. CHANGELOG に書く事項

- 区分: 変更。文案: grade が文書の大きさ（宣言された sample との比・前回の grade からの増え方・文書の運用と検証の章の割合）を LLM を使わずに測って grade result の `size_metrics` に記録し、`grade_rubric.size_limits` の上限を超えると `vp-arc-conciseness` に finding を付けるようにしました。executor が削れる箇所を示した場合だけ減点します。rubric は `grade-rubric-v3` になり、v2 の結果は `grade list --rubric-outdated` で選べます（PJR-2Q0G）。

### 5.7. 残課題

- 統合の後に orchestrator が実際の grade（`--rubric-outdated` を含む）を流し、膨らんだ文書の点数と finding を確かめる。上限が厳しすぎる・緩すぎる場合は `size_limits` を見直す。

## 6. 関連ドキュメント

- [[prj-0001:pjr-0t83-grade-rework-bloats-documents]]
- [[prj-0001:pjr-8s4t-sld-kata-slim-pilot]]
