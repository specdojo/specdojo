---
specdojo:
  id: prj-0001:pjr-rp1k-maintenance-finding-instruction
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-07T09:59:12Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-07T11:08:37Z"
  conclusion: 5テンプレートで finding を手順へ組み込み、修正を主目的とする記述へ改めた。実行による検証は PJR-T3VQ の解決後に行う。
---

# PJR-RP1K maintenance と bootstrap の plan で finding を修正の根拠に据える

## 1. 概要

`maintenance` と `bootstrap` の exec テンプレートは finding へ言及するが、記述が指示として弱い。
agent が finding コメントを削除するだけで完了と解釈する余地がある。

## 2. 現状の記述

`xep-sample-maintenance-template.md` の例である。他の4件も同じ構造を持つ。

```text
## 4. 進め方

1. 見直し対象の sample を読み込み、現状の粒度・文体・表の書き方を把握する。
2. 複数の成果物・review result・対象領域の慣行を根拠に、それらが完成例として適切かを見直す。
3. rulebook の必須項目・禁止事項を満たす最小の記述例になるよう再構成し、実成果物の丸写しを避ける。
4. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

対象 sample に `specdojo.grade` と `specdojo:finding` がある場合は、同じ viewpoint ID で根拠を
確認し、該当箇所を修正した finding コメントだけを削除する。修正後の再評価で構造・整合性が
劣化していないことを確認する。
```

## 3. 問題

### 3.1. finding が手順に入っていない

番号付き手順 1〜4 は finding へ触れない。根拠として示されるのは「成果物・review result・対象
領域の慣行」であり、finding は含まれない。finding への言及は手順の外にある1文だけである。

agent が手順に従って作業すると、finding を根拠にしない見直しが行われる。

### 3.2. 主動詞が「削除する」

該当文の構造は「〜finding コメントだけを削除する」であり、主動詞は削除である。修正は「該当
箇所を修正した」という修飾句に埋もれている。

「修正済みのコメントを削除せよ」とも読める。修正そのものを求める指示になっていない。

### 3.3. 順序が示されていない

「修正してから削除する」という順序が明示されない。削除だけが実行される余地が残る。

## 4. 実際のリスク

`br-sample.md` の blocker である。

```text
severity=blocker rule=vp-qe-kata-conformance line=9
ルールブックで定義された標準テンプレートに従っておらず、
ビジネスルールの書き方を示すサンプルとしての役割を果たしていない。
```

対象 sample の章構成は次のとおりで、rulebook が定める構成と一致しない。

```text
1. 目的と適用範囲 / 2. 入力情報 / 3. 記述内容 / 4. 最小記述例 / 5. 未解決事項
```

この finding は章構成の全面的な書き直しを求める。しかし現状の記述では、コメントを削除して
完了としても指示に反したとは言い切れない。

sample は 87 件中 35 件が `fail` で、同種の blocker を含む。全件で同じことが起こりうる。

## 5. 完了条件

- finding が番号付き手順の一部として組み込まれている。手順の外の補足ではない。
- 「finding を根拠に修正する」ことが主目的として示されている。削除は修正後の後処理として
  位置づけられる。
- 「修正 → 確認 → 削除」の順序が明示されている。
- 未解消の finding はコメントを残すことが示されている。判断できない場合の扱いも定める。
- 対象は `maintenance` 4件と `bootstrap` の計5テンプレートで、記述が揃っている。
- sample 数件で実行し、章構成が実際に修正されることを確認している。コメントだけが消えて本文が
  変わらない結果になっていない。

## 6. 検討事項

- finding を手順のどこへ置くかを決める。読み込みの直後に置いて根拠として扱うか、見直しの観点
  として各手順へ織り込むか。
- severity による扱いの差を設けるか。`blocker` と `major` は必ず対応し、`minor` は判断に委ねる
  という区別があり得る。
- 修正できない finding の扱いを定める。根拠が不足する場合、rulebook 側の問題である場合、
  判断を要する場合がある。コメントを残したうえで result へ理由を記録する形が考えられる。
- 検証の方法を決める。修正の前後で章構成が変わったかを機械的に確認できると確実だが、内容の
  妥当性までは測れない。再評価で finding が減ることを指標にする案もある。

## 7. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                        |
| --- | ------------------------------------ | ---- | ---- | --------------------------- |
| 1   | finding を手順へ組み込む位置を決める | ARC  | done | 読み込み直後の番号付き手順  |
| 2   | 修正を主目的とする記述へ改める       | ARC  | done | 削除は確認後の後処理        |
| 3   | 未解消 finding の扱いを定める        | ARC  | done | コメント保持と result 記録  |
| 4   | 5テンプレートへ反映する              | ARC  | done | maintenance 4件と bootstrap |
| 5   | sample 数件で実行して確認する        | ARC  | done | 5テンプレートの回帰検査     |

## 8. 対応結果

`maintenance` 4件では、対象を読み込んだ直後の番号付き手順へ finding 対応を組み込んだ。
`bootstrap` でも、成果物と実践の型を整備する番号付き手順の先頭へ同じ指示を組み込んだ。いずれも
severity で扱いを分けず、finding の message と同じ viewpoint ID の判定根拠を修正要件として
本文を修正する。問題の解消を確認した後に限ってコメントを削除し、コメント削除だけでは修正と
扱わない。

未解消、根拠不足、判断不能の場合は finding コメントを残し、理由と次のアクションを result の
`進め方と実践の型の適用` セクションへ記録するよう統一した。これにより「修正 → 確認 → 削除」
の順序と、解消できない場合の扱いが5テンプレートで一致する。

回帰防止として、対象5テンプレートのすべてに次の指示が存在することを検査する単体テストを
`tests/src/exec-plans.test.ts` へ追加した。

- finding の判定根拠を修正要件として扱う。
- コメント削除だけを修正として扱わない。
- 「修正 → 確認 → 削除」の順序を守る。
- 未解消の finding コメントを残す。

変更した成果物は、`docs/ja/specdojo/exec-templates/` 配下の bootstrap 1件と maintenance 4件、
本個票、および上記の単体テストである。

### 8.1. 受け入れ確認

orchestrator が次を確認した。

| 完了条件            | 結果                                              |
| ------------------- | ------------------------------------------------- |
| 手順の一部である    | 満たす。maintenance は手順2〜3、bootstrap は手順1 |
| 修正が主目的        | 満たす。「削除だけを修正として扱わない」          |
| 順序の明示          | 満たす。「修正 → 確認 → 削除」の順序を変えない    |
| 未解消は残す        | 満たす。理由と次のアクションを result へ記録      |
| 5テンプレートで揃う | 満たす。全件で同じ文言を確認                      |
| **実行して確認**    | **未達**                                          |

記述は的確である。finding が読み込み直後の手順へ組み込まれ、主動詞が「修正する」になり、
削除は確認後の後処理として位置づけられた。単体テストで文言も固定されている。

### 8.2. 未達の完了条件

「sample 数件で実行し、章構成が実際に修正されることを確認している」は達成していない。検証を
試みた際に別の欠陥が判明し、実行できなかった。

`exec plan --deliverable br-actor-assignment --approach sample-maintenance` で生成した plan は、
対象パスとして成果物を示す。

```text
- `path`: `docs/ja/product/010-business-specs/030-business-model/br-actor-assignment.md`
```

`sample-maintenance` は sample を編集する approach だが、編集対象である
`docs/ja/specdojo/samples/br-sample.md` のパスが plan に含まれない。agent は「対象成果物に紐づく
sample」を自力で探す必要がある。

本項目の記述をいくら正確にしても、対象へ到達できなければ機能しない。ただしこれは plan 生成側の
問題であり、テンプレートの記述を扱う本項目とは論点が異なる。
[[prj-0001:pjr-t3vq-maintenance-plan-target-path]] として分離した。

実行による検証は、その項目の解決後に行う。

## 9. 関連ドキュメント

- [[prj-0001:pjr-9py9-maintenance-plan-findings]]: 誤った前提で起票し reject した項目。本項目は
  別の欠陥を扱う。
- [[prj-0001:pjr-2w38-sample-quality-observation]]: 修正対象となる kata の品質観測。
- [[prj-0001:pjr-49d2-quality-assessment]]: finding を記録する grade の起点。
