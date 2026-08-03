---
specdojo:
  id: prj-0001:pjr-0148-extend-wikilink-id-resolution-beyond-docs-scope
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0148 docs/外への[[id]]（wikilink）解決範囲拡張の要否検討

## 1. 概要

PJR-0146の検討過程で、`specdojo index build` の既定走査対象が `docs/` 配下に限定されているため、`.github/instructions/`、`README.md`、`CLAUDE.md` 等 `docs/` 外のファイルは `[[id]]`（wikilink）で参照できないことが判明した。`docs/` 外への `[[id]]` 解決範囲拡張が必要かどうかを、実装上の制約と費用対効果を踏まえて検討する。

## 2. 完了条件

- `docs/` 外への `[[id]]` 拡張が必要な具体的なユースケース（対象ファイル種別・参照頻度）が洗い出されている。
- 拡張する場合の実装上の論点（`walkDir` のドット始まりディレクトリ一律除外、`.github/instructions/*.md` の `applyTo:` frontmatter との非互換、README.md/CLAUDE.mdのfrontmatterなし前提、ID衝突リスク）が整理されている。
- 全面拡張・限定拡張（`.specdojo/index-config.yaml` の `nested_id_files` 等を用いた対象パスの個別追加）・拡張しない、のいずれかの方針が決まっている。
- 方針が採用された場合の対応要否（実装todoの起票要否を含む）が明記されている。

## 3. 作業内容

| No  | 作業                                                                    | 担当 | 状態 | メモ |
| --- | ----------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | `docs/` 外への `[[id]]` 参照ニーズの洗い出し                            | ARC  | open | -    |
| 2   | 拡張時の実装上の論点整理（除外ロジック・frontmatter契約・ID衝突リスク） | ARC  | open | -    |
| 3   | 全面拡張/限定拡張/非対応の方針決定                                      | ARC  | open | -    |
| 4   | 方針に応じた後続対応（実装todoの起票等）の要否判断                      | ARC  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0146-forbid-links-in-history-files|履歴蓄積ファイルのリンク禁止ルール化]]
- [[specdojo:id-and-file-naming-standard|ドキュメントIDおよびファイル命名標準]]
