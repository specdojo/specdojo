---
specdojo:
  id: prj-0001:pjr-wpwb-rename-evaluation-human
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

# PJR-WPWB 観点の evaluation: human を誤解のない名前へ改める

## 1. 概要

viewpoint の `evaluation: human` は「人だけが判定する」と読めるが、実態と違う。

review フェーズは agent が実行する。`pm-members.yaml` には `claude-review-executor`、`codex-review-executor`、`agy-expert-review-executor`、`opencode-review-executor` があり、`xrp-*` は agent へ渡す review plan である。`evaluation: human` の観点も agent が判定している。

`continuous: false` との対応から読み取れる実際の意味は次である。

> 継続的な自動評価に向かない。判断の前提となる文脈（承認の意図、事業価値、実装の見通し）が文書外にあり、機械的な繰り返し評価では意味のある判定ができない。

### 1.1. 同じ語が 2 箇所で別の意味を持つ

| フィールド                              | `human` の意味                                |
| --------------------------------------- | --------------------------------------------- |
| `task.execution`（`src/exec-plans.ts`） | **実際に人が実行する**。正しい用法            |
| `viewpoint.evaluation`                  | 継続評価に向かない。実行主体は agent でもよい |

この混同は実害を生んだ。[[prj-0001:pjr-2zvs-grade-review-integration]] の決定 3.1 は当初「`human` 観点は review のレビュア（人）が判定する」と書き、grade の対象選択の基準も `continuous` ではなく `evaluation` と誤って据えていた。

### 1.2. 急ぐ理由

`docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` は npm package に同梱され、利用者は eject して override できる。**enum の値は利用者の設定に現れる**ため、採用が広がってからの改名は利用者の設定を壊す。

0.2.1 を公開した直後であり、いま改名するのが最も安い。[[prj-0001:pjr-xtan-unify-verdict-vocabulary]] も同じファイルと schema の enum を変える破壊的変更なので、**同時に行い移行を 1 回で済ませる**。

## 2. 完了条件

- `evaluation` の enum から `human` が無くなり、意味を正しく表す値へ改まっている。候補は `contextual`（文書外の文脈を要する）とし、代案があれば比較して決める。
- `deterministic` と `agent` を併せて改名するかを判断している。`deterministic` と `agent` は判定手段、新しい値は判定に必要なものを表すため、軸が揃っているかを確認する。
- `pm-review-viewpoints.schema.yaml` の enum と description が更新されている。
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` の 16 観点が新しい値になっている。
- `src/grade.ts` の `continuousViewpoints()` / `agentViewpoints()` / `deterministicResults()` が追従している。
- `task.execution` の `human` は変更しない。こちらは人が実行する意味で正しい。
- 旧値を読み込んだ場合に、新値を示すエラーで失敗する。黙って無視しない。
- `評価` に関する rulebook・standard・guide の記述が追従している。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ                                      |
| --- | ---------------------------------------- | ---- | ---- | ----------------------------------------- |
| 1   | 新しい値を決める                         | ARC  | open | `contextual` を軸に検討。3 値の軸を揃える |
| 2   | schema の enum と description を更新する | DEV  | open | `pm-review-viewpoints.schema.yaml`        |
| 3   | 既定の観点定義 16 件を新しい値へ改める   | DEV  | open | `defaults/pm-review-viewpoints.yaml`      |
| 4   | `src/grade.ts` の判定を追従させる        | DEV  | open | 3 箇所                                    |
| 5   | 旧値を明確なエラーにする                 | DEV  | open | 黙って無視しない                          |
| 6   | 関連文書の記述を追従させる               | DEV  | open | rulebook / standard / guide               |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-xtan-unify-verdict-vocabulary]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml`
