---
specdojo:
  id: prj-0001:pjr-x40m-grade-previous-findings
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-30T02:27:43Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-30T02:55:39Z"
  conclusion: grade plan の生成時に対象文書の既存 specdojo:finding コメントを解析し、rule / severity / message を前回の指摘として plan へ含めるようにした。level、score、verdict、finding ID、解消履歴は引き継がない。plan には前回指摘の解消確認、未解消 finding の再掲、前回指摘にない問題の検出、各 viewpoint の独立評価を明記した。評価結果を最新状態へ上書きする既存方針は維持している。
---

# PJR-X40M grade plan へ前回の finding を引き継ぎ解消を確認させる

## 1. 概要

再評価時に前回の判定結果を完全に上書きしているため、前回どの問題を指摘したかが agent に伝わらない。6 つの agent を比較したところ、同一文書に対する finding 件数は 1 件から 19 件まで分かれた。単独実行では agent ごとに網羅性が大きく異なる。

前回の finding を plan へ含め、解消されているかを確認させたうえで上書きすれば、異なる agent を順に回すことで指摘を積み上げられる。maintenance が修正した後に解消を検証する経路にもなる。

前回の level と score は渡さない。判定への引きずりを招き、前回が誤判定だった場合に固定化されるためである。指摘内容は事実として引き継ぎ、評価は独立して行わせる。

## 2. 完了条件

- 再評価時、対象文書に記録済みの finding が plan へ含まれる。
- plan へ含めるのは finding の rule、severity、message とし、level、score、verdict は含めない。
- 前回の指摘が解消されているかを確認し、未解消なら今回の finding へ含めるよう plan が指示する。
- 前回の指摘にない問題も独立して検出するよう plan が指示する。
- 各観点を独立に評価し、前回の観点割り当てへ引きずられないよう plan が指示する。
- 履歴は蓄積せず、評価結果は従来どおり上書きされる。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                         | 担当 | 状態 | メモ                                 |
| --- | ---------------------------- | ---- | ---- | ------------------------------------ |
| 1   | 引き継ぐ情報の範囲の決定     | ARC  | done | rule、severity、message に限定       |
| 2   | 観点割り当ての独立性への対処 | ARC  | done | 各観点の独立評価を plan へ明記       |
| 3   | plan 生成の実装              | ARC  | done | 既存 finding コメントを読み取り      |
| 4   | 効果の確認                   | ARC  | done | 単独実行との比較実験で効果を確認済み |

### 3.1. 検証実験

最も甘い判定を出した `claude-executor` に対し、`gemma-expert-executor` の finding 4 件を「前回の指摘」として plan へ追記して実行した。level と score は渡していない。対象は `opr-batch-sample.md` である。

| 指標         | 単独 | 前回指摘つき | 参考: gemma 単独 |
| ------------ | ---- | ------------ | ---------------- |
| 平均 level   | 3.75 | 2.75         | 2.88             |
| finding 件数 | 1    | 5            | 4                |

`claude-executor` は単独では finding 1 件、平均 level 3.75 でほぼ問題なしと判定していたが、前回の指摘を渡すと 5 件、平均 2.75 となり、gemma 単独を上回った。引き継いだ 4 件はいずれも未解消と正しく判定し、`blocker` 級の指摘も維持している。

さらに gemma が出していない指摘を 1 件追加した。再実行上限の判断基準が未定義であるという内容で、これは `claude-expert-executor` も単独で指摘していた問題である。前回指摘の確認に埋没せず、独立検出が機能している。

agent を変えて繰り返すことで指摘が積み上がり、精度が向上することを確認した。

### 3.2. 観測された副作用

前回の指摘がない観点で判定が甘くなった。

| viewpoint                           | 単独 | 前回指摘つき |
| ----------------------------------- | ---- | ------------ |
| `vp-arc-cross-document-consistency` | 2(1) | 4(0)         |

単独では Frontmatter の矛盾を指摘して level 2 としていたが、前回指摘つきでは level 4 となった。gemma が同じ問題を `vp-qe-kata-conformance` の観点で指摘していたため、そちらへ寄せたと見られる。実際 `vp-qe-kata-conformance` では level 1 と finding 2 件を出しており、問題自体は捉えている。

同じ問題がどの観点に分類されるかが前回結果に依存する。観点別スコアの安定性に影響するため、plan で各観点を独立に評価するよう明示する必要がある。

### 3.3. 論点の決定

- 前回の finding は本文の `specdojo:finding` コメントから読み取る。Frontmatter の `specdojo.grade` は件数の整合確認に用い、指摘内容の入力にはしない。
- 解消済みと判断された指摘の履歴は記録しない。`grade apply` は従来どおり最新状態を上書きする。
- 世代別の履歴は蓄積しない。未解消として今回の結果へ含まれた finding だけが対象文書に残り、次回 plan へ引き継がれる。

## 4. 対応結果

- grade plan 生成時に、対象文書の既存 `specdojo:finding` コメントを解析し、`rule`、`severity`、`message` を前回の指摘として plan へ含めるようにした。
- plan に、前回指摘の解消確認、未解消 finding の再掲、前回指摘にない問題の検出、各 viewpoint の独立評価を明記した。
- 前回の finding ID、level、score、verdict、解消履歴は引き継がず、評価結果を最新状態へ上書きする既存方針を維持した。
- 前回 finding の引き継ぎ範囲と評価指示を単体テストで確認した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: agent ごとの網羅性の差を示す実測記録。
- [[prj-0001:pjr-49d2-quality-assessment]]: grade の設計。評価結果を冪等に上書きする方針。
- [[prj-0001:pjr-4tz7-grade-per-document]]: plan の生成と保存。
