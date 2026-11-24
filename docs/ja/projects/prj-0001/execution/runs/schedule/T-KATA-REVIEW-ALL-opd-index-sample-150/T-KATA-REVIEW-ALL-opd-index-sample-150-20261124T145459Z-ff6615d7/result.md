---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-index-sample-150-20261124t145459z-ff6615d7
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-index-sample-150/T-KATA-REVIEW-ALL-opd-index-sample-150-20261124T145459Z-ff6615d7/plan.md
  started_at: "2026-11-24T14:55:08.222Z"
  completed_at: "2026-11-24T15:09:23.093Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-index-sample
    - specdojo:opd-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`opd-index-sample` を同じ接頭辞の sample、wikilink の参照先、用語集、共通サンプル文脈と照合し、sample 側の食い違い 5 件を修正しました（R5-1〜R5-5）。
- 相手側を直すべき点 6 件（R5-6〜R5-11）は変更せず、直す案を handoff に記録しました。そのうち 3 件（R5-8・R5-9・R5-10）は要判断です。
- grade の F001 は R4、F002 は R2、F003 は R3 で解消済みのため、今回の指摘として繰り返していません。
- 整形と差分検査は通過しました。runner 検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed でした。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-index-sample.md`: 仮置きの ID と「予定」で参照していた分冊・手順を、実在する sample への wikilink に置き換え、12 章の 5 文書を「作成済」にしました。非機能要件の未決値の同期対象を稼働率・RTO・RPO に明確化しました。稼働の測定は、監視記録と障害記録の停止時間を重複を除いて集計する方法に変更し、証跡に監視記録を加えました。暫定 RTO は、翌営業日の開店までに復元して記録を再開する条件にしました。日次締めを翌朝へ持ち越す場合も、閉店後にバックアップを取得すると補いました。

## 3. 申し送り

- R5 の各指摘は、実施内容の表の 1 件ずつに対応します。要判断は R5-8（`OPS` のアカウント対象と兼務）、R5-9（退任当日の剥奪と 3 か月停止の関係）、R5-10（紙への切替の判断者と時機）です。
- 相手側の修正案は R5-6（監視分冊の確認対象）、R5-7（バックアップの呼称統一）、R5-8〜R5-10（権限分冊と可用性要件）、R5-11（障害対応手順の照合者）で、いずれも変更していません。
- reporter 向け: R5 の指摘を、以下の項目から result の実施内容へ指定列の Markdown 表として1回だけ記載してください。申し送りに指摘の表を重ねないでください。表セル内の wikilink の区切りはエスケープしてください。executor は result を編集していません。
- R5-1: R5 / 箇所: 1. 概要、5. 監視・アラート方針、6. 障害対応方針、9. 権限・アカウント運用、12. 関連ドキュメント導線 / 指摘: 実在する分冊・手順を仮置きの ID と「予定」で参照していた。 / 直した案: 対応する sample への wikilink に置き換え、12章の5文書を「作成済」とした。 / 根拠: `vp-qe-kata-conformance`、Sample 記述標準6・8章。参照先5文書の存在と frontmatter の ID を確認した。 / 印: -
- R5-2: R5 / 箇所: 2. 運用の範囲・前提 / 指摘: 参照する非機能要件の目標値を一括して未決と説明していたが、運用要件には一次連絡15分以内などの具体値がある。 / 直した案: 非機能要件を前提とすることを示し、上位要件との未決値の同期対象を稼働率・RTO・RPO と明記した。 / 根拠: `vp-qe-kata-conformance`。[[specdojo:nfr-availability-sample|可用性要件]]3・6章と[[specdojo:nfr-operations-sample|運用要件]]3章。 / 印: -
- R5-3: R5 / 箇所: 3. SLO・SLA・KPI / 指摘: 稼働の測定が手動の障害記録の停止時間の合計だけで、可用性要件の測定元・稼働率算出と揃っていなかった。 / 直した案: 監視と障害記録の停止時間を重複を除いて集計し、営業時間に対する稼働率を算出する方法へ変更した。証跡に監視記録を加えた。 / 根拠: `vp-qe-kata-conformance`。[[specdojo:nfr-availability-sample|可用性要件]]4章の `nfr-avl-001`。目標未決時に達成・未達を判定しない扱いは維持した。 / 印: -
- R5-4: R5 / 箇所: 8. バックアップ・リストア方針 / 指摘: 暫定 RTO の終点が復元だけで、可用性要件が求める記録の再開まで含んでいなかった。 / 直した案: 翌営業日の開店までに復元して記録を再開する条件にした。 / 根拠: `vp-qe-kata-conformance`。[[specdojo:nfr-availability-sample|可用性要件]]3・4・6章の `nfr-avl-002`。 / 印: -
- R5-5: R5 / 箇所: 8. バックアップ・リストア方針 / 指摘: 取得を日次締め後に限る記述では、障害対応分冊の日次締めを持ち越してもバックアップを止めない方針を読み取れない。 / 直した案: 日次締めを翌朝へ持ち越す場合も、締め直しを待たず閉店後に取得すると補った。 / 根拠: `vp-qe-kata-conformance`。[[specdojo:opd-incident-management-sample|運用方針・設計（障害対応）]]2.2のP2、[[specdojo:opr-incident-sample|運用手順（障害対応）]]4.4、[[specdojo:nfr-operations-sample|運用要件]]の `nfr-ops-003`。 / 印: -
- R5-6: R5 / 箇所: 対象外の監視分冊2.2 / 指摘: 開店前9:30に当日分のバックアップ成功記録を確認する記述が、対象 sample 5・8章の前日の閉店後の取得と食い違う。 / 直した案: - / 根拠: `vp-qe-kata-conformance`、`vp-dev-change-impact`。[[specdojo:opd-monitoring-sample|運用方針・設計（監視）]]2.2の確認対象を「前日の閉店後の成功記録」へ直す案。9:30という確認時刻の具体化は維持する。R4ですでに申し送られた運用手順全体構成の同種の指摘は再掲していない。 / 印: -
- R5-7: R5 / 箇所: 対象外の監視分冊・障害対応分冊・運用要件 / 指摘: 同じ取得作業を対象 sample は「閉店後のバックアップ」、関連文書は「夜間バックアップ」と呼んでいる。 / 直した案: - / 根拠: `vp-qe-kata-conformance`、Sample 記述標準2・6章。[[specdojo:opd-monitoring-sample|監視分冊]]、[[specdojo:opd-incident-management-sample|障害対応分冊]]、[[specdojo:nfr-operations-sample|運用要件]]の当該作業の名称を「閉店後のバックアップ」に揃える案。対象内の呼称はR3で統一済みのため変更していない。 / 印: -
- R5-8: R5 / 箇所: 対象外の権限分冊2.1 / 指摘: 対象 sample 9章はアカウント対象を店番担当と `DEV` に限るが、権限分冊は `OPS` に運用区分を付与する。兼務との関係が明示されていない。 / 直した案: - / 根拠: `vp-qe-kata-conformance`。[[specdojo:opd-rulebook|運用方針・設計 作成ルール]]2章に従い index の統制を維持した。[[specdojo:opd-access-control-sample|権限分冊]]で、許可されたアカウント対象のうち `OPS` 兼務者へ運用区分を付ける条件と区分の併用条件を具体化する案。独立した `OPS` アカウントを認めて index を拡張する案は、兼務先・実行者の根拠が不足するため採らなかった。 / 印: 要判断
- R5-9: R5 / 箇所: 対象外の権限分冊2.2・2.4 / 指摘: index は店番をやめた当日の剥奪を定める一方、分冊には予定表から外れて3か月で停止する行があり、退任と一時休務の区別が不明である。 / 直した案: - / 根拠: `vp-qe-kata-conformance`。[[specdojo:opd-access-control-sample|権限分冊]]に退任当日の剥奪を明記し、3か月停止を一時休務の補足として残すなら条件と棚卸し対象の名簿を揃える案。退任を3か月待つ意味かどうか断定できないため、index の期限は変更しなかった。 / 印: 要判断
- R5-10: R5 / 箇所: 対象外の可用性要件1章 / 指摘: 可用性要件は記録できないと気付いた店番担当が紙へ切り替えるが、index 6章と障害対応分冊は30分経過時に `PO` が判断する。 / 直した案: - / 根拠: `vp-qe-kata-conformance`。[[specdojo:nfr-availability-sample|可用性要件]]1章の切替を、index と障害対応分冊の判断者・時機への参照に置き換える案。即時切替を必須要件として維持するなら index・分冊・手順全体の改訂が必要になる。上位要件の意図を確定できないため、R2が整えた対象内の判断者・時機を上書きしなかった。 / 印: 要判断
- R5-11: R5 / 箇所: 対象外の運用手順（障害対応）4.3 / 指摘: 紙から転記した件数・金額の照合者が、index 6章では `DEV`、手順4.3の手順5では `OPS` になっている。 / 直した案: - / 根拠: `vp-qe-kata-conformance`、`vp-dev-change-impact`。[[specdojo:opr-incident-sample|運用手順（障害対応）]]4.3の照合実施者を `DEV` に揃え、差異対応の役割も整える案。`OPS` による障害記録への結果記載は維持する。 / 印: -
- reporter 向け・進め方と実践の型の適用: 共通規約2文書、kata-guide 6.1・6.3・6.5、ryu-guide の実践の型メンテナンス、Sample 記述標準の共通サンプル文脈・構成・記述規則、opd-index-rulebook、opd-rulebook、同接頭辞の全5 sample、対象の wikilink 参照先、関連する運用手順2文書、用語集6文書の関連語検索と共通用語・ロールの定義、共通レビュー観点の該当判定根拠、grade サイドカー、R1〜R4の実施内容・申し送りを確認した。対象の `based_on` は空。両 rulebook の recipe・template は `not-needed`。運用用語の定義は rulebook に照合し、共通文脈の単一店舗・タブレット1台・役割名・KPI目標値を維持した。
- reporter 向け・判断根拠: `source=grade` F001はR4、F002はR2、F003はR3で解消済み。今回の指摘として繰り返していない。成果物由来の finding と `source=condense` の記録はplanにない。分冊との統制の食い違いでは opd-rulebook 2章に従い index を正とし、相手側の改訂案を記録した。判断が必要な点は各指摘の根拠と印に示した。12章構成、必須表、`status: draft`、`based_on`、人の最終判断、前段の修正を維持した。
- 変更ファイル: `docs/ja/specdojo/samples/opd-index-sample.md` のみ。result・grade サイドカー・設定・Git状態管理は編集していない。開始時から存在した未追跡の `pipeline-state.json` は触れていない。運用メモの場所は、npx の起動失敗後、`node --import tsx src/specdojo.ts where playbook --project prj-0001` で確認できた。指定された lint・テスト等は親 runner に委ね、重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown sample のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 内のみで、docs/ja/projects/ 配下に及ばない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票・既存 plan・result を変更していない。）
- 適用外の検証: `node tools/check-evidence-secrets.mjs --staged`（検査対象の実行記録を変更していない。Git のステージ操作は親 runner が担当する。）

## 4. 進め方と実践の型の適用

共通規約 2 文書、kata-guide、ryu-guide、Sample 記述標準の共通サンプル文脈、`opd-index-rulebook`、`opd-rulebook`、同接頭辞の sample 5 件、wikilink の参照先、関連する運用手順 2 文書、用語集を確認しました。対象の `based_on` は空で、両 rulebook の recipe・template は `not-needed` です。分冊との統制が食い違う場合は `opd-rulebook` 2 章に従って index を正とし、相手側の改訂案を記録しました。12 章構成、必須表、`status: draft`、人の最終判断、前段の修正は維持しました。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R5-1 | R5 | 1. 概要、5. 監視・アラート方針、6. 障害対応方針、9. 権限・アカウント運用、12. 関連ドキュメント導線 | 実在する分冊・手順を仮置きの ID と「予定」で参照していた。 | 対応する sample への wikilink に置き換え、12 章の 5 文書を「作成済」とした。 | `vp-qe-kata-conformance`、Sample 記述標準 6・8 章。参照先 5 文書の存在と frontmatter の ID を確認した。 | - | | R5-2 | R5 | 2. 運用の範囲・前提 | 参照する非機能要件の目標値を一括して未決と説明していたが、運用要件には一次連絡 15 分以内などの具体値がある。 | 非機能要件を前提とすることを示し、上位要件との未決値の同期対象を稼働率・RTO・RPO と明記した。 | `vp-qe-kata-conformance`。可用性要件 3・6 章、運用要件 3 章。 | - | | R5-3 | R5 | 3. SLO・SLA・KPI | 稼働の測定が手動の障害記録の停止時間の合計だけで、可用性要件の測定元・稼働率算出と揃っていなかった。 | 監視と障害記録の停止時間を重複を除いて集計し、営業時間に対する稼働率を算出する方法へ変更した。証跡に監視記録を加えた。 | `vp-qe-kata-conformance`。可用性要件 4 章の `nfr-avl-001`。目標未決時に達成・未達を判定しない扱いは維持した。 | - | | R5-4 | R5 | 8. バックアップ・リストア方針 | 暫定 RTO の終点が復元だけで、可用性要件が求める記録の再開まで含んでいなかった。 | 翌営業日の開店までに復元して記録を再開する条件にした。 | `vp-qe-kata-conformance`。可用性要件 3・4・6 章の `nfr-avl-002`。 | - | | R5-5 | R5 | 8. バックアップ・リストア方針 | 取得を日次締め後に限る記述では、日次締めを持ち越してもバックアップを止めない方針を読み取れない。 | 日次締めを翌朝へ持ち越す場合も、締め直しを待たず閉店後に取得すると補った。 | `vp-qe-kata-conformance`。障害対応分冊 2.2 の P2、障害対応手順 4.4、運用要件の `nfr-ops-003`。 | - | | R5-6 | R5 | 対象外の監視分冊 2.2 | 開店前 9:30 に当日分のバックアップ成功記録を確認する記述が、対象 sample 5・8 章の前日の閉店後の取得と食い違う。 | 変更なし。監視分冊の確認対象を「前日の閉店後の成功記録」へ直す案。9:30 という時刻は維持する。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`。R4 で申し送り済みの運用手順全体構成の同種の指摘は再掲していない。 | - | | R5-7 | R5 | 対象外の監視分冊・障害対応分冊・運用要件 | 同じ取得作業を対象 sample は「閉店後のバックアップ」、関連文書は「夜間バックアップ」と呼んでいる。 | 変更なし。3 文書の当該作業の名称を「閉店後のバックアップ」に揃える案。対象内の呼称は R3 で統一済み。 | `vp-qe-kata-conformance`、Sample 記述標準 2・6 章。 | - | | R5-8 | R5 | 対象外の権限分冊 2.1 | 対象 sample 9 章はアカウント対象を店番担当と `DEV` に限るが、権限分冊は `OPS` に運用区分を付与する。兼務との関係が明示されていない。 | 変更なし。許可されたアカウント対象のうち `OPS` 兼務者へ運用区分を付ける条件と、区分の併用条件を権限分冊で具体化する案。独立した `OPS` アカウントを認めて index を拡張する案は、兼務先・実行者の根拠が不足するため採らなかった。 | `vp-qe-kata-conformance`。`opd-rulebook` 2 章に従い index の統制を維持した。 | 要判断 | | R5-9 | R5 | 対象外の権限分冊 2.2・2.4 | index は店番をやめた当日の剥奪を定める一方、分冊には予定表から外れて 3 か月で停止する行があり、退任と一時休務の区別が不明である。 | 変更なし。権限分冊に退任当日の剥奪を明記し、3 か月停止を一時休務の補足として残すなら、条件と棚卸し対象の名簿を揃える案。 | `vp-qe-kata-conformance`。退任を 3 か月待つ意味かどうか断定できないため、index の期限は変更しなかった。 | 要判断 | | R5-10 | R5 | 対象外の可用性要件 1 章 | 可用性要件は、記録できないと気付いた店番担当が紙へ切り替える。index 6 章と障害対応分冊は、30 分経過時に `PO` が判断する。 | 変更なし。可用性要件 1 章の切替を、index と障害対応分冊の判断者・時機への参照に置き換える案。即時切替を必須要件とするなら、index・分冊・手順全体の改訂が必要になる。 | `vp-qe-kata-conformance`。上位要件の意図を確定できないため、R2 が整えた対象内の判断者・時機を上書きしなかった。 | 要判断 | | R5-11 | R5 | 対象外の運用手順（障害対応）4.3 | 紙から転記した件数・金額の照合者が、index 6 章では `DEV`、手順 4.3 の手順 5 では `OPS` になっている。 | 変更なし。障害対応手順 4.3 の照合実施者を `DEV` に揃え、差異対応の役割も整える案。`OPS` による障害記録への結果記載は維持する。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`。 | - |
