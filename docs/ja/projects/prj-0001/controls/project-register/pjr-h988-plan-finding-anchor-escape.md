---
specdojo:
  id: prj-0001:pjr-h988-plan-finding-anchor-escape
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

- `src/exec/plans-grade-findings.ts` に finding の共通の書き出し処理を追加し、`plans-core.ts` と `plans-storage.ts` の両経路から利用するようにした。`anchor` は従来の JSON 表記を保ったままインラインコードで囲むため、引用符・バックスラッシュ・改行を含む元の文字列を引き続き読み取れる。
- 本文にも同じ処理を適用した。リンクだけを個別に置換すると、参照形式のリンクや本文中のコードとの組み合わせを取りこぼすため、`gradeFindingDisplayMessage` が選んだ本文全体をインラインコードで囲む方式を採用した。本文の改行は空白へ置き換え、前後の空白を除去して、finding を箇条書きの 1 行に収める。
- インラインコードの区切りは、値に含まれる最長の連続バッククォートより 1 文字長くした。本文の端がバッククォートの場合は、表示時に除去される空白を区切りの内側に置き、区切りとの結合を防ぐ。
- 登録簿の経路では、判定情報に続く本文が短いと、箇条書き全体が Markdown の参照リンク定義として解釈される場合もあった。共通処理で判定情報の角括弧をエスケープし、表示を保ったままこの解釈を防いだ。
- `tests/src/exec/plans-grade-findings.test.ts` に両経路の回帰テストを 22 件追加した。通常の文字列、Markdown リンク、参照形式のリンク、バッククォート、`|`、引用符、改行、日本語の表示本文を対象とする。生成直後と Prettier 整形後の双方で、履歴リンク検査と markdownlint を通り、Markdown の構文木から元の `anchor` の JSON 表記と本文を読み取れることを確認する。
- 共通処理から問題のある引用を含む finding 9 件を通常・登録簿の両レイアウトに展開した一時 plan を生成し、生成直後と Prettier 整形後の双方で `npm run validate:history-links -- --data tmp/pjr-h988-findings-smoke.md` と markdownlint が通ることを確認した。一時ファイルは検証後に削除した。
- `npm run validate:history-links` は既存履歴 2,742 ファイルで成功した。変更した Markdown の markdownlint、Prettier 整形、`npm run check:src-imports`、カタログ検査も成功した。カタログ検査は未作成文書に関する警告のみでエラーはない。登録簿一覧を書き換えずに生成を検査するため、`register build --project prj-0001 --dry-run` を実行し成功した。
- 単体テスト・統合テスト・型検査・TypeScript lint・frontmatter lint・全体の Markdown lint・schema 検査は、pipeline の指定に従い親 runner で実行する。
- 再開時に前回の親検証で検出された TypeScript lint エラーを修正した。回帰テストの `vi.importActual` の型引数を `typeof import("node:fs")` から既存の import を参照する `typeof fs` に変更し、`consistent-type-imports` に従う形にした。回帰テストの動作は変わらない。親検証は再開後の runner で再実行する。
- `CHANGELOG.md` の未公開版の不具合修正に記載した。既存の plan / result、登録簿一覧、個票のステータスは変更していない。result は executor / reporter pipeline の reporter と runner が記入する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-evae-tsd-sample-maintenance]]
- `src/exec/plans-core.ts`
- `src/exec/plans-storage.ts`
