---
specdojo:
  id: prj-0001:pjr-bzsn-agent-skills-policy
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  registered_at: "2026-10-28T11:17:11Z"
  completed_at: "2026-10-31T06:45:02Z"
  conclusion: plan を契約、Kata を正本とする中心を保ち、skill は補助とする。SpecDojo は SSOT から生成する CLI の入口とオーケストレーターの skill を配る。外部の skill はプロダクトのリポジトリに入れて版を固定し、repos[] での宣言と plan での参照で使い、plan と evidence に記録する。既存の 3 件は生成の仕組みにそろえ Kata の中身は kata show の参照にする
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

### 2.4. 外部の skill をプロダクトのリポジトリに入れて使う案（2026-10-31 の利用者の提案）

外部の skill（Cloudflare・Next.js・Unity など）は、プロダクトごとに必要なものが違う。SpecDojo の記録のリポジトリや利用者の全体の設定ではなく、そのプロダクトのリポジトリ（`repos` で宣言したもの）の `.agents/skills` などに入れ、プロダクトの git で版を固定して使う案である。2.3. の案 B の「版の固定」の置き場所を、プロダクトのリポジトリにする形に当たる。

| 観点              | 評価                                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 選び方            | プロダクトの技術に合わせて選べる。用途別のひな型（PJR-RTD5）の template repository に、その用途で使う skill を同梱すれば、複製した時点で揃う                                                                                   |
| 版の固定と監査    | プロダクトの git の履歴に入るため、いつ何を入れたかを PR で確かめられる                                                                                                                                                        |
| exec での読み込み | exec の agent は記録のリポジトリの worktree（`project/`）で起動し、プロダクトのリポジトリは `--add-dir` などで作業場所に足されるだけである。agent が作業場所の外の skill を自動で読み込むかは agent の種類しだいで、保証がない |
| 対話での利用      | 利用者がプロダクトのリポジトリで直接 agent を起動する場合は、そのまま読み込まれる                                                                                                                                              |

exec で確実に使うには、次のどちらかが要る。

- plan に「このタスクで使える skill」として、プロダクトのリポジトリの skill のパス（例: `app1:.agents/skills/cloudflare/SKILL.md`）と版（commit）を書き、agent に必要なときに読ませる。agent の種類によらず効き、使った skill を plan と evidence に記録できる（2.3. の再現の条件を満たす）。
- runner が worktree の準備のときに、プロダクトのリポジトリの skill を記録のリポジトリの worktree の skill の置き場所へ写す。agent の自動の読み込みに乗るが、agent ごとの置き場所の違いを runner が持つことになる。

推奨は、外部の skill はプロダクトのリポジトリに入れ、使ってよい skill の宣言（`repos[]` の項目など）と plan での参照を組み合わせる形である。SpecDojo の記録のリポジトリには、SpecDojo が配る skill（2.2. の案 B）だけを置く。

### 2.5. 既存の 3 件の skill

- `reverse-rulebook`・`upsert-rulebook`・`upsert-sample` を、2.2. の生成の仕組みにそろえるか、Kata の中身を含む部分を `kata show` の参照に置き換えるかを決める。

## 3. 決定内容

各選択肢の推奨を採る。

- 共通の原則（2.1.）: plan だけで作業が成り立つ状態を保ち、skill は精度と速さを上げる補助とする。Kata（rulebook・recipe・sample・template）の中身は skill に写さない。
- SpecDojo が用意する skill（2.2.）: 案 B。CLI の入口の skill と、オーケストレーターの指示の skill を配る。本文は SSOT から生成し、Kata の中身は `npx specdojo kata show` で読ませる。
- 外部の skill（2.3.・2.4.）: 条件付きで使う。外部の skill はプロダクトのリポジトリ（`repos` で宣言したもの）に入れ、プロダクトの git で版を固定する。使ってよい skill を `repos[]` などで宣言し、plan に「このタスクで使える skill」としてパスと版を書いて agent に必要なときに読ませ、使った skill を plan と evidence に記録する。用途別のひな型（PJR-RTD5）には、その用途で使う skill を同梱できるようにする。
- 置き場所: SpecDojo の記録のリポジトリには、SpecDojo が配る skill だけを置く。
- 既存の 3 件の skill（2.5.）: `reverse-rulebook`・`upsert-rulebook`・`upsert-sample` を 2.2. の生成の仕組みにそろえ、Kata の中身を含む部分は `kata show` の参照に置き換える。

## 4. 採択理由

- plan を契約とし Kata を知識の正本とする中心を保てば、skill がない agent でも同じ plan で同じ結果に近づけられ、executor を差し替えられる（PJR-JSWE の結論）。
- skill は複数の agent が読む共通の形式に広がっており、SSOT から生成する薄い入口なら、提供者中立を損なわずに「必要なときだけ読み込む」利点を得られる。
- 外部の skill はプロダクトごとに必要なものが違うため、プロダクトのリポジトリに置くと選び方と版の固定が自然になる。exec の agent は記録のリポジトリの worktree で起動し、プロダクトのリポジトリの skill を自動で読み込む保証がないため、plan での参照と宣言で agent の種類によらず効かせ、使った skill を記録に残す。
- 既存の 3 件を生成の仕組みにそろえると、Kata との二重管理とずれを防げる。

## 5. 承認

| 項目     | 内容                                                                                  |
| -------- | ------------------------------------------------------------------------------------- |
| 決定者   | indie                                                                                 |
| 決定日   | 2026-10-31                                                                            |
| 承認方式 | commit                                                                                |
| 証跡     | 2026-10-31 の対話で indie が推奨での決定を指示し、本個票の close の commit で記録した |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | skill の生成と配布の仕組み（`.agents/skills` と各 agent のラッパー）、`repos[]` の設定、exec の plan と evidence、既存の 3 件の skill、PJR-RTD5 のひな型 |
| 必要な対応 | SpecDojo の skill の生成と配布、外部の skill の宣言と plan・evidence への記録、既存の 3 件の skill の移行を、todo に分けて起票する                       |
| 追跡先     | 起票する todo（未起票）                                                                                                                                  |

## 7. 関連ドキュメント

- [[prj-0001:pjr-jswe-agent-workflow-plan-vs-skills]]
- [[prj-0001:pjr-rtd5-starter-templates]]
