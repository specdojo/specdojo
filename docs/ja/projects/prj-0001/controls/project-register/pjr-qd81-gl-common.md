---
specdojo:
  id: prj-0001:pjr-qd81-gl-common
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-09-26T04:08:08Z"
---

# PJR-QD81 用語集 gl-common を作成し概念名と英語名の対応を確定する

## 1. 概要

カタログ `dct-glossary.yaml` は `gl-common`（用語集・共通）を定義するが未作成である。[[prj-0001:pjr-00qv-cdfd-rulebook]] で、データストア名のうち 5 件は単一の英語名を確定できず併記を見送った。概念名と英語名の対応は用語集が正本であり、CDFD 側へ分散させると乖離する。用語集を作成して対応を確定する。

## 2. 事実

### 2.1. 英語名が未確定の 5 件

| データストア     | 候補                                      | 問題                               |
| ---------------- | ----------------------------------------- | ---------------------------------- |
| 実行記録         | `result` / `event` / `evidence` / `trial` | 4 語に対応。単一名では一部が漏れる |
| 評価結果         | `grade` / `finding`                       | 2 語に対応                         |
| 稼働構成         | —                                         | 対応語がない                       |
| 進捗報告         | —                                         | 未確定                             |
| 派生ビュー・索引 | —                                         | 未確定                             |

`cdfd-rulebook` には「一対一の対応を確定できない場合は英語名を推測で補わず、日本語名だけを使用して用語集での確定を待ちます」と規定済みである。

### 2.2. 用語集の構造に英語名の項目がない

`gl-rulebook.md` の `terms` の基本構造は次のとおりで、**英語名を持つ項目がない**。

| 項目    | 説明               | 必須 |
| ------- | ------------------ | ---- |
| id      | 用語ID（`tm-...`） | ○    |
| term    | 用語（正式名称）   | ○    |
| aliases | 別名（配列）       | 任意 |

`aliases` を流用する案もあるが、別名と訳語は性質が異なる。**英語名を保持する方法を先に決める必要がある。**

### 2.3. gl-rulebook 自体が standard 準拠でない

| 問題                           | 内容                                                              |
| ------------------------------ | ----------------------------------------------------------------- |
| 禁止事項が 2 章ある            | `## 3. 禁止事項` と `## 5. 禁止事項`                              |
| 見出し番号に `.` がない        | `### 1.1 ファイル命名`、`### 4.1 terms の基本構造`                |
| 章構成が standard と一致しない | `メタデータ`、`記載ルール・命名規則` など                         |
| schema がない                  | sample の先頭に `specdojo-schema: none reason=schema-not-defined` |

`target_format: yaml` の系統であり、`rulebook-authoring-standard.md` は「`target_format` が `yaml` の場合は対応する sample が schema と整合することを確認する」と定めるが、schema が存在しない。

## 3. 完了条件

- `gl-common.yaml` が作成され、`gl-rulebook.md` に準拠している。
- 概念名と英語名の対応を保持する方法が決まっている。`terms` へ項目を追加するか、`aliases` を使うかを明示する。
- 未確定の 5 件について、英語名を確定するか「単一名を持たない」と結論するかが決まっている。
- 結論が `cdfd-rulebook` の規定と整合している。併記できるものは CDFD 側へ反映する。
- CDFD のデータストア 16 件がすべて用語集に含まれている。
- 用語集の対象範囲が決まっている。データストア名だけか、CDFD の用語全体かを明示する。
- `gl-rulebook.md` の standard 非準拠（禁止事項の重複、見出し番号）が解消されている。
- schema の要否が決まっている。作る場合は `npm run validate:schema:file` で sample を検証する。
- `npm run check` が通過している。

## 4. 検討事項

### 4.1. 単一名を持たないものの扱い

`実行記録` は `result` / `event` / `evidence` / `trial` の 4 つを含む。取りうる結論は 3 つある。

| 案  | 内容                                                     | 影響                             |
| --- | -------------------------------------------------------- | -------------------------------- |
| 1   | 総称となる英語名を新たに定める（例: `execution record`） | 既存のディレクトリ名と対応しない |
| 2   | 単一名を持たないと結論し、CDFD では日本語名のみを使う    | 現状維持。読み手の負担が残る     |
| 3   | 用語集で 4 語それぞれを個別の用語として定義する          | データストア名との対応は別途必要 |

**案 3 と案 2 の組み合わせが妥当と考える。** 構成要素を個別に定義し、データストア名としては日本語のみとする。

### 4.2. 作業の分割

`gl-rulebook` の是正（`2.3.`）は本項目に含めるか、別項目に分けるかを判断する。[[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]] と同種の作業であり、規模も近い。

## 5. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                                |
| --- | -------------------------------------------- | ---- | ---- | ----------------------------------- |
| 1   | `gl-rulebook` の是正を本項目に含めるか決める | ARC  | open | 別項目に分ける選択もある            |
| 2   | 英語名の保持方法を決める                     | BA   | open | `terms` への項目追加か `aliases` か |
| 3   | 未確定 5 件の結論を出す                      | BA   | open | 案 2 と案 3 の組み合わせを起点に    |
| 4   | `gl-common.yaml` を作成する                  | BA   | open | データストア 16 件を含める          |
| 5   | 確定した英語名を CDFD へ反映する             | ARC  | open | 併記できるものだけ                  |
| 6   | schema の要否を決め、必要なら作成する        | ARC  | open |                                     |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-00qv-cdfd-rulebook]]
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-glossary.yaml`
- `docs/ja/specdojo/rulebooks/gl-rulebook.md`
- `docs/ja/specdojo/samples/gl-sample.yaml`
- `docs/ja/specdojo/rulebooks/cdfd-rulebook.md`
