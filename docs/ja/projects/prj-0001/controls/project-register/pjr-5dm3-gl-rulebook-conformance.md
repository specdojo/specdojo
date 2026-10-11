---
specdojo:
  id: prj-0001:pjr-5dm3-gl-rulebook-conformance
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T22:13:17Z"
  completed_at: "2026-09-28T23:20:03Z"
  conclusion: gl-rulebook.md を rulebook-authoring-standard に準拠させた
---

# PJR-5DM3 gl-rulebook を rulebook-authoring-standard に準拠させる

## 1. 概要

PJR-QD81（用語集 gl-common の作成）の検討事項「作業の分割」で、`gl-rulebook` の是正を QD81 に含めるか別項目に分けるかを判断することになっていた。利用者は、推奨どおり別項目に分けると判断した（2026-09-29）。

`gl-rulebook` を `rulebook-authoring-standard.md` に準拠させる。PJR-T3NN（bps-rulebook を作成標準に準拠させた項目）と同種の作業である。

## 2. 完了条件

- `docs/ja/specdojo/rulebooks/gl-rulebook.md` の章構成・記述・Frontmatter が `rulebook-authoring-standard.md` に準拠している。
- rulebook 本文に sample を埋め込まず、sample は `gl-sample` に置く方針（利用者の既定の方針）に従っている。
- 変更前後の差分の要点と、準拠のために判断した箇所を対応結果に記録する。
- `npm run -s lint:md` が成功する。

## 3. 作業内容

| No  | 作業                       | 担当 | 状態 | メモ |
| --- | -------------------------- | ---- | ---- | ---- |
| 1   | 作成標準との差分を洗い出す | DEV  | open | -    |
| 2   | gl-rulebook を改訂する     | DEV  | open | -    |

## 4. 対応結果

-
