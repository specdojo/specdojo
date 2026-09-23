---
specdojo:
  id: prj-0001:pjr-g8m9-kata-wikilink-resolution
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-23T03:50:08Z"
  due_on: "2026-10-31"
---

# PJR-G8M9 eject されていない kata の wikilink と index build の解決方針を決めて実装する

## 1. 概要

[[prj-0001:pjr-fkn1-kata-distribution-method]] の第 3 段階。kata を `node_modules` から参照する構成では、利用者の成果物に書かれた `[[specdojo:xxx-rulebook]]` の実体がリポジトリ外になる。`index build` は `docs/` 配下を走査して ID インデックスを作るため、eject されていない kata の ID が未解決になる。

影響を受けるのは、成果物 frontmatter の `rulebook` / `based_on`、本文の wikilink、および利用者が VitePress で docs サイトを作る場合のリンク解決である。

## 2. 完了条件

- `index build` の走査範囲と、eject されていない kata の ID をどう扱うかが決まり、実装されている。
- 未解決時の挙動（公開サイト URL への退避、警告、エラーのいずれか）が決まり、利用者が選べるか既定が明示されている。
- 利用者が docs サイトを生成する場合の扱いが文書化されている。`kata install --all` を前提にするなら、その旨を案内する。
- 成果物 frontmatter の `rulebook` に参照中の kata ID を書いても `catalog validate` が通る。
- 決定内容が [[specdojo:practice-system-composition-guide]] または関連ガイドへ反映されている。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                           |
| --- | --------------------------------------------------- | ---- | ---- | ------------------------------ |
| 1   | `index build` の走査範囲と未解決時の扱いを決める    | DEV  | open | 先に方針を個票へ記録する       |
| 2   | 決めた方針を実装し、`catalog validate` の整合を取る | DEV  | open | 参照中 ID を不正としない       |
| 3   | docs サイト生成時の扱いを文書化する                 | DEV  | open | 全量コピーを案内するかを含める |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[prj-0001:pjr-ypns-kata-resolution]]
- [[specdojo:practice-system-composition-guide]]
- [[specdojo:docs-structure-guide]]
