---
specdojo:
  id: prj-0001:pjr-g5dy-dashboard-action-required-content
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-27T10:33:10Z"
  due_on: "2026-11-30"
---

# PJR-G5DY dashboard の「人の対応が要るもの」の表に内容の列を足す

## 1. 概要

表が種別・項目（ID）・次にすることだけで、項目が何かをパッと見て分からないため、個票のタイトルや対象の成果物の名前を出す列を足す

## 2. 入力

- 利用者（indie）が、dashboard の「人の対応が要るもの」の表に内容が書かれていないため、パッと見て分からないと指摘した（2026-11-27）
- 表は src/dashboard/dashboard.ts の renderActionRequiredSection が作り、行は aggregateActionRequired が集める。今の列は種別・項目・次にすること

## 3. 完了条件

- `dashboard build` が作る「人の対応が要るもの」の表に、「項目」の次へ「内容」の列を足している。
- 登録簿の項目の行（`review`・`decision`・`question`・`waiting` など）は、「内容」に個票のタイトルを出している。
- schedule の task の行（`human`・`blocked`）は、「内容」に対象の成果物の名前（成果物カタログから引けるもの）を出している。引けない場合は task の名前、どちらもない場合は `-` を出す。どれを出すかの細かい決め方は executor が決め、理由を個票の対応結果に書いている。
- 「内容」のセルは、今の `sanitizeDashboardCell` と同じ扱い（`|` のエスケープ、改行の除去）をしている。長いタイトルを切るかどうかは executor が決め、理由を個票の対応結果に書いている。
- 「種別」「項目」「次にすること」の列と、行の並びは変えていない。dashboard のほかの章は変えていない。
- dashboard の単体テストで、登録簿の項目と schedule の task の両方の行に「内容」が出ることを確かめている。
- `docs/ja/specdojo/` の dashboard の説明に表の列が書かれていれば、それに合わせている。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`package.json` など）は変えない。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
