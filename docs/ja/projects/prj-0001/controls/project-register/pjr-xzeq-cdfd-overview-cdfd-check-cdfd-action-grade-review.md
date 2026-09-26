---
specdojo:
  id: prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: ARC
  registered_at: "2026-09-26T06:13:31Z"
  block_reason: rate limit reached
---

# PJR-XZEQ cdfd-overview と cdfd-check と cdfd-action へ grade と review の関係を反映する

## 1. 概要

[[prj-0001:pjr-h4h7-bps-grade-review]] で作成した BPS 2 件が設計の正本になった。`cdfd-check.md` は「review から独立して」と記述しており、BPS の「grade を事実として受け取る」と矛盾する。`cdfd-overview.md` は review phase の所属を示していない。CDFD 3 本を BPS へ整合させる。

## 2. 事実

### 2.1. cdfd-check の独立の対象が誤っている

現在の記述である。

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

**`cdfd-overview.md` は完了している。残りは `cdfd-check.md` と `cdfd-action.md` の 2 文書である。**

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

### 2.4.2. 未着手（本項目で対応する 2 文書）

| 文書             | 必要な変更                                                          |
| ---------------- | ------------------------------------------------------------------- |
| `cdfd-check.md`  | `P-08` の「**review から独立して**」を「**editor から独立して**」へ |
| `cdfd-action.md` | `P-11` と review phase の対応を明示する                             |

`cdfd-check.md` の 40 行目が現在も次のままである。**これが BPS と矛盾する核心であり、最優先で解消する。**

```text
P-08 は、その成果物と実行記録を review から独立して根拠と照合し、
QE が grade・finding を評価結果として確定する。
```

review から独立させると評価が 2 回になる。独立すべきは editor からである。`cdfd-overview.md` の P-08 は既に「editor から独立した runner」と記述済みであり、`cdfd-check.md` をこれに揃える。

`cdfd-action.md` の `P-11-01` は「完了条件と評価・報告結果を人間が照合し、完了可否を確定できるようにする」であり結論と一致している。**修正は小さい。** review phase との対応と、grade を再評価しないことの明示に限る。

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

| No  | 作業                                           | 担当 | 状態 | メモ                   |
| --- | ---------------------------------------------- | ---- | ---- | ---------------------- |
| 1   | `cdfd-check.md` の `P-08` を修正する           | ARC  | open | 独立の対象を editor へ |
| 2   | `cdfd-overview.md` へ review の所属を反映する  | ARC  | open | Do と Action の境界    |
| 3   | `cdfd-action.md` の `P-11` を BPS と対応させる | ARC  | open | 修正は小さい見込み     |
| 4   | 3 本と BPS 2 件の整合を確認する                | QE   | open |                        |
| 5   | grade を再実行し finding を確認する            | QE   | open |                        |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-h4h7-bps-grade-review]]
- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[bps-deliverable-evaluation]]
- [[bps-task-completion]]
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-check.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-action.md`
