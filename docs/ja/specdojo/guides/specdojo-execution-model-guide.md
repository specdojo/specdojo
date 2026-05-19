---
id: specdojo-execution-model-guide
type: guide
status: draft
---

# SpecDojo 実行モデル（6層アーキテクチャ）ガイド

SpecDojoは **Git・構造化ドキュメント・イベントログ・AI Agent** を統合した
**AI時代のプロジェクト実行モデル**である。

従来のプロジェクト管理ツール（Jira / Redmine / Backlog 等）は
**Issue管理中心**であるのに対し、

SpecDojoは

```text
Needs / Requirements / Spec → Plan → Deliverables → Execution → Analytics → Automation
```

という **プロダクト生成プロセス全体**を扱う。

---

## 1. 設計思想

SpecDojoは次の原則に基づく。

### 1.1. Gitを唯一の真実（SSOT）

すべての情報はGitに保存する。

対象

- 要求
- 要件
- 仕様
- 設計
- スケジュール
- 実行履歴
- 意思決定
- 成果物

外部ツールへの依存は最小化する。

---

### 1.2. 構造化ドキュメント

要求・要件・仕様・計画は **構造化Markdown / YAML / JSON** で管理する。

理由

- AIが解析しやすい
- diff可能
- バージョン管理可能

---

### 1.3. 実行履歴はイベントソーシング

作業状態は **イベントログから再構築**する。

```text
exec/events/*.json
```

---

### 1.4. 実行状態は生成物

現在の状態は **生成物**として生成する。

```text
generated/
```

---

## 2. SpecDojo 6層アーキテクチャ

SpecDojoは次の **6層モデル**で構成される。

```text
1 Definition Layer
2 Plan Layer
3 Deliverable Layer
4 Event Layer
5 Derived Layer
6 Automation Layer
```

---

## 3. Definition Layer

Definition Layerは **要求・要件・仕様** を定義する。

対象

- 要求
- 要件
- プロダクト仕様
- システム設計
- API仕様
- UX仕様

例

```text
docs/ja/product-docs/
docs/ja/projects/
```

代表ドキュメント

```text
prj-*
req-*
nfr-*
prd-*
sysd-*
scf-*
scp-*
```

Definition Layerは **人間が編集する最上位の情報**である。

要求は「なぜ作るか」、要件は「何を満たすべきか」、仕様は「どう定義するか」を担う。
SpecDojoではこれらを分離せず、Git上の構造化ドキュメント群として一貫管理する。

---

## 4. Plan Layer

Plan Layerは **実行計画**である。

```text
sch-*.yaml
```

内容

- タスク
- milestone
- dependency
- duration

例

```yaml
tasks:
  - id: T-AUTH-API-020
    name: implement login api
    duration_days: 2
    depends_on:
      - T-AUTH-API-010
```

Plan Layerは **要求・要件・仕様から生成される可能性がある**。

---

## 5. Deliverable Layer

Deliverable Layerは **成果物（プロダクト本体）**である。

例

```text
src/
docs/
infra/
assets/
```

例

```text
src/auth/login-api.ts
docs/api/auth.md
infra/terraform/auth.tf
```

---

### 5.1. TaskとDeliverableの関係

タスクは **成果物を生成するためのもの**である。

例

```yaml
tasks:
  - id: T-AUTH-API-020
    produces:
      - src/auth/login-api.ts
      - tests/auth/login-api.test.ts
```

これにより

- タスク目的が明確
- AIが理解可能
- 完了判定が明確

になる。

---

## 6. Event Layer

Event Layerは **実行履歴**である。

```text
exec/events/*.json
```

イベントは **append-only**である。

例

```json
{
  "v": 1,
  "ts": "2026-03-05T03:10:00Z",
  "type": "claim",
  "task_id": "T-AUTH-API-020",
  "by": "agent-backend"
}
```

イベント種別

| type     | 意味       |
| -------- | ---------- |
| claim    | 作業開始   |
| complete | 完了       |
| block    | 停止       |
| unblock  | 停止解除   |
| cancel   | 取消       |
| note     | メモ       |
| link     | 外部リンク |
| estimate | 見積       |

---

## 7. Derived Layer

Derived Layerは **生成される分析情報**である。

生成場所

```text
generated/
```

例

```text
state.json
ready.md
ready.json
claim-next.json
cpm.md
critical-path.md
schedule-diff.md
```

Derived Layerは

```text
Plan + Events
```

から生成される。

---

## 8. Automation Layer

Automation Layerは **AI AgentやCIによる自動実行**である。

例

- AI Agent
- CI/CD
- scheduler
- replanning

Agentの基本動作

```text
scheduler
↓
claim
↓
work
↓
complete
```

Agentは次を読み取る

```text
generated/ready.md
generated/state.json
```

---

## 9. 状態モデル

タスク状態

```text
todo
doing
blocked
done
cancelled
```

---

### 9.1. 状態遷移

| current | command  | next      |
| ------- | -------- | --------- |
| todo    | claim    | doing     |
| doing   | block    | blocked   |
| blocked | unblock  | todo      |
| doing   | complete | done      |
| todo    | cancel   | cancelled |
| doing   | cancel   | cancelled |
| blocked | cancel   | cancelled |

---

## 10. Readyタスク

Readyタスクとは

```text
依存タスクがすべてdone
```

であるタスク。

生成物

```text
generated/ready.md
generated/ready.json
generated/claim-next.json
```

`ready.md` は人間向けの一覧、`ready.json` は strategy ごとの順序付き ready キュー、`claim-next.json` は次の claim 対象である。

---

## 11. CPM（Critical Path Method）

スケジュールから

```text
ES
EF
LS
LF
Slack
```

を計算する。

生成物

```text
generated/cpm.md
generated/critical-path.md
```

---

## 12. スケジュール差分

スケジュール変更はハッシュ比較で検出する。

```text
generated/schedule-diff.md
```

---

## 13. Scheduler

Schedulerは **次に実行すべきタスク**を決定する。

戦略

```text
critical-first
fifo
```

通常は

```text
critical-first
```

を使用する。

生成物としては

```text
generated/ready.json
generated/claim-next.json
```

を参照し、`critical-first` では slack 最小、次に ES 最小、最後に ID 昇順で claim 対象を選ぶ。

---

## 14. 排他制御

複数Agentが安全に実行できるよう

```text
exec/.locks/
```

でロックを管理する。

対象コマンド

- claim
- complete
- block
- cancel
- scheduler

---

## 15. PMBOKとの対応

| PMBOK             | SpecDojo          |
| ----------------- | ----------------- |
| Product Scope     | Definition Layer  |
| WBS / Schedule    | Plan Layer        |
| Deliverables      | Deliverable Layer |
| Progress          | Event Layer       |
| Status Report     | Derived Layer     |
| Project Execution | Automation Layer  |

---

## 16. 従来ツールとの違い

| 従来ツール   | SpecDojo        |
| ------------ | --------------- |
| Jira         | Git             |
| Issue        | Task YAML       |
| Activity log | Event log       |
| Dashboard    | Generated files |
| PM操作       | AI Agent        |

---

## 17. 典型的ワークフロー

```text
specdojo exec validate
specdojo exec build

specdojo exec scheduler --by agent-backend
specdojo exec claim ...

work

specdojo exec complete ...

specdojo exec build
```

---

## 18. 将来拡張

SpecDojoは次の拡張が可能である。

- burn-down生成
- velocity分析
- AI planning
- risk detection
- auto replanning
- needs/requirements/specs→task自動生成

---

## 19. まとめ

SpecDojoは

```text
Needs/Requirements/Specs + Plan + Deliverables + Events + Analytics + Automation
```

を統合した

**AIネイティブなプロジェクト実行モデル**

である。

これは

```text
Git + Structured Definitions + Event Sourcing + CPM + AI Agent
```

を統合した **新しいプロジェクトOS**と言える。
