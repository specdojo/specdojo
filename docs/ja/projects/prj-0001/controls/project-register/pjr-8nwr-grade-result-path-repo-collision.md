---
specdojo:
  id: prj-0001:pjr-8nwr-grade-result-path-repo-collision
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-27T13:26:19Z"
  block_reason: "parent validation failed: lint-ts, test-unit"
---

# PJR-8NWR grade の結果ファイルが別リポジトリの同じ ID の文書で重なる

## 1. 課題内容

grade の結果は results/`<文書 ID>.yaml` に保存され、ID はプロダクトリポジトリの成果物では project の修飾を持たない。project.repos の複数のリポジトリや本リポジトリに同じ ID の文書があると、結果が黙って上書きされ、plan も別の文書の前回の結果を読む。repos のリポジトリの文書は results/`<repo 名>`/`<ID>.yaml` に分けて保存する。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | grade の結果の保存と読み込み（`src/shared/grade-result.ts` の `gradeResultPath`、`grade plan` の前回結果の読み込み、`grade apply`、`grade run`、結果を読む dashboard など） |
| スケジュール | 影響なし。現時点で重なった事例は確認していない                                                                                                                              |
| コスト       | 保存先の分岐と、結果を読む側の追従、テストの追加                                                                                                                            |
| 品質         | 重なると、後から評価した文書の結果で前の結果が黙って上書きされ、plan が別の文書の前回の結果を読む                                                                           |
| 関係者       | `project.repos` でプロダクトリポジトリを分けて grade を使う利用者                                                                                                           |

## 3. 対応方針

| 項目     | 内容                                      |
| -------- | ----------------------------------------- |
| 原因     | `原因` を参照                             |
| 対応策   | `対応策` を参照（利用者と合意済みの案 A） |
| 依存事項 | なし                                      |
| 完了条件 | `完了条件` を参照                         |

### 3.1. 原因

- 結果は `<project の execution>/grade/results/<文書 ID>.yaml` に保存され、ファイル名は ID の `:` を `.` に置き換えて作る（`src/shared/grade-result.ts`）。
- [[specdojo:id-and-file-naming-standard]] は、ID の一意を 1 つの `docs/` ルート（SpecDojo Unit）の中でだけ求める。プロダクトの成果物の ID は project の修飾を持たない。
- このため、`project.repos` に宣言した複数のプロダクトリポジトリ、または本リポジトリとプロダクトリポジトリに同じ ID の文書があると、同じ結果ファイルになる。

### 3.2. 対応策

利用者と合意した案 A を採る。

- `project.repos` のリポジトリの文書の結果は、`results/<repo 名>/<文書 ID>.yaml` に保存する。`<repo 名>` は `repos[].name` とし、`--source` の `<repo>:<path>` の表記と揃える。
- 本リポジトリの文書の結果は、今の `results/<文書 ID>.yaml` のまま変えない。

見送った案:

| 案                                       | 見送った理由                                 |
| ---------------------------------------- | -------------------------------------------- |
| ファイル名にパスのハッシュを足す         | 人がファイル名から文書を判別できない         |
| プロダクトの文書に ID の修飾を必須にする | 規約の変更と、利用者の既存の文書の移行が要る |

### 3.3. 完了条件

1. `project.repos` のリポジトリの文書の grade の結果が `results/<repo 名>/<文書 ID>.yaml` に保存され、`grade plan` の前回結果の読み込み、`grade apply`、`grade run` の再開、結果を読むほかの処理（dashboard など）が同じ場所を読む。
2. 本リポジトリの文書の結果の場所は変わらず、既存の結果をそのまま読める。
3. 異なる 2 つの `repos` に同じ ID の文書を置いた fixture で、結果が別々のファイルに保存され、互いを上書きしないことを単体テストで確かめる。
4. `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、親の検証が通る。
5. [[specdojo:command-reference]] の grade の結果の保存先の説明を更新する。
6. `CHANGELOG.md` の未公開の版の節に不具合の修正として書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:id-and-file-naming-standard]]
- [[specdojo:command-reference]]
- `src/shared/grade-result.ts`
