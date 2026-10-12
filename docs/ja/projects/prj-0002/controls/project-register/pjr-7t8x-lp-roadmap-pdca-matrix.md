---
specdojo:
  id: prj-0002:pjr-7t8x-lp-roadmap-pdca-matrix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-10-12T04:09:17Z"
  due_on: "2026-10-31"
---

# PJR-7T8X LP に PDCA マトリクスで「これから」の節を加える

## 1. 概要

縦軸を register・schedule・routine + Job、横軸を PDCA とするマトリクスで、今使える範囲（register）とこれから広がる範囲を LP に示す。routine + Job の行は prj-0001 の PJR-MD3C の確定を待たずに「準備中」として載せる

### 1.1. 背景（2026-10-12）

PJR-HEPK のレビューで、kata・waza・ryu・grade・schedule を LP で紹介する案を検討した。いずれもまだ実機として使える状態ではないため、機能の現状を並べず、「今できること」と「これから」を分けて見せることにした。全体概要ガイドの「実践体系で作る、遂行体系で回す」という説明も分かりにくいため、遂行の流れを PDCA のマトリクスで整理する案を採る。

利用者と合意したマトリクスの案は次のとおり。横軸を PDCA、縦軸を回し方の 3 つとし、A 列はいずれも「runner が確定して commit し、次の周回の起点にする」でそろえる。C 列は「誰が確かめるか」の違い（人、grade と review、Job で指名した review agent）として読ませる。

| 回し方        | P（記す・計画する）                                                         | D（形にする）                                                                    | C（評価する）                                            | A（確定して次へ）                                                       |
| ------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| register      | 起票し、完了条件を書く                                                      | `exec run --register` で executor が実行する                                     | reporter が result を書いて review へ進め、人が確かめる  | runner が commit・統合する。close するか、reopen・change-request で直す |
| schedule      | 成果物カタログから Schedule へ展開する                                      | `exec run --track` / `--auto` で実行する                                         | grade（評定）と review                                   | 統合して `ready` へ確定する。直して次の反復へ                           |
| routine + Job | Job に「何を・誰が確かめるか（`task.review`）」を、routine に「いつ」を書く | `routine run --due` が Job Run を作り、worktree で実行して runner が commit する | Job で指名した review agent が review し、verdict を出す | verdict に従って統合し、成功したときだけ checkpoint を進める            |

- routine + Job の行は、prj-0001 の PJR-MD3C が入れた `task.review`（統合前の review と review agent の指名）を前提にする。利用者の判断で、PJR-MD3C の確定を待たず、LP 用の抽象度の文言で「準備中」として載せる（2026-10-12）。
- 「実践体系」「遂行体系」などの用語と標語の変更は prj-0001 の decision で扱う。LP では「体系」という語を使わず、平易な言葉で書く。

### 1.2. 決まったこと（2026-10-12）

- 章立て: 「register の考え方」の中で register の 1 周を「記して（P）→ 形にして（D）→ 磨き続ける（C・A）」として小さく示し、末尾（「次の一歩」の後、フッターの前）の「これから」で 3 行のマトリクスを示す。
- 表示: 「いま使える」と「準備中」の 2 つだけにする。時期の目安を書かない。準備中の行にはガイドへのリンクを置かない。「体系」や Kata・Waza・Ryu の語を使わない。
- 見せ方: PC では 3 行 × 4 列のグリッド、スマホでは行ごとのカードにする。

LP 用に短くした文言は次のとおり。

| 回し方                  | P 記して                           | D 形にして                   | C 磨き続ける（評価）   | A 磨き続ける（確定・改善）                 |
| ----------------------- | ---------------------------------- | ---------------------------- | ---------------------- | ------------------------------------------ |
| register（いま使える）  | 気づいたことを起票する             | AI が実行する                | 人が確かめる           | 完了として残す。必要なら直す               |
| schedule（準備中）      | 作る成果物を計画に並べる           | 順に実行する                 | 品質を評価し、確かめる | 確定して次の反復へ                         |
| routine + Job（準備中） | 何を・いつ・誰が確かめるかを決める | 決まった時刻に自動で実行する | 指名した AI が確かめる | 合格したものだけ取り込み、続きから再開する |

## 2. 完了条件

- `specdojo-lp:src/pages/index.astro` の「register の考え方」の中に、register の 1 周を「記して（P）→ 形にして（D）→ 磨き続ける（C・A）」として小さく示している。
- 「次の一歩」の後、フッターの前に「これから」の節があり、3 行 × 4 列のマトリクスを本個票の LP 用の文言で示している。
  - register の行は「いま使える」、schedule と routine + Job の行は「準備中」と表示する。
  - 時期の目安を書かない。
  - 準備中の行にはガイドへのリンクを置かない。
- 「体系」や Kata・Waza・Ryu の語を使わない。
- マトリクスは PC ではグリッド、スマホでは行ごとのカードとして表示する。色・文字・角丸・影は PJR-CM5W で定義したテーマの class だけを使う。
- PJR-KH17 で加えた使い分けの節など、既存の節を壊さない。
- `specdojo-lp` で `npm run build` が成功する。agent の sandbox では npm を実行できないため、executor は evidence の `validations` でこの検証を `requires_human` と記録し、ビルドは orchestrator が sandbox の外で確認する。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行しない（evidence にも記録しない）。

## 3. 作業内容

| No  | 作業                                                  | 担当         | 状態 | メモ                   |
| --- | ----------------------------------------------------- | ------------ | ---- | ---------------------- |
| 1   | 1 周の図と「これから」の節を `index.astro` に反映する | BA           | open | -                      |
| 2   | ビルドを確認する                                      | orchestrator | open | sandbox の外で確認する |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hepk-lp-content]]: LP の構成と原稿。本項目はそのレビューから分けた。
- [[prj-0001:pjr-md3c-job-review-agent]]: Job の `task.review`。routine + Job の行の前提。
- [[specdojo:routine-operation-guide]]: routine と Job の役割。
- [[specdojo:job-definition-standard]]: Job の責務の範囲と agent の指名。
