---
specdojo:
  id: prj-0001:pjr-bzsn-agent-skills-policy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-10-28T11:17:11Z"
  derived_from:
    - PJR-JSWE
---

# PJR-BZSN agent skills の扱いを見直す（SpecDojo の skill の配布と外部の skill の利用）

## 1. 背景

plan・result・git を契約とし Kata を知識の正本とする中心は保ったまま、SpecDojo が配る skill の範囲と生成の仕組み、外部の skill を使う条件（一覧・記録・版の固定）、既存の 3 件の skill の扱いを決める

- [[prj-0001:pjr-jswe-agent-workflow-plan-vs-skills]] は、agent 固有の機能に頼らない方針を正しいとし、skill にしてよいのは SSOT から生成する薄い入口だけと結論した。理由は提供者中立、監査と再現、観測した失敗が skill 不足によらないことである。同じ分析は、skill の「必要なときだけ読み込む」利点（長い plan で小型モデルが指示を取りこぼす問題の緩和）も認めている。
- skill は複数の agent が読む共通の形式（`SKILL.md`、`.agents/skills`）へ広がっており、提供者中立の懸念は弱まっている。本リポジトリにも `.agents/skills` と `.claude/skills` に 3 件（`reverse-rulebook`・`upsert-rulebook`・`upsert-sample`）がある。
- 利用者は、配布されている skill を活用し、SpecDojo 自体も skill を用意する方向を検討したい。

## 2. 検討した選択肢

### 2.1. 共通の原則（推奨）

- plan だけで作業が成り立つ状態を保ち、skill は精度と速さを上げる補助と位置づける。skill がない agent でも同じ plan で同じ結果に近づけることが、executor を差し替えられる前提を守る。
- Kata（rulebook・recipe・sample・template）の中身は skill に写さない。grade・レビュー・版管理の外へ知識を出さないためである。

### 2.2. SpecDojo が skill を用意する

| 選択肢 | 内容                                                                                                               | 利点                                                           | 懸念                                       |
| ------ | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------ |
| A      | 用意しない（現状どおり）                                                                                           | 保守が増えない                                                 | onboarding の入口が agent の定義に限られる |
| B      | CLI の入口の skill（`npx specdojo` の使い方）と、オーケストレーターの指示の skill を配る。本文は SSOT から生成する | SpecDojo の agent の定義がない利用者も、必要なときに読み込める | 生成と配布の仕組みが要る                   |

推奨は B である。skill からは Kata の中身を写さず `npx specdojo kata show` を呼ばせ、オーケストレーターのラッパーと同じく SSOT から生成してずれを防ぐ。

### 2.3. 配布されている skill を活用する

| 選択肢 | 内容           | 利点                                                              | 懸念                                   |
| ------ | -------------- | ----------------------------------------------------------------- | -------------------------------------- |
| A      | 使わない       | 再現と安全の懸念がない                                            | 外部の道具の知識を自前で持つことになる |
| B      | 条件付きで使う | Cloudflare・Next.js・セキュリティなど外部の道具の知識を借りられる | 条件の運用が要る                       |

推奨は B で、条件は次のとおりである。

- 安全: skill は script を含みうるため、出どころを確かめ、使ってよい skill の一覧を exec-defaults などで持つ。
- 再現: 使った skill と版を plan と evidence に記録する。
- 版の固定: 全体へ入れず、リポジトリに取り込んで git で管理する。

[[prj-0001:pjr-rtd5-starter-templates]]（用途別のひな型）の追加の設定で特に効く。

### 2.4. 既存の 3 件の skill

- `reverse-rulebook`・`upsert-rulebook`・`upsert-sample` を、2.2. の生成の仕組みにそろえるか、Kata の中身を含む部分を `kata show` の参照に置き換えるかを決める。

## 3. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 4. 採択理由

- _TODO_: 判断根拠を記載する。

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

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
