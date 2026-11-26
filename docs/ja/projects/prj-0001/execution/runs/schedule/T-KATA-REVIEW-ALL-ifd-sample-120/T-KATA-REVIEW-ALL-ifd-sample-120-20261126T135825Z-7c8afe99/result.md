---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifd-sample-120-20261126t135825z-7c8afe99
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifd-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifd-sample-120/T-KATA-REVIEW-ALL-ifd-sample-120-20261126T135825Z-7c8afe99/plan.md
  started_at: "2026-11-26T14:02:06.469Z"
  completed_at: "2026-11-26T14:10:47.135Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:ifd-sample
    - specdojo:ifd-sample
---

# Edit Result

## 1. 実施内容

- ifd-sample の R2（構成）レビューを行った。章の順・粒度・表と本文の配置は rulebook の本文構成と template に沿っており、章の移動・分割・統合は不要だった。
- 構成上の差分は 2 件。ロール対応の文を概要の第 1 段落へ移し、端末へ結果が届かない場合の扱いを「技術前提・制約」へ移した。
- template の概要にある改訂時の追従先の欄が sample にない点は、要判断として指摘だけ残し、sample には足していない。
- executor の検査では prettier と markdownlint-cli2 が成功した。runner の検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が成功した。その他の検査は変更種別により非適用だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 1. 概要 / ロール対応の文 | ロール対応の文（技術メンター＝ARC など）が、ロール名を出す第 1 段落ではなく、上位方針と対象外を述べる第 2 段落にあり、前提から結論への流れが途切れている。 | ロール対応の文を第 1 段落の末尾へ移し、第 2 段落から消した。 | `vp-arc-document-structure` | - |
| R2-2 | R2 | 4. 通信経路と情報の境界 → 5.1. 技術前提・制約 | 表の後の「端末へ結果が届かない場合は未保存と断定しない…」は経路の定義ではなく障害時の扱いの制約である。rulebook の本文要件では「技術前提・制約と検証観点」が持つ内容である。 | この段落を「技術前提・制約」の箇条へ移した。「検証対象」の `PATH-02` の行と同じ章にまとまる。 | `vp-arc-document-structure`、`ifd-mermaid-rulebook` の「本文要件」 | - |
| R2-3 | R2 | 1. 概要 | template の概要には「改訂・廃止で境界や経路が変わる場合の追従先（ARC・QE・OPS・PO）と影響」の欄があるが、sample にない。 | - | `vp-qe-omissions-consistency`。rulebook の概要の条件（対象環境、判断すること、上位入力、対象外）は満たしている。追従先の運用は文書メタ情報標準が持つため、sample には足していない。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifd-sample.md`: 概要のロール対応の文（技術メンター＝ARC など）を第 2 段落から第 1 段落の末尾へ移した。「通信経路と情報の境界」の表の後にあった、端末へ結果が届かない場合は未保存と断定しないという段落を「技術前提・制約」の箇条へ移した。差分は 3 行追加・4 行削除。

## 3. 申し送り

- R2-3 は要判断として残した。選ばなかった案は sample の概要に追従先の 1 文を足すこと。相手側を直す案は、`specdojo:ifd-template` の概要の 2 つめの `_TODO_` を消すか、rulebook の概要の条件に足して template とそろえること。rulebook など sample 以外は本タスクでは変更していない。
- R2-1: R2 / 1. 概要 / ロール対応の文（技術メンター＝ARC など）が、ロール名を出す第 1 段落ではなく、上位方針と対象外を述べる第 2 段落にあり、前提から結論への流れが途切れている / ロール対応の文を第 1 段落の末尾へ移し、第 2 段落から消した / `vp-arc-document-structure` / -
- R2-2: R2 / 4. 通信経路と情報の境界 → 5.1. 技術前提・制約 / 表の後の「端末へ結果が届かない場合は未保存と断定しない…」は経路の定義ではなく、障害時の扱いの制約で、rulebook の本文要件では「技術前提・制約と検証観点」が持つ内容である / この段落を「技術前提・制約」の箇条へ移した（「検証対象」の `PATH-02` の行と同じ章にまとまる） / `vp-arc-document-structure`、`ifd-mermaid-rulebook` の「本文要件」 / -
- R2-3: R2 / 1. 概要 / template の概要には「改訂・廃止で境界や経路が変わる場合の追従先（ARC・QE・OPS・PO）と影響」の欄があるが、sample にない / - / `vp-qe-omissions-consistency`。rulebook の概要の条件（対象環境、判断すること、上位入力、対象外）は満たしており、追従先の運用は文書メタ情報標準が持つため、sample には足さなかった。選ばなかった案は sample の概要に 1 文足すこと。相手側を直す案: `specdojo:ifd-template` の概要の 2 つめの `_TODO_` を消すか、rulebook の概要の条件に足してそろえる / 要判断
- 適用外の検証: `npm run validate:history-links`（plan・result・個票などの履歴ファイルを変更しておらず、変更したのは sample だけ）
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown の sample だけで、`*.yaml` / `*.yml` の変更はない）

## 4. 進め方と実践の型の適用

sample-maintenance の R2（構成）として、kata-guide の観点に従い、R1 が直した版を読んで章の順・粒度・表と本文の配置を rulebook の本文構成と template に照らした。plan に展開された grade と condense の finding はなかった。構造・必須項目は rulebook を正とし、sample の移動だけで解消できる指摘は sample に反映した。rulebook と template 側の整合の判断が要る指摘は、変更せず要判断として残した。
