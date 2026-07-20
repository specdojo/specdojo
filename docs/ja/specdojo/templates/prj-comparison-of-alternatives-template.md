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

_TODO_: 複数の意思決定を必要に応じて分離し、候補選定、採択・試行・非採択、見直し条件を説明可能にする目的を 1〜2 文で記述する。

## 1. 比較目的と前提条件

_TODO_: 何をどの順序で決めるかを記述する。抽象度が異なる判断には決定 ID を付け、扱わない範囲を明示する。単一レイヤーだけを扱う場合は不要な行を削除する。

| 決定ID | 比較レイヤー | 決定すること | 決定しないこと |
| ------ | ------------ | ------------ | -------------- |
| D-01   | _TODO_       | _TODO_       | _TODO_         |
| D-02   | _TODO_       | _TODO_       | _TODO_         |

根拠資料:

- `_PROJECT_ID_:prj-scope`: _TODO_ (比較対象範囲と境界)
- `_PROJECT_ID_:prj-issues-and-approach`: _TODO_ (課題、必要能力、評価条件)
- `_PROJECT_ID_:prj-assumptions-constraints-dependencies`: _TODO_ (成立条件、外部依存、判断責任)

前提条件:

- _TODO_: 比較で守る前提 1
- _TODO_: 比較で守る前提 2

候補名を先に決めず、比較レイヤーごとに調査カテゴリと選定基準を定める。

| 決定ID | 候補カテゴリ | 候補に含める基準 |
| ------ | ------------ | ---------------- |
| D-01   | _TODO_       | _TODO_           |
| D-02   | _TODO_       | _TODO_           |

_TODO_: 候補選定に用いた公式資料をカテゴリ別に列挙する。市場占有率などを確認していない場合は、候補を「市場の代表」や「標準」と断定しない。

## 2. 比較対象案

### 2.1. D-01: _COMPARISON_LAYER_

_TODO_: 同じ意思決定を代替でき、単独でも目的達成への道筋を説明できる案を最低 2 案記述する。

| 案ID   | 案     | 目的達成への道筋 | 主な構成要素 | 対象範囲 |
| ------ | ------ | ---------------- | ------------ | -------- |
| STR-01 | _TODO_ | _TODO_           | _TODO_       | _TODO_   |
| STR-02 | _TODO_ | _TODO_           | _TODO_       | _TODO_   |

### 2.2. D-02: _COMPARISON_LAYER_

_TODO_: 支援方式、製品、ツールを比較する場合は戦略と分離する。現行・内製方式、直接競合、採用しない案を必要に応じて含める。

| 方式ID | 方式   | カテゴリ | 管理対象・責務 | 強み   | 主な制約 |
| ------ | ------ | -------- | -------------- | ------ | -------- |
| SUP-01 | _TODO_ | _TODO_   | _TODO_         | _TODO_ | _TODO_   |
| SUP-02 | _TODO_ | _TODO_   | _TODO_         | _TODO_ | _TODO_   |

_TODO_: 比較レイヤーが三つ以上ある場合は同じ形式の小節を追加する。

## 3. 評価軸と評価基準

_TODO_: 比較レイヤーごとに評価軸を定義する。同一レイヤー内では候補ごとに軸と判定方向を変えない。

### 3.1. D-01 の評価軸

| 評価軸     | 重み   | 判定基準 | 根拠となる課題・制約 |
| ---------- | ------ | -------- | -------------------- |
| 効果       | _TODO_ | _TODO_   | _TODO_               |
| コスト     | _TODO_ | _TODO_   | _TODO_               |
| 期間       | _TODO_ | _TODO_   | _TODO_               |
| リスク     | _TODO_ | _TODO_   | _TODO_               |
| 運用適合   | _TODO_ | _TODO_   | _TODO_               |
| 技術実現性 | _TODO_ | _TODO_   | _TODO_               |

### 3.2. D-02 の評価軸

| 評価軸             | 判定基準 |
| ------------------ | -------- |
| 正本性・成果物適合 | _TODO_   |
| 既存資産との重複   | _TODO_   |
| 導入・運用負荷     | _TODO_   |
| ロックイン・可逆性 | _TODO_   |
| 成熟度             | _TODO_   |

_TODO_: 評価表記（例: `High` / `Middle` / `Low`）と、採択に有利な方向、重みの使い方を記述する。

## 4. 比較結果と採択理由

### 4.1. D-01: _COMPARISON_LAYER_

| 案ID   | 効果   | コスト | 期間   | リスク | 運用適合 | 技術実現性 | 総合評価 | 判定   |
| ------ | ------ | ------ | ------ | ------ | -------- | ---------- | -------- | ------ |
| STR-01 | _TODO_ | _TODO_ | _TODO_ | _TODO_ | _TODO_   | _TODO_     | _TODO_   | _TODO_ |
| STR-02 | _TODO_ | _TODO_ | _TODO_ | _TODO_ | _TODO_   | _TODO_     | _TODO_   | _TODO_ |

_TODO_: 採択案、一部採択する要素、非採択理由、再評価条件を重複なく記述する。

### 4.2. D-02: _COMPARISON_LAYER_

| 方式ID | 正本性・成果物適合 | 重複   | 導入・運用負荷 | 可逆性 | 成熟度 | 判定   |
| ------ | ------------------ | ------ | -------------- | ------ | ------ | ------ |
| SUP-01 | _TODO_             | _TODO_ | _TODO_         | _TODO_ | _TODO_ | _TODO_ |
| SUP-02 | _TODO_             | _TODO_ | _TODO_         | _TODO_ | _TODO_ | _TODO_ |

_TODO_: `採択` / `比較試行` / `保留` / `非採択` を区別し、正本、同期方向、採用・撤退条件を記述する。

比較試行を行う場合:

- 入力と対象範囲: _TODO_
- 測定項目と完了条件: _TODO_
- 採用・撤退判定と記録先: _TODO_

### 4.3. 技術的実現性と影響

| 決定ID | 技術的実現性 | 主な影響 |
| ------ | ------------ | -------- |
| D-01   | _TODO_       | _TODO_   |
| D-02   | _TODO_       | _TODO_   |

## 5. リスクとトレードオフ

| 区分         | 内容   | 軽減策 |
| ------------ | ------ | ------ |
| トレードオフ | _TODO_ | _TODO_ |
| リスク       | _TODO_ | _TODO_ |

## 6. 決定と見直し

- _TODO_: 各決定の採択、比較試行、保留を短く要約する。
- _TODO_: 最終判断者を人間の責任ロールとして記述し、AI Agent は比較分析の支援に留める。
- _TODO_: 再評価トリガーをカテゴリ単位で記述し、特定製品の自動採用条件にしない。
- _TODO_: 方針変更、評価結果、影響範囲、移行・撤退方法の記録先を記述する。
