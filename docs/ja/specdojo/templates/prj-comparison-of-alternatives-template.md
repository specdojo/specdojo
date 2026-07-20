---
specdojo:
  id: prj-comparison-of-alternatives-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:prj-comparison-of-alternatives
      type: project
      status: draft
      rulebook: prj-comparison-of-alternatives-rulebook
      based_on:
        - _PROJECT_ID_:prj-scope
        - _PROJECT_ID_:prj-issues-and-approach
        - _PROJECT_ID_:prj-assumptions-constraints-dependencies
      supersedes: []
---

# 代替案比較: _PROJECT_NAME_

_TODO_: 本書の目的を 1〜2 文で記述する。複数案を比較し、採択案、非採択案、技術的影響、見直し条件を説明可能にすることを述べる。

## 1. 比較目的と前提条件

_TODO_: 何を決めるための比較か、運営・開発戦略、実行プロセス、支援方式のどの比較レイヤーを扱うか、含めない判断は何かを記述する。

根拠資料は次のとおり。比較対象案・評価軸・採択理由は、これらの決定事項と整合させる。

- `_PROJECT_ID_:prj-scope`: _TODO_ (例: 比較対象範囲と境界の判断基準)
- `_PROJECT_ID_:prj-issues-and-approach`: _TODO_ (例: 解くべき課題、必要能力、制約、評価条件)
- `_PROJECT_ID_:prj-assumptions-constraints-dependencies`: _TODO_ (例: 戦略と支援方式が守る成立条件、外部依存、判断責任)

前提条件は次のとおり。

- _TODO_: 比較で守る前提 1
- _TODO_: 比較で守る前提 2
- _TODO_: 比較で守る前提 3

## 2. 比較対象案

_TODO_: 前段文書の候補案だけを再掲せず、既存標準・開発方式・運営方式・製品を調査する。同じ意思決定を代替でき、単独でも目的達成への道筋を説明できる戦略案を最低 2 案記述する。

| 案ID   | 比較レイヤー | 案     | 目的達成への道筋 | 主な構成要素 | 対象範囲 |
| ------ | ------------ | ------ | ---------------- | ------------ | -------- |
| ALT-01 | _TODO_       | _TODO_ | _TODO_           | _TODO_       | _TODO_   |
| ALT-02 | _TODO_       | _TODO_ | _TODO_           | _TODO_       | _TODO_   |

_TODO_: 候補案の情報源と選定理由を明記する。前段文書から引き継ぐのは課題・必要能力・制約・評価条件であり、候補案の集合を前段文書だけに限定しない。

支援方式を同時に検討する場合は、戦略案と分離して記述する。不要な場合は次の表を削除する。

| 方式ID | 比較レイヤー       | 方式   | 支援する能力 | 外部依存・成熟度 | 採用時期 |
| ------ | ------------------ | ------ | ------------ | ---------------- | -------- |
| SUP-01 | タスク・状態管理等 | _TODO_ | _TODO_       | _TODO_           | _TODO_   |
| SUP-02 | タスク・状態管理等 | _TODO_ | _TODO_       | _TODO_           | _TODO_   |

## 3. 評価軸と評価基準

_TODO_: 案ごとに変えない共通の評価軸を定義する。観点を省略する場合は省略理由を記述する。

| 評価軸     | 重み   | 判定基準 | 備考   |
| ---------- | ------ | -------- | ------ |
| 効果       | _TODO_ | _TODO_   | _TODO_ |
| コスト     | _TODO_ | _TODO_   | _TODO_ |
| 期間       | _TODO_ | _TODO_   | _TODO_ |
| リスク     | _TODO_ | _TODO_   | _TODO_ |
| 運用適合   | _TODO_ | _TODO_   | _TODO_ |
| 技術実現性 | _TODO_ | _TODO_   | _TODO_ |
| 適応性     | _TODO_ | _TODO_   | _TODO_ |
| 追跡性     | _TODO_ | _TODO_   | _TODO_ |
| AI 適合    | _TODO_ | _TODO_   | _TODO_ |
| 成熟度     | _TODO_ | _TODO_   | _TODO_ |

_TODO_: 評価表記（例: `High` / `Middle` / `Low`）と、総合評価の扱いを記述する。

_TODO_: 各評価軸がどのプロジェクト課題（`prj-issues-and-approach` 等）やスコープに対応しているかを記述し、整合性を担保する。

## 4. 比較結果と採択理由

_TODO_: 各案を同じ評価軸で比較し、採択、一部採択、非採択を判定する。

| 案ID   | 効果   | コスト | 期間   | リスク | 運用適合 | 技術実現性 | 適応性 | 追跡性 | AI 適合 | 成熟度 | 総合評価 | 判定   |
| ------ | ------ | ------ | ------ | ------ | -------- | ---------- | ------ | ------ | ------- | ------ | -------- | ------ |
| ALT-01 | _TODO_ | _TODO_ | _TODO_ | _TODO_ | _TODO_   | _TODO_     | _TODO_ | _TODO_ | _TODO_  | _TODO_ | _TODO_   | _TODO_ |
| ALT-02 | _TODO_ | _TODO_ | _TODO_ | _TODO_ | _TODO_   | _TODO_     | _TODO_ | _TODO_ | _TODO_  | _TODO_ | _TODO_   | _TODO_ |

_TODO_: 採択案と、補助的に組み合わせる（一部採択する）案があれば 1 文で記述する。

_TODO_: 支援方式を比較した場合は、戦略決定と分けて、採用・試行・保留・非採用を記述する。

採択理由:

- _TODO_: 採択理由 1 (なぜこの案が最適か)
- _TODO_: 採択理由 2 (プロジェクト目標への寄与)
- _TODO_: 採択理由 3 (リスクや制約への整合)

技術的実現性と影響:

| 案ID   | 技術的実現性 | 主な影響 |
| ------ | ------------ | -------- |
| ALT-01 | _TODO_       | _TODO_   |
| ALT-02 | _TODO_       | _TODO_   |

非採択または一部採択の理由:

| 案ID   | 扱い   | 理由   | 再評価条件 |
| ------ | ------ | ------ | ---------- |
| _TODO_ | _TODO_ | _TODO_ | _TODO_     |

## 5. リスクとトレードオフ

_TODO_: 採択に伴って受容する不利条件、先送りする範囲、起きうるリスクと軽減策を記述する。

| 区分   | 内容   | 軽減策 |
| ------ | ------ | ------ |
| _TODO_ | _TODO_ | _TODO_ |
| _TODO_ | _TODO_ | _TODO_ |

案ごとのリスクとトレードオフ:

| 案ID   | 主なリスク / トレードオフ | 軽減策 / 扱い |
| ------ | ------------------------- | ------------- |
| ALT-01 | _TODO_                    | _TODO_        |
| ALT-02 | _TODO_                    | _TODO_        |

## 6. 決定と見直し

- _TODO_: 現時点の採択方針を記述する。
- _TODO_: 採択案の最終判断者を人間の責任ロールとして記述する。AI Agent は比較分析の支援に留める。
- _TODO_: 再評価条件（どのような状況になったら再検討するか）を記述する。
- _TODO_: 方針変更時の記録先（プロジェクト登録簿、決定記録など）を記述する。
