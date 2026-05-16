---
id: specdojo-definition-to-task-algorithm-guide
type: guide
status: draft
---

# SpecDojo 定義からタスクを生成するアルゴリズムガイド

本ドキュメントは、SpecDojo において **要求・要件・仕様書群から AI が実行可能なタスク群を生成するアルゴリズム**を定義する。

SpecDojo では、要求・要件・仕様から直接コード生成するのではなく、原則として

```text
Needs / Requirements / Specs → Deliverables → Tasks → Schedule → Execution
```

の順で分解する。

これにより、

- 要求・要件・仕様と実装の対応関係を保持できる
- AI Agent が安全に自律実行できる
- タスクの完了条件を明確にできる
- 進捗・差分・影響分析が可能になる

## 1. 目的

本アルゴリズムの目的は、要求・要件・仕様書から次を機械的に導出することである。

- 実装対象の成果物
- 成果物ごとの作業単位
- 依存関係
- 見積粒度
- 検証タスク
- スケジュール投入単位

生成される成果は、最終的に以下へ反映される。

- `sch-*.yaml`
- `generated/` 配下のレビュー用出力

## 2. 基本原則

### 2.1 要求・要件・仕様をそのままタスクにしない

要求・要件・仕様の見出しや章立てを、そのまま task に変換してはならない。

悪い例:

```text
業務仕様
↓
タスク: 業務仕様を実装する
```

良い流れ:

```text
業務仕様
↓
定義要素抽出
↓
成果物抽出
↓
成果物ごとの実装タスク化
```

### 2.2 Deliverable Driven

タスクは必ず **成果物に結びつく**必要がある。

理想形:

```text
1 task = 1〜数個の成果物変更
```

例:

```text
Task:
- create login endpoint

Produces:
- src/auth/login-controller.ts
- tests/auth/login-controller.test.ts
```

### 2.3 Deterministic

生成されるタスクは、AI が以下を判断できる必要がある。

- 何を作るか
- どこを変更するか
- 何をもって完了とするか
- 何に依存するか

### 2.4 Small and Executable

生成されるタスクは、原則として AI Agent が一度の実行で完了可能な粒度とする。

目安:

- 10分〜2時間
- 1〜5ファイル変更
- 1責務
- テスト込み

## 3. 入力

本アルゴリズムの入力は、以下の Definition Layer / Product Layer の文書群である。

例:

- `docs/ja/projects/...`
- `docs/ja/product-docs/010-business-spec/...`
- `docs/ja/product-docs/020-external-if-spec/...`
- `docs/ja/product-docs/030-architecture/...`
- `docs/ja/product-docs/040-system-design/...`
- `docs/ja/product-docs/080-test/...`

必要に応じて参照する補助情報:

- 既存コード構成
- ディレクトリ構造
- 既存の `sch-*.yaml`
- 既存の deliverables
- 決定記録

## 4. 出力

出力は次の3段階に分かれる。

### 4.1 中間出力

- 仕様要素一覧
- 成果物候補一覧
- 依存関係候補一覧
- リスク/不確実性一覧

### 4.2 計画出力

- domain 単位タスク群
- milestone への紐付け
- dependency graph
- duration の初期推定

### 4.3 最終出力

- `sch-<domain>.yaml`
- 必要なら `sch-milestones.yaml` 更新
- レビュー用 Markdown

### 5. アルゴリズム全体像

全体フローは以下の通り。

```text
Step 1 定義要素抽出
Step 2 定義要素分類
Step 3 Deliverable候補抽出
Step 4 Deliverable正規化
Step 5 Task生成
Step 6 Dependency推定
Step 7 Validation/Testタスク生成
Step 8 Task分割・統合
Step 9 Duration推定
Step 10 Schedule出力
Step 11 Human review
```

## 6. Step 1: 定義要素抽出

要求・要件・仕様文書から、実装対象になりうる要素を抽出する。

抽出対象:

- 業務ルール
- API
- 入出力
- DB変更
- UI画面/部品
- バッチ
- イベント
- 権限
- エラー条件
- 外部連携
- 非機能要件の実装要素
- 受入条件・制約・前提条件に由来する実装要素

抽出単位は「文書」ではなく **定義要素** とする。

例:

```text
定義:
ログインAPIは email/password を受け取り JWT を返す

抽出:
- login API endpoint
- credential validation
- JWT generation
- error response
- auth test
```

## 7. Step 2: 定義要素分類

抽出した要素をカテゴリに分類する。

推奨カテゴリ:

- `api`
- `ui`
- `domain-rule`
- `data`
- `integration`
- `batch`
- `ops`
- `test`
- `migration`

例:

```text
login endpoint -> api
password validation -> domain-rule
jwt token -> api
login history table -> data
```

この分類は domain 分割やファイル配置推定に使う。

## 8. Step 3: Deliverable候補抽出

各定義要素に対し、どの成果物が必要かを推定する。

例:

```text
定義要素:
login API endpoint

Deliverable候補:
- src/auth/login-controller.ts
- src/auth/login-service.ts
- tests/auth/login-controller.test.ts
- docs/api/auth-login.md
```

抽出ルール:

- API 仕様があれば controller / handler / route を候補化
- 業務ルールがあれば service / domain module を候補化
- DB変更があれば migration / schema / repository を候補化
- UI変更があれば page / component / state / test を候補化
- 外部連携があれば client / adapter / mock / test を候補化

## 9. Step 4: Deliverable正規化

Deliverable候補には重複や粒度のブレがあるため、正規化する。

正規化内容:

- 重複除去
- 命名統一
- 既存ファイルとの対応付け
- 新規作成/既存変更の判定
- domain / component の割当

例:

```text
src/auth/login.ts
src/auth/login-service.ts
```

が同一責務なら、既存構造に合わせて1つに統合する。

## 10. Step 5: Task生成

Deliverable群から task を生成する。

原則:

```text
1 task = 1責務 = 1〜数ファイル = 1つの完了条件
```

生成規則:

- controller と service を別責務なら別 task
- 実装とテストは原則同一 task に含める
- 大きすぎる場合は task を分割する
- docs 更新は必要に応じて同一 task または別 task にする

例:

```text
Deliverables:
- src/auth/login-controller.ts
- tests/auth/login-controller.test.ts

Task:
- T-AUTH-API-010 create login endpoint
```

```text
Deliverables:
- src/auth/token-service.ts
- tests/auth/token-service.test.ts

Task:
- T-AUTH-API-020 generate jwt token
```

## 11. Step 6: Dependency推定

task 間の依存を推定する。

依存の種類:

- 実装依存
- データ依存
- I/F依存
- テスト依存
- 設計決定依存

推定ルール:

- repository が必要なら schema / migration に依存
- endpoint は service に依存することが多い
- integration test は実装task に依存
- UI は API contract に依存

例:

```text
T-AUTH-DATA-010 create auth table
→ T-AUTH-API-010 create login endpoint
→ T-AUTH-API-020 generate jwt token
→ T-AUTH-API-090 add auth integration test
```

依存は最小限にする。過剰依存は ready を減らし、並列性を下げる。

## 12. Step 7: Validation / Testタスク生成

SpecDojo では、テストは後付けではなく task 生成時に組み込む。

ルール:

- 小さな単体テストは原則 task に内包
- 統合テストは別 task 化可能
- 受入条件に紐づくテストは明示 task 化する

例:

```text
T-AUTH-API-010 create login endpoint
  includes:
  - controller implementation
  - unit test

T-AUTH-API-090 add auth integration test
```

## 13. Step 8: Task分割・統合

生成した task を AI 向け粒度に調整する。

## 分割条件

以下に当てはまる場合は分割する。

- 変更ファイル数 > 5
- 見積 > 2h
- 責務が2つ以上
- 複数の異なる専門領域を跨ぐ
- 完了条件が複数ある

### 統合条件

以下に当てはまる場合は統合する。

- 実質1つの責務
- 依存が強く分離メリットがない
- 片方だけでは完了判定できない
- 変更ファイルが少なく、実行時間が短い

## 14. Step 9: Duration推定

各 task に初期見積を与える。

推定要素:

- ファイル新規作成か既存変更か
- 変更ファイル数
- 外部依存の有無
- テスト範囲
- 不確実性

推定は厳密値ではなく、スケジューリング用の粗い値でよい。

例:

| 条件                       | duration_days 目安 |
| -------------------------- | ------------------ |
| 単純な1ファイル変更        | 0.125              |
| 小さなAPI実装 + test       | 0.25               |
| DB変更 + repository + test | 0.5                |
| 外部連携含む中規模変更     | 1.0                |

## 15. Step 10: Schedule出力

生成した task を `sch-*.yaml` 形式へ出力する。

例:

```yaml
tasks:
  - id: T-AUTH-API-010
    name: create login endpoint
    duration_days: 0.25
    depends_on:
      - T-AUTH-DATA-010
    produces:
      - src/auth/login-controller.ts
      - tests/auth/login-controller.test.ts
```

必要に応じて:

- domain ごとにファイルを分ける
- milestone へ接続する
- 既存スケジュールに merge する

## 16. Step 11: Human Review

最終的な task 群は人間がレビューする。

レビュー観点:

- 要求・要件・仕様の漏れがないか
- task が大きすぎないか
- dependency が過剰でないか
- deliverable が妥当か
- 命名が一貫しているか
- milestone に接続されているか

AI は task を生成できるが、最終責任は人間が持つ。

## 17. 生成アルゴリズムの疑似コード

```text
for each definition_document:
  extract definition_elements

for each definition_element:
  classify definition_element
  derive deliverable_candidates

normalize deliverables

for each deliverable_group:
  create executable_task

infer dependencies between tasks

for each task:
  attach validation/test work
  split if too large
  merge if too small
  estimate duration

output sch-*.yaml
```

## 18. 生成品質ルール

生成された task は以下を満たす必要がある。

- task 名が動詞で始まる
- 1 task 1責務
- deliverable が明示される
- dependency が最小限
- 完了条件が明確
- AI が自律実行可能

## 19. Anti-pattern

### 19.1 要求・要件・仕様見出しをそのまま task にする

悪い例:

```text
業務仕様を実装する
```

### 19.2 Deliverable が無い

悪い例:

```text
認証を改善する
```

### 19.3 巨大 task

悪い例:

```text
認証システムを作る
```

### 19.4 テスト task が欠落

悪い例:

```text
実装taskだけ生成して終わる
```

## 20. SpecDojo における自動生成の位置づけ

SpecDojo の理想フローは以下である。

```text
Needs / Requirements / Specs
↓
Definition element extraction
↓
Deliverable derivation
↓
Task generation
↓
Schedule generation
↓
Execution
```

つまり、AI は単にコードを書くのではなく、

**要求・要件・仕様から実行可能な計画を生成する**

役割を持つ。

## 21. まとめ

SpecDojo の Definition→Task 生成アルゴリズムは、要求・要件・仕様を直接タスクに変換するのではなく、

```text
Needs / Requirements / Specs → Deliverables → Tasks
```

という中間層を必ず通す。

これにより、

- 要求・要件・仕様と実装の対応が取れる
- AI Agent が実行しやすい
- CPM や ready 判定が安定する
- プロジェクト全体を Git 上で再現可能にできる

SpecDojo において task とは、

**作業指示ではなく、成果物生成のための最小実行単位**

である。
