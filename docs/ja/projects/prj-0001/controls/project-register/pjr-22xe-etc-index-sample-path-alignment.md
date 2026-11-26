---
specdojo:
  id: prj-0001:pjr-22xe-etc-index-sample-path-alignment
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-23T04:55:59Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-26T12:15:44Z"
  conclusion: etc-index-sample の外部結合テストの経路を tsp-index・itc-index とそろえた
  derived_from:
    - PJR-30PT
  commit_type: docs
  commit_scope: kata
---

# PJR-22XE etc-index-sample の外部結合テストの経路を tsp-index・itc-index とそろえる

## 1. 概要

2026-11-23 の grade で、`etc-index-sample` と先行 sample の `PATH-04`〜`PATH-07` の分担に矛盾が指摘された。現在の先行 sample に合わせ、取得・回復を含む担当カタログと外部結合テストの確認範囲を明示する。

## 2. 入力

- 利用者の決定（2026-11-23）: オーケストレーターの推奨どおり起票する

## 3. 完了条件

- `etc-index-sample` の外部結合テストの経路（`PATH-04`〜`PATH-07`）を、`based_on` の `tsp-index-sample`・`itc-index-sample` とそろえる。保全の取得（`PATH-04`）と復元の回復（`PATH-07`）を、どのテストのカタログが扱うかを決め、`backup-storage` の経路と観点（復元の回復を含む）を補う。3 つの sample のどれを直すかは executor が決め、理由を個票の対応結果に書く。
- 2026-11-23 の grade（needs-work 86）の minor のうち、分割の閾値の境界（rulebook の「15 以上・50 行以上」にそろえる）、遅延の具体値、非機能の観点の型、トレース列の ID の 4 件も直す。担当の Role code を示す 2 件は、PJR-76N9 の決まりで採らない。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                          | 担当         | 状態 | メモ                                                                                                                |
| --- | ------------------------------------------------------------- | ------------ | ---- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | 先行 sample と経路・担当カタログを照合し、ET の分担を補足する | executor     | done | 取得・回復は `itc-backup-restore`、転送・読取は `etc-backup-storage` と明示。復元コピーの検証と回復要求の観測を追加 |
| 2   | minor 4件を現行の本文・rulebook と照合する                    | executor     | done | 分割閾値・遅延値・非機能の型・トレース ID は既に反映済み。対応結果に根拠を記録                                      |
| 3   | 整形・カタログ検証・履歴リンク検査と結果の記録                | executor     | done | Prettier、カタログ検証、履歴リンク検査、差分の空白検査を通過                                                        |
| 4   | 親検証を実行する                                              | runner       | open | pipeline の指定に従い executor 終了後に runner が lint・テスト等を実行する。executor では重複実行しない             |
| 5   | 統合後に型の grade を実行する                                 | orchestrator | open | 完了条件に従い executor は実行しない。統合後に rulebook と sample の両方の verdict を確認する                       |

## 5. 対応結果

### 5.1. 変更内容と判断

- 変更する sample は [[specdojo:etc-index-sample|外部結合テストカタログ 概要]] のみとした。現行の [[specdojo:tsp-index-sample|テスト戦略・方針]] の 2.1・4.2 と [[specdojo:itc-index-sample|内部結合テストカタログ 概要]] の 1〜4・7 章は、取得（`PATH-04`）・回復（`PATH-07`）を内部結合の `itc-backup-restore`、転送（`PATH-05`）・読取（`PATH-06`）を外部結合の `etc-backup-storage` に分担している。grade 当時と前提が変わっており、DB との内部経路を ET に移すより、現行の分担を明示する方が重複を防げる。
- `etc-index-sample` の 2・3 章に取得・回復の担当と除外理由を記載した。`backup-storage` は転送・読取・検証と回復処理への引渡しを担い、4〜6 章に破損コピーの条件、復元読取失敗時の回復停止、コピー・復元先・回復要求回数の観測を補った。DB 回復の正しさは IT、実接続での取得から業務再開までの代表シナリオは ST に委ねる。
- 削除し損ねたコピーの片付けは、既に頻度と経過日数が決まっている運用方針として 7 章へ移した。実行中のテストのコピーを削除対象から外し、文書の担当 Role code は追加しない。

### 5.2. minor の照合結果

2026-11-23 の grade（needs-work 86）のうち、完了条件で指定された4件は、着手時の本文に反映されていたため維持した。

| finding                | 確認箇所 | 現行の記述・根拠                                                                                                                         |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| F009: 分割閾値         | 2章      | 観点15以上・ケース表50行以上で見直す。rulebook の 6.2 と境界が一致                                                                       |
| F005: 遅延の具体値     | 5・7章   | 印刷9秒・保管29秒。応答待ち上限10秒・30秒の1秒前                                                                                         |
| F006: 非機能の観点の型 | 4章      | 応答待ち上限、再送回数・間隔の遵守を明記                                                                                                 |
| F007: トレース列の ID  | 8章      | `TR-01,TR-05`。[[specdojo:etc-sample\|レシート印刷連携カタログ]] の5章で `specdojo:tsp-index-sample`・`specdojo:etc-index-sample` に対応 |

担当の Role code を求める2件は、完了条件と [[prj-0001:pjr-76n9-no-role-assignment-in-documents|PJR-76N9]] に従い採用しない。

### 5.3. 検証と申し送り

- `npx prettier --write docs/ja/specdojo/samples/etc-index-sample.md docs/ja/projects/prj-0001/controls/project-register/pjr-22xe-etc-index-sample-path-alignment.md`: 整形済み。
- `node --import tsx tools/catalog-validate-if-configured.mjs`: 終了コード0。未配置文書や再エクスポートのみの証跡参照など、今回変更していないカタログの警告あり。
- `npm run validate:history-links`: 終了コード0。履歴リンク検査を通過。
- `git diff --check`: 終了コード0。空白の不備なし。
- `npm run lint:md`・`npm run lint:fm` を含む親検証は、pipeline の指定に従い runner が実行する。
- 統合後、orchestrator は `etc-index` の型（rulebook と sample）を grade し、両方の verdict が `pass` であることを確認する。executor は grade を実行していない。
- 保護された設定の変更は不要。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: 外部結合テストカタログの sample で、保全・復元の経路と内部結合テストとの分担を明示し、復元用コピーの検証・回復処理への引渡しの観点を補足した。

## 6. 関連ドキュメント

- [[specdojo:etc-index-rulebook|外部結合テストカタログ概要 作成ルール]]
- [[specdojo:etc-index-sample|外部結合テストカタログ 概要]]
- [[specdojo:tsp-index-sample|テスト戦略・方針]]
- [[specdojo:itc-index-sample|内部結合テストカタログ 概要]]
- [[specdojo:ifd-sample|インフラ構成図]]
- [[prj-0001:pjr-76n9-no-role-assignment-in-documents|PJR-76N9]]
