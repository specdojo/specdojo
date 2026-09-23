---
specdojo:
  id: prj-0001:pjr-t3vq-maintenance-plan-target-path
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-07T11:07:50Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-07T11:44:06Z"
  conclusion: plan へ編集対象の kata パスと state を追加した。節名も実態へ合わせた。修正が進まない件は approach の設計問題として分離した。
---

# PJR-T3VQ maintenance の plan が編集対象の kata パスを示さない

## 1. 概要

`<kind>-maintenance` の plan が示す `path` は成果物であり、編集対象である kata のパスを含まない。
agent は「対象成果物に紐づく kata」を自力で探す必要がある。

## 2. 現状

`exec plan --deliverable br-actor-assignment --approach sample-maintenance` で生成した plan の
記述である。

```text
## 2. 対象成果物

- `name`: アクター割り当てルール
- `path`: `docs/ja/product/010-business-specs/030-business-model/br-actor-assignment.md`
```

`sample-maintenance` は sample を編集する approach だが、編集対象である
`docs/ja/specdojo/samples/br-sample.md` のパスは plan に現れない。plan 本文は「対象 sample に
`specdojo.grade` と `specdojo:finding` がある場合は」と述べるが、その sample がどこにあるかを
示さない。

`rulebook` / `recipe` / `template` の各 maintenance も同じ構造である。

## 3. 問題

- 対象の特定が agent の推測に委ねられる。命名規則から `br-sample.md` を導けるとしても、規則が
  保証されているわけではない。
- finding へ到達できるかが不確実になる。[[prj-0001:pjr-rp1k-maintenance-finding-instruction]] で
  finding を修正の根拠に据える記述へ改めたが、対象へ到達できなければ機能しない。
- 誤った kata を編集する余地がある。同じ prefix を持つ kata が複数ある場合、どれを対象とするかが
  決まらない。

`sample` は 87 件中 35 件が `fail` で、修正が必要な対象が多い。到達の確実性は全件に影響する。

## 4. 完了条件

- `<kind>-maintenance` の plan に、編集対象である kata のパスが含まれる。
- 対象 kata が存在しない場合は、その旨が plan に示される。新規作成の指示と区別できる。
- 成果物のパスは引き続き示される。kata の見直しには成果物を根拠として読む必要があるため、
  両方が必要である。
- `bootstrap` でも、整備対象の kata のパスが示される。
- plan 生成の回帰テストで、kata パスの有無を検証している。

## 5. 検討事項

- kata のパスをどこから解決するかを決める。rulebook frontmatter の `sample` / `recipe` /
  `template` 宣言を使う方法と、命名規則から導く方法がある。前者は宣言が正本となるが、宣言の
  ない kata へ到達できない。
- 複数の kata が対応する場合の扱いを決める。1つの rulebook に複数の sample が紐づく構成が
  あり得る。
- plan の章構成を変えるか、既存の `対象成果物` 節へ追記するかを判断する。`maintenance` は
  編集対象が kata であるため、`対象成果物` という節名自体が実態と合っていない可能性がある。

## 6. 作業内容

| No  | 作業                                        | 担当 | 状態     | メモ                                                           |
| --- | ------------------------------------------- | ---- | -------- | -------------------------------------------------------------- |
| 1   | kata パスの解決方法を決める                 | ARC  | done     | rulebook frontmatter 宣言を正本とし、命名規則では推測しない    |
| 2   | plan へ kata パスを含める                   | ARC  | done     | maintenance 4件と bootstrap に repo 相対パスを表示             |
| 3   | 対象が存在しない場合の表示を定める          | ARC  | done     | `existing` / `missing` / `unresolved` の3状態で区別            |
| 4   | 回帰テストを追加する                        | ARC  | done     | kata パス、成果物パス、3状態を検証                             |
| 5   | 実行して finding が修正されることを確認する | ARC  | deferred | 本項目では到達経路まで検証。実際の修正確認は PJR-RP1K の再実行 |

## 7. 対応結果

- kata の所在は既存の `resolveKataRefs` に従い、成果物カタログの rulebook 宣言と rulebook
  frontmatter の recipe / sample / template 宣言から解決する方針に確定した。命名規則による暗黙探索は
  採用していない。複数 sample は既存仕様どおり宣言順の先頭を既定例として扱う。
- maintenance 4種の plan に「根拠となる成果物」と「編集対象」を分けて表示し、編集対象の種別、
  repo 相対パス、状態を追加した。成果物のパスも引き続き表示する。bootstrap は4種すべてのパスへ
  同じ状態表示を追加した。
- 状態は、既存文書を編集する `existing`、宣言済みパスへ新規作成する `missing`、パスを解決できず
  前提確認が必要な `unresolved` とした。`unresolved` では命名規則から推測せず異常終了するよう plan
  に明記した。
- 回帰テストで maintenance 4種と bootstrap の既存 kata パス、成果物パス、宣言先ファイルが無い
  `missing`、パス未解決の `unresolved` を検証した。
- [[prj-0001:pjr-rp1k-maintenance-finding-instruction]] の finding が実際に修正されることの確認は、
  plan から対象へ到達できるようになった後の同項目の再実行として残る。本項目では生成 plan の到達経路を
  回帰テストで確認した。

### 7.1. 受け入れ確認

orchestrator が実際に plan を生成して確認した。

| 完了条件             | 結果                                            |
| -------------------- | ----------------------------------------------- |
| kata パスが含まれる  | 満たす。`docs/ja/specdojo/samples/br-sample.md` |
| 存在しない場合の区別 | 満たす。`state` が3値を取る                     |
| 成果物のパスも示す   | 満たす。両方を表示                              |
| 4種別で動作          | 満たす。rulebook / recipe / sample / template   |
| 回帰テスト           | 満たす。単体テスト1380件が通過                  |

節名が `対象成果物` から `根拠となる成果物と編集対象` へ変更されている。検討事項に挙げた
「節名が実態と合っていない可能性」への対応であり、`maintenance` の編集対象が kata である
実態と一致した。

### 7.2. 実行検証の結果

[[prj-0001:pjr-rp1k-maintenance-finding-instruction]] で未達だった検証を行った。`br-sample.md`
（`fail`、finding 8件）に対し `sample-maintenance` の plan を `codex-expert-executor` へ渡した。

結果は次のとおりである。

| 項目    | 結果       |
| ------- | ---------- |
| 章構成  | 変更なし   |
| finding | 8 件のまま |

agent の判断は「finding は確認したが、根拠不足のため推測による改訂やコメント削除はしていない」
であった。

これは plan の `4.1. 見直しの根拠が不足する場合` の指示どおりである。

```text
根拠不足のまま推測で sample を改訂しない。確証が得られた範囲に改訂を限定し、残りは…
```

コメントだけを削除する振る舞いも起きていない。PJR-RP1K の記述が意図どおり機能している。

### 7.3. 残る課題

対象への到達と指示の明確さは解決したが、修正そのものは進まなかった。

`sample-maintenance` は「成果物・review result を根拠に sample を見直す」設計である。一方
今回の finding は「rulebook の構成に従っていない」という指摘で、根拠は rulebook にある。
approach の設計と finding の性質が噛み合っていない可能性がある。

本項目の範囲は対象パスの提示であり、これは達成した。approach の設計に関する論点は
[[prj-0001:pjr-hf4n-maintenance-approach-evidence]] として分離する。

## 8. 関連ドキュメント

- [[prj-0001:pjr-rp1k-maintenance-finding-instruction]]: finding を修正の根拠に据える記述。本項目の
  解決後に実行して検証する。
- [[prj-0001:pjr-2w38-sample-quality-observation]]: 修正対象となる kata の品質観測。
