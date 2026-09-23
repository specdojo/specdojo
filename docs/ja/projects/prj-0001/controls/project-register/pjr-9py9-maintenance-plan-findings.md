---
specdojo:
  id: prj-0001:pjr-9py9-maintenance-plan-findings
  type: project
  status: deprecated
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: rejected
  priority: high
  owner: ARC
  registered_at: "2026-09-04T11:25:39Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-07T09:36:07Z"
  conclusion: 前提が誤っていた。maintenance と bootstrap のテンプレート5件すべてに finding を参照する指示が既に存在する。
---

# PJR-9PY9 maintenance と bootstrap の plan へ finding を載せる

## 1. 概要

`grade apply` は要修正箇所を `specdojo:finding` の HTML コメントとして本文へ記録する。
一方、kata を手入れする `<kind>-maintenance` と `bootstrap` の approach は plan にこの finding を
載せない。評価結果が修正へ渡らない。

[[prj-0001:pjr-49d2-quality-assessment]] は完了条件に次を挙げていた。

```text
- bootstrap および `<kind>-maintenance` approach の plan から findings を参照して修正できる。
```

approach 自体は実装済みで、`schedule-strategy-generate.ts` が成果物ごとに保守タスクを生成する。
欠けているのは plan の生成が finding を参照する部分だけである。

```text
approach の実データ:
  rulebook-maintenance 40 / sample-maintenance 38 / template-maintenance 37
  recipe-maintenance 36 / bootstrap 47
```

`specdojo:finding` を読む処理は `src/grade.ts` の `previousGradeFindings` にしか存在せず、
plan 生成側（`src/exec-plans.ts`）には grade も finding も参照がない。

## 2. 動機

rulebook 106 件を走査した結果、ローカル2段で needs-work 55 件と fail 1 件、codex が精査した
29 件のうち 22 件が needs-work となった。指摘は具体的で、schema との矛盾や用語の不統一など
実在の欠陥を含む。

しかしこの結果を修正へ渡す手段がないため、評価が記録で終わっている。他種別（recipe / sample /
template の 195 文書）を走査しても、活用できないデータが増えるだけになる。

評価と修正のループを閉じることを優先する。

## 3. 完了条件

- `<kind>-maintenance` approach の plan に、対象文書の finding が含まれる。
- `bootstrap` approach の plan も、対象文書に既存 finding があれば含める。
- plan に含める情報は `rule`、`severity`、`message`、対象行とする。`rule` は viewpoint の id で
  あり、agent が判定根拠を辿れる。
- finding が無い文書では plan の内容が従来と変わらない。
- 修正後に `grade` を再実行すると、解消された finding が消え、未解消のものは残る。
- rulebook 数件で評価から修正、再評価までが通ることを確認する。

## 4. 検討事項

- finding の抽出は `previousGradeFindings` が既にある。ただし `grade.ts` の非公開関数のため、
  plan 生成から使えるよう切り出す必要がある。抽出結果の型（`PreviousGradeFinding`）も共有する。
- plan へ載せる粒度を決める。全 finding を載せると severity の低いものが judgment を埋める。
  `severity` で絞るか、全件を載せて優先度を示すかを判断する。
- `bootstrap` は新規作成が主目的であり、既存 finding があるとは限らない。無い場合に plan の
  構成が崩れないようにする。
- 修正の結果を検証する手段を定める。agent が finding を消しただけで内容を直していない場合を
  検出できるか。再評価で同じ指摘が出れば分かるが、実行コストがかかる。

## 5. 作業内容

| No  | 作業                                      | 担当 | 状態 | メモ                               |
| --- | ----------------------------------------- | ---- | ---- | ---------------------------------- |
| 1   | finding 抽出処理を共有可能にする          | ARC  | open | `previousGradeFindings` を切り出す |
| 2   | plan へ載せる情報と粒度を決める           | ARC  | open | severity で絞るかを判断する        |
| 3   | maintenance の plan 生成へ組み込む        | ARC  | open | 4 種別すべて                       |
| 4   | bootstrap の plan 生成へ組み込む          | ARC  | open | finding が無い場合も壊さない       |
| 5   | 単体テストを追加する                      | ARC  | open | finding の有無で分岐する           |
| 6   | rulebook 数件で評価から再評価まで確認する | ARC  | open | ループが閉じることを見る           |

## 6. 対応結果

本項目は前提が誤っていた。実装は不要である。

### 6.1. 誤りの内容

起票時に「plan が finding を載せていない」と判断したが、事実に反する。`maintenance` と
`bootstrap` の exec テンプレート5件すべてに、finding を参照する指示が既に含まれている。

```text
docs/ja/specdojo/exec-templates/xep-rulebook-maintenance-template.md
docs/ja/specdojo/exec-templates/xep-recipe-maintenance-template.md
docs/ja/specdojo/exec-templates/xep-sample-maintenance-template.md
docs/ja/specdojo/exec-templates/xep-template-maintenance-template.md
docs/ja/specdojo/exec-templates/xep-bootstrap-template.md
```

指示の内容は次のとおりで、十分に具体的である。

```text
対象 sample に `specdojo.grade` と `specdojo:finding` がある場合は、同じ viewpoint ID で
根拠を確認し、該当箇所を修正した finding コメントだけを削除する。修正後の再評価で
構造・整合性が劣化していないことを確認する。
```

`bootstrap` では加えて `grade plan --changed-only` の対象になることも示している。

### 6.2. 動作確認

`exec plan --deliverable br-actor-assignment --approach sample-maintenance` で plan を生成し、
指示が反映されることを確認した。plan には対象文書のパスも含まれるため、agent は finding を
読み取れる。

```text
- `path`: `docs/ja/product/010-business-specs/030-business-model/br-actor-assignment.md`
対象 sample に `specdojo.grade` と `specdojo:finding` がある場合は、同じ viewpoint ID で…
```

### 6.3. 誤りの原因

`specdojo:finding` を参照する処理をソースコードから探し、`src/grade.ts` にしか存在しないことを
根拠に「plan は finding を載せていない」と結論した。

実際の経路はコードではなくテンプレート本文である。テンプレートの指示が plan へそのまま出力され、
agent が対象文書を読んで finding を解釈する。プレースホルダ置換以外のコードを介さないため、
ソース検索では見つからない。

実装の有無をコード検索だけで判断した誤りである。成果物（テンプレート）側を確認していれば
気づけた。

### 6.4. 残る課題

finding を修正へ渡す経路は存在するが、実際に機能するかは未検証である。237 件の kata に対し
`maintenance` を実行し、finding が解消されるかを確かめていない。

これは本項目とは別の課題として扱う。実行して初めて分かる問題があれば、その時点で起票する。

## 7. 関連ドキュメント

- [[prj-0001:pjr-49d2-quality-assessment]]: 本項目の完了条件を掲げた起点。
- [[prj-0001:pjr-excv-grade-per-document-pipeline]]: 評価結果を生んだ実行経路。
- [[prj-0001:pjr-g1qz-grade-finding-comment-lint]]: finding コメントの挿入位置。
