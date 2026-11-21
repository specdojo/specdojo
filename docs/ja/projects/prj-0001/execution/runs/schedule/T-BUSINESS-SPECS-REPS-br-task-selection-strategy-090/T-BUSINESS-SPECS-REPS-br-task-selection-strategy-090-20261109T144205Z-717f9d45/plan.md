---
specdojo:
  id: prj-0001:xrp-t-business-specs-reps-br-task-selection-strategy-090-20261109t144205z-717f9d45
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-REPS-br-task-selection-strategy-090
  name: "完成版レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: BA
  approach: fully-guided
  targets:
    - br-task-selection-strategy
---

# Review Plan: T-BUSINESS-SPECS-REPS-br-task-selection-strategy-090

## 1. このフェーズで行うこと

完成版を変更せず、実践の型と done_criteria、先行成果物との整合を照合する。判定結果と修正対象候補を根拠付きで review result に記録する。

## 2. 対象成果物

- `name`: ビジネスルール（タスク選択戦略）
- `depends_on`:
  - [[bps-task-selection-preparation]]
- `based_on`（対象成果物の frontmatter）: なし
- 個票の `入力`: なし
- `overview`: Ready task を critical-first / fifo などで選ぶ選択順位・selection strategyを定義する
- `path`: `docs/ja/product/010-business-specs/030-business-model/br-task-selection-strategy.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/br-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-REPS-br-task-selection-strategy-090/T-BUSINESS-SPECS-REPS-br-task-selection-strategy-090-20261109T144205Z-717f9d45/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/010-business-specs/030-business-model/br-task-selection-strategy.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/br-task-selection-strategy.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 失敗した（run id: `review-prj-0001-T-BUSINESS-SPECS-REPS-br-task-selection-strategy-090-20261109T143351Z`; docs/ja/product/010-business-specs/030-business-model/br-task-selection-strategy.md: exit 1: docs/ja/product/010-business-specs/030-business-model/br-task-selection-strategy.md: $analysis: line 90: malformed FINDING for vp-arc-technical-constraints）
- 鮮度: 評価結果がない（評価結果サイドカーが存在しない）

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | ルール・入力・出力・例外が業務観点で明確に記述されていること |
| DC-002 | PO | vp-po-purpose-alignment | ルールの業務的妥当性と適用範囲を承認できること |
| DC-003 | ARC | vp-arc-technical-constraints | ルール実装（バリデーション・ドメインロジック）の基礎として参照できること |
| DC-004 | QE | vp-qe-verifiability | ルールベースのテストケース設計に活用できること |
| DC-005 | DEV | vp-dev-implementation-readiness | ビジネスロジック実装の参照として使えること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/br-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/br-sample.md`
- 併せて適用する rulebook（記法など）: _MISSING_

1. フェーズ説明と完了条件が求めた磨き込みが、対象成果物に行われたかを確認する。
2. 実践の型の欠落（`_MISSING_`）や内容の薄さがある場合は、実行記録にその扱いが残っているかを確認する。実践の型そのものの整備が必要な場合は、改善指示に残す。
3. finding が残っている場合は、このタスクの完了を妨げるかを判断する。rulebook の必須要素の欠落や禁止事項への抵触など、完了条件に直結する finding は完了を妨げる。

確認に用いてよい文書は、宣言された文書だけに限る。具体的には、評価結果、対象成果物、本セクションの参照ファイル、`depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief`、実行記録である。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書や外部の情報を独自に探索・参照しない。

本タスクの実行に必要な fully-guided の確認方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や edit への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

## 6. 完了手順

1. 共通規約の `review の判断手順` に従い、評価結果の鮮度を確認してから完了可否を判断する。
2. result の各セクションを埋める。`評価結果の確認` には鮮度確認のコマンドと出力、grade の `verdict` / `score` / finding 件数を書く。`判断根拠` には照合した内容を、`未充足事項・改善指示` には未充足事項と改善指示を書く。`approach に応じた確認` には前章で確認した内容を、`decision` には `verdict` を書く。review result の記入はタスク完了に必須であり、未記入のまま終了しない（詳細は共通規約を参照）。
3. 文書の参照は `[[id]]` 形式（Obsidian wikilink）で記載する。行番号アンカー（`#L12-L18` など）や絶対パスは使わない。位置の補足が必要な場合は本文で述べる。
4. verdict が `complete` 以外でも、review result を記録できた場合は正常終了する（終了コード 0）。

## 7. 異常終了の条件

- 対象ファイル不明・依存未解決・result 更新不能など、review 自体を完了できない場合は異常終了する（終了コード 1）。評価結果が最新でない・評価不能であることは異常終了の理由にせず、verdict として記録する。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:13f1d90345b0d1f0bd602cc3e3f06afa7d772eb714e855b6103c85854bebda59` `docs/ja/projects/prj-0001/execution/conventions/13f1d90345b0d1f0bd602cc3e3f06afa7d772eb714e855b6103c85854bebda59.txt`
