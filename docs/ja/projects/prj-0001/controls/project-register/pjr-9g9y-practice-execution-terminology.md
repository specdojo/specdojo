---
specdojo:
  id: prj-0001:pjr-9g9y-practice-execution-terminology
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: PM
  registered_at: "2026-10-12T04:10:12Z"
---

# PJR-9G9Y 体系の用語と標語を見直す

## 1. 背景

成果物体系・実践体系・遂行体系と Kata・Waza・Ryu の名前が重なって分かりにくい。標語を「記して、形にして、磨き続ける。」へ改め、遂行体系を PDCA × register・schedule・routine + Job のマトリクスで説明する案を検討する。routine + Job の行は PJR-MD3C の task.review を前提にする。Quick Start の「設計書」と workspace/ もあわせて直す

### 1.1. 経緯（2026-10-12）

prj-0002 の LP（PJR-HEPK）のレビューで、利用者から次の指摘があった。

- 標語「決めて、書いて、鍛え続ける。」（[[specdojo:specdojo-overview-guide]] の `SpecDojoとは`）は、todo や issue のように決めることから始まらない項目に合わず、本文の「迷っていることを記帳し」とも順序が合わない。伝えたいことは「いつでもどこからでも気軽に始めて、成長させられる」ことで、利用者は「記して、形にして、磨き続ける。」を提案した。
- 「実践体系で作り、遂行体系で回す」という説明は分かりにくい。遂行体系は、横軸を PDCA、縦軸を register・schedule・routine + Job とするマトリクスで整理すると分かりやすい。
- SpecDojo のプロダクト文書は要求・要件・仕様が中心で、「設計書」という語は紛らわしい。
- 別リポジトリ構成の親ディレクトリは、プロダクトごとに分けられるよう `app1-workspace/` とするのがよい。

LP は PJR-HEPK で、新しい標語・「仕様書」の語・`app1-workspace/` を先に使う。

### 1.2. 用語の重なりと使われ方

- 成果物体系・実践体系・遂行体系（3 つの体系）、Kata・Waza・Ryu（型・技・流）、Waza の呼び名（記帳・実戦・評定・講評）の 3 層がある。実践体系は Kata と、遂行体系は Waza とほぼ重なる。
- 「遂行体系」は [[specdojo:specdojo-overview-guide]] の 3 か所だけで使われる。
- 「実践体系」は `docs/ja/specdojo` 配下の 13 ファイルで使われ、[[specdojo:practice-system-composition-guide]] の題名にもなっている。id は変えない運用のため、変える場合は題名と本文の語を変える。
- 「設計書」と `workspace/` は [[specdojo:quick-start-guide]] の `決めたことを設計書に書く` などと、[[specdojo:directory-layout-reference]] の `既定のリポジトリ構成` にある。

### 1.3. PDCA マトリクスの案

LP 側（prj-0002 の PJR-7T8X）で利用者と合意した案。A 列はいずれも「runner が確定して commit し、次の周回の起点にする」でそろい、C 列は「誰が確かめるか」の違いとして読める。

| 回し方        | P（記す・計画する）                                                         | D（形にする）                                                                    | C（評価する）                                            | A（確定して次へ）                                                       |
| ------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| register      | 起票し、完了条件を書く                                                      | `exec run --register` で executor が実行する                                     | reporter が result を書いて review へ進め、人が確かめる  | runner が commit・統合する。close するか、reopen・change-request で直す |
| schedule      | 成果物カタログから Schedule へ展開する                                      | `exec run --track` / `--auto` で実行する                                         | grade（評定）と review                                   | 統合して `ready` へ確定する。直して次の反復へ                           |
| routine + Job | Job に「何を・誰が確かめるか（`task.review`）」を、routine に「いつ」を書く | `routine run --due` が Job Run を作り、worktree で実行して runner が commit する | Job で指名した review agent が review し、verdict を出す | verdict に従って統合し、成功したときだけ checkpoint を進める            |

## 2. 検討した選択肢

| 選択肢 | 内容                                                                                 | 利点                                   | 懸念                                          |
| ------ | ------------------------------------------------------------------------------------ | -------------------------------------- | --------------------------------------------- |
| A      | 現状維持（標語・3 つの体系の名前を変えない）                                         | 文書の変更がない                       | LP と文書の標語が食い違う。分かりにくさが残る |
| B      | 標語を改め、遂行体系を PDCA マトリクスで説明する。体系の名前は変えない               | 変更範囲が全体概要ガイドなどに限られる | 3 層の名前の重なりは残る                      |
| C      | B に加え、3 つの体系の名前を平易な語に改める（Kata・Waza・Ryu との重なりを整理する） | 名前の重なりが解消する                 | 「実践体系」を使う 13 ファイルに影響する      |

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

- [[prj-0002:pjr-hepk-lp-content]]: 指摘の元になった LP の原稿。
- [[prj-0002:pjr-7t8x-lp-roadmap-pdca-matrix]]: PDCA マトリクスで「これから」を見せる LP の項目。
- [[prj-0001:pjr-md3c-job-review-agent]]: routine + Job の行の前提（`task.review`）。
- [[specdojo:specdojo-overview-guide]]: 標語と 3 つの体系の説明。
- [[specdojo:practice-system-composition-guide]]: 実践体系の正本。
- [[specdojo:quick-start-guide]]: 「設計書」と `workspace/` の記述。
- [[specdojo:directory-layout-reference]]: `workspace/` の記述。
