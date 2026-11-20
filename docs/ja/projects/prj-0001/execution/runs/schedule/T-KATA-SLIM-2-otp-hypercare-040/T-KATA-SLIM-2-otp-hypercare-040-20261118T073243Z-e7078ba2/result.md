---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-otp-hypercare-040-20261118t073243z-e7078ba2
  type: exec-result
  task_id: T-KATA-SLIM-2-otp-hypercare-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-otp-hypercare-040/T-KATA-SLIM-2-otp-hypercare-040-20261118T073243Z-e7078ba2/plan.md
  started_at: "2026-11-18T07:32:51.547Z"
  completed_at: "2026-11-18T08:00:38.505Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:otp-hypercare
    - specdojo:otp-rulebook
---

# Edit Result

## 1. 実施内容

- `otp-rulebook` から共通の運用の記述（Frontmatter の値制約の繰り返し、全体方針の本文構成の言い直し、各節の見出し指定の繰り返し、関連ドキュメント必須の重複、禁止事項の重複行）を外した。
- 全体方針に「共通の運用」を 1 項目だけ置き、`document-metadata-standard` を参照する形にした。
- F001（`vp-arc-conciseness`、「otp-index への導線を必ず記載する」の重複行）は、重複する行を削除して解消した。
- 章名・順序・必須/条件付きの区分は、既存の成果物との対応を保つため変えていない。
- 大きさは、空白（改行を含む）と表の区切り行を除いて 3,987 字から 3,161 字（79.3%）になり、目安の 8 割以下を満たす。
- 変更したのは rulebook だけで、成果物本体、recipe、template、sample は変更していない。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/otp-rulebook.md`: 共通の運用に当たる記述と重複する禁止事項・見出し指定・関連ドキュメント必須の重複行を削除し、全体方針に「共通の運用」の参照項目を 1 つ追加した。F001 の重複行も削除した。差分は 11 行追加、61 行削除。

## 3. 申し送り

- sample の変更案: `otp-sample` の見出し「## 11. 関連ドキュメント（必須）」を、rulebook の本文構成に合わせて「## 11. 関連ドキュメント」にする。この段では sample が commit の対象外のため変更していない。
- 共通の正本の変更案: なし。`otp-rulebook` には役割の表・承認の手順・文書品質の検査・未決事項の管理台帳の列がもともとなく、外した Frontmatter の値制約は `document-metadata-standard` と schema で賄える。
- result の『進め方と実践の型の適用』に書く事項: F001（vp-arc-conciseness、『otp-index への導線を必ず記載する』の重複行）は、6.11 節の重複行を消して解消した。根拠とした文書は pjr-8s4t の『他の型へ広げるときの一覧』、sld-rulebook、document-metadata-standard。章名・順序・必須区分は既存の成果物との対応を保つため変えていない。
- result の大きさの記録: 空白（改行を含む）と表の区切り行を除いて数え、変更前 3,987 字、変更後 3,161 字（79.3%）。
- sample の変更案: otp-sample の見出し『## 11. 関連ドキュメント（必須）』を rulebook の本文構成に合わせて『## 11. 関連ドキュメント』にする（この段では sample は commit の対象外のため変更していない）。
- 共通の正本の変更案: なし。otp-rulebook には役割の表・承認の手順・文書品質の検査・未決事項の管理台帳の列がもともとなく、外した Frontmatter の値制約は document-metadata-standard と schema で賄える。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/rulebooks/otp-rulebook.md だけで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ にとどまり、docs/ja/projects/ の成果物を変更していないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T07:35:46.506Z に再開

## 4. 進め方と実践の型の適用

根拠としたのは、`pjr-8s4t` の「他の型へ広げるときの一覧」、改訂済みの `sld-rulebook`、`document-metadata-standard`、および plan に展開された F001 である。F001 は、6.11 節にある「otp-index への導線を必ず記載する」の重複行を削除して解消した。残した記述は、この型固有の判断基準と区分、標準の列と章の受入条件、型固有の禁止事項である。章名・順序・必須区分は既存の成果物との対応を保つため変えていない。確認として、runner の `lint:fm`・`lint:md`・`validate:schema` と executor の prettier 検査が通過し、F001 は未解消のものがない。
