---
specdojo:
  id: prj-0001:pjr-zyfz-single-responsibility-viewpoint
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-29T14:52:37Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-29T23:18:29Z"
  conclusion: 共通正本へ vp-arc-single-responsibility を追加し、ARC の role_viewpoint_sets へ組み込んだ。分量や対応する実践の型の数だけでは不備とせず、複数主題の案内自体を責務とする index・catalog・overview は分割対象から除外する。同一主張の反復は vp-arc-conciseness で扱い、本観点とは境界を分ける。分割が必要と判定された場合は人が確認して PJR 起票を判断する運用とし、判断手順をレビューガイドへ記載した。opr-rulebook を level 2 / major と判定できることを確認した。
---

# PJR-ZYFZ 文書責務の単一性を見る viewpoint を追加する

## 1. 概要

1つの文書が複数の独立した主題を同居させている状態を検出する観点が、既存の viewpoint に存在しない。

`opr-rulebook.md` は 6 章に障害対応、アラート対応、バックアップとリストア、バッチ再実行、運用変更作業、アカウント付与と剥奪、問い合わせ一次対応など 9 種類の運用手順を並べている。対応する sample も `opr-incident-sample` から `opr-access-control-sample` まで 9 件存在する。483 行という分量と、対応する `opr-batch-sample.md`（22 行）との乖離は、この構造に起因する。

障害対応とアカウント付与は、対象読者も実施タイミングも異なる別の運用である。1つの規範文書へ収める必然性がない。

`vp-arc-single-responsibility` を追加し、分割の要否を判定できるようにする。

## 2. 完了条件

- 文書責務の単一性を見る viewpoint が共通正本へ追加されている。
- 判定基準が category 単位のルーブリックと整合し、level 0-4 で判定できる。
- 既存の `vp-arc-conciseness` との判定範囲の違いが定義されている。
- `opr-rulebook.md` を評価したとき、複数主題の同居を検出できる。
- 分割が必要と判定された場合の対処方法が決まっている。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                         | 担当 | 状態 | メモ                                       |
| --- | ---------------------------- | ---- | ---- | ------------------------------------------ |
| 1   | viewpoint の定義             | ARC  | done | check、evidence、severity、評価属性を定義  |
| 2   | ルーブリックの定義           | ARC  | done | 共通 rubric の level 0-4 で判定            |
| 3   | 既存観点との境界の明確化     | ARC  | done | conciseness との違いを review guide へ記載 |
| 4   | 分割が必要な場合の対処の決定 | ARC  | done | 人が確認し PJR 起票を判断する運用に決定    |
| 5   | 共通正本への追加             | ARC  | done | defaults/pm-review-viewpoints.yaml へ追加  |
| 6   | 判定の確認                   | ARC  | done | opr-rulebook を level 2 / major と判定可能 |

### 3.1. 既存観点との違い

| 観点                          | 判定内容                           | 本項目との関係                               |
| ----------------------------- | ---------------------------------- | -------------------------------------------- |
| `vp-arc-conciseness`          | 同一主張の反復、規範を含まない散文 | 反復ではなく主題の多さを見る点で異なる       |
| `vp-qe-omissions-consistency` | 必須要素の抜け漏れ、矛盾           | 欠落ではなく過剰を見る点で異なる             |
| `vp-arc-document-structure`   | Frontmatter、ID、ファイル名、配置  | 構造の形式ではなく責務の範囲を見る点で異なる |

冗長性は「同じことを繰り返している」状態、責務の単一性は「異なることを1つに詰め込んでいる」状態である。前者は削れば解決するが、後者は分割しなければ解決しない。対処が異なるため観点を分ける。

### 3.2. 判定材料

- 章立ての独立性。各章が独立して参照・更新される単位になっているか。
- 対応する実践の型の数。1つの rulebook に対して sample が多数存在する場合、主題が分かれている兆候となる。この情報は plan の参考資料から機械的に得られる。
- 対象読者と実施タイミングの違い。
- 分量。分量そのものは判定基準ではないが、他の兆候と重なる場合は補強材料となる。

### 3.3. 分割が必要と判定された場合の問題

finding が「分割せよ」となった場合、既存の `<kind>-maintenance` approach の範囲を超える。maintenance は1つの実践の型を見直す作業であり、次の作業を想定していない。

- 新規ファイルの作成と ID の採番
- 成果物カタログへの登録
- 分割元を参照している文書の更新
- 対応する sample / recipe / template の再割り当て

人が finding を確認し、分割の採否と PJR 起票を判断する運用とする。grade は評価のみを行い、ファイル作成や ID 採番は行わない。起票後は、新規ファイル、成果物カタログ、参照元、対応する sample / recipe / template の変更を通常の edit task として扱う。分割専用 approach は、反復実績がなく必要性を判断できないため現時点では設けない。

### 3.4. 論点への決定

- grade は独立する主題と境界候補を finding に示す。最終的なファイル分割単位は人が決める。
- sample 数や行数に固定閾値を設けない。章の独立性、読者、利用時点、対応する実践の型を組み合わせて判断する。
- index、catalog、overview のように複数主題の案内自体を責務とする文書は分割対象から除外する。ただし、案内を越えて各主題の詳細まで抱える場合は対象とする。

## 4. 対応結果

- 共通正本へ `vp-arc-single-responsibility` を追加し、ARC の `role_viewpoint_sets` に組み込んだ。category は `architecture`、既定 severity は `major`、評価層は `agent`、継続評価対象とした。
- 共通の `grade_rubric` を継承し、level 4 は単一責務、level 3 は minor のみ、level 2 は分割候補となる major が1件、level 1 は複数の major または中心責務がほぼ定まらない状態、level 0 は blocker により文書として機能しない状態として判定する。
- [[specdojo:review-guide|レビューガイド]] に `vp-arc-conciseness` との境界、集約文書の除外、分割 finding の扱いと PJR 起票の判断手順を記載した。
- `opr-rulebook.md` を判定材料に照らすと、障害、監視、バックアップ、バッチ、変更、アクセス制御、問い合わせが独立した章・読者・利用時点・sample を持つ一方、1つの rulebook が各詳細を規定している。中心責務は読み取れるが分割を要する major finding があるため level 2 と判定でき、複数主題の同居を検出できることを確認した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-kce0-review-viewpoints-inheritance]]: 共通 viewpoint 正本の構成。追加先。
- [[prj-0001:pjr-49d2-quality-assessment]]: grade の設計。観点とルーブリックの共有方針。
- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: opr-rulebook の構造問題を検出した実測記録。
