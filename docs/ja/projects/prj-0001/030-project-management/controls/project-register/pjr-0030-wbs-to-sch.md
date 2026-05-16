---
id: prj-0001:pjr-0030-wbs-to-sch
type: project
status: draft
rulebook: pjr-rulebook
---

# PJR-0030: wbs to schedules strategyの見直し

## 1. 結論

wbsからスケジュールへの展開戦略を以下のように見直そうと考えたが、wbsを成果物カタログに統合したため見直し。

## 2. 概要

wbs to schedule strategyを以下の方針で見直す。

- ファイル名も`sch-strategy-<track>.md`で作成するように見直す。
- この`sch-strategy-<track>.md`に沿って、`sch-config-<track>.yaml`,`sch-agent-overrides-<track>.yaml`を生成するように見直す。

## 3. 成果物の種類

成果物はの以下の３種類を作成:

- `document`: `docs/ja/projects/prj-0001/`, `docs/ja/product/`配下に配置するSpecDojoのプロジェクトドキュメント、プロダクトドキュメント
- `rulebook`: `docs/ja/specdojo/rulebooks/`配下に配置するSpecDojoのルールブック
- `instruction`: `docs/ja/specdojo/instructions/`配下に配置するSpecDojoのインストラクション
- `sample`: `docs/ja/specdojo/samples/`配下に配置するSpecDojoのサンプルドキュメント

## 4. 成果物の作成フロー

ゼロからいきなり、rulebookを作成することは難しいことから、まずは`documentのたたき台`を作成して、その内容に応じてrulebook、instruction、sampleを作成する流れで進める。

### 4.1. 3.1 ドキュメント作成

1. `docs/ja/projects/prj-0001/`, `docs/ja/product/`配下に`document`がない場合はまずは`documentのたたき台`を作成する。
   - 成果物を作成する際は、成果物に対応する`rulebook`がある場合は参考にする。
2. `documentのたたき台`を内容に応じて`PO`, `BA`, `ARC`, `QE`のロールがレビューする。
3. レビューを踏まえて、`documentのたたき台`を`document一次版`として修正する。
4. `document一次版`を内容に応じて、`PO`, `BA`, `ARC`, `QE`のロールがレビューし、一次版として修正・承認する。
5. 対象ドメイン内のドキュメントに対して、1〜4のフローを繰り返す。
6. 5までで作成したドメイン内のドキュメントの全体整合性を`PO`, `BA`, `ARC`, `QE`のロールがレビューする。
7. レビューを踏まえて、`documentの二次版`として整合性を合わせるための修正をおこなう。
8. `document二次版`を内容に応じて、`PO`, `BA`, `ARC`, `QE`のロールがレビューし、二次版として修正・承認する。

### 4.2. 3.2 rulebook、instruction、sample作成

1. `document二次版`をもとに、必要に応じて`rulebook`を修正もしくは作成する。
2. `rulebook`を内容に応じて`PO`, `BA`, `ARC`, `QE`のロールがレビューし、修正・承認する。
3. `rulebook`をもとに、`instruction`、`sample`を作成する。
4. `instruction`, `sample`を内容に応じて`PO`, `BA`, `ARC`, `QE`のロールがレビューし、修正・承認する。

### 4.3. 3.3 全体整合性の確認

1. `document`, `rulebook`, `instruction`, `sample`の整合性を内容に応じて`PO`, `BA`, `ARC`, `QE`のロールがレビューし、修正・承認する。
2. `document`, `rulebook`, `instruction`, `sample`を`ready`にする。
