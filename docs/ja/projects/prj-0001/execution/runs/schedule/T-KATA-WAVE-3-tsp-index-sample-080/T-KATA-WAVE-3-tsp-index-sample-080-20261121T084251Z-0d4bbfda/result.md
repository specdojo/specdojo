---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-tsp-index-sample-080-20261121t084251z-0d4bbfda
  type: exec-result
  task_id: T-KATA-WAVE-3-tsp-index-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-tsp-index-sample-080/T-KATA-WAVE-3-tsp-index-sample-080-20261121T084251Z-0d4bbfda/plan.md
  started_at: "2026-11-21T08:42:53.639Z"
  completed_at: "2026-11-21T09:45:11.894Z"
  agent: opus-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:tsp-index-sample
  condense_records:
    - location: テストレベル一覧と観点/条件設計の共通原則 > テストレベル一覧（表の直後の段落「隣接レベルとの分担として…」）
      category: repetition
      action: delete
      reason: 外部結合テストで印刷・保管の契約を確かめ、総合テストはスモークに限るという分担は、「テスト環境・テストデータ」の外部I/F の段落と、表の「やらないこと（非目的）」の列で同じ意味を保っているため削除した
      cause:
        type: document
    - location: 概要 第1段落「単体→内部結合→外部結合→総合→受入の順に確認する」
      category: repetition
      action: retain
      reason: rulebook が概要に求めるレベルの進め方の要素で、記述ガイドの良い例にも含まれるため残した
      cause:
        type: document
    - location: 概要 第3段落（非機能の基準を「メモ / 将来課題」の仮置きとする記述）
      category: canonical-restatement
      action: retain
      reason: 判定の前提となる制約を短く参照しているだけで、詳細は「メモ / 将来課題」にあり、再掲には当たらないため残した
      cause:
        type: document
    - location: テストレベル一覧の表「実施体制・備考」の列（モック・スタブ・実接続の扱い）と「テスト環境・テストデータ」の環境の表
      category: repetition
      action: retain
      reason: rulebook の必須列（ツール・除外）で、単体テストのモックと内部結合テストの実接続のようにレベルごとの違いがある。環境の表は 2 つのレベルをまとめているため、片方へ寄せると情報が減る
      cause:
        type: document
    - location: 不具合管理方針 最終文（既知不具合は品質ゲートの例外承認に従う）
      category: canonical-restatement
      action: retain
      reason: すでに品質ゲートの章を参照する形になっていて、rulebook が求める既知不具合の扱いを示すため残した
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象文書 `docs/ja/specdojo/samples/tsp-index-sample.md` において、冗長な記述の整理を行いました。
- テストレベル一覧の直後にあった、外部I/F の分担を繰り返す 1 文を削除しました。この内容は「テスト環境・テストデータ」の段落および表の「やらないこと」の列で既に定義されているためです。
- その他の箇所（概要、品質ゲートの参照、環境に関する表など）については、判断に必要な情報や `rulebook` が求める必須要素を維持するため、保持（`retain`）と判断しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsp-index-sample.md`: テストレベル一覧の直後にあった、外部I/F の説明と分担に関する冗長な段落を削除しました。

## 3. 申し送り

- なし

<!-- specdojo:agent-protection-handoff -->

**保護機構による自動記録**: `agent-commit-scope` が agent の変更を止めた。適用するかどうかは人または対話型 orchestrator が agent 実行外で判断する。

- commit 対象外のパス: `docs/ja/specdojo/samples/tsp-index-sample.md`
- 変更理由: この節の上に agent が記入した申し送りを参照する。
- 変更後に必要な検証: この節の上に agent が記入した申し送りを参照する。
- block メッセージ: `commit-scope: integration blocked; 1 non-target changes (worktree kept):   docs/ja/specdojo/samples/tsp-index-sample.md`

次のアクション:

```text
worktree を保持して統合を停止した。対象外の変更を確認し、必要な変更は targets の見直しまたは別タスクで取り込む。型のカタログ・schema・メニューなどの対象外ファイルは、変更理由と提案差分を報告してから executor を再開する。
```

## 4. 進め方と実践の型の適用

文書内の冗長さを `repetition`（繰り返し）、`canonical-restatement`（正本の再掲）の観点から特定し、削除・保持の判断を行いました。特に、他の箇所で既に説明されている外部I/F の分担に関する記述を削除することで、簡潔さと情報の整合性を向上させました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `テストレベル一覧と観点/条件設計の共通原則 > テストレベル一覧（表の直後の段落「隣接レベルとの分担として…」）` | `repetition` | `delete` | `外部結合テストで印刷・保管の契約を確かめ、総合テストはスモークに限るという分担は、「テスト環境・テストデータ」の外部I/F の段落と、表の「やらないこと（非目的）」の列で同じ意味を保っているため削除した` | `document` |
| `概要 第1段落「単体→内部結合→外部結合→総合→受入の順に確認する」` | `repetition` | `retain` | `rulebook が概要に求めるレベルの進め方の要素で、記述ガイドの良い例にも含まれるため残した` | `document` |
| `概要 第3段落（非機能の基準を「メモ / 将来課題」の仮置きとする記述）` | `canonical-restatement` | `retain` | `判定の前提となる制約を短く参照しているだけで、詳細は「メモ / 将来課題」にあり、再掲には当たらないため残した` | `document` |
| `テストレベル一覧の表「実施体制・備考」の列（モック・スタブ・実接続の扱い）と「テスト環境・テストデータ」の環境の表` | `repetition` | `retain` | `rulebook の必須列（ツール・除外）で、単体テストのモックと内部結合テストの実接続のようにレベルごとの違いがある。環境の表は 2 つのレベルをまとめているため、片方へ寄せると情報が減る` | `document` |
| `不具合管理方針 最終文（既知不具合は品質ゲートの例外承認に従う）` | `canonical-restatement` | `retain` | `すでに品質ゲートの章を参照する形になっていて、rulebook が求める既知不具合の扱いを示すため残した` | `document` |
