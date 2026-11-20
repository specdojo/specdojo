---
specdojo:
  id: specdojo:nfr-maintainability-rulebook
  type: rulebook
  deliverable_type: requirement
  status: draft
  recipe: undecided
  sample: specdojo:nfr-maintainability-sample
  template: undecided
---

# 非機能要件 / 保守性 作成ルール

Non-Functional Requirements Maintainability Documentation Rules

非機能要件のうち保守性（変更容易性・障害解析容易性）を定義する `nfr-maintainability` の作成ルールを定めます。

## 1. 全体方針

- 保守性は変更コストと復旧コストを下げる要求として定義する。
- MTTR、変更リードタイム、診断可能性などの指標を用いる。
- 実装方法ではなく、達成すべき運用可能性を記述する。
- **共通の運用**: 役割の割り当ては適用先のメンバー定義に、`status` の昇格と承認、改訂と廃止、未決事項の登録簿への引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従い、本書と成果物で言い直さない。文書の整形・lint はリポジトリの検証で扱い、「測定・検証方法」に含めない。

## 2. 位置づけと用語定義（必要に応じて）

### 2.1. 位置づけ

- `nfr-maintainability`：保守性要求の正本
- `nfr-index`：NFR全体の入口
- `opd-*` / `opr-*`：運用と変更手順
- `sac-*`：受入時の判定基準

### 2.2. 用語定義

| 用語             | 定義                           |
| ---------------- | ------------------------------ |
| MTTR             | 平均復旧時間                   |
| 変更リードタイム | 要求受領から本番反映までの時間 |

## 3. ファイル命名・ID規則

- ルールドキュメントIDは `specdojo:nfr-maintainability-rulebook`。
- 生成対象ドキュメントIDは `nfr-maintainability` を推奨する。
- 要件IDは `nfr-mnt-<連番>` を推奨する。

## 4. 推奨 Frontmatter 項目

許可キー・必須項目・型制約は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] と `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` を正本とする。

- `specdojo.type` は `requirement`、`specdojo.rulebook` は `specdojo:nfr-maintainability-rulebook` とする。
- `specdojo.part_of` は `nfr-index` とする。
- `specdojo.based_on` には、監視・ログ・Runbook の水準の根拠として実際に読んだ作成済み文書の ID を記載する。

## 5. 本文構成（標準テンプレ）

`nfr-maintainability` は以下の見出し構成を **順序固定** で配置する。

| 番号 | 見出し               | 必須 |
| ---- | -------------------- | ---- |
| 1    | 概要（対象・目的）   | ○    |
| 2    | 適用範囲・前提条件   | ○    |
| 3    | 保守性要件一覧       | ○    |
| 4    | 測定・検証方法       | ○    |
| 5    | 関連ドキュメント導線 | ○    |

## 6. 記述ガイド

### 6.1. 概要（対象・目的）

- どの変更・障害対応の効率を担保するかを示す。

### 6.2. 適用範囲・前提条件

- 対象システム、対象運用時間、チーム体制前提を記述する。

### 6.3. 保守性要件一覧

- 表形式（`id` / `内容` / `指標` / `基準` / `備考`）で記述する。
- 指標例：MTTR、変更リードタイム、一次切り分け時間。

### 6.4. 測定・検証方法

- 要件 ID ごとに、測定方法（監視記録、障害レポート、訓練、CI の計測など）・判定タイミング・判定者を示す。

### 6.5. 関連ドキュメント導線

- `opd-*`、`opr-*`、`dec-*` への導線を必ず置く。

## 7. 禁止事項

| 禁止事項                             | 理由                 |
| ------------------------------------ | -------------------- |
| 「保守しやすい」だけで閾値を示さない | 判定不能のため       |
| 体制依存の一時運用を恒久要件化する   | 再現性がないため     |
| 測定データの取得方法を書かない       | 継続評価できないため |

## 8. サンプル

注：以下は形式の輪郭を示す最小例です。生成する `nfr-maintainability` では `## 1...` から始まります。

```yaml
---
specdojo:
  id: nfr-maintainability
  type: requirement
  status: draft
  rulebook: specdojo:nfr-maintainability-rulebook
  part_of: [nfr-index]
---
```

### 8.1. 保守性要件一覧（例）

| id          | 内容                                         | 指標             | 基準         | 備考                         |
| ----------- | -------------------------------------------- | ---------------- | ------------ | ---------------------------- |
| nfr-mnt-001 | P1 障害は基準時間内に一次復旧する            | MTTR             | 60 分以内    | 24/365 対象                  |
| nfr-mnt-002 | 軽微変更は短期間で本番反映する               | 変更リードタイム | 3 営業日以内 | 標準変更のみ                 |
| nfr-mnt-003 | 障害の一次切り分けを基準時間内に完了する     | 一次切り分け時間 | 15 分以内    | Runbook + 監視ダッシュボード |
| nfr-mnt-004 | デプロイのロールバックを基準時間内に完了する | ロールバック時間 | 15 分以内    | トランクベース切り戻し       |

### 8.2. 測定・検証方法（例）

| 要件ID      | 測定方法                                        | 判定タイミング   | 判定者       |
| ----------- | ----------------------------------------------- | ---------------- | ------------ |
| nfr-mnt-001 | インシデント記録から検知〜復旧までの時間を算出  | 障害事後レビュー | SRE / PM     |
| nfr-mnt-002 | PR マージ〜本番デプロイまでのリードタイムを計測 | 月次集計         | テックリード |
| nfr-mnt-003 | 障害レポートの切り分け完了時刻から算出          | 障害事後レビュー | SRE          |
| nfr-mnt-004 | ロールバック訓練で切り戻し時間を計測            | 四半期訓練       | Infra / SRE  |
