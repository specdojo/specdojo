---
specdojo:
  id: prj-0001:pjr-zffz-cdfd-3-stsd-cstd
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-12T09:35:22Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-27T15:12:30Z"
  conclusion: cdfd 3 ファイルの状態・分類の詳細を stsd-register-entry・stsd-routine-run・cdsd-planning・cdsd-execution・cdsd-sharing へ移設し、移設元は参照だけにした。note の扱いは pjr-rulebook どおり終端しない定義とした
---

# PJR-ZFFZ cdfd 3ファイルの状態・分類詳細をstsd/cstd等へ移設

## 1. 概要

cdfd-register-lifecycle.md（2.1/2.2/2.3）、cdfd-routine.md（2.1/2.2）、cdfd-reporting.md（2.1）にある状態定義・type分類・データ正本の詳細記載は、対応するステータス定義（stsd）・データストア定義（cdsd）等の文書を作成する際に、そちらへ移設し、cdfd側は参照へ簡潔化する。状態一覧と状態遷移図は STSD 一文書へ統合する。

## 2. 完了条件

- 対象3ファイルの該当サブセクションが、移設先文書への参照だけを残した簡潔な記述に置き換わっている。
- 移設先の stsd・cdsd（いずれも本 todo の対象範囲に応じて必要な分だけ）が作成され、移設した内容が反映されている。
- `npm run lint:md` と `specdojo catalog validate` が通過している。

## 3. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ                                                                                                                                                              |
| --- | ------------------------------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 移設先文書（stsd-specdojo・cdsd-specdojo 等）の要否と ID を確定する | ARC  | done | 状態一覧・状態遷移図は `stsd-specdojo` に統合する。データ正本は `cdsd-specdojo` とし、独立した CSTD は作成しない。既存カタログの `depends_on` を作業 2 で確認する |
| 2   | 対象文書を作成し、3ファイルの該当箇所から内容を移設する             | ARC  | done | `stsd-register-entry`・`stsd-routine-run`・`cdsd-planning`・`cdsd-execution`・`cdsd-sharing` を作成し、該当箇所の内容を移設した                                   |
| 3   | 移設元3ファイルの該当サブセクションを参照ポインタへ簡潔化する       | ARC  | done | 対象サブセクションを移設先への参照だけの記述に置き換えた                                                                                                          |

## 4. 対応結果

- 移設先として `docs/ja/product/010-business-specs/020-data-model/` 配下に次の5文書を作成した（いずれも `status: draft`）。
  - [[prj-0001:stsd-register-entry]]: 登録簿ライフサイクルの 2.2（状態・日時・結論の記録規則）と 2.3（type 別の審査と承認方式）を、状態一覧・状態遷移図・遷移の説明へ統合した。`note` は審査・終了の対象外で `open` のまま記録を更新する非終端の扱いに改め、grade の finding（`note` を `done` へ遷移させる定義）を解消した。
  - [[prj-0001:stsd-routine-run]]: 定期処理の 2.1（due 判定）と 2.2（結果記録と次回判定）を移設した。
  - [[prj-0001:cdsd-planning]]: 登録簿ライフサイクルの 2.1（登録判断と Schedule との境界）と、進捗監視・報告 2.1 のうち Schedule・登録項目個票の行を移設した。
  - [[prj-0001:cdsd-execution]]: 進捗監視・報告 2.1 の実行 event と、定期処理のデータストア（定期処理定義・routine 実行状態・Job Definition・Job Run 履歴）を定義した。
  - [[prj-0001:cdsd-sharing]]: 進捗監視・報告 2.1 の派生情報・監査履歴・費用・作業記録・監視結果・報告記録の行を移設した。
- 移設元 [[prj-0001:cdfd-register-lifecycle]]（2.1〜2.3）、[[prj-0001:cdfd-routine]]（2.1・2.2）、[[prj-0001:cdfd-reporting]]（2.1）は移設先への参照だけの記述に置き換えた。あわせて `cdfd-register-lifecycle` の `based_on` に `prj-0001:cdfd-overview` を追加した。
- 残課題: 新規5文書の `based_on` は、根拠となる業務データ辞書（`bdd-*`）が未作成のため空とし、各文書の検討メモまたは概要に _TODO_ として残した。

## 5. 関連ドキュメント

- [[prj-0001:cdfd-register-lifecycle]]（2.1・2.2・2.3が対象）
- [[prj-0001:cdfd-routine]]（2.1・2.2が対象）
- [[prj-0001:cdfd-reporting]]（2.1が対象）
