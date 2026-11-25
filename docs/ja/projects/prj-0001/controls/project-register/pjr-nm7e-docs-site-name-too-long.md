---
specdojo:
  id: prj-0001:pjr-nm7e-docs-site-name-too-long
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-24T17:49:58Z"
  derived_from:
    - PJR-FZQA
---

# PJR-NM7E 長い名前の生成ページで文書サイトのビルドが ENAMETOOLONG で止まる

## 1. 課題内容

PJR-FZQA の確かめ（2026-11-25）で、試しのリポジトリ（prj-9001）の文書サイトのビルドが `ENAMETOOLONG` で止まった。grade の生成ページ `execution/grade/generated/runs/review-prj-9001-T-N0P1-prj-success-criteria-and-acceptance-criteria-010-5b3f299a01-20261124T134340Z/1/stage-1/...-grade-reporter-plan.md` のパスを VitePress が `_` でつないで asset のファイル名にし、1 つのファイル名の上限（255 バイト）を超えた。task ID や sample 名が長い利用者のリポジトリでも起こりうる。試しのビルドでは生成ページをよけて通した。

## 2. 入力

- 試しのリポジトリ prj-9001 の grade の生成ページで再現（2026-11-25、オーケストレーター）
- 担当と期限は利用者の確認待ち
- PJR-T2X5 の決定（2026-11-25）: v1.0 まで破壊的な変更をしない。CLI・設定・記録の形・型（kata の id と rulebook の必須の章）・生成物の場所を壊さず、消す・変えるときは先に非推奨にして少なくとも 1 つの minor の版のあいだ残す

## 3. 影響範囲

- 文書サイトのビルド全体が止まる。対象は、grade の生成ページなど、長い task ID や sample 名をパスに含むページを持つ利用者のリポジトリ。prj-0001 の今のサイトでは起きていない。

## 4. 対応方針

- 再現の条件（どの生成ページのパスが、VitePress の出力の asset のファイル名でどの長さになるか）を確かめ、個票の対応結果に書く。
- 長い task ID や sample 名でも、文書サイトのビルドが `ENAMETOOLONG` で止まらないようにする。直し方（生成ページのファイル名を短くする、サイトの対象から外す、VitePress の asset の名前の付け方を変えるなど）は executor が決め、理由を個票の対応結果と報告の `handoff` に書く。生成ページのファイル名を変える場合は、そのページへのリンクと既存の生成物の扱いも決めて書く。
- 単体テストを足す（長い名前でもファイル名の上限に収まること）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- 統合の後に、オーケストレーターが長い名前の grade の記録を持つ試しのリポジトリでサイトをビルドし、止まらないことを確かめてから close する。
- 保護された設定（`.github`・`.specdojo/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 5. 対応結果

### 5.1. 再現の条件

VitePress は各ページの入力名を、`docs/` 起点のパスの `/` を `_` に置き換えて作り、asset のファイル名を `<入力名>.<hash>.js`（クライアント用は `.lean.js` も）にする。grade run の作業ディレクトリ `execution/grade/generated/runs/<run-id>/1/stage-1/<stem>-<hash>-grade-reporter-plan.md` は、run ID（task ID と sample 名を含み最大 128 文字）と stem（sample 名）が長いと、この名前が 255 バイトを超える。VitePress の `sanitizeFileName` は設定で差し替えても、描画側の参照（ページ名とハッシュの対応）が元の関数を使うため、名前の付け方は設定側から変えられない。

### 5.2. 直し方と理由

- `packages/docs-site/.vitepress/exec-record-paths.ts` の `EXEC_RECORD_SRC_EXCLUDE` に `docs/**/execution/grade/generated/runs/**` を足し、grade run の作業ディレクトリを文書サイトの対象から外した。
- 理由: plan の写しなどを置く一時の作業物で、閲覧対象ではない。ファイル名を短くする案は、run ID と stem が利用者の task ID・sample 名に依存し上限を保証できず、既存の criteria ファイル名（`gradePlanFilename`）とも結びつくため採らなかった。asset の名前の付け方を変える案は上のとおり設定側からできない。
- 生成ページへのリンク: 該当ページへ張られたリンクはない（`grade/generated/plans/` は対象のまま）。既存の生成物の扱い: 変更しない（ファイルは残り、サイトにだけ載らなくなる）。
- 単体テスト: `tests/packages/docs-site/exec-record-paths.test.ts` に、長い run ID・stem のページが走査から外れ、`grade/generated/plans/` のページが残ることを確かめるテストを足した。

### 5.3. CHANGELOG に書く事項

- 区分: Fixed
- 文案: 文書サイトのビルドが、task ID や sample 名が長い grade run の作業ディレクトリのページで `ENAMETOOLONG` により止まる問題を修正した。`execution/grade/generated/runs/` をサイトの対象から外した。

### 5.4. 確認

- `npx vitest run` で `exec-record-paths.test.ts`（17 件）が通ることを確認した。親の検証は runner が実行する。
- 統合の後に、オーケストレーターが長い名前の grade の記録を持つ試しのリポジトリでサイトをビルドして確かめる（executor では実行できないため未実施）。

## 6. 関連ドキュメント

- 派生元: PJR-FZQA
