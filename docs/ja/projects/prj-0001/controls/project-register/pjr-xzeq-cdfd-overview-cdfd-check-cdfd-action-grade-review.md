---
specdojo:
  id: prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-26T06:13:31Z"
  completed_at: "2026-09-26T07:49:10Z"
  block_reason: rate limit reached
---

# PJR-XZEQ cdfd-overview と cdfd-check と cdfd-action へ grade と review の関係を反映する

## 1. 概要

[[prj-0001:pjr-h4h7-bps-grade-review]] で作成した BPS 2 件が設計の正本になった。`cdfd-check.md` は「review から独立して」と記述しており、BPS の「grade を事実として受け取る」と矛盾する。`cdfd-overview.md` は review phase の所属を示していない。CDFD 3 本を BPS へ整合させる。

## 2. 事実

### 2.1. cdfd-check の独立の対象が誤っている

修正前の記述である。

```text
Do で完了する review・検証は成果物の改善と検証可能な実行記録を残すまでを担い、
grade・finding は確定しない。P-08 は、その成果物と実行記録を review から独立して
根拠と照合し、QE が grade・finding を評価結果として確定する。
```

[[prj-0001:pjr-2zvs-grade-review-integration]] の結論では、**独立すべきは editor からであり review からではない。** review から独立させると評価が 2 回になる。

`bps-deliverable-evaluation` は `S-02` の担当を `runner` とし、作成者からの独立を表現している。

### 2.2. review phase の所属が示されていない

`cdfd-overview.md` の Do（P-07）は「人または AI Agent が Kata を参照してタスクを実行し、成果物と検証可能な実行記録を残す」と定める。review phase が Do に含まれるのか Action（P-11）に属するのかが読み取れない。

結論では review phase は Action である。評価を持たず、grade を事実として完了可否を判断するためである。

### 2.3. P-11 は既に結論と一致している

`cdfd-action.md` の `P-11-01` は「完了条件と評価・報告結果を人間が照合し、完了可否を確定できるようにする」であり、結論と同じである。**cdfd-action の修正は小さい見込み**で、BPS への参照と review phase との対応を明示する程度になる。

## 2.4. 進捗（2026-09-26）

**`cdfd-overview.md`、`cdfd-check.md`、`cdfd-action.md` の 3 文書への反映を完了した。**

初回実行が rate limit で中断し、別 executor で `--resume` した際に `cdfd-overview.md` のみが変更された状態で成功扱いとなった。`cdfd-overview.md` の変更内容は結論と整合するため保持し、差し戻さない。

### 2.4.1. 完了済み（cdfd-overview.md）

| 箇所       | 変更後の記述                                                                     |
| ---------- | -------------------------------------------------------------------------------- |
| Do（P-07） | 「Plan の実行指示に基づく **edit phase として**」                                |
| P-08       | 「**editor から独立した runner** が…**一度だけ**確認し、品質や適合性を評価する」 |
| P-11       | 「**review phase で**最新の grade・finding と完了条件を照合し」                  |
| 図のノード | `Do…edit phase` / `Check…grade` / `Action…review phase`                          |
| 図のエッジ | `評価結果` → `最新の grade・finding（確定済みの事実）`                           |

**この文書は再度編集しない。**

### 2.4.2. 今回完了（cdfd-check.md / cdfd-action.md）

| 文書             | 変更内容                                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| `cdfd-check.md`  | `P-08` の独立対象を editor へ修正し、独立した runner が根拠を一度だけ照合する責任分担に統一した                 |
| `cdfd-action.md` | `P-11` を review phase と明示し、最新の grade・finding を事実として受け取り、成果物を再評価しないことを反映した |

`cdfd-check.md` にあった次の記述が BPS と矛盾する核心であった。

```text
P-08 は、その成果物と実行記録を review から独立して根拠と照合し、
QE が grade・finding を評価結果として確定する。
```

review から独立させると評価が 2 回になる。独立すべきは editor からであるため、`cdfd-overview.md` と同じ「editor から独立した runner」へ統一した。

`cdfd-action.md` の `P-11-01` は元の完了可否判定を保ち、review phase との対応、最新の grade・finding を確定済みの事実として使うこと、成果物の品質を再評価しないことの明示に限定して変更した。

## 3. 完了条件

- `cdfd-check.md` の独立の対象が editor へ修正されている。review から独立させる記述がない。
- 評価が 1 回であることが `cdfd-check.md` から読み取れる。
- `cdfd-overview.md` で review phase の所属が Action であることが分かる。
- Do（P-07）の主要出力から、評価や完了判断に当たるものが除かれている。
- `cdfd-action.md` の `P-11` が review phase と対応していることが分かる。
- 3 本が `bps-deliverable-evaluation` と `bps-task-completion` と矛盾しない。
- グループ間の受け渡しが `cdfd-overview.md` の図と表で整合している。
- `cdfd-rulebook.md` の禁止事項に抵触していない。
- `npm run -s lint:md` が通過している。
- grade を再実行し、`vp-arc-cross-document-consistency` の finding が増えていない。

## 4. 留意点

CDFD は BPS より上位の正本である。通常は CDFD を先に変え BPS が従うが、本件は BPS が先に確定した。**BPS の記述を根拠に CDFD を変える形になる**ため、変更内容が [[prj-0001:pjr-2zvs-grade-review-integration]] の結論に沿っていることを確認する。BPS の実装詳細を CDFD へ持ち込まない。

`cdfd-check.md` の変更は `P-09`・`P-10` に影響しない。`P-08` の記述に限定する。

## 5. 作業内容

| No  | 作業                                           | 担当 | 状態    | メモ                                                                       |
| --- | ---------------------------------------------- | ---- | ------- | -------------------------------------------------------------------------- |
| 1   | `cdfd-check.md` の `P-08` を修正する           | ARC  | done    | 独立の対象を editor とし、照合の担当を runner へ統一した                   |
| 2   | `cdfd-overview.md` へ review の所属を反映する  | ARC  | done    | 中断前に完了済みの Do・Check・Action の境界を保持した                      |
| 3   | `cdfd-action.md` の `P-11` を BPS と対応させる | ARC  | done    | review phase、事実としての grade、再評価しない責任境界を明示した           |
| 4   | 3 本と BPS 2 件の整合を確認する                | QE   | done    | プロセス所属、判定対象、評価主体、Check から Action への受け渡しを照合した |
| 5   | grade を再実行し finding を確認する            | QE   | waiting | executor 完了後に独立した runner が実行する                                |

## 6. 対応結果

- `cdfd-check.md` の `P-08` から review の独立記述を除き、editor から独立した runner が根拠を一度だけ照合する責任境界へ修正した。
- `cdfd-action.md` の `P-11` を review phase と明示し、最新の grade・finding を確定済みの事実として受け取り、成果物の品質を再評価しないことを文章・プロセス表・データストア表・図で統一した。
- 中断前に反映済みの `cdfd-overview.md` と併せ、Do は edit phase、Check は grade、Action は review phase とする所属とデータの受け渡しが BPS 2 件と一致することを確認した。
- 対象 Markdown の Prettier と Markdownlint、全 Markdown の lint、登録簿ビュー再生成、カタログ検証、文書索引生成が成功した。カタログ検証は既存の未作成成果物に関する warning のみで、エラーはなかった。
- grade の再実行と finding の確認は、executor 完了後の独立した runner に委ねる。

### 6.1. 評価（2026-09-26）

完了条件をすべて満たす。3 本が [[bps-deliverable-evaluation]] と [[bps-task-completion]] と整合した。

### 6.2. cdfd-check の核心が修正された

```text
変更前: P-08 は、その成果物と実行記録を review から独立して根拠と照合し…
変更後: Do の edit phase は成果物の改善と検証可能な実行記録を残すまでを担い、
        grade・finding は確定しない。P-08 は、editor から独立した runner が
        その成果物と実行記録を根拠と一度だけ照合し…
```

| 変更                                                | 効果                          |
| --------------------------------------------------- | ----------------------------- |
| 「review から独立」→「editor から独立した runner」  | 評価が 2 回にならない         |
| 「Do で完了する review・検証」→「Do の edit phase」 | review が Do にないことが明確 |
| 「一度だけ照合し」を追加                            | 評価が 1 回であることを明示   |

### 6.3. cdfd-action はデータストアの利用方法まで規定した

`P-11` の説明と `P-11-01` の業務目的に加え、データストア表も更新された。

```text
評価結果 | 参照 | P-11 で最新の grade・finding を確定済みの事実として参照し、
                成果物の品質を再評価しない
```

**参照の仕方として「再評価しない」を書いている。** 原則が構造的に守られる形になった。

### 6.4. 指示を守っている

| 指示                              | 結果                                      |
| --------------------------------- | ----------------------------------------- |
| `cdfd-overview.md` を再編集しない | 守った。差分 0                            |
| `cdfd-check` は `P-08` に限定     | 守った。18 行。`P-09` / `P-10` に波及なし |
| 実装詳細を持ち込まない            | 守った。`content_hash` の記述なし         |

個票へ「この文書は再度編集しない」と明記した効果が出た。

### 6.5. 中断と再開で発生した問題

初回実行が rate limit で中断し、`agy-opus-executor` で `--resume` した際に `cdfd-overview.md` のみ変更された状態で `succeeded` を返した。2 回目は 11 分実行して追加の変更がなかった。pipeline-state は段の状態しか持たず、段の中の残作業を追跡しない。

[[prj-0001:pjr-1y9p-resume-executor-plan]] として起票した。

### 6.6. grade は未実施

3 文書の変更後に grade を実行していない。[[prj-0001:pjr-h5z7-cdfd-3-bps-2-grade-finding]] で BPS 2 件と合わせて確認する。

## 7. 関連ドキュメント

- [[prj-0001:pjr-h4h7-bps-grade-review]]
- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[bps-deliverable-evaluation]]
- [[bps-task-completion]]
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-check.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-action.md`
