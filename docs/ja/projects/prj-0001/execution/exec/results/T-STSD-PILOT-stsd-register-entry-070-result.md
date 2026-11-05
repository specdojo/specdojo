---
specdojo:
  id: prj-0001:xer-t-stsd-pilot-stsd-register-entry-070
  type: exec-result
  task_id: T-STSD-PILOT-stsd-register-entry-070
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-STSD-PILOT-stsd-register-entry-070-plan.md
  started_at: "2026-11-05T12:52:01.076Z"
  completed_at: "2026-11-05T13:45:15.038Z"
  agent: sol-executor
  execution: agent
  approach: fully-guided
  targets:
    - stsd-register-entry
---

# Edit Result

## 1. 実施内容

- ステータス定義（`stsd-register-entry`）の磨き込みを実施しました。
- 現行の運用（直接の終端および再開経路）を反映させるため、状態遷移の図表を整理・拡充しました。具体的には、直接終端 10 経路（`T-19`〜`T-28`）および直接再開 12 経路（`T-29`〜`T-40`）を定義し、再開時の条件を明記しました。
- 各種 `finding` に基づき、`status` と `item_status` の区別、待機理由を `block_reason` へ記録する運用、`note` に対する `close`・`reject`・`defer` の拒否といった実装制約を反映しました。
- また、状態遷移の操作に関連する主要な更新キー、および `register build` における検証・整合検査の範囲についても追記しました。
- 未作成の依存成果物（`bdd-register-entry`）および、実装詳細（`schema` や関連テスト）との整合性確認については、今後の検討事項として `_TODO_` および `_ASSUMPTION_` にて申し送っています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-register-entry.md`: ステータス定義の磨き込みを実施しました。状態遷移図を整理し、直接終端（`T-19`〜`T-28`）および直接再開（`T-29`〜`T-40`）の経路を定義しました。また、`finding` に基づき、`block_reason` の活用、`note` に対するコマンドの拒否制約、および `register build` 時の検証観点を加筆しました。未作成の依存成果物や未承認の実装差異については、`_TODO_` または `_ASSUMPTION_` として残しています。

## 3. 申し送り

- 変更した成果物は `docs/ja/product/010-business-specs/020-data-model/stsd-register-entry.md` のみ。`status: draft`、`based_on: []`、既存 T-ID を維持した。result、plan、既存 evidence、grade result サイドカーは更新していない。以下の判断根拠と未解消事項を reporter が result の「進め方と実践の型の適用」へ転記すること。
- 実践の型の適用: 指定 rulebook 2件、recipe、sample、プロジェクト概要、PJR-PT5N、共通規約、AGENTS.md、playbook、カタログの対象項目、指定実装エビデンス5件を参照した。rulebook を構造・図表対応、recipe を条件の判定可能性、sample を形式確認に使用した。対象 template は読んでいない。40遷移で分割閾値を超えるため、既存の三図を活動・終了判断・再開へ整理した。
- F001・F007・F010・F011: plan の現行運用指摘を追加実装エビデンスと照合し、直接終端10経路を T-19〜T-28、直接再開12経路を T-29〜T-40 として追加した。再開先の選択を条件に明記した。F002 の従来の直接終端・直接再開に関する未確認メモ M-02・M-03 は本文へ反映して統合した。旧履歴変換の説明は、現在の許可条件の根拠として使えないため現在動作との対応へ置き換えた。
- F006・F008・F009・F019・F021・F024: 先行修正の BV-03 への寄与、担当・期限未定の扱い、`status` と `item_status` の区別、外部 event への記録、待機理由の `block_reason` への記録と `conclusion` の保持を維持・補強した。着手・審査提出・終了・再開の pass / fail 条件を共通条件へ集約した。AC-02 の定義本体は参照範囲外のため、その対応付けは確定していない。
- F012・F014・F015・F017・F016: `note` の close・reject・defer 拒否、活動中・終端ガード、延期の完了日時非付与、再開時の完了日時削除、待機離脱時の `block_reason` 削除を反映した。各 T-ID と操作・主要更新キー・拒否条件を対応付け、後続検証の期待結果と `register build` の整合検査範囲を記載した。影響先として指定実装5件、register item/event schema、関連テスト、P0JR rulebook、運用ガイドを列挙した。schema・関連テスト・運用規則の本文は宣言参照外のため読んでおらず、既存テストの網羅と schema の一致確認は後続作業として残る。
- F002・F004・F018・F022・F023・F025: M-01 に業務条件と CLI の未承認差異を残した。CLI は承認・証跡・結論・待機理由を必須化せず、明示 close の type 別制限、`note` の活動中操作、起票時の非 open 指定にも差異がある。起票済み・待機中から審査待ち、審査待ちから対応中への直接変更は実装で可能だが、承認根拠がないため業務図表へ追加していない。PO・ARC・QE が採否と自動強制範囲を決定し、PM が issue・decision・必要な change-request と Schedule に接続する。採否別の反映先と後続作業への影響は本文へ記録した。
- F003・F004・F005・F013・F020: `bdd-register-entry` は未作成であり、推測による作成や `based_on` 追加は行っていない。M-04 に辞書作成・確認、用語照學、不整合修正、参照追加の順序と完了条件を残した。BA による辞書作成と、PM による実在する PJR ID・Schedule への接続が必要である。接続先と日程を参照できないため創作していない。
- 未解消判定: M-01 の未承認差異、M-04 の依存未作成、実 PJR・Schedule への接続、schema・関連テストとの照合が残るため、F003〜F005・F013・F014・F017・F018・F020・F022・F025 の完全解消および全 done criteria 達成は主張しない。今回の許可範囲内の編集・検証は完了している。親 runner 指定の lint・schema・型検査・テストは実行していない。
- F012・F014・F015・F017・F016: `note` の close・reject・defer 拒否、活動中・終端ガード、延期の完了日時非付与、再開時の完了日時削除、待機離脱時の `block_reason` 削除を反映した。各 T-ID と操作・主要更新キー・拒否条件を対応付け、後続検証の期待結果と `register build` の整合検査範囲を記載した。影響先として指定実装5件、register item/event schema、関連テスト、PJR rulebook、運用ガイドを列挙した。schema・関連テスト・運用規則の本文は宣言参照外のため読んでおらず、既存テストの網羅と schema の一致確認は後続作業として残る。
- F003・F004・F005・F013・F020: `bdd-register-entry` は未作成であり、推測による作成や `based_on` 追加は行っていない。M-04 に辞書作成・確認、用語照合、不整合修正、参照追加の順序と完了条件を残した。BA による辞書作成と、PM による実在する PJR ID・Schedule への接続が必要である。接続先と日程を参照できないため創作していない。
- 適用外の検証: `npm run validate:schema:file`（executor が変更した YAML ファイルがない。）
- 適用外の検証: `npm run validate:history-links`（executor は PJR 個票・既存 plan・result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor による docs/ja/projects/ 配下の成果物変更がない。）

## 4. 進め方と実践の型の適用

fully-guided 方式を用い、既存の `stsd-register-entry.md` に対して、`grade result` で指摘された `finding` を解消するための加筆・修正を実施しました。既存の記述を尊重しつつ、実装エビデンス（`src/register/` 以下の動作）と整合させる形で、状態遷移の網羅性（直接終端・直接再開経路）と、各状態における属性更新の制約（`block_reason` の扱い等）を定義しました。不明な依存関係や、schema/テストとの詳細な整合性については、`_TODO_` または `_ASSUMPTION_` として論点を整理し、次工程への申し送りに留めています。
