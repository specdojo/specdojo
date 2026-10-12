---
specdojo:
  id: prj-0002:pjr-kh17-lp-tool-fit-guide
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: BA
  registered_at: "2026-10-12T04:53:43Z"
  due_on: "2026-10-31"
---

# PJR-KH17 LP に「何に困ったら何を使うか」の使い分けを加える

## 1. 概要

GitHub Issues・agent の plan・Spec Kit・Kiro・OpenSpec・Beads / Gas Town と SpecDojo を、優劣ではなく困りごとから選べる形で LP に示す。GitHub Issues とは補完関係とし、issue を agent に渡せる具体的な todo へ落とすときに register を使う流れを示す

### 1.1. 背景（2026-10-12）

PJR-HEPK のレビューで、利用者から他のツールとの比較を LP に入れたいとの要望があった。目的は優劣の比較ではなく、何に困ったときに SpecDojo を使い、いつ他のツールが向くかを分かりやすく説明することである。比較の根拠は prj-0001 の次の項目にある。

- [[prj-0001:pjr-36qg-competitive-landscape-and-release]]: Spec Kit・Kiro・OpenSpec・beads・Gas Town、Claude Code / Codex の plan 機能との比較、チームでの利用。
- [[prj-0001:pjr-e8tt-initial-release-positioning]]: exec 層は機能比較に持ち込まず、Gas Town と並べた機能表を作らない。
- [[prj-0001:pjr-nyzr-adoption-strategy]]: register を仕様の判断台帳として入口にする。

### 1.2. 使い分けの表

利用者と合意した表。LP の文言はこの表に従う。

| こんなときは                                               | 向いているもの                                                                       | SpecDojo との関係                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| チームで課題を議論し、通知で共有したい                     | GitHub Issues                                                                        | 補完。issue を、agent に渡せる完了条件つきの todo へ落とすところで register を使う |
| 目の前のタスクの段取りを AI と決めたい                     | agent の plan（Claude Code・Codex の plan mode）                                     | 補完。plan は段取り、register は「何をなぜ決めたか」を長く残す                     |
| 1 つの機能を仕様から実装まで素早く作りたい                 | Spec Kit（新規開発）、OpenSpec（既存コードへの変更）、Kiro（IDE の中で承認しながら） | 工程が違う。SpecDojo はその上流で、プロダクトの要求・仕様を決めて保つ              |
| 多数の AI agent に作業を配り、並行して大量に回したい       | Beads / Gas Town                                                                     | 規模と依存関係の管理はあちらが強い。register は判断を残す側                        |
| 迷い・判断・保留・リスクを、理由ごと残してあとでたどりたい | SpecDojo の register                                                                 | いま使える                                                                         |
| 決めたことを要求・要件・仕様の文書に反映し、保ち続けたい   | SpecDojo（型と品質評価）                                                             | 準備中。PJR-7T8X の「これから」とつながる                                          |

### 1.3. GitHub Issues との補完関係

- issue が向くこと: チームでの議論、通知、開発者以外からの報告。
- issue が苦手なこと: チームに公開・通知されるため、未整理の迷いや小さな判断は書きにくい。完了条件がないため、そのままでは agent への指示になりにくい。
- register の役割: issue を、完了条件のある具体的な todo に落とす。完了条件が exec plan の入力になるため、そのまま agent に渡せる。決めたことは decision として理由ごと残る。
- GitHub との自動連携（prj-0001 の PJR-5W8C）は未実装のため、LP では約束しない。issue の URL を個票に書いてつなぐ程度にとどめる。

## 2. 完了条件

- `specdojo-lp:src/pages/index.astro` の「register の考え方」の直後、「5 つの手順で始める」の前に、使い分けの節がある。
- 節には、困りごと 6 行の表（こんなときは / 向いているもの / SpecDojo との関係）がある。文言は本個票の使い分けの表に従う。
  - 優劣や点数をつけない。
  - exec 層の機能比較を含めない（prj-0001 の PJR-E8TT）。
- GitHub Issues との補完関係を、本個票の補完関係の節に従って短く示す。issue を完了条件つきの todo に落として agent に渡す流れを含め、GitHub との自動連携は約束せず「issue の URL を個票に書いてつなぐ」と書く。
- 「2026 年 10 月時点の各ツールの公開情報による」と添え、次の出典リンクを載せる。
  - <https://docs.github.com/en/issues>
  - <https://code.claude.com/docs/en/common-workflows>
  - <https://developers.openai.com/cookbook/articles/codex_exec_plans>
  - <https://github.com/github/spec-kit>
  - <https://github.com/Fission-AI/OpenSpec>
  - <https://kiro.dev/>
  - <https://github.com/gastownhall/beads>
  - <https://github.com/gastownhall/gastown>
- 「SpecDojo（型と品質評価）」の行は「準備中」と表示し、ガイドへのリンクを置かない。
- 表はスマホでは行ごとのカードとして表示する。色・文字・角丸・影は PJR-CM5W で定義したテーマの class だけを使う。
- 「体系」や Kata・Waza・Ryu の語を使わない。
- `specdojo-lp` で `npm run build` が成功する。agent の sandbox では npm を実行できないため、executor は evidence の `validations` でこの検証を `requires_human` と記録し、ビルドは orchestrator が sandbox の外で確認する。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行しない（evidence にも記録しない）。

## 3. 作業内容

| No  | 作業                                               | 担当         | 状態 | メモ                   |
| --- | -------------------------------------------------- | ------------ | ---- | ---------------------- |
| 1   | 使い分けの節の原稿を書き、`index.astro` に反映する | BA           | open | -                      |
| 2   | ビルドを確認する                                   | orchestrator | open | sandbox の外で確認する |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hepk-lp-content]]: LP の構成と原稿。本項目はそのレビューから分けた。
- [[prj-0002:pjr-7t8x-lp-roadmap-pdca-matrix]]: 「これから」の節。準備中の行がつながる。
- [[prj-0001:pjr-36qg-competitive-landscape-and-release]]: 比較の根拠。
- [[prj-0001:pjr-e8tt-initial-release-positioning]]: 機能比較に持ち込まない範囲。
- [[prj-0001:pjr-nyzr-adoption-strategy]]: 位置づけと入口。
- [[prj-0001:pjr-5w8c-register-github-integration]]: GitHub との連携（未実装）。
