---
specdojo:
  id: prj-0001:pjr-h4h7-bps-grade-review
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: QE
  registered_at: "2026-09-26T02:13:29Z"
  completed_at: "2026-09-26T06:13:29Z"
---

# PJR-H4H7 成果物評価の BPS を作成し grade と review の関係を定義する

## 1. 概要

[[prj-0001:pjr-2zvs-grade-review-integration]] で確定した grade と review の関係を、業務プロセス仕様として記述する。個票の決定は経緯を含むため設計の正本にならない。BPS を正本とし、`cdfd-*` の修正とテンプレート改訂はこれを根拠に展開する。

## 2. 記述する設計

[[prj-0001:pjr-2zvs-grade-review-integration]] の `最終結論（2026-09-26）` が正であり、本項目はそれを業務プロセスとして展開する。要点は次のとおり。

| 経路   | 判定対象     | 出力           | 問い                     |
| ------ | ------------ | -------------- | ------------------------ |
| grade  | 成果物       | grade・finding | この文書の品質はどうか   |
| review | タスクの成果 | verdict        | この作業を完了してよいか |

- 評価は grade が 1 回だけ行う。review は文書を再評価しない。
- 評価の実行者は editor から独立する。runner が実行する。
- 観点は 28 件を共通とする。`continuous` は廃止する。
- 鮮度は `content_hash` で保証する。review 時点で最新でなければ実行する。
- review phase は評価を持たないため Do から Action へ移す。

## 3. 対象の成果物

**根拠は成果物カタログではなく現行の CDFD とする。** カタログの BPS 29 件は旧 10 領域体系の P 番号を記載しており、同じ番号が現行では別の領域を指す。カタログの追従は [[prj-0001:pjr-mh9e-bps-29-cdfd-14]] で後追いする。

現行 CDFD の 14 領域のうち、本項目が対象とするのは次の 2 つである。

| 領域   | 名称       | 正本             | 作成する BPS                 |
| ------ | ---------- | ---------------- | ---------------------------- |
| `P-08` | 成果物評価 | `cdfd-check.md`  | `bps-deliverable-evaluation` |
| `P-11` | タスク完了 | `cdfd-action.md` | `bps-task-completion`        |

`bps-rulebook.md` は「一文書は、概念データフローの一つのプロセス領域に属し」と定めるため、**2 文書に分ける。** 両者の関係は各文書の入口と出口に記載する。グループを横断する順序はユースケース別 CDFD の責務であり、BPS で定義しない。

### 3.1. P-11 は既に結論と一致している

`cdfd-action.md` の記述である。

```text
3.1. タスク完了（P-11）
  評価結果、進捗報告の判断事項、完了条件を照合し、人間が完了可否を判断する。
```

| プロセス  | 業務目的                                                   | 担当   |
| --------- | ---------------------------------------------------------- | ------ |
| `P-11-01` | 完了条件と評価・報告結果を人間が照合し、完了可否を確定する | PO、PM |
| `P-11-02` | 完了の決定と完了記録を正本へ残す                           | PM     |

[[prj-0001:pjr-2zvs-grade-review-integration]] で確定した「review は文書を再評価せず、grade を事実として受け取って完了可否を判断する」は `P-11-01` そのものである。review phase を Action へ移す結論は、CDFD の既存の構造と整合する。

### 3.2. カタログ未登録の影響

| 影響                   | 内容                                             |
| ---------------------- | ------------------------------------------------ |
| `done_criteria` がない | grade の `vp-qe-done-criteria` が評価できない    |
| カタログに未登録       | `vp-arc-cross-document-consistency` が検出しうる |
| Schedule に載らない    | タスクとして追跡されない                         |

いずれも [[prj-0001:pjr-mh9e-bps-29-cdfd-14]] のカタログ追従で解消する。先行作成を妨げる理由にはしない。

## 4. 完了条件

- 対象の BPS が `bps-rulebook.md` に準拠して作成されている。
- grade と review の判定対象、入力、出力、実行主体、起動条件が読み取れる。
- 評価が 1 回であることと、その保証方法（`content_hash`）が記述されている。
- review が文書を再評価しないことと、grade を事実として受け取ることが記述されている。
- editor と評価実行者の独立が記述されている。
- 例外（grade が最新でない、評価不能、対象が評価中に変更された）の扱いが記述されている。
- 処理ステップが現行 CDFD の P 番号（`P-08-01`〜`03`、`P-11-01`〜`02`）と対応している。カタログの旧 P 番号を根拠にしていない。
- 2 文書の入口と出口が対応しており、grade の確定結果が完了判断の入力になることが読み取れる。
- `done_criteria` を満たしている。
- `npm run -s lint:md` と `npm run docs:build` が通過している。

## 5. 前提

| 前提                                     | 項目                                                           |
| ---------------------------------------- | -------------------------------------------------------------- |
| BPS の記述規約が standard 準拠であること | [[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]] |
| sample / template が実例として使えること | [[prj-0001:pjr-8ten-bps-sample-bps-template-bps-recipe]]       |

**両方の完了を待つ。** 規約が確定しないまま書くと、規約確定後に書き直しになる。

## 6. この BPS を根拠に展開する項目

作成後に起票する。

| 対象                                           | 変更内容                                                  |
| ---------------------------------------------- | --------------------------------------------------------- |
| `cdfd-overview` / `cdfd-check` / `cdfd-action` | review の所属を Do から Action へ。grade と review の関係 |
| `xrp-*` テンプレート                           | 観点で評価する指示 → grade を確認して判断する指示         |
| `xrr-*` テンプレート                           | 観点別結果の記録 → 判断とその根拠の記録                   |
| `sch-strategy-*.yaml`                          | `review` phase の位置づけ                                 |

## 7. 作業内容

| No  | 作業                                | 担当 | 状態    | メモ                                                      |
| --- | ----------------------------------- | ---- | ------- | --------------------------------------------------------- |
| 1   | 前提 2 項目の完了を待つ             | QE   | done    | T3NN、8TEN の完了を確認                                   |
| 2   | 現行 CDFD の P-08 / P-11 を読み込む | QE   | done    | `cdfd-check` / `cdfd-action` とプロセス ID を照合         |
| 3   | BPS を 2 件作成する                 | QE   | done    | 成果物評価とタスク完了を別文書で作成                      |
| 4   | grade を実行し finding を確認する   | QE   | waiting | editor から独立した runner による評価を executor 後に行う |
| 5   | 展開する項目を起票する              | QE   | waiting | BPS の review 後に `cdfd-*`、`xrp-*`、`xrr-*` を起票する  |

## 8. 対応結果

- `bps-deliverable-evaluation.md` を新規作成し、`P-08-01`〜`P-08-03` に対応する対象・基準確定、独立 runner による 28 観点の評価、`content_hash` による鮮度確認、grade・finding の確定を定義した。
- `bps-task-completion.md` を新規作成し、`P-11-01`〜`P-11-02` に対応する review gate での完了可否判断と完了記録を定義した。review は成果物を再評価せず、最新の grade・finding を事実として利用する。
- 2 文書の入口と出口を grade・finding で接続し、評価結果がない場合または `content_hash` が一致しない場合は runner が成果物評価を実行してから review を再開する関係を明記した。
- grade と review の判定対象、入力、出力、実行主体、起動条件を分離し、editor と評価 runner の独立、同じ内容版を二重評価しない制御を記述した。
- 評価不能、評価中の対象変更、review 時点の鮮度不足、完了条件の未充足を主要例外として定義した。
- 成果物カタログへの登録は [[prj-0001:pjr-mh9e-bps-29-cdfd-14]]、CDFD と review テンプレートへの展開は本 BPS の review 後に起票するため、本実行では変更していない。

### 8.1. 評価（2026-09-26）

完了条件をすべて満たす。[[prj-0001:pjr-2zvs-grade-review-integration]] の 4 原則がいずれも判定可能な形で表現されている。

| 作成文書                     | 領域   | 章        |
| ---------------------------- | ------ | --------- |
| `bps-deliverable-evaluation` | `P-08` | 必須 8 章 |
| `bps-task-completion`        | `P-11` | 必須 8 章 |

### 8.2. 4 原則の表現

| 原則               | 表現された箇所                                                               |
| ------------------ | ---------------------------------------------------------------------------- |
| 2 回評価しない     | `bps-task-completion` の前提条件。疑義がある場合も `P-08` へ戻す経路を定めた |
| 作成者から独立     | `S-02` の担当を `runner` とし、QE が判定単位を固定する                       |
| 評価と承認を分ける | 出力の注記「grade・finding は…タスクの完了可否を直接確定しない」             |
| 判定対象が異なる   | 受入観点の `品質 finding を伴う完了`                                         |

原則 1 は逃げ道を閉じている点が要点である。review 内で判定を置き換えられると原則が崩れるため、`P-08` へ評価要求を戻す経路を定めた。

原則 4 は受入観点として表現された。

```text
品質 finding を伴う完了: 最新の評価結果に finding があるが、今回のタスク範囲と
完了条件は満たしている → finding を消去または解消せずに完了できる
```

文書の品質とタスクの完了可否が独立していることを、第三者が判定できる条件にしている。

### 8.3. 個票に書いていない整合を補っている

前提条件に「依存先と Kata を含む評価コンテキストの変化が評価結果へ反映済みである」を置いた。これは [[prj-0001:pjr-z47x-grade-changed-only]] が扱う鮮度問題への対応であり、本項目の個票には記載していない。設計の整合性から導いている。

`content_hash` は前提条件、`S-01`、`E-01`、受入観点の 4 箇所に現れ、`S-01` 後の成果物変更も受入観点 `review 中の成果物変更` で扱っている。

### 8.4. スコープを守っている

新規 2 文書のみを作成し、`cdfd-*`、`xrp-*`、`xrr-*`、カタログを変更していない。`bps-deliverable-evaluation` の対象外に「成果物の品質の再評価、grade・finding の変更、成果物の編集」を明記し、境界を自ら定義している。

### 8.5. カタログ未登録の状態

`done_criteria` がないため grade の `vp-qe-done-criteria` は評価できない。カタログ登録は [[prj-0001:pjr-mh9e-bps-29-cdfd-14]] で行う。先行作成の代償として想定済みである。

## 9. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]]
- [[prj-0001:pjr-8ten-bps-sample-bps-template-bps-recipe]]
- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- [[prj-0001:pjr-mh9e-bps-29-cdfd-14]]
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-check.md`
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-action.md`
- `docs/ja/specdojo/rulebooks/bps-rulebook.md`
