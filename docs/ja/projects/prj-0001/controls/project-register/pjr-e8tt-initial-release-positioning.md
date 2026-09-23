---
specdojo:
  id: prj-0001:pjr-e8tt-initial-release-positioning
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-23T21:51:01Z"
  due_on: "2026-10-10"
---

# PJR-E8TT 初期リリースの差別化軸を定める

## 1. 背景

Gas Town / Gas City の調査を踏まえ、初期リリースで前面に出すものを決める。exec 層は実行基盤として規模で先行されているため機能比較に持ち込まない。register は task tracker ではなく、判断・観測・保留を含めて記録する場である点を差別化として扱う。orchestrator の規律、成果物 kata の網羅範囲と合わせて位置づけを定める。devcontainer と tmux の扱いも併せて決める。

## 2. 検討した選択肢

[[prj-0001:pjr-36qg-competitive-landscape-and-release]] の `Gas Town / Gas City`（2026-09-24 追加）で、実行基盤の競合を見落としていたことが分かった。差別化の候補を評価し直す。

| 候補                    | 評価         | 根拠                                                                                                           |
| ----------------------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| 成果物 kata の網羅範囲  | 強い         | 競合は機能単位の 3〜4 文書。SpecDojo は C4 各層、データモデル 5 種、テスト 4 層、トレーサビリティを含む 106 種 |
| register の記録範囲     | 強い         | 後述                                                                                                           |
| 対話型 orchestrator     | 強い         | 後述                                                                                                           |
| 品質の継続評価（grade） | 中           | 長期運用の文書体系に効くが、効果が見えるまで時間がかかる                                                       |
| 実行の記帳（exec 層）   | **弱い**     | Gas City が同じ問題を解き、規模で先行。tmux は既定 runtime provider                                            |
| devcontainer            | 中           | 価値はあるが配布形態とサポート範囲の設計が要る                                                                 |
| tmux                    | **採らない** | Gas City の既定 runtime provider であり、後発の追随になる                                                      |

### 2.1. register の記録範囲

beads と Gas Town は work の外部化に特化する。beads の目的は「50 First Dates」、すなわち agent がセッションをまたいで作業を覚えていない問題を、課題グラフで埋めることである。扱うのは**これからやること**である。

register は work に限らない。7 つの type のうち `decision` / `question` / `note` / `risk` / `change-request` は作業ではなく、**判断・保留・観測・リスク・変更要求**である。気づいた時点でその場に記録でき、後から辿れる。

prj-0001 の実測（2026-09-24、388 項目）は次のとおりである。

| type             | 件数 |
| ---------------- | ---- |
| `todo`           | 341  |
| `issue`          | 22   |
| `decision`       | 16   |
| `note`           | 5    |
| `question`       | 2    |
| `change-request` | 1    |

作業でない項目が 46 件（約 12%）ある。task tracker にはこれらの置き場が無く、記録されないか、散逸した Markdown へ書かれて失われる。

さらに register からは PM の統制文書が生成される。

```text
controls/generated/pm-decision-log.md
controls/generated/pm-issue-log.md
controls/generated/pm-risk-register.md
controls/generated/pm-change-request-log.md
```

同じ記録が、実行の入口であると同時に統制文書にもなる。`decision` は選択肢の比較・採択理由・承認を持ち、ADR に相当する。

本セッション（2026-09-23〜24）の実例では、npm の staged publishing へ戻すかの保留（`question`）、CLI 入口の短縮方法の保留（`question`）、競合状況の観測（`note`）を起票した。いずれも作業ではなく、task tracker では行き場がない。

### 2.2. 対話型 orchestrator

競合の agent 統合は、slash command やプロンプトを配る形である（Spec Kit は 38 統合）。Kiro は IDE そのもの。Gas City は人と会話する司令塔ではなく、多数の自律 agent を回す SDK である。

SpecDojo の orchestrator が異なるのは、**何を勝手にやらせないかが成文化されている**点である。

- 提案 → 承認 → 実行の順序
- `git push` と破壊的操作の禁止
- commit 先を変更の種類で決める 3 層（[[prj-0001:pjr-ewwx-feature-branch-policy]]）
- 保護設定による agent の書き込み境界

2026-09-24 時点で `config scaffold --provider` により 4 provider へ配布できる。

## 3. 決定内容

_UNDECIDED_: 次の案を提案する。

初期リリースで前面に出すのは **register の記録範囲**、**対話型 orchestrator**、**成果物 kata の網羅範囲**の 3 つとする。

| 主張                         | 内容                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------- |
| 気づいたことをその場に残せる | 作業も判断も保留も観測も、同じ登録簿へ Markdown で記録する。統制文書が生成される |
| 会話で進められる             | orchestrator を配置して話しかければよい。承認の規律が定義されている              |
| 成果物の型が揃っている       | 必要な成果物だけをカタログで選び、型に沿って作れる                               |

exec 層は機能比較に持ち込まない。「成果物体系を維持するための実行手段」として説明し、Gas City と並べた機能表を作らない。

tmux は採らない。devcontainer は初期リリースに含めず、`routine` の自動実行を要する段階で別途扱う。

## 4. 採択理由

_UNDECIDED_: 決定内容の確定後に記載する。検討時点での根拠は次のとおり。

- 実行基盤で競うと規模と成熟度で勝てない。Gas Town 18,167 star、beads 27,391 star に対し SpecDojo は実質未公開である。同じ土俵へ上がらない判断は、beads に対する register の判定（単独製品として売り込まない）と同じ論理である。
- register の記録範囲は、競合が構造的に持たないものである。beads は「plans/ の食べかけの markdown の山を置き換える」と明示しており、Markdown を正本としない。判断や観測を人が読める形で残す思想とは前提が異なる。
- orchestrator と register は 2026-09-23〜24 の作業で**既に成立している**。npm 導入から会話による起票・実行まで、空ディレクトリで実測済みである（[[prj-0001:pjr-49jk-readme-orchestrator-onboarding]]）。未完成のものを差別化として掲げると、試した利用者の期待を裏切る。
- 成果物 kata の網羅範囲は PJR-36QG が一貫して挙げてきた軸であり、変更する理由がない。ただし品質は要修正 58% であり、網羅範囲と品質は分けて説明する必要がある。
- devcontainer を外すのは、現行の `.devcontainer/` が本リポジトリ専用（ollama、agy、claude、codex、6 個のボリューム、cron）で、配布には設計作業を要するためである。価値を否定するものではない。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                            |
| ---------- | ------------------------------------------------------------------------------- |
| 影響範囲   | README、ドキュメントサイトの入口、npm のパッケージ説明、公開時の告知            |
| 必要な対応 | 決定後に README とドキュメントサイトの表現を揃える。devcontainer の配布は別項目 |
| 追跡先     | 本項目および派生する todo                                                       |

## 7. 関連ドキュメント

- [[prj-0001:pjr-36qg-competitive-landscape-and-release]]
- [[prj-0001:pjr-7vkr-npm-release]]
- [[prj-0001:pjr-49jk-readme-orchestrator-onboarding]]
- [[prj-0001:pjr-2w38-sample-quality-observation]]
