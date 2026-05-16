---
id: pm-raci-instruction
type: instruction
status: draft
rulebook: pm-raci-rulebook
---

# RACI 作成指示

## 1. 目的と前提

- 目的: プロジェクトの主要成果物および主要プロセスに対する責任分担を RACI マトリクスとして定義し、作成・レビュー・承認・変更判断の責務境界を明確にする。
- 参照ルール: `../rulebooks/pm-raci-rulebook.md`
- 主な内容: 目的・適用方針・RACI 記号定義・成果物別 RACI・プロセス別 RACI・見直し条件・禁止事項。
- RACI の列には `pm-organization.md` で採用済みの Role code のみを使う。
- Agent は `R`・`C` を担ってよいが、`A` は担わない。

## 2. 入力情報

- `pm-organization.md` に記載されている採用ロール一覧（RACI 列の構成に使用）
- 主要成果物の一覧（成果物名または `id`）
- 主要プロセスの一覧（プロセス別 RACI を作成する場合）
- 各成果物・プロセスに対する R / A / C / I の割り当て案
- `A` の集約方針（原則として 1 行に 1 Role code）

## 3. 出力フォーマット

- 出力形式は Markdown（`pm-raci.md`）。
- Frontmatter には `id` / `type` / `status` / `rulebook` を含める。

```yaml
---
id: <project-id>:pm-raci
type: project
status: draft
rulebook: pm-raci-rulebook
based_on:
  - people-and-organization-definition-standard
  - <project-id>:pm-organization
---
```

- 本文は次の順序で作成する（`プロセス別 RACI` は任意）。

1. 目的
2. 適用方針
3. RACI の定義
4. 成果物別 RACI
5. プロセス別 RACI（任意）
6. 見直し条件
7. 禁止事項

- 「成果物別 RACI」の推奨表構造（列は採用 Role code に合わせる）：

| 成果物 | PO  | BA  | ARC | QE  |
| ------ | --- | --- | --- | --- |
| `<id>` | A/R | C   | I   | C   |

- 「見直し条件」の推奨表構造：

| 更新トリガー | 見直し内容 |
| ------------ | ---------- |

## 4. 記述ルール

- 「目的」で本 RACI の目的と `pm-organization.md` を採用ロールの正とすることを 2〜4 行で明示する。
- 「適用方針」で RACI 列に使う Role code 一覧、`A` の集約先（通常は `PO`）、Agent に `A` を割り当てない旨を記載する。
- 「RACI の定義」は `people-and-organization-definition-standard` への参照で省略可。プロジェクト固有の補足がある場合のみ表を追加する。
- 成果物別 RACI の各行に `A` が 1 つ以上存在することを確認する。同一 Role code が R と A を兼ねる場合は `A/R` と表記する。
- プロセス別 RACI は成果物別 RACI と列構成・Role code を揃える。
- 省略する章（プロセス別 RACI など）には省略理由を 1 行で明記する。

## 5. 禁止事項

- `pm-organization.md` で未採用の Role code を RACI 列に使う。
- member nickname、人名、agent 名を RACI 列に使う。
- Agent に `A` を割り当てる。
- 各行の `A` を省略する。
- 兼務を理由に `A` を複数 Role code に分散させる。
- Schedule の `owner` と矛盾する責任分担を記載する。
- RACI 記号の意味を標準と異なる定義で本文に記載する。

## 6. 最終チェック

- 7 つの必須章（任意の「プロセス別 RACI」を除く）が存在する。
- 成果物別 RACI の全行に `A` が 1 つ以上設定されている。
- RACI 列の Role code が `pm-organization.md` の採用ロールのみで構成されている。
- member nickname・人名・agent 名が RACI 列にない。
- Agent に `A` が割り当てられていない。
- 参照ルールの禁止事項に抵触していない。
- Markdown lint でエラーがない。
