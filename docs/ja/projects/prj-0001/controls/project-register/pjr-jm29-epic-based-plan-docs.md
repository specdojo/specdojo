---
specdojo:
  id: prj-0001:pjr-jm29-epic-based-plan-docs
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  registered_at: "2026-11-05T22:55:07Z"
  completed_at: "2026-11-06T00:59:41Z"
  conclusion: tml の Kata を deprecated にし、ガイド 3 本・リファレンス 2 本・rulebook 2 本を epic ベースの全体計画に直した。epic 3 件に domains を記入し、dct-planning から tml-index を外し、tml-index.yaml は非推奨の注記付きで残した
  derived_from:
    - PJR-VYSC
  depends_on:
    - PJR-PE19
---

# PJR-JM29 文書と Kata と prj-0001 を epic ベースの全体計画に移す

## 1. 概要

tml の Kata を非推奨にし、ガイドとリファレンスを epic ベースの説明に直し、prj-0001 の epic に domains を書いて全体計画を確かめる

## 2. 入力

- 由来: PJR-VYSC の決定。runner とスキーマの変更は PJR-PE19 で行う（2026-11-06）
- 利用者の決定: epic がない track は全体計画に出さない（2026-11-06）

## 3. 完了条件

- `tml-rulebook.md` と `tml-sample.yaml` を `status: deprecated` にし、冒頭に全体計画は epic で管理することと移行先を書く。
- `timeline-design-guide.md` は非推奨の旨と移行の手順だけを残す。`docs-structure-guide`・`register-operation-guide`・`specdojo-overview-guide`・`specdojo-config-reference`・`command-reference`・`pjr-rulebook`・`dct-rulebook` の timeline の説明を epic ベースの全体計画に直す。
- prj-0001 の epic 3 件（PJR-3APD・PJR-GQN3・PJR-GEZN）に `domains` を書く。値は各個票の範囲の章と、今の `tml-index.yaml` から取る。
- `dct-planning.yaml` から `tml-index` の項目を外す。外せない依存（`depends_on: [tml-index]` など）があれば `_UNDECIDED_` として残し、理由を個票の対応結果に書く。
- prj-0001 の `tml-index.yaml` は消さず、冒頭のコメントに非推奨と書く。削除は利用者が判断する。
- `dashboard build` を実行し、全体計画に epic の 3 件が出て、epic のない track が出ないことを確かめ、結果を個票の対応結果に書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog`・`npm run docs:build` が通る。
- runner のコードは変えない。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。
- 保護された設定（`package.json`・agent の定義・`exec-defaults.yaml` など）は変えない。変更が要る場合は、案を個票の対応結果に書き、pipeline では報告の `handoff` にも書く。

## 4. 作業内容

| No  | 作業                                          | 担当     | 状態 | メモ |
| --- | --------------------------------------------- | -------- | ---- | ---- |
| 1   | tml の Kata を非推奨にする                    | executor | done | -    |
| 2   | ガイドとリファレンスを直す                    | executor | done | -    |
| 3   | prj-0001 の epic とカタログと timeline を直す | executor | done | -    |
| 4   | dashboard で全体計画を確かめる                | executor | done | -    |

## 5. 対応結果

- `tml-rulebook.md` と `tml-sample.yaml` を `deprecated` にし、冒頭に epic への移行先を示した。`timeline-design-guide.md` は非推奨と移行手順・互換運用だけに絞った。
- 再開時に、移行ガイドへ必須の英語名と導入ブロックを補い、固定サイドバーから非推奨の tml rulebook・sample を外した。前回の親検証で報告された `lint:fm` と非推奨 Kata 混入の失敗原因を修正し、再検証は親 runner に委ねる。
- `docs-structure-guide`・`register-operation-guide`・`specdojo-overview-guide`・`specdojo-config-reference`・`command-reference`・`pjr-rulebook`・`dct-rulebook` を更新し、全体計画の正本、期間の規則と未定の扱い、範囲解決の優先順、CLI の `--domain`、旧形式の互換期間を記載した。CHANGELOG は未公開版へ追記した。
- PJR-3APD に `domains: [data-model]`、PJR-GQN3・PJR-GEZN に `domains: [data-flow]` を記録した。個票の範囲と旧 timeline の対応から採り、PJR-GEZN の未記入だった範囲は概要・strategy の 4 文書の scope で補った。epic 間の依存は由来や旧順序から推測して追加していない。
- `dct-planning.yaml` の `tml-index` のグループを外し、`sch-defaults` の `depends_on: [tml-index]` を空配列へ変更した。カレンダー・開始日の正本には旧 timeline の入力がなく独立して定義でき、残す必要のある依存はなかった。prj-0001 の `tml-index.yaml` は冒頭に非推奨コメントを加えて保持した。削除は利用者の判断に委ねる。
- `node --import tsx src/specdojo.ts dashboard build --project prj-0001` が成功した。`execution/generated/dashboard.md` の全体計画と `dashboard-timeline-gantt.svg` に `stsd-pilot`（PJR-3APD）・`data-flow-usage`（PJR-GEZN）・`data-flow-uc-rewrite`（PJR-GQN3）の 3 件を確認し、旧 timeline のほかの 20 track が出ないことを照合した。3 件とも開始日は未定、終了日は 3APD が 2026-11-30、GEZN・GQN3 が 2026-11-03。着手記録や epic 間の依存がない箇所を架空の日付で補っていない。
- Prettier 整形、register / catalog / YAML 表示ページの生成、カタログ検査、変更 YAML 3 件の schema 検査、履歴リンク検査が成功した。カタログ検査には既存の未作成文書・re-export 参照の警告があるがエラーはない。Markdown・frontmatter などの lint とテストは設定された親 runner の検証に委ねる。
- 申し送り: フルの `npm run docs:build` は `docs:generate` 内で `index build` を実行し、executor が書き込み禁止の `.specdojo/doc-index.json` を更新するため、ホスト側で実行して成否を確認する必要がある。代わりに `npm --prefix packages/docs-site run docs:build` を試したが Mermaid の SVG 生成で終了コード 1 となった。最小の図でも Chromium が `sandbox_host_linux.cc` の `Operation not permitted` で起動できないことを確認したため、sandbox 外でのビルドが必要である。runner のコードと保護された設定の変更は不要だった。

## 6. 関連ドキュメント

- PJR-VYSC: 由来の decision
- PJR-PE19: 先行の実装の todo
- [[specdojo:tml-rulebook]]: 非推奨にする Kata
