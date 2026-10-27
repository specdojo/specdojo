---
specdojo:
  id: prj-0001:pjr-h988-plan-finding-anchor-escape
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-27T14:12:30Z"
  derived_from:
    - PJR-EVAE
---

# PJR-H988 plan が grade の finding の anchor を Markdown のまま書き出す

## 1. 課題内容

src/exec/plans-core.ts と src/exec/plans-storage.ts は finding の anchor を引用符で囲んで plan に書く。対象の行に Markdown リンクがあると plan が validate:history-links に落ち、npm run check が失敗する。anchor（と message）をインラインコードなどで無害化して書き出す。

## 2. 影響範囲

| 観点         | 影響                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/exec/plans-core.ts` と `src/exec/plans-storage.ts` が plan に書く grade の finding の行                           |
| スケジュール | 影響なし                                                                                                               |
| コスト       | 書き出しの修正とテストの追加                                                                                           |
| 品質         | 対象の文書の行に Markdown リンクがあると、生成した plan が `validate:history-links` に落ち、`npm run check` が失敗する |
| 関係者       | grade の finding を伴う plan を生成する利用者                                                                          |

## 3. 対応方針

| 項目     | 内容              |
| -------- | ----------------- |
| 原因     | `原因` を参照     |
| 対応策   | `対応策` を参照   |
| 依存事項 | なし              |
| 完了条件 | `完了条件` を参照 |

### 3.1. 原因

- `src/exec/plans-core.ts:292` と `src/exec/plans-storage.ts:180` は、finding の `anchor` を `JSON.stringify` で引用符に囲んだだけで plan に書く。`anchor` は対象の文書の行をそのまま写すため、行に Markdown リンクがあると plan に Markdown リンクが入る。
- PJR-EVAE では、古い `tsd-sample` の H1（Markdown リンクを含む）が `anchor` として 4 行に写り、plan が `npm run validate:history-links` に落ちた（`02e8925a8` で記録を手で直した）。

### 3.2. 対応策

- plan に書く finding の `anchor` をインラインコードとして書き出す。値にバッククォートが含まれる場合も、インラインコードが壊れない書き方にする。
- finding の本文（`gradeFindingDisplayMessage` の結果）も、Markdown リンクを含む場合に `validate:history-links` に落ちないようにする。方法は executor が決め、理由を本個票の対応結果に書く。

### 3.3. 完了条件

1. Markdown リンク・バッククォート・`|` を含む `anchor` と本文を持つ finding から生成した plan が、`npm run validate:history-links` と markdownlint を通ることを単体テストで確かめる。`plans-core.ts` と `plans-storage.ts` の両方の経路を対象にする。
2. Markdown リンクを含まない通常の `anchor` の表示は、インラインコードになる以外に変わらない。agent が `anchor` の文字列を読み取れることを保つ。
3. 既存の plan と result のファイルは変更しない。
4. `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、親の検証が通る。
5. `CHANGELOG.md` の未公開の版の節に不具合の修正として書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-evae-tsd-sample-maintenance]]
- `src/exec/plans-core.ts`
- `src/exec/plans-storage.ts`
