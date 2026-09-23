---
specdojo:
  id: prj-0001:pjr-9s41-exec-templates-separation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-31T21:38:14Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-31T23:16:13Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=lefthook.yml; agent must record the required change in the result …"
  conclusion: exec と result のテンプレート 31 件を docs/ja/specdojo/exec-templates/ へ分離した。template-authoring-standard の適用範囲を成果物テンプレートに限定し、exec 系は plan/result ライフサイクルガイドに従う旨を明記した。grade はこれまで Frontmatter を持たない exec 系まで対象に含めて全件走査が停止していたが、分離により 248 文書の走査が通るようになった。統合テストの fixture は exec-templates だけを複製していたため register add が読む pjr-*-template.md が欠けて 7 件が失敗した。2 つのディレクトリが必要になったため templates も複製するよう修正した。lefthook.yml の glob 追加は保護された設定のため result の申し送りへ記録し、オーケストレーターが適用した。
---

# PJR-9S41 exec 系テンプレートを成果物テンプレートから分離する

## 1. 概要

exec と result のテンプレート 31 件は、成果物テンプレートと役割が異なるにもかかわらず同じ `docs/ja/specdojo/templates/` に置かれている。

成果物テンプレートは rulebook から `template` として宣言され、実践の型の一部を成す。一方 exec 系を宣言する rulebook は 0 件である。exec 系は plan と result を生成するための実行基盤の内部テンプレートであり、対応する成果物を持たない。

grade は kata の template として `templates/` 配下を評価するため、exec 系まで対象に含めてしまう。これらは Frontmatter を持たないため走査が停止する。役割が違うものを同じ場所に置いていることが原因である。

`docs/ja/specdojo/exec-templates/` へ移し、`template-authoring-standard` の適用範囲を成果物テンプレートに限定する。

## 2. 完了条件

- exec と result のテンプレートが `docs/ja/specdojo/exec-templates/` へ移されている。
- `template-authoring-standard` の適用範囲が成果物テンプレートに限定され、exec 系の位置づけが記載されている。
- grade が `exec-templates/` を対象に含めず、全件走査が停止しない。
- plan と result の生成が従来どおり動作する。
- 生成処理とテスト、規範文書の参照が新しい配置へ追随している。
- `npm run check` と統合テストが通る。

## 3. 作業内容

| No  | 作業                      | 担当 | 状態 | メモ                                         |
| --- | ------------------------- | ---- | ---- | -------------------------------------------- |
| 1   | 移動対象の確定            | ARC  | done | xep / xer / xrp / xrr の 31 件               |
| 2   | standard の記載方針の決定 | ARC  | done | 適用範囲と exec 系の扱い                     |
| 3   | ディレクトリの移動        | ARC  | done | 参照の追随を含む                             |
| 4   | 生成処理の参照更新        | ARC  | done | exec-plans、exec-results、exec-register、job |
| 5   | grade の対象範囲の調整    | ARC  | done | `exec-templates/` を除く                     |
| 6   | 規範文書の更新            | ARC  | done | template-authoring-standard ほか             |

### 3.1. 役割の違い

| 観点                | 成果物テンプレート     | exec / result テンプレート  |
| ------------------- | ---------------------- | --------------------------- |
| rulebook からの宣言 | される                 | されない（0 件）            |
| 実践の型の一部か    | はい                   | いいえ                      |
| 対応する成果物      | あり                   | なし。plan と result を生成 |
| 利用者              | 成果物を書く人と agent | exec の生成処理             |
| grade の対象        | 妥当                   | 不適切                      |
| 生成物 Frontmatter  | `frontmatter_template` | 本文先頭の `_FRONTMATTER_`  |
| 件数                | 61                     | 31                          |

実践の型は rulebook / recipe / sample / template が対応関係を持つ組である。exec 系はこの関係の外にあり、kata として評価する前提が成り立たない。

### 3.2. 統一ではなく分離を選ぶ理由

当初は `frontmatter_template` 形式への統一を検討した。しかし役割が違うものを同じ形式にする理由がない。

分離であれば `_FRONTMATTER_` 方式を維持でき、生成処理 4 箇所の書き換えと 31 ファイルの形式変換が不要になる。exec は中核機能であり、plan と result の生成が壊れるとタスク実行が止まるため、変更は小さいほうがよい。

grade の除外もディレクトリ単位で判定でき、本文の先頭を見る必要がなくなる。

### 3.3. grade の除外を本項目へ統合する

当初は grade 側で除外する対処を PJR-Q3JG として別に起票していたが、ディレクトリ分離により除外の実装が単純になるため本項目へ統合する。`exec-templates/` を走査対象から外すだけでよい。

### 3.4. 判断結果

- exec 系の配置とメタ情報方式は `document-metadata-standard` と `plan-result-lifecycle-guide` を正本とし、独立した authoring standard は追加しない。
- `xep-job-template.md` は plan を生成する実行基盤の部品のため、31 件の exec 系に含める。
- 生成処理、テスト fixture、規範文書、ガイドのリンク、pre-commit 対象を新しい配置へ追随させる。

## 4. 対応結果

- exec / result テンプレート 31 件を `docs/ja/specdojo/exec-templates/` へ移動した。
- exec plan、review plan、result、register plan、job plan の生成処理とテスト fixture を新パスへ追随させた。
- `template-authoring-standard` の適用範囲を成果物テンプレートに限定し、exec 系の位置づけを関連規範文書とガイドに反映した。
- grade の kata 探索が成果物テンプレートを含み、`exec-templates/` を含まないことをテストで固定した。

## 5. 関連ドキュメント

- [[specdojo:template-authoring-standard]]: 適用範囲を限定する対象。
- [[specdojo:document-metadata-standard]]: テンプレート自身のメタ情報と生成物 Frontmatter の分離。
- [[specdojo:exec-operation-guide]]: plan と result の生成。
- [[prj-0001:pjr-49d2-quality-assessment]]: grade の対象範囲。
