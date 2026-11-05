---
specdojo:
  id: prj-0001:pjr-pe19-epic-based-overall-plan
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  registered_at: "2026-11-05T22:54:36Z"
  block_reason: "parent validation failed: lint-ts, typecheck, test-unit"
  derived_from:
    - PJR-VYSC
---

# PJR-PE19 timeline を非推奨にし、全体計画を epic から作る

## 1. 概要

epic に domains を持たせ、dashboard の全体計画・strategy の範囲・カタログの検出を epic から作り、tml-index.yaml と timeline build を非推奨にする

## 2. 入力

- 由来: PJR-VYSC の決定。timeline の概念を非推奨にし、全体計画を epic から作る（2026-11-06）
- orchestrator の調査: tml-index.yaml は順序・依存のほか、track と domain の対応（strategy の範囲・catalog-scaffold の検出）、`catalog_status`（register から導出済み）、`planned_start_date` と推定日数、epic と strategy-planning の track の確認に使われている。稼働日のカレンダーは sch-defaults.yaml にある（2026-11-06）

## 3. 完了条件

- epic の frontmatter に任意の `domains`（文字列の配列）を足す（`docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`）。epic 以外の項目に書くとエラーにする。`register add --type epic` で `--domain` を繰り返し指定でき、`register update` で置き換えられる。
- `dashboard build` の全体計画（ガント）を epic から作る。順序は epic の `depends_on`。期間は、完了した epic が着手から完了まで、進行中の epic が着手から `due_on` まで、未着手の epic が先行の epic の終わりから `due_on` まで。稼働日は `sch-defaults.yaml` のカレンダーで数える。出力は `execution/generated/` の下に置く。
- _UNDECIDED_: `due_on` がない epic の期間の表し方。executor が決め、理由を個票の対応結果に書く。
- strategy の生成とカタログの検出（`catalog-scaffold`）は、track の範囲を、既存の strategy の scope、その track を担う epic の `domains`、`tml-index.yaml`（あれば）の順で決める。
- epic の起票と strategy-planning の track の確認を、`tml-index.yaml` にあるかから、epic どうしで track が重複しないことと、strategy-planning の対象 track を担う epic があることに変える。
- 互換: `tml-index.yaml` があれば今までどおり読み、非推奨の警告を 1 回出す。`timeline build` のコマンドと `timeline_path` の設定キーは残し、非推奨の警告を出す。
- `register build` が、epic の `depends_on` の循環と、epic どうしの track の重複をエラーにする。
- 単体テストを足す（`domains` の検証、期間の 3 つの規則、範囲の解決の優先順、古い `tml-index.yaml` の読み込みと警告、循環の検出、track の重複の検出）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run validate:schema` が通り、親の検証が通る。
- CHANGELOG は未公開の版の節に、非推奨と移行の方法を書き、公開済みの版の節を変えない。
- 保護された設定（`package.json`・agent の定義・`exec-defaults.yaml` など）は変えない。変更が要る場合は、案を個票の対応結果に書き、pipeline では報告の `handoff` にも書く。
- 文書・Kata・prj-0001 のデータは変えない（PJR-JM29 で扱う）。

## 4. 作業内容

| No  | 作業                                                        | 担当     | 状態 | メモ |
| --- | ----------------------------------------------------------- | -------- | ---- | ---- |
| 1   | epic のスキーマと CLI に `domains` を足す                   | executor | done | -    |
| 2   | dashboard の全体計画を epic から作る                        | executor | done | -    |
| 3   | strategy の範囲・カタログの検出・track の確認を epic へ移す | executor | done | -    |
| 4   | 非推奨の警告と検査を足す                                    | executor | done | -    |
| 5   | テストと CHANGELOG を足す                                   | executor | done | -    |

## 5. 対応結果

- epic の任意 `domains` を frontmatter schema、読み書き、起票・更新 CLI、外部 project への起票、監査 event と event の再適用に追加した。`--domain` は繰り返し指定で置き換え、更新時の `--domain -` で削除できる。epic 以外への指定、不正な配列、track の重複を拒否する。
- `dashboard build` の全体計画は epic の `depends_on` をたどり、着手 event と `completed_at` / `due_on` から期間を求める。稼働日数は `sch-defaults.yaml` のカレンダーで両端を含めて数え、未着手 epic は先行 epic の最も遅い終了日の翌稼働日から始める。ガントと `catalog-scaffold.md` は `execution/generated/` に出力する。
- 期間の判断: `due_on` のない未完了 epic は終了日と稼働日数を未定とし、開始日が分かれば開始点を表示する。期限を推測すると依存先の予定まで架空になるため、先行 epic の終了日が未定なら後続の開始日も未定とする。先行 epic のない未着手項目、および着手 event のない既存項目も、開始日を推測せず未定と表示する。完了した epic は期限の有無にかかわらず実際の完了日を使う。
- strategy の scope と未作成カタログの検出は共通の範囲解決を使い、既存 strategy の scope、epic の `domains`、互換用 `tml-index.yaml` の順に優先する。空の scope / `domains` も明示指定として尊重する。strategy-planning には対象 track を担う epic を必須とし、`register build` は epic の依存循環と track の重複を検出する。
- 旧 timeline の読み込み、`timeline build`、`timeline_path` は互換のため維持し、それぞれプロセス内で一度だけ非推奨警告を出す。epic がない project の dashboard は旧 timeline の表示を維持する。未公開版の CHANGELOG に移行方法を追記した。
- schema・CLI・期間の3規則・休日・複数先行項目・期限未定・範囲の優先順・物理分割カタログ・旧形式と警告・循環・重複・dashboard 出力のテストを追加した。型検査、各 lint、単体・統合テスト、全体 schema 検証は親 runner の担当である。executor の実行検証は後段の report に記録する。
- 保護された設定の変更は不要。文書・Kata・prj-0001 の計画データの移行は PJR-JM29 の範囲として残す。統合後の register / exec の運用確認は運用メモに従って PJR-JSEY で行う。

## 6. 関連ドキュメント

- PJR-VYSC: 由来の decision
- PJR-JM29: 後続の文書の todo
